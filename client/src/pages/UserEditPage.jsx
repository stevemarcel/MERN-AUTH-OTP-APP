import { useEffect, useState, useRef } from "react";
import { useParams } from "react-router-dom";
import { toast } from "react-toastify";
import { FaCamera, FaUserLock, FaUserAlt, FaUserEdit, FaTimes, FaCheck } from "react-icons/fa";
import { MdVerified } from "react-icons/md";
import { PiSealWarningFill } from "react-icons/pi";

// Components Imports
import Loader from "../components/Loader";
import BackButton from "../components/BackButton";

// Redux Imports
import { useGetUserByIdQuery, useUpdateUserByAdminMutation } from "../slices/usersApiSlice";

// Constants
const BACKEND_BASE_URL = "http://localhost:5000";

const UserEditPage = () => {
  const { userId } = useParams();

  // !   --- API CALLS ---
  // API call to get user by ID
  const { data: userData, isLoading: isGettingUser } = useGetUserByIdQuery(userId);
  // API call to update user by admin
  const [updateUserByAdminApiCall, { isLoading: isUpdatingProfile }] =
    useUpdateUserByAdminMutation();

  // !   --- LOCAL STATE MANAGEMENT ---
  // State to manage user data
  const [firstName, setFirstName] = useState("");
  const [lastName, setLastName] = useState("");
  const [email, setEmail] = useState("");
  const [emailVerified, setEmailVerified] = useState(false);
  const [isAdmin, setIsAdmin] = useState(false);
  const [username, setUsername] = useState("");
  const [profile, setProfile] = useState("");
  const [address, setAddress] = useState("");
  const [mobile, setMobile] = useState("");
  // Mode state to toggle between view and edit
  const [mode, setMode] = useState("view");
  // State to manage file selection and preview
  const [selectedFile, setSelectedFile] = useState(null);
  const [filePreview, setFilePreview] = useState(null);
  const fileInputRef = useRef(null);

  // Populate form fields with user data when userData changes
  useEffect(() => {
    if (userData) {
      setFirstName(userData.firstName || "");
      setLastName(userData.lastName || "");
      setEmail(userData.email || "");
      setEmailVerified(userData.emailVerified);
      setIsAdmin(userData.isAdmin);
      setUsername(userData.username || "");
      setProfile(userData.profile || "");
      setAddress(userData.address || "");
      setMobile(userData.mobile || "");
    }
  }, [userData]);

  // !   --- HANDLERS ---
  // 1. Handle button click to toggle between view and edit mode
  const handleEditClick = () => {
    setMode(mode === "view" ? "edit" : "view");
    if (mode === "edit") {
      setSelectedFile(null);
      setFilePreview(null);
      setProfile(userData.profile || "");
    }
  };

  // 2. Cancel edits and reset form state
  const cancelEdits = () => {
    setMode("view");
    setFirstName(userData.firstName || "");
    setLastName(userData.lastName || "");
    setEmail(userData.email || "");
    setEmailVerified(userData.emailVerified);
    setIsAdmin(userData.isAdmin);
    setUsername(userData.username || "");
    setProfile(userData.profile || "");
    setAddress(userData.address || "");
    setMobile(userData.mobile || "");

    setSelectedFile(null);
    setFilePreview(null);
  };

  // 3. Handle file selection for profile picture
  const handleFileChange = (e) => {
    const file = e.target.files[0];
    if (file) {
      setSelectedFile(file);
      setFilePreview(URL.createObjectURL(file));
      setProfile("");
    } else {
      setSelectedFile(null);
      setFilePreview(null);
      setProfile(userData.profile || "");
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

  // 4. Handle update user form submission
  const updateUserHandler = async (e) => {
    e.preventDefault();

    try {
      const formData = new FormData();
      formData.append("firstName", firstName);
      formData.append("lastName", lastName);
      formData.append("email", email);
      formData.append("emailVerified", emailVerified);
      formData.append("isAdmin", isAdmin);
      formData.append("username", username);
      formData.append("address", address);
      formData.append("mobile", mobile);

      if (selectedFile) {
        formData.append("profile", selectedFile);
      }

      // Call the API to update user by admin
      const res = await updateUserByAdminApiCall({ userId, formData }).unwrap();

      toast.success(res.message);
      setMode("view");
      setSelectedFile(null);
      setFilePreview(null);
    } catch (err) {
      toast.error(err?.data?.message || err.error);
      setSelectedFile(null);
      setFilePreview(null);
    }
  };

  // !   --- RENDER ---
  return (
    <div className="p-6 mb-10 min-h-[80vh] w-[90%] mx-auto">
      {isGettingUser ? (
        <div className="flex justify-center p-8 text-9xl">
          <Loader />
        </div>
      ) : (
        <div>
          <div className="flex items-center mb-4">
            <BackButton />
            <div
              className={`text-xl uppercase font-bold items-center flex justify-center w-full ${
                mode === "edit" ? "text-green-700" : "text-shark"
              }`}
            >
              {mode === "view" ? (
                ""
              ) : (
                <div className="mr-3">
                  <FaUserEdit />
                </div>
              )}{" "}
              {mode === "view" ? "" : "Edit"} {userData.firstName} {userData.lastName}{" "}
              {mode === "view" ? "User" : ""}
            </div>
          </div>
          <div className="flex mx-auto justify-center text-shark">
            <div className="flex flex-col md:flex-row bg-sharkLight-100/50 p-10 rounded-lg gap-8">
              <div className="flex flex-col items-center">
                <div
                  id="profileImg"
                  className={`relative mb-4 w-60 h-60 rounded-full overflow-hidden border-2 border-sharkLight-400 ${
                    mode === "view"
                      ? "cursor-not-allowed"
                      : "transition duration-300 hover:scale-105 hover:shadow-sm"
                  }`}
                >
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
                <div className="flex items-center gap-1 mt-2 md:my-3">
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
                        : "focus:outline-none focus:ring-2 focus:ring-sharkLight-400 focus:ring-opacity-50 text-shark"
                    }`}
                    disabled={mode === "view"}
                  />
                </div>
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
                            : "focus:outline-none focus:ring-2 focus:ring-sharkLight-400 focus:ring-opacity-50 text-sharkLight-300"
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
                            : "focus:outline-none focus:ring-2 focus:ring-sharkLight-400 focus:ring-opacity-50 text-sharkLight-300"
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
                            : "focus:outline-none focus:ring-2 focus:ring-sharkLight-400 focus:ring-opacity-50 text-sharkLight-300"
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
                            : "focus:outline-none focus:ring-2 focus:ring-sharkLight-400 focus:ring-opacity-50 text-sharkLight-300"
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
                          : "focus:outline-none focus:ring-2 focus:ring-sharkLight-400 focus:ring-opacity-50 text-sharkLight-300"
                      }`}
                      disabled={mode === "view"}
                    />
                  </div>

                  <div className=" flex flex-row justify-between px-1">
                    <div className="flex items-center mt-1">
                      {/* Admin Level Icons */}
                      {isAdmin ? (
                        <div className="mr-2">
                          <FaUserLock />
                        </div>
                      ) : (
                        <div className="mr-2 text-sm">
                          <FaUserAlt />
                        </div>
                      )}

                      <label htmlFor="isAdmin" className="font-medium text-sm">
                        {isAdmin ? "Admin User" : "Regular User"}
                      </label>
                      <input
                        type="checkbox"
                        id="isAdmin"
                        name="isAdmin"
                        checked={isAdmin}
                        onChange={(e) => setIsAdmin(e.target.checked)}
                        className={`h-4 w-4 p-3 ml-2 rounded text-xs accent-green-600 ${
                          mode === "edit" ? "flex" : "hidden"
                        }`}
                      />
                    </div>

                    <div className="flex items-center mt-1">
                      {/* Verification Icons */}
                      {emailVerified ? (
                        <div className="ml-1 text-green-600">
                          <MdVerified />
                        </div>
                      ) : (
                        <div className="ml-1 text-red-600">
                          <PiSealWarningFill />
                        </div>
                      )}

                      <label htmlFor="emailVerified" className="font-medium text-sm ">
                        {emailVerified ? "Email Verified" : "Email Not Verified"}
                      </label>
                      <input
                        type="checkbox"
                        id="emailVerified"
                        name="emailVerified"
                        checked={emailVerified}
                        onChange={(e) => setEmailVerified(e.target.checked)}
                        className={`h-4 w-4 p-3 ml-2 rounded text-xs accent-green-600 ${
                          mode === "edit" ? "flex" : "hidden"
                        }`}
                      />
                    </div>
                  </div>

                  <div className="flex gap-2 text-xs md:text-sm md:mt-9">
                    <button
                      type={mode === "edit" ? "submit" : "button"} // Submit button in edit mode
                      className={`flex items-center justify-center mt-5 px-4 py-2  text-white rounded transition duration-300 hover:scale-105 hover:shadow-md ${
                        mode === "edit"
                          ? "bg-green-800 hover:bg-green-900 w-1/2"
                          : "bg-shark hover:bg-sharkDark-100 w-full"
                      }`}
                      onClick={mode === "edit" ? updateUserHandler : handleEditClick}
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
                          Edit User
                        </>
                      ) : (
                        <>
                          <div className="mr-2">
                            <FaCheck />
                          </div>
                          Save Changes
                        </>
                      )}
                    </button>
                    {mode === "edit" && (
                      <button
                        type="button"
                        className="flex items-center justify-center mt-5 px-4 py-2 bg-red-800 hover:bg-red-800/90 w-1/2 text-white rounded transition duration-300 hover:scale-105 hover:shadow-md"
                        onClick={cancelEdits}
                      >
                        <div className="mr-2">
                          <FaTimes />
                        </div>
                        Cancel Edits
                      </button>
                    )}
                  </div>
                </form>
              </div>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};

export default UserEditPage;
