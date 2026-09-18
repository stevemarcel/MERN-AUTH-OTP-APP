import PropTypes from "prop-types";
import { useEffect, useRef, useState } from "react";
import { FaChevronDown, FaChevronLeft, FaChevronRight } from "react-icons/fa";

const UserTablePaginationControls = ({ currentPage, totalPages, onPageChange }) => {
  const [isPageDropdownOpen, setIsPageDropdownOpen] = useState(false);
  const dropdownRef = useRef(null);

  // ------------------------------------------------------------
  // Close mobile page dropdown when clicking outside
  // ------------------------------------------------------------
  useEffect(() => {
    const handleClickOutside = (event) => {
      if (dropdownRef.current && !dropdownRef.current.contains(event.target)) {
        setIsPageDropdownOpen(false);
      }
    };

    document.addEventListener("mousedown", handleClickOutside);

    return () => {
      document.removeEventListener("mousedown", handleClickOutside);
    };
  }, []);

  // Don't render pagination controls if there is only one page
  if (totalPages <= 1) return null;

  // ------------------------------------------------------------
  // Desktop page number generation
  // ------------------------------------------------------------
  const pageNumbers = [];

  if (totalPages <= 7) {
    for (let i = 1; i <= totalPages; i++) {
      pageNumbers.push(i);
    }
  } else {
    pageNumbers.push(1);

    if (currentPage > 3) {
      pageNumbers.push("...");
    }

    if (currentPage > 1 && currentPage < totalPages) {
      pageNumbers.push(currentPage - 1);
      pageNumbers.push(currentPage);
      pageNumbers.push(currentPage + 1);
    } else if (currentPage === 1) {
      pageNumbers.push(2);
      pageNumbers.push(3);
    } else if (currentPage === totalPages) {
      pageNumbers.push(totalPages - 2);
      pageNumbers.push(totalPages - 1);
    }

    if (currentPage < totalPages - 2) {
      pageNumbers.push("...");
    }

    pageNumbers.push(totalPages);

    // Remove duplicate numbers while preserving order
    const finalPageNumbers = [];

    pageNumbers.forEach((page) => {
      if (!finalPageNumbers.includes(page) || page === "...") {
        finalPageNumbers.push(page);
      }
    });

    // Remove duplicate / unnecessary ellipses
    for (let i = finalPageNumbers.length - 1; i >= 0; i--) {
      if (
        finalPageNumbers[i] === "..." &&
        (i === 0 ||
          i === finalPageNumbers.length - 1 ||
          finalPageNumbers[i - 1] === "..." ||
          finalPageNumbers[i + 1] === "...")
      ) {
        finalPageNumbers.splice(i, 1);
      }
    }

    pageNumbers.splice(0, pageNumbers.length, ...finalPageNumbers);
  }

  // ------------------------------------------------------------
  // Mobile page selection
  // ------------------------------------------------------------
  const handleMobilePageChange = (page) => {
    onPageChange(page);
    setIsPageDropdownOpen(false);
  };

  return (
    <>
      {/* ========================================================
          MOBILE PAGINATION
          Visible below md breakpoint
      ======================================================== */}
      <div className="md:hidden w-full">
        <div className="flex items-center justify-between gap-2 w-full">
          {/* Previous */}
          <button
            type="button"
            disabled={currentPage === 1}
            onClick={() => onPageChange(currentPage - 1)}
            className="
              flex-1
              flex items-center justify-center
              gap-2
              px-3 py-2
              rounded-md
              bg-sharkLight-100
              text-shark
              text-sm
              font-medium
              transition duration-300
              hover:bg-sharkLight-200
              disabled:opacity-30
              disabled:cursor-not-allowed
              disabled:hover:bg-sharkLight-100
              disabled:hover:scale-100
              whitespace-nowrap
            "
          >
            <FaChevronLeft className="text-xs" />
            <span>Prev</span>
          </button>

          {/* Page Dropdown */}
          <div ref={dropdownRef} className="relative flex-2">
            <button
              type="button"
              onClick={() => setIsPageDropdownOpen((previous) => !previous)}
              className="
                w-full
                flex items-center justify-center
                gap-2
                px-3 py-2
                rounded-md
                bg-sharkLight-100
                text-shark
                text-sm
                font-medium
                transition duration-300
                hover:bg-sharkLight-200
              "
            >
              <span>Page {currentPage}</span>

              <FaChevronDown
                className={`text-xs transition-transform duration-200 ${
                  isPageDropdownOpen ? "rotate-180" : ""
                }`}
              />
            </button>

            {/* Dropdown List */}
            {isPageDropdownOpen && (
              <div
                className="
                  absolute
                  bottom-full
                  left-0
                  right-0
                  mb-2
                  z-50
                  rounded-md
                  overflow-hidden
                  bg-sharkLight-100
                  border
                  border-sharkLight-200
                  shadow-lg
                "
              >
                <div className="max-h-60 overflow-y-auto py-1">
                  {Array.from({ length: totalPages }, (_, index) => index + 1).map((page) => (
                    <button
                      key={page}
                      type="button"
                      onClick={() => handleMobilePageChange(page)}
                      className={`
                        w-full
                        px-4 py-2
                        text-left
                        text-sm
                        transition duration-200
                        ${
                          currentPage === page
                            ? "bg-shark text-white font-semibold"
                            : "text-shark hover:bg-sharkLight-200"
                        }
                      `}
                    >
                      Page {page}
                    </button>
                  ))}
                </div>
              </div>
            )}
          </div>

          {/* Next */}
          <button
            type="button"
            disabled={currentPage === totalPages}
            onClick={() => onPageChange(currentPage + 1)}
            className="
              flex-1
              flex items-center justify-center
              gap-2
              px-3 py-2
              rounded-md
              bg-sharkLight-100
              text-shark
              text-sm
              font-medium
              transition duration-300
              hover:bg-sharkLight-200
              disabled:opacity-30
              disabled:cursor-not-allowed
              disabled:hover:bg-sharkLight-100
              disabled:hover:scale-100
              whitespace-nowrap
            "
          >
            <span>Next</span>
            <FaChevronRight className="text-xs" />
          </button>
        </div>
      </div>

      {/* ========================================================
          DESKTOP PAGINATION
          Visible from md breakpoint
      ======================================================== */}
      <div className="hidden md:flex justify-end gap-1 items-center">
        {/* Previous */}
        <button
          type="button"
          className="
            disabled:opacity-30
            disabled:hover:font-normal
            disabled:hover:scale-100
            disabled:hover:shadow-none
            disabled:transition-none
            hover:font-medium
            bg-sharkLight-100
            px-2 py-1
            rounded
            text-sm
            transition duration-300
            hover:scale-105
            hover:shadow-md
          "
          disabled={currentPage === 1}
          onClick={() => onPageChange(currentPage - 1)}
        >
          <div className="flex items-center gap-2">
            <FaChevronLeft />
            Prev
          </div>
        </button>

        {/* Page Numbers */}
        {pageNumbers.map((pageNumber, index) => (
          <button
            type="button"
            key={`${pageNumber}-${index}`}
            className={`
              px-2
              py-1
              rounded
              w-8
              text-sm
              hover:font-semibold
              ${
                currentPage === pageNumber
                  ? "bg-shark text-white font-bold hover:font-bold"
                  : "bg-sharkLight-100"
              }
              ${pageNumber === "..." ? "cursor-default opacity-50" : ""}
            `}
            onClick={() => pageNumber !== "..." && onPageChange(pageNumber)}
            disabled={pageNumber === "..."}
          >
            {pageNumber}
          </button>
        ))}

        {/* Next */}
        <button
          type="button"
          className="
            disabled:opacity-30
            disabled:hover:font-normal
            disabled:hover:scale-100
            disabled:hover:shadow-none
            disabled:transition-none
            hover:font-medium
            bg-sharkLight-100
            px-2 py-1
            rounded
            text-sm
            transition duration-300
            hover:scale-105
            hover:shadow-md
          "
          disabled={currentPage === totalPages}
          onClick={() => onPageChange(currentPage + 1)}
        >
          <div className="flex items-center gap-2">
            Next
            <FaChevronRight />
          </div>
        </button>
      </div>
    </>
  );
};

// ============================================================
// PropTypes
// ============================================================

UserTablePaginationControls.propTypes = {
  currentPage: PropTypes.number.isRequired,
  totalPages: PropTypes.number.isRequired,
  onPageChange: PropTypes.func.isRequired,
};

export default UserTablePaginationControls;
