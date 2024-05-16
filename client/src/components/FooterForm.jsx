import { useState } from "react";
import PropTypes from "prop-types";

const FooterForm = ({ placeholder }) => {
  const [message, setMessage] = useState("");

  const handleSubmit = (event) => {
    event.preventDefault();
    // Handle form submission here (e.g., send message to server)
    console.log("Message:", message);
    setMessage(""); // Clear the message after submit
  };

  return (
    <form className="flex flex-col space-y-2" onSubmit={handleSubmit}>
      <textarea
        className="p-2 rounded-md border border-sharkLight-100 focus:outline-none focus:ring focus:ring-sharkLight-300 focus:ring-opacity-50 h-32"
        value={message}
        onChange={(e) => setMessage(e.target.value)}
        placeholder={placeholder}
      />
      <button
        type="submit"
        className="px-4 py-2 bg-sharkLight-100 hover:bg-sharkLight-300 hover:text-shark text-sharkDark-500 rounded-md font-bold"
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
