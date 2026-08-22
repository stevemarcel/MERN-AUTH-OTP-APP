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
  FaRocket,
} from "react-icons/fa";
import { useSelector, useDispatch } from "react-redux";

// ! --- USERS API SLICE HOOKS ---
import { useLogoutMutation } from "../slices/usersApiSlice";
import { deleteCredentials } from "../slices/authSlice";
import { apiSlice } from "../slices/apiSlice";

const BACKEND_BASE_URL = import.meta.env.VITE_BACKEND_BASE_URL || "";

const Navbar = () => {
  // !  --- LOCAL STATE MANAGEMENT ---
  const [mobileNavOpen, setMobileNavOpen] = useState(false); // State to manage the navbar's visibility
  const [showDropdown, setShowDropdown] = useState(false); // Dropdown visibility state

  //Get user
  const { userInfo } = useSelector((state) => state.auth);

  // !   --- NAVIGATION AND USER ITEMS ARRAYS ---
  // * 1. Array containing navigation items
  const navItems = [
    { id: 1, text: "Home", link: "/" },
    { id: 2, text: "Features", link: "/features" },
    { id: 3, text: "About", link: "/about" },
    { id: 4, text: "Contact", link: "/contact" },
  ];

  // * 2. Array containing profile items when logged in
  const profileItems = [
    { id: 1, text: "Profile", link: "/profile", icon: <FaUser /> },
    { id: 2, text: "Notifications", link: "/notification", icon: <FaBell /> },
    { id: 3, text: "Admin Page", link: "/admin", icon: <FaUserLock /> },
    { id: 4, text: "Logout", icon: <FaSignOutAlt /> },
  ];

  // * 3. Array containing get started items when not logged in
  const getStartedItems = [
    {
      id: 1,
      type: "Auth",
      text: "Register",
      link: "/register",
      icon: <FaUserPlus />,
    },
    {
      id: 2,
      type: "Auth",
      text: "Login",
      link: "/login",
      icon: <FaSignInAlt />,
    },
  ];

  const navigate = useNavigate();
  const dispatch = useDispatch();

  // !   --- LOGOUT ---
  const [logoutApiCall] = useLogoutMutation();
  // * 1. Handler for logout action
  const logoutHandler = async () => {
    try {
      await logoutApiCall().unwrap();

      // Clear Redux authentication state
      dispatch(deleteCredentials());

      // Clear RTK Query cache
      dispatch(apiSlice.util.resetApiState());

      // Redirect to login
      navigate("/login");
    } catch (err) {
      console.log(err);
    }
  };

  // * 2. Toggle function to handle the dropdown display
  const toggleDropdown = () => {
    setShowDropdown((prev) => !prev);
    setMobileNavOpen(false);
  };

  // * 3. Choose Account menu items depending on if user is logged in or not
  const getDropdownItems = () => {
    return userInfo ? profileItems : getStartedItems;
  };

  // * 4. Toggle function to handle the navbar's display
  const toggleMobileNav = () => {
    setMobileNavOpen((prev) => !prev);
    setShowDropdown(false);
  };

  // * 5. Close dropdown on outside click
  useEffect(() => {
    // Add event listener on component mount
    const handleClickOutside = (event) => {
      if (!event.target.closest(".rightNavButton")) {
        setShowDropdown(false);
      }
    };

    document.addEventListener("click", handleClickOutside);
    // Cleanup function to remove listener on unmount
    return () => document.removeEventListener("click", handleClickOutside);
  }, []);

  // * 6. Generate dropdown items based on user info
  const dropdownList = getDropdownItems().map((item) => {
    const isHidden = userInfo && item.text === "Admin Page" && !userInfo.isAdmin;

    if (item.text === "Logout") {
      return (
        <li
          key={item.id}
          className={`cursor-pointer hover:bg-red-100 hover:text-red-500 px-4 py-2 text-shark flex items-center transition-all duration-200 ${
            isHidden ? "hidden" : ""
          }`}
        >
          <button
            type="button"
            onClick={logoutHandler}
            className="flex items-center text-left w-full"
          >
            <div>{item.icon}</div>
            <div className="ml-2">{item.text}</div>
          </button>
        </li>
      );
    }

    return (
      <Link
        to={item.link}
        key={item.id}
        onClick={() => {
          setShowDropdown(false);
          if (mobileNavOpen) {
            setMobileNavOpen(false);
          }
        }}
      >
        <li
          className={`hover:bg-sharkLight-100 px-4 py-2 text-shark flex items-center transition-all duration-200 ${
            isHidden ? "hidden" : ""
          }`}
        >
          <div className="flex items-center text-left">
            <div>{item.icon}</div>
            <div className="ml-2">{item.text}</div>
          </div>
        </li>
      </Link>
    );
  });

  return (
    <div className="bg-sharkLight-100 text-shark fixed top-0 left-0 w-full shadow-lg z-50 transition-all duration-300 h-20	">
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
                    ? "font-bold hover:text-sharkDark-300 underline underline-offset-4 duration-200"
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
          <div className="relative md:flex hidden">
            <button
              type="button"
              className="rightNavButton flex items-center px-4 py-2 bg-shark text-light hover:bg-sharkDark-100 focus:outline-none rounded duration-200"
              onClick={toggleDropdown}
            >
              {userInfo ? (
                <div className="flex items-center">
                  <img
                    src={`${BACKEND_BASE_URL}${userInfo.profile}`}
                    alt="Profile Picture"
                    className="w-6 h-6 mr-2 object-cover rounded-full"
                  />
                  <span>{userInfo.firstName}</span>
                </div>
              ) : (
                <span>
                  Get Started <FaRocket className="inline-block mx-2" />
                </span>
              )}

              <FaCaretDown
                className={`ml-2 transform transition-transform duration-200 ${
                  showDropdown ? "rotate-180" : "rotate-0"
                }`}
              />
            </button>

            {showDropdown && (
              <ul
                role="listbox"
                className="absolute top-full right-0 bg-light shadow-md rounded-md w-auto overflow-hidden mt-2 duration-200"
              >
                {dropdownList}
              </ul>
            )}
          </div>

          {/* Additional right buttons only on small screens */}
          <div className="md:hidden flex items-center text-3xl cursor-pointer">
            {userInfo ? (
              <div className="relative">
                <button
                  type="button"
                  className="rightNavButton relative rounded-full"
                  onClick={toggleDropdown}
                >
                  <div className="flex w-8 h-8 items-center border-2 overflow-hidden border-shark rounded-full">
                    <img
                      src={`${BACKEND_BASE_URL}${userInfo.profile}`}
                      alt="Profile Picture"
                      className="w-full h-full object-cover"
                    />
                  </div>
                </button>

                {showDropdown && (
                  <ul className="absolute text-base top-full right-0 bg-light shadow-md rounded-md w-auto overflow-hidden mt-2 duration-200">
                    {dropdownList}
                  </ul>
                )}
              </div>
            ) : null}

            {/* Mobile Hamburger Nav */}
            <button type="button" className="ml-5 flex items-center" onClick={toggleMobileNav}>
              {mobileNavOpen ? <FaTimes /> : <FaBars />}
            </button>
          </div>
        </div>
      </nav>

      {/* Mobile Nav */}
      <div
        className={
          mobileNavOpen
            ? "fixed h-[200%] w-screen md:hidden bg-sharkDark-300/50 backdrop-blur-sm top-20 left-0 transition-all duration-500 ease-in"
            : "absolute top-[-490px]"
        }
        onClick={toggleMobileNav}
      >
        <div className={mobileNavOpen ? "text-shark bg-light/85 transition-all" : ""}>
          <ul className="mx-auto flex flex-col p-4">
            {userInfo ? (
              ""
            ) : (
              <li className="relative flex items-center my-2 cursor-pointer justify-end">
                <button
                  type="button"
                  className="flex md:hidden items-center justify-center px-6 py-3 bg-shark text-light hover:bg-sharkDark-100 focus:outline-none rounded"
                  onClick={(e) => {
                    e.stopPropagation();
                    setShowDropdown((prev) => !prev);
                  }}
                >
                  Get Started
                  <div className="ml-2">
                    <FaCaretDown
                      className={`transform transition-transform duration-200 ${
                        showDropdown ? "rotate-180" : "rotate-0"
                      }`}
                    />
                  </div>
                </button>

                {showDropdown && (
                  <ul
                    className="absolute top-full right-0 bg-light shadow-md rounded-md w-auto overflow-hidden mt-2 z-50"
                    onClick={(e) => e.stopPropagation()}
                  >
                    {dropdownList}
                  </ul>
                )}
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
