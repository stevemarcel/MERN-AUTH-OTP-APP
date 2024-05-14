import PlaceholderImg from "../assets/placeholder.jpg";

const Hero = () => {
  return (
    <div className="md:w-[90%] mx-auto  text-sharkDark-300">
      <section className="mb-10 text-center">
        <h2 className="mb-2 text-4xl font-bold">MERN AUTH APP</h2>
        <p className="">
          This is a Mern Project that focuses on Authentication with an OTP system. It sends a
          confirmation mail for new user registrations and password updates. It stores the JWT token
          in a HTTP-only cookie. The technologies used in the project are React via Vite, React
          Redux Toolkit, Tailwind CSS, Express for the backend API and MongoDB for the RESTful
          database.
        </p>
      </section>
      <section className="mb-10">
        <h2 className="mb-2 text-2xl font-bold text-center">Functionalities</h2>
        <div className="flex flex-col md:flex-row">
          <div className="w-64">
            <div className="h-52 ">
              <img src={PlaceholderImg} alt="Placeholder Image" className="mx-auto mb-8 " />
            </div>
            <div>
              <h2 className="mb-2 text-2xl font-bold">User Auth</h2>
              <p className="">
                Lorem ipsum dolor sit amet, consectetur adipisicing elit. A nisi non amet modi,
                cumque quisquam aperiam ratione sequi voluptates. Possimus provident cumque
                voluptate quibusdam odit aliquid incidunt, aperiam eaque itaque?
              </p>
            </div>
          </div>
          <div>01</div>
          <div>01</div>
          <div>01</div>
          <div>01</div>
          <div>01</div>
        </div>
      </section>
      {/* <div>
        <button className="rounded-full">Register</button>
        <button className="rounded-full">Login</button>
        </div> */}
    </div>
  );
};

export default Hero;
