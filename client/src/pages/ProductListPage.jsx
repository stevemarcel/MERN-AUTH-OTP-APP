import BackButton from "../components/BackButton";

const ProductListPage = () => {
  return (
    <div className="h-[50vh] w-[90%] mx-auto py-10">
      <div className="flex items-center mb-4">
        <BackButton />
        <div></div>
        <h2 className="text-2xl font-bold text-shark flex items-center justify-center w-full">
          All Products
        </h2>
      </div>
    </div>
  );
};

export default ProductListPage;
