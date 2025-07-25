import PropTypes from "prop-types"; // Import PropTypes for type checking

const Hero = ({ title, description }) => {
  // Destructure title and description from props
  return (
    <section className="heroBg h-[90vh] lg:h-96 mb-10 flex items-center text-sharkLight-100">
      <div className="absolute top-18 left-0 right-0 h-[90vh] lg:h-96 bg-sharkDark-400 bg-opacity-90 z-10"></div>{" "}
      {/* Overlay element */}
      <div className="p-6 relative z-20 w-[95%] md:w-[80%] mx-auto text-justify space-y-2">
        <h2 className="text-lg md:text-3xl font-bold text-center">{title}</h2>{" "}
        {/* Use title prop */}
        {description.map((paragraph, index) => (
          <p key={index}>{paragraph}</p> // Map over description array to create paragraphs
        ))}
      </div>
    </section>
  );
};

// Add PropTypes for type checking and documentation
Hero.propTypes = {
  title: PropTypes.string.isRequired, // title is a required string
  description: PropTypes.arrayOf(PropTypes.string).isRequired, // description is a required array of strings
};

export default Hero;
