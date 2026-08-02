import { lazy, Suspense } from "react";
import { Routes, Route, Navigate } from "react-router-dom";
import { ROUTES } from "../utils/constants.js";
import ProtectedRoute from "./ProtectedRoute.jsx";
import Spinner from "../components/ui/Spinner.jsx";
import PublicLayout from "../components/layout/PublicLayout.jsx";
import AppLayout from "../components/layout/AppLayout.jsx";
import FocusLayout from "../components/layout/FocusLayout.jsx";

const HomePage = lazy(() => import("../pages/HomePage.jsx"));
const LoginPage = lazy(() => import("../pages/LoginPage.jsx"));
const RegisterPage = lazy(() => import("../pages/RegisterPage.jsx"));
const DashboardPage = lazy(() => import("../pages/DashboardPage.jsx"));
const ProfilePage = lazy(() => import("../pages/ProfilePage.jsx"));
const InterviewSetupPage = lazy(
  () => import("../pages/InterviewSetupPage.jsx"),
);
const InterviewSessionPage = lazy(
  () => import("../pages/InterviewSessionPage.jsx"),
);
const InterviewResultPage = lazy(
  () => import("../pages/InterviewResultPage.jsx"),
);
const InterviewHistoryPage = lazy(
  () => import("../pages/InterviewHistoryPage.jsx"),
);

// Placeholders — replaced in future phases
const PlaceholderPage = ({ title }) => (
  <div className="flex items-center justify-center min-h-[60vh]">
    <div className="text-center">
      <p
        className="text-2xl font-bold mb-2"
        style={{ color: "var(--color-text-primary)" }}
      >
        {title}
      </p>
      <p className="text-sm" style={{ color: "var(--color-text-muted)" }}>
        Coming soon
      </p>
    </div>
  </div>
);

const PageLoader = () => (
  <div
    className="min-h-screen flex items-center justify-center"
    style={{ backgroundColor: "var(--color-bg)" }}
  >
    <Spinner size="lg" />
  </div>
);

const AppRoutes = () => {
  return (
    <Suspense fallback={<PageLoader />}>
      <Routes>
        {/* ── Public routes (with Navbar) ── */}
        <Route element={<PublicLayout />}>
          <Route path={ROUTES.HOME} element={<HomePage />} />
          <Route path={ROUTES.LOGIN} element={<LoginPage />} />
          <Route path={ROUTES.REGISTER} element={<RegisterPage />} />
        </Route>

        {/* ── Dashboard routes (with Sidebar) ── */}
        <Route
          element={
            <ProtectedRoute>
              <AppLayout />
            </ProtectedRoute>
          }
        >
          <Route path={ROUTES.DASHBOARD} element={<DashboardPage />} />
          <Route path={ROUTES.PROFILE} element={<ProfilePage />} />
          <Route
            path="/dashboard/interview/history"
            element={<InterviewHistoryPage />}
          />

          {/* Billing — Phase 6 */}
          <Route
            path={ROUTES.BILLING}
            element={<PlaceholderPage title="Billing — Phase 6" />}
          />
        </Route>

        {/* ── Focus routes (no Sidebar) ── */}
        <Route
          element={
            <ProtectedRoute>
              <FocusLayout />
            </ProtectedRoute>
          }
        >
          {/* Interview */}
          <Route path={ROUTES.INTERVIEW} element={<InterviewSetupPage />} />
          <Route
            path="/dashboard/interview/:id/session"
            element={<InterviewSessionPage />}
          />
          <Route
            path="/dashboard/interview/:id/result"
            element={<InterviewResultPage />}
          />

          {/* ATS Analyzer — Phase 4 */}
          <Route
            path={ROUTES.ATS}
            element={<PlaceholderPage title="ATS Analyzer — Phase 4" />}
          />

          {/* Programming — Phase 5 */}
          <Route
            path={ROUTES.PROGRAMMING}
            element={<PlaceholderPage title="Coding Practice — Phase 5" />}
          />
        </Route>

        {/* Fallback */}
        <Route path="*" element={<Navigate to={ROUTES.HOME} replace />} />
      </Routes>
    </Suspense>
  );
};

export default AppRoutes;
