import axiosInstance from "./axiosInstance";

export const getPaymentPlans = () => axiosInstance.get("/payments/plans");

export const createPaymentOrder = (billingCycle) => 
    axiosInstance.post("/payments/create-order", { billingCycle });

export const verifyPayment = (paymentData) => 
    axiosInstance.post("/payments/verify", paymentData);

export const reconcilePayment = (orderId) => 
    axiosInstance.post("/payments/reconcile", { orderId });

export const getPaymentHistory = (page = 1) =>
    axiosInstance.get("/payments/history", { params: { page } });
