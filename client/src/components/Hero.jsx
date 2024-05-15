// import PlaceholderImg from "../assets/placeholder.jpg";

const Hero = () => {
  return (
    <section className="heroBg h-96 mb-10 text-center flex items-center text-sharkLight-100">
      <div className="absolute top-18 left-0 right-0 h-96 bg-sharkDark-400 bg-opacity-90 z-10"></div>{" "}
      {/* <div className="absolute inset-0 h-96 bg-black bg-opacity-50 z-10"></div>{" "} */}
      {/* Overlay element */}
      <div className="p-6 relative z-20">
        <h2 className="mb-2 text-4xl font-bold">MERN AUTHENTICATION OTP SYSTEM</h2>
        <p className="md:w-[70%] mx-auto ">
          This is a Mern Project that focuses on Authentication with an OTP system. It sends a
          confirmation mail for new user registrations and password updates. It stores the JWT token
          in a HTTP-only cookie. The technologies used in the project are React via Vite, React
          Redux Toolkit, Tailwind CSS, Express for the backend API and MongoDB for the RESTful
          database.
        </p>
      </div>
      {/* <div>
          <button className="rounded-full">Register</button>
          <button className="rounded-full">Login</button>
          </div> */}
    </section>
  );
};

export default Hero;
