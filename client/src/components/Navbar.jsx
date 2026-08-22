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
  // ! --- LOCAL STATE MANAGEMENT ---
  const [mobileNavOpen, setMobileNavOpen] = useState(false);
  const [showDropdown, setShowDropdown] = useState(false);

  // ! --- GET USER ---
  const { userInfo } = useSelector((state) => state.auth);

  // ! --- NAVIGATION ITEMS ---
  const navItems = [
    { id: 1, text: "Home", link: "/" },
    { id: 2, text: "Features", link: "/features" },
    { id: 3, text: "About", link: "/about" },
    { id: 4, text: "Contact", link: "/contact" },
  ];

  // ! --- PROFILE ITEMS ---
  const profileItems = [
    {
      id: 1,
      text: "Profile",
      link: "/profile",
      icon: <FaUser />,
    },
    {
      id: 2,
      text: "Notifications",
      link: "/notification",
      icon: <FaBell />,
    },
    {
      id: 3,
      text: "Admin Page",
      link: "/admin",
      icon: <FaUserLock />,
    },
    {
      id: 4,
      text: "Logout",
      icon: <FaSignOutAlt />,
    },
  ];

  // ! --- GET STARTED ITEMS ---
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

  // ! --- LOGOUT ---
  const [logoutApiCall] = useLogoutMutation();

  const logoutHandler = async () => {
    try {
      await logoutApiCall().unwrap();

      dispatch(deleteCredentials());
      dispatch(apiSlice.util.resetApiState());

      setShowDropdown(false);
      setMobileNavOpen(false);

      navigate("/login");
    } catch (err) {
      console.log(err);
    }
  };

  // ! --- DROPDOWN TOGGLE ---
  const toggleDropdown = () => {
    setShowDropdown((prev) => !prev);
    setMobileNavOpen(false);
  };

  // ! --- MOBILE NAV TOGGLE ---
  const toggleMobileNav = () => {
    setMobileNavOpen((prev) => !prev);
    setShowDropdown(false);
  };

  // ! --- GET DROPDOWN ITEMS ---
  const getDropdownItems = () => {
    return userInfo ? profileItems : getStartedItems;
  };

  // ! --- CLOSE DROPDOWN WHEN CLICKING OUTSIDE ---
  useEffect(() => {
    const handleClickOutside = (event) => {
      if (!event.target.closest(".rightNavButton")) {
        setShowDropdown(false);
      }
    };

    document.addEventListener("click", handleClickOutside);

    return () => {
      document.removeEventListener("click", handleClickOutside);
    };
  }, []);

  // ! --- DROPDOWN LIST ---
  const dropdownList = getDropdownItems().map((item) => {
    const isHidden = userInfo && item.text === "Admin Page" && !userInfo.isAdmin;

    if (item.text === "Logout") {
      return (
        <li key={item.id} className={`${isHidden ? "hidden" : ""}`}>
          <button
            type="button"
            onClick={logoutHandler}
            className="
              w-full
              flex
              items-center
              gap-3
              px-4
              py-3
              text-sm
              text-shark
              hover:bg-red-50
              hover:text-red-500
              transition-colors
              duration-200
            "
          >
            <span className="text-base">{item.icon}</span>
            <span>{item.text}</span>
          </button>
        </li>
      );
    }

    return (
      <li key={item.id} className={`${isHidden ? "hidden" : ""}`}>
        <Link
          to={item.link}
          onClick={() => {
            setShowDropdown(false);
            setMobileNavOpen(false);
          }}
          className="
            flex
            items-center
            gap-3
            px-4
            py-3
            text-sm
            text-shark
            hover:bg-sharkLight-100
            transition-colors
            duration-200
          "
        >
          <span className="text-base">{item.icon}</span>
          <span>{item.text}</span>
        </Link>
      </li>
    );
  });

  return (
    <>
      {/* =========================
          DESKTOP / MAIN NAVBAR
      ========================== */}
      <header
        className="
          fixed
          top-0
          left-0
          w-full
          z-50
          bg-light/95
          backdrop-blur-md
          border-b
          border-sharkLight-200
        "
      >
        <nav
          className="
            w-[92%]
            max-w-7xl
            mx-auto
            h-20
            flex
            items-center
            justify-between
          "
        >
          {/* Logo */}
          <Link
            to="/"
            className="
              flex
              items-center
              gap-2
              text-xl
              font-bold
              text-shark
              tracking-tight
              hover:text-sharkDark-300
              transition-colors
              duration-200
            "
          >
            MERN AUTH OTP APP
          </Link>

          {/* Desktop Navigation */}
          <ul className="hidden md:flex items-center gap-2">
            {navItems.map((navItem) => (
              <li key={navItem.id}>
                <NavLink
                  to={navItem.link}
                  className={({ isActive }) =>
                    `
                    relative
                    block
                    px-4
                    py-2
                    text-sm
                    font-medium
                    rounded-md
                    transition-all
                    duration-200
                    ${
                      isActive
                        ? "text-shark bg-sharkLight-100"
                        : "text-sharkLight-500 hover:text-shark hover:bg-sharkLight-100/70"
                    }
                    `
                  }
                >
                  {navItem.text}
                </NavLink>
              </li>
            ))}
          </ul>

          {/* Right Section */}
          <div className="flex items-center gap-3">
            {/* Desktop Account Button */}
            <div className="relative hidden md:block">
              <button
                type="button"
                className="
                  rightNavButton
                  flex
                  items-center
                  gap-2
                  px-4
                  py-2.5
                  bg-shark
                  text-light
                  text-sm
                  font-medium
                  rounded-md
                  shadow-sm
                  hover:bg-sharkDark-100
                  hover:shadow-md
                  transition-all
                  duration-200
                  focus:outline-none
                "
                onClick={toggleDropdown}
              >
                {userInfo ? (
                  <>
                    <img
                      src={`${BACKEND_BASE_URL}${userInfo.profile}`}
                      alt="Profile Picture"
                      className="
                        w-7
                        h-7
                        rounded-full
                        object-cover
                        border-2
                        border-light/30
                      "
                    />

                    <span>{userInfo.firstName}</span>
                  </>
                ) : (
                  <>
                    <span>Get Started</span>
                    <FaRocket className="text-sm" />
                  </>
                )}

                <FaCaretDown
                  className={`
                    ml-1
                    text-xs
                    transition-transform
                    duration-200
                    ${showDropdown ? "rotate-180" : "rotate-0"}
                  `}
                />
              </button>

              {/* Desktop Dropdown */}
              {showDropdown && (
                <div
                  className="
                    absolute
                    top-full
                    right-0
                    mt-3
                    w-52
                    bg-light
                    border
                    border-sharkLight-200
                    rounded-md
                    shadow-xl
                    overflow-hidden
                    py-1
                  "
                >
                  <ul role="listbox">{dropdownList}</ul>
                </div>
              )}
            </div>

            {/* Mobile Account / Menu */}
            <div className="md:hidden flex items-center gap-2">
              {/* User Profile */}
              {userInfo && (
                <div className="relative">
                  <button
                    type="button"
                    className="
                      rightNavButton
                      w-9
                      h-9
                      rounded-full
                      overflow-hidden
                      border-2
                      border-shark
                      focus:outline-none
                    "
                    onClick={toggleDropdown}
                  >
                    <img
                      src={`${BACKEND_BASE_URL}${userInfo.profile}`}
                      alt="Profile Picture"
                      className="w-full h-full object-cover"
                    />
                  </button>

                  {showDropdown && (
                    <div
                      className="
                        absolute
                        top-full
                        right-0
                        mt-3
                        w-52
                        bg-light
                        border
                        border-sharkLight-200
                        rounded-md
                        shadow-xl
                        overflow-hidden
                        py-1
                      "
                    >
                      <ul>{dropdownList}</ul>
                    </div>
                  )}
                </div>
              )}

              {/* Hamburger */}
              <button
                type="button"
                onClick={toggleMobileNav}
                className="
                  w-10
                  h-10
                  flex
                  items-center
                  justify-center
                  text-xl
                  text-shark
                  rounded-md
                  hover:bg-sharkLight-100
                  transition-colors
                  duration-200
                "
                aria-label="Toggle navigation"
              >
                {mobileNavOpen ? <FaTimes /> : <FaBars />}
              </button>
            </div>
          </div>
        </nav>
      </header>

      {/* =========================
          MOBILE NAVIGATION
      ========================== */}
      <div
        className={`
          fixed
          inset-0
          z-40
          md:hidden
          transition-all
          duration-300
          ${
            mobileNavOpen
              ? "visible bg-shark/30 backdrop-blur-sm"
              : "invisible bg-transparent pointer-events-none"
          }
        `}
        onClick={toggleMobileNav}
      >
        <div
          className={`
            absolute
            top-20
            left-0
            w-full
            bg-light
            border-b
            border-sharkLight-200
            shadow-lg
            transition-all
            duration-300
            ${mobileNavOpen ? "translate-y-0 opacity-100" : "-translate-y-4 opacity-0"}
          `}
          onClick={(e) => e.stopPropagation()}
        >
          <div className="w-[92%] mx-auto py-5">
            {/* Mobile Get Started */}
            {!userInfo && (
              <div className="relative mb-4">
                <button
                  type="button"
                  className="
                    w-full
                    flex
                    items-center
                    justify-between
                    px-4
                    py-3
                    bg-shark
                    text-light
                    text-sm
                    font-medium
                    rounded-md
                    hover:bg-sharkDark-100
                    transition-colors
                    duration-200
                  "
                  onClick={() => setShowDropdown((prev) => !prev)}
                >
                  <span className="flex items-center gap-2">
                    <FaRocket />
                    Get Started
                  </span>

                  <FaCaretDown
                    className={`
                      transition-transform
                      duration-200
                      ${showDropdown ? "rotate-180" : "rotate-0"}
                    `}
                  />
                </button>

                {showDropdown && (
                  <div
                    className="
                      mt-2
                      bg-light
                      border
                      border-sharkLight-200
                      rounded-md
                      shadow-md
                      overflow-hidden
                    "
                  >
                    <ul>{dropdownList}</ul>
                  </div>
                )}
              </div>
            )}

            {/* Mobile Links */}
            <ul className="flex flex-col gap-1">
              {navItems.map((navItem) => (
                <li key={navItem.id}>
                  <NavLink
                    to={navItem.link}
                    onClick={() => {
                      setMobileNavOpen(false);
                      setShowDropdown(false);
                    }}
                    className={({ isActive }) =>
                      `
                      flex
                      items-center
                      px-4
                      py-3.5
                      text-sm
                      font-medium
                      rounded-md
                      transition-all
                      duration-200
                      ${
                        isActive
                          ? "bg-sharkLight-100 text-shark"
                          : "text-sharkLight-500 hover:bg-sharkLight-100/70 hover:text-shark"
                      }
                      `
                    }
                  >
                    {navItem.text}
                  </NavLink>
                </li>
              ))}
            </ul>
          </div>
        </div>
      </div>
    </>
  );
};

export default Navbar;
