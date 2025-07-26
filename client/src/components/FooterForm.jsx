import { useState } from "react";
import PropTypes from "prop-types";

const FooterForm = ({ placeholder }) => {
  const [email, setEmail] = useState("");
  const [message, setMessage] = useState("");

  const handleSubmit = (e) => {
    e.preventDefault();

    console.log("Email:", email);
    console.log("Message:", message);
    setMessage("");
  };

  return (
    <form className="flex flex-col text-sharkDark-500" onSubmit={handleSubmit}>
      <input
        type="email"
        name="email"
        id="formEmail"
        placeholder="Enter email"
        className="mb-1 px-3 py-2 border border-sharkLight-100 focus:outline-none focus:ring focus:ring-sharkLight-400 focus:ring-opacity-50"
        value={email}
        onChange={(e) => setEmail(e.target.value)}
      />
      <textarea
        className="mb-3 p-3 border border-sharkLight-100 focus:outline-none focus:ring focus:ring-sharkLight-400 focus:ring-opacity-50 h-24"
        value={message}
        onChange={(e) => setMessage(e.target.value)}
        placeholder={placeholder}
      />
      <button
        type="submit"
        className="px-4 py-2 bg-sharkLight-100 hover:bg-sharkLight-100/90 rounded-sm font-bold transition duration-300 transform hover:scale-105"
      >
        Send
      </button>
    </form>
  );
};

FooterForm.propTypes = {
  placeholder: PropTypes.string.isRequired,
};

export default FooterForm;
