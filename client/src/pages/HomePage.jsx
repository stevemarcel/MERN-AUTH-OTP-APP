import { Link } from "react-router-dom";
import { FaArrowRight, FaCheck, FaCode } from "react-icons/fa";

import {
  SiRedux,
  SiTailwindcss,
  SiExpress,
  SiMongodb,
  SiReact,
  SiNodedotjs,
  SiBrevo,
} from "react-icons/si";

import Hero from "../components/Hero";
import FunctionalitiesSection from "../components/FunctionalitiesSection";

import adminDashboardImage from "../assets/img/functionalities/Admin-Dashboard.avif";

const HomePage = () => {
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
      name: "Brevo",
      description: "Mailing Service",
      icon: <SiBrevo />,
    },
  ];

  return (
    <div className="text-shark">
      {/* Hero */}
      <Hero
        eyebrow="Secure User Management"
        title="A modern platform for managing users with confidence."
        description="A full-stack authentication and user management system designed around security, efficient administration, and a clear user experience."
      >
        <div className="flex flex-col sm:flex-row gap-3">
          <Link
            to="/register"
            className="inline-flex items-center justify-center gap-3 px-7 py-3 bg-light text-shark font-semibold rounded-lg hover:bg-sharkLight-100 transition duration-200"
          >
            Explore the Platform
            <FaArrowRight />
          </Link>

          <a
            href="#features"
            className="inline-flex items-center justify-center px-7 py-3 border border-sharkLight-100/40 text-light font-semibold rounded-lg hover:bg-light/10 transition duration-200"
          >
            View Features
          </a>
        </div>
      </Hero>

      {/* Platform Introduction */}
      <section className="py-16 md:py-20">
        <div className="w-[90%] max-w-6xl mx-auto">
          <div className="max-w-3xl">
            <p className="text-sm font-semibold uppercase tracking-[0.2em] text-sharkLight-300 mb-3">
              The Platform
            </p>

            <h2 className="text-2xl md:text-4xl font-bold leading-tight">
              Authentication and administration, brought together.
            </h2>

            <p className="mt-5 text-sharkLight-300 leading-relaxed">
              From account registration and email verification to profile management, password
              recovery, administrative controls, and activity tracking, the platform provides the
              essential tools needed to manage users securely.
            </p>
          </div>
        </div>
      </section>

      {/* Platform Showcase */}
      <section className="bg-sharkLight-100/30 py-16 md:py-20">
        <div className="w-[90%] max-w-6xl mx-auto">
          <div className="grid lg:grid-cols-[1.15fr_0.85fr] gap-10 lg:gap-16 items-center">
            {/* Visual */}
            <div className="relative">
              <div className="rounded-md overflow-hidden shadow-xl border border-sharkLight-200 bg-white">
                <img
                  src={adminDashboardImage}
                  alt="User management admin dashboard"
                  className="w-full h-auto object-cover"
                />
              </div>
            </div>

            {/* Content */}
            <div>
              <p className="text-sm font-semibold uppercase tracking-[0.2em] text-sharkLight-300 mb-3">
                Administration
              </p>

              <h2 className="text-2xl md:text-4xl font-bold leading-tight">
                Manage users without the clutter.
              </h2>

              <p className="mt-5 text-sharkLight-300 leading-relaxed">
                The administrative dashboard brings the most important user management tools
                together in one focused workspace.
              </p>

              <div className="mt-7 space-y-4">
                {[
                  "Search and filter user accounts",
                  "Create and update users",
                  "Manage individual or multiple accounts",
                  "Paginated user records",
                  "Review user activity history",
                ].map((item) => (
                  <div key={item} className="flex items-start gap-3">
                    <div className="mt-0.5 w-5 h-5 rounded-full bg-shark text-light flex items-center justify-center flex-shrink-0">
                      <FaCheck className="text-[10px]" />
                    </div>

                    <p className="text-sm text-sharkLight-300">{item}</p>
                  </div>
                ))}
              </div>

              <Link
                to="/admin"
                className="inline-flex items-center gap-3 mt-8 font-semibold text-shark hover:text-sharkDark-100 transition duration-200"
              >
                Open Admin Dashboard
                <FaArrowRight className="text-sm" />
              </Link>
            </div>
          </div>
        </div>
      </section>

      {/* Features */}
      <div id="features">
        <FunctionalitiesSection />
      </div>

      {/* Technology */}
      <section className="py-16 md:py-20">
        <div className="w-[90%] max-w-6xl mx-auto">
          <div className="max-w-3xl">
            <p className="text-sm font-semibold uppercase tracking-[0.2em] text-sharkLight-300 mb-3">
              Technology
            </p>

            <h2 className="text-2xl md:text-4xl font-bold leading-tight">
              Built with a modern full-stack architecture.
            </h2>

            <p className="mt-4 text-sharkLight-300 leading-relaxed">
              The application combines a modern React frontend with a RESTful Node.js backend and
              MongoDB data layer, supported by established tools for state management, data
              fetching, styling, and transactional email.
            </p>
          </div>

          <div className="grid grid-cols-2 sm:grid-cols-4 gap-4 mt-10">
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

      {/* Final CTA */}
      <section className="bg-sharkDark-300 text-light">
        <div className="w-[90%] max-w-4xl mx-auto py-16 md:py-20 text-center">
          <p className="text-sm font-semibold uppercase tracking-[0.2em] text-sharkLight-300 mb-3">
            Ready to explore?
          </p>

          <h2 className="text-2xl md:text-4xl font-bold">See the platform in action.</h2>

          <p className="mt-4 text-sharkLight-100/70 max-w-2xl mx-auto leading-relaxed">
            Create an account and explore the authentication, user management, administrative, and
            security features for yourself.
          </p>

          <Link
            to="/register"
            className="inline-flex items-center gap-3 mt-8 px-7 py-3 bg-light text-shark font-semibold rounded-lg hover:bg-sharkLight-100 transition duration-200"
          >
            Explore the Platform
            <FaArrowRight />
          </Link>
        </div>
      </section>
    </div>
  );
};

export default HomePage;
