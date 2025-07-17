import { useNavigate } from "react-router-dom";
import PropTypes from "prop-types";
import { FaCaretLeft, FaArrowLeft } from "react-icons/fa";
const BackButton = ({ icon }) => {
  const navigate = useNavigate();

  let BtnIcon = <FaCaretLeft />;
  let BtnColour = "bg-shark hover:bg-sharkDark-100";

  // If the button is for a not found page
  if (icon === "NotFound") {
    BtnIcon = <FaArrowLeft />;
    BtnColour = "bg-red-700 hover:bg-red-700/95";
  }

  return (
    <div>
      <button
        className={`flex items-center justify-center mr-8 px-3 py-2 w-full text-light text-xs focus:outline-none rounded-lg ${BtnColour}`}
        onClick={() => navigate(-1)}
      >
        <div className="mr-1">{BtnIcon}</div>
        Go back
      </button>
    </div>
  );
};

BackButton.propTypes = {
  icon: PropTypes.string,
};

export default BackButton;
