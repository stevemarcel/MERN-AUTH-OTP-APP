import { useState } from "react";
import { AiOutlineClose, AiOutlineMenu } from "react-icons/ai";

const Navbar = () => {
  // State to manage the navbar's visibility
  const [nav, setNav] = useState(false);

  // Toggle function to handle the navbar's display
  const handleNav = () => {
    setNav(!nav);
  };

  // Array containing navigation items when not logged in
  const navItems = [
    { id: 1, text: "Register" },
    { id: 2, text: "Login" },
  ];

  // Array containing navigation items when logged in
  const dropDownItems = [
    { id: 1, text: "Profile" },
    { id: 2, text: "Admin" },
    { id: 3, text: "Logout" },
  ];

  return (
    <div className="shadow-sm shadow-sharkLight-200/40">
      <nav className="container flex justify-between items-center h-24 mx-auto px-4 text-shark">
        <h1 className="w-full text-3xl font-bold">MERN-AUTH-OTP</h1>

        {/* Desktop Nav */}
        <ul className="hidden md:flex">
          {navItems.map((navItem) => (
            <li
              key={navItem.id}
              className="p-4 hover:bg-shark rounded-xl m-2 cursor-pointer duration-300 hover:text-sharkLight-100"
            >
              {navItem.text}
            </li>
          ))}
        </ul>

        {/* Mobile Nav Icon */}
        <div onClick={handleNav} className="block md:hidden">
          {nav ? <AiOutlineClose size={20} /> : <AiOutlineMenu size={20} />}
        </div>

        {/* Mobile Nav */}
        <ul
          className={
            nav
              ? "fixed md:hidden left-0 top-0 w-[60%] h-full border-r border-r-sharkLight-200/40 bg-sharkLight-100 ease-in-out duration-500"
              : "ease-in-out w-[60%] duration-500 fixed top-0 bottom-0 left-[-100%]"
          }
        >
          {navItems.map((navItem) => (
            <li
              key={navItem.id}
              className="p-4 border-b hover:bg-shark duration-300 hover:text-sharkLight-300 cursor-pointer border-sharkLight-200"
            >
              {navItem.text}
            </li>
          ))}
        </ul>
      </nav>
    </div>
  );
};

export default Navbar;
