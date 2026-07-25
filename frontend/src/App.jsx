import { useEffect } from "react";
import { useDispatch } from "react-redux";
import { Toaster } from "react-hot-toast";
import { getMe } from "./api/authApi.js";
import { setUser, clearUser, setAuthLoading } from "./redux/slices/authSlice.js";
import AppRoutes from "./routes/AppRoutes.jsx";

const App = () => {
  const dispatch = useDispatch();

  // Rehydrate auth state on every app load
  useEffect(() => {
    const initAuth = async () => {
      dispatch(setAuthLoading(true));
      try {
        const res = await getMe();
        dispatch(setUser(res.data.data.user));
      } catch {
        dispatch(clearUser());
      }
    };

    initAuth();
  }, [dispatch]);

  return (
    <>
      <AppRoutes />
      <Toaster
        position="top-right"
        toastOptions={{
          duration: 4000,
          style: {
            background: "var(--color-surface)",
            color: "var(--color-text-primary)",
            border: "1px solid var(--color-border)",
            borderRadius: "0.5rem",
            fontSize: "0.875rem",
          },
          success: {
            iconTheme: {
              primary: "#22C55E",
              secondary: "#fff",
            },
          },
          error: {
            iconTheme: {
              primary: "#EF4444",
              secondary: "#fff",
            },
          },
        }}
      />
    </>
  );
};

export default App;
