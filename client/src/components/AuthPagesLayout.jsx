import { useState } from "react";
import PropTypes from "prop-types";
import { Link } from "react-router-dom";
import Loader from "./Loader";

import { FaEye, FaEyeSlash } from "react-icons/fa";

const AuthPagesLayout = ({
  title,
  buttonText,
  redirectQuestion,
  redirectText,
  isLoading,
  submitHandler,
  formInputs,
}) => {
  // * Initial form state.
  const [formData, setFormData] = useState({
    email: "",
    password: "",

    // Additional fields for register (optional)
    firstName: "",
    lastName: "",
    confirmPassword: "",
    isAdminCreatingUser: false,
  });

  // * Keeps track of which password fields are currently visible.
  const [visiblePasswords, setVisiblePasswords] = useState({});

  // * Handle changes to all form inputs..
  const handleInputChange = (e) => {
    setFormData({
      ...formData,
      [e.target.name]: e.target.value,
    });
  };

  // * Toggle password visibility for a specific password field
  // We use the field name instead of one shared boolean so that "Password" and "Confirm Password" can be toggled independently.
  const togglePasswordVisibility = (fieldName) => {
    setVisiblePasswords((prev) => ({
      ...prev,
      [fieldName]: !prev[fieldName],
    }));
  };

  return (
    <div className="flex flex-col md:flex-row h-[94vh] md:h-[90vh]">
      {/* ============================================================
          AUTH PAGE IMAGE / BACKGROUND SECTION
          The background image changes depending on whether this is
          the Register page or Login page.
      ============================================================ */}
      <div
        className={`${
          buttonText === "Register" ? "regBg h-[20vh]" : "loginBg h-[30vh]"
        } flex w-full md:w-1/2 md:h-[90vh]`}
      >
        {/* Dark overlay placed over the background image */}
        <div
          className={`${
            buttonText === "Register" ? "h-[20vh]" : "h-[30vh]"
          } absolute w-full md:w-1/2 top-18 left-0 right-0 md:h-[90vh] bg-sharkDark-500 bg-opacity-70 z-10`}
        ></div>
      </div>

      {/* ============================================================
          AUTH FORM SECTION
      ============================================================ */}
      <div
        className={`${
          buttonText === "Register" ? "h-[74vh]" : "h-[64vh]"
        } flex justify-center bg-sharkLight-100 text-sharkDark-300 pt-8 md:pb-40 md:items-center w-full md:w-1/2 md:h-[90vh]`}
      >
        <div className="w-[90%] mx-auto p-4">
          {/* Page title */}
          <h2 className="text-2xl text-center font-bold mb-4 text-shark">{title}</h2>

          {/* ==========================================================
              AUTH FORM
              The same form component is used for both Login and
              Register pages. The fields are supplied through formInputs.
          ========================================================== */}
          <form
            onSubmit={(e) => {
              e.preventDefault();

              // Send the completed form data back to the parent page.
              submitHandler(formData);
            }}
          >
            {formInputs.map((input) => {
              // Check whether the current input is a password field.
              // Only password fields need the show/hide functionality.
              const isPassword = input.type === "password";

              // Get the visibility state for this specific field.
              const isVisible = visiblePasswords[input.name];

              return (
                <div className="mb-4" key={input.id}>
                  {/* ==================================================
                      INPUT WRAPPER
                      "relative" allows the eye button to be positioned
                      inside the right side of password inputs.
                  ================================================== */}
                  <div className="relative">
                    <input
                      // Password fields switch between "password" and "text" depending on their current visibility state.
                      // Non-password inputs continue using their original type.
                      type={isPassword ? (isVisible ? "text" : "password") : input.type}
                      name={input.name}
                      id={input.name}
                      placeholder={input.placeholder}
                      className={`
                        w-full
                        px-3
                        py-2
                        rounded-md
                        border
                        border-sharkLight-100
                        focus:outline-none
                        focus:ring-2
                        focus:ring-sharkLight-400
                        focus:ring-opacity-50
                        ${isPassword ? "pr-10" : ""}
                      `}
                      value={formData[input.name] ?? ""}
                      onChange={handleInputChange}
                    />

                    {/* ================================================================
                        SHOW / HIDE PASSWORD CONTROL
                        Only rendered for password fields.
                    ================================================================ */}
                    {isPassword && (
                      <div className="group absolute right-3 top-1/2 -translate-y-1/2">
                        <button
                          type="button"
                          onClick={() => togglePasswordVisibility(input.name)}
                          className="
                            flex
                            items-center
                            justify-center
                            text-sharkLight-300
                            hover:text-shark
                            transition-colors
                            duration-200
                            focus:outline-none
                          "
                          aria-label={
                            isVisible
                              ? `Hide ${input.placeholder || "password"}`
                              : `Show ${input.placeholder || "password"}`
                          }
                        >
                          {isVisible ? <FaEyeSlash /> : <FaEye />}
                        </button>

                        {/* Tooltip for password visibility control */}
                        <span
                          className="
                            absolute
                            bottom-full
                            right-0
                            mb-2
                            px-2
                            py-1
                            text-xs
                            text-white
                            bg-sharkDark-300
                            rounded-md
                            opacity-0
                            group-hover:opacity-100
                            transition-opacity
                            duration-300
                            whitespace-nowrap
                            z-10
                            pointer-events-none
                          "
                        >
                          {isVisible ? "Hide password" : "Show password"}
                        </span>
                      </div>
                    )}
                  </div>
                </div>
              );
            })}

            {/* ==========================================================
                SUBMIT BUTTON
            ========================================================== */}
            <button
              type="submit"
              className="
                w-full
                px-4
                py-2
                bg-shark
                ring-sharkLight-400
                hover:bg-sharkDark-100
                text-white
                rounded
              "
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

          {/* ==========================================================
              LOGIN / REGISTER REDIRECT
              Changes automatically depending on the current page.
          ========================================================== */}
          <div className="mt-5 text-center">
            <p>
              {redirectQuestion}{" "}
              <Link
                to={buttonText === "Register" ? "/login" : "/register"}
                className="
                  text-shark
                  hover:text-sharkLight-400
                  hover:cursor-pointer
                  hover:underline
                  font-medium
                "
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

  // Required boolean prop indicating whether the API request is loading
  isLoading: PropTypes.bool.isRequired,

  // Required array containing the form field definitions.
  // Each object describes one input displayed by the layout.
  formInputs: PropTypes.arrayOf(
    PropTypes.shape({
      id: PropTypes.number.isRequired, // Required number prop
      type: PropTypes.string.isRequired, // Required string prop
      name: PropTypes.string.isRequired, // Required string prop
      placeholder: PropTypes.string, // Optional string prop
    }),
  ).isRequired, // Required array of objects with specific prop types

  // Callback used by LoginPage/RegisterPage to process submitted form data
  submitHandler: PropTypes.func.isRequired,
};

export default AuthPagesLayout;
