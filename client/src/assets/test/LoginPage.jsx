import { useState, useEffect } from "react";
import { Link, useNavigate } from "react-router-dom";
import { useDispatch, useSelector } from "react-redux";
import { toast } from "react-toastify";
import { useLoginMutation } from "../slices/usersApiSlice";
import { setCredentials } from "../slices/authSlice";
import Loader from "../components/Loader";

const LoginPage = () => {
  const formInputs = [
    { id: 1, type: "email", name: "email", placeholder: "Email" },
    { id: 2, type: "password", name: "password", placeholder: "Password" },
  ];

  const [formData, setFormData] = useState({
    email: "",
    password: "",
  });

  const navigate = useNavigate();
  const dispatch = useDispatch();

  const [loginApiCall, { isLoading }] = useLoginMutation();

  const { userInfo } = useSelector((state) => state.auth);

  useEffect(() => {
    if (userInfo) {
      navigate("/");
    }
  }, [navigate, userInfo]);

  const handleChange = (event) => {
    setFormData({ ...formData, [event.target.name]: event.target.value });
  };

  const loginHandler = async (e) => {
    e.preventDefault();

    try {
      const res = await loginApiCall(formData).unwrap();
      dispatch(setCredentials({ ...res }));
      navigate("/");
    } catch (err) {
      toast.error(err?.data?.message || err.error);
    }
  };

  return (
    <div className="flex flex-col md:flex-row h-[94vh] md:h-[90vh]">
      <div className="flex loginBg w-full md:w-1/2 h-[30vh] md:h-[90vh]">
        <div className="absolute w-full md:w-1/2 top-18 left-0 right-0 h-[30vh] md:h-[90vh] bg-sharkDark-500 bg-opacity-70 z-10"></div>{" "}
      </div>
      <div className="flex justify-center bg-sharkLight-100 text-sharkDark-300 pt-8 md:pb-40 md:items-center w-full md:w-1/2 h-[64vh] md:h-[90vh]">
        <div className=" w-[90%] mx-auto p-4 ">
          <h2 className="text-2xl text-center font-bold mb-4 text-shark">Welcome Back</h2>
          <form onSubmit={loginHandler}>
            {formInputs.map((input) => (
              <div className="mb-4" key={input.id}>
                <input
                  type={input.type}
                  name={input.name}
                  id={input.name}
                  placeholder={input.placeholder}
                  className="w-full px-3 py-2 rounded-md border border-sharkLight-100 focus:outline-none focus:ring focus:ring-sharkLight-400 focus:ring-opacity-50"
                  value={formData[input.name]}
                  onChange={handleChange}
                />
              </div>
            ))}

            <button
              type="submit"
              className="w-full px-4 py-2 bg-shark ring-sharkLight-400 hover:bg-sharkDark-100 text-white rounded "
            >
              {isLoading ? (
                <div className="text-3xl">
                  <Loader />
                </div>
              ) : (
                "Log in"
              )}
            </button>
          </form>
          <div className="mt-5 text-center">
            <p>
              New here?{" "}
              <Link
                to="/register"
                className="text-shark hover:text-sharkLight-400 hover:cursor-pointer hover:underline font-medium"
              >
                Get Started
              </Link>
            </p>
          </div>
        </div>
      </div>
    </div>
  );
};

export default LoginPage;
