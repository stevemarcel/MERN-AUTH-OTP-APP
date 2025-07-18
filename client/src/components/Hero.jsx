const Hero = () => {
  return (
    <section className="heroBg h-[90vh] lg:h-96 mb-10 flex items-center text-sharkLight-100">
      <div className="absolute top-18 left-0 right-0 h-[90vh] lg:h-96 bg-sharkDark-400 bg-opacity-90 z-10"></div>{" "}
      {/* Overlay element */}
      <div className="p-6 relative z-20 w-[95%] md:w-[80%] mx-auto text-justify space-y-2">
        <h2 className="text-lg md:text-3xl font-bold text-center">USER MANAGEMENT SYSTEM (OTP)</h2>
        <p>
          This project is a full-stack web application built with the MERN (MongoDB, Express.js,
          React, Node.js) stack, focusing on secure user authentication and efficient administrative
          user management.
        </p>
        <p>
          It features robust authentication with One-Time Passwords (OTP) for registration and
          password resets, and JSON Web Tokens (JWTs) in HTTP-only cookies for enhanced security
          against XSS/CSRF vulnerabilities. The Admin Dashboard provides full user lifecycle
          management, enabling administrators to add, view, edit, and delete accounts individually
          or in batches, presented in a paginated table (10 users/page) with search and filter
          functions.
        </p>
        <p>
          Key enhancements include real-time password validation with strength indicators and toast
          notifications for all user interactions, ensuring a smooth and secure experience.
        </p>
        <p>
          The frontend is developed using React (Vite) for fast development. Redux Toolkit manages
          global application state and React Query handles data fetching and caching with Tailwind
          CSS for styling. The backend API is built as a RESTful with Express.js with MongoDB for
          flexible and persistent data storage.
        </p>
      </div>
    </section>
  );
};

export default Hero;
