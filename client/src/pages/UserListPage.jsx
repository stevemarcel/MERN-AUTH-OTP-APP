import { useNavigate } from "react-router-dom";
import { useEffect, useState } from "react";
import {
	FaUserPlus,
	FaUsersSlash,
	FaUser,
	FaAt,
	FaEnvelope,
	FaCalendarDay,
	FaCalendarWeek,
} from "react-icons/fa";
import { toast } from "react-toastify";

// --- API SLICE HOOKS ---
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
import UserTablePaginationControls from "../components/UserTablePaginationControls";
import ConfirmationModal from "../components/ConfirmationModal";
import UserTable from "../components/UserTable";

const BACKEND_BASE_URL = "http://localhost:5000";

const UserListPage = () => {
	// --- REACT QUERY API CALLS ---
	const { data, isLoading: isGettingUsers, refetch } = useGetUsersQuery();
	const [registerApiCall, { isLoading: isRegisteringUser }] =
		useRegisterMutation();
	const [deleteUserApiCall, { isLoading: isDeletingUser }] =
		useDeleteUserMutation();
	const [deleteUsersByAdminApiCall, { isLoading: isDeletingMultipleUsers }] =
		useDeleteUsersByAdminMutation();

	// --- LOCAL STATE DEFINITIONS ---
	const [allUsersData, setAllUsersData] = useState([]); //
	const [filteredUsers, setFilteredUsers] = useState([]); //
	const [currentPage, setCurrentPage] = useState(1); //
	const [usersPerPage] = useState(10); //
	const [searchTerm, setSearchTerm] = useState(""); //
	const [searchFilter, setSearchFilter] = useState("name"); //
	const [deleteId, setDeleteId] = useState(null); //
	const [selectedUserIds, setSelectedUserIds] = useState(new Set()); //

	// State for Confirmation Modals
	const [showSingleDeleteConfirm, setShowSingleDeleteConfirm] = useState(false);
	const [showBulkDeleteConfirm, setShowBulkDeleteConfirm] = useState(false);

	const navigate = useNavigate(); //

	// --- EFFECT: Initialize/Update users data when API data changes ---
	useEffect(() => {
		if (data && data.users) {
			setAllUsersData(data.users); //
			setFilteredUsers(data.users); //
			setCurrentPage(1); // Reset pagination after new data fetch
			setSelectedUserIds(new Set()); // Clear selections when new data arrives
		}
	}, [data]); //

	// --- EFFECT: Handle Search and Filtering Logic ---
	useEffect(() => {
		let currentFilteredUsers = allUsersData; //

		if (searchTerm) {
			//
			const lowerCaseSearchTerm = searchTerm.toLowerCase(); //
			const monthNames = [
				//
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
				//
				if (searchFilter === "name") {
					//
					const fullName = `${user.firstName} ${user.lastName}`.toLowerCase(); //
					return fullName.includes(lowerCaseSearchTerm); //
				} else if (searchFilter === "username") {
					//
					return (
						user.username &&
						user.username.toLowerCase().includes(lowerCaseSearchTerm)
					); //
				} else if (searchFilter === "email") {
					//
					return (
						user.email && user.email.toLowerCase().includes(lowerCaseSearchTerm)
					); //
				} else if (searchFilter === "memberSinceMonth") {
					//
					if (!user.createdAt) return false; //
					const date = new Date(user.createdAt); //
					const monthNumber = (date.getMonth() + 1).toString(); //
					const monthName = monthNames[date.getMonth()]; //
					return (
						//
						monthNumber.includes(lowerCaseSearchTerm) ||
						monthName.includes(lowerCaseSearchTerm)
					);
				} else if (searchFilter === "memberSinceYear") {
					//
					if (!user.createdAt) return false; //
					const date = new Date(user.createdAt); //
					const year = date.getFullYear().toString(); //
					return year.includes(lowerCaseSearchTerm); //
				}
				return false;
			});
		}

		setFilteredUsers(currentFilteredUsers); //
		setCurrentPage(1); // Always reset to the first page when search/filter changes
		setSelectedUserIds(new Set()); // Clear selections when filter/search changes
	}, [searchTerm, searchFilter, allUsersData]); //

	const filterOptions = [
		//
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

	// Users currently visible on the page (after filter & pagination)
	const usersOnCurrentPage = filteredUsers.slice(
		//
		(currentPage - 1) * usersPerPage, //
		currentPage * usersPerPage //
	); //

	// This is for the header checkbox's 'checked' state
	const isAllOnPageSelected = //
		usersOnCurrentPage.length > 0 && //
		usersOnCurrentPage.every((user) => selectedUserIds.has(user._id)); //

	// Handler for the header checkbox (select/deselect all on current page)
	const handleSelectAll = () => {
		//
		const newSelectedUserIds = new Set(selectedUserIds); //
		if (isAllOnPageSelected) {
			//
			usersOnCurrentPage.forEach((user) => newSelectedUserIds.delete(user._id)); //
		} else {
			usersOnCurrentPage.forEach((user) => newSelectedUserIds.add(user._id)); //
		}
		setSelectedUserIds(newSelectedUserIds); //
	};

	// Handler for individual user checkboxes
	const handleSelectUser = (userId) => {
		//
		const newSelectedUserIds = new Set(selectedUserIds); //
		if (newSelectedUserIds.has(userId)) {
			//
			newSelectedUserIds.delete(userId); //
		} else {
			newSelectedUserIds.add(userId); //
		}
		setSelectedUserIds(newSelectedUserIds); //
	};

	// --- ADD NEW USER FUNCTION ---
	const addUserHandler = async () => {
		//
		const newUserData = {
			//
			firstName: "Sample",
			lastName: "User",
			email: "sampleuser@example.com",
			password: "sample12345",
			isAdminCreatingUser: true,
			confirmPassword: "sample12345",
		};
		try {
			const addUserRes = await registerApiCall(newUserData).unwrap(); //
			navigate(`/admin/user/${addUserRes._id}/create`); //
			refetch(); //
		} catch (err) {
			toast.error(err?.data?.message || err.error); //
		}
	};

	// --- DELETE USER FUNCTIONS ---
	// Open confirmation for single user delete
	const openSingleDeleteConfirm = (id) => {
		setDeleteId(id); //
		setShowSingleDeleteConfirm(true);
	};

	// Confirm single user delete
	const confirmSingleDelete = async () => {
		if (deleteId) {
			//
			try {
				const delUserRes = await deleteUserApiCall(deleteId).unwrap(); //
				toast.success(delUserRes.message); //
				setShowSingleDeleteConfirm(false);
				setDeleteId(null); //
				refetch(); // Refetch users after deletion
			} catch (err) {
				setShowSingleDeleteConfirm(false);
				setDeleteId(null); //
				toast.error(err?.data?.message || err.error); //
			}
		}
	};

	// Cancel single user delete
	const cancelSingleDelete = () => {
		setShowSingleDeleteConfirm(false);
		setDeleteId(null); //
	};

	// Open confirmation for bulk delete
	const openBulkDeleteConfirm = () => {
		if (selectedUserIds.size === 0) {
			//
			toast.error("Please select users to delete."); //
			return;
		}
		setShowBulkDeleteConfirm(true);
	};

	// Confirm bulk delete
	const confirmBulkDelete = async () => {
		try {
			const idsToDelete = Array.from(selectedUserIds); // Convert Set to Array for the API call
			const delUsersRes = await deleteUsersByAdminApiCall(idsToDelete).unwrap(); //
			toast.success(delUsersRes.message); //
			setShowBulkDeleteConfirm(false);
			setSelectedUserIds(new Set()); // Clear selections
			refetch(); // Refetch users after deletion
		} catch (err) {
			setShowBulkDeleteConfirm(false);
			setSelectedUserIds(new Set()); //
			toast.error(err?.data?.message || err.error); //
		}
	};

	// Cancel bulk delete
	const cancelBulkDelete = () => {
		setShowBulkDeleteConfirm(false); //
	};

	// Calculate total pages for pagination
	const totalPages = Math.ceil(filteredUsers.length / usersPerPage); //

	return (
		<div className="p-6 mb-10 min-h-[80vh] w-[90%] mx-auto">
			<div className="flex flex-col mb-4 md:flex-row md:justify-between">
				<div className="flex items-center w-full mb-4 md:mb-0">
					<BackButton /> {/* */}
					<h2 className="text-3xl font-bold md:mb-0 text-shark uppercase flex justify-center w-full">
						Manage Users
					</h2>
				</div>

				{/* Add and Delete Users Button */}
				<div className="flex gap-2 w-full md:w-4/5 text-sm">
					<button
						type="submit"
						className="flex col-span-2 w-full items-center justify-center px-3 py-2 bg-green-800 hover:bg-green-900 text-white rounded 
						disabled:cursor-not-allowed disabled:hover:scale-100 disabled:hover:shadow-none disabled:transition-none
						transition duration-300 hover:scale-105 hover:shadow-md"
						onClick={addUserHandler}
						disabled={isRegisteringUser} // Disable while registering
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
						className="flex col-span-2 items-center justify-center px-3 py-2 bg-red-800 hover:bg-red-900 text-white rounded w-full
						disabled:opacity-50 disabled:cursor-not-allowed disabled:hover:scale-100 disabled:hover:shadow-none disabled:transition-none
						disabled:bg-red-800 transition duration-300 hover:scale-105 hover:shadow-md"
						onClick={openBulkDeleteConfirm} // Use new handler
						disabled={selectedUserIds.size === 0 || isDeletingMultipleUsers} //
					>
						<div className="mr-2">
							{isDeletingMultipleUsers ? <Loader /> : <FaUsersSlash />}
						</div>
						Delete Users ({selectedUserIds.size})
					</button>
				</div>
			</div>

			{/* Search Bar and Pagination */}
			<div className="flex gap-1 mb-4 items-center">
				{/* Filter Dropdown */}
				<SearchFilterDropdown
					searchFilter={searchFilter} //
					setSearchFilter={setSearchFilter} //
					options={filterOptions} //
				/>

				{/* Search Input */}
				<input
					type="text"
					placeholder="Search users..."
					value={searchTerm} //
					onChange={(e) => setSearchTerm(e.target.value)} //
					className="px-3 py-2 rounded border border-sharkLight-100 focus:outline-none focus:ring-2 focus:ring-sharkLight-400 flex-grow"
				/>
				<div className="">
					<UserTablePaginationControls
						currentPage={currentPage}
						totalPages={totalPages}
						onPageChange={setCurrentPage} // Pass setter as handler
					/>
				</div>
			</div>

			{/* Users Table */}
			<UserTable
				users={usersOnCurrentPage} // Pass the sliced users
				currentPage={currentPage}
				totalPages={totalPages}
				setCurrentPage={setCurrentPage}
				usersPerPage={usersPerPage}
				selectedUserIds={selectedUserIds}
				isAllOnPageSelected={isAllOnPageSelected}
				handleSelectUser={handleSelectUser}
				handleSelectAll={handleSelectAll}
				openSingleDeleteConfirm={openSingleDeleteConfirm} // Pass new handler
				isGettingUsers={isGettingUsers} // Pass loading state
				isDeletingUser={isDeletingUser} // Pass loading state for individual delete
				filteredUsersCount={filteredUsers.length} // To show "No matching users"
				BACKEND_BASE_URL={BACKEND_BASE_URL}
			/>

			{/* Delete Single User Confirmation Popup */}
			<ConfirmationModal
				isOpen={showSingleDeleteConfirm}
				title="Delete User"
				message="Are you sure you want to delete this user?"
				onConfirm={confirmSingleDelete}
				onCancel={cancelSingleDelete}
				confirmButtonText={isDeletingUser ? "Deleting..." : "Confirm Delete"}
				cancelButtonText="Cancel"
				isConfirming={isDeletingUser}
			/>

			{/* Delete Multiple Users Confirmation Popup */}
			<ConfirmationModal
				isOpen={showBulkDeleteConfirm}
				title={`Delete ${selectedUserIds.size} ${
					selectedUserIds.size === 1 ? "User" : "Users"
				}`}
				message={`Are you sure you want to delete ${selectedUserIds.size} selected users?`}
				onConfirm={confirmBulkDelete}
				onCancel={cancelBulkDelete}
				confirmButtonText={
					isDeletingMultipleUsers ? "Deleting..." : "Confirm Delete"
				}
				cancelButtonText="Cancel"
				isConfirming={isDeletingMultipleUsers}
			/>
		</div>
	);
};

export default UserListPage;
