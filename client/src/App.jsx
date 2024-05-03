import { Outlet } from "react-router-dom";
import { ToastContainer } from "react-toastify";
import "react-toastify/dist/ReactToastify.css";
import Navbar from "./components/Navbar";

const App = () => {
  return (
    <div className=" bg-sharkLight-100">
      <ToastContainer />
      <Navbar />
      <Outlet />
    </div>
  );
};

export default App;
