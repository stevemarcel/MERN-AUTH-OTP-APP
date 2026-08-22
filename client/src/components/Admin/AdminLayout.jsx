import { useState } from "react";
import { Outlet } from "react-router-dom";
import AdminSidebar from "./AdminSidebar";

const AdminLayout = () => {
  const [isMobileSidebarOpen, setIsMobileSidebarOpen] = useState(false);

  const toggleMobileSidebar = () => {
    setIsMobileSidebarOpen((prev) => !prev);
  };

  return (
    <div className="flex min-h-[calc(100vh-theme(spacing.20))] bg-sharkLight-100/30">
      {/* Admin Sidebar */}
      <AdminSidebar
        isMobileSidebarOpen={isMobileSidebarOpen}
        toggleMobileSidebar={toggleMobileSidebar}
      />

      {/* Admin Page Content */}
      <main className="flex-1 p-6 md:p-8 mt-[60px] md:mt-0">
        <Outlet />
      </main>
    </div>
  );
};

export default AdminLayout;
