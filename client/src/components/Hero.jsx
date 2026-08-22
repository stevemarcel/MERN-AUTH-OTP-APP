import React from "react";
import PropTypes from "prop-types";

const Hero = ({
  title,
  description,
  inlineDescription = false,
  eyebrow,
  backgroundImage,
  children,
}) => {
  return (
    <section
      className="relative overflow-hidden bg-sharkDark-300 text-light"
      style={
        backgroundImage
          ? {
              backgroundImage: `url(${backgroundImage})`,
              backgroundSize: "cover",
              backgroundPosition: "center",
            }
          : undefined
      }
    >
      {/* Premium image treatment */}
      {backgroundImage && (
        <>
          {/* Overall darkening */}
          <div className="absolute inset-0 bg-sharkDark-400/70" />

          {/* Subtle left-to-right gradient for text readability */}
          <div className="absolute inset-0 bg-gradient-to-r from-sharkDark-400/95 via-sharkDark-400/75 to-sharkDark-400/20" />

          {/* Very subtle brand tint */}
          <div className="absolute inset-0 bg-shark/10" />
        </>
      )}

      {/* Fallback gradient when no image is supplied */}
      {!backgroundImage && (
        <div className="absolute inset-0 bg-gradient-to-br from-sharkDark-300 via-shark to-sharkDark-400" />
      )}

      <div className="relative z-10 w-[90%] max-w-6xl mx-auto py-20 md:py-28">
        <div className="max-w-3xl">
          {/* Eyebrow */}
          {eyebrow && (
            <p className="text-sm md:text-base uppercase tracking-[0.25em] text-sharkLight-300 font-semibold mb-5">
              {eyebrow}
            </p>
          )}

          {/* Title */}
          <h1 className="text-4xl md:text-6xl font-bold leading-tight">{title}</h1>

          {/* Description */}
          <div className="mt-6 text-base md:text-lg leading-8 text-sharkLight-200">
            {Array.isArray(description) ? (
              inlineDescription ? (
                <div className="flex justify-start items-center gap-1 flex-wrap">
                  {description.map((item, index) => (
                    <React.Fragment key={index}>{item}</React.Fragment>
                  ))}
                </div>
              ) : (
                <div className="space-y-4">
                  {description.map((paragraph, index) => (
                    <p key={index}>{paragraph}</p>
                  ))}
                </div>
              )
            ) : (
              <p>{description}</p>
            )}
          </div>

          {/* Optional actions/content */}
          {children && <div className="mt-8">{children}</div>}
        </div>
      </div>
    </section>
  );
};

Hero.propTypes = {
  title: PropTypes.node.isRequired,
  description: PropTypes.oneOfType([
    PropTypes.string,
    PropTypes.arrayOf(PropTypes.oneOfType([PropTypes.string, PropTypes.element])),
  ]).isRequired,
  inlineDescription: PropTypes.bool,
  eyebrow: PropTypes.string,
  backgroundImage: PropTypes.string,
  children: PropTypes.node,
};

export default Hero;
