import PropTypes from "prop-types";

// Import the content components for each section
import AdminDashboardOverview from "./AdminDashboardOverview";
import UserList from "../UserList";
// import AdminProductsManagement from "./AdminProductsManagement";
// import AdminDummyItemsManagement from "./AdminDummyItemsManagement";

const AdminContentDisplay = ({ activeSection, dashboardStats }) => {
  const renderContent = () => {
    switch (activeSection) {
      case "dashboard":
        return <AdminDashboardOverview stats={dashboardStats} />;
      case "users":
        return <UserList />;
      case "products":
        return (
          <div className="p-4 bg-white rounded shadow">
            <h2 className="text-2xl font-bold text-shark mb-4">Product Management</h2>
            <p className="text-sharkDark-400">
              This section will contain product management features.
            </p>
          </div>
        );
      case "dummyitems":
        return (
          <div className="p-4 bg-white rounded shadow">
            <h2 className="text-2xl font-bold text-shark mb-4">Dummy Items Management</h2>
            <p className="text-sharkDark-400">
              This section will contain dummy item management features.
            </p>
          </div>
        );
      default:
        return (
          <div className="p-4 bg-white rounded shadow">
            <h2 className="text-2xl font-bold text-shark mb-4">Welcome to Admin Dashboard</h2>
            <p className="text-sharkDark-400">
              Select an option from the sidebar to manage your data.
            </p>
          </div>
        );
    }
  };

  return <div className="admin-content">{renderContent()}</div>;
};

AdminContentDisplay.propTypes = {
  activeSection: PropTypes.string.isRequired,
  dashboardStats: PropTypes.object.isRequired, // Expecting the stats object
};

export default AdminContentDisplay;
