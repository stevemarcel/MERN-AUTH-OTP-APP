import { Link } from "react-router-dom";
import {
  FaArrowRight,
  FaBoxOpen,
  FaChartLine,
  FaCheckCircle,
  FaHistory,
  FaLock,
  FaUsers,
  FaBoxes,
} from "react-icons/fa";

import Hero from "../components/Hero";

import homeHeroImage from "../assets/img/hero/home-hero.avif";
import operationsDashboardImage from "../assets/img/functionalities/operations-dashboard.avif";
import userManagementImage from "../assets/img/functionalities/user-management.avif";
import productCatalogueImage from "../assets/img/functionalities/product-catalogue.avif";
import inventoryControlImage from "../assets/img/functionalities/inventory-control.avif";

const platformAreas = [
  {
    icon: FaUsers,
    title: "Manage people",
    description: "Secure accounts, verify email, manage roles, and follow account activity.",
  },
  {
    icon: FaBoxOpen,
    title: "Control products",
    description: "Maintain product details, identifiers, prices, categories, and status.",
  },
  {
    icon: FaBoxes,
    title: "See stock clearly",
    description: "Record inventory movements and surface products that need attention.",
  },
];

const workflow = [
  { icon: FaLock, label: "Secure access" },
  { icon: FaUsers, label: "Manage records" },
  { icon: FaBoxes, label: "Track operations" },
  { icon: FaChartLine, label: "Act on insight" },
];

const managementOperations = [
  [
    "Users and Access",
    "Manage secure accounts, email verification, administration, and individual activity history.",
    userManagementImage,
    "User administration interface",
  ],
  [
    "Product Catalogue",
    "Keep product records consistent with identifiers, categories, pricing, and controlled archive states.",
    productCatalogueImage,
    "Product catalogue interface",
  ],
  [
    "Inventory Control",
    "Track stock movements and shortages with the context needed to make the next adjustment confidently.",
    inventoryControlImage,
    "Inventory control interface",
  ],
];

const dashboardRecords = [
  "Key metrics for users, products, and inventory",
  "Registration trends and verification status",
  "Low-stock products surfaced for faster follow-up",
  "Dedicated user, product, and inventory activity streams",
];

