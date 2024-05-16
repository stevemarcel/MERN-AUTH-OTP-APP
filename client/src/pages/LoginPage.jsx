import { useState, useEffect } from "react";
import { Link } from "react-router-dom";
import { toast } from "react-toastify";

const LoginPage = () => {
  const formInputs = [
    { id: 1, type: "email", name: "email", placeholder: "Email" },
    { id: 2, type: "password", name: "password", placeholder: "Password" },
  ];

  const [formData, setFormData] = useState({
    email: "",
    password: "",
  });

  // const [error, setError] = useState("");

  const handleChange = (event) => {
    setFormData({ ...formData, [event.target.name]: event.target.value });
  };

  const loginHandler = async (e) => {
    e.preventDefault();
    // if (formData.password !== formData.confirmPassword) {
    //   toast.error("Passwords do not match");
    // } else if (
    //   formData.firstName === "" ||
    //   formData.lastName === "" ||
    //   formData.email === "" ||
    //   formData.password === "" ||
    //   formData.confirmPassword === ""
    // ) {
    //   toast.error("Invalid Inputs");
    // } else {
    //   try {
    //     // const res = await registerApiCall({ name, email, password }).unwrap();
    //     // dispatch(setCredentials({ ...res }));
    //     // navigate("/");
    //   } catch (err) {
    //     toast.error(err?.data?.message || err.error);
    //   }
    // }
  };

  return (
    <div className="flex flex-row">
      <div className="hidden md:flex loginBg h-screen w-1/2">
        <div className="absolute w-1/2 top-18 left-0 right-0 h-full bg-sharkDark-500 bg-opacity-70 z-10"></div>{" "}
      </div>
      <div className="flex justify-center bg-sharkLight-100 text-sharkDark-300 w-full md:w-1/2">
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
              Log in
            </button>
          </form>
          <div className="mt-5 text-center">
            <p>
              New here?{" "}
              <Link
                to="/register"
                className="text-shark hover:text-sharkLight-400 hover:cursor-pointer"
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
