import { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import { useDispatch, useSelector } from "react-redux";
import { toast } from "react-toastify";
import { useSendResetPasswordEmailMutation, useUpdateUserMutation } from "../slices/usersApiSlice";
import { setCredentials, setOTPData } from "../slices/authSlice";
import { FaCamera, FaCheckCircle, FaLock, FaPaperPlane, FaUserEdit } from "react-icons/fa";
import Loader from "../components/Loader";
const ProfilePage = () => {
  const [firstName, setFirstName] = useState("");
  const [lastName, setLastName] = useState("");
  const [email, setEmail] = useState("");
  const [isAdmin, setIsAdmin] = useState(false);
  const [username, setUsername] = useState("");
  const [profile, setProfile] = useState("");
  const [address, setAddress] = useState("");
  const [mobile, setMobile] = useState("");

  const [mode, setMode] = useState("view");

  const dispatch = useDispatch();
  const navigate = useNavigate();

  const handleEditClick = () => {
    setMode(mode === "view" ? "edit" : "view");
  };

  const { userInfo } = useSelector((state) => state.auth);

  const [updateProfileApiCall, { isLoading: isUpdatingProfile }] = useUpdateUserMutation();

  const [sendResetPasswordOTPApiCall, { isLoading: isSendingResetPasswordOTP }] =
    useSendResetPasswordEmailMutation();

  useEffect(() => {
    setFirstName(userInfo.firstName);
    setLastName(userInfo.lastName);
    setEmail(userInfo.email);
    setIsAdmin(userInfo.isAdmin);
    setUsername(userInfo.username);
    setProfile(userInfo.profile);
    setAddress(userInfo.address);
    setMobile(userInfo.mobile);
  }, [userInfo]);

  const updateProfileHandler = async (e) => {
    e.preventDefault();

    try {
      const res = await updateProfileApiCall({
        _id: userInfo._id,
        firstName,
        lastName,
        email,
        username,
        profile,
        address,
        mobile,
      }).unwrap();

      dispatch(setCredentials({ ...res }));
      toast.success(res.message);

      // TODO: Remove console log
      // console.log(res.message);

      setMode("view");
    } catch (err) {
      toast.error(err?.data?.message || err.error);
    }
  };

  const sendResetPasswordOTP = async () => {
    try {
      const res = await sendResetPasswordOTPApiCall(userInfo).unwrap();

      // TODO: Remove console log
      // console.log(res);

      dispatch(setOTPData({ ...res }));

      navigate("/resetPassword");
    } catch (err) {
      console.log(err?.data?.message || err.error);
    }
  };

  return (
    <div className="p-6 mb-10 min-h-[80vh] lg:w-[70%] mx-auto">
      <h2 className="text-2xl font-bold mb-4 text-shark">Profile</h2>
      <div className="flex mx-auto justify-center text-shark">
        <div className="flex flex-col md:flex-row bg-sharkLight-100/50 p-10 rounded-lg gap-8">
          <div className="flex flex-col items-center">
            <div id="profileImg" className="relative rounded-full overflow-hidden w-60">
              <img src={profile} alt="Profile Picture" className="size-auto rounded" />
              {mode === "edit" && (
                <div className="absolute inset-x-0 bottom-0 h-3/10 bg-shark/50 flex justify-center items-center p-5">
                  <FaCamera className="text-light text-2xl" />
                </div>
              )}
            </div>
            <div className=" flex items-center gap-1 mt-2 md:my-3">
              <label htmlFor="username" className="font-medium text-xs">
                Username:
              </label>
              <input
                name="username"
                value={username}
                onChange={(e) => setUsername(e.target.value)}
                className={`p-2 w-full rounded border italic ${
                  mode === "view"
                    ? "focus:none font-mono border-none bg-transparent"
                    : "focus:outline-none focus:ring focus:ring-sharkLight-400 focus:ring-opacity-50"
                }`}
                disabled={mode === "view"}
              />
            </div>
            {isAdmin && (
              <div className="flex justify-center items-center p-4 mt-2 w-full bg-light">
                <div className="mr-2">
                  <FaLock />
                </div>{" "}
                Admin User
              </div>
            )}
          </div>
          <div id="userInformation" className="">
            <form
              onSubmit={(e) => {
                e.preventDefault();
              }}
            >
              <div className=" flex flex-col md:flex-row md:gap-1">
                <div className=" flex flex-col gap-1 mb-2 md:mb-3">
                  <label htmlFor="firstName" className="font-medium text-xs">
                    First Name
                  </label>
                  <input
                    type="text"
                    name="firstName"
                    value={firstName}
                    onChange={(e) => setFirstName(e.target.value)}
                    className={`w-full px-3 py-2 rounded border border-sharkLight-100 ${
                      mode === "view"
                        ? "focus:none bg-light"
                        : "focus:outline-none focus:ring focus:ring-sharkLight-400 focus:ring-opacity-50"
                    }`}
                    disabled={mode === "view"}
                  />
                </div>

                <div className=" flex flex-col gap-1 mb-2 md:mb-3">
                  <label htmlFor="lastName" className="font-medium text-xs">
                    Last Name
                  </label>
                  <input
                    type="text"
                    name="lastName"
                    value={lastName}
                    onChange={(e) => setLastName(e.target.value)}
                    className={`w-full px-3 py-2 rounded border border-sharkLight-100 ${
                      mode === "view"
                        ? "focus:none bg-light"
                        : "focus:outline-none focus:ring focus:ring-sharkLight-400 focus:ring-opacity-50"
                    }`}
                    disabled={mode === "view"}
                  />
                </div>
              </div>

              <div className=" flex flex-col md:flex-row md:gap-1">
                <div className=" flex flex-col gap-1 mb-2 md:mb-3 md:w-[70%]">
                  <label htmlFor="email" className="font-medium text-xs">
                    Email
                  </label>
                  <input
                    type="email"
                    name="email"
                    value={email}
                    onChange={(e) => setEmail(e.target.value)}
                    className={`w-full px-3 py-2 rounded border border-sharkLight-100 ${
                      mode === "view"
                        ? "focus:none bg-light"
                        : "focus:outline-none focus:ring focus:ring-sharkLight-400 focus:ring-opacity-50"
                    }`}
                    disabled={mode === "view"}
                  />
                </div>

                <div className=" flex flex-col gap-1 mb-2 md:mb-3">
                  <label htmlFor="mobile" className="font-medium text-xs">
                    Phone Number
                  </label>
                  <input
                    type="tel"
                    name="mobile"
                    value={mobile}
                    onChange={(e) => setMobile(e.target.value)}
                    className={`w-full px-3 py-2 rounded border border-sharkLight-100 ${
                      mode === "view"
                        ? "focus:none bg-light"
                        : "focus:outline-none focus:ring focus:ring-sharkLight-400 focus:ring-opacity-50"
                    }`}
                    disabled={mode === "view"}
                  />
                </div>
              </div>

              <div className=" flex flex-col gap-1 mb-2 md:mb-3">
                <label htmlFor="address" className="font-medium text-xs">
                  Address
                </label>
                <input
                  type="text"
                  name="address"
                  value={address}
                  onChange={(e) => setAddress(e.target.value)}
                  className={`w-full px-3 py-2 rounded border border-sharkLight-100 ${
                    mode === "view"
                      ? "focus:none bg-light"
                      : "focus:outline-none focus:ring focus:ring-sharkLight-400 focus:ring-opacity-50"
                  }`}
                  disabled={mode === "view"}
                />
              </div>

              <button
                type={mode === "edit" ? "submit" : "button"} // Submit button in edit mode
                className="flex items-center justify-center w-full mt-5 px-4 py-2 bg-shark hover:bg-sharkDark-100 text-white rounded"
                onClick={mode === "edit" ? updateProfileHandler : handleEditClick}
              >
                {isUpdatingProfile ? (
                  <div className="text-3xl">
                    <Loader />
                  </div>
                ) : mode === "view" ? (
                  <>
                    <div className="mr-2">
                      <FaUserEdit />
                    </div>
                    Edit Profile
                  </>
                ) : (
                  <>
                    <div className="mr-2">
                      <FaCheckCircle />
                    </div>
                    Save Changes
                  </>
                )}
              </button>
            </form>

            {mode === "edit" && (
              <div className="mt-10">
                <h2 className="text-lg font-bold mb-4 text-shark">Reset Password</h2>
                <button
                  type={mode === "edit" ? "submit" : "button"} // Submit button in edit mode
                  className="flex col-span-2 items-center justify-center w-full px-4 py-2 bg-shark hover:bg-sharkDark-100 text-white rounded"
                  onClick={sendResetPasswordOTP}
                >
                  {isSendingResetPasswordOTP ? (
                    <div className="text-3xl">
                      <Loader />
                    </div>
                  ) : (
                    <>
                      <div className="mr-2">
                        <FaPaperPlane />
                      </div>
                      Request Reset Password OTP
                    </>
                  )}
                </button>
              </div>
            )}
          </div>
        </div>
      </div>
    </div>
  );
};

export default ProfilePage;
