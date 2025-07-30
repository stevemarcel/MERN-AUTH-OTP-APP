import { Link, useNavigate } from "react-router-dom";
import { useEffect, useState } from "react";
import {
	FaCheckCircle,
	FaChevronLeft,
	FaChevronRight,
	FaUserPlus,
	FaUsersSlash,
	// FaSearch,
	FaTimesCircle,
	FaUser,
	FaAt,
	FaEnvelope,
	FaCalendarDay,
	FaCalendarWeek,
} from "react-icons/fa";
import { MdDelete } from "react-icons/md";
import { IoIosEye } from "react-icons/io";
// import UserTable from "../components/UserTable";
import { toast } from "react-toastify";

// --- USERS API SLICE HOOKS ---
import {
	useGetUsersQuery,
	useRegisterMutation,
	useDeleteUserMutation,
	useDeleteUsersByAdminMutation,
} from "../slices/usersApiSlice";

// --- LOCAL COMPONENTS IMPORTS ---
import Loader from "../components/Loader";
import BackButton from "../components/BackButton";
import SearchFilterDropdown from "../components/SearchFilterDropdown";

const BACKEND_BASE_URL = "http://localhost:5000";

const UserListPage = () => {
	//! --- REACT QUERY API CALLS ---
	const { data, isLoading: isGettingUsers, refetch } = useGetUsersQuery();
	const [registerApiCall, { isLoading: isRegisteringUser }] =
		useRegisterMutation();
	const [deleteUserApiCall, { isLoading: isDeletingUser }] =
		useDeleteUserMutation();
	const [deleteUsersByAdminApiCall, { isLoading: isDeletingMultipleUsers }] =
		useDeleteUsersByAdminMutation();

	//! --- LOCAL STATE DEFINITIONS ---
	// Users States
	const [allUsersData, setAllUsersData] = useState([]);
	const [filteredUsers, setFilteredUsers] = useState([]);
	// State Store for Pagination
	const [currentPage, setCurrentPage] = useState(1);
	const [usersPerPage] = useState(10);
	// State Store for Search
	const [searchTerm, setSearchTerm] = useState("");
	const [searchFilter, setSearchFilter] = useState("name");
	// State Store for deleting user
	const [isConfirmOpen, setIsConfirmOpen] = useState(false);
	const [deleteId, setDeleteId] = useState(null);
	// State for Selected Users and Bulk Delete Confirmation
	const [selectedUserIds, setSelectedUserIds] = useState(new Set()); // Using a Set for efficient add/delete/check
	const [isBulkConfirmOpen, setIsBulkConfirmOpen] = useState(false);

	// For Selecting User(s)
	// const [isChecked, setIsChecked] = useState([]);

	//! --- To prevent multiple or delayed fetch from API ---
	useEffect(() => {
		if (data && data.users) {
			setAllUsersData(data.users);
			setFilteredUsers(data.users);
			setCurrentPage(1); // Good practice to reset pagination after new data fetch
			setSelectedUserIds(new Set()); // Clear selections when new data arrives
		}
	}, [data]);

	const navigate = useNavigate();

	//! --- SEARCH FILTERING LOGIC ---
	useEffect(() => {
		let currentFilteredUsers = allUsersData;

		if (searchTerm) {
			const lowerCaseSearchTerm = searchTerm.toLowerCase();

			// Helper array for month names (0-indexed for Date.getMonth())
			const monthNames = [
				"january",
				"february",
				"march",
				"april",
				"may",
				"june",
				"july",
				"august",
				"september",
				"october",
				"november",
				"december",
			];

			currentFilteredUsers = allUsersData.filter((user) => {
				if (searchFilter === "name") {
					const fullName = `${user.firstName} ${user.lastName}`.toLowerCase();
					return fullName.includes(lowerCaseSearchTerm);
				} else if (searchFilter === "username") {
					return (
						user.username &&
						user.username.toLowerCase().includes(lowerCaseSearchTerm)
					);
				} else if (searchFilter === "email") {
					return (
						user.email && user.email.toLowerCase().includes(lowerCaseSearchTerm)
					);
				} else if (searchFilter === "memberSinceMonth") {
					if (!user.createdAt) return false; // Skip if no creation date
					const date = new Date(user.createdAt);
					const monthNumber = (date.getMonth() + 1).toString(); // "1" for Jan, "10" for Oct
					const monthName = monthNames[date.getMonth()]; // "january", "october"
					// Check if the search term matches the month number OR the month name
					return (
						monthNumber.includes(lowerCaseSearchTerm) ||
						monthName.includes(lowerCaseSearchTerm)
					);
				} else if (searchFilter === "memberSinceYear") {
					if (!user.createdAt) return false; // Skip if no creation date
					const date = new Date(user.createdAt);
					const year = date.getFullYear().toString();
					return year.includes(lowerCaseSearchTerm);
				}
				return false; // Fallback, though ideally all filter options are handled
			});
		}

		setFilteredUsers(currentFilteredUsers);
		setCurrentPage(1); // IMPORTANT: Always reset to the first page when search/filter changes
		setSelectedUserIds(new Set()); // Clear selections when filter/search changes
	}, [searchTerm, searchFilter, allUsersData]);

	// Define Dropdown Options
	const filterOptions = [
		{ value: "name", label: "Name", icon: <FaUser /> },
		{ value: "username", label: "Username", icon: <FaAt /> },
		{ value: "email", label: "Email", icon: <FaEnvelope /> },
		{
			value: "memberSinceMonth",
			label: "Month Joined",
			icon: <FaCalendarDay />,
		},
		{
			value: "memberSinceYear",
			label: "Year Joined",
			icon: <FaCalendarWeek />,
		},
	];

	//! --- CHECKBOX HANDLERS ---
	// Users currently visible on the page (after filter & pagination)
	const usersOnCurrentPage = filteredUsers.slice(
		(currentPage - 1) * usersPerPage,
		currentPage * usersPerPage
	);

	// This is for the header checkbox's 'checked' state
	const isAllOnPageSelected =
		usersOnCurrentPage.length > 0 &&
		usersOnCurrentPage.every((user) => selectedUserIds.has(user._id));

	// Handler for the header checkbox (select/deselect all on current page)
	const handleSelectAll = () => {
		const newSelectedUserIds = new Set(selectedUserIds);
		if (isAllOnPageSelected) {
			// Deselect all users currently visible on the page
			usersOnCurrentPage.forEach((user) => newSelectedUserIds.delete(user._id));
		} else {
			// Select all users currently visible on the page
			usersOnCurrentPage.forEach((user) => newSelectedUserIds.add(user._id));
		}
		setSelectedUserIds(newSelectedUserIds);
	};

	// Handler for individual user checkboxes
	const handleSelectUser = (userId) => {
		const newSelectedUserIds = new Set(selectedUserIds);
		if (newSelectedUserIds.has(userId)) {
			newSelectedUserIds.delete(userId);
		} else {
			newSelectedUserIds.add(userId);
		}
		setSelectedUserIds(newSelectedUserIds);
	};

	//! --- USER TABLE PAGINATION FUNCTIONS ---
	// Prepare Users for Display (Pagination Slice)
	const usersToDisplay = filteredUsers.slice(
		(currentPage - 1) * usersPerPage,
		currentPage * usersPerPage
	);

	// Change Page function
	const handlePageChange = (page) => {
		setCurrentPage(page);
	};

	// Pagination component
	const renderPagination = () => {
		const totalPages = Math.ceil(filteredUsers.length / usersPerPage);

		if (totalPages <= 1) return null;

		const pageNumbers = [];
		for (let i = 1; i <= Math.min(totalPages, 5); i++) {
			pageNumbers.push(i);
		}

		if (totalPages > 5) {
			pageNumbers.push("...");
			pageNumbers.push(totalPages - 1);
			pageNumbers.push(totalPages);
		}

		return (
			<div className="flex justify-end gap-1 items-center">
				<button
					className="disabled:opacity-30 disabled:hover:cursor-not-allowed disabled:hover:font-normal disabled:transition-none
                      disabled:hover:scale-100 disabled:hover:shadow-none hover:font-medium bg-sharkLight-100
                      px-2 py-1 rounded text-sm transition duration-300 hover:scale-105 hover:shadow-md"
					disabled={currentPage === 1}
					onClick={() => handlePageChange(currentPage - 1)}
				>
					<div className="flex items-center gap-2">
						<FaChevronLeft />
						Prev
					</div>
				</button>
				{pageNumbers.map((pageNumber) => (
					<button
						key={pageNumber}
						className={`px-2 py-1 rounded w-8 text-sm hover:font-semibold transition duration-300 hover:scale-105 hover:shadow-md ${
							currentPage === pageNumber
								? "bg-shark text-light font-bold hover:font-bold"
								: "bg-sharkLight-100"
						}`}
						onClick={() => handlePageChange(pageNumber)}
					>
						{pageNumber === "..." ? pageNumber : pageNumber.toString()}
					</button>
				))}
				<button
					className="disabled:opacity-30 disabled:hover:cursor-not-allowed disabled:hover:font-normal disabled:transition-none
                      disabled:hover:scale-100 disabled:hover:shadow-none hover:font-medium bg-sharkLight-100
                      px-2 py-1 rounded text-sm transition duration-300 hover:scale-105 hover:shadow-md"
					disabled={currentPage === totalPages}
					onClick={() => handlePageChange(currentPage + 1)}
				>
					<div className="flex items-center gap-2">
						Next
						<FaChevronRight />
					</div>
				</button>
			</div>
		);
	};

	// ! --- ADD NEW USER FUNCTION ---
	const addUserHandler = async () => {
		const firstName = "Sample";
		const lastName = "User";

		// Create the username
		const randomDigits = Math.floor(10 + Math.random() * 90);
		const generatedUsername = `${firstName
			.toLowerCase()
			.replace(/\s/g, "")}${lastName
			.toLowerCase()
			.replace(/\s/g, "")}${randomDigits}`;

		// Prepare the new user data
		const newUserData = {
			firstName: firstName,
			lastName: lastName,
			email: "sampleuser@example.com",
			password: "sample12345",
			confirmPassword: "sample12345",
			isAdminCreatingUser: true,
			username: generatedUsername,
		};

		try {
			const addUserRes = await registerApiCall(newUserData).unwrap();

			navigate(`/admin/user/${addUserRes._id}/create`);
			refetch();
		} catch (err) {
			toast.error(err?.data?.message || err.error);
		}
	};

	// ! --- DELETE USER FUNCTIONS ---
	// Confirmation Popup for Delete Single User By ID
	const deleteUserPopup = async (id) => {
		setDeleteId(id);
		setIsConfirmOpen(true);
	};
	// Cancel Confirmation Popup for Delete Single User By ID
	const handleCancelDelete = () => {
		setIsConfirmOpen(false);
		setDeleteId(null);
	};

	// Delete Single User By ID Function
	const deleteUserByIdHandler = async () => {
		if (deleteId) {
			try {
				const delUserRes = await deleteUserApiCall(deleteId).unwrap();
				toast.success(delUserRes.message);
				setIsConfirmOpen(false);
				setDeleteId(null);
			} catch (err) {
				setIsConfirmOpen(false);
				setDeleteId(null);
				toast.error(err?.data?.message || err.error);
			}
		}
	};

	// Confirmation Popup for Bulk Delete Users
	const handleDeleteMultipleUsersPopup = () => {
		if (selectedUserIds.size === 0) {
			toast.error("Please select users to delete.");
			return;
		}
		setIsBulkConfirmOpen(true);
	};
	// Cancel Confirmation Popup for Bulk Delete Users
	const cancelBulkDelete = () => {
		setIsBulkConfirmOpen(false);
	};

	// Delete Multiple Users Function
	const confirmBulkDeleteHandler = async () => {
		try {
			// Convert Set to Array for the API call
			const idsToDelete = Array.from(selectedUserIds);
			const delUsersRes = await deleteUsersByAdminApiCall(idsToDelete).unwrap();
			toast.success(delUsersRes.message);
			setIsBulkConfirmOpen(false);
			setSelectedUserIds(new Set());
		} catch (err) {
			setIsBulkConfirmOpen(false);
			setSelectedUserIds(new Set());
			toast.error(err?.data?.message || err.error);
		}
	};

	return (
		<div className="p-6 mb-10 min-h-[80vh] w-[90%] mx-auto">
			<div className="flex flex-col mb-4 md:flex-row md:justify-between">
				<div className="flex items-center  w-full mb-4 md:mb-0">
					<BackButton />
					<h2 className=" text-2xl md:text-3xl font-bold md:mb-0 text-shark uppercase flex justify-center w-full">
						Manage Users
					</h2>
				</div>

				{/* Add and Delete Users Button */}
				<div className="flex gap-2 w-full md:w-4/5 text-sm">
					<button
						type="submit"
						className="flex col-span-2 w-full items-center justify-center px-3 py-2 bg-green-800 hover:bg-green-900 text-white rounded
            transition duration-300 hover:scale-105 hover:shadow-md"
						onClick={addUserHandler}
					>
						{isRegisteringUser ? (
							<div className="text-3xl">
								<Loader />
							</div>
						) : (
							<>
								<div className="mr-2">
									<FaUserPlus />
								</div>
								Add User
							</>
						)}
					</button>
					<button
						type="button"
						className="flex col-span-2 items-center justify-center px-3 py-2 bg-red-800 hover:bg-red-900 text-white rounded w-full disabled:hover:font-normal
                      disabled:hover:scale-100 disabled:hover:shadow-none disabled:opacity-50 disabled:cursor-not-allowed disabled:bg-red-800 disabled:transition-none
                      transition duration-300 hover:scale-105 hover:shadow-md"
						onClick={handleDeleteMultipleUsersPopup}
						disabled={selectedUserIds.size === 0 || isDeletingMultipleUsers} // Disabled if no users selected or if deletion is in progress
					>
						<div className="mr-2">
							{isDeletingMultipleUsers ? <Loader /> : <FaUsersSlash />}
						</div>
						Delete Users ({selectedUserIds.size})
					</button>
				</div>
			</div>

			{/* Search Bar */}
			<div className="flex gap-1 mb-4 items-center">
				{/* Filter Dropdown */}
				<SearchFilterDropdown
					searchFilter={searchFilter}
					setSearchFilter={setSearchFilter}
					options={filterOptions}
				/>

				{/* Search Input */}
				<input
					type="text"
					placeholder="Search users..."
					// placeholder={`Search user by "${searchFilter}"...`}
					value={searchTerm}
					onChange={(e) => setSearchTerm(e.target.value)}
					className="px-3 py-2 rounded border border-sharkLight-100 focus:outline-none focus:ring-2 focus:ring-sharkLight-400 flex-grow"
				/>
				<div className="hidden md:flex">{renderPagination()}</div>
			</div>

			{/* Users Table */}
			<div className="text-shark">
				{/* <UserTable allUsers={allUsers} /> */}
				<div className="w-full p-4 bg-sharkLight-100/30 shadow-md rounded">
					<table className="w-full">
						<thead>
							<tr className="text-left border-b border-shark">
								<th className="p-2">
									<input
										type="checkbox"
										onChange={handleSelectAll}
										checked={isAllOnPageSelected}
										// Indeterminate state: if some but not all users on the current page are selected
										ref={(el) => {
											if (el) {
												el.indeterminate =
													selectedUserIds.size > 0 && !isAllOnPageSelected;
											}
										}}
									/>
								</th>
								<th className="p-2">S/N</th>
								<th className="p-2">Name</th>
								<th className="p-2 md:table-cell hidden">Email</th>
								<th className="p-2 md:table-cell hidden">Member Since</th>
								<th className="p-2 md:table-cell hidden text-center">Admin</th>
								<th className="p-2 text-center">Options</th>
							</tr>
						</thead>

						<tbody>
							{isGettingUsers ? (
								<tr>
									<td colSpan="7" className="text-center p-4">
										<div className="flex justify-center p-8"></div>
										<Loader /> Loading users...
									</td>
								</tr>
							) : filteredUsers.length === 0 ? (
								<tr>
									<td
										colSpan="7"
										className="text-center p-4 text-sharkLight-300 italic"
									>
										No matching users found.
									</td>
								</tr>
							) : (
								usersToDisplay.map((user, index) => (
									<tr
										key={user._id}
										className={`text-left text-xs border-gray-200 transition-all duration-300 hover:bg-sharkLight-100/50 hover:scale-105 hover:shadow-md ${
											selectedUserIds.has(user._id)
												? "bg-sharkLight-100 border-l-4 border-shark"
												: ""
										}`}
									>
										<td className="p-2">
											<input
												type="checkbox"
												checked={selectedUserIds.has(user._id)}
												onChange={() => handleSelectUser(user._id)}
											/>
										</td>
										<td className="p-2 text-center">
											{index + 1 + (currentPage - 1) * usersPerPage}
										</td>
										<td className="p-2">
											{
												<div className="flex gap-2 items-center">
													<div className="hidden md:block  w-8 h-8 mr-1 rounded-full overflow-hidden">
														<img
															src={`${BACKEND_BASE_URL}${user.profile}`}
															alt="Profile Picture"
															className="object-cover w-full h-full"
														/>
													</div>
													<div className="flex flex-col">
														<span>
															{user.firstName} {user.lastName}
														</span>
														<span className="italic font-mono text-xs">{`@${user.username}`}</span>
													</div>
												</div>
											}
										</td>
										<td className="p-2 md:table-cell hidden">
											<a href={`mailto:${user.email}`}>{user.email}</a>
										</td>
										{/* <td className="p-2 md:table-cell hidden">{user.createdAt.split("T")[0]}</td> */}
										<td className="p-2 md:table-cell hidden">
											{new Intl.DateTimeFormat("en-US", {
												day: "numeric", // e.g., 15
												month: "short", // e.g., Dec
												year: "numeric", // e.g., 2025
												hour: "2-digit", // e.g., 11
												minute: "2-digit", // e.g., 32
												hour12: true, // e.g., AM/PM
											}).format(new Date(user.createdAt))}
										</td>
										<td className="p-2 md:table-cell hidden">
											<div
												className={`flex justify-center ${
													user.isAdmin
														? "text-green-600"
														: "text-sharkLight-300"
												}`}
											>
												{user.isAdmin ? <FaCheckCircle /> : <FaTimesCircle />}
											</div>
										</td>
										<td className="p-2">
											<div className="flex gap-2 justify-center">
												<div className="group relative">
													<Link
														to={`/admin/user/${user._id}/edit`}
														className="flex col-span-2 items-center justify-center p-2 bg-shark hover:bg-sharkDark-300 text-white rounded"
													>
														<IoIosEye />
													</Link>
													{/* Custom Tooltip for View Button */}
													<span
														className="absolute bottom-full left-1/2 -translate-x-1/2 mb-2
                            px-2 py-1 text-xs text-white bg-sharkDark-300 rounded-md
                            opacity-0 group-hover:opacity-100 transition-opacity duration-300
                            whitespace-nowrap z-10 pointer-events-none"
													>
														{`View ${user.firstName}`}
													</span>
												</div>
												<div className="group relative">
													<button
														type="button"
														className="flex col-span-2 items-center justify-center p-2 bg-red-800 hover:bg-red-900 text-white rounded"
														onClick={() => deleteUserPopup(user._id)}
														disabled={isDeletingUser}
													>
														{isDeletingUser ? (
															<div>
																<Loader />
															</div>
														) : (
															<MdDelete />
														)}
													</button>
													{/* Custom Tooltip for Delete Button */}
													<span
														className="absolute bottom-full left-1/2 -translate-x-1/2 mb-2
                            px-2 py-1 text-xs text-white bg-red-900 rounded-md
                            opacity-0 group-hover:opacity-100 transition-opacity duration-300
                            whitespace-nowrap z-10 pointer-events-none"
													>
														{`Delete ${user.firstName}`}
													</span>
												</div>
											</div>
										</td>
									</tr>
								))
							)}
						</tbody>
					</table>
					<div className="flex justify-center md:justify-end mt-4">
						{renderPagination()}
					</div>

					{/* Delete Single User by ID Confirmation Popup */}
					{isConfirmOpen && (
						<div className="fixed inset-0 flex items-center justify-center z-50 bg-opacity-50 bg-sharkDark-500">
							<div className="w-4/5 md:w-3/5 lg:w-2/5 bg-white p-8 rounded-md text-sm">
								<h2 className="flex justify-center font-bold text-xl">
									Delete User
								</h2>
								<p className="flex justify-center text-center">
									Are you sure you want to delete this user?
								</p>
								<div className="mt-5 flex justify-center gap-3 text-xs md:text-sm">
									<button
										className="flex col-span-2 items-center justify-center px-2 py-1 bg-red-800 hover:bg-red-900 text-white rounded w-1/2
                    transition duration-300 hover:scale-105 hover:shadow-md"
										onClick={deleteUserByIdHandler}
									>
										<div className="mr-2">
											{isDeletingUser ? <Loader /> : <MdDelete />}
										</div>
										Confirm Delete
									</button>
									<button
										className="items-center justify-center px-2 py-1 bg-sharkLight-100 hover:bg-sharkLight-100/90 rounded w-1/2
                    transition duration-300 hover:scale-105 hover:shadow-md"
										onClick={handleCancelDelete}
									>
										Cancel
									</button>
								</div>
							</div>
						</div>
					)}

					{/* Delete Multiple Users Confirmation Popup */}
					{isBulkConfirmOpen && (
						<div className="fixed inset-0 flex items-center justify-center z-50 bg-opacity-50 bg-sharkDark-500">
							<div className="w-4/5 md:w-3/5 lg:w-2/5 bg-white p-8 pb-5 rounded-md text-shark text-sm">
								<h2 className="flex justify-center font-bold text-xl">
									Delete {selectedUserIds.size} {""}{" "}
									{selectedUserIds.size === 1 ? "User" : "Users"}
								</h2>
								<p className="flex justify-center text-center">
									Are you sure you want to delete {selectedUserIds.size}{" "}
									selected users?
								</p>
								<div className="mt-5 flex justify-end gap-3 text-xs md:text-sm">
									<button
										className="flex col-span-2 items-center justify-center px-2 py-1 bg-red-800 hover:bg-red-900 text-white rounded w-1/2
                    transition duration-300 hover:scale-105 hover:shadow-md disabled:opacity-50"
										onClick={confirmBulkDeleteHandler}
										disabled={isDeletingMultipleUsers}
									>
										<div className="mr-2">
											{isDeletingMultipleUsers ? "..." : <FaUsersSlash />}
										</div>
										Confirm Delete
									</button>
									<button
										className="items-center justify-center px-3 py-2 bg-sharkLight-100 hover:bg-sharkLight-200 rounded w-1/2 
                    transition duration-300 hover:scale-105 hover:shadow-md"
										onClick={cancelBulkDelete}
									>
										Cancel
									</button>
								</div>
							</div>
						</div>
					)}
				</div>
			</div>
		</div>
	);
};

export default UserListPage;
