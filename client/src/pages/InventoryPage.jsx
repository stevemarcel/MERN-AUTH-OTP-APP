import BackButton from "../components/BackButton";

const InventoryPage = () => {
  return (
    <div className="h-[50vh] w-[90%] mx-auto">
      <div className="flex items-center mb-4">
        <BackButton />
        <div></div>
        <h2 className="text-2xl font-bold text-shark flex items-center justify-center w-full uppercase">
          Inventory Page
        </h2>
      </div>
    </div>
  );
};

export default InventoryPage;
