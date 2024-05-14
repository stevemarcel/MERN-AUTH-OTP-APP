import { Link } from "react-router-dom";
import ErrorPageImg from "../assets/errorPageImg.svg";
import { FaArrowLeft } from "react-icons/fa";

const ErrorPage = () => {
  return (
    <div className="errorBg h-[calc(100vh-4.5rem)] w-full overflow-hidden">
      <div className="p-8 mx-auto justify-center md:grid md:grid-cols-2 md:place-items-center md:h-full flex flex-col ">
        {/* Error Image */}
        <div className="">
          <img src={ErrorPageImg} alt="Error Image" className=" w-full mx-auto h-[400px] mb-8 " />
        </div>

        {/* Error Text */}
        <div className="text-sharkDark-300 flex flex-col items-center justify-end md:p-6">
          <p className="text-4xl font-bold mb-1">Page Not Found</p>
          <p className="text-base leading-loose mb-3 md:mb-4 text-center">
            Oops! Looks like something went wrong. We are working on it.
          </p>
          <Link
            to="/"
            className="bg-shark text-light px-4 py-2 w-full rounded hover:bg-sharkDark-100 focus:outline-none flex flex-row items-center justify-center"
          >
            <FaArrowLeft className="mr-2" /> Go back
          </Link>
        </div>
      </div>

      <div className="md:w-1/2 p-8 flex flex-col items-center justify-center text-center lg:text-left">
        {" "}
        {/* Text section */}
      </div>
    </div>
  );
};

export default ErrorPage;
