import { useState, useEffect } from "react";
import { Link, useNavigate } from "react-router-dom";
import { useSelector } from "react-redux";
import { useSendVerificationEmailMutation } from "../slices/usersApiSlice";
import ConfirmEmailPageImg from "../assets/svg/confirmEmailPageImg.svg";
import { FaCheckCircle, FaEnvelope } from "react-icons/fa";
import Loader from "../components/Loader";

const ConfirmEmailPage = () => {
  const [verifyEmail, setVerifyEmail] = useState("");
  const [emailExpiry, setEmailExpiry] = useState("");
  const navigate = useNavigate();

  const [sendVerificationEmailApiCall, { isLoading }] = useSendVerificationEmailMutation();

  const { userInfo } = useSelector((state) => state.auth);

  useEffect(() => {
    if (!userInfo || userInfo.emailVerified) {
      navigate("/");
    }
  }, [navigate, userInfo]);

  const sendVerificationEmail = async () => {
    try {
      const { verificationEmail, expiry } = await sendVerificationEmailApiCall(userInfo).unwrap();
      setVerifyEmail(verificationEmail);
      setEmailExpiry(expiry);
    } catch (err) {
      console.log(err?.data?.message || err.error);
    }
  };

  return (
    <div className="errorBg w-full overflow-hidden">
      <div className="p-8 mx-auto justify-center md:grid md:grid-cols-2 md:place-items-center md:h-full flex flex-col ">
        {/* Verify Email Image */}
        <div className="">
          <img
            src={ConfirmEmailPageImg}
            alt="Confirm Email Image"
            className=" w-full mx-auto h-[400px] mb-8 "
          />
        </div>

        {/* Verify Email Text */}
        <div className="text-sharkDark-300 flex flex-col items-center justify-end md:p-6">
          <p className="text-4xl font-bold mb-5 text-center">
            {!emailExpiry ? "Almost There! Verify Your Email" : "Check your inbox, please!"}
          </p>

          <div className={!emailExpiry ? "hidden" : "text-base mb-3 md:mb-4  text-center"}>
            {/* {verifyMessage} */}
            <p>
              Verification is just a click away! We&apos;ve sent an email to{" "}
              <span className="font-bold">[{verifyEmail}]</span>. Click the verification link in
              your email to complete your registration. This link expires in{" "}
              <span className="font-bold">{emailExpiry} minutes</span> . Do check your email
              swiftly.
            </p>
          </div>
          <Link
            className="bg-shark text-light px-4 py-2 w-full rounded hover:bg-sharkDark-100 focus:outline-none flex flex-row items-center justify-center"
            onClick={sendVerificationEmail}
          >
            {isLoading ? (
              <div className="text-3xl">
                <Loader />
              </div>
            ) : emailExpiry ? (
              <div className="flex flex-row items-center justify-center">
                <FaCheckCircle className="mr-2" />
                Verification Email Sent
              </div>
            ) : (
              <div className="flex flex-row items-center justify-center">
                <FaEnvelope className="mr-2" />
                Send Verification Email
              </div>
            )}
          </Link>
        </div>
      </div>
    </div>
  );
};

export default ConfirmEmailPage;
