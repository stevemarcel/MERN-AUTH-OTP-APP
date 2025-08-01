import { useEffect, useState, useRef } from "react";
import { useNavigate, useParams } from "react-router-dom";
import { toast } from "react-toastify";
import {
	useGetUserByIdQuery,
	useUpdateUserByAdminMutation,
} from "../slices/usersApiSlice";
import { FaCamera, FaUserLock, FaUserAlt, FaUserPlus } from "react-icons/fa";
import { MdVerified } from "react-icons/md";
import { PiSealWarningFill } from "react-icons/pi";
import Loader from "../components/Loader";
import BackButton from "../components/BackButton";

const BACKEND_BASE_URL = "http://localhost:5000";

const CreateNewUserPage = () => {
	const { userId } = useParams();
	const { data: createdUserData, isLoading: isGettingUser } =
		useGetUserByIdQuery(userId);

	const [createdUser, setCreatedUser] = useState({});

	const [firstName, setFirstName] = useState("");
	const [lastName, setLastName] = useState("");
	const [email, setEmail] = useState("");
	const [isAdminCreatingUser, setIsAdminCreatingUser] = useState(false);
	const [emailVerified, setEmailVerified] = useState(false);
	const [isAdmin, setIsAdmin] = useState(false);
	const [username, setUsername] = useState("");
	const [profile, setProfile] = useState("");
	const [address, setAddress] = useState("");
	const [mobile, setMobile] = useState("");

	const [mode, setMode] = useState("edit");
	const [selectedFile, setSelectedFile] = useState(null);
	const [filePreview, setFilePreview] = useState(null);
	const fileInputRef = useRef(null);

	const navigate = useNavigate();

	const [updateUserApiCall, { isLoading: isUpdatingProfile }] =
		useUpdateUserByAdminMutation();

	useEffect(() => {
		if (createdUserData) {
			setCreatedUser(createdUserData);
			setFirstName(createdUserData.firstName);
			setLastName(createdUserData.lastName);
			setEmail(createdUserData.email);
			setIsAdminCreatingUser(createdUserData.isAdminCreatingUser);
			setEmailVerified(createdUserData.emailVerified);
			setIsAdmin(createdUserData.isAdmin);
			setUsername(createdUserData.username);
			setProfile(createdUserData.profile);
			setAddress(createdUserData.address);
			setMobile(createdUserData.mobile);
		}
	}, [createdUserData]);

	// Handle file selection for profile picture
	const handleFileChange = (e) => {
		const file = e.target.files[0];
		if (file) {
			setSelectedFile(file);
			setFilePreview(URL.createObjectURL(file));
			setProfile("");
		} else {
			setSelectedFile(null);
			setFilePreview(null);
			setProfile(createdUserData.profile || "");
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

	const updateUserHandler = async (e) => {
		e.preventDefault();

		try {
			const formData = new FormData();
			formData.append("_id", createdUser._id);
			formData.append("firstName", firstName);
			formData.append("lastName", lastName);
			formData.append("email", email);
			formData.append("isAdminCreatingUser", isAdminCreatingUser);
			formData.append("emailVerified", emailVerified);
			formData.append("isAdmin", isAdmin);

			formData.append("address", address);
			formData.append("mobile", mobile);

			// Create the username
			const randomDigits = Math.floor(10 + Math.random() * 90);
			const generatedUsername = `${firstName
				.toLowerCase()
				.replace(/\s/g, "")}${lastName
				.toLowerCase()
				.replace(/\s/g, "")}${randomDigits}`;

			// Use the provided username or the generated one
			formData.append("username", username ? username : generatedUsername);

			if (selectedFile) {
				formData.append("profile", selectedFile);
			}

			const res = await updateUserApiCall({
				userId: createdUser._id,
				formData,
			}).unwrap();
			// refetch();

			toast.success(res.message);
			setMode("view");
			setSelectedFile(null);
			setFilePreview(null);
			navigate(-1);
		} catch (err) {
			toast.error(err?.createdUserData?.message || err.error);
			setMode("view");
			setSelectedFile(null);
			setFilePreview(null);
		}
	};

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
						<div className="text-2xl font-bold text-shark flex justify-center w-full">
							Create New User
						</div>
					</div>
					<div className="flex mx-auto justify-center text-shark">
						<div className="flex flex-col md:flex-row bg-sharkLight-100/50 p-10 rounded-lg gap-8">
							<div className="flex flex-col items-center">
								{/* <div id="profileImg" className="relative rounded-full overflow-hidden w-60">
                  <img src={profile} alt="Profile Picture" className="size-auto rounded" />
                  {mode === "edit" && (
                    <div className="absolute inset-x-0 bottom-0 h-3/10 bg-shark/50 flex justify-center items-center p-5">
                      <FaCamera className="text-light text-2xl" />
                    </div>
                  )}
                </div> */}
								<div
									id="profileImg"
									className="relative mb-4 w-60 h-60 rounded-full overflow-hidden border-2 border-sharkLight-400"
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
							</div>
							<div id="userInformation" className="">
								<form
									onSubmit={(e) => {
										e.preventDefault();
									}}
								>
									<div className=" flex flex-col md:flex-row md:gap-1">
										<div className=" flex flex-col gap-1 mb-2 md:mb-3">
											<label
												htmlFor="firstName"
												className="font-medium text-xs"
											>
												First Name
											</label>
											<input
												type="text"
												name="firstName"
												value={firstName}
												onChange={(e) => setFirstName(e.target.value)}
												onFocus={(e) => e.target.select()}
												className={`w-full px-3 py-2 rounded border border-sharkLight-100 ${
													mode === "view"
														? "focus:none bg-light"
														: "focus:outline-none focus:ring-2 focus:ring-sharkLight-400 focus:ring-opacity-50 text-sharkLight-100"
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
												onFocus={(e) => e.target.select()}
												className={`w-full px-3 py-2 rounded border border-sharkLight-100 ${
													mode === "view"
														? "focus:none bg-light"
														: "focus:outline-none focus:ring-2 focus:ring-sharkLight-400 focus:ring-opacity-50 text-sharkLight-100"
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
												onFocus={(e) => e.target.select()}
												className={`w-full px-3 py-2 rounded border border-sharkLight-100 ${
													mode === "view"
														? "focus:none bg-light"
														: "focus:outline-none focus:ring-2 focus:ring-sharkLight-400 focus:ring-opacity-50 text-sharkLight-100"
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
												onFocus={(e) => e.target.select()}
												className={`w-full px-3 py-2 rounded border border-sharkLight-100 ${
													mode === "view"
														? "focus:none bg-light"
														: "focus:outline-none focus:ring-2 focus:ring-sharkLight-400 focus:ring-opacity-50 text-sharkLight-100"
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
											onFocus={(e) => e.target.select()}
											className={`w-full px-3 py-2 rounded border border-sharkLight-100 ${
												mode === "view"
													? "focus:none bg-light"
													: "focus:outline-none focus:ring-2 focus:ring-sharkLight-400 focus:ring-opacity-50 text-sharkLight-100"
											}`}
											disabled={mode === "view"}
										/>
									</div>
									<div className=" flex flex-col gap-1 mb-2 md:mb-3">
										<label htmlFor="address" className="font-medium text-xs">
											Username
										</label>
										<input
											type="text"
											name="username"
											// value={username}
											onChange={(e) => setUsername(e.target.value)}
											onFocus={(e) => e.target.select()}
											className={`w-full px-3 py-2 rounded border border-sharkLight-100 ${
												mode === "view"
													? "focus:none bg-light"
													: "focus:outline-none focus:ring-2 focus:ring-sharkLight-400 focus:ring-opacity-50 text-sharkLight-100"
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
												className={`h-4 w-4 p-3 ml-2 rounded text-xs accent-green-700 ${
													mode === "edit" ? "flex" : "hidden"
												}`}
											/>
										</div>

										<div className="flex items-center mt-1">
											{/* Verification Icons */}
											{emailVerified ? (
												<div className="mr-1 text-green-600">
													<MdVerified />
												</div>
											) : (
												<div className="mr-1 text-red-600">
													<PiSealWarningFill />
												</div>
											)}

											<label
												htmlFor="emailVerified"
												className="font-medium text-sm "
											>
												{emailVerified
													? "Email Verified"
													: "Email Not Verified"}
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

									{/* <div className=" flex gap-1 mt-2 md:mt-3 justify-center w-full">
                    <div className="flex items-center mt-1">
                      <input
                        type="checkbox"
                        id="isAdminCreatingUser"
                        name="isAdminCreatingUser"
                        checked={!isAdminCreatingUser}
                        onChange={(e) =>
                          setIsAdminCreatingUser(e.target.checked)
                        }
                        className={`h-4 w-4 p-3 mr-2 rounded text-xs accent-green-700 ${
                          mode === "edit" ? "flex" : "hidden"
                        }`}
                      />
                      <label htmlFor="isAdmin" className="font-medium text-sm">
                        By clicking this button, you are authorizing the
                        creation of a new user.
                      </label>
                    </div>
                  </div> */}

									<button
										type={mode === "edit" ? "submit" : "button"} // Submit button in edit mode
										className="flex items-center justify-center w-full mt-5 px-4 py-2 bg-green-800 hover:bg-green-900 text-white rounded"
										onClick={updateUserHandler}
									>
										{isUpdatingProfile ? (
											<div className="text-3xl">
												<Loader />
											</div>
										) : (
											<>
												<div className="mr-2">
													<FaUserPlus />
												</div>
												Create User
											</>
										)}
									</button>
								</form>
							</div>
						</div>
					</div>
				</div>
			)}
		</div>
	);
};

export default CreateNewUserPage;
