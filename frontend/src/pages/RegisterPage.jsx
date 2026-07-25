import { useEffect } from "react";
import { useSelector } from "react-redux";
import RegisterForm from "../features/auth/RegisterForm.jsx";
import { ROUTES } from "../utils/constants.js";
import { useNavigate } from "react-router-dom";

const RegisterPage = () => {
  const navigate = useNavigate();
  const isAuthenticated = useSelector((state) => state.auth.isAuthenticated);

  useEffect(() => {
    if (isAuthenticated) navigate(ROUTES.DASHBOARD, { replace: true });
  }, [isAuthenticated, navigate]);

  return (
    <div
      className="min-h-screen flex items-center justify-center px-4"
      style={{ backgroundColor: "var(--color-bg)" }}
    >
      <div className="w-full max-w-md">
        {/* Brand */}
        <div className="text-center mb-8">
          <h1 className="text-3xl font-bold text-gradient">AceInterviewAI</h1>
          <p
            className="mt-2 text-sm"
            style={{ color: "var(--color-text-secondary)" }}
          >
            Practice interviews powered by AI
          </p>
        </div>

        {/* Card */}
        <div className="surface-card p-8">
          <div className="mb-6">
            <h2
              className="text-xl font-semibold"
              style={{ color: "var(--color-text-primary)" }}
            >
              Create your account
            </h2>
            <p
              className="text-sm mt-1"
              style={{ color: "var(--color-text-secondary)" }}
            >
              Join thousands of candidates acing their interviews
            </p>
          </div>

          <RegisterForm />
        </div>
      </div>
    </div>
  );
};

export default RegisterPage;
