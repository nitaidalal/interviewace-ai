import { Outlet } from "react-router-dom";
import PublicNavbar from "./PublicNavbar.jsx";

const PublicLayout = () => {
  return (
    <div style={{ backgroundColor: "var(--color-bg)" }}>
      <PublicNavbar />
      <main>
        <Outlet />
      </main>
    </div>
  );
};

export default PublicLayout;