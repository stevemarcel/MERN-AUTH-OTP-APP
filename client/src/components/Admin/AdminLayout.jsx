import PropTypes from "prop-types";
import { Outlet } from "react-router-dom";
import AdminSidebar from "./AdminSidebar";

const AdminLayout = ({
  activeSection,
  setActiveSection,
  isMobileSidebarOpen,
  toggleMobileSidebar,
}) => {
  return (
    <div className="flex min-h-[calc(100vh-theme(spacing.20))] bg-sharkLight-100/30">
      {/* Admin Sidebar */}
      <AdminSidebar
        activeSection={activeSection}
        setActiveSection={setActiveSection}
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

AdminLayout.propTypes = {
  activeSection: PropTypes.string.isRequired,
  setActiveSection: PropTypes.func.isRequired,
  isMobileSidebarOpen: PropTypes.bool.isRequired,
  toggleMobileSidebar: PropTypes.func.isRequired,
};

export default AdminLayout;
