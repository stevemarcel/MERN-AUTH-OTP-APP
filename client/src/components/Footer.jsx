import { Link } from "react-router-dom";
import SharkLogo from "../assets/img/sharkColoursLogoInverse.png";
import FooterForm from "./FooterForm";

const navItems = [
  { id: 1, text: "Home", link: "/" },
  { id: 2, text: "Features", link: "/features" },
  { id: 3, text: "About", link: "/about" },
  { id: 4, text: "Contact", link: "/contact" },
];

const socials = [
  { id: 1, text: "GitHub", link: "https://github.com/stevemarcel" },
  {
    id: 2,
    text: "LinkedIn",
    link: "https://www.linkedin.com/in/stephen-onyejuluwa-098733190",
  },
  {
    id: 3,
    text: "Behance",
    link: "https://www.behance.net/sharkcoloursng",
  },
  {
    id: 4,
    text: "Instagram",
    link: "https://instagram.com/sharkcoloursng",
  },
  {
    id: 5,
    text: "Facebook",
    link: "https://facebook.com/sharkcoloursng",
  },
];

const Footer = () => {
  return (
    <footer className="bg-sharkDark-500 text-sharkLight-100">
      <div className="w-[90%] max-w-6xl mx-auto py-16 md:py-20">
        {/* Footer Content */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-10 lg:gap-16">
          {/* Brand */}
          <div>
            <p className="text-sm font-semibold uppercase tracking-[0.2em] text-sharkLight-300 mb-4">
              Designed by
            </p>

            <img src={SharkLogo} alt="Shark Colours" className="w-36 h-auto object-contain" />
          </div>

          {/* Quick Links */}
          <div>
            <p className="text-sm font-semibold uppercase tracking-[0.2em] text-sharkLight-300 mb-4">
              Quick Links
            </p>

            <ul className="space-y-3">
              {navItems.map((navItem) => (
                <li key={navItem.id}>
                  <Link
                    to={navItem.link}
                    className="text-sm text-sharkLight-100 hover:text-light transition duration-200"
                  >
                    {navItem.text}
                  </Link>
                </li>
              ))}
            </ul>
          </div>

          {/* Social Links */}
          <div>
            <p className="text-sm font-semibold uppercase tracking-[0.2em] text-sharkLight-300 mb-4">
              Follow Us
            </p>

            <ul className="space-y-3">
              {socials.map((social) => (
                <li key={social.id}>
                  <a
                    href={social.link}
                    target="_blank"
                    rel="noopener noreferrer"
                    className="text-sm text-sharkLight-100 hover:text-light transition duration-200"
                  >
                    {social.text}
                  </a>
                </li>
              ))}
            </ul>
          </div>

          {/* Contact Form */}
          <div>
            <p className="text-sm font-semibold uppercase tracking-[0.2em] text-sharkLight-300 mb-4">
              Get In Touch
            </p>

            <FooterForm placeholder="We would love to hear from you" />
          </div>
        </div>

        {/* Footer Bottom */}
        <div className="border-t border-sharkLight-100/10 mt-14 pt-6">
          <p className="text-xs text-sharkLight-300">
            © {new Date().getFullYear()} MERN-AUTH-OTP. All rights reserved.
          </p>
        </div>
      </div>
    </footer>
  );
};

export default Footer;
