import { Link } from "react-router-dom";
import { useSelector } from "react-redux";
import Card from "../components/Card";
import UserManagementImg from "../assets/img/userManagementImg.jpg";
import ProductsManagementImg from "../assets/img/productsManagementImg.jpg";

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
  const { userInfo } = useSelector((state) => state.auth);

  return (
    <section className="w-[90%] mx-auto py-10">
      <h2 className="mb-8 text-2xl font-bold">Hello {userInfo.firstName},</h2>

      <div className="flex flex-col md:grid md:grid-cols-4 gap-4">
        <Link to="/admin/users">
          <Card data={usersCardInfo} />
        </Link>
        <Link to="/admin/products">
          <Card data={productsCardInfo} />
        </Link>
      </div>
    </section>
  );
};

export default AdminPage;
