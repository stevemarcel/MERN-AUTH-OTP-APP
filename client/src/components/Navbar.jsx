import { useState, useEffect } from "react";
import { Link, NavLink, useNavigate } from "react-router-dom";
import {
  FaUser,
  FaUserLock,
  FaSignOutAlt,
  FaUserPlus,
  FaSignInAlt,
  FaBell,
  FaBars,
  FaTimes,
  FaCaretDown,
} from "react-icons/fa";
import { useSelector, useDispatch } from "react-redux";
import { useLogoutMutation } from "../slices/usersApiSlice";
import { deleteCredentials } from "../slices/authSlice";

const BACKEND_BASE_URL = "http://localhost:5000";

const Navbar = () => {
  const [mobileNavOpen, setMobileNavOpen] = useState(false); // State to manage the navbar's visibility
  const [showDropdown, setShowDropdown] = useState(false); // Dropdown visibility state

  //Get user
  const { userInfo } = useSelector((state) => state.auth);

  // Array containing navigation items
  const navItems = [
    { id: 1, text: "Home", link: "/" },
    { id: 2, text: "Features", link: "/features" },
    { id: 3, text: "About", link: "/about" },
    { id: 4, text: "Contact", link: "/contact" },
  ];

  // Array containing get started items when not logged in
  const getStartedItems = [
    { id: 1, type: "Auth", text: "Register", link: "/register", icon: <FaUserPlus /> },
    { id: 2, type: "Auth", text: "Login", link: "/login", icon: <FaSignInAlt /> },
  ];

  // Array containing profile items when logged in
  const profileItems = [
    { id: 1, text: "Profile", link: "/profile", icon: <FaUser /> },
    { id: 2, text: "Notifications", link: "/notification", icon: <FaBell /> },
    { id: 3, text: "Admin Page", link: "/admin", icon: <FaUserLock /> },
    { id: 4, text: "Logout", icon: <FaSignOutAlt /> },
  ];

  // Toggle function to handle the dropdown display
  const toggleDropdown = () => {
    setShowDropdown(!showDropdown);
  };

  // Toggle function to handle the navbar's display
  const handleMobileNavOpen = () => {
    setMobileNavOpen(!mobileNavOpen);
  };

  // Choose Account menu items depending on if user is logged in or not
  const getDropdownItems = () => {
    return userInfo ? profileItems : getStartedItems;
  };

  // Close dropdown on outside click
  useEffect(() => {
    // Add event listener on component mount
    const handleClickOutside = (event) => {
      if (!event.target.closest(".rightNavButton")) {
        // Check if clicked outside the button
        setShowDropdown(false);
      }
    };

    document.addEventListener("click", handleClickOutside);

    // Cleanup function to remove listener on unmount
    return () => document.removeEventListener("click", handleClickOutside);
  }, []);

  const navigate = useNavigate();
  const dispatch = useDispatch();

  const [logoutApiCall] = useLogoutMutation();

  const logoutHandler = async () => {
    try {
      await logoutApiCall().unwrap();
      dispatch(deleteCredentials());
      navigate("/login");
    } catch (err) {
      console.log(err);
    }
  };

  const dropdownList = getDropdownItems().map((item) => {
    // Determine if the item should be hidden
    const isHidden = userInfo && item.text === "Admin Page" && !userInfo.isAdmin;
    return (
      <Link
        to={item.link}
        key={item.id}
        onClick={
          userInfo && item.text === "Logout"
            ? logoutHandler
            : mobileNavOpen
            ? handleMobileNavOpen
            : null
        }
      >
        <li
          className={`hover:bg-sharkLight-100 px-4 py-2 text-shark flex items-center ${
            isHidden ? "hidden" : ""
          }`}
        >
          <div className="flex items-center text-left">
            <div>{item.icon}</div>
            <div className=" ml-2">{item.text}</div>
          </div>
        </li>
      </Link>
    );
  });

  return (
    <div className="bg-sharkLight-100 text-shark sticky top-0 z-50">
      <nav className="md:w-[90%] mx-auto p-4 flex justify-between items-center">
        {/* Logo */}
        <div className="logo">
          <Link to="/" className="text-xl font-bold cursor-pointer">
            MERN-AUTH-OTP
          </Link>
        </div>

        {/* Nav bar items */}
        <ul className="md:flex hidden gap-x-4">
          {navItems.map((navItem) => (
            <li key={navItem.id}>
              <NavLink
                to={navItem.link}
                className={({ isActive }) => {
                  return isActive
                    ? "font-bold hover:text-sharkDark-300 underline underline-offset-4"
                    : "hover:text-sharkLight-300 p-4 rounded-sm duration-200";
                }}
              >
                {navItem.text}
              </NavLink>
            </li>
          ))}
        </ul>

        {/* Right Button */}
        <div className="flex items-center">
          <button
            className="rightNavButton md:flex hidden items-center px-4 py-2 bg-shark text-light hover:bg-sharkDark-100 focus:outline-none relative rounded duration-200"
            onClick={() => {
              toggleDropdown(); // Toggle dropdown on button click
            }}
          >
            {userInfo ? (
              <div className="flex items-center">
                <img
                  src={userInfo ? `${BACKEND_BASE_URL}${userInfo.profile}` : ""}
                  alt="Profile Picture"
                  className="w-6 h-6 mr-2 rounded-full"
                />
                <span>{userInfo.firstName}</span>
              </div>
            ) : (
              "Get Started"
            )}

            <FaCaretDown
              className={`md:ml-2 ml-1 transform transition-transform duration-200 ${
                showDropdown ? "rotate-180" : "rotate-0"
              }`}
            />

            {showDropdown && (
              // Render dropdown only if visible
              <ul
                role="listbox"
                className="absolute top-full right-0 bg-light shadow-md rounded-md w-auto overflow-hidden mt-2 duration-200"
              >
                {dropdownList}
              </ul>
            )}
          </button>

          {/* Additional right buttons only on small screens */}
          <div className="md:hidden text-3xl cursor-pointer">
            {/* User icon button only when user logged in on small screens */}
            {userInfo ? (
              <button
                className="rightNavButton relative rounded-full"
                onClick={() => {
                  toggleDropdown(); // Toggle dropdown on button click
                }}
              >
                <div className="flex items-center">
                  <img
                    src={userInfo ? `${BACKEND_BASE_URL}${userInfo.profile}` : ""}
                    alt="Profile Picture"
                    className="w-8 h-8 rounded-full"
                  />
                </div>
                {showDropdown && (
                  // Render dropdown only if visible
                  <ul className="absolute text-base top-full right-0 bg-light shadow-md rounded-md w-auto overflow-hidden mt-2  duration-200">
                    {dropdownList}
                  </ul>
                )}
              </button>
            ) : (
              ""
            )}

            {/* Mobile Hamburger Nav */}
            <button className="ml-5" onClick={handleMobileNavOpen}>
              {mobileNavOpen ? <FaTimes /> : <FaBars />}
            </button>
          </div>
        </div>
      </nav>

      {/* Mobile Nav */}
      <div
        className={
          mobileNavOpen
            ? "fixed h-[200%] w-screen md:hidden bg-sharkDark-300/50 backdrop-blur-sm top-16 left-0 transition-all duration-500 ease-in"
            : "absolute top-[-490px]"
        }
        onClick={handleMobileNavOpen}
      >
        <div className={mobileNavOpen ? "text-shark bg-light/85 transition-all" : ""}>
          <ul className="mx-auto flex flex-col p-4">
            {userInfo ? (
              ""
            ) : (
              <li className="flex items-center my-2 cursor-pointer justify-end">
                <button
                  className=" flex md:hidden items-center justify-center px-6 py-3 bg-shark text-light hover:bg-sharkDark-100 focus:outline-none relative rounded"
                  onClick={(e) => {
                    toggleDropdown(); // Toggle dropdown on button click
                    e.stopPropagation(); // Prevent event bubbling
                  }}
                >
                  Get Started
                  <div className="ml-2">
                    <FaCaretDown />
                  </div>
                  {showDropdown && (
                    // Render dropdown only if visible
                    <ul className="absolute top-full right-0 bg-light shadow-md rounded-md w-auto overflow-hidden mt-2">
                      {dropdownList}
                    </ul>
                  )}
                </button>
              </li>
            )}
            {navItems.map((navItem) => (
              <NavLink
                to={navItem.link}
                key={navItem.id}
                className={({ isActive }) => {
                  return isActive
                    ? "bg-sharkLight-200/50 border-l-4 border-shark p-4 mb-2 "
                    : "p-4 mb-2 cursor-pointer hover:bg-sharkLight-200/50 duration-200";
                }}
              >
                <li>{navItem.text}</li>
              </NavLink>
            ))}
          </ul>
        </div>
      </div>
    </div>
  );
};

export default Navbar;
