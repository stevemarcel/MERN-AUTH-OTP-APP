import { Outlet, useLocation } from "react-router-dom";
import { ToastContainer } from "react-toastify";
import "react-toastify/dist/ReactToastify.css";
import Navbar from "./components/Navbar";
import Footer from "./components/Footer";

const App = () => {
  const location = useLocation();

  const shouldShowFooter =
    !location.pathname.includes("/login") && !location.pathname.includes("/register"); // Check for login and register paths

  return (
    <div className="bg-light">
      <ToastContainer />
      <Navbar />
      <Outlet />
      {shouldShowFooter && <Footer />}
    </div>
  );
};

export default App;
