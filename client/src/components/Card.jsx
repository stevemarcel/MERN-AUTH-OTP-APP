import PropTypes from "prop-types";

const Card = ({ data }) => {
  return (
    <div className="w-full h-94 md:w-80 rounded-t-lg">
      <div className="flex justify-center items-center ">
        <img
          src={data.image}
          alt="Placeholder Image"
          className="object-cover h-64 w-full rounded-t-lg"
        />
      </div>
      <div className="object-cover md:h-32 bg-sharkLight-100 p-4 rounded-b-lg">
        <h2 className="text-l font-bold">{data.title}</h2>
        <p className="">{data.description}</p>
      </div>
    </div>
  );
};

Card.propTypes = {
  data: PropTypes.object.isRequired,
};

export default Card;
