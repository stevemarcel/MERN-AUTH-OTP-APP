import { Link } from "react-router-dom";
import {
  FaArrowRight,
  FaBehance,
  FaBoxOpen,
  FaChartLine,
  FaCheckCircle,
  FaCode,
  FaGithub,
  FaHistory,
  FaInstagram,
  FaKey,
  FaLinkedin,
  FaLock,
  FaShieldAlt,
  FaUsers,
  FaBoxes,
} from "react-icons/fa";
import { SiExpress, SiMongodb, SiNodedotjs, SiReact, SiRedux, SiTailwindcss } from "react-icons/si";

import Hero from "../components/Hero";

import myProfilePhoto from "../assets/img/about/my-photo.avif";
import aboutHeroImage from "../assets/img/hero/about-hero.avif";

const principles = [
  {
    icon: FaShieldAlt,
    title: "Secure by design",
    description:
      "Authentication, protected routes, verification, and password recovery are treated as core product workflows.",
  },
  {
    icon: FaChartLine,
    title: "Clarity over clutter",
    description:
      "Dashboards, status indicators, and focused screens help users find the next useful action quickly.",
  },
  {
    icon: FaHistory,
    title: "Traceable operations",
    description:
      "User, product, and inventory activity is recorded so important changes do not lose their context.",
  },
];

const platformBlueprint = [
  {
    icon: FaLock,
    title: "Access",
    detail: "Sign in, verify email, and recover accounts securely.",
  },
  {
    icon: FaUsers,
    title: "People",
    detail: "Manage account records, roles, profiles, and activity.",
  },
  {
    icon: FaBoxOpen,
    title: "Products",
    detail: "Maintain catalogue details, identifiers, pricing, and status.",
  },
  {
    icon: FaBoxes,
    title: "Inventory",
    detail: "Track stock movements, values, thresholds, and attention.",
  },
  {
    icon: FaChartLine,
    title: "Insight",
    detail: "Monitor trends, metrics, stock health, and operational history.",
  },
];

const technologies = [
  { name: "MongoDB", description: "Data layer", icon: SiMongodb },
  { name: "Express.js", description: "Backend API", icon: SiExpress },
  { name: "React", description: "Frontend", icon: SiReact },
  { name: "Node.js", description: "Runtime", icon: SiNodedotjs },
  { name: "Redux Toolkit", description: "Application state", icon: SiRedux },
  { name: "RTK Query", description: "Data fetching", icon: FaCode },
  { name: "Tailwind CSS", description: "Interface system", icon: SiTailwindcss },
  { name: "JWT", description: "Secure sessions", icon: FaKey },
];

