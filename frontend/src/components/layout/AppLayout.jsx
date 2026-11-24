import { Outlet } from "react-router-dom";
import Sidebar from "./Sidebar.jsx";
import { useEffect, useState } from "react";

const AppLayout = () => {
  const [collapsed, setCollapsed] = useState(false);
  const [compact, setCompact] = useState(() => window.matchMedia("(max-width: 767px)").matches);

  useEffect(() => {
    const query = window.matchMedia("(max-width: 767px)");
    const onChange = (event) => setCompact(event.matches);
    query.addEventListener("change", onChange);
    return () => query.removeEventListener("change", onChange);
  }, []);

  const sidebarCollapsed = compact || collapsed;

  return (
    <div
      className="flex min-h-screen"
      style={{ backgroundColor: "var(--color-bg)" }}
    >
      <Sidebar collapsed={sidebarCollapsed} setCollapsed={setCollapsed} compact={compact} />
      <main
        className="flex-1 min-w-0 transition-all duration-300 min-h-screen"
        style={{
          marginLeft: sidebarCollapsed ? "72px" : "240px",
        }}
      >
        <div className="p-4 sm:p-6 max-w-6xl mx-auto">
          <Outlet />
        </div>
      </main>
    </div>
  );
};

export default AppLayout;
