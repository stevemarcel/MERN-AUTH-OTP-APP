import { useState } from "react";
import { Link } from "react-router-dom";
import {
  FaUser,
  FaLock,
  FaSignOutAlt,
  FaUserPlus,
  FaSignInAlt,
  FaBell,
  FaBars,
  FaTimes,
} from "react-icons/fa";

const Navbar = () => {
  // State to manage the navbar's visibility
  const [mobileNavOpen, setMobileNavOpen] = useState(false);
  const [isLoggedIn, setIsLoggedIn] = useState(false); // Track login state
  const [username, setUsername] = useState(""); // Username for logged in state
  const [showDropdown, setShowDropdown] = useState(false); // Dropdown visibility state

  // Placeholder profile picture
  const profileImage = "https://avatar.iran.liara.run/public/boy?username=Ash";

  // Array containing navigation items when not logged in
  const navItems = [
    { id: 1, text: "Home", link: "/" },
    { id: 2, text: "Services", link: "/services" },
    { id: 3, text: "About", link: "/about" },
    { id: 4, text: "Contact", link: "/contact" },
  ];

  // Array containing get started items when not logged in
  const getStartedItems = [
    { id: 1, text: "Register", link: "/register", icon: <FaUserPlus /> },
    { id: 2, text: "Login", link: "/login", icon: <FaSignInAlt /> },
  ];

  // Array containing profile items when logged in
  const profileItems = [
    { id: 1, text: "Profile", link: "/profile", icon: <FaUser /> },
    { id: 2, text: "Notifications", link: "/notification", icon: <FaBell /> },
    { id: 3, text: "Admin", link: "/admin", icon: <FaLock /> },
    { id: 4, text: "Logout", link: "/logout", icon: <FaSignOutAlt /> },
  ];

  const handleLogin = (name) => {
    setIsLoggedIn(true);
    setUsername(name); // Set username on login
  };

  const handleLogout = () => {
    setIsLoggedIn(false);
    setUsername(""); // Clear username on logout
  };

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
    return isLoggedIn ? profileItems : getStartedItems;
  };

  const dropdownList = getDropdownItems().map((item) => (
    <li key={item.id} className="hover:bg-sharkLight-100 px-4 py-2 text-black flex items-center">
      {item.icon}
      <Link
        to={item.link}
        className="block text-left ml-2"
        onClick={mobileNavOpen || !isLoggedIn ? handleMobileNavOpen : ""}
      >
        {item.text}
      </Link>
    </li>
  ));

  return (
    <div className=" bg-sharkLight-100 text-shark sticky top-0">
      <nav className="mx-auto p-4 flex justify-between items-center">
        {/* Logo */}
        <div className="logo">
          <Link to="/" className="text-xl font-bold cursor-pointer">
            MERN-AUTH-OTP
          </Link>
        </div>

        {/* Nav bar items */}
        <ul className="md:flex hidden">
          {navItems.map((navItem) => (
            <li key={navItem.id}>
              <Link to={navItem.link} className="hover:text-sharkLight-300 p-4 rounded-sm">
                {navItem.text}
              </Link>
            </li>
          ))}
        </ul>

        {/* For Testing */}
        <div className="handleLogs flex mr-4">
          <button
            className="flex items-center px-4 py-2 bg-gray-700 text-light hover:bg-gray-600"
            onClick={() => {
              handleLogin("Steve");
            }}
          >
            login
          </button>
          <button
            className="flex items-center px-4 py-2 bg-gray-700 text-light hover:bg-gray-600"
            onClick={() => {
              handleLogout();
            }}
          >
            logout
          </button>
        </div>

        {/* Right Button */}
        <div className="flex items-center">
          <button
            className="md:flex hidden items-center px-4 py-2 bg-shark text-light hover:bg-sharkDark-100 focus:outline-none relative rounded"
            onClick={() => {
              toggleDropdown(); // Toggle dropdown on button click
            }}
          >
            {isLoggedIn ? (
              <div className="flex items-center">
                <img
                  src={profileImage}
                  alt="Profile Picture"
                  className="w-6 h-6 mr-2 rounded-full"
                />
                <span>{username}</span>
              </div>
            ) : (
              "Get Started"
            )}
            {showDropdown && (
              // Render dropdown only if visible
              <ul className="absolute top-full right-0 bg-light shadow-md rounded-md w-auto overflow-hidden mt-2">
                {dropdownList}
              </ul>
            )}
          </button>

          {/* Additional right buttons only on small screens */}
          <div className="md:hidden text-3xl cursor-pointer">
            {/* User icon button only when user logged in on small screens */}
            {isLoggedIn ? (
              <button
                className="relative rounded-full"
                onClick={() => {
                  toggleDropdown(); // Toggle dropdown on button click
                }}
              >
                <div className="flex items-center">
                  <img src={profileImage} alt="Profile Picture" className="w-8 h-8" />
                </div>
                {showDropdown && (
                  // Render dropdown only if visible
                  <ul className="absolute text-base top-full right-0 bg-light shadow-md rounded-md w-auto overflow-hidden mt-2">
                    {dropdownList}
                  </ul>
                )}
              </button>
            ) : (
              ""
            )}

            {/* Mobile Hamburger Nav */}
            <button className="ml-5 " onClick={handleMobileNavOpen}>
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
        <div className={mobileNavOpen ? "text-shark bg-sharkLight-100/70 transition-all" : ""}>
          <ul className="mx-auto flex flex-col p-4">
            {isLoggedIn ? (
              ""
            ) : (
              <li className="flex items-center p-4 mb-2 cursor-pointer ">
                <button
                  className="flex md:hidden items-center px-4 py-2 bg-shark text-light hover:bg-sharkDark-100 focus:outline-none relative rounded w-full"
                  onClick={(e) => {
                    toggleDropdown(); // Toggle dropdown on button click
                    e.stopPropagation(); // Prevent event bubbling
                  }}
                >
                  Get Started
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
              <li
                key={navItem.id}
                className="p-4 hover:bg-shark hover:text-light rounded-md mb-2 cursor-pointer"
              >
                <Link to={navItem.link}>{navItem.text}</Link>
              </li>
            ))}
          </ul>
        </div>
      </div>
    </div>
  );
};

export default Navbar;
