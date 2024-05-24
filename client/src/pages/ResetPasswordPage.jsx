import { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import { useUpdateUserMutation, useVerifyResetPasswordOTPMutation } from "../slices/usersApiSlice";
import { setCredentials, setOTPData } from "../slices/authSlice";
import { useDispatch, useSelector } from "react-redux";
import Loader from "../components/Loader";
import ConfirmEmailPageImg from "../assets/svg/confirmEmailPageImg.svg";
import { FaCheckCircle, FaLock } from "react-icons/fa";
import { toast } from "react-toastify";
import CountdownTimer from "../components/CountdownTimer";

const ResetPasswordPage = () => {
  const [password, setPassword] = useState("");
  const [confirmPassword, setConfirmPassword] = useState("");

  const [OTP, setOTP] = useState("");
  const [mode, setMode] = useState("");

  const dispatch = useDispatch();
  const navigate = useNavigate();

  // TODO: Remove console log
  // console.log(verifyEmail, emailExpiry);

  const { userInfo } = useSelector((state) => state.auth);
  const { otpData } = useSelector((state) => state.auth);

  useEffect(() => {
    if (!otpData) {
      navigate("/profile");
    }
  }, [navigate, otpData]);

  const email = otpData?.verificationEmail;
  const emailExpiry = otpData?.expiry;

  const [verifyResetPasswordOTPApiCall, { isLoading: isUpdatingProfile }] =
    useVerifyResetPasswordOTPMutation();
  const [updateProfileApiCall, { isLoading: isVerifyingResetPasswordOTP }] =
    useUpdateUserMutation();

  const verifyResetPasswordOTP = async (e) => {
    e.preventDefault();

    if (OTP === "") {
      toast.error("OTP field can not be empty");
    } else {
      try {
        const res = await verifyResetPasswordOTPApiCall({ email, OTP }).unwrap();

        toast.success(res.message);

        // TODO: Remove console log
        // console.log(data.message);

        setMode("resetSession");
      } catch (err) {
        toast.error(err?.data?.message || err.error);
      }
    }
  };

  const updateProfileHandler = async (e) => {
    e.preventDefault();
    if (password === "") {
      toast.error("OTP field can not be empty");
    } else if (password !== confirmPassword) {
      toast.error("Passwords do not match");
      setPassword("");
      setConfirmPassword("");
    } else {
      try {
        const res = await updateProfileApiCall({
          _id: userInfo._id,
          password: password,
        }).unwrap();

        dispatch(setCredentials({ ...res }));
        dispatch(setOTPData({}));
        toast.success(res.message);

        // TODO: Remove console log
        // console.log(res.message);

        setPassword("");
        setConfirmPassword("");
        setMode("");

        navigate("/profile");
      } catch (err) {
        toast.error(err?.data?.message || err.error);
      }
    }
  };

  return (
    <div className="errorBg w-full overflow-hidden">
      <div className="p-8 mx-auto justify-center md:grid md:grid-cols-2 md:place-items-center md:h-full flex flex-col ">
        {/* Reset Password Image */}
        <div className="">
          <img
            src={ConfirmEmailPageImg}
            alt="Confirm Email Image"
            className=" w-full mx-auto h-[400px] mb-8 "
          />
        </div>

        {/* Reset Password Text */}
        <div className="text-sharkDark-300 flex flex-col items-center justify-end md:p-6">
          <p className="text-4xl font-bold mb-5 text-center">
            {/* Reset Password */}
            {mode === "resetSession" ? "Create New Password" : "Confirm OTP"}
          </p>

          {mode === "resetSession" ? (
            <div className="flex flex-col w-full">
              <div className="flex flex-col gap-1 mb-2 md:mb-3">
                <label htmlFor="password" className="font-medium text-xs">
                  New Password
                </label>
                <input
                  type="password"
                  name="password"
                  value={password}
                  onChange={(e) => setPassword(e.target.value)}
                  className="w-full px-3 py-2 rounded-md border border-sharkLight-100 focus:outline-none focus:ring focus:ring-sharkLight-400 focus:ring-opacity-50"
                />
              </div>

              <div className=" flex flex-col gap-1 mb-5 md:mb-3">
                <label htmlFor="confirmPassword" className="font-medium text-xs">
                  Confirm New Password
                </label>
                <input
                  type="password"
                  name="confirmPassword"
                  value={confirmPassword}
                  onChange={(e) => setConfirmPassword(e.target.value)}
                  className="w-full px-3 py-2 rounded-md border border-sharkLight-100 focus:outline-none focus:ring focus:ring-sharkLight-400 focus:ring-opacity-50"
                />
              </div>
            </div>
          ) : (
            <>
              <div className="text-base mb-3 md:mb-4 text-center">
                <p>
                  Heads up! An email containing your <span className="font-bold">OTP</span> has just
                  landed in your inbox <span className="font-bold">[{email}]</span>. Check it out
                  and enter the code below to make sure it&apos;s you. The OTP expires in{" "}
                  <span className="font-bold">
                    {<CountdownTimer duration={emailExpiry} />} minutes
                  </span>{" "}
                  . Time is ticking!
                </p>
              </div>
              <div className="flex justify-center">
                <div className="flex flex-col gap-1 mb-2 md:mb-3 w-full">
                  <input
                    type="password"
                    name="OTP"
                    value={OTP}
                    placeholder="Enter 4 digit OTP"
                    onChange={(e) => setOTP(e.target.value)}
                    className="max-w-48 px-3 py-2 rounded-md bg-sharkLight-100/50 border border-sharkLight-100 focus:outline-none focus:ring focus:ring-sharkLight-400 focus:ring-opacity-50"
                  />
                </div>
              </div>
            </>
          )}

          <button
            type="submit"
            className="flex col-span-2 items-center justify-center w-full px-4 py-2 bg-shark hover:bg-sharkDark-100 text-white rounded"
            onClick={mode === "resetSession" ? updateProfileHandler : verifyResetPasswordOTP}
          >
            {isUpdatingProfile || isVerifyingResetPasswordOTP ? (
              <div className="text-3xl">
                <Loader />
              </div>
            ) : mode === "resetSession" ? (
              <div className="flex flex-row items-center justify-center">
                <FaLock className="mr-2" />
                Set New Password
              </div>
            ) : (
              <div className="flex flex-row items-center justify-center">
                <FaCheckCircle className="mr-2" />
                Confirm OTP
              </div>
            )}
          </button>
        </div>
      </div>
    </div>
  );
};

export default ResetPasswordPage;
