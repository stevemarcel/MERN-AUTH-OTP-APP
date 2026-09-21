import { Link } from "react-router-dom";
import {
  FaArrowRight,
  FaBell,
  FaBoxOpen,
  FaChartLine,
  FaCheckCircle,
  FaExchangeAlt,
  FaHistory,
  FaLock,
  FaSearch,
  FaUserShield,
  FaUsers,
  FaBoxes,
} from "react-icons/fa";

import Hero from "../components/Hero";

import featuresHeroImage from "../assets/img/hero/features-hero.avif";
import adminDashboardImage from "../assets/img/functionalities/operations-dashboard.avif";
import productsCatalogueImage from "../assets/img/functionalities/product-catalogue.avif";
import userManagementImage from "../assets/img/functionalities/user-management.avif";

const featureGroups = [
  {
    icon: FaUserShield,
    title: "Secure access and account recovery",
    description:
      "Protect the entry point to your workspace while keeping account recovery straightforward for legitimate users.",
    items: [
      "JWT sessions stored in HTTP-only cookies",
      "Protected routes and role-aware admin access",
      "Email verification for new accounts",
      "OTP-assisted password reset workflows",
    ],
  },
  {
    icon: FaUsers,
    title: "User administration with context",
    description:
      "Keep account records organised and give administrators the controls needed to manage the full user lifecycle.",
    items: [
      "Search, filter, paginate, and bulk-manage accounts",
      "Create, update, remove, and restore user records",
      "Manage profiles, administrator access, and verification status",
      "Review each user's account activity history",
    ],
  },
  {
    icon: FaBoxOpen,
    title: "A product catalogue that stays structured",
    description:
      "Turn product data into a reliable operational reference rather than a collection of disconnected records.",
    items: [
      "SKU, barcode, category, brand, pricing, and product images",
      "Search and filter products by catalogue or stock state",
      "Archive and restore products without losing their history",
      "Track product creation and updates in a dedicated activity stream",
    ],
  },
  {
    icon: FaBoxes,
    title: "Inventory movements you can trace",
    description:
      "Record every meaningful change to stock and highlight the products that need attention before they become a problem.",
    items: [
      "Add, remove, adjust, return, and record damaged stock",
      "Set low-stock thresholds for individual products",
      "Spot low-stock and out-of-stock products quickly",
      "See inventory quantities, cost value, and potential retail value",
    ],
  },
];

const workflowSteps = [
  { icon: FaLock, label: "Secure access", detail: "Sign in, verify, recover" },
  { icon: FaUsers, label: "Manage people", detail: "Accounts and permissions" },
  { icon: FaBoxOpen, label: "Maintain products", detail: "Catalogue and pricing" },
  { icon: FaExchangeAlt, label: "Move stock", detail: "Every inventory change" },
  { icon: FaChartLine, label: "Act on insight", detail: "Metrics, alerts, history" },
];

