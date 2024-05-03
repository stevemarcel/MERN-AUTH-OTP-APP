import { useState } from "react";
import { Link } from "react-router-dom";
import { FaUser, FaLock, FaSignOutAlt, FaUserPlus, FaSignInAlt } from "react-icons/fa";
import { AiOutlineClose, AiOutlineMenu } from "react-icons/ai";

const Navbar = () => {
  // State to manage the navbar's visibility
  const [nav, setNav] = useState(false);
  const [isLoggedIn, setIsLoggedIn] = useState(false); // Track login state
  const [username, setUsername] = useState(""); // Username for logged in state
  const [showDropdown, setShowDropdown] = useState(false); // Dropdown visibility state

  // Placeholder profile picture
  const profileImage = "https://avatar.iran.liara.run/public/boy?username=Ash";

  // Array containing navigation items when not logged in
  const navItems = [
    { id: 1, text: "Home", link: "#" },
    { id: 2, text: "Services", link: "#" },
    { id: 3, text: "About", link: "#" },
    { id: 4, text: "Contact", link: "#" },
  ];

  // Array containing get started items when not logged in
  const getStartedItems = [
    { id: 1, text: "Register", link: "#", icon: <FaUserPlus /> },
    { id: 2, text: "Login", link: "#", icon: <FaSignInAlt /> },
  ];

  // Array containing profile items when logged in
  const profileItems = [
    { id: 1, text: "Profile", link: "#", icon: <FaUser /> },
    { id: 2, text: "Admin", link: "#", icon: <FaLock /> },
    { id: 3, text: "Logout", link: "#", icon: <FaSignOutAlt /> },
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
  const handleNav = () => {
    setNav(!nav);
  };

  // Choose Account menu items depending on if user is logged in or not
  const getDropdownItems = () => {
    return isLoggedIn ? profileItems : getStartedItems;
  };

  return (
    <div className=" bg-sharkLight-100 text-shark">
      <nav className="container mx-auto p-4 flex justify-between items-center ">
        {/* Logo */}
        <div className="logo">
          <Link to="/" className="text-xl font-bold cursor-pointer">
            MERN-AUTH-OTP
          </Link>
        </div>

        {/* Nav bar items */}
        <ul className="flex ">
          {navItems.map((navItem) => (
            <li key={navItem.id}>
              <Link
                to={navItem.link}
                className="hover:text-sharkLight-100 hover:bg-sharkLight-400 p-4 rounded-sm"
              >
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
            className="flex items-center px-4 py-2 bg-shark text-light hover:bg-sharkDark-100 focus:outline-none relative rounded"
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
                {/* <div className="absolute top-0 right-5 w-0 h-0 border-b-8 border-l-8 border-t-0 border-transparent border-b-white"></div>{" "} */}
                {/* Chat bubble tail */}
                {getDropdownItems().map((item) => (
                  <li
                    key={item.id}
                    className="hover:bg-sharkLight-100 px-4 py-2 text-black flex items-center"
                  >
                    {item.icon}
                    <Link to={item.link} className="block text-left ml-2">
                      {item.text}
                    </Link>
                  </li>
                ))}
              </ul>
            )}
          </button>
        </div>
      </nav>
    </div>
    // <div className="shadow-sm shadow-sharkLight-200/40">
    //   <nav className="container flex justify-between items-center h-24 mx-auto px-4 text-shark">
    //     <h1 className="w-full text-3xl font-bold">MERN-AUTH-OTP</h1>

    //     {/* Desktop Nav */}
    //     <ul className="hidden md:flex">
    //       {navItems.map((navItem) => (
    //         <li
    //           key={navItem.id}
    //           className="p-4 hover:bg-shark rounded-xl m-2 cursor-pointer duration-300 hover:text-sharkLight-100"
    //         >
    //           {navItem.text}
    //         </li>
    //       ))}
    //     </ul>

    //     {/* Mobile Nav Icon */}
    //     <div onClick={handleNav} className="block md:hidden">
    //       {nav ? <AiOutlineClose size={20} /> : <AiOutlineMenu size={20} />}
    //     </div>

    //     {/* Mobile Nav */}
    //     <ul
    //       className={
    //         nav
    //           ? "fixed md:hidden left-0 top-0 w-[60%] h-full border-r border-r-sharkLight-200/40 bg-sharkLight-100 ease-in-out duration-500"
    //           : "ease-in-out w-[60%] duration-500 fixed top-0 bottom-0 left-[-100%]"
    //       }
    //     >
    //       {navItems.map((navItem) => (
    //         <li
    //           key={navItem.id}
    //           className="p-4 border-b hover:bg-shark duration-300 hover:text-sharkLight-300 cursor-pointer border-sharkLight-200"
    //         >
    //           {navItem.text}
    //         </li>
    //       ))}
    //     </ul>
    //   </nav>
    // </div>
  );
};

export default Navbar;
