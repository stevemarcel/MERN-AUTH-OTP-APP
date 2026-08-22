import PropTypes from "prop-types";

const Hero = ({ eyebrow, title, description, children }) => {
  return (
    <section className="bg-sharkDark-300 text-light">
      <div className="w-[90%] max-w-6xl mx-auto py-20 md:py-28">
        <div className="max-w-4xl">
          {eyebrow && (
            <p className="text-sm font-semibold uppercase tracking-[0.2em] text-sharkLight-300 mb-4">
              {eyebrow}
            </p>
          )}

          <h1 className="text-4xl md:text-6xl font-bold leading-tight">{title}</h1>

          {description && (
            <p className="mt-6 text-base md:text-lg text-sharkLight-100/80 leading-relaxed max-w-2xl">
              {description}
            </p>
          )}

          {children && <div className="mt-8">{children}</div>}
        </div>
      </div>
    </section>
  );
};

Hero.propTypes = {
  eyebrow: PropTypes.string,
  title: PropTypes.string.isRequired,
  description: PropTypes.string,
  children: PropTypes.node,
};

export default Hero;
