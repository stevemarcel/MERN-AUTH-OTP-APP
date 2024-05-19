import { useEffect } from "react";
import { useNavigate } from "react-router-dom";
import { useDispatch, useSelector } from "react-redux";
import { toast } from "react-toastify";
import { useLoginMutation } from "../slices/usersApiSlice";
import { setCredentials } from "../slices/authSlice";
import AuthPagesLayout from "../components/AuthPagesLayout";

const LoginPage = () => {
  // Login PROPS for AuthPagesLayout
  const title = "Welcome Back";
  const buttonText = "Log in";
  const redirectQuestion = "New here?";
  const redirectText = "Get Started";
  const formInputs = [
    { id: 1, type: "email", name: "email", placeholder: "Email" },
    { id: 2, type: "password", name: "password", placeholder: "Password" },
  ];

  const navigate = useNavigate();
  const dispatch = useDispatch();

  const [loginApiCall, { isLoading }] = useLoginMutation();

  const { userInfo } = useSelector((state) => state.auth);

  useEffect(() => {
    if (userInfo) {
      navigate("/");
    }
  }, [navigate, userInfo]);

  const loginHandler = async (formData) => {
    if (formData.email === "" || formData.password === "") {
      toast.error("Invalid Input(s)");
    } else {
      try {
        const res = await loginApiCall(formData).unwrap();
        dispatch(setCredentials({ ...res }));
        navigate("/");
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
      submitHandler={loginHandler}
      formInputs={formInputs}
    />
  );
};

export default LoginPage;
