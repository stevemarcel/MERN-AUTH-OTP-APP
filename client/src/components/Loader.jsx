import { FaSpinner } from "react-icons/fa";

const Loader = () => {
  return (
    <div className="flex justify-center animate-spin">
      <FaSpinner />
    </div>
  );
};

export default Loader;
