import {
  FaBoxOpen,
  FaChartLine,
  FaHistory,
  FaLock,
  FaShieldAlt,
  FaUsers,
  FaWarehouse,
} from "react-icons/fa";

const capabilities = [
  {
    icon: <FaShieldAlt />,
    title: "Secure Authentication",
    description:
      "JWT sessions in HTTP-only cookies, protected routes, role-aware access, and secure sign-in.",
  },
  {
    icon: <FaUsers />,
    title: "User Lifecycle Management",
    description:
      "Create, search, update, and manage user accounts, roles, profiles, and email-verification status.",
  },
  {
    icon: <FaBoxOpen />,
    title: "Product Catalogue",
    description:
      "Create and maintain products with SKUs, barcodes, categories, pricing, images, and archive controls.",
  },
  {
    icon: <FaWarehouse />,
    title: "Inventory Control",
    description:
      "Track stock movements, adjustments, returns, damage, low-stock thresholds, and inventory value.",
  },
  {
    icon: <FaChartLine />,
    title: "Operational Dashboard",
    description:
      "Monitor user, product, and inventory key metrics, registration trends, stock status, and alerts.",
  },
  {
    icon: <FaHistory />,
    title: "Activity History",
    description:
      "Review user, product, and inventory events in a clear audit trail of operational activity.",
  },
  {
    icon: <FaLock />,
    title: "Account Recovery",
    description:
      "Email verification and OTP password-reset workflows help keep account recovery secure.",
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
            One workspace for secure account and stock operations.
          </h2>

          <p className="mt-4 text-sharkLight-300 leading-relaxed">
            The platform connects authentication, user administration, product management,
            inventory control, reporting, and activity history in one application.
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
