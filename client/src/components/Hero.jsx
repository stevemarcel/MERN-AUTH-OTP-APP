const Hero = () => {
  return (
    <section className="heroBg h-[80vh] lg:h-96 mb-10 flex items-center text-sharkLight-100">
      <div className="absolute top-18 left-0 right-0 h-[80vh] lg:h-96 bg-sharkDark-400 bg-opacity-90 z-10"></div>{" "}
      {/* Overlay element */}
      <div className="p-6 relative z-20 w-[90%] lg:w-[70%] mx-auto text-justify space-y-2">
        <h2 className=" text-4xl font-bold text-center">MERN AUTHENTICATION OTP SYSTEM</h2>
        <p className=" ">
          This project is a comprehensive implementation of user authentication utilizing the MERN
          (MongoDB, Express, React, Node.js) stack along with various complementary technologies.
        </p>
        <p>
          It is designed to securely manage user registration, email verification, password reset
          using OTP (One-Time Password), and token-based authentication using JWT (JSON Web Tokens).
          The use of JWT stored in HTTP-only cookies fortifies the application against common
          security vulnerabilities like XSS (Cross-Site Scripting) and CSRF (Cross-Site Request
          Forgery) attacks. This not only simplifies the management of authentication tokens but
          also ensures automated handling by web browsers, thereby mitigating the risks associated
          with client-side JavaScript access.
        </p>
        <p>
          The technologies used in the project are React via Vite, React Redux Toolkit, Tailwind
          CSS, Express for the backend API and MongoDB for the RESTful database.
        </p>
      </div>
    </section>
  );
};

export default Hero;
