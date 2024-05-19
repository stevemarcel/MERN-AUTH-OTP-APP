import { useState } from "react";
import PropTypes from "prop-types";
import { Link } from "react-router-dom";
import Loader from "./Loader";

const AuthPagesLayout = ({
  title,
  buttonText,
  redirectQuestion,
  redirectText,
  isLoading,
  submitHandler,
  formInputs,
}) => {
  const [formData, setFormData] = useState({
    email: "",
    password: "",
    // Additional fields for register (optional)
    firstName: "",
    lastName: "",
    confirmPassword: "",
    profile: "/images/sample-profile.png",
    username: "",
  });

  const handleInputChange = (event) => {
    setFormData({ ...formData, [event.target.name]: event.target.value });
  };

  return (
    <div className="flex flex-col md:flex-row h-[94vh] md:h-[90vh]">
      <div
        className={`${
          buttonText === "Register" ? `regBg h-[20vh]` : `loginBg h-[30vh]`
        } flex w-full md:w-1/2 md:h-[90vh]`}
      >
        <div
          className={`${
            buttonText === "Register" ? `h-[20vh]` : `h-[30vh]`
          } absolute w-full md:w-1/2 top-18 left-0 right-0 md:h-[90vh] bg-sharkDark-500 bg-opacity-70 z-10`}
        ></div>{" "}
      </div>
      <div
        className={`${
          buttonText === "Register" ? `h-[74vh]` : `h-[64vh]`
        } flex justify-center bg-sharkLight-100 text-sharkDark-300 pt-8 md:pb-40 md:items-center w-full md:w-1/2  md:h-[90vh]`}
      >
        <div className=" w-[90%] mx-auto p-4 ">
          <h2 className="text-2xl text-center font-bold mb-4 text-shark">{title}</h2>
          <form
            onSubmit={(e) => {
              e.preventDefault();
              submitHandler(formData);
            }}
            // onSubmit={submitHandler(formData)}
          >
            {formInputs.map((input) => (
              <div className="mb-4" key={input.id}>
                <input
                  type={input.type}
                  name={input.name}
                  id={input.name}
                  placeholder={input.placeholder}
                  className="w-full px-3 py-2 rounded-md border border-sharkLight-100 focus:outline-none focus:ring focus:ring-sharkLight-400 focus:ring-opacity-50"
                  value={formData[input.name]}
                  onChange={handleInputChange}
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
                buttonText
              )}
            </button>
          </form>
          <div className="mt-5 text-center">
            <p>
              {redirectQuestion}{" "}
              <Link
                to={buttonText === "Register" ? `/login` : `/register`}
                className="text-shark hover:text-sharkLight-400 hover:cursor-pointer hover:underline font-medium"
              >
                {redirectText}
              </Link>
            </p>
          </div>
        </div>
      </div>
    </div>
  );
};

AuthPagesLayout.propTypes = {
  title: PropTypes.string.isRequired, // Required string prop
  buttonText: PropTypes.string.isRequired, // Required string prop
  redirectQuestion: PropTypes.string, // Optional string prop
  redirectText: PropTypes.string, // Optional string prop
  isLoading: PropTypes.bool.isRequired, // Required boolean prop
  formInputs: PropTypes.arrayOf(
    PropTypes.shape({
      id: PropTypes.number.isRequired, // Required number prop
      type: PropTypes.string.isRequired, // Required string prop
      name: PropTypes.string.isRequired, // Required string prop
      placeholder: PropTypes.string, // Optional string prop
    })
  ).isRequired, // Required array of objects with specific prop types
  submitHandler: PropTypes.func.isRequired, // Required function prop
};

export default AuthPagesLayout;
