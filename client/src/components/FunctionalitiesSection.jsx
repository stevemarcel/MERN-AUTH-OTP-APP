import Card from "./Card";
import functionalities from "../assets/functionalities";

const FunctionalitiesSection = () => {
  return (
    <section className="w-[90%] mx-auto pb-10">
      <h2 className="mb-3 text-2xl font-bold text-center uppercase">Project Features</h2>
      <div className="flex flex-col md:grid md:grid-cols-2 lg:grid lg:grid-cols-3 gap-4 justify-center w-full">
        {functionalities.map((functionItem) => (
          <Card key={functionItem.id} data={functionItem} />
        ))}
      </div>
    </section>
  );
};

export default FunctionalitiesSection;
