import Hero from "../components/Hero";
import {
  FaBullseye,
  FaCode,
  FaUserTie,
  FaRocket,
  FaLinkedin,
  FaGithubSquare,
  FaBehanceSquare,
  FaInstagramSquare,
} from "react-icons/fa";

import missionImage from "../assets/img/about/mission.jpg";
import techStackImage from "../assets/img/about/tech-stack.png";
import myProfilePhoto from "../assets/img/about/my-photo.png";

const AboutPage = () => {
  const aboutHeroDescription = `
    Discover the foundational principles and the journey behind our User Management System.
    Built with a commitment to security, efficiency, and user experience, this platform
    showcases modern full-stack development practices aimed at solving real-world challenges
    in user authentication and administration.
  `
    .replace(/\s+/g, " ")
    .trim();

  const missionContent = `
    At the core of this project is a dedication to simplifying user administration
    while elevating digital security. We strive to provide a robust and intuitive
    platform that empowers businesses to manage user accounts efficiently and securely,
    prioritizing data integrity and user privacy through advanced authentication protocols.
    Our vision is to set a new standard for user management, combining strong security
    measures with a seamless and accessible user experience.
  `
    .replace(/\s+/g, " ")
    .trim();

  const technologyContent = `
    This system is meticulously crafted using the cutting-edge MERN stack (MongoDB, Express.js,
    React, Node.js). We harnessed React and Redux Toolkit for a dynamic and predictable frontend,
    React Query for highly efficient data fetching and caching, and Tailwind CSS for rapid,
    responsive UI development. On the backend, Express.js provides a robust RESTful API,
    seamlessly integrated with MongoDB for flexible and scalable data storage. This combination
    ensures a high-performance, maintainable, and modern application ready for deployment.
  `
    .replace(/\s+/g, " ")
    .trim();

  const developerContent = `
    This User Management System was developed by <strong>Stephen Onyejuluwa</strong>
    as a comprehensive demonstration of full-stack web development capabilities.
    My passion for building secure, efficient, and user-friendly applications drove the creation
    of this project, focusing on modern best practices in authentication, state management,
    and API design. I continuously strive to learn and implement the latest technologies
    to create impactful digital solutions.
  `
    .replace(/\s+/g, " ")
    .trim();

  return (
    <div>
      <Hero title="About Our User Management System" description={aboutHeroDescription} />

      {/* Main content area for the About page */}
      <main>
        {/* Our Mission Section - Image on Left */}
        <section className="bg-sharkLight-100/10 py-12">
          <div className="w-[90%] mx-auto flex flex-col md:flex-row items-center justify-center gap-8 md:gap-12">
            <div className="md:w-1/2 flex justify-center">
              <img
                src={missionImage}
                alt="Our Mission"
                className="rounded-lg shadow-lg max-w-full h-auto"
              />
            </div>
            <div className="md:w-1/2 text-sharkDark-400">
              <h2 className="mb-4 text-lg md:text-2xl font-bold uppercase flex items-center justify-center md:justify-start">
                <FaBullseye className="mr-3 text-shark" size={24} /> Our Mission
              </h2>
              <p className="text-justify">{missionContent}</p>
            </div>
          </div>
        </section>

        {/* Technologies Section - Image on Right */}
        <section className="bg-sharkLight-100/30 py-12">
          <div className="w-[90%] mx-auto flex flex-col md:flex-row-reverse items-center justify-center gap-8 md:gap-12">
            <div className="md:w-1/2 flex justify-center">
              <img
                src={techStackImage}
                alt="Technologies Used"
                className="rounded-lg shadow-lg max-w-full h-auto"
              />
            </div>
            <div className="md:w-1/2 text-sharkDark-400">
              <h2 className="mb-4 text-lg md:text-2xl font-bold uppercase flex items-center justify-center md:justify-start">
                <FaCode className="mr-3 text-shark" size={24} /> Technologies That Drive Us
              </h2>
              <p className="text-justify">{technologyContent}</p>
            </div>
          </div>
        </section>

        {/* Meet the Developer Section - Image on Left */}
        <section className="bg-sharkLight-100/10 py-12">
          <div className="w-[90%] mx-auto flex flex-col md:flex-row items-center justify-center gap-8 md:gap-12">
            <div className="md:w-1/2 flex justify-center">
              <img
                src={myProfilePhoto}
                alt="Developer Photo"
                className="rounded-full shadow-lg max-w-full h-auto" // Rounded for a profile look
              />
            </div>
            <div className="md:w-1/2 text-sharkDark-400">
              <h2 className="mb-4 text-lg md:text-2xl font-bold uppercase flex items-center justify-center md:justify-start">
                <FaUserTie className="mr-3 text-shark" size={24} /> Meet the Developer
              </h2>
              <p
                className="text-justify"
                dangerouslySetInnerHTML={{
                  __html: developerContent,
                }}
              ></p>

              <div className="mt-6 text-center md:text-left">
                <p className="text-sharkDark-400 text-lg font-semibold">Connect with me:</p>
                <div className="flex justify-center md:justify-start mt-2 space-x-4">
                  <a
                    href="https://www.linkedin.com/in/stephen-onyejuluwa-098733190"
                    target="_blank"
                    rel="noopener noreferrer"
                    className="text-shark hover:text-sharkDark-100 transition duration-200"
                  >
                    <FaLinkedin size={30} />{" "}
                  </a>
                  <a
                    href="https://github.com/stevemarcel"
                    target="_blank"
                    rel="noopener noreferrer"
                    className="text-shark hover:text-sharkDark-100 transition duration-200"
                  >
                    <FaGithubSquare size={30} />
                  </a>
                  <a
                    href="https://www.behance.net/sharkcoloursng"
                    target="_blank"
                    rel="noopener noreferrer"
                    className="text-shark hover:text-sharkDark-100 transition duration-200"
                  >
                    <FaBehanceSquare size={30} />
                  </a>
                  <a
                    href="https://instagram.com/sharkcoloursng"
                    target="_blank"
                    rel="noopener noreferrer"
                    className="text-shark hover:text-sharkDark-100 transition duration-200"
                  >
                    <FaInstagramSquare size={30} />
                  </a>
                </div>
              </div>
            </div>
          </div>
        </section>

        {/* Call to Action Section - Styling Adjusted Here */}
        <section className="bg-sharkDark-300 text-sharkLight-100 py-12 text-center shadow-xl">
          {" "}
          <h3 className="text-xl md:text-3xl font-bold mb-4">
            Ready to Experience Secure User Management?
          </h3>
          <p className="mb-8 max-w-3xl mx-auto px-4">
            Dive in and explore the robust features of our system, or feel free to contact us for
            more information. Your secure and efficient user management solution is just a click
            away!
          </p>
          <a
            href="/login"
            className="inline-block px-10 py-4 bg-shark hover:bg-sharkDark-100 text-sharkLight-100 font-bold text-lg rounded-full transition duration-300 transform hover:scale-105 shadow-lg"
          >
            Get Started Now <FaRocket className="inline-block ml-3" />
          </a>
        </section>
      </main>
    </div>
  );
};

export default AboutPage;
