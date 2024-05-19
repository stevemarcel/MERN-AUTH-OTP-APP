import { Link, useParams } from "react-router-dom";
import { useVerifyUserEmailQuery } from "../slices/usersApiSlice";
import Loader from "../components/Loader";
import ErrorPageImg from "../assets/svg/errorPageImg.svg";
import EmailVerifiedPageImg from "../assets/svg/emailVerifiedPageImg.svg";
import { FaArrowLeft, FaHome } from "react-icons/fa";

const VerifyEmail = () => {
  const { id, token } = useParams();

  //? const { data, isLoading, isError, error.data.message } = useVerifyUserEmailQuery({ id, token });

  const res = useVerifyUserEmailQuery({ id, token });

  //? For Testing
  //? console.log(res, res.isError);

  return (
    <div className="errorBg w-full overflow-hidden">
      {res.isLoading ? (
        <div className="p-8 mx-auto justify-center text-sharkDark-300 text-3xl ">
          <Loader />
          <p className="font-bold text-center">Verifying Your Email</p>
        </div>
      ) : !res.isLoading && res.isError ? (
        <div className="p-8 mx-auto justify-center md:grid md:grid-cols-2 md:place-items-center md:h-full flex flex-col ">
          <div className="">
            <img src={ErrorPageImg} alt="Error Image" className=" w-full mx-auto h-[400px] mb-8 " />
          </div>
          <div className="text-sharkDark-300 flex flex-col items-center justify-end md:p-6">
            <p className="text-4xl font-bold mb-5 text-center">{res.error.data.message}</p>
            <Link
              to={`/confirm-email/${id}`}
              className="bg-shark text-light px-4 py-2 w-full rounded hover:bg-sharkDark-100 focus:outline-none flex flex-row items-center justify-center"
            >
              <div className="flex flex-row items-center justify-center">
                <FaArrowLeft className="mr-2" />
                Go back to resend Email
              </div>
            </Link>
          </div>
        </div>
      ) : (
        !res.isLoading &&
        res.data && (
          <div className="p-8 mx-auto justify-center md:grid md:grid-cols-2 md:place-items-center md:h-full flex flex-col ">
            {/* Email Verified Image */}
            <div className="">
              <img
                src={EmailVerifiedPageImg}
                alt="Email verified Image"
                className=" w-full mx-auto h-[400px] mb-8 "
              />
            </div>
            <div className="text-sharkDark-300 flex flex-col items-center justify-end md:p-6">
              <p className="text-4xl font-bold mb-5 text-center">{res.data.Message}</p>
              <Link
                to="/"
                className="bg-shark text-light px-4 py-2 w-full rounded hover:bg-sharkDark-100 focus:outline-none flex flex-row items-center justify-center"
              >
                <div className="flex flex-row items-center justify-center">
                  <FaHome className="mr-2" />
                  Go to Home
                </div>
              </Link>
            </div>
          </div>
        )
      )}
    </div>
  );
};

export default VerifyEmail;
