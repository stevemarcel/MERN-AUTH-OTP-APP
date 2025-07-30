import PropTypes from "prop-types";
import { Link } from "react-router-dom";
import { FaCheckCircle, FaTimesCircle } from "react-icons/fa";
import { MdDelete } from "react-icons/md";
import { IoIosEye } from "react-icons/io";
import Loader from "./Loader";
import UserTablePaginationControls from "./UserTablePaginationControls";

const UserTable = ({
	users,
	currentPage,
	totalPages,
	setCurrentPage,
	usersPerPage,
	selectedUserIds,
	isAllOnPageSelected,
	handleSelectUser,
	handleSelectAll,
	openSingleDeleteConfirm,
	isGettingUsers,
	isDeletingUser,
	filteredUsersCount,
	BACKEND_BASE_URL,
}) => {
	return (
		<div className="text-shark">
			<div className="w-full p-4 bg-sharkLight-100/30 shadow-md rounded">
				<table className="w-full">
					<thead>
						<tr className="text-left border-b border-shark">
							<th className="p-2">
								<input
									type="checkbox"
									onChange={handleSelectAll}
									checked={isAllOnPageSelected}
									// This is for the indeterminate state (some selected, but not all on page)
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
							<th className="p-2 md:table-cell hidden ">
								<div className="flex justify-center">Admin</div>
							</th>
							<th className="p-2">Options</th>
						</tr>
					</thead>
					<tbody>
						{/* Conditional rendering for loading, no users, or user data */}
						{isGettingUsers ? (
							<tr>
								<td colSpan="7" className="text-center p-4">
									<div className="flex justify-center p-8"></div>
									<Loader /> Loading users...
								</td>
							</tr>
						) : filteredUsersCount === 0 ? (
							<tr>
								<td
									colSpan="7"
									className="text-center p-4 text-sharkLight-300 italic"
								>
									No matching users found.
								</td>
							</tr>
						) : (
							users.map((user, index) => (
								<tr
									key={user._id}
									className={`text-left text-xs border-gray-200 transition-all duration-200 
										hover:bg-sharkLight-100/50 hover:scale-105 hover:shadow-md ${
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
										<div className="flex gap-2 items-center">
											<div className="hidden md:block w-8 h-8 mr-1 rounded-full overflow-hidden">
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
									</td>
									<td className="p-2 md:table-cell hidden">
										<a href={`mailto:${user.email}`}>{user.email}</a>
									</td>
									<td className="p-2 md:table-cell hidden">
										{/* Member Since Date Formatting */}
										{new Intl.DateTimeFormat("en-US", {
											day: "numeric",
											month: "short",
											year: "numeric",
											hour: "2-digit",
											minute: "2-digit",
											hour12: true,
										}).format(new Date(user.createdAt))}
									</td>
									<td className="p-2 md:table-cell hidden">
										<div
											className={`flex justify-center ${
												user.isAdmin ? "text-green-600" : "text-sharkLight-300"
											}`}
										>
											{user.isAdmin ? <FaCheckCircle /> : <FaTimesCircle />}
										</div>
									</td>
									<td className="p-2">
										<div className="flex gap-2">
											{/* View/Edit User Button */}
											<div className="group relative">
												<Link
													to={`/admin/user/${user._id}/edit`}
													className="flex col-span-2 items-center justify-center p-2 bg-shark hover:bg-sharkDark-300 text-white rounded"
												>
													<IoIosEye />
												</Link>
												{/* Tooltip for View */}
												<span
													className="absolute bottom-full left-1/2 -translate-x-1/2 mb-2
                            px-2 py-1 text-xs text-white bg-sharkDark-300 rounded-md
                            opacity-0 group-hover:opacity-100 transition-opacity duration-300
                            whitespace-nowrap z-10 pointer-events-none"
												>
													{`View ${user.firstName}`}
												</span>
											</div>
											{/* Delete User Button */}
											<div className="group relative">
												<button
													type="button"
													className="flex col-span-2 items-center justify-center p-2 bg-red-800 hover:bg-red-900 text-white rounded"
													onClick={() => openSingleDeleteConfirm(user._id)}
													disabled={isDeletingUser} // Disable button while deletion is in progress
												>
													{isDeletingUser ? (
														<div className="text-3xl">
															<Loader />
														</div>
													) : (
														<MdDelete />
													)}
												</button>
												{/* Tooltip for Delete */}
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
					<UserTablePaginationControls
						currentPage={currentPage}
						totalPages={totalPages}
						onPageChange={setCurrentPage}
					/>
				</div>
			</div>
		</div>
	);
};

// PropTypes for type checking
UserTable.propTypes = {
	users: PropTypes.arrayOf(PropTypes.object).isRequired,
	currentPage: PropTypes.number.isRequired,
	totalPages: PropTypes.number.isRequired,
	setCurrentPage: PropTypes.func.isRequired,
	usersPerPage: PropTypes.number.isRequired,
	selectedUserIds: PropTypes.instanceOf(Set).isRequired,
	isAllOnPageSelected: PropTypes.bool.isRequired,
	handleSelectUser: PropTypes.func.isRequired,
	handleSelectAll: PropTypes.func.isRequired,
	openSingleDeleteConfirm: PropTypes.func.isRequired,
	isGettingUsers: PropTypes.bool.isRequired,
	isDeletingUser: PropTypes.bool.isRequired,
	filteredUsersCount: PropTypes.number.isRequired,
	BACKEND_BASE_URL: PropTypes.string.isRequired,
};

export default UserTable;
