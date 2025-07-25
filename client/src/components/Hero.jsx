import PropTypes from "prop-types";

const Hero = ({ title, description }) => {
  return (
    <section className="heroBg h-[90vh] lg:h-96 mb-10 flex items-center text-sharkLight-100">
      <div className="absolute top-18 left-0 right-0 h-[90vh] lg:h-96 bg-sharkDark-400 bg-opacity-90 z-10"></div>{" "}
      {/* Overlay element */}
      <div className="p-6 relative z-20 w-[95%] md:w-[80%] mx-auto text-justify space-y-2">
        <h2 className="text-lg md:text-3xl font-bold text-center">{title}</h2>{" "}
        {/* Conditional rendering for description */}
        {Array.isArray(description) ? (
          // If description is an array, map over it to create multiple paragraphs
          description.map((paragraph, index) => <p key={index}>{paragraph}</p>)
        ) : (
          // If description is a string, render it as a single paragraph
          <p>{description}</p>
        )}
      </div>
    </section>
  );
};

// PropTypes for type checking and documentation
Hero.propTypes = {
  title: PropTypes.string.isRequired,
  description: PropTypes.oneOfType([PropTypes.string, PropTypes.arrayOf(PropTypes.string)])
    .isRequired,
};

export default Hero;
