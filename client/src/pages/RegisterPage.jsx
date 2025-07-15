import { useEffect } from "react";
import { useNavigate } from "react-router-dom";
import { useDispatch, useSelector } from "react-redux";
import { toast } from "react-toastify";
import { useRegisterMutation } from "../slices/usersApiSlice";
import { setCredentials } from "../slices/authSlice";
import AuthPagesLayout from "../components/AuthPagesLayout";

const RegisterPage = () => {
  // Register PROPS for AuthPagesLayout
  const title = "Get Started";
  const buttonText = "Register";
  const redirectQuestion = "Already have an account?";
  const redirectText = "Log in";
  const formInputs = [
    { id: 1, type: "text", name: "firstName", placeholder: "First Name" },
    { id: 2, type: "text", name: "lastName", placeholder: "Last Name" },
    { id: 3, type: "email", name: "email", placeholder: "Email" },
    { id: 4, type: "password", name: "password", placeholder: "Password" },
    { id: 5, type: "password", name: "confirmPassword", placeholder: "Confirm Password" },
  ];

  const navigate = useNavigate();
  const dispatch = useDispatch();

  const [registerApiCall, { isLoading }] = useRegisterMutation();

  const { userInfo } = useSelector((state) => state.auth);

  useEffect(() => {
    if (userInfo && userInfo.emailVerified) {
      navigate("/");
    }
  }, [navigate, userInfo]);

  const registerHandler = async (formData) => {
    if (formData.password !== formData.confirmPassword) {
      toast.error("Passwords do not match");
    } else if (
      formData.firstName === "" ||
      formData.lastName === "" ||
      formData.email === "" ||
      formData.password === "" ||
      formData.isAdminCreatingUser === "" ||
      formData.confirmPassword === ""
    ) {
      toast.error("Invalid Input(s)");
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
    <AuthPagesLayout
      title={title}
      buttonText={buttonText}
      redirectQuestion={redirectQuestion}
      redirectText={redirectText}
      isLoading={isLoading}
      submitHandler={registerHandler}
      formInputs={formInputs}
    />
  );
};

export default RegisterPage;
