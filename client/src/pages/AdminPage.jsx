import { Link } from "react-router-dom";
import { useSelector } from "react-redux";
import Card from "../components/Card";
import UserManagementImg from "../assets/img/userManagementImg.jpg";
import ProductsManagementImg from "../assets/img/productsManagementImg.jpg";
import PlaceholderImg from "../assets/img/placeholder.jpg";
import BackButton from "../components/BackButton";
import { FaUserLock } from "react-icons/fa";
import Hero from "../components/Hero";

const AdminPage = () => {
  const { userInfo } = useSelector((state) => state.auth);

  const admin = (
    <div className="font-bold text-xl inline-block">
      <div className="flex items-center">
        {userInfo.firstName} <FaUserLock className="ml-1" />
      </div>
    </div>
  );

  const adminPageDescription = [
    `Welcome to the administrator dashboard, `,
    admin,
    `. Here you can manage users, products, and more.`,
  ];

  const usersCardInfo = {
    image: UserManagementImg,
    title: "Manage Users",
    description: "View and manage all users",
  };
  const productsCardInfo = {
    image: ProductsManagementImg,
    title: "Manage Products",
    description: "View and manage all user products",
  };

  const dummyCardInfo = {
    image: PlaceholderImg,
    title: "Manage Dummy Items",
    description: "View and manage all dummy admin item",
  };

  return (
    <section className="w-[90%] mx-auto py-10">
      <div className="flex items-center mb-4">
        <BackButton />
        <h2 className="text-3xl font-bold text-shark flex items-center justify-center w-full">
          {/* Hello {userInfo.firstName}{" "}
          <div className="ml-2">
            <FaUserLock />
          </div> */}
          ADMIN DASHBOARD
        </h2>
      </div>

      {/* <p className="flex items-center text-lg text-shark">
        Hello {userInfo.firstName}{" "}
        <span className="ml-2">
          <FaUserLock />
        </span>{" "}
        ,
      </p>
      <p className="flex items-center text-lg text-shark mb-4">Welcome to the admin</p> */}

      <Hero description={adminPageDescription} inlineDescription={true} />

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
