import PropTypes from "prop-types";
import {
	FaTachometerAlt,
	FaUsers,
	FaBox,
	FaCogs,
	// FaTimes,
} from "react-icons/fa";

const AdminSidebar = ({
	activeSection,
	setActiveSection,
	isMobileSidebarOpen,
	toggleMobileSidebar,
}) => {
	const sidebarItems = [
		{ id: "dashboard", name: "Dashboard", icon: <FaTachometerAlt /> },
		{ id: "users", name: "Users", icon: <FaUsers /> },
		{ id: "products", name: "Products", icon: <FaBox /> },
		{ id: "dummyitems", name: "Dummy Items", icon: <FaCogs /> },
	];

	return (
		<>
			<div className="md:hidden bg-sharkLight-100 fixed z-40 w-full">
				{" "}
				<nav className="flex justify-between">
					<ul className="md:hidden flex gap-x-1  items-center">
						{sidebarItems.map((item) => (
							<li key={item.id} className="mb-2">
								<button
									onClick={() => {
										setActiveSection(item.id);
										// if (isMobileSidebarOpen) toggleMobileSidebar();
									}}
									className={`flex items-center w-full px-6 py-3 text-left text-lg transition duration-200
                              ${
																activeSection === item.id
																	? "font-semibold border-t-4 border-shark bg-sharkLight-100/30  text-shark"
																	: "hover:bg-sharkDark-300  text-sharkLight-300"
															}`}
								>
									<span className="mr-3">{item.icon}</span>
									{activeSection === item.id && <span>{item.name}</span>}
									{/* if (activeSection) <span>{item.name}</span> */}
								</button>
							</li>
						))}
					</ul>
				</nav>
			</div>
			<div
				className={`fixed inset-y-0 left-0 w-64 bg-sharkDark-500 text-sharkLight-100 shadow-lg z-10
                   transform transition-transform duration-300 ease-in-out
                   md:relative md:translate-x-0 md:w-1/4 lg:w-1/5 xl:w-1/6 md:flex md:flex-col
                   ${
											isMobileSidebarOpen
												? "translate-x-0"
												: "-translate-x-full"
										}
										`}
			>
				{/* Overlay for mobile sidebar */}
				{/* {isMobileSidebarOpen && (
				<div
					className="fixed inset-0 bg-sharkDark-500 bg-opacity-75 z-40 md:hidden"
					onClick={toggleMobileSidebar}
				></div>
			)} */}

				{/* Sidebar Container */}
				<aside className="sticky top-[80px] w-full">
					{/* Close button for mobile */}
					{/* <div className="p-4 flex justify-end md:hidden">
						<button
							onClick={toggleMobileSidebar}
							className="text-sharkLight-100 text-2xl"
						>
							<FaTimes />
						</button>
					</div> */}

					<div className="p-6 text-2xl font-bold border-b border-sharkDark-300">
						Admin Panel
					</div>
					<nav className="flex-1 py-4">
						<ul>
							{sidebarItems.map((item) => (
								<li key={item.id} className="mb-2">
									<button
										onClick={() => {
											setActiveSection(item.id);
											if (isMobileSidebarOpen) toggleMobileSidebar(); // Close sidebar on item click for mobile
										}}
										className={`flex items-center w-full px-6 py-3 text-left text-lg rounded-md transition duration-200
                              ${
																activeSection === item.id
																	? "bg-shark text-white font-semibold shadow-md"
																	: "hover:bg-sharkDark-300"
															}`}
									>
										<span className="mr-3">{item.icon}</span>
										{item.name}
									</button>
								</li>
							))}
						</ul>
					</nav>
				</aside>
			</div>
		</>
	);
};

AdminSidebar.propTypes = {
	activeSection: PropTypes.string.isRequired,
	setActiveSection: PropTypes.func.isRequired,
	isMobileSidebarOpen: PropTypes.bool.isRequired,
	toggleMobileSidebar: PropTypes.func.isRequired,
};

export default AdminSidebar;
