import ErrorPageImg from "../assets/svg/errorPageImg.svg";
import BackButton from "../components/BackButton";
import { FaExclamationCircle } from "react-icons/fa";

const ErrorPage = () => {
  const icon = "NotFound";
  return (
    <div className="errorBg w-full overflow-hidden">
      <div className="p-8 mx-auto justify-center md:grid md:grid-cols-2 md:place-items-center md:h-full flex flex-col ">
        {/* Error Image */}
        <div className="">
          <img src={ErrorPageImg} alt="Error Image" className=" w-full mx-auto h-[400px] mb-8 " />
        </div>

        {/* Error Text */}
        <div className="text-sharkDark-300 flex flex-col items-center justify-end md:p-6">
          <p className="text-4xl font-bold mb-1 text-red-700 flex items-center gap-2">
            <FaExclamationCircle />
            Page Not Found
          </p>
          <p className="text-base leading-loose mb-3 w-3/5 md:mb-4 text-center">
            Oops! Looks like something went wrong. We are working on it.
          </p>
          <BackButton icon={icon} className="md:w-4/5" />
        </div>
      </div>
    </div>
  );
};

export default ErrorPage;
