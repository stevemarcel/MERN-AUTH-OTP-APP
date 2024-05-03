const Hero = () => {
  return (
    <div className="h-screen container">
      <div className="max-w-md mx-auto ">
        <h2>MERN AUTH APP</h2>
        <p className="">
          This is a Mern Project that focuses on Authentication with an OTP system. It sends a
          confirmation mail for new user registrations and password updates. It stores the JWT token
          in a HTTP-only cookie. The technologies used in the project are React via Vite, React
          Redux Toolkit, Tailwind CSS, Express for the backend API and MongoDB for the RESTful
          database.
        </p>
        {/* <div>
        <button className="rounded-full">Register</button>
        <button className="rounded-full">Login</button>
        </div> */}
      </div>
    </div>
  );
};

export default Hero;
