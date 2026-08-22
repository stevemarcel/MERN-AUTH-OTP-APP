import { FaShieldAlt, FaUsers, FaUserCog, FaHistory, FaEnvelope, FaLock } from "react-icons/fa";

const capabilities = [
  {
    icon: <FaShieldAlt />,
    title: "Secure Authentication",
    description:
      "JWT authentication with HTTP-only cookies, protected routes, and secure account sessions.",
  },
  {
    icon: <FaUsers />,
    title: "User Management",
    description:
      "Create, view, update, search, filter, and manage user accounts from a centralized interface.",
  },
  {
    icon: <FaUserCog />,
    title: "Administration",
    description: "Powerful administrative controls for managing users individually or in batches.",
  },
  {
    icon: <FaHistory />,
    title: "Activity Tracking",
    description:
      "Important account actions are recorded so administrators can understand what happened and when.",
  },
  {
    icon: <FaLock />,
    title: "Password Security",
    description:
      "Password validation, strength feedback, secure hashing, and password recovery workflows.",
  },
  {
    icon: <FaEnvelope />,
    title: "Email Workflows",
    description:
      "Verification emails and password recovery workflows are integrated directly into the authentication system.",
  },
];

const FunctionalitiesSection = () => {
  return (
    <section className="bg-sharkLight-100/30 py-16 md:py-20">
      <div className="w-[90%] max-w-6xl mx-auto">
        {/* Section Heading */}
        <div className="max-w-3xl mb-10">
          <p className="text-sm font-semibold uppercase tracking-[0.2em] text-sharkLight-300 mb-3">
            Core Capabilities
          </p>

          <h2 className="text-2xl md:text-4xl font-bold text-shark leading-tight">
            Built around the essentials of modern user management.
          </h2>

          <p className="mt-4 text-sharkLight-300 leading-relaxed">
            Every part of the platform is designed to make authentication, administration, and
            account management more secure and easier to understand.
          </p>
        </div>

        {/* Capability Grid */}
        <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-5">
          {capabilities.map((capability) => (
            <article
              key={capability.title}
              className="bg-white border border-sharkLight-200 rounded-xl p-6 hover:shadow-md transition duration-200"
            >
              <div className="w-11 h-11 rounded-lg bg-shark text-light flex items-center justify-center text-lg mb-5">
                {capability.icon}
              </div>

              <h3 className="text-lg font-bold text-shark">{capability.title}</h3>

              <p className="mt-2 text-sm text-sharkLight-300 leading-relaxed">
                {capability.description}
              </p>
            </article>
          ))}
        </div>
      </div>
    </section>
  );
};

export default FunctionalitiesSection;
