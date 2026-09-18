import PropTypes from "prop-types";
import { useEffect, useRef, useState } from "react";
import { FaBoxOpen, FaCamera, FaTimes, FaSave } from "react-icons/fa";

const PRODUCT_CATEGORIES = [
  "Beverages",
  "Snacks",
  "Dairy",
  "Bakery",
  "Canned Goods",
  "Confectionery",
  "Frozen Foods",
  "Groceries",
  "Household",
  "Personal Care",
  "Other",
];

const PRODUCT_UNITS = [
  "piece",
  "bottle",
  "can",
  "pack",
  "box",
  "carton",
  "bag",
  "kg",
  "g",
  "litre",
  "ml",
  "dozen",
];

const ProductForm = ({ mode = "create", product = null, onSubmit, isSubmitting = false }) => {
  const isEditMode = mode === "edit";

  const [name, setName] = useState("");
  const [sku, setSku] = useState("");
  const [barcode, setBarcode] = useState("");
  const [category, setCategory] = useState("");
  const [brand, setBrand] = useState("");
  const [description, setDescription] = useState("");
  const [price, setPrice] = useState("");
  const [costPrice, setCostPrice] = useState("");
  const [stockQuantity, setStockQuantity] = useState("");
  const [lowStockThreshold, setLowStockThreshold] = useState("10");
  const [unit, setUnit] = useState("piece");
  const [isActive, setIsActive] = useState(true);

  const [currentImage, setCurrentImage] = useState("");
  const [selectedFile, setSelectedFile] = useState(null);
  const [filePreview, setFilePreview] = useState(null);
  const [removeCurrentImage, setRemoveCurrentImage] = useState(false);

  const fileInputRef = useRef(null);

  // ============================================================
  // POPULATE EDIT FORM
  // ============================================================

  useEffect(() => {
    if (!product) {
      setName("");
      setSku("");
      setBarcode("");
      setCategory("");
      setBrand("");
      setDescription("");
      setPrice("");
      setCostPrice("");
      setStockQuantity("");
      setLowStockThreshold("10");
      setUnit("piece");
      setIsActive(true);
      setCurrentImage("");
      setSelectedFile(null);
      setFilePreview(null);
      setRemoveCurrentImage(false);

      return;
    }

    setName(product.name || "");
    setSku(product.sku || "");
    setBarcode(product.barcode || "");
    setCategory(product.category || "");
    setBrand(product.brand || "");
    setDescription(product.description || "");
    setPrice(String(product.price ?? ""));
    setCostPrice(String(product.costPrice ?? ""));
    setStockQuantity(String(product.stockQuantity ?? 0));
    setLowStockThreshold(String(product.lowStockThreshold ?? 10));
    setUnit(product.unit || "piece");
    setIsActive(product.isActive ?? true);

    setCurrentImage(product.productImage || "");
    setSelectedFile(null);
    setFilePreview(null);
    setRemoveCurrentImage(false);
  }, [product]);

  // ============================================================
  // CLEANUP PREVIEW URL
  // ============================================================

  useEffect(() => {
    return () => {
      if (filePreview) {
        URL.revokeObjectURL(filePreview);
      }
    };
  }, [filePreview]);

  // ============================================================
  // IMAGE SELECTION
  // ============================================================

  const handleFileChange = (event) => {
    const file = event.target.files?.[0];

    if (!file) {
      return;
    }

    setSelectedFile(file);
    setFilePreview(URL.createObjectURL(file));
    setRemoveCurrentImage(false);
  };

  const clearSelectedImage = () => {
    setSelectedFile(null);
    setFilePreview(null);

    if (fileInputRef.current) {
      fileInputRef.current.value = "";
    }

    if (isEditMode) {
      setRemoveCurrentImage(false);
    }
  };

  const removeImage = () => {
    setSelectedFile(null);
    setFilePreview(null);

    if (fileInputRef.current) {
      fileInputRef.current.value = "";
    }

    if (isEditMode && currentImage) {
      setRemoveCurrentImage(true);
    }
  };

  // ============================================================
  // SUBMIT
  // ============================================================

  const handleSubmit = async (event) => {
    event.preventDefault();

    const formData = new FormData();

    formData.append("name", name.trim());
    formData.append("sku", sku.trim());
    formData.append("barcode", barcode.trim());
    formData.append("category", category.trim());
    formData.append("brand", brand.trim());
    formData.append("description", description.trim());
    formData.append("price", price);
    formData.append("costPrice", costPrice);
    formData.append("lowStockThreshold", lowStockThreshold);
    formData.append("unit", unit);
    formData.append("isActive", isActive);

    // Initial stock is only submitted when creating.
    // Editing stock happens through Inventory.
    if (!isEditMode) {
      formData.append("stockQuantity", stockQuantity || "0");
    }

    if (selectedFile) {
      formData.append("productImage", selectedFile);
    }

    if (isEditMode && removeCurrentImage) {
      formData.append("removeProductImage", "true");
    }

    await onSubmit(formData);
  };

  // ============================================================
  // IMAGE TO DISPLAY
  // ============================================================

  const displayedImage = filePreview || (!removeCurrentImage ? currentImage : null);

  return (
    <form onSubmit={handleSubmit} className="space-y-6">
      {/* ======================================================
          PRODUCT IMAGE
      ====================================================== */}

      <div className="bg-white rounded-lg shadow-md p-6">
        <h3 className="text-lg font-semibold mb-4">Product Image</h3>

        <div className="flex flex-col items-center">
          <div className="relative w-48 h-48 rounded-lg overflow-hidden border-2 border-sharkLight-100 bg-sharkLight-100 flex items-center justify-center">
            {displayedImage ? (
              <img
                src={displayedImage}
                alt={name || "Product"}
                className="w-full h-full object-cover"
              />
            ) : (
              <FaBoxOpen className="text-6xl text-sharkLight-300" />
            )}

            <label
              htmlFor="product-image-upload"
              className="absolute inset-0 flex items-center justify-center bg-black/50 text-white cursor-pointer opacity-0 hover:opacity-100 transition duration-200"
            >
              <FaCamera className="text-3xl" />
            </label>
          </div>

          <input
            ref={fileInputRef}
            id="product-image-upload"
            type="file"
            name="productImage"
            accept="image/jpeg,image/jpg,image/png,image/gif"
            onChange={handleFileChange}
            className="hidden"
            disabled={isSubmitting}
          />

          <div className="flex gap-2 mt-3">
            <label
              htmlFor="product-image-upload"
              className="cursor-pointer px-3 py-2 bg-shark text-white rounded text-sm hover:bg-sharkDark-300 transition"
            >
              <FaCamera className="inline mr-2" />
              {displayedImage ? "Change Image" : "Choose Image"}
            </label>

            {displayedImage && (
              <button
                type="button"
                onClick={removeImage}
                disabled={isSubmitting}
                className="px-3 py-2 bg-red-800 hover:bg-red-900 text-white rounded text-sm transition disabled:opacity-50"
              >
                <FaTimes className="inline mr-2" />
                Remove
              </button>
            )}

            {selectedFile && (
              <button
                type="button"
                onClick={clearSelectedImage}
                disabled={isSubmitting}
                className="px-3 py-2 bg-sharkLight-400 hover:bg-sharkLight-500 text-white rounded text-sm transition disabled:opacity-50"
              >
                Clear
              </button>
            )}
          </div>

          <p className="text-xs text-sharkLight-300 mt-2 text-center">
            Maximum 3 MB. JPEG, JPG, PNG or GIF.
          </p>
        </div>
      </div>

      {/* ======================================================
          BASIC INFORMATION
      ====================================================== */}

      <div className="bg-white rounded-lg shadow-md p-6">
        <h3 className="text-lg font-semibold mb-4">Product Information</h3>

        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          {/* Product Name */}
          <div className="md:col-span-2">
            <label htmlFor="name" className="block text-sm font-medium mb-1">
              Product Name
            </label>

            <input
              id="name"
              type="text"
              value={name}
              onChange={(e) => setName(e.target.value)}
              placeholder="e.g. Coca-Cola 50cl"
              required
              disabled={isSubmitting}
              className="w-full px-3 py-2 rounded border border-sharkLight-100 focus:outline-none focus:ring-2 focus:ring-sharkLight-400"
            />
          </div>

          {/* SKU */}
          <div>
            <label htmlFor="sku" className="block text-sm font-medium mb-1">
              SKU
            </label>

            <input
              id="sku"
              type="text"
              value={sku}
              onChange={(e) => setSku(e.target.value.toUpperCase())}
              placeholder="e.g. COKE-50CL"
              required
              disabled={isSubmitting}
              className="w-full px-3 py-2 rounded border border-sharkLight-100 focus:outline-none focus:ring-2 focus:ring-sharkLight-400"
            />
          </div>

          {/* Barcode */}
          <div>
            <label htmlFor="barcode" className="block text-sm font-medium mb-1">
              Barcode
              <span className="text-xs text-sharkLight-300 ml-1">(optional)</span>
            </label>

            <input
              id="barcode"
              type="text"
              value={barcode}
              onChange={(e) => setBarcode(e.target.value)}
              placeholder="e.g. 5449000000996"
              disabled={isSubmitting}
              className="w-full px-3 py-2 rounded border border-sharkLight-100 focus:outline-none focus:ring-2 focus:ring-sharkLight-400"
            />
          </div>

          {/* Category */}
          <div>
            <label htmlFor="category" className="block text-sm font-medium mb-1">
              Category
            </label>

            <select
              id="category"
              value={category}
              onChange={(e) => setCategory(e.target.value)}
              required
              disabled={isSubmitting}
              className="w-full px-3 py-2 rounded border border-sharkLight-100 bg-white focus:outline-none focus:ring-2 focus:ring-sharkLight-400"
            >
              <option value="" disabled>
                Select a category
              </option>

              {PRODUCT_CATEGORIES.map((item) => (
                <option key={item} value={item}>
                  {item}
                </option>
              ))}
            </select>
          </div>

          {/* Brand */}
          <div>
            <label htmlFor="brand" className="block text-sm font-medium mb-1">
              Brand
              <span className="text-xs text-sharkLight-300 ml-1">(optional)</span>
            </label>

            <input
              id="brand"
              type="text"
              value={brand}
              onChange={(e) => setBrand(e.target.value)}
              placeholder="e.g. Coca-Cola"
              disabled={isSubmitting}
              className="w-full px-3 py-2 rounded border border-sharkLight-100 focus:outline-none focus:ring-2 focus:ring-sharkLight-400"
            />
          </div>

          {/* Description */}
          <div className="md:col-span-2">
            <label htmlFor="description" className="block text-sm font-medium mb-1">
              Description
              <span className="text-xs text-sharkLight-300 ml-1">(optional)</span>
            </label>

            <textarea
              id="description"
              value={description}
              onChange={(e) => setDescription(e.target.value)}
              placeholder="Brief product description..."
              rows="4"
              disabled={isSubmitting}
              className="w-full px-3 py-2 rounded border border-sharkLight-100 focus:outline-none focus:ring-2 focus:ring-sharkLight-400 resize-y"
            />
          </div>
        </div>
      </div>

      {/* ======================================================
          PRICING
      ====================================================== */}

      <div className="bg-white rounded-lg shadow-md p-6">
        <h3 className="text-lg font-semibold mb-4">Pricing</h3>

        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          {/* Cost Price */}
          <div>
            <label htmlFor="costPrice" className="block text-sm font-medium mb-1">
              Cost Price (₦)
            </label>

            <input
              id="costPrice"
              type="number"
              min="0"
              step="0.01"
              value={costPrice}
              onChange={(e) => setCostPrice(e.target.value)}
              placeholder="0.00"
              required
              disabled={isSubmitting}
              className="w-full px-3 py-2 rounded border border-sharkLight-100 focus:outline-none focus:ring-2 focus:ring-sharkLight-400"
            />
          </div>

          {/* Selling Price */}
          <div>
            <label htmlFor="price" className="block text-sm font-medium mb-1">
              Selling Price (₦)
            </label>

            <input
              id="price"
              type="number"
              min="0"
              step="0.01"
              value={price}
              onChange={(e) => setPrice(e.target.value)}
              placeholder="0.00"
              required
              disabled={isSubmitting}
              className="w-full px-3 py-2 rounded border border-sharkLight-100 focus:outline-none focus:ring-2 focus:ring-sharkLight-400"
            />
          </div>
        </div>
      </div>

      {/* ======================================================
          INVENTORY
      ====================================================== */}

      <div className="bg-white rounded-lg shadow-md p-6">
        <h3 className="text-lg font-semibold mb-4">Inventory</h3>

        <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
          {/* Initial/Current Stock */}
          <div>
            <label htmlFor="stockQuantity" className="block text-sm font-medium mb-1">
              {isEditMode ? "Current Stock" : "Initial Stock"}
            </label>

            <input
              id="stockQuantity"
              type="number"
              min="0"
              step="1"
              value={stockQuantity}
              onChange={(e) => setStockQuantity(e.target.value)}
              readOnly={isEditMode}
              disabled={isSubmitting}
              className={`w-full px-3 py-2 rounded border border-sharkLight-100 focus:outline-none ${
                isEditMode
                  ? "bg-gray-100 cursor-not-allowed"
                  : "focus:ring-2 focus:ring-sharkLight-400"
              }`}
            />

            {isEditMode && (
              <p className="text-xs text-sharkLight-300 mt-1">Stock is managed from Inventory.</p>
            )}
          </div>

          {/* Low Stock Threshold */}
          <div>
            <label htmlFor="lowStockThreshold" className="block text-sm font-medium mb-1">
              Low Stock Threshold
            </label>

            <input
              id="lowStockThreshold"
              type="number"
              min="0"
              step="1"
              value={lowStockThreshold}
              onChange={(e) => setLowStockThreshold(e.target.value)}
              required
              disabled={isSubmitting}
              className="w-full px-3 py-2 rounded border border-sharkLight-100 focus:outline-none focus:ring-2 focus:ring-sharkLight-400"
            />
          </div>

          {/* Unit */}
          <div>
            <label htmlFor="unit" className="block text-sm font-medium mb-1">
              Unit
            </label>

            <select
              id="unit"
              value={unit}
              onChange={(e) => setUnit(e.target.value)}
              required
              disabled={isSubmitting}
              className="w-full px-3 py-2 rounded border border-sharkLight-100 bg-white focus:outline-none focus:ring-2 focus:ring-sharkLight-400"
            >
              {PRODUCT_UNITS.map((item) => (
                <option key={item} value={item}>
                  {item}
                </option>
              ))}
            </select>
          </div>
        </div>
      </div>

      {/* ======================================================
          STATUS
      ====================================================== */}

      <div className="bg-white rounded-lg shadow-md p-6">
        <div className="flex items-center justify-between gap-4">
          <div>
            <h3 className="font-semibold">Product Status</h3>

            <p className="text-sm text-sharkLight-300 mt-1">
              Inactive products are archived from the active catalogue.
            </p>
          </div>

          <label className="flex items-center gap-2 cursor-pointer">
            <input
              type="checkbox"
              checked={isActive}
              onChange={(e) => setIsActive(e.target.checked)}
              disabled={isSubmitting}
              className="w-5 h-5 accent-green-700"
            />

            <span className="text-sm font-semibold">{isActive ? "Active" : "Archived"}</span>
          </label>
        </div>
      </div>

      {/* ======================================================
          SUBMIT
      ====================================================== */}

      <div className="flex justify-end">
        <button
          type="submit"
          disabled={isSubmitting}
          className="flex items-center justify-center gap-2 px-6 py-3 bg-green-800 hover:bg-green-900 text-white rounded transition duration-300 hover:scale-105 hover:shadow-md disabled:opacity-50 disabled:cursor-not-allowed"
        >
          {isSubmitting ? (
            "Saving..."
          ) : (
            <>
              <FaSave />
              {isEditMode ? "Save Changes" : "Create Product"}
            </>
          )}
        </button>
      </div>
    </form>
  );
};

ProductForm.propTypes = {
  mode: PropTypes.oneOf(["create", "edit"]),
  product: PropTypes.shape({
    _id: PropTypes.string,
    name: PropTypes.string,
    sku: PropTypes.string,
    barcode: PropTypes.string,
    category: PropTypes.string,
    brand: PropTypes.string,
    description: PropTypes.string,
    price: PropTypes.number,
    costPrice: PropTypes.number,
    stockQuantity: PropTypes.number,
    lowStockThreshold: PropTypes.number,
    unit: PropTypes.string,
    productImage: PropTypes.string,
    productImagePublicId: PropTypes.string,
    isActive: PropTypes.bool,
  }),
  onSubmit: PropTypes.func.isRequired,
  isSubmitting: PropTypes.bool,
};

export default ProductForm;