const FeaturesPage = () => {
  return (
    <div className="bg-light text-shark overflow-hidden">
      <Hero
        eyebrow="Platform capabilities"
        title={
          <>
            One platform for the work behind{" "}
            <span className="text-sharkLight-300">users, products, and stock.</span>
          </>
        }
        description="Built for teams that need secure access, organised product data, controlled stock movements, and a clear view of what is happening across operations."
        backgroundImage={featuresHeroImage}
      >
        <div className="flex flex-col sm:flex-row gap-3">
          <Link
            to="/register"
            className="inline-flex items-center justify-center gap-2 px-6 py-3 bg-light text-shark font-semibold rounded-md hover:bg-sharkLight-100 transition duration-200"
          >
            Explore the Platform
            <FaArrowRight />
          </Link>

          <a
            href="#capabilities"
            className="inline-flex items-center justify-center gap-2 px-6 py-3 border border-sharkLight-300/40 text-light font-semibold rounded-md hover:bg-light/10 transition duration-200"
          >
            See What It Does
          </a>
        </div>
      </Hero>

      <main>
        <section className="py-16 md:py-20">
          <div className="w-[90%] max-w-6xl mx-auto">
            <div className="grid lg:grid-cols-[0.9fr_1.1fr] gap-10 lg:gap-16 items-end">
              <div>
                <p className="text-sm font-semibold uppercase tracking-[0.2em] text-sharkLight-300 mb-3">
                  Designed for connected operations
                </p>

                <h2 className="text-3xl md:text-4xl font-bold leading-tight">
                  Move from secure sign-in to informed action without changing systems.
                </h2>
              </div>

              <p className="text-sharkLight-500 leading-8">
                The platform links the records your team relies on: user accounts, product details,
                stock levels, operational events, and dashboard insights. Each area is focused on a
                clear job, while the activity history keeps the bigger picture connected.
              </p>
            </div>

            <div className="grid lg:grid-cols-3 gap-4 mt-10">
              {[
                ["Accounts", "Identity, verification, roles, and recovery", FaUserShield],
                ["Catalogue", "Products, SKUs, prices, categories, and status", FaBoxOpen],
                ["Inventory", "Stock movements, thresholds, value, and attention", FaBoxes],
              ].map(([label, detail, Icon]) => (
                <div
                  key={label}
                  className="bg-white border border-sharkLight-200 rounded-xl p-5 flex items-start gap-4 shadow-sm"
                >
                  <div className="w-10 h-10 shrink-0 rounded-lg bg-shark text-light flex items-center justify-center">
                    <Icon />
                  </div>

                  <div>
                    <h3 className="font-bold">{label}</h3>
                    <p className="text-sm text-sharkLight-500 mt-1 leading-6">{detail}</p>
                  </div>
                </div>
              ))}
            </div>
          </div>
        </section>

        <section id="capabilities" className="py-16 md:py-20 bg-sharkLight-100/30">
          <div className="w-[90%] max-w-6xl mx-auto">
            <div className="max-w-3xl mb-10">
              <p className="text-sm font-semibold uppercase tracking-[0.2em] text-sharkLight-300 mb-3">
                What the platform can do
              </p>

              <h2 className="text-3xl md:text-4xl font-bold leading-tight">
                Practical tools for the complete operational workflow.
              </h2>
            </div>

            <div className="grid md:grid-cols-2 gap-5">
              {featureGroups.map(({ icon: Icon, title, description, items }) => (
                <article
                  key={title}
                  className="bg-white border border-sharkLight-200 rounded-2xl p-6 md:p-7 hover:-translate-y-1 hover:shadow-lg transition duration-300"
                >
                  <div className="flex items-start gap-4">
                    <div className="w-11 h-11 shrink-0 rounded-xl bg-shark text-light flex items-center justify-center text-lg">
                      <Icon />
                    </div>

                    <div>
                      <h3 className="text-xl font-bold">{title}</h3>
                      <p className="text-sm text-sharkLight-500 mt-2 leading-6">{description}</p>
                    </div>
                  </div>

                  <ul className="mt-6 space-y-3">
                    {items.map((item) => (
                      <li key={item} className="flex gap-3 text-sm text-sharkDark-100 leading-6">
                        <FaCheckCircle className="text-green-600 mt-1 shrink-0" />
                        <span>{item}</span>
                      </li>
                    ))}
                  </ul>
                </article>
              ))}
            </div>
          </div>
        </section>

        <section className="py-16 md:py-20">
          <div className="w-[90%] max-w-6xl mx-auto space-y-16 md:space-y-24">
            <div className="grid lg:grid-cols-2 gap-10 lg:gap-16 items-center">
              <div className="rounded-2xl overflow-hidden border border-sharkLight-200 bg-white shadow-xl order-2 lg:order-1">
                <img
                  src={userManagementImage}
                  alt="User administration interface"
                  className="w-full h-auto object-cover"
                />
              </div>

              <div className="order-1 lg:order-2">
                <p className="text-sm font-semibold uppercase tracking-[0.2em] text-sharkLight-300 mb-3">
                  Account operations
                </p>

                <h2 className="text-3xl md:text-4xl font-bold leading-tight">
                  Keep user management clear, controlled, and searchable.
                </h2>

                <p className="mt-5 text-sharkLight-500 leading-8">
                  Administrators can find the right account quickly, review its state, update its
                  details, and follow the activity behind important changes. Verification and
                  account access are visible as part of the same workflow.
                </p>

                <div className="mt-7 grid grid-cols-2 gap-3 text-sm">
                  <div className="rounded-lg bg-sharkLight-100/50 p-4">
                    <FaSearch className="text-shark mb-2" />
                    <p className="font-semibold">Find faster</p>
                    <p className="text-xs text-sharkLight-500 mt-1">
                      Search and filter account records.
                    </p>
                  </div>
                  <div className="rounded-lg bg-sharkLight-100/50 p-4">
                    <FaHistory className="text-shark mb-2" />
                    <p className="font-semibold">Stay accountable</p>
                    <p className="text-xs text-sharkLight-500 mt-1">
                      Review user activity over time.
                    </p>
                  </div>
                </div>
              </div>
            </div>

            <div className="grid lg:grid-cols-2 gap-10 lg:gap-16 items-center">
              <div>
                <p className="text-sm font-semibold uppercase tracking-[0.2em] text-sharkLight-300 mb-3">
                  Catalogue and stock
                </p>

                <h2 className="text-3xl md:text-4xl font-bold leading-tight">
                  Manage products and stock as one connected operation.
                </h2>

                <p className="mt-5 text-sharkLight-500 leading-8">
                  Product records carry the identifiers and pricing your team needs. Inventory
                  actions then record why a quantity changed, while stock thresholds make shortages
                  visible before they affect the day-to-day work.
                </p>

                <div className="mt-7 flex flex-wrap gap-2">
                  {[
                    "SKU & barcode",
                    "Low-stock alerts",
                    "Stock adjustments",
                    "Archive & restore",
                  ].map((item) => (
                    <span
                      key={item}
                      className="px-3 py-1.5 rounded-full bg-sharkLight-100/70 text-xs font-semibold text-shark"
                    >
                      {item}
                    </span>
                  ))}
                </div>
              </div>

              <div className="rounded-2xl overflow-hidden border border-sharkLight-200 bg-white shadow-xl">
                <img
                  src={productsCatalogueImage}
                  alt="Product and inventory management interface"
                  className="w-full h-auto object-cover"
                />
              </div>
            </div>
          </div>
        </section>

        <section className="py-16 md:py-20 bg-sharkDark-300 text-light">
          <div className="w-[90%] max-w-6xl mx-auto">
            <div className="max-w-3xl">
              <p className="text-sm font-semibold uppercase tracking-[0.2em] text-sharkLight-300 mb-3">
                How it connects
              </p>

              <h2 className="text-3xl md:text-4xl font-bold leading-tight">
                Every operational action feeds a clearer picture.
              </h2>

              <p className="mt-4 text-sharkLight-200 leading-8">
                This is not a set of isolated screens. Secure account access leads into managed
                records, stock changes create history, and dashboard signals make the next action
                easier to identify.
              </p>
            </div>

            <div className="mt-10 grid sm:grid-cols-2 lg:grid-cols-5 gap-4">
              {workflowSteps.map(({ icon: Icon, label, detail }, index) => (
                <div key={label} className="relative">
                  <div className="h-full rounded-xl border border-sharkLight-400/35 bg-light/5 p-5">
                    <div className="w-10 h-10 rounded-lg bg-light text-shark flex items-center justify-center">
                      <Icon />
                    </div>
                    <p className="font-bold mt-4">{label}</p>
                    <p className="text-xs text-sharkLight-200 mt-1 leading-5">{detail}</p>
                  </div>

                  {index < workflowSteps.length - 1 && (
                    <FaArrowRight className="hidden lg:block absolute -right-4 top-1/2 -translate-y-1/2 text-sharkLight-300 z-10" />
                  )}
                </div>
              ))}
            </div>
          </div>
        </section>

        <section className="py-16 md:py-20 bg-sharkLight-100/30">
          <div className="w-[90%] max-w-6xl mx-auto">
            <div className="grid lg:grid-cols-[1.05fr_0.95fr] gap-10 lg:gap-16 items-center">
              <div>
                <p className="text-sm font-semibold uppercase tracking-[0.2em] text-sharkLight-300 mb-3">
                  Visibility when it matters
                </p>

                <h2 className="text-3xl md:text-4xl font-bold leading-tight">
                  Turn operational records into decisions.
                </h2>

                <p className="mt-5 text-sharkLight-500 leading-8">
                  The dashboard brings user totals, verification status, registration trends,
                  product health, inventory value, stock distribution, and recent activity into a
                  single view. Low-stock items are surfaced so attention goes where it is needed.
                </p>

                <div className="mt-7 space-y-4">
                  {[
                    [
                      FaChartLine,
                      "Trends and key metrics",
                      "Understand growth, stock state, and inventory value.",
                    ],
                    [
                      FaBell,
                      "Stock attention",
                      "See low-stock and out-of-stock products without hunting for them.",
                    ],
                    [
                      FaHistory,
                      "Traceable activity",
                      "Review the user, product, and inventory events behind the numbers.",
                    ],
                  ].map(([Icon, title, detail]) => (
                    <div key={title} className="flex items-start gap-3">
                      <div className="w-9 h-9 shrink-0 rounded-lg bg-white text-shark flex items-center justify-center shadow-sm">
                        <Icon />
                      </div>
                      <div>
                        <h3 className="font-bold text-sm">{title}</h3>
                        <p className="text-sm text-sharkLight-500 mt-0.5 leading-6">{detail}</p>
                      </div>
                    </div>
                  ))}
                </div>
              </div>

              <figure className="rounded-2xl overflow-hidden border border-sharkLight-200 bg-white shadow-2xl">
                <img
                  src={adminDashboardImage}
                  alt="Dashboard with user, product, and inventory reporting"
                  className="w-full h-auto object-cover"
                />
                <figcaption className="px-5 py-4 text-sm text-sharkLight-500 border-t border-sharkLight-100">
                  A single dashboard for monitoring the records and activity that keep operations
                  moving.
                </figcaption>
              </figure>
            </div>
          </div>
        </section>

        <section className="py-16 md:py-20">
          <div className="w-[90%] max-w-4xl mx-auto text-center">
            <div className="inline-flex w-12 h-12 items-center justify-center rounded-full bg-sharkLight-100 text-shark">
              <FaCheckCircle className="text-xl" />
            </div>

            <h2 className="text-3xl md:text-4xl font-bold mt-5">Ready to explore the workflow?</h2>

            <p className="mt-4 max-w-2xl mx-auto text-sharkLight-500 leading-7">
              Create an account to experience the secure access flow, then explore the tools that
              bring people, products, and inventory into one operational view.
            </p>

            <div className="flex flex-col sm:flex-row justify-center gap-3 mt-8">
              <Link
                to="/register"
                className="inline-flex items-center justify-center gap-2 px-7 py-3 bg-shark text-light font-semibold rounded-md hover:bg-sharkDark-100 transition duration-200"
              >
                Create an Account
                <FaArrowRight />
              </Link>

              <Link
                to="/about"
                className="inline-flex items-center justify-center gap-2 px-7 py-3 border border-sharkLight-300 text-shark font-semibold rounded-md hover:bg-sharkLight-100 transition duration-200"
              >
                About the Project
              </Link>
            </div>
          </div>
        </section>
      </main>
    </div>
  );
};

export default FeaturesPage;
