import { useNavigate } from "react-router-dom";
import { FaCaretLeft } from "react-icons/fa";
const BackButton = () => {
  const navigate = useNavigate();
  return (
    <div>
      <button
        className="flex items-center mr-8 px-3 py-2 w-full bg-shark text-light text-xs hover:bg-sharkDark-100 focus:outline-none rounded-lg"
        onClick={() => navigate(-1)}
      >
        <div className="mr-1">
          <FaCaretLeft />
        </div>
        Go back
      </button>
    </div>
  );
};

export default BackButton;
