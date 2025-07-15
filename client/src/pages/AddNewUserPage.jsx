import { useState } from "react";
import { Link } from "react-router-dom";
import { toast } from "react-toastify";
import { useAddNewUserByAdminMutation } from "../slices/usersApiSlice";
import {
  FaCamera,
  FaCaretLeft,
  FaCheckCircle,
  FaUserLock,
  FaUserAlt,
  FaUserEdit,
} from "react-icons/fa";
import { MdVerified } from "react-icons/md";
import { PiSealWarningFill } from "react-icons/pi";
import Loader from "../components/Loader";

const AddNewUserPage = () => {
  // const [user, setUser] = useState({});

  const [firstName, setFirstName] = useState("");
  const [lastName, setLastName] = useState("");
  const [email, setEmail] = useState("");
  const [emailVerified, setEmailVerified] = useState(false);
  const [isAdmin, setIsAdmin] = useState(false);
  const [username, setUsername] = useState("");
  const profile = "/images/sample-profile.png";
  const [address, setAddress] = useState("");
  const [mobile, setMobile] = useState("");

  const [addNewUserApiCall, { isLoading }] = useAddNewUserByAdminMutation();

  const addNewUserHandler = async (e) => {
    e.preventDefault();

    try {
      const res = await addNewUserApiCall({
        firstName,
        lastName,
        email,
        emailVerified,
        isAdmin,
        username,
        profile,
        address,
        mobile,
      }).unwrap();

      toast.success(res.message);

      // TODO: Remove console log
      // console.log(res.message);
    } catch (err) {
      toast.error(err?.data?.message || err.error);
    }
  };

  return (
    <div>
      <div className="p-6 mb-10 min-h-[80vh] w-[90%] mx-auto">
        <div>
          <div className="flex items-center mb-4">
            <Link
              to="/admin/users"
              className="flex items-center mr-8 px-3 py-2 w-auto bg-shark text-light text-xs hover:bg-sharkDark-100 focus:outline-none rounded-lg"
            >
              <div className="mr-1">
                <FaCaretLeft />
              </div>
              Back
            </Link>
            <div className="text-2xl font-bold text-shark">Create New User</div>
          </div>
          <div className="flex mx-auto justify-center text-shark">
            <div className="flex flex-col md:flex-row bg-sharkLight-100/50 p-10 rounded-lg gap-8">
              <div className="flex flex-col items-center">
                <div id="profileImg" className="relative rounded-full overflow-hidden w-60">
                  <img src={profile} alt="Profile Picture" className="size-auto rounded" />

                  <div className="absolute inset-x-0 bottom-0 h-3/10 bg-shark/50 flex justify-center items-center p-5">
                    <FaCamera className="text-light text-2xl" />
                  </div>
                </div>
                <div className=" flex items-center gap-1 mt-2 md:my-3">
                  <label htmlFor="username" className="font-medium text-xs">
                    Username:
                  </label>
                  <input
                    name="username"
                    id="username"
                    value="Username"
                    onChange={(e) => setUsername(e.target.value)}
                    className="p-2 w-full rounded border italic
                       focus:outline-none focus:ring-2 focus:ring-sharkLight-400 focus:ring-opacity-50"
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
                        id="firstName"
                        value="Sample"
                        onChange={(e) => setFirstName(e.target.value)}
                        className="w-full px-3 py-2 rounded border border-sharkLight-100 focus:outline-none focus:ring-2 focus:ring-sharkLight-400 focus:ring-opacity-50"
                      />
                    </div>

                    <div className=" flex flex-col gap-1 mb-2 md:mb-3">
                      <label htmlFor="lastName" className="font-medium text-xs">
                        Last Name
                      </label>
                      <input
                        type="text"
                        name="lastName"
                        id="lastName"
                        value="User"
                        onChange={(e) => setLastName(e.target.value)}
                        className="w-full px-3 py-2 rounded border border-sharkLight-100 focus:outline-none focus:ring-2 focus:ring-sharkLight-400 focus:ring-opacity-50"
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
                        id="email"
                        value="email@email.com"
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

                  <div className=" flex flex-row justify-between px-1">
                    <div className="flex items-center mt-1">
                      {/* Admin Level Icons */}
                      {mode === "view" &&
                        (isAdmin ? (
                          <div className="mr-2">
                            <FaUserLock />
                          </div>
                        ) : (
                          <div className="mr-2 text-sm">
                            <FaUserAlt />
                          </div>
                        ))}
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
                      <label htmlFor="emailVerified" className="font-medium text-sm ">
                        Email Verified
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

                      {/* Verification Icons */}
                      {mode === "view" &&
                        (emailVerified ? (
                          <div className="ml-1 text-green-600">
                            <MdVerified />
                          </div>
                        ) : (
                          <div className="ml-1 text-red-600">
                            <PiSealWarningFill />
                          </div>
                        ))}
                    </div>
                  </div>

                  <button
                    type={mode === "edit" ? "submit" : "button"} // Submit button in edit mode
                    className="flex items-center justify-center w-full mt-5 px-4 py-2 bg-shark hover:bg-sharkDark-100 text-white rounded"
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
                          <FaCheckCircle />
                        </div>
                        Update User
                      </>
                    )}
                  </button>
                </form>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default AddNewUserPage;
