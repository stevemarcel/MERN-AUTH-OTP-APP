import { Link } from "react-router-dom";
import { useSelector } from "react-redux";
import Card from "../components/Card";
import UserManagementImg from "../assets/img/userManagementImg.jpg";
import ProductsManagementImg from "../assets/img/productsManagementImg.jpg";
import PlaceholderImg from "../assets/img/placeholder.jpg";
import BackButton from "../components/BackButton";
import { FaUserLock } from "react-icons/fa";

const AdminPage = () => {
  const usersCardInfo = {
    image: UserManagementImg,
    title: "User Management",
    description: "View and manage all users",
  };
  const productsCardInfo = {
    image: ProductsManagementImg,
    title: "Products Management",
    description: "View and manage all user products",
  };

  const dummyCardInfo = {
    image: PlaceholderImg,
    title: "Dummy Admin Management",
    description: "View and manage all dummy admin item",
  };

  const { userInfo } = useSelector((state) => state.auth);

  return (
    <section className="w-[90%] mx-auto py-10">
      <div className="flex items-center mb-4">
        <BackButton />
        <div></div>
        <h2 className="text-3xl font-bold text-shark flex items-center justify-center w-full">
          {/* Hello {userInfo.firstName}{" "}
          <div className="ml-2">
            <FaUserLock />
          </div> */}
          ADMIN DASHBOARD
        </h2>
      </div>

      <p className="flex items-center text-lg text-shark">
        Hello {userInfo.firstName}{" "}
        <span className="ml-2">
          <FaUserLock />
        </span>{" "}
        ,
      </p>
      <p className="flex items-center text-lg text-shark mb-4">Welcome to the admin</p>

      <div className="flex flex-col md:grid md:grid-cols-2 lg:grid lg:grid-cols-3 gap-4 justify-center w-full">
        <Link to="/admin/users">
          <Card data={usersCardInfo} />
        </Link>
        <Link to="/admin/products">
          <Card data={productsCardInfo} />
        </Link>
        <Link to="/admin/dummyitems">
          <Card data={dummyCardInfo} />
        </Link>
        <Link to="/admin/dummyitems">
          <Card data={dummyCardInfo} />
        </Link>
        <Link to="/admin/dummyitems">
          <Card data={dummyCardInfo} />
        </Link>
        <Link to="/admin/dummyitems">
          <Card data={dummyCardInfo} />
        </Link>
        <Link to="/admin/dummyitems">
          <Card data={dummyCardInfo} />
        </Link>
      </div>
    </section>
  );
};

export default AdminPage;
