import Hero from "../components/Hero"; // Your refactored Hero component
import FunctionalitiesSection from "../components/FunctionalitiesSection";

const FeaturesPage = () => {
  const featuresPageDescription = `
    Explore the powerful features that make this User Management System robust and user-friendly.
    From secure authentication and comprehensive administrative controls to real-time updates and a responsive design,
    our system is built to provide a seamless experience for both users and administrators.
    Below, you'll find a detailed breakdown of the key functionalities implemented in this application.
  `
    .replace(/\s+/g, " ")
    .trim(); // Clean up whitespace/newlines into a single string

  return (
    <div>
      <Hero title="Project Features Overview" description={featuresPageDescription} />
      <main>
        <FunctionalitiesSection />
      </main>
    </div>
  );
};

export default FeaturesPage;
