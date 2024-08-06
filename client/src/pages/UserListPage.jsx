import { Link } from "react-router-dom";
import { useEffect, useState } from "react";
import {
  FaCaretLeft,
  FaCheckCircle,
  FaChevronLeft,
  FaChevronRight,
  FaEye,
  FaTimesCircle,
} from "react-icons/fa";
import Loader from "../components/Loader";
import { FaPlus, FaTrash, FaSearch } from "react-icons/fa";
// import UserTable from "../components/UserTable";
import { useDeleteUserMutation, useGetUsersQuery } from "../slices/usersApiSlice";
import { toast } from "react-toastify";

const UserListPage = () => {
  const { data, isLoading: isGettingUsers } = useGetUsersQuery();

  const [filteredUsers, setFilteredUsers] = useState([]);

  // For Pagination
  const [currentPage, setCurrentPage] = useState(1);
  const [usersPerPage] = useState(10);

  // For Search
  const [keyword, setKeyword] = useState("");

  // For Selecting User(s)
  // const [isChecked, setIsChecked] = useState([]);

  // To prevent multiple or delayed fetch from API
  useEffect(() => {
    if (data) {
      setFilteredUsers(data.users);
    }
  }, [data]);

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
      Object.values(user).some((value) => value.toLowerCase().includes(enteredText.toLowerCase()))
    );

    setFilteredUsers(filtered);
    console.log(filteredUsers);
  };

  const [deleteUserApiCall, { isLoading: isDeletingUser }] = useDeleteUserMutation();

  const addUserHandler = async () => {};
  const deleteUsersHandler = async () => {};
  const deleteUserByIdHandler = async (id) => {
    if (id) {
      try {
        await deleteUserApiCall(id).unwrap();
        console.log(id);
      } catch (err) {
        toast.error(err?.data?.message || err.error);
      }
    }
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
        <div className="flex gap-2 w-full md:w-2/5 text-sm">
          <button
            type="submit"
            className="flex col-span-2 w-full items-center justify-center px-3 py-2 bg-green-800 hover:bg-green-900 text-white rounded"
            onClick={addUserHandler}
          >
            <div className="mr-2">
              <FaPlus />
            </div>
            Add User
          </button>
          <button
            type="submit"
            className="flex col-span-2 items-center justify-center px-3 py-2 bg-red-800 hover:bg-red-900 text-white rounded w-full"
            onClick={deleteUsersHandler}
          >
            <div className="mr-2">
              <FaTrash />
            </div>
            Delete Users
          </button>
        </div>
      </div>
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
                <tr key={user._id} className="text-left border-b border-gray-200">
                  <td className="p-2">
                    <input type="checkbox" />
                  </td>
                  <td className="p-2">{index + 1 + (currentPage - 1) * usersPerPage}</td>
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
                  <td className="p-2 md:table-cell hidden">{user.email}</td>
                  <td className="p-2 md:table-cell hidden">{user.createdAt.split("T")[0]}</td>
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
                        to={`/admin/users/${user._id}`}
                        className="relative flex col-span-2 items-center justify-center p-2 bg-shark hover:bg-sharkDark-300  text-white rounded"
                        // onClick={() => viewUserHandler(user)}
                        title={`View ${user.firstName}`}
                      >
                        <FaEye />
                        {/* <span className="absolute bottom-0 left-3 px-2 py-1 text-xs bg-shark rounded opacity-0 hover:opacity-100 whitespace-nowrap">
                            {`View ${user.firstName}`}
                          </span> */}
                      </Link>
                      <button
                        type="submit"
                        className="flex col-span-2 items-center justify-center p-2 bg-red-800 hover:bg-red-900 text-white rounded"
                        onClick={() => deleteUserByIdHandler(user._id)}
                        title={`Delete ${user.firstName}`}
                      >
                        {isDeletingUser ? (
                          <div className="text-3xl">
                            <Loader />
                          </div>
                        ) : (
                          <FaTrash />
                        )}
                      </button>
                    </div>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
          {renderPagination()}
          {isGettingUsers && (
            <div className="flex justify-center p-8 text-9xl">
              <Loader />
            </div>
          )}
        </div>
      </div>
    </div>
  );
};

export default UserListPage;
