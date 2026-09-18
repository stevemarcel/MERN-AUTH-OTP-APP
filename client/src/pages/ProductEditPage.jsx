import { useParams, useNavigate } from "react-router-dom";
import { toast } from "react-toastify";
import { FaEdit } from "react-icons/fa";

import BackButton from "../components/BackButton";
import ProductForm from "../components/ProductForm";
import Loader from "../components/Loader";

import { useGetProductByIdQuery, useUpdateProductMutation } from "../slices/productApiSlice";

const ProductEditPage = () => {
  const { productId } = useParams();
  const navigate = useNavigate();

  const {
    data: productData,
    isLoading: isGettingProduct,
    isError: isProductError,
    error: productError,
  } = useGetProductByIdQuery(productId);

  const [updateProductApiCall, { isLoading: isUpdatingProduct }] = useUpdateProductMutation();

  const handleSubmit = async (formData) => {
    try {
      const response = await updateProductApiCall({
        productId,
        data: formData,
      }).unwrap();

      toast.success(response.message);

      navigate("/admin/products");
    } catch (err) {
      toast.error(err?.data?.message || err?.error || "Failed to update product.");
    }
  };

  if (isGettingProduct) {
    return (
      <div className="flex justify-center items-center h-64">
        <Loader />
        <span className="ml-2">Loading product...</span>
      </div>
    );
  }

  if (isProductError || !productData) {
    return (
      <div className="min-h-[80vh] text-center py-10">
        <p className="text-red-600 font-semibold">Unable to load product.</p>

        <p className="text-sm text-sharkLight-300 mt-2">
          {productError?.data?.message || productError?.error || "Product not found."}
        </p>
      </div>
    );
  }

  return (
    <div className="mb-10 min-h-[80vh] w-full mx-auto text-shark">
      <div className="flex items-center mb-6">
        <BackButton />

        <div className="flex items-center justify-center w-full min-w-0">
          <FaEdit className="mr-2 flex-shrink-0" />

          <h2 className="text-2xl md:text-3xl font-bold uppercase truncate">
            Edit {productData.name}
          </h2>
        </div>
      </div>

      {!productData.isActive && (
        <div className="mb-6 p-4 rounded bg-yellow-100 border border-yellow-300 text-yellow-800 text-sm">
          <strong>This product is archived.</strong> Changes can still be saved, but the product
          will remain archived until it is restored.
        </div>
      )}

      <ProductForm
        mode="edit"
        product={productData}
        onSubmit={handleSubmit}
        isSubmitting={isUpdatingProduct}
      />
    </div>
  );
};

export default ProductEditPage;
