import PropTypes from "prop-types";
import Loader from "./Loader";

const ConfirmationModal = ({
	isOpen,
	title,
	message,
	onConfirm,
	onCancel,
	confirmButtonText,
	cancelButtonText,
	isConfirming,
}) => {
	if (!isOpen) return null; // Don't render anything if modal is not open

	return (
		<div className="fixed inset-0 flex items-center justify-center z-50 bg-opacity-50 bg-sharkDark-500">
			<div className="w-4/5 md:w-2/5 bg-white p-8 rounded-md text-shark">
				<h2 className="flex justify-center font-bold text-xl mb-4">{title}</h2>
				<p className="flex justify-center text-center mb-6">{message}</p>
				<div className="mt-5 flex justify-end gap-4">
					<button
						className="flex items-center justify-center px-4 py-2 bg-red-800 hover:bg-red-900 text-white rounded w-1/2 duration-200 disabled:opacity-50"
						onClick={onConfirm}
						disabled={isConfirming} // Disable button while confirmation is in progress
					>
						{isConfirming ? <Loader /> : confirmButtonText}
					</button>
					<button
						className="items-center justify-center px-4 py-2 bg-sharkLight-100 hover:bg-sharkLight-200 rounded w-1/2 duration-200"
						onClick={onCancel}
						disabled={isConfirming} // Disable cancel button if a process is ongoing
					>
						{cancelButtonText}
					</button>
				</div>
			</div>
		</div>
	);
};

// PropTypes for type checking and default props for optional ones
ConfirmationModal.propTypes = {
	isOpen: PropTypes.bool.isRequired,
	title: PropTypes.string.isRequired,
	message: PropTypes.string.isRequired,
	onConfirm: PropTypes.func.isRequired,
	onCancel: PropTypes.func.isRequired,
	confirmButtonText: PropTypes.string,
	cancelButtonText: PropTypes.string,
	isConfirming: PropTypes.bool,
};

ConfirmationModal.defaultProps = {
	confirmButtonText: "Confirm",
	cancelButtonText: "Cancel",
	isConfirming: false,
};

export default ConfirmationModal;
