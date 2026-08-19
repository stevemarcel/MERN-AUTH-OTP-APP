import { useNavigate } from "react-router-dom";
import PropTypes from "prop-types";
import { FaCaretLeft, FaArrowLeft } from "react-icons/fa";
const BackButton = ({ icon }) => {
  const navigate = useNavigate();

  let BtnIcon = <FaCaretLeft />;
  let BtnColour = "bg-shark hover:bg-sharkDark-100";
  let BtnText = "Go back";

  // If the button is for a not found page
  if (icon === "NotFound") {
    BtnIcon = <FaArrowLeft />;
    BtnColour = "bg-red-700 hover:bg-red-700/95";
    BtnText = "Go back to safety";
  }

  return (
    <div>
      <button
        className={`flex items-center justify-center px-3 py-2 min-w-max text-light text-xs rounded-md
          transition duration-300 hover:scale-105 hover:shadow-sm ${BtnColour}`}
        onClick={() => navigate(-1)}
      >
        <div className="md:mr-1">{BtnIcon}</div>
        <div className="hidden md:flex">{BtnText}</div>
      </button>
    </div>
  );
};

BackButton.propTypes = {
  icon: PropTypes.string,
};

export default BackButton;
