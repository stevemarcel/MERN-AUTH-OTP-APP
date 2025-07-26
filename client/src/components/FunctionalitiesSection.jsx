import Card from "./Card";
import functionalities from "../assets/functionalities";

const FunctionalitiesSection = () => {
  return (
    <section className="w-[90%] mx-auto pb-10">
      <h2 className="mb-3 text-lg md:text-2xl font-bold text-center uppercase">Project Features</h2>
      <p className="mb-8 text-center text-lg text-sharkDark-100 max-w-3xl mx-auto">
        Explore the core features that power the user management system, designed to streamline your
        operations and enhance user experience.
      </p>
      <div className="flex flex-col md:grid md:grid-cols-2 lg:grid-cols-3 gap-4 justify-center w-full">
        {functionalities.map((functionItem) => (
          <Card key={functionItem.id} data={functionItem} />
        ))}
      </div>
    </section>
  );
};

export default FunctionalitiesSection;
