import { useState, useEffect } from "react";
import { Link, useNavigate } from "react-router-dom";
import { useDispatch, useSelector } from "react-redux";
import { toast } from "react-toastify";
import { useRegisterMutation } from "../slices/usersApiSlice";
import { setCredentials } from "../slices/authSlice";
import Loader from "../components/Loader";

const RegisterPage = () => {
  const formInputs = [
    { id: 1, type: "text", name: "firstName", placeholder: "First Name" },
    { id: 2, type: "text", name: "lastName", placeholder: "Last Name" },
    { id: 3, type: "email", name: "email", placeholder: "Email" },
    { id: 4, type: "password", name: "password", placeholder: "Password" },
    { id: 5, type: "password", name: "confirmPassword", placeholder: "Confirm Password" },
  ];

  const [formData, setFormData] = useState({
    firstName: "",
    lastName: "",
    email: "",
    password: "",
    confirmPassword: "",
    profile: "/images/sample-profile.png",
    username: "",
  });

  const navigate = useNavigate();
  const dispatch = useDispatch();

  const [registerApiCall, { isLoading }] = useRegisterMutation();

  const { userInfo } = useSelector((state) => state.auth);

  useEffect(() => {
    if (userInfo && userInfo.emailVerified) {
      navigate("/");
    }
  }, [navigate, userInfo]);

  const handleChange = (event) => {
    setFormData({ ...formData, [event.target.name]: event.target.value });
  };

  const registerHandler = async (e) => {
    e.preventDefault();
    if (formData.password !== formData.confirmPassword) {
      toast.error("Passwords do not match");
    } else if (
      formData.firstName === "" ||
      formData.lastName === "" ||
      formData.email === "" ||
      formData.password === "" ||
      formData.confirmPassword === ""
    ) {
      toast.error("Invalid Inputs");
    } else {
      try {
        const res = await registerApiCall(formData).unwrap();

        dispatch(setCredentials({ ...res }));
        navigate(`/confirm-email/${res._id}`);
      } catch (err) {
        toast.error(err?.data?.message || err.error);
      }
    }
  };

  return (
    <div className="flex flex-col md:flex-row h-[94vh] md:h-[90vh]">
      <div className="flex regBg w-full md:w-1/2 h-[20vh] md:h-[90vh]">
        <div className="absolute w-full md:w-1/2 top-18 left-0 right-0 h-[20vh] md:h-[90vh] bg-sharkDark-500 bg-opacity-70 z-10"></div>{" "}
      </div>
      <div className="flex justify-center bg-sharkLight-100 text-sharkDark-300 pt-8 md:pb-40 md:items-center w-full md:w-1/2 h-[74vh] md:h-[90vh]">
        <div className=" w-[90%] mx-auto p-4 ">
          <h2 className="text-2xl text-center font-bold mb-4 text-shark">Get Started</h2>
          <form onSubmit={registerHandler}>
            {formInputs.map((input) => (
              <div className="mb-4" key={input.id}>
                <input
                  type={input.type}
                  name={input.name}
                  id={input.name}
                  placeholder={input.placeholder}
                  className="w-full px-3 py-2 rounded-md border border-gray-300 focus:outline-none focus:ring focus:ring-sharkLight-400 focus:ring-opacity-50"
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
                "Register"
              )}
            </button>
          </form>
          <div className="mt-5 text-center">
            <p>
              Already have an account?{" "}
              <Link
                to="/login"
                className="text-shark hover:text-sharkLight-400 hover:cursor-pointer hover:underline font-medium"
              >
                Log in
              </Link>
            </p>
          </div>
        </div>
      </div>
    </div>
  );
};

export default RegisterPage;
