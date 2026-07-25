import useAuth from "../hooks/useAuth.js";
import Button from "../components/ui/Button.jsx";

const DashboardPage = () => {
  const { user, logout } = useAuth();

  return (
    <div
      className="min-h-screen flex items-center justify-center"
      style={{ backgroundColor: "var(--color-bg)" }}
    >
      <div className="text-center flex flex-col items-center gap-4">
        <h1 className="text-3xl font-bold text-gradient">
          Welcome, {user?.name} 👋
        </h1>
        <p style={{ color: "var(--color-text-secondary)" }}>
          Dashboard coming in Phase 7
        </p>
        <Button variant="secondary" onClick={logout}>
          Logout
        </Button>
      </div>
    </div>
  );
};

export default DashboardPage;
