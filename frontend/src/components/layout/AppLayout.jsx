import { Outlet } from "react-router-dom";
import Sidebar from "./Sidebar.jsx";
import { useState } from "react";

const AppLayout = () => {
  const [collapsed, setCollapsed] = useState(false);

  return (
    <div
      className="flex min-h-screen"
      style={{ backgroundColor: "var(--color-bg)" }}
    >
      <Sidebar collapsed={collapsed} setCollapsed={setCollapsed} />
      <main
        className="flex-1 transition-all duration-300 min-h-screen"
        style={{
          marginLeft: collapsed ? "72px" : "240px",
        }}
      >
        <div className="p-6 max-w-6xl mx-auto">
          <Outlet />
        </div>
      </main>
    </div>
  );
};

export default AppLayout;
