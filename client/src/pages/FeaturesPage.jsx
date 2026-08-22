import { FaArrowRight } from "react-icons/fa";
import { Link } from "react-router-dom";

import Hero from "../components/Hero";
import FunctionalitiesSection from "../components/FunctionalitiesSection";

import featuresHeroImage from "../assets/img/hero/features-hero.avif";

const FeaturesPage = () => {
  return (
    <div>
      <Hero
        eyebrow="Platform Capabilities"
        title={
          <>
            Everything you need to manage{" "}
            <span className="text-sharkLight-300">users securely.</span>
          </>
        }
        description="Explore the authentication, administration, security, and user management capabilities built into the platform."
        backgroundImage={featuresHeroImage}
      >
        <div className="flex flex-col sm:flex-row gap-3">
          <Link
            to="/register"
            className="inline-flex items-center justify-center gap-2 px-6 py-3 bg-light text-shark font-semibold rounded-md hover:bg-sharkLight-100 transition duration-200"
          >
            Experience the System
            <FaArrowRight />
          </Link>
        </div>
      </Hero>
      <main>
        <FunctionalitiesSection />
      </main>
    </div>
  );
};

export default FeaturesPage;
