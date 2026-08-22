import PropTypes from "prop-types";
import { NavLink } from "react-router-dom";
import { FaTachometerAlt, FaUsers, FaBox, FaCogs } from "react-icons/fa";

const AdminSidebar = ({ isMobileSidebarOpen, toggleMobileSidebar }) => {
  const sidebarItems = [
    {
      id: "dashboard",
      name: "Dashboard",
      icon: <FaTachometerAlt />,
      to: "/admin",
    },
    {
      id: "users",
      name: "Users",
      icon: <FaUsers />,
      to: "/admin/users",
    },
    {
      id: "products",
      name: "Products",
      icon: <FaBox />,
      to: "/admin/products",
    },
    {
      id: "dummyitems",
      name: "Dummy Items",
      icon: <FaCogs />,
      to: "/admin/dummyitems",
    },
  ];

  return (
    <>
      {/* Mobile navigation */}
      <div className="md:hidden bg-sharkLight-100 fixed z-35 w-full">
        <nav className="flex justify-between">
          <ul className="md:hidden flex gap-x-1 items-center">
            {sidebarItems.map((item) => (
              <li key={item.id} className="mb-2">
                <NavLink
                  to={item.to}
                  end={item.id === "dashboard"}
                  onClick={() => {
                    if (isMobileSidebarOpen) {
                      toggleMobileSidebar();
                    }
                  }}
                  className={({ isActive }) =>
                    `flex items-center w-full px-6 py-3 text-left text-lg transition duration-200
										${
                      isActive
                        ? "font-semibold border-t-4 border-shark bg-sharkLight-100/30 text-shark"
                        : "hover:bg-sharkDark-300 text-sharkLight-300"
                    }`
                  }
                >
                  <span className="mr-3">{item.icon}</span>
                  <span className="hidden sm:inline">{item.name}</span>
                </NavLink>
              </li>
            ))}
          </ul>
        </nav>
      </div>

      {/* Desktop / slide-out sidebar */}
      <div
        className={`fixed inset-y-0 left-0 w-64 bg-sharkDark-500 text-sharkLight-100 shadow-lg z-10
					transform transition-transform duration-300 ease-in-out
					md:relative md:translate-x-0 md:w-1/4 lg:w-1/5 xl:w-1/6 md:flex md:flex-col
					${isMobileSidebarOpen ? "translate-x-0" : "-translate-x-full"}`}
      >
        <aside className="sticky top-[80px] w-full">
          <div className="p-6 text-2xl font-bold border-b border-sharkDark-300">Admin Panel</div>

          <nav className="flex-1 py-4">
            <ul>
              {sidebarItems.map((item) => (
                <li key={item.id} className="mb-2">
                  <NavLink
                    to={item.to}
                    end={item.id === "dashboard"}
                    onClick={() => {
                      if (isMobileSidebarOpen) {
                        toggleMobileSidebar();
                      }
                    }}
                    className={({ isActive }) =>
                      `flex items-center w-full px-6 py-3 text-left text-lg rounded-md transition duration-200
											${isActive ? "bg-shark text-white font-semibold shadow-md" : "hover:bg-sharkDark-300"}`
                    }
                  >
                    <span className="mr-3">{item.icon}</span>
                    {item.name}
                  </NavLink>
                </li>
              ))}
            </ul>
          </nav>
        </aside>
      </div>
    </>
  );
};

AdminSidebar.propTypes = {
  isMobileSidebarOpen: PropTypes.bool.isRequired,
  toggleMobileSidebar: PropTypes.func.isRequired,
};

export default AdminSidebar;
