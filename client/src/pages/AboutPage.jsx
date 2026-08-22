import {
  FaGithub,
  FaLinkedin,
  FaBehance,
  FaInstagram,
  FaArrowRight,
  FaShieldAlt,
  FaUsers,
  FaHistory,
  FaEnvelope,
  FaKey,
  FaUserShield,
  FaCode,
} from "react-icons/fa";

import Hero from "../components/Hero";

import { SiRedux, SiTailwindcss, SiExpress, SiMongodb, SiReact, SiNodedotjs } from "react-icons/si";
import { Link } from "react-router-dom";

// Images
import myProfilePhoto from "../assets/img/about/my-photo.avif";
import aboutHeroImage from "../assets/img/hero/about-hero.avif";

const AboutPage = () => {
  const features = [
    {
      icon: <FaShieldAlt />,
      title: "Secure Authentication",
      description:
        "JWT authentication with HTTP-only cookies, protected routes, email verification, and secure password management.",
    },
    {
      icon: <FaUsers />,
      title: "User Management",
      description:
        "A complete user management workflow covering profiles, account administration, roles, and user status.",
    },
    {
      icon: <FaHistory />,
      title: "Activity History",
      description:
        "Important account actions are recorded so administrators can understand what happened and when.",
    },
    {
      icon: <FaEnvelope />,
      title: "Email Workflows",
      description:
        "Verification emails and password recovery workflows are integrated directly into the authentication system.",
    },
  ];

  const technologies = [
    {
      name: "MongoDB",
      description: "Database",
      icon: <SiMongodb />,
    },
    {
      name: "Express.js",
      description: "Backend API",
      icon: <SiExpress />,
    },
    {
      name: "React",
      description: "Frontend",
      icon: <SiReact />,
    },
    {
      name: "Node.js",
      description: "Runtime",
      icon: <SiNodedotjs />,
    },
    {
      name: "Redux Toolkit",
      description: "State Management",
      icon: <SiRedux />,
    },
    {
      name: "RTK Query",
      description: "Data Fetching",
      icon: <FaCode />,
    },
    {
      name: "Tailwind CSS",
      description: "UI Styling",
      icon: <SiTailwindcss />,
    },
    {
      name: "JWT",
      description: "Authentication",
      icon: <FaKey />,
    },
  ];

  return (
    <div className="bg-light text-shark">
      {/* =========================================================
          HERO
      ========================================================= */}
      {/* <section className="relative overflow-hidden bg-sharkDark-300 text-light">
        <div className="absolute inset-0 bg-gradient-to-br from-sharkDark-300 via-shark to-sharkDark-400 opacity-95" />

        <div className="relative w-[90%] max-w-6xl mx-auto py-20 md:py-28">
          <div className="max-w-3xl">
            <p className="text-sm md:text-base uppercase tracking-[0.25em] text-sharkLight-300 font-semibold mb-5">
              About the Project
            </p>

            <h1 className="text-4xl md:text-6xl font-bold leading-tight">
              Built to make user management{" "}
              <span className="text-sharkLight-300">secure and simple.</span>
            </h1>

            <p className="mt-6 max-w-2xl text-base md:text-lg leading-8 text-sharkLight-200">
              A full-stack authentication and user management application built to explore secure
              authentication, account management, administrative workflows, and a modern user
              experience.
            </p>

            <div className="flex flex-col sm:flex-row gap-3 mt-8">
              <Link
                to="/register"
                className="inline-flex items-center justify-center gap-2 px-6 py-3 bg-light text-shark font-semibold rounded-md hover:bg-sharkLight-100 transition duration-200"
              >
                Create an Account
                <FaArrowRight />
              </Link>

              <Link
                to="/features"
                className="inline-flex items-center justify-center gap-2 px-6 py-3 border border-sharkLight-300/40 text-light font-semibold rounded-md hover:bg-light/10 transition duration-200"
              >
                Explore Features
              </Link>
            </div>
          </div>
        </div>
      </section> */}

      {/* Hero */}
      <Hero
        eyebrow="About the Project"
        title={
          <>
            Built to make user management{" "}
            <span className="text-sharkLight-300">secure and simple.</span>
          </>
        }
        description="A full-stack authentication and user management application built to explore secure authentication, account management, administrative workflows, and a modern user experience."
        backgroundImage={aboutHeroImage}
      >
        <div className="flex flex-col sm:flex-row gap-3">
          <Link
            to="/register"
            className="inline-flex items-center justify-center gap-2 px-6 py-3 bg-light text-shark font-semibold rounded-md hover:bg-sharkLight-100 transition duration-200"
          >
            Create an Account
            <FaArrowRight />
          </Link>

          <Link
            to="/features"
            className="inline-flex items-center justify-center gap-2 px-6 py-3 border border-sharkLight-300/40 text-light font-semibold rounded-md hover:bg-light/10 transition duration-200"
          >
            Explore Features
          </Link>
        </div>
      </Hero>

      {/* =========================================================
          WHY I BUILT IT
      ========================================================= */}
      <section className="py-16 md:py-24">
        <div className="w-[90%] max-w-6xl mx-auto">
          <div className="grid md:grid-cols-2 gap-10 md:gap-16 items-start">
            <div>
              <p className="text-sm uppercase tracking-[0.2em] font-semibold text-sharkLight-300 mb-3">
                The idea
              </p>

              <h2 className="text-3xl md:text-4xl font-bold leading-tight">
                Why I built this project
              </h2>
            </div>

            <div className="space-y-5 text-sharkDark-400 leading-8">
              <p>
                Authentication is one of those parts of a web application that can look simple from
                the outside but becomes considerably more interesting when security, account
                recovery, email verification, permissions, and administration are involved.
              </p>

              <p>
                I built this application as a practical full-stack project to explore those
                challenges while creating something that could function as a complete user
                management system rather than just a basic login and registration demo.
              </p>

              <p>
                The result brings authentication, user profiles, administrative controls, email
                workflows, and activity tracking together in a single application.
              </p>
            </div>
          </div>
        </div>
      </section>

      {/* =========================================================
          FEATURES
      ========================================================= */}
      <section className="py-16 md:py-24 bg-sharkLight-100/30">
        <div className="w-[90%] max-w-6xl mx-auto">
          <div className="max-w-2xl mb-10">
            <p className="text-sm uppercase tracking-[0.2em] font-semibold text-sharkLight-300 mb-3">
              What&apos;s inside
            </p>

            <h2 className="text-3xl md:text-4xl font-bold">More than just authentication.</h2>

            <p className="mt-4 text-sharkDark-400 leading-7">
              The application was designed around the complete user lifecycle, from registration and
              verification to administration and account activity.
            </p>
          </div>

          <div className="grid sm:grid-cols-2 lg:grid-cols-4 gap-5">
            {features.map((feature) => (
              <div
                key={feature.title}
                className="bg-light border border-sharkLight-200 rounded-xl p-6 hover:-translate-y-1 hover:shadow-lg transition duration-300"
              >
                <div className="w-11 h-11 rounded-lg bg-shark text-light flex items-center justify-center text-lg mb-5">
                  {feature.icon}
                </div>

                <h3 className="font-bold text-lg mb-3">{feature.title}</h3>

                <p className="text-sm text-sharkDark-400 leading-6">{feature.description}</p>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* =========================================================
          TECHNOLOGY STACK
      ========================================================= */}
      <section className="py-16 md:py-24">
        <div className="w-[90%] max-w-6xl mx-auto">
          <div className="text-center max-w-2xl mx-auto mb-12">
            <p className="text-sm uppercase tracking-[0.2em] font-semibold text-sharkLight-300 mb-3">
              The stack
            </p>

            <h2 className="text-3xl md:text-4xl font-bold">Built with modern tools.</h2>

            <p className="mt-4 text-sharkDark-400 leading-7">
              Each part of the application was built with technologies suited to its role, from the
              database and API to the frontend and state management.
            </p>
          </div>

          <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
            {technologies.map((technology) => (
              <div
                key={technology.name}
                className="border border-sharkLight-200 rounded-xl p-5 flex items-center gap-4 hover:border-sharkLight-300 hover:shadow-md transition duration-200"
              >
                <div className="text-2xl text-shark flex-shrink-0">{technology.icon}</div>

                <div>
                  <h3 className="font-semibold text-sm md:text-base">{technology.name}</h3>

                  <p className="text-xs text-sharkLight-300 mt-1">{technology.description}</p>
                </div>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* =========================================================
          DEVELOPER
      ========================================================= */}
      <section className="py-16 md:py-24 bg-sharkDark-300 text-light">
        <div className="w-[90%] max-w-5xl mx-auto">
          <div className="grid md:grid-cols-[280px_1fr] gap-10 md:gap-14 items-center">
            {/* Profile */}
            <div className="flex justify-center">
              <div className="w-52 h-52 md:w-64 md:h-64 rounded-full overflow-hidden border-4 border-sharkLight-300/20 shadow-2xl">
                <img
                  src={myProfilePhoto}
                  alt="Stephen Onyejuluwa"
                  className="w-full h-full object-cover"
                />
              </div>
            </div>

            {/* Content */}
            <div>
              <p className="text-sm uppercase tracking-[0.2em] font-semibold text-sharkLight-300 mb-3">
                The developer
              </p>

              <h2 className="text-3xl md:text-4xl font-bold">Stephen Onyejuluwa</h2>

              <p className="mt-5 text-sharkLight-200 leading-8">
                I built this project as a practical demonstration of my full-stack development
                skills, with particular attention to authentication, API design, state management,
                and user experience.
              </p>

              <p className="mt-4 text-sharkLight-200 leading-8">
                Rather than stopping at a simple authentication flow, I wanted to build something
                closer to a real application - one with account management, administrative controls,
                email workflows, protected resources, and a clear audit trail.
              </p>

              {/* Social Links */}
              <div className="flex flex-wrap gap-3 mt-7">
                <a
                  href="https://www.linkedin.com/in/stephen-onyejuluwa-098733190"
                  target="_blank"
                  rel="noopener noreferrer"
                  aria-label="LinkedIn"
                  className="w-10 h-10 rounded-md bg-light/10 flex items-center justify-center hover:bg-light/20 transition"
                >
                  <FaLinkedin />
                </a>

                <a
                  href="https://github.com/stevemarcel"
                  target="_blank"
                  rel="noopener noreferrer"
                  aria-label="GitHub"
                  className="w-10 h-10 rounded-md bg-light/10 flex items-center justify-center hover:bg-light/20 transition"
                >
                  <FaGithub />
                </a>

                <a
                  href="https://www.behance.net/sharkcoloursng"
                  target="_blank"
                  rel="noopener noreferrer"
                  aria-label="Behance"
                  className="w-10 h-10 rounded-md bg-light/10 flex items-center justify-center hover:bg-light/20 transition"
                >
                  <FaBehance />
                </a>

                <a
                  href="https://instagram.com/sharkcoloursng"
                  target="_blank"
                  rel="noopener noreferrer"
                  aria-label="Instagram"
                  className="w-10 h-10 rounded-md bg-light/10 flex items-center justify-center hover:bg-light/20 transition"
                >
                  <FaInstagram />
                </a>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* =========================================================
          CTA
      ========================================================= */}
      <section className="py-16 md:py-20">
        <div className="w-[90%] max-w-4xl mx-auto text-center">
          <div className="inline-flex items-center justify-center w-12 h-12 rounded-full bg-sharkLight-100 text-shark mb-5">
            <FaUserShield />
          </div>

          <h2 className="text-3xl md:text-4xl font-bold">Want to explore the application?</h2>

          <p className="mt-4 max-w-2xl mx-auto text-sharkDark-400 leading-7">
            Create an account, explore the authentication flow, or sign in to see the application
            from the user&apos;s perspective.
          </p>

          <div className="flex flex-col sm:flex-row justify-center gap-3 mt-7">
            <Link
              to="/register"
              className="inline-flex items-center justify-center gap-2 px-7 py-3 bg-shark text-light font-semibold rounded-md hover:bg-sharkDark-100 transition duration-200"
            >
              Create Account
              <FaArrowRight />
            </Link>

            <Link
              to="/login"
              className="inline-flex items-center justify-center gap-2 px-7 py-3 border border-sharkLight-300 text-shark font-semibold rounded-md hover:bg-sharkLight-100 transition duration-200"
            >
              Sign In
            </Link>
          </div>
        </div>
      </section>
    </div>
  );
};

export default AboutPage;
