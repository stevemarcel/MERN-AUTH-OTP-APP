import { Link } from "react-router-dom";
import SharkLogo from "../assets/Shark-Colours-Logo-Inverse.png";
import FooterForm from "./FooterForm";

// Array containing navigation items when not logged in
const navItems = [
  { id: 1, text: "Home", link: "/" },
  { id: 2, text: "Services", link: "/services" },
  { id: 3, text: "About", link: "/about" },
  { id: 4, text: "Contact", link: "/contact" },
];

const socials = [
  { id: 1, text: "Github", link: "https://github.com/stevemarcel" },
  { id: 2, text: "LinkedIn", link: "https://www.linkedin.com/in/stephen-onyejuluwa-098733190" },
  { id: 3, text: "Behance", link: "https://www.behance.net/sharkcoloursng" },
  { id: 4, text: "Instagram", link: "https://instagram.com/sharkcoloursng" },
  { id: 5, text: "Facebook", link: "https://facebook.com/sharkcoloursng" },
];

const Footer = () => {
  return (
    <div className=" bg-sharkDark-500 text-sharkLight-100">
      <div className="w-[90%] mx-auto py-8 grid grid-cols-3 md:grid-cols-4 gap-4 justify-items-center">
        <div className="flex flex-col justify-center">
          <p>Designed by:</p>
          <img src={SharkLogo} alt="" className="h-auto object-cover" />
        </div>
        <div className="flex flex-col ">
          <h2 className="font-bold text-lg">Quick Links</h2>
          <ul className="flex flex-col">
            {navItems.map((navItem) => (
              <li
                key={navItem.id}
                className="py-2 hover:text-sharkLight-300 rounded-md mb-2 cursor-pointer"
              >
                <Link to={navItem.link}>{navItem.text}</Link>
              </li>
            ))}
          </ul>
        </div>
        <div className="flex flex-col ">
          <h2 className="font-bold text-lg">Follow Us</h2>
          <ul className="flex flex-col">
            {socials.map((social) => (
              <li
                key={social.id}
                className="py-2 hover:text-sharkLight-300 rounded-md mb-2 cursor-pointer"
              >
                <Link to={social.link} target="_blank" rel="noopener noreferrer">
                  {social.text}
                </Link>
              </li>
            ))}
          </ul>
        </div>
        <div className="flex flex-col col-span-3 md:col-span-1 justify-center justify-self-stretch">
          <FooterForm placeholder="We will love to hear from you" />
        </div>
      </div>
    </div>
  );
};

export default Footer;
