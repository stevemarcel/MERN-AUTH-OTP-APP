import PropTypes from "prop-types";

const Card = ({ data }) => {
  return (
    <div className="w-full h-64 md:w-70 rounded-lg drop-shadow-sm bg-sharkLight-100/30 transition duration-300 transform hover:bg-sharkLight-100 hover:scale-105 hover:shadow-lg">
      <div className="flex justify-center items-center ">
        <img
          src={data.image}
          alt="Placeholder Image"
          className="object-cover h-28 w-full rounded-t-lg"
        />
      </div>
      <div className="object-cover h-36  p-4 rounded-b-lg">
        <h2 className="text-lg font-bold">{data.title}</h2>
        <p className="">{data.description}</p>
      </div>
    </div>
  );
};

Card.propTypes = {
  data: PropTypes.object.isRequired,
};

export default Card;
