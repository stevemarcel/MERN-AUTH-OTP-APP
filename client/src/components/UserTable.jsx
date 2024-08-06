import { useState } from "react";
import { FaChevronLeft, FaChevronRight } from "react-icons/fa";
import PropTypes from "prop-types";

const UserTable = ({ allUsers }) => {
  const [currentPage, setCurrentPage] = useState(1);
  const usersPerPage = 10;

  const usersToDisplay = allUsers.slice(
    (currentPage - 1) * usersPerPage,
    currentPage * usersPerPage
  );

  const handlePageChange = (page) => {
    setCurrentPage(page);
  };

  const renderPagination = () => {
    const totalPages = Math.ceil(allUsers.length / usersPerPage);

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
      <div className="flex justify-between items-center mt-4">
        <button
          className="disabled:opacity-50 hover:bg-gray-200 px-2 py-1 rounded-md text-sm"
          disabled={currentPage === 1}
          onClick={() => handlePageChange(currentPage - 1)}
        >
          <FaChevronLeft /> Prev
        </button>
        {pageNumbers.map((pageNumber) => (
          <button
            key={pageNumber}
            className={`px-2 py-1 rounded-md text-sm ${
              currentPage === pageNumber ? "bg-gray-200 font-bold" : ""
            }`}
            onClick={() => handlePageChange(pageNumber)}
          >
            {pageNumber === "..." ? pageNumber : pageNumber.toString()}
          </button>
        ))}
        <button
          className="disabled:opacity-50 hover:bg-gray-200 px-2 py-1 rounded-md text-sm"
          disabled={currentPage === totalPages}
          onClick={() => handlePageChange(currentPage + 1)}
        >
          Next <FaChevronRight />
        </button>
      </div>
    );
  };

  return (
    <div className="overflow-x-auto p-4 bg-sharkLight-100/30 shadow-md rounded">
      <table className="w-full">
        <thead>
          <tr className="text-left border-b border-shark">
            <th className="p-2">
              <input type="checkbox" />
            </th>
            <th className="p-2">S/N</th>
            <th className="p-2">Name</th>
            <th className="p-2">Email</th>
            <th className="p-2">Member Since</th>
            <th className="p-2">Admin</th>
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
                {user.firstName} {user.lastName}
              </td>
              <td className="p-2">{user.email}</td>
              <td className="p-2">{user.createdAt.split("T")[0]}</td>
              <td className="p-2">{user.isAdmin ? "Yes" : "No"}</td>
              <td className="p-2">{/* Options section for each user */}</td>
            </tr>
          ))}
        </tbody>
      </table>
      {renderPagination()}
    </div>
  );
};

UserTable.propTypes = {
  allUsers: PropTypes.arrayOf(PropTypes.object).isRequired,
};

export default UserTable;
