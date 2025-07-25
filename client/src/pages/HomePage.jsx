import FunctionalitiesSection from "../components/FunctionalitiesSection";
import Hero from "../components/Hero";

const HomePage = () => {
  const homePageDescription = [
    "This project is a full-stack web application built with the MERN (MongoDB, Express.js, React, Node.js) stack, focusing on secure user authentication and efficient administrative user management.",
    "It features robust authentication with One-Time Passwords (OTP) for registration and password resets, and JSON Web Tokens (JWTs) in HTTP-only cookies for enhanced security against XSS/CSRF vulnerabilities. The Admin Dashboard provides full user lifecycle management, enabling administrators to add, view, edit, and delete accounts individually or in batches, presented in a paginated table (10 users/page) with search and filter functions.",
    "Key enhancements include real-time password validation with strength indicators and toast notifications for all user interactions, ensuring a smooth and secure experience.",
    "The frontend is developed using React (Vite) for fast development. Redux Toolkit manages global application state and React Query handles data fetching and caching with Tailwind CSS for styling. The backend API is built as a RESTful with Express.js with MongoDB for flexible and persistent data storage.",
  ];

  return (
    <div className=" text-sharkDark-300">
      <Hero title="USER MANAGEMENT SYSTEM (OTP)" description={homePageDescription} />
      <FunctionalitiesSection />
    </div>
  );
};

export default HomePage;
