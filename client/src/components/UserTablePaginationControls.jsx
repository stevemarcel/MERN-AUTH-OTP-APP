import PropTypes from "prop-types";
import { FaChevronLeft, FaChevronRight } from "react-icons/fa";

const UserTablePaginationControls = ({
	currentPage,
	totalPages,
	onPageChange,
}) => {
	// Don't render pagination controls if there's only one or zero pages
	if (totalPages <= 1) return null;

	const pageNumbers = [];
	// Logic to display a limited number of page buttons
	// This avoids rendering hundreds of page buttons for large datasets
	if (totalPages <= 7) {
		// Show all pages if 7 or less
		for (let i = 1; i <= totalPages; i++) {
			pageNumbers.push(i);
		}
	} else {
		// Always show first page
		pageNumbers.push(1);

		// Show ellipsis if current page is far from the beginning
		if (currentPage > 3) {
			pageNumbers.push("...");
		}

		// Show current, previous, and next page
		if (currentPage > 1 && currentPage < totalPages) {
			pageNumbers.push(currentPage - 1);
			pageNumbers.push(currentPage);
			pageNumbers.push(currentPage + 1);
		} else if (currentPage === 1) {
			pageNumbers.push(2, 3);
		} else if (currentPage === totalPages) {
			pageNumbers.push(totalPages - 2, totalPages - 1);
		}

		// Show ellipsis if current page is far from the end
		if (currentPage < totalPages - 2) {
			pageNumbers.push("...");
		}

		// Always show last page (unless already shown)
		if (totalPages > 1 && !pageNumbers.includes(totalPages)) {
			pageNumbers.push(totalPages);
		}

		// Filter out duplicates and sort
		const uniquePageNumbers = [...new Set(pageNumbers)].sort((a, b) => {
			if (a === "...") return 1; // Ellipsis goes to end for sorting
			if (b === "...") return -1;
			return a - b;
		});
		// Re-insert ellipsis correctly if needed after sorting
		const finalPageNumbers = [];
		for (let i = 0; i < uniquePageNumbers.length; i++) {
			if (
				uniquePageNumbers[i] === "..." &&
				(finalPageNumbers.length === 0 ||
					finalPageNumbers[finalPageNumbers.length - 1] === "...")
			) {
				// Avoid consecutive ellipses or ellipsis at the very beginning
				continue;
			}
			finalPageNumbers.push(uniquePageNumbers[i]);
		}
		// Ensure ellipsis doesn't appear if adjacent numbers exist
		if (
			finalPageNumbers[0] === 1 &&
			finalPageNumbers[1] === "..." &&
			finalPageNumbers[2] === 2
		) {
			finalPageNumbers.splice(1, 1); // Remove ellipsis if 1 ... 2
		}
		if (
			finalPageNumbers[finalPageNumbers.length - 1] === totalPages &&
			finalPageNumbers[finalPageNumbers.length - 2] === "..." &&
			finalPageNumbers[finalPageNumbers.length - 3] === totalPages - 1
		) {
			finalPageNumbers.splice(finalPageNumbers.length - 2, 1); // Remove ellipsis if N-1 ... N
		}

		pageNumbers.splice(0, pageNumbers.length, ...finalPageNumbers); // Update pageNumbers with cleaned list
	}

	return (
		<div className="flex justify-end gap-1 items-center">
			<button
				className="disabled:opacity-30 disabled:hover:font-normal disabled:hover:scale-100 disabled:hover:shadow-none disabled:transition-none
				hover:font-medium bg-sharkLight-100 px-2 py-1 rounded text-sm transition duration-300 hover:scale-105 hover:shadow-md"
				disabled={currentPage === 1}
				onClick={() => onPageChange(currentPage - 1)}
			>
				<div className="flex items-center gap-2">
					<FaChevronLeft />
					Prev
				</div>
			</button>
			{pageNumbers.map((pageNumber, index) => (
				<button
					key={index}
					className={`px-2 py-1 rounded w-8 text-sm hover:font-semibold ${
						currentPage === pageNumber
							? "bg-shark text-white font-bold hover:font-bold"
							: "bg-sharkLight-100"
					} ${pageNumber === "..." ? "cursor-default opacity-50" : ""}`}
					onClick={() => pageNumber !== "..." && onPageChange(pageNumber)}
					disabled={pageNumber === "..."} // Disable ellipsis button
				>
					{pageNumber}
				</button>
			))}
			<button
				className="disabled:opacity-30 disabled:hover:font-normal disabled:hover:scale-100 disabled:hover:shadow-none disabled:transition-none
				hover:font-medium bg-sharkLight-100 px-2 py-1 rounded text-sm transition duration-300 hover:scale-105 hover:shadow-md"
				disabled={currentPage === totalPages}
				onClick={() => onPageChange(currentPage + 1)}
			>
				<div className="flex items-center gap-2">
					Next
					<FaChevronRight />
				</div>
			</button>
		</div>
	);
};

// PropTypes for type checking
UserTablePaginationControls.propTypes = {
	currentPage: PropTypes.number.isRequired,
	totalPages: PropTypes.number.isRequired,
	onPageChange: PropTypes.func.isRequired,
};

export default UserTablePaginationControls;
