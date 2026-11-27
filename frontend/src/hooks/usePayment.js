import { useState, useEffect, useCallback, useRef } from "react";

import { useDispatch, useSelector } from "react-redux";
import toast from "react-hot-toast";

import {
  getPaymentPlans,
  createPaymentOrder,
  verifyPayment,
  reconcilePayment,
  getPaymentHistory,
} from "../api/paymentApi.js";

import { getProfile, getCredits } from "../api/userApi.js";

import { setUser } from "../redux/slices/authSlice.js";

import { parseApiError } from "../utils/errorParser.js";

import loadRazorpay from "../utils/loadRazorpay.js";

const usePayment = () => {
  const dispatch = useDispatch();

  const user = useSelector((state) => state.auth.user);

  const [plans, setPlans] = useState([]);
  const [payments, setPayments] = useState([]);
  const [credits, setCredits] = useState(null);

  const [loading, setLoading] = useState(true);
  const [busy, setBusy] = useState(false);
  const [activeCycle, setActiveCycle] = useState(null);
  const [checkingOrderId, setCheckingOrderId] = useState(null);

  // Prevent simultaneous payment attempts in this UI
  const paymentLockRef = useRef(false);

  // ─── Fetch billing data ──────────────────────────

  const refreshBilling = useCallback(async () => {
    // Existing endpoint refreshes subscription expiry
    // and daily credit usage when necessary.
    const creditsResponse = await getCredits();

    setCredits(creditsResponse.data.data.credits);

    const [profileResponse, historyResponse] = await Promise.all([
      getProfile(),
      getPaymentHistory(),
    ]);

    const latestUser = profileResponse.data.data.user;

    // Update Redux so Sidebar and other pages reflect Pro
    dispatch(setUser(latestUser));

    setPayments(historyResponse.data.data.payments);
  }, [dispatch]);

  const fetchBilling = useCallback(async () => {
    setLoading(true);

    try {
      const [plansResponse] = await Promise.all([
        getPaymentPlans(),
        refreshBilling(),
      ]);

      setPlans(plansResponse.data.data.plans);
    } catch (error) {
      toast.error(parseApiError(error));
    } finally {
      setLoading(false);
    }
  }, [refreshBilling]);

  useEffect(() => {
    fetchBilling();
  }, [fetchBilling]);

  // ─── Release payment lock ────────────────────────

  const releasePaymentLock = () => {
    paymentLockRef.current = false;
    setBusy(false);
    setActiveCycle(null);
    setCheckingOrderId(null);
  };

  // ─── Start Razorpay Checkout ─────────────────────

  const purchasePlan = async (billingCycle) => {
    if (paymentLockRef.current) return;

    paymentLockRef.current = true;

    setBusy(true);
    setActiveCycle(billingCycle);

    try {
      const sdkLoaded = await loadRazorpay();

      if (!sdkLoaded) {
        toast.error("Unable to load Razorpay Checkout. Please retry.");

        releasePaymentLock();
        return;
      }

      // Ask our backend to create a trusted order
      const response = await createPaymentOrder(billingCycle);

      const order = response.data.data;

      let verifying = false;
      let checkoutClosed = false;

      const options = {
        key: order.keyId,

        amount: order.amount,

        currency: order.currency,

        name: "InterviewAce-AI",

        description: order.planName,

        order_id: order.orderId,

        prefill: {
          name: user?.name || "",
          email: user?.email || "",
        },

        theme: {
          color: "#f97316",
        },

        // Called after successful Checkout payment
        handler: async (paymentResponse) => {
          if (verifying) return;

          verifying = true;

          try {
            const result = await verifyPayment({
              razorpay_order_id: paymentResponse.razorpay_order_id,

              razorpay_payment_id: paymentResponse.razorpay_payment_id,

              razorpay_signature: paymentResponse.razorpay_signature,
            });

            const data = result.data.data;

            dispatch(setUser(data.user));
            setCredits(data.credits);

            toast.success(
              "Payment verified! Your Pro purchase has been applied.",
            );
          } catch (error) {
            // A verification/network failure does not
            // prove that the actual payment failed.
            toast.error(
              "Payment confirmation is pending. Check your payment status in Billing before paying again.",
            );
          } finally {
            try {
              await refreshBilling();
            } catch {
              toast.error(
                "Unable to refresh billing. Please refresh the page.",
              );
            }

            releasePaymentLock();
          }
        },

        // Called when the user closes Checkout
        modal: {
          ondismiss: async () => {
            if (verifying || checkoutClosed) return;

            checkoutClosed = true;

            toast(
              "Checkout closed. Check payment history for its latest status.",
            );

            try {
              await refreshBilling();
            } catch {
              // The history can be refreshed manually
            } finally {
              releasePaymentLock();
            }
          },
        },

        retry: {
          enabled: true,
        },
      };

      const checkout = new window.Razorpay(options);

      checkout.on("payment.failed", () => {
        toast.error("Payment attempt failed. You can retry inside Checkout.", {
          id: "razorpay-payment-failed",
        });

        // Do not unlock here because Checkout
        // may allow another payment attempt.
      });

      checkout.open();
    } catch (error) {
      toast.error(
        error.response
          ? parseApiError(error)
          : "Unable to start payment. Please retry.",
      );

      releasePaymentLock();

      // An order may already have been created
      try {
        await refreshBilling();
      } catch {
        // The user can refresh later
      }
    }
  };

  // ─── Recover a pending payment ───────────────────

  const checkPaymentStatus = async (orderId) => {
    if (paymentLockRef.current) return;

    paymentLockRef.current = true;

    setBusy(true);
    setCheckingOrderId(orderId);

    try {
      const response = await reconcilePayment(orderId);

      const result = response.data.data;

      if (result.pending) {
        toast(
          "No completed payment found for this order. If money was deducted, check again later before paying again.",
        );
      } else {
        dispatch(setUser(result.user));
        setCredits(result.credits);

        toast.success("Payment successfully confirmed");
      }

      await refreshBilling();
    } catch (error) {
      toast.error(parseApiError(error));
    } finally {
      releasePaymentLock();
    }
  };

  return {
    user,
    plans,
    payments,
    credits,
    loading,
    busy,
    activeCycle,
    checkingOrderId,
    purchasePlan,
    checkPaymentStatus,
    refreshBilling,
    fetchBilling,
  };
};

export default usePayment;
