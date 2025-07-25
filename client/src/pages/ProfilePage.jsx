import { useEffect, useState, useRef } from "react";
import { useNavigate } from "react-router-dom";
import { useDispatch, useSelector } from "react-redux";
import { toast } from "react-toastify";
import { useSendResetPasswordEmailMutation, useUpdateUserMutation } from "../slices/usersApiSlice";
import { setCredentials, setOTPData } from "../slices/authSlice";
import { FaCamera, FaCheckCircle, FaUserLock, FaPaperPlane, FaUserEdit } from "react-icons/fa";
import { MdVerified } from "react-icons/md";
import Loader from "../components/Loader";
import BackButton from "../components/BackButton";
import { PiSealWarningFill } from "react-icons/pi";

const BACKEND_BASE_URL = "http://localhost:5000";

const ProfilePage = () => {
  const [firstName, setFirstName] = useState("");
  const [lastName, setLastName] = useState("");
  const [email, setEmail] = useState("");
  const [isAdmin, setIsAdmin] = useState(false);
  const [emailVerified, setEmailVerified] = useState(false);
  const [username, setUsername] = useState("");
  const [profile, setProfile] = useState("");
  const [address, setAddress] = useState("");
  const [mobile, setMobile] = useState("");

  const [mode, setMode] = useState("view");
  const [selectedFile, setSelectedFile] = useState(null); // State for the selected file object
  const [filePreview, setFilePreview] = useState(null); // State for file preview URL
  const fileInputRef = useRef(null); // Ref for file input

  const dispatch = useDispatch();
  const navigate = useNavigate();

  const { userInfo } = useSelector((state) => state.auth);

  const handleEditClick = () => {
    setMode(mode === "view" ? "edit" : "view");

    if (mode === "edit") {
      setSelectedFile(null);
      setFilePreview(null);
      setProfile(userInfo.profile); // Reset profile display to current user info
    }
  };

  const [updateProfileApiCall, { isLoading: isUpdatingProfile }] = useUpdateUserMutation();

  const [sendResetPasswordOTPApiCall, { isLoading: isSendingResetPasswordOTP }] =
    useSendResetPasswordEmailMutation();

  useEffect(() => {
    setFirstName(userInfo.firstName);
    setLastName(userInfo.lastName);
    setEmail(userInfo.email);
    setIsAdmin(userInfo.isAdmin);
    setEmailVerified(userInfo.emailVerified);
    setUsername(userInfo.username);
    setProfile(userInfo.profile);
    setAddress(userInfo.address || "");
    setMobile(userInfo.mobile || "");
  }, [userInfo]);

  // Handle file selection for profile picture
  const handleFileChange = (e) => {
    const file = e.target.files[0];
    if (file) {
      setSelectedFile(file);
      // Create a URL for the file preview
      setFilePreview(URL.createObjectURL(file));
      setProfile(""); // Clear the existing profile URL when a new file is selected
    } else {
      setSelectedFile(null);
      setFilePreview(null);
      setProfile(userInfo.profile); // Reset to current user info URL if no file selected
    }
  };

  // Cleanup for file preview URL
  useEffect(() => {
    return () => {
      if (filePreview) {
        URL.revokeObjectURL(filePreview);
      }
    };
  }, [filePreview]);

  // Handle update profile form submission
  const updateProfileHandler = async (e) => {
    e.preventDefault();

    try {
      const formData = new FormData();
      formData.append("firstName", firstName);
      formData.append("lastName", lastName);
      formData.append("email", email);
      formData.append("username", username);
      formData.append("address", address);
      formData.append("mobile", mobile);

      if (selectedFile) {
        formData.append("profile", selectedFile);
      }

      const res = await updateProfileApiCall(formData).unwrap();
      dispatch(setCredentials({ ...res }));

      toast.success(res.message);
      setMode("view");
      setSelectedFile(null); // Clear selected file after upload
      setFilePreview(null); // Clear file preview after upload
    } catch (err) {
      toast.error(err?.data?.message || err.error);
    }
  };

  const sendResetPasswordOTP = async () => {
    try {
      const res = await sendResetPasswordOTPApiCall(userInfo).unwrap();
      dispatch(setOTPData({ ...res }));
      toast.success(res.message);
      navigate("/resetPassword");
    } catch (err) {
      toast.error(err?.data?.message || err.error);
    }
  };

  return (
    <div className="p-6 mb-10 min-h-[80vh] lg:w-[70%] mx-auto">
      <div className="flex items-center mb-4">
        <BackButton />
        <h2 className="text-2xl font-bold text-shark items-center flex justify-center w-full">
          Profile
        </h2>
      </div>
      <div className="flex mx-auto justify-center text-shark">
        <div className="flex flex-col md:flex-row bg-sharkLight-100/50 p-10 rounded-lg gap-8">
          <div className="flex flex-col items-center">
            <div className="relative mb-4 w-60 h-60 rounded-full overflow-hidden border-2 border-sharkLight-400">
              {/* Conditional rendering for image preview or existing profile */}
              <img
                src={
                  filePreview
                    ? filePreview
                    : profile // If profile is a non-empty string, use it
                    ? `${BACKEND_BASE_URL}${profile}` // Prepend backend URL
                    : `${BACKEND_BASE_URL}/uploads/profiles/placeholder.png`
                }
                alt="Profile"
                className="object-cover w-full h-full"
              />
              {mode === "edit" && (
                <label
                  htmlFor="profile-upload"
                  className="absolute inset-0 flex items-center justify-center bg-black bg-opacity-50 text-white cursor-pointer text-2xl"
                >
                  <FaCamera />
                </label>
              )}
            </div>
            {/* Hidden file input */}
            <input
              type="file"
              id="profile-upload"
              name="profile"
              accept="image/*"
              onChange={handleFileChange}
              className="hidden"
              ref={fileInputRef} // Attach ref
              disabled={mode === "view"}
            />

            <p className="text-sm text-sharkLight-400 mb-2">
              {mode === "edit" ? "Click camera icon to change" : ""}
            </p>

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
                    : "focus:outline-none focus:ring-2 focus:ring-sharkLight-400 focus:ring-opacity-50"
                }`}
                disabled={mode === "view"}
              />
            </div>
            {isAdmin && (
              <div className="flex justify-center items-center py-2 px-5 rounded-full mt-2 bg-light cursor-default text-xs">
                <div className="mr-2">
                  <FaUserLock />
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
              <div className="flex flex-col md:flex-row md:gap-1">
                <div className="flex flex-col gap-1 mb-2 md:mb-3">
                  <label htmlFor="firstName" className="font-medium text-xs">
                    First Name
                  </label>
                  <input
                    type="text"
                    id="firstName"
                    name="firstName"
                    value={firstName}
                    onChange={(e) => setFirstName(e.target.value)}
                    className={`w-full px-3 py-2 rounded border border-sharkLight-100 ${
                      mode === "view"
                        ? "focus:none bg-light"
                        : "focus:outline-none focus:ring-2 focus:ring-sharkLight-400 focus:ring-opacity-50"
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
                    id="lastName"
                    name="lastName"
                    value={lastName}
                    onChange={(e) => setLastName(e.target.value)}
                    className={`w-full px-3 py-2 rounded border border-sharkLight-100 ${
                      mode === "view"
                        ? "focus:none bg-light"
                        : "focus:outline-none focus:ring-2 focus:ring-sharkLight-400 focus:ring-opacity-50"
                    }`}
                    disabled={mode === "view"}
                  />
                </div>
              </div>

              <div className=" flex flex-col md:flex-row md:gap-1">
                <div className=" flex flex-col gap-1 mb-2 md:mb-3 md:w-[70%]">
                  <label htmlFor="email" className="flex items-center font-medium text-xs">
                    Email
                    {emailVerified ? (
                      <div className="ml-1 text-green-600">
                        <MdVerified />
                      </div>
                    ) : (
                      <div className="ml-1 text-red-600">
                        <PiSealWarningFill />
                      </div>
                    )}
                  </label>
                  <input
                    type="email"
                    id="email"
                    name="email"
                    value={email}
                    onChange={(e) => setEmail(e.target.value)}
                    className={`w-full px-3 py-2 rounded border border-sharkLight-100 ${
                      mode === "view"
                        ? "focus:none bg-light"
                        : "focus:outline-none focus:ring-2 focus:ring-sharkLight-400 focus:ring-opacity-50"
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
                    id="mobile"
                    name="mobile"
                    value={mobile}
                    onChange={(e) => setMobile(e.target.value)}
                    className={`w-full px-3 py-2 rounded border border-sharkLight-100 ${
                      mode === "view"
                        ? "focus:none bg-light"
                        : "focus:outline-none focus:ring-2 focus:ring-sharkLight-400 focus:ring-opacity-50"
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
                  id="address"
                  name="address"
                  value={address}
                  onChange={(e) => setAddress(e.target.value)}
                  className={`w-full px-3 py-2 rounded border border-sharkLight-100 ${
                    mode === "view"
                      ? "focus:none bg-light"
                      : "focus:outline-none focus:ring-2 focus:ring-sharkLight-400 focus:ring-opacity-50"
                  }`}
                  disabled={mode === "view"}
                />
              </div>

              <button
                type={mode === "edit" ? "submit" : "button"} // Button type changes based on mode
                className={`flex items-center justify-center w-full mt-5 px-4 py-2 text-white rounded ${
                  mode === "view"
                    ? "bg-shark hover:bg-sharkDark-100"
                    : "bg-green-800 hover:bg-green-900"
                }`}
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
