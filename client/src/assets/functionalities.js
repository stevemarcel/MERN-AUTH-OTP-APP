import secureUserAuthenticationIMG from "../assets//img/functionalities/Secure-User-Authentication.jpg";
import enhancedSecurityWithOTPIMG from "../assets/img/functionalities/Enhanced-Security-with-OTP.jpg";
import streamlinedTokenManagementIMG from "../assets/img/functionalities/Streamlined-Token-Management.jpg";
import adminDashboardIMG from "../assets/img/functionalities/Admin-Dashboard.png";
import robustAPIWithExpressIMG from "../assets/img/functionalities/Robust-API-with-Express.jpg";
import restfulDataExperienceIMG from "../assets/img/functionalities/RESTful-Data-Experience.jpg";
import passwordSecurityAndValidationIMG from "../assets/img/functionalities/Password-Security-and-Validation.png";
import userFeedbackAndNotificationsIMG from "../assets/img/functionalities/User-Feedback-and-Notifications.png";
import reactReduxTailwindCSSIMG from "../assets/img/functionalities/react-redux-tailwind-css.png";

const functionalities = [
  {
    id: 1,
    title: "Secure User Authentication",
    description:
      "Implements JWT in HTTP-only cookies for enhanced security against XSS, CSRF attacks.",
    image: secureUserAuthenticationIMG,
  },
  {
    id: 2,
    title: "Enhanced Security with OTP",
    description:
      "Provides an extra layer of security with One-Time Password (OTP) for user registration and password updates.",
    image: enhancedSecurityWithOTPIMG,
  },
  {
    id: 3,
    title: "Streamlined Token Management",
    description: "JWT simplifies token management and enables automatic handling by browsers.",
    image: streamlinedTokenManagementIMG,
  },
  {
    id: 4,
    title: "Admin Dashboard",
    description:
      "Centralized admin panel for user management: View, Edit, Add, Batch delete, Search and Filter.",
    image: adminDashboardIMG,
  },
  {
    id: 5,
    title: "Robust API with Express",
    description: "Leverages Express to create a powerful and reliable backend API.",
    image: robustAPIWithExpressIMG,
  },
  {
    id: 6,
    title: "RESTful Data Experience",
    description: "Utilizes MongoDB for a clean and efficient RESTful data access layer.",
    image: restfulDataExperienceIMG,
  },
  {
    id: 7,
    title: "Password Security & Validation",
    description:
      "Provides real-time feedback on password strength and enforces validation rules during registration and profile updates.",
    image: passwordSecurityAndValidationIMG,
  },
  {
    id: 8,
    title: "User Feedback & Notifications",
    description:
      "Implements success, error, and loading notifications with toast messages for all user interactions and API calls.",
    image: userFeedbackAndNotificationsIMG,
  },
  {
    id: 9,
    title: "Modern Frontend Stack",
    description:
      "Utilizes React with Vite, Redux Toolkit, and a Tailwind-CSS for a performant and visually appealing UI.",
    image: reactReduxTailwindCSSIMG,
  },
];

export default functionalities;