const AboutPage = () => {
  return (
    <div className="bg-light text-shark overflow-hidden">
      <Hero
        eyebrow="About the project"
        title={
          <>
            Built for operations that need to feel{" "}
            <span className="text-sharkLight-300">secure, clear, and connected.</span>
          </>
        }
        description="What began as a secure authentication project has evolved into a full-stack operations platform for managing users, products, inventory, and the activity that connects them."
        backgroundImage={aboutHeroImage}
      >
        <div className="flex flex-col sm:flex-row gap-3">
          <Link
            to="/features"
            className="inline-flex items-center justify-center gap-2 px-6 py-3 bg-light text-shark font-semibold rounded-md hover:bg-sharkLight-100 transition duration-200"
          >
            Explore Capabilities
            <FaArrowRight />
          </Link>

          <Link
            to="/register"
            className="inline-flex items-center justify-center gap-2 px-6 py-3 border border-sharkLight-300/40 text-light font-semibold rounded-md hover:bg-light/10 transition duration-200"
          >
            Create an Account
          </Link>
        </div>
      </Hero>

      <main>
        {/* STORY */}
        <section className="py-16 md:py-24">
          <div className="w-[90%] max-w-6xl mx-auto">
            <div className="grid lg:grid-cols-[0.8fr_1.2fr] gap-10 lg:gap-20 items-start">
              <div>
                <p className="text-sm uppercase tracking-[0.2em] font-semibold text-sharkLight-300 mb-3">
                  The evolution
                </p>

                <h2 className="text-3xl md:text-4xl font-bold leading-tight">
                  From account security to connected operations.
                </h2>

                <div className="mt-8 p-6 rounded-2xl bg-sharkDark-300 text-light shadow-xl">
                  <p className="text-sm font-semibold uppercase tracking-[0.18em] text-sharkLight-200">
                    The guiding idea
                  </p>
                  <p className="mt-3 text-xl md:text-2xl font-semibold leading-8">
                    The information needed to do good work should be secure, structured, and easy to
                    act on.
                  </p>
                </div>
              </div>

              <div className="space-y-6 text-sharkLight-500 leading-8">
                <p>
                  The project started with a practical question: how do you make account access feel
                  secure without making the experience difficult to use? That led to protected
                  routes, email verification, password recovery, user profiles, and administration.
                </p>

                <p>
                  As the scope grew, the same need for clarity extended beyond accounts. Product
                  catalogues, stock movements, low-stock attention, dashboard reporting, and
                  activity history became part of a single operational workflow.
                </p>

                <p>
                  Today, the application is designed as a connected workspace: access is protected,
                  records are manageable, changes are traceable, and the dashboard helps make the
                  next decision easier to see.
                </p>
              </div>
            </div>
          </div>
        </section>

        {/* PRINCIPLES */}
        <section className="py-16 md:py-20 bg-sharkLight-100/30">
          <div className="w-[90%] max-w-6xl mx-auto">
            <div className="max-w-3xl mb-10">
              <p className="text-sm uppercase tracking-[0.2em] font-semibold text-sharkLight-300 mb-3">
                Product principles
              </p>

              <h2 className="text-3xl md:text-4xl font-bold leading-tight">
                The standards behind every workflow.
              </h2>
            </div>

            <div className="grid md:grid-cols-3 gap-5">
              {principles.map(({ icon: Icon, title, description }) => (
                <article
                  key={title}
                  className="
                    bg-white rounded-2xl border border-sharkLight-200 p-6 md:p-7 hover:-translate-y-1
                    hover:shadow-lg transition duration-300
                  "
                >
                  <div className="w-11 h-11 rounded-xl bg-shark text-light flex items-center justify-center text-lg">
                    <Icon />
                  </div>

                  <h3 className="text-xl font-bold mt-6">{title}</h3>
                  <p className="text-sm text-sharkLight-500 leading-6 mt-3">{description}</p>
                </article>
              ))}
            </div>
          </div>
        </section>

        {/* PLATFORM BLUEPRINT */}
        <section className="py-16 md:py-24">
          <div className="w-[90%] max-w-6xl mx-auto rounded-3xl bg-sharkDark-300 text-light p-6 md:p-10">
            <div className="max-w-3xl mb-12">
              <p className="text-sm uppercase tracking-[0.2em] font-semibold text-sharkLight-300 mb-3">
                The platform blueprint
              </p>

              <h2 className="text-3xl md:text-4xl font-bold leading-tight">
                Five connected layers, one clearer operational view.
              </h2>

              <p className="mt-4 text-sharkLight-500 leading-8">
                Each part of the application serves a distinct purpose, but the value comes from how
                the layers work together—from protected access through to traceable insight.
              </p>
            </div>

            <div className="relative">
              <div className="grid sm:grid-cols-2 lg:grid-cols-5 gap-4 relative">
                {platformBlueprint.map(({ icon: Icon, title, detail }, index) => (
                  <article
                    key={title}
                    className="relative min-h-[210px] rounded-2xl border border-sharkLight-400/35 bg-light/5 p-5 md:p-6"
                  >
                    <div
                      className="
                        w-11 h-11 rounded-xl bg-light text-shark flex items-center justify-center text-lg
                      "
                    >
                      <Icon />
                    </div>

                    <div className="mt-5">
                      <p className="text-xs font-semibold tracking-[0.18em] uppercase text-sharkLight-300">
                        0{index + 1}
                      </p>
                      <h3 className="font-bold text-lg mt-1">{title}</h3>
                      <p className="text-sm text-sharkLight-200 mt-2 leading-6">{detail}</p>
                    </div>

                    {index < platformBlueprint.length - 1 && (
                      <FaArrowRight className="hidden lg:block absolute -right-4 top-1/2 -translate-y-1/2 text-sharkLight-300 z-10" />
                    )}
                  </article>
                ))}
              </div>
            </div>
          </div>
        </section>

        {/* TECHNOLOGY */}
        <section className="py-16 md:py-20 bg-sharkDark-300 text-light">
          <div className="w-[90%] max-w-6xl mx-auto">
            <div className="grid lg:grid-cols-[0.8fr_1.2fr] gap-10 lg:gap-16 items-end">
              <div>
                <p className="text-sm uppercase tracking-[0.2em] font-semibold text-sharkLight-300 mb-3">
                  The technology
                </p>

                <h2 className="text-3xl md:text-4xl font-bold leading-tight">
                  A modern stack for a data-rich application.
                </h2>

                <p className="mt-5 text-sharkLight-200 leading-8">
                  The platform pairs a responsive React interface with a RESTful Node.js API and
                  MongoDB data layer, supported by tools chosen for predictable state, secure
                  sessions, and maintainable interfaces.
                </p>
              </div>

              <div className="grid grid-cols-2 sm:grid-cols-4 gap-3">
                {technologies.map(({ name, description, icon: Icon }) => (
                  <div
                    key={name}
                    className="rounded-xl border border-sharkLight-400/30 bg-light/5 p-4"
                  >
                    <Icon className="text-xl text-light" />
                    <h3 className="font-semibold text-sm mt-4">{name}</h3>
                    <p className="text-xs text-sharkLight-200 mt-1">{description}</p>
                  </div>
                ))}
              </div>
            </div>
          </div>
        </section>

        {/* DEVELOPER */}
        <section className="py-16 md:py-24">
          <div className="w-[90%] max-w-5xl mx-auto">
            <div
              className="
                p-6 md:p-8 grid md:grid-cols-[280px_1fr] gap-10 md:gap-14 items-center
                bg-white border border-sharkLight-200 rounded-2xl shadow-xl
              "
            >
              {/* Profile Image */}
              <div className="flex justify-center">
                <div className="w-52 h-52 rounded-2xl overflow-hidden border-4 border-sharkLight-100 shadow-lg">
                  <img
                    src={myProfilePhoto}
                    alt="Stephen Onyejuluwa"
                    className="w-full h-full object-cover"
                  />
                </div>
              </div>

              <div>
                <p className="text-sm uppercase tracking-[0.2em] font-semibold text-sharkLight-300 mb-3">
                  The developer
                </p>

                <h2 className="text-3xl md:text-4xl font-bold">Stephen Onyejuluwa</h2>

                <p className="mt-5 text-sharkLight-500 leading-8">
                  I built this project as a practical demonstration of full-stack development:
                  translating secure backend workflows and data models into an interface that feels
                  clear, useful, and ready for real operational work.
                </p>

                <p className="mt-4 text-sharkLight-500 leading-8">
                  The focus is not just on individual features, but on the relationships between
                  them—how users access the system, how records change, and how the resulting data
                  helps an administrator understand what matters next.
                </p>

                <div className="flex flex-wrap gap-3 mt-7">
                  {[
                    [
                      "LinkedIn",
                      "https://www.linkedin.com/in/stephen-onyejuluwa-098733190",
                      FaLinkedin,
                    ],
                    ["GitHub", "https://github.com/stevemarcel", FaGithub],
                    ["Behance", "https://www.behance.net/sharkcoloursng", FaBehance],
                    ["Instagram", "https://instagram.com/sharkcoloursng", FaInstagram],
                  ].map(([label, href, Icon]) => (
                    <a
                      key={label}
                      href={href}
                      target="_blank"
                      rel="noopener noreferrer"
                      aria-label={label}
                      className="
                        w-10 h-10 rounded-lg bg-shark text-light flex items-center
                        justify-center hover:bg-sharkDark-100 hover:-translate-y-0.5 transition
                      "
                    >
                      <Icon />
                    </a>
                  ))}
                </div>
              </div>
            </div>
          </div>
        </section>

        {/* CTA */}
        <section className="mb-12 md:mb-20">
          <div className="w-[90%] max-w-4xl mx-auto text-center">
            <div
              className="
              inline-flex w-12 h-12 items-center justify-center rounded-full
              bg-sharkLight-100 text-shark
            "
            >
              <FaCheckCircle className="text-xl" />
            </div>

            <h2 className="text-3xl md:text-4xl font-bold mt-5">
              Explore the platform in context.
            </h2>

            <p className="mt-4 max-w-2xl mx-auto text-sharkLight-500 leading-7">
              Follow the secure account flow, then explore how people, products, inventory, and
              reporting work together in one operational workspace.
            </p>

            <div className="flex flex-col sm:flex-row justify-center gap-3 mt-8">
              <Link
                to="/features"
                className="
                  inline-flex items-center justify-center gap-2 px-7 py-3 bg-shark text-light
                  font-semibold rounded-md hover:bg-sharkDark-100 transition duration-200
                "
              >
                View Features
                <FaArrowRight />
              </Link>

              <Link
                to="/register"
                className="
                  inline-flex items-center justify-center gap-2 px-7 py-3 border border-sharkLight-300
                  text-shark font-semibold rounded-md hover:bg-sharkLight-100 transition duration-200
                "
              >
                Create an Account
              </Link>
            </div>
          </div>
        </section>
      </main>
    </div>
  );
};

export default AboutPage;