const HomePage = () => {
  return (
    <div className="bg-light text-shark overflow-hidden">
      <Hero
        eyebrow="Operations management platform"
        title={
          <>
            Bring secure access and daily operations into{" "}
            <span className="text-sharkLight-300">one clear workspace.</span>
          </>
        }
        description="
          A full-stack platform for managing users, products, inventory, and the operational activity that connects them.
        "
        backgroundImage={homeHeroImage}
      >
        <div className="flex flex-col sm:flex-row gap-3">
          <Link
            to="/register"
            className="
              inline-flex items-center justify-center gap-3 px-7 py-3 bg-light text-shark
              font-semibold rounded-lg hover:bg-sharkLight-100 transition duration-200
            "
          >
            Explore the Platform
            <FaArrowRight />
          </Link>

          <Link
            to="/features"
            className="
              inline-flex items-center justify-center gap-3 px-7 py-3 border border-sharkLight-100/40
              text-light font-semibold rounded-lg hover:bg-light/10 transition duration-200
            "
          >
            View Capabilities
          </Link>
        </div>
      </Hero>

      <main>
        {/* PLATFORM OVERVIEW */}
        <section className="py-16 md:py-20">
          <div className="w-[90%] max-w-6xl mx-auto">
            <div className="grid lg:grid-cols-[0.9fr_1.1fr] gap-10 lg:gap-16 items-end">
              <div>
                <p className="text-sm font-semibold uppercase tracking-[0.2em] text-sharkLight-300 mb-3">
                  Built for the work in between
                </p>

                <h2 className="text-3xl md:text-4xl font-bold leading-tight">
                  More than authentication. More than inventory.
                </h2>
              </div>

              <p className="text-sharkLight-500 leading-8">
                The platform connects the everyday records that too often live apart: user access,
                product information, stock levels, operational changes, and the reporting that helps
                a team understand what needs attention next.
              </p>
            </div>

            <div className="grid md:grid-cols-3 gap-5 mt-10">
              {platformAreas.map(({ icon: Icon, title, description }) => (
                <article
                  key={title}
                  className="
                    bg-white border border-sharkLight-200 rounded-2xl p-6 hover:-translate-y-1
                    hover:shadow-lg transition duration-300
                  "
                >
                  <div className="w-11 h-11 rounded-xl bg-shark text-light flex items-center justify-center text-lg">
                    <Icon />
                  </div>
                  <h3 className="text-xl font-bold mt-5">{title}</h3>
                  <p className="text-sm text-sharkLight-500 mt-2 leading-6">{description}</p>
                </article>
              ))}
            </div>
          </div>
        </section>

        {/* DASHBOARD SHOWCASE */}
        <section className="py-16 md:py-20 bg-sharkLight-100/30">
          <div className="w-[90%] max-w-6xl mx-auto">
            <div className="grid lg:grid-cols-[1.08fr_0.92fr] gap-10 lg:gap-16 items-center">
              <figure className="rounded-2xl overflow-hidden border border-sharkLight-200 bg-white shadow-2xl">
                <img
                  src={operationsDashboardImage}
                  alt="Operations dashboard showing user, product, and inventory insights"
                  className="w-full h-auto object-cover"
                />
                <figcaption className="px-5 py-4 border-t border-sharkLight-100 text-sm text-sharkLight-500">
                  A connected dashboard for users, products, stock status, and recent activity.
                </figcaption>
              </figure>

              <div>
                <p className="text-sm font-semibold uppercase tracking-[0.2em] text-sharkLight-300 mb-3">
                  A clearer operational view
                </p>

                <h2 className="text-3xl md:text-4xl font-bold leading-tight">
                  See the signals that matter without searching for them.
                </h2>

                <p className="mt-5 text-sharkLight-500 leading-8">
                  The dashboard translates current records into a useful overview: user growth and
                  verification, product health, inventory value, stock distribution, low-stock
                  attention, and the activity behind recent changes.
                </p>

                <ul className="mt-7 space-y-3">
                  {dashboardRecords.map((item) => (
                    <li
                      key={item}
                      className="flex items-start gap-3 text-sm text-sharkDark-100 leading-6"
                    >
                      <FaCheckCircle className="text-green-600 mt-1 shrink-0" />
                      <span>{item}</span>
                    </li>
                  ))}
                </ul>

                <Link
                  to="/features"
                  className="
                    inline-flex items-center gap-2 mt-8 font-semibold text-shark
                    hover:text-sharkDark-100 transition
                  "
                >
                  Discover the full workflow
                  <FaArrowRight className="text-sm" />
                </Link>
              </div>
            </div>
          </div>
        </section>

        {/* PRODUCT TOUR */}
        <section className="py-16 md:py-20">
          <div className="w-[90%] max-w-6xl mx-auto">
            <div className="max-w-3xl">
              <p className="text-sm font-semibold uppercase tracking-[0.2em] text-sharkLight-300 mb-3">
                Built around real workflows
              </p>

              <h2 className="text-3xl md:text-4xl font-bold leading-tight">
                Move confidently from record to action.
              </h2>
            </div>

            <div className="grid lg:grid-cols-3 gap-5 mt-10">
              {managementOperations.map(([title, description, image, alt]) => (
                <article
                  key={title}
                  className="
                    group bg-white border border-sharkLight-200 rounded-2xl overflow-hidden hover:-translate-y-1
                    hover:shadow-xl transition duration-300
                  "
                >
                  <div className="aspect-[16/10] overflow-hidden bg-sharkLight-100">
                    <img
                      src={image}
                      alt={alt}
                      className="w-full h-full object-cover group-hover:scale-[1.03] transition duration-500"
                    />
                  </div>
                  <div className="p-6">
                    <h3 className="text-xl font-bold">{title}</h3>
                    <p className="text-sm text-sharkLight-500 mt-3 leading-6">{description}</p>
                  </div>
                </article>
              ))}
            </div>
          </div>
        </section>

        {/* WORKFLOW DIAGRAM */}
        <section className="py-16 md:py-20 bg-sharkDark-300 text-light">
          <div className="w-[90%] max-w-6xl mx-auto">
            <div className="grid lg:grid-cols-[0.85fr_1.15fr] gap-10 lg:gap-16 items-center">
              <div>
                <p className="text-sm font-semibold uppercase tracking-[0.2em] text-sharkLight-300 mb-3">
                  One connected flow
                </p>

                <h2 className="text-3xl md:text-4xl font-bold leading-tight">
                  Secure the start. Trace the work. Act with context.
                </h2>

                <p className="mt-5 text-sharkLight-200 leading-8">
                  Each part of the platform creates useful context for the next. Access is
                  protected, records are manageable, activity is recorded, and operational data is
                  ready to guide decisions.
                </p>
              </div>

              <div className="grid grid-cols-2 gap-4">
                {workflow.map(({ icon: Icon, label }, index) => (
                  <div
                    key={label}
                    className="relative rounded-xl border border-sharkLight-400/35 bg-light/5 p-5"
                  >
                    <p className="text-xs font-semibold tracking-[0.18em] uppercase text-sharkLight-300">
                      0{index + 1}
                    </p>
                    <div className="w-10 h-10 mt-4 rounded-lg bg-light text-shark flex items-center justify-center">
                      <Icon />
                    </div>
                    <p className="font-bold mt-4">{label}</p>
                  </div>
                ))}
              </div>
            </div>
          </div>
        </section>

        {/* CTA */}
        <section className="py-16 md:py-20">
          <div className="w-[90%] max-w-4xl mx-auto text-center">
            <div
              className="
              inline-flex w-12 h-12 items-center justify-center
              rounded-full bg-sharkLight-100 text-shark
            "
            >
              <FaHistory className="text-xl" />
            </div>

            <h2 className="text-3xl md:text-4xl font-bold mt-5">
              See your operations more clearly.
            </h2>

            <p className="mt-4 max-w-2xl mx-auto text-sharkLight-500 leading-7">
              Explore secure access, structured records, stock visibility, and operational activity
              in a single application.
            </p>

            <div className="flex flex-col sm:flex-row justify-center gap-3 mt-8">
              <Link
                to="/register"
                className="
                  inline-flex items-center justify-center gap-2 px-7 py-3 bg-shark text-light
                  font-semibold rounded-md hover:bg-sharkDark-100 transition duration-200
                "
              >
                Create an Account
                <FaArrowRight />
              </Link>

              <Link
                to="/about"
                className="
                  inline-flex items-center justify-center gap-2 px-7 py-3 border border-sharkLight-300
                  text-shark font-semibold rounded-md hover:bg-sharkLight-100 transition duration-200
                "
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

export default HomePage;
