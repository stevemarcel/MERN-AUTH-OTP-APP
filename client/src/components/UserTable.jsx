import PropTypes from "prop-types";
import { Link } from "react-router-dom";
import { FaCheckCircle, FaTimesCircle, FaHistory } from "react-icons/fa";
import { MdDelete } from "react-icons/md";
import { IoIosEye } from "react-icons/io";
import Loader from "./Loader";

import UserTablePaginationControls from "./UserTablePaginationControls";
import { getProfileImageUrl } from "../utils/profileImageUrl";

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
    <div className="bg-white rounded shadow-md overflow-hidden text-shark">
      <div id="user-table-wrapper" className="w-full overflow-x-auto">
        <table id="user-table" className="w-full min-w-[950px]">
          <thead>
            <tr className="text-left text-xs uppercase border-b border-shark">
              {/* Checkbox */}
              <th className="p-4">
                <input
                  type="checkbox"
                  onChange={handleSelectAll}
                  checked={isAllOnPageSelected}
                  // This is for the indeterminate state
                  // (some selected, but not all on page)
                  ref={(el) => {
                    if (el) {
                      el.indeterminate = selectedUserIds.size > 0 && !isAllOnPageSelected;
                    }
                  }}
                />
              </th>

              {/* S/N */}
              <th className="px-3 py-4">S/N</th>

              {/* Name - takes remaining available space */}
              <th className="px-3 py-4">Name</th>

              {/* Email - hidden on mobile */}
              <th className="px-3 py-4">Email</th>

              {/* Member Since - hidden on mobile */}
              <th className="px-3 py-4">Member Since</th>

              {/* Admin - hidden on mobile */}
              <th className="px-3 py-4">
                <div className="flex justify-center">Admin</div>
              </th>

              {/* Actions */}
              <th className="px-3 py-4">
                <div className="flex justify-center">Actions</div>
              </th>
            </tr>
          </thead>

          <tbody>
            {/* Loading */}
            {isGettingUsers ? (
              <tr>
                <td colSpan="7" className="text-center p-4">
                  <div className="flex justify-center p-8"></div>
                  <Loader /> Loading users...
                </td>
              </tr>
            ) : filteredUsersCount === 0 ? (
              /* No users */
              <tr>
                <td colSpan="7" className="text-center p-4 text-sharkLight-300 italic">
                  No matching users found.
                </td>
              </tr>
            ) : (
              /* Users */
              users.map((user, index) => (
                <tr
                  key={user._id}
                  className={`text-sm border-b border-gray-200 transition-all duration-200 hover:bg-sharkLight-100/30
                ${
                  selectedUserIds.has(user._id) ? "bg-sharkLight-100 border-l-4 border-shark" : ""
                }`}
                >
                  {/* Checkbox */}
                  <td className="p-4">
                    <input
                      type="checkbox"
                      checked={selectedUserIds.has(user._id)}
                      onChange={() => handleSelectUser(user._id)}
                    />
                  </td>

                  {/* S/N */}
                  <td className="p-3 text-center">
                    {index + 1 + (currentPage - 1) * usersPerPage}
                  </td>

                  {/* Name */}
                  <td className="p-3">
                    <div className="flex gap-2 items-center min-w-0 overflow-hidden">
                      {/* Profile image */}
                      <div className="w-8 h-8 mr-1 rounded-full overflow-hidden shrink-0">
                        <img
                          src={getProfileImageUrl(user.profile, BACKEND_BASE_URL)}
                          alt="Profile Picture"
                          className="object-cover w-full h-full"
                        />
                      </div>

                      {/* Name + Username */}
                      <div className="flex flex-col min-w-0 overflow-hidden">
                        <span className="truncate" title={`${user.firstName} ${user.lastName}`}>
                          {user.firstName} {user.lastName}
                        </span>

                        <span
                          className="italic font-mono text-xs truncate"
                          title={`@${user.username}`}
                        >
                          {`@${user.username}`}
                        </span>
                      </div>
                    </div>
                  </td>

                  {/* Email */}
                  <td className="p-3">
                    <a href={`mailto:${user.email}`}>{user.email}</a>
                  </td>

                  {/* Member Since */}
                  <td className="p-3">
                    {new Intl.DateTimeFormat("en-US", {
                      day: "numeric",
                      month: "short",
                      year: "numeric",
                      hour: "2-digit",
                      minute: "2-digit",
                      hour12: true,
                    }).format(new Date(user.createdAt))}
                  </td>

                  {/* Admin */}
                  <td className="p-3">
                    <div
                      className={`flex justify-center ${
                        user.isAdmin ? "text-green-600" : "text-sharkLight-300"
                      }`}
                    >
                      {user.isAdmin ? <FaCheckCircle /> : <FaTimesCircle />}
                    </div>
                  </td>

                  {/* Actions */}
                  <td className="p-3">
                    <div className="flex justify-center gap-1">
                      {/* View/Edit User Button */}
                      <div className="group relative">
                        <Link
                          to={`/admin/user/${user._id}/edit`}
                          className="flex items-center justify-center p-2 bg-shark hover:bg-sharkDark-300 text-white rounded"
                        >
                          <IoIosEye />
                        </Link>

                        {/* Tooltip for View */}
                        <span className="absolute bottom-full right-0 mb-2 px-2 py-1 text-sm text-white bg-sharkDark-300 rounded-md opacity-0 group-hover:opacity-100 transition-opacity duration-300 whitespace-nowrap z-10 pointer-events-none">
                          {`View ${user.firstName}`}
                        </span>
                      </div>

                      {/* User Activity Button */}
                      <div className="group relative">
                        <Link
                          to={`/admin/user/${user._id}/activities`}
                          className="flex items-center justify-center p-2 bg-sharkLight-400 hover:bg-sharkLight-500 text-white rounded"
                        >
                          <FaHistory />
                        </Link>

                        {/* Tooltip */}
                        <span className="absolute bottom-full right-0 mb-2 px-2 py-1 text-sm text-white bg-sharkDark-300 rounded-md opacity-0 group-hover:opacity-100 transition-opacity duration-300 whitespace-nowrap z-10 pointer-events-none">
                          {`${user.firstName}'s Activity`}
                        </span>
                      </div>

                      {/* Delete User Button */}
                      <div className="group relative">
                        <button
                          type="button"
                          className="flex items-center justify-center p-2 bg-red-800 hover:bg-red-900 text-white rounded"
                          onClick={() => openSingleDeleteConfirm(user._id)}
                          disabled={isDeletingUser}
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
                        <span className="absolute bottom-full right-0 mb-2 px-2 py-1 text-sm text-white bg-red-900 rounded-md opacity-0 group-hover:opacity-100 transition-opacity duration-300 whitespace-nowrap z-10 pointer-events-none">
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
      </div>

      {/* Pagination */}
      <div className="flex justify-center md:justify-end p-4 border-t">
        <UserTablePaginationControls
          currentPage={currentPage}
          totalPages={totalPages}
          onPageChange={setCurrentPage}
        />
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
