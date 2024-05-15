import Card from "./Card";
import functionalities from "../assets/functionalities";

const FunctionalitiesSection = () => {
  return (
    <section className="w-[90%] mx-auto pb-10">
      <h2 className="mb-3 text-2xl font-bold text-center">Project Functionalities</h2>
      <div className="flex flex-wrap justify-evenly items-center gap-5 py-4">
        {functionalities.map((functionItem) => (
          <Card key={functionItem.id} data={functionItem} />
        ))}

        {/* <div className="size-64">
            <div className="mb-3">
              <img src={PlaceholderImg} alt="Placeholder Image" className="object-contain" />
            </div>
            <div>
              <h2 className="text-2xl font-bold">User Auth</h2>
              <p className="">
                Lorem ipsum dolor sit amet, consectetur adipisicing elit. A nisi non amet modi,
                cumque quisquam
              </p>
            </div>
          </div> */}
      </div>
    </section>
  );
};

export default FunctionalitiesSection;
