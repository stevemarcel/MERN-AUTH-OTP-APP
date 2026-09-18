import { useNavigate } from "react-router-dom";
import { toast } from "react-toastify";
import { FaBoxOpen } from "react-icons/fa";

import BackButton from "../components/BackButton";
import ProductForm from "../components/ProductForm";

import { useCreateProductMutation } from "../slices/productApiSlice";

const CreateProductPage = () => {
  const navigate = useNavigate();

  const [createProductApiCall, { isLoading: isCreatingProduct }] = useCreateProductMutation();

  const handleSubmit = async (formData) => {
    try {
      const response = await createProductApiCall(formData).unwrap();

      toast.success(response.message);

      navigate("/admin/products");
    } catch (err) {
      toast.error(err?.data?.message || err?.error || "Failed to create product.");
    }
  };

  return (
    <div className="mb-10 min-h-[80vh] w-full mx-auto text-shark">
      <div className="flex items-center mb-6">
        <BackButton />

        <div className="flex items-center justify-center w-full">
          <FaBoxOpen className="mr-2" />

          <h2 className="text-2xl md:text-3xl font-bold uppercase">Create Product</h2>
        </div>
      </div>

      <ProductForm mode="create" onSubmit={handleSubmit} isSubmitting={isCreatingProduct} />
    </div>
  );
};

export default CreateProductPage;
