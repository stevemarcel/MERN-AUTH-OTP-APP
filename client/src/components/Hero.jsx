import React from "react";
import PropTypes from "prop-types";

const Hero = ({ title, description, inlineDescription = false }) => {
  return (
    <section className="heroBg mb-10 flex items-center text-sharkLight-100 py-10 relative">
      <div className="absolute inset-0 bg-sharkDark-400 bg-opacity-90 z-10"></div>{" "}
      {/* Overlay element */}
      <div className="p-6 relative z-20 w-[95%] md:w-[80%] mx-auto text-justify space-y-2">
        <h2 className="text-lg md:text-3xl font-bold text-center">{title}</h2>{" "}
        {/* Conditional rendering for description */}
        {Array.isArray(description) ? (
          inlineDescription ? (
            // If inlineDescription is true, render all array items inline within one paragraph
            <p>
              {description.map((item, index) => (
                <React.Fragment key={index}>{item}</React.Fragment>
              ))}
            </p>
          ) : (
            // If inlineDescription is false (default), render each array item as a new paragraph
            description.map((paragraph, index) => <p key={index}>{paragraph}</p>)
          )
        ) : (
          // If description is a string, always render it as a single paragraph
          <p>{description}</p>
        )}
      </div>
    </section>
  );
};

// PropTypes for type checking and documentation
Hero.propTypes = {
  title: PropTypes.string,
  description: PropTypes.oneOfType([
    PropTypes.string,
    PropTypes.arrayOf(PropTypes.oneOfType([PropTypes.string, PropTypes.element])),
  ]).isRequired,
  inlineDescription: PropTypes.bool, // Added propType for inlineDescription
};

export default Hero;
