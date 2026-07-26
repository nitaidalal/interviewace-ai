import { lazy, Suspense } from "react";
import { Routes, Route, Navigate } from "react-router-dom";
import { ROUTES } from "../utils/constants.js";
import ProtectedRoute from "./ProtectedRoute.jsx";
import Spinner from "../components/ui/Spinner.jsx";
import PublicLayout from "../components/layout/PublicLayout.jsx";
import AppLayout from "../components/layout/AppLayout.jsx";


const HomePage = lazy(() => import("../pages/HomePage.jsx"));
const LoginPage = lazy(() => import("../pages/LoginPage.jsx"));
const RegisterPage = lazy(() => import("../pages/RegisterPage.jsx"));
const DashboardPage = lazy(() => import("../pages/DashboardPage.jsx"));
const ProfilePage = lazy(() => import("../pages/ProfilePage.jsx"));

// Placeholders for future phases
const PlaceholderPage = ({ title }) => (
  <div className="flex items-center justify-center min-h-[60vh]">
    <div className="text-center">
      <p className="text-2xl font-bold mb-2" style={{ color: 'var(--color-text-primary)' }}>
        {title}
      </p>
      <p className="text-sm" style={{ color: 'var(--color-text-muted)' }}>
        Coming soon
      </p>
    </div>
  </div>
)

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
        {/* Public home route with Navbar */}
        <Route element={<PublicLayout />}>
          <Route path={ROUTES.HOME} element={<HomePage />} />
        </Route>

        <Route path={ROUTES.LOGIN} element={<LoginPage />} />
        <Route path={ROUTES.REGISTER} element={<RegisterPage />} />

        {/* Protected dashboard routes with Sidebar */}
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
            path={ROUTES.INTERVIEW}
            element={<PlaceholderPage title="AI Interview — Phase 3" />}
          />
          <Route
            path={ROUTES.ATS}
            element={<PlaceholderPage title="ATS Analyzer — Phase 4" />}
          />
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
