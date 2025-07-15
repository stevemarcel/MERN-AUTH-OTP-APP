import { Link, useNavigate } from "react-router-dom";
import { useEffect, useState } from "react";
// import { useDispatch } from "react-redux";
import {
  FaCaretLeft,
  FaCheckCircle,
  FaChevronLeft,
  FaChevronRight,
  FaUserPlus,
  FaUsersSlash,
  FaSearch,
  FaTimesCircle,
} from "react-icons/fa";
import { MdDelete } from "react-icons/md";
import { IoIosEye } from "react-icons/io";
import Loader from "../components/Loader";
// import UserTable from "../components/UserTable";
import {
  useDeleteUserMutation,
  useGetUsersQuery,
  useRegisterMutation,
} from "../slices/usersApiSlice";
import { toast } from "react-toastify";
// import { getCredentials } from "../slices/authSlice";

const UserListPage = () => {
  const { data, isLoading: isGettingUsers, refetch } = useGetUsersQuery();
  const [deleteUserApiCall, { isLoading: isDeletingUser }] =
    useDeleteUserMutation();

  const [filteredUsers, setFilteredUsers] = useState([]);

  // For deleting user
  const [isConfirmOpen, setIsConfirmOpen] = useState(false);
  const [deleteId, setDeleteId] = useState(null);

  // For Pagination
  const [currentPage, setCurrentPage] = useState(1);
  const [usersPerPage] = useState(10);

  // For Search
  const [keyword, setKeyword] = useState("");

  // For Selecting User(s)
  // const [isChecked, setIsChecked] = useState([]);

  // To prevent multiple or delayed fetch from API
  useEffect(() => {
    refetch();
    if (data) {
      setFilteredUsers(data.users);
    }
  }, [data, refetch]);

  // Pagination Logic
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
      <div className="flex justify-end gap-1 items-center mt-4">
        <button
          className="disabled:opacity-40 hover:bg-sharkLight-100/60  hover:text-sharkLight-500 bg-sharkLight-100 px-2 py-1 rounded text-sm"
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
            className={`px-2 py-1 rounded w-8 text-sm ${
              currentPage === pageNumber
                ? "bg-sharkLight-500 text-light font-bold"
                : "bg-sharkLight-100"
            }`}
            onClick={() => handlePageChange(pageNumber)}
          >
            {pageNumber === "..." ? pageNumber : pageNumber.toString()}
          </button>
        ))}
        <button
          className="disabled:opacity-40 hover:bg-sharkLight-100/60  hover:text-sharkLight-500 bg-sharkLight-100 px-2 py-1 rounded text-sm"
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

  // Search Handler
  const searchHandler = (e) => {
    const enteredText = e.target.value;
    setKeyword(enteredText);
    console.log(keyword);

    const filtered = data.users.filter((user) =>
      Object.values(user).some((value) =>
        value.toLowerCase().includes(enteredText.toLowerCase())
      )
    );

    setFilteredUsers(filtered);
    console.log(filteredUsers);
  };

  // For Add new user
  const navigate = useNavigate();
  // const dispatch = useDispatch();
  const [registerApiCall, { isLoading: isRegisteringUser }] =
    useRegisterMutation();

  // Add a new user
  const addUserHandler = async () => {
    const newUserData = {
      firstName: "Sample",
      lastName: "User",
      email: "sampleuser@example.com",
      password: "sample12345",
      isAdminCreatingUser: true,
      // Additional fields for register (optional)
      confirmPassword: "sample12345",
    };
    try {
      const addUserRes = await registerApiCall(newUserData).unwrap();
      // TODO: Remove console log
      // console.log(addUserRes);
      navigate(`/admin/user/${addUserRes._id}/create`);
      refetch();
    } catch (err) {
      toast.error(err?.data?.message || err.error);
    }

    // navigate("/admin/user/:userId/create");
  };

  //Delete Selected Users
  const deleteUsersHandler = async () => {};

  // Delete User By ID Confirmation Popup logic
  const deleteUserPopup = async (id) => {
    setIsConfirmOpen(true);
    setDeleteId(id);
  };

  // Delete User By ID
  const deleteUserByIdHandler = async () => {
    if (deleteId) {
      try {
        const delUserRes = await deleteUserApiCall(deleteId).unwrap();
        toast.success(delUserRes.message);
        refetch();
        setIsConfirmOpen(false);
      } catch (err) {
        toast.error(err?.data?.message || err.error);
        setIsConfirmOpen(false);
      }
    }
  };

  // Cancel Delete User By ID
  const handleCancelDelete = () => {
    setIsConfirmOpen(false);
  };

  return (
    <div className="p-6 mb-10 min-h-[80vh] w-[90%] mx-auto">
      <div className="flex flex-col mb-4 md:flex-row md:justify-between">
        <div className="flex items-center  mb-4 md:mb-0">
          <Link
            to="/admin"
            className="flex items-center mr-8 px-3 py-2 bg-shark text-light text-xs hover:bg-sharkDark-100 focus:outline-none rounded-lg"
          >
            <div className="mr-1">
              <FaCaretLeft />
            </div>
            Back
          </Link>
          <h2 className="text-2xl font-bold md:mb-0 text-shark">All Users</h2>
        </div>

        {/* Add and Delete Users Button */}
        <div className="flex gap-2 w-full md:w-2/5 text-sm">
          <button
            type="submit"
            className="flex col-span-2 w-full items-center justify-center px-3 py-2 bg-green-800 hover:bg-green-900 text-white rounded"
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
            type="submit"
            className="flex col-span-2 items-center justify-center px-3 py-2 bg-red-800 hover:bg-red-900 text-white rounded w-full"
            onClick={deleteUsersHandler}
          >
            <div className="mr-2">
              <FaUsersSlash />
            </div>
            Delete Users
          </button>
        </div>
      </div>

      {/* Search Bar */}
      <div className="flex flex-col mb-4 md:flex-row items-center">
        <div className="relative flex items-center w-full mb-4 md:mb-0">
          <input
            type="text"
            placeholder="search user"
            onChange={searchHandler}
            value={keyword}
            className="px-3 py-2 rounded bg-sharkLight-100 focus:outline-none focus:ring-2 focus:ring-sharkLight-400  w-full"
          />
          <span className="absolute right-3 top-1/2 transform -translate-y-1/2">
            <FaSearch />
          </span>
        </div>
      </div>

      {/* Users Table */}
      <div className="text-shark">
        {/* <UserTable allUsers={allUsers} /> */}
        <div className="overflow-x-auto p-4 bg-sharkLight-100/30 shadow-md rounded">
          <table className="w-full">
            <thead>
              <tr className="text-left border-b border-shark">
                <th className="p-2">
                  <input type="checkbox" />
                </th>
                <th className="p-2">S/N</th>
                <th className="p-2">Name</th>
                <th className="p-2 md:table-cell hidden">Email</th>
                <th className="p-2 md:table-cell hidden">Member Since</th>
                <th className="p-2 md:table-cell hidden">Admin</th>
                <th className="p-2">Options</th>
              </tr>
            </thead>

            <tbody>
              {usersToDisplay.map((user, index) => (
                <tr
                  key={user._id}
                  className="text-left border-b border-gray-200"
                >
                  <td className="p-2">
                    <input type="checkbox" />
                  </td>
                  <td className="p-2">
                    {index + 1 + (currentPage - 1) * usersPerPage}
                  </td>
                  <td className="p-2">
                    {
                      <div className="flex gap-2 items-end">
                        <img
                          src={user.profile}
                          alt="Profile Picture"
                          className="size-9 hidden md:block"
                        />
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
                  <td className="p-2 md:table-cell hidden">
                    {user.createdAt.split("T")[0]}
                  </td>
                  {/* <td className="p-2 md:table-cell hidden">{user.isAdmin ? "Yes" : "No"}</td> */}
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
                    <div className="flex gap-2 ">
                      <Link
                        to={`/admin/user/${user._id}/edit`}
                        className="relative flex col-span-2 items-center justify-center p-2 bg-shark hover:bg-sharkDark-300  text-white rounded"
                        title={`View ${user.firstName}`}
                      >
                        <IoIosEye />
                        {/* <span className="absolute bottom-0 left-3 px-2 py-1 text-xs bg-shark rounded opacity-0 hover:opacity-100 whitespace-nowrap">
                            {`View ${user.firstName}`}
                          </span> */}
                      </Link>
                      <button
                        type="submit"
                        className="flex col-span-2 items-center justify-center p-2 bg-red-800 hover:bg-red-900 text-white rounded"
                        onClick={() => deleteUserPopup(user._id)}
                        title={`Delete ${user.firstName}`}
                      >
                        {isDeletingUser ? (
                          <div className="text-3xl">
                            <Loader />
                          </div>
                        ) : (
                          <MdDelete />
                        )}
                      </button>
                    </div>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
          {renderPagination()}

          {/* Loader */}
          {isGettingUsers && (
            <div className="flex justify-center p-8 text-9xl">
              <Loader />
            </div>
          )}

          {/* Delete User By ID Confirmation Popup */}
          {isConfirmOpen && (
            <div className="fixed inset-0 flex items-center justify-center z-50 bg-opacity-50 bg-sharkDark-500">
              <div className="bg-white p-8 pb-5 rounded-md">
                <p>Are you sure you want to delete this user?</p>
                <div className="mt-4 flex justify-end">
                  <button
                    className="flex col-span-2 items-center justify-center mr-4 px-3 py-2 bg-red-800 hover:bg-red-900 text-white rounded w-auto"
                    onClick={deleteUserByIdHandler}
                  >
                    <div className="mr-2">
                      <MdDelete />
                    </div>
                    Confirm
                  </button>
                  <button
                    className="items-center justify-center px-3 py-2 bg-sharkLight-100 hover:bg-sharkLight-200 rounded w-auto"
                    onClick={handleCancelDelete}
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
