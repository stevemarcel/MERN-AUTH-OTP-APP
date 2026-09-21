import { useMemo, useState } from "react";
import { useNavigate } from "react-router-dom";
import {
  FaArchive,
  FaBoxOpen,
  FaCheckCircle,
  FaPencilAlt,
  FaPlus,
  FaSearch,
  FaTimesCircle,
  FaUndo,
} from "react-icons/fa";
import { MdDelete } from "react-icons/md";
import { toast } from "react-toastify";

// --- API SLICE HOOKS (Redux) ---
import {
  useGetProductsQuery,
  useDeleteProductMutation,
  useDeleteProductsMutation,
  useRestoreProductMutation,
} from "../slices/productApiSlice";

// --- LOCAL COMPONENTS IMPORTS ---
import Loader from "../components/Loader";
import BackButton from "../components/BackButton";
import ConfirmationModal from "../components/ConfirmationModal";
import UserTablePaginationControls from "../components/UserTablePaginationControls";
import FilterDropdown from "../components/FilterDropdown";

const EMPTY_PRODUCTS = [];

const ProductListPage = () => {
  const navigate = useNavigate();
  // ! --- REACT QUERY API CALLS ---
  const {
    data,
    isLoading: isGettingProducts,
    isError: isProductsError,
    error: productsError,
  } = useGetProductsQuery();

  const [deleteProductApiCall, { isLoading: isArchivingProduct }] = useDeleteProductMutation();

  const [deleteProductsApiCall, { isLoading: isArchivingMultipleProducts }] =
    useDeleteProductsMutation();

  const [restoreProductApiCall, { isLoading: isRestoringProduct }] = useRestoreProductMutation();

  // ! --- LOCAL STATE DEFINITIONS ---
  const [searchTerm, setSearchTerm] = useState("");
  const [statusFilter, setStatusFilter] = useState("active");
  const [categoryFilter, setCategoryFilter] = useState("all");

  const [currentPage, setCurrentPage] = useState(1);
  const [productsPerPage] = useState(10);

  const [selectedProductIds, setSelectedProductIds] = useState(new Set());

  const [archiveProductId, setArchiveProductId] = useState(null);
  const [restoreProductId, setRestoreProductId] = useState(null);

  const [showArchiveConfirm, setShowArchiveConfirm] = useState(false);
  const [showBulkArchiveConfirm, setShowBulkArchiveConfirm] = useState(false);
  const [showRestoreConfirm, setShowRestoreConfirm] = useState(false);

  // ! --- DATA ---
  // ! Extract products from the API response, defaulting to an empty array if data is undefined

  const products = data?.products ?? EMPTY_PRODUCTS;

  // *============================================================
  // *PRODUCT CATEGORIES
  // *============================================================

  const categories = useMemo(() => {
    const uniqueCategories = [
      ...new Set(products.map((product) => product.category).filter(Boolean)),
    ];

    return uniqueCategories.sort((a, b) => a.localeCompare(b));
  }, [products]);

  // *============================================================
  // *SEARCH + FILTER
  // *============================================================

  const filteredProducts = useMemo(() => {
    const normalizedSearch = searchTerm.toLowerCase().trim();

    return products.filter((product) => {
      // --------------------------------------------------------
      // Status filter
      // --------------------------------------------------------

      if (statusFilter === "active" && !product.isActive) {
        return false;
      }

      if (statusFilter === "archived" && product.isActive) {
        return false;
      }

      if (
        statusFilter === "low-stock" &&
        (product.stockQuantity <= 0 || product.stockQuantity > product.lowStockThreshold)
      ) {
        return false;
      }

      if (statusFilter === "out-of-stock" && product.stockQuantity > 0) {
        return false;
      }

      // --------------------------------------------------------
      // Category filter
      // --------------------------------------------------------

      if (categoryFilter !== "all" && product.category !== categoryFilter) {
        return false;
      }

      // --------------------------------------------------------
      // Search
      // --------------------------------------------------------

      if (!normalizedSearch) {
        return true;
      }

      const searchFields = [
        product.name,
        product.sku,
        product.barcode,
        product.category,
        product.brand,
      ];

      return searchFields.some((field) =>
        String(field || "")
          .toLowerCase()
          .includes(normalizedSearch),
      );
    });
  }, [products, searchTerm, statusFilter, categoryFilter]);

  // *============================================================
  // *PAGINATION
  // *============================================================

  const totalPages = Math.ceil(filteredProducts.length / productsPerPage);

  const productsOnCurrentPage = filteredProducts.slice(
    (currentPage - 1) * productsPerPage,
    currentPage * productsPerPage,
  );

  // *============================================================
  // *SELECT ALL
  // *============================================================

  const isAllOnPageSelected =
    productsOnCurrentPage.length > 0 &&
    productsOnCurrentPage.every((product) => selectedProductIds.has(product._id));

  const handleSelectAll = () => {
    const newSelectedProductIds = new Set(selectedProductIds);

    if (isAllOnPageSelected) {
      productsOnCurrentPage.forEach((product) => {
        newSelectedProductIds.delete(product._id);
      });
    } else {
      productsOnCurrentPage.forEach((product) => {
        newSelectedProductIds.add(product._id);
      });
    }

    setSelectedProductIds(newSelectedProductIds);
  };

  // *============================================================
  // *SELECT SINGLE PRODUCT
  // *============================================================

  const handleSelectProduct = (productId) => {
    const newSelectedProductIds = new Set(selectedProductIds);

    if (newSelectedProductIds.has(productId)) {
      newSelectedProductIds.delete(productId);
    } else {
      newSelectedProductIds.add(productId);
    }

    setSelectedProductIds(newSelectedProductIds);
  };

  // *============================================================
  // *FILTER HANDLERS
  // *============================================================

  const handleSearchChange = (e) => {
    setSearchTerm(e.target.value);
    setCurrentPage(1);
    setSelectedProductIds(new Set());
  };

  const handleStatusFilterChange = (value) => {
    setStatusFilter(value);
    setCurrentPage(1);
    setSelectedProductIds(new Set());
  };

  const handleCategoryFilterChange = (value) => {
    setCategoryFilter(value);
    setCurrentPage(1);
    setSelectedProductIds(new Set());
  };

  // *============================================================
  // *PRODUCT STATUS
  // *============================================================

  const getStockStatus = (product) => {
    if (!product.isActive) {
      return {
        label: "Archived",
        className: "bg-gray-200 text-gray-700",
      };
    }

    if (product.stockQuantity === 0) {
      return {
        label: "Out of Stock",
        className: "bg-red-100 text-red-700",
      };
    }

    if (product.stockQuantity <= product.lowStockThreshold) {
      return {
        label: "Low Stock",
        className: "bg-orange-100 text-orange-700",
      };
    }

    return {
      label: "In Stock",
      className: "bg-green-100 text-green-700",
    };
  };

  // *============================================================
  // *CURRENCY
  // *============================================================

  const formatCurrency = (value) => {
    return new Intl.NumberFormat("en-NG", {
      style: "currency",
      currency: "NGN",
      maximumFractionDigits: 2,
    }).format(Number(value) || 0);
  };

  // *============================================================
  // *ARCHIVE SINGLE PRODUCT
  // *============================================================

  const openArchiveConfirm = (productId) => {
    setArchiveProductId(productId);
    setShowArchiveConfirm(true);
  };

  const confirmArchive = async () => {
    if (!archiveProductId) return;

    try {
      const response = await deleteProductApiCall(archiveProductId).unwrap();

      toast.success(response.message);

      setShowArchiveConfirm(false);
      setArchiveProductId(null);

      setSelectedProductIds((previous) => {
        const updated = new Set(previous);
        updated.delete(archiveProductId);
        return updated;
      });
    } catch (err) {
      toast.error(err?.data?.message || err?.error || "Failed to archive product.");
    }
  };

  const cancelArchive = () => {
    setShowArchiveConfirm(false);
    setArchiveProductId(null);
  };

  // *============================================================
  // *BULK ARCHIVE
  // *============================================================

  const openBulkArchiveConfirm = () => {
    if (selectedProductIds.size === 0) {
      toast.error("Please select products to archive.");
      return;
    }

    setShowBulkArchiveConfirm(true);
  };

  const confirmBulkArchive = async () => {
    try {
      const productIds = Array.from(selectedProductIds);

      const response = await deleteProductsApiCall(productIds).unwrap();

      toast.success(response.message);

      setShowBulkArchiveConfirm(false);
      setSelectedProductIds(new Set());
    } catch (err) {
      toast.error(err?.data?.message || err?.error || "Failed to archive products.");
    }
  };

  const cancelBulkArchive = () => {
    setShowBulkArchiveConfirm(false);
  };

  // *============================================================
  // *RESTORE PRODUCT
  // *============================================================

  const openRestoreConfirm = (productId) => {
    setRestoreProductId(productId);
    setShowRestoreConfirm(true);
  };

  const confirmRestore = async () => {
    if (!restoreProductId) return;

    try {
      const response = await restoreProductApiCall(restoreProductId).unwrap();

      toast.success(response.message);

      setShowRestoreConfirm(false);
      setRestoreProductId(null);
    } catch (err) {
      toast.error(err?.data?.message || err?.error || "Failed to restore product.");
    }
  };

  const cancelRestore = () => {
    setShowRestoreConfirm(false);
    setRestoreProductId(null);
  };

  const statusFilterOptions = [
    { value: "active", label: "Active Products" },
    { value: "archived", label: "Archived Products" },
    { value: "low-stock", label: "Low Stock Products" },
    { value: "out-of-stock", label: "Out of Stock Products" },
    { value: "all", label: "All Products" },
  ];

  const categoryFilterOptions = [
    { value: "all", label: "All Categories" },
    ...categories.map((category) => ({
      value: category,
      label: category,
    })),
  ];

  // *============================================================
  // *RENDER
  // *============================================================

  return (
    <div className="mb-10 min-h-[80vh] w-full mx-auto text-shark">
      {/* HEADER */}

      <div className="flex flex-col gap-4 mb-6 md:flex-row md:items-center md:justify-between">
        <div className="flex items-center w-full md:mb-0">
          <div className="hidden md:flex">
            <BackButton />
          </div>

          <h2 className="text-2xl md:text-3xl font-bold md:mb-0 uppercase flex items-center justify-center w-full">
            Products
          </h2>
        </div>

        <button
          type="button"
          onClick={() => navigate("/admin/products/create")}
          className="flex items-center justify-center w-full md:w-1/5 gap-2 px-4 py-2 bg-green-800 hover:bg-green-900 text-white rounded transition duration-300 hover:scale-105 hover:shadow-md"
        >
          <FaPlus />
          Add Product
        </button>
      </div>

      {/*  TOOLBAR */}
      <div className="bg-white rounded shadow-md p-4 mb-6">
        <div className="grid grid-cols-1 md:grid-cols-3 gap-3">
          {/* Search */}
          <div className="relative">
            <FaSearch className="absolute left-3 top-1/2 -translate-y-1/2 text-sharkLight-300" />

            <input
              type="text"
              value={searchTerm}
              onChange={handleSearchChange}
              placeholder="Search products..."
              className="
                w-full
                pl-10
                pr-3
                py-2
                rounded border
                border-sharkLight-100
                focus:outline-none
                focus:ring-2
                focus:ring-sharkLight-400
              "
            />
          </div>

          {/* Status */}
          <FilterDropdown
            value={statusFilter}
            onChange={handleStatusFilterChange}
            options={statusFilterOptions}
          />

          {/* Category */}
          <FilterDropdown
            value={categoryFilter}
            onChange={handleCategoryFilterChange}
            options={categoryFilterOptions}
          />
        </div>
      </div>

      {/* SUMMARY */}
      {!isGettingProducts && !isProductsError && (
        <div className="grid grid-cols-2 md:grid-cols-4 gap-3 mb-6">
          <div className="bg-white rounded shadow-sm p-4">
            <p className="text-xs text-sharkLight-300 uppercase">Total</p>

            <p className="text-2xl font-bold mt-1">{products.length}</p>
          </div>

          <div className="bg-white rounded shadow-sm p-4">
            <p className="text-xs text-sharkLight-300 uppercase">Active</p>

            <p className="text-2xl font-bold text-green-700 mt-1">
              {products.filter((product) => product.isActive).length}
            </p>
          </div>

          <div className="bg-white rounded shadow-sm p-4">
            <p className="text-xs text-sharkLight-300 uppercase">Low Stock</p>

            <p className="text-2xl font-bold text-orange-600 mt-1">
              {
                products.filter(
                  (product) =>
                    product.isActive &&
                    product.stockQuantity > 0 &&
                    product.stockQuantity <= product.lowStockThreshold,
                ).length
              }
            </p>
          </div>

          <div className="bg-white rounded shadow-sm p-4">
            <p className="text-xs text-sharkLight-300 uppercase">Out of Stock</p>

            <p className="text-2xl font-bold text-red-700 mt-1">
              {products.filter((product) => product.isActive && product.stockQuantity === 0).length}
            </p>
          </div>
        </div>
      )}

      {/*  ERROR  */}

      {isProductsError && (
        <div className="bg-white rounded shadow-md p-8 text-center text-red-600">
          <p className="font-semibold">Error loading products.</p>

          <p className="text-sm mt-1">
            {productsError?.data?.message || productsError?.error || "Please try again."}
          </p>
        </div>
      )}

      {/* TABLE */}

      {!isProductsError && (
        <div className="bg-white rounded shadow-md overflow-hidden">
          {/* Table Header */}
          <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-3 p-4 border-b">
            <div>
              <h3 className="font-semibold">Product Catalogue</h3>

              <p className="text-xs text-sharkLight-300 mt-1">
                {filteredProducts.length} {filteredProducts.length === 1 ? "product" : "products"}{" "}
                shown
              </p>
            </div>

            {selectedProductIds.size > 0 && (
              <button
                type="button"
                onClick={openBulkArchiveConfirm}
                disabled={isArchivingMultipleProducts}
                className="flex items-center justify-center gap-2 px-3 py-2 bg-red-800 hover:bg-red-900 disabled:opacity-50 text-white text-sm rounded"
              >
                {isArchivingMultipleProducts ? <Loader /> : <FaArchive />}
                Archive ({selectedProductIds.size})
              </button>
            )}
          </div>

          {isGettingProducts ? (
            <div className="flex justify-center items-center p-12">
              <Loader />
              <span className="ml-2">Loading products...</span>
            </div>
          ) : filteredProducts.length === 0 ? (
            <div className="p-12 text-center">
              <FaBoxOpen className="mx-auto text-5xl text-sharkLight-300 mb-3" />

              <p className="font-semibold">No products found</p>

              <p className="text-sm text-sharkLight-300 mt-1">
                Try changing your search or filter.
              </p>
            </div>
          ) : (
            <>
              {/* Desktop / Tablet Table */}
              <div className="overflow-x-auto">
                <table className="w-full min-w-[950px]">
                  <thead>
                    <tr className="text-left text-xs uppercase border-b border-shark">
                      {/* Checkbox */}
                      <th className="p-3">
                        <input
                          type="checkbox"
                          checked={isAllOnPageSelected}
                          onChange={handleSelectAll}
                          ref={(element) => {
                            if (element) {
                              element.indeterminate =
                                selectedProductIds.size > 0 && !isAllOnPageSelected;
                            }
                          }}
                        />
                      </th>

                      {/* S/N */}
                      <th className="p-3">S/N</th>

                      {/* Product */}
                      <th className="p-3">Product</th>

                      {/* SKU */}
                      <th className="p-3">SKU</th>

                      {/* Category */}
                      <th className="p-3">Category</th>

                      {/* Price */}
                      <th className="p-3">Price</th>

                      {/* Stock */}
                      <th className="p-3 text-center">Stock</th>

                      {/* Status */}
                      <th className="p-3">Status</th>

                      {/* Actions */}
                      <th className="p-3 text-center">Actions</th>
                    </tr>
                  </thead>

                  <tbody>
                    {productsOnCurrentPage.map((product, index) => {
                      const stockStatus = getStockStatus(product);

                      return (
                        <tr
                          key={product._id}
                          className={`text-sm border-b border-gray-200 transition-all duration-200 hover:bg-sharkLight-100/30 ${
                            selectedProductIds.has(product._id)
                              ? "bg-sharkLight-100 border-l-4 border-shark"
                              : ""
                          }`}
                        >
                          {/* Checkbox */}
                          <td className="p-3">
                            <input
                              type="checkbox"
                              checked={selectedProductIds.has(product._id)}
                              onChange={() => handleSelectProduct(product._id)}
                            />
                          </td>

                          {/* S/N */}
                          <td className="p-3">{index + 1 + (currentPage - 1) * productsPerPage}</td>

                          {/* Product */}
                          <td className="p-3">
                            <div className="flex items-center gap-3 min-w-[230px]">
                              <div className="w-10 h-10 rounded-md overflow-hidden flex-shrink-0 bg-sharkLight-100 flex items-center justify-center">
                                {product.productImage ? (
                                  <img
                                    src={product.productImage}
                                    alt={product.name}
                                    className="w-full h-full object-cover"
                                  />
                                ) : (
                                  <FaBoxOpen className="text-sharkLight-300" />
                                )}
                              </div>

                              <div className="min-w-0">
                                <p className="font-semibold truncate">{product.name}</p>

                                {product.brand && (
                                  <p className="text-xs text-sharkLight-300 truncate">
                                    {product.brand}
                                  </p>
                                )}
                              </div>
                            </div>
                          </td>

                          {/* SKU */}
                          <td className="p-3 font-mono text-xs">{product.sku}</td>

                          {/* Category */}
                          <td className="p-3">{product.category}</td>

                          {/* Price */}
                          <td className="p-3 whitespace-nowrap">{formatCurrency(product.price)}</td>

                          {/* Stock */}
                          <td className="p-3 text-center whitespace-nowrap">
                            <span className="font-semibold">{product.stockQuantity}</span>

                            <span className="text-xs text-sharkLight-300 ml-1">{product.unit}</span>
                          </td>

                          {/* Status */}
                          <td className="p-3">
                            <span
                              className={`inline-flex items-center px-2.5 py-1 rounded-full text-xs font-semibold whitespace-nowrap ${stockStatus.className}`}
                            >
                              {product.isActive ? (
                                product.stockQuantity === 0 ? (
                                  <FaTimesCircle className="mr-1" />
                                ) : product.stockQuantity <= product.lowStockThreshold ? (
                                  <FaArchive className="mr-1" />
                                ) : (
                                  <FaCheckCircle className="mr-1" />
                                )
                              ) : (
                                <FaArchive className="mr-1" />
                              )}

                              {stockStatus.label}
                            </span>
                          </td>

                          {/* Actions */}
                          <td className="p-3">
                            <div className="flex justify-center gap-1">
                              {/* Edit */}
                              {product.isActive && (
                                <div className="group relative">
                                  <button
                                    type="button"
                                    onClick={() => navigate(`/admin/product/${product._id}/edit`)}
                                    className="p-2 bg-shark hover:bg-sharkDark-300 text-white rounded transition"
                                  >
                                    <FaPencilAlt />
                                  </button>

                                  {/* Edit Product ToolTip */}
                                  <span className="absolute bottom-full right-0 mb-2 px-2 py-1 text-sm text-white bg-sharkDark-300 rounded-md opacity-0 group-hover:opacity-100 transition-opacity duration-300 whitespace-nowrap z-10 pointer-events-none">
                                    Edit Product
                                  </span>
                                </div>
                              )}

                              {/* Archive */}
                              {product.isActive && (
                                <div className="group relative">
                                  <button
                                    type="button"
                                    onClick={() => openArchiveConfirm(product._id)}
                                    disabled={isArchivingProduct}
                                    className="p-2 bg-red-800 hover:bg-red-900 text-white rounded transition disabled:opacity-50"
                                  >
                                    {isArchivingProduct ? <Loader /> : <MdDelete />}
                                  </button>

                                  {/* Archive Product ToolTip */}
                                  <span className="absolute bottom-full right-0 mb-2 px-2 py-1 text-sm text-white bg-red-900 rounded-md opacity-0 group-hover:opacity-100 transition-opacity duration-300 whitespace-nowrap z-10 pointer-events-none">
                                    Archive Product
                                  </span>
                                </div>
                              )}
                              {/* Restore */}
                              {!product.isActive && (
                                <button
                                  type="button"
                                  title="Restore product"
                                  onClick={() => openRestoreConfirm(product._id)}
                                  disabled={isRestoringProduct}
                                  className="p-2 bg-green-800 hover:bg-green-900 text-white rounded transition disabled:opacity-50"
                                >
                                  {isRestoringProduct ? <Loader /> : <FaUndo />}
                                </button>
                              )}
                            </div>
                          </td>
                        </tr>
                      );
                    })}
                  </tbody>
                </table>
              </div>

              {/* Pagination */}
              <div className="flex justify-center md:justify-end p-4 border-t">
                <UserTablePaginationControls
                  currentPage={currentPage}
                  totalPages={totalPages}
                  onPageChange={setCurrentPage}
                />
              </div>
            </>
          )}
        </div>
      )}

      {/*  ARCHIVE SINGLE PRODUCT MODAL  */}

      <ConfirmationModal
        isOpen={showArchiveConfirm}
        title="Archive Product"
        message="Are you sure you want to archive this product? It will no longer appear among active products, but its inventory history will be preserved."
        onConfirm={confirmArchive}
        onCancel={cancelArchive}
        confirmButtonText={isArchivingProduct ? "Archiving..." : "Confirm Archive"}
        cancelButtonText="Cancel"
        isConfirming={isArchivingProduct}
      />

      {/*  BULK ARCHIVE MODAL  */}

      <ConfirmationModal
        isOpen={showBulkArchiveConfirm}
        title={`Archive ${selectedProductIds.size} ${
          selectedProductIds.size === 1 ? "Product" : "Products"
        }`}
        message={`Are you sure you want to archive ${selectedProductIds.size} selected ${
          selectedProductIds.size === 1 ? "product" : "products"
        }? Their inventory records and history will be preserved.`}
        onConfirm={confirmBulkArchive}
        onCancel={cancelBulkArchive}
        confirmButtonText={isArchivingMultipleProducts ? "Archiving..." : "Confirm Archive"}
        cancelButtonText="Cancel"
        isConfirming={isArchivingMultipleProducts}
      />

      {/*  RESTORE MODAL  */}

      <ConfirmationModal
        isOpen={showRestoreConfirm}
        title="Restore Product"
        message="Are you sure you want to restore this product to the active product catalogue?"
        onConfirm={confirmRestore}
        onCancel={cancelRestore}
        confirmButtonText={isRestoringProduct ? "Restoring..." : "Confirm Restore"}
        cancelButtonText="Cancel"
        isConfirming={isRestoringProduct}
      />
    </div>
  );
};

export default ProductListPage;
