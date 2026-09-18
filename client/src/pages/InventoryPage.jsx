import { useMemo, useState } from "react";
import { useNavigate } from "react-router-dom";
import {
  FaBoxOpen,
  FaCheckCircle,
  FaExclamationTriangle,
  FaHistory,
  FaMinus,
  FaPlus,
  FaSearch,
  FaTimesCircle,
  FaTools,
  FaUndo,
} from "react-icons/fa";
import { toast } from "react-toastify";

// Redux
import {
  useGetInventoryQuery,
  useAddStockMutation,
  useRemoveStockMutation,
  useAdjustStockMutation,
  useDamageStockMutation,
  useReturnStockMutation,
} from "../slices/inventoryApiSlice";

// Components
import BackButton from "../components/BackButton";
import Loader from "../components/Loader";
import UserTablePaginationControls from "../components/UserTablePaginationControls";

const InventoryPage = () => {
  const navigate = useNavigate();

  // ============================================================
  // API
  // ============================================================

  const {
    data,
    isLoading: isGettingInventory,
    isError: isInventoryError,
    error: inventoryError,
  } = useGetInventoryQuery();

  const [addStockApiCall, { isLoading: isAddingStock }] = useAddStockMutation();

  const [removeStockApiCall, { isLoading: isRemovingStock }] = useRemoveStockMutation();

  const [adjustStockApiCall, { isLoading: isAdjustingStock }] = useAdjustStockMutation();

  const [damageStockApiCall, { isLoading: isDamagingStock }] = useDamageStockMutation();

  const [returnStockApiCall, { isLoading: isReturningStock }] = useReturnStockMutation();

  // ============================================================
  // STATE
  // ============================================================

  const [searchTerm, setSearchTerm] = useState("");
  const [stockFilter, setStockFilter] = useState("all");
  const [categoryFilter, setCategoryFilter] = useState("all");

  const [currentPage, setCurrentPage] = useState(1);
  const [productsPerPage] = useState(10);

  const [selectedProduct, setSelectedProduct] = useState(null);
  const [inventoryAction, setInventoryAction] = useState(null);

  const [quantity, setQuantity] = useState("");
  const [reason, setReason] = useState("");

  // ============================================================
  // DATA
  // ============================================================

  const products = data?.products || [];
  const summary = data?.summary || {};

  // ============================================================
  // CATEGORIES
  // ============================================================

  const categories = useMemo(() => {
    return [...new Set(products.map((product) => product.category).filter(Boolean))].sort((a, b) =>
      a.localeCompare(b),
    );
  }, [products]);

  // ============================================================
  // STOCK STATUS
  // ============================================================

  const getStockStatus = (product) => {
    if (product.stockQuantity === 0) {
      return {
        key: "out_of_stock",
        label: "Out of Stock",
        className: "bg-red-100 text-red-700",
      };
    }

    if (product.stockQuantity <= product.lowStockThreshold) {
      return {
        key: "low_stock",
        label: "Low Stock",
        className: "bg-orange-100 text-orange-700",
      };
    }

    return {
      key: "in_stock",
      label: "In Stock",
      className: "bg-green-100 text-green-700",
    };
  };

  // ============================================================
  // FILTERING
  // ============================================================

  const filteredProducts = useMemo(() => {
    const normalizedSearch = searchTerm.toLowerCase().trim();

    return products.filter((product) => {
      // Ignore archived products for operational inventory.
      // They remain available under the archived filter.
      if (stockFilter !== "archived" && !product.isActive) {
        return false;
      }

      if (stockFilter === "archived" && product.isActive) {
        return false;
      }

      if (
        product.isActive &&
        stockFilter === "in_stock" &&
        getStockStatus(product).key !== "in_stock"
      ) {
        return false;
      }

      if (
        product.isActive &&
        stockFilter === "low_stock" &&
        getStockStatus(product).key !== "low_stock"
      ) {
        return false;
      }

      if (
        product.isActive &&
        stockFilter === "out_of_stock" &&
        getStockStatus(product).key !== "out_of_stock"
      ) {
        return false;
      }

      if (categoryFilter !== "all" && product.category !== categoryFilter) {
        return false;
      }

      if (!normalizedSearch) {
        return true;
      }

      const fields = [product.name, product.sku, product.barcode, product.category, product.brand];

      return fields.some((field) =>
        String(field || "")
          .toLowerCase()
          .includes(normalizedSearch),
      );
    });
  }, [products, searchTerm, stockFilter, categoryFilter]);

  // ============================================================
  // PAGINATION
  // ============================================================

  const totalPages = Math.ceil(filteredProducts.length / productsPerPage);

  const productsOnCurrentPage = filteredProducts.slice(
    (currentPage - 1) * productsPerPage,
    currentPage * productsPerPage,
  );

  // ============================================================
  // CURRENCY
  // ============================================================

  const formatCurrency = (value) => {
    return new Intl.NumberFormat("en-NG", {
      style: "currency",
      currency: "NGN",
      maximumFractionDigits: 2,
    }).format(Number(value) || 0);
  };

  // ============================================================
  // OPEN ACTION
  // ============================================================

  const openInventoryAction = (product, action) => {
    setSelectedProduct(product);
    setInventoryAction(action);
    setQuantity("");
    setReason("");
  };

  const closeInventoryAction = () => {
    setSelectedProduct(null);
    setInventoryAction(null);
    setQuantity("");
    setReason("");
  };

  // ============================================================
  // ACTION LABEL
  // ============================================================

  const actionConfig = {
    add: {
      title: "Add Stock",
      button: "Add Stock",
      icon: FaPlus,
      color: "bg-green-800 hover:bg-green-900",
    },

    remove: {
      title: "Remove Stock",
      button: "Remove Stock",
      icon: FaMinus,
      color: "bg-red-800 hover:bg-red-900",
    },

    adjust: {
      title: "Adjust Stock",
      button: "Adjust Stock",
      icon: FaTools,
      color: "bg-shark hover:bg-sharkDark-300",
    },

    damage: {
      title: "Record Damaged Stock",
      button: "Record Damage",
      icon: FaExclamationTriangle,
      color: "bg-orange-700 hover:bg-orange-800",
    },

    return: {
      title: "Record Returned Stock",
      button: "Record Return",
      icon: FaUndo,
      color: "bg-blue-700 hover:bg-blue-800",
    },
  };

  // ============================================================
  // SUBMIT INVENTORY ACTION
  // ============================================================

  const handleInventoryAction = async (event) => {
    event.preventDefault();

    if (!selectedProduct || !inventoryAction) {
      return;
    }

    if (!quantity) {
      toast.error("Please enter a quantity.");
      return;
    }

    try {
      if (inventoryAction === "add") {
        await addStockApiCall({
          productId: selectedProduct._id,
          quantity,
          reason,
        }).unwrap();

        toast.success("Stock added successfully.");
      }

      if (inventoryAction === "remove") {
        await removeStockApiCall({
          productId: selectedProduct._id,
          quantity,
          reason,
        }).unwrap();

        toast.success("Stock removed successfully.");
      }

      if (inventoryAction === "adjust") {
        await adjustStockApiCall({
          productId: selectedProduct._id,
          newQuantity: quantity,
          reason,
        }).unwrap();

        toast.success("Stock adjusted successfully.");
      }

      if (inventoryAction === "damage") {
        await damageStockApiCall({
          productId: selectedProduct._id,
          quantity,
          reason,
        }).unwrap();

        toast.success("Damaged stock recorded successfully.");
      }

      if (inventoryAction === "return") {
        await returnStockApiCall({
          productId: selectedProduct._id,
          quantity,
          reason,
        }).unwrap();

        toast.success("Returned stock recorded successfully.");
      }

      closeInventoryAction();
    } catch (err) {
      toast.error(err?.data?.message || err?.error || "Inventory operation failed.");
    }
  };

  // ============================================================
  // LOADING
  // ============================================================

  if (isGettingInventory) {
    return (
      <div className="flex justify-center items-center h-64 text-shark">
        <Loader />

        <span className="ml-2">Loading inventory...</span>
      </div>
    );
  }

  // ============================================================
  // ERROR
  // ============================================================

  if (isInventoryError) {
    return (
      <div className="min-h-[80vh] flex flex-col justify-center items-center text-center text-red-600">
        <p className="font-semibold">Error loading inventory.</p>

        <p className="text-sm mt-2">
          {inventoryError?.data?.message || inventoryError?.error || "Please try again."}
        </p>
      </div>
    );
  }

  return (
    <div className="mb-10 min-h-[80vh] w-full mx-auto text-shark">
      {/*  HEADER  */}

      <div className="flex flex-col gap-4 mb-6 md:flex-row md:items-center md:justify-between">
        <div className="flex items-center w-full md:mb-0">
          <div className="hidden md:flex">
            <BackButton />
          </div>

          <h2 className="text-2xl md:text-3xl font-bold md:mb-0 uppercase flex items-center justify-center w-full">
            Inventory
          </h2>
        </div>

        <button
          type="button"
          onClick={() => navigate("/admin/products")}
          className="flex items-center justify-center md:w-1/5 gap-2 px-4 py-2 bg-shark text-white rounded hover:bg-sharkDark-300 transition"
        >
          <FaBoxOpen />
          View Products
        </button>
      </div>

      {/* ========================================================
          SUMMARY CARDS
      ======================================================== */}

      <div className="grid grid-cols-2 lg:grid-cols-4 gap-3 mb-6">
        <div className="bg-white rounded-lg shadow-sm p-4">
          <p className="text-xs uppercase text-sharkLight-300">Active Products</p>

          <p className="text-2xl font-bold mt-1">{summary.activeProducts || 0}</p>
        </div>

        <div className="bg-white rounded-lg shadow-sm p-4">
          <p className="text-xs uppercase text-orange-600">Low Stock</p>

          <p className="text-2xl font-bold text-orange-600 mt-1">{summary.lowStockProducts || 0}</p>
        </div>

        <div className="bg-white rounded-lg shadow-sm p-4">
          <p className="text-xs uppercase text-red-600">Out of Stock</p>

          <p className="text-2xl font-bold text-red-600 mt-1">{summary.outOfStockProducts || 0}</p>
        </div>

        <div className="bg-white rounded-lg shadow-sm p-4">
          <p className="text-xs uppercase text-green-700">Inventory Value</p>

          <p className="text-xl md:text-2xl font-bold text-green-700 mt-1">
            {formatCurrency(summary.totalInventoryValue)}
          </p>
        </div>
      </div>

      {/* ========================================================
          SECONDARY SUMMARY
      ======================================================== */}

      <div className="bg-white rounded-lg shadow-sm p-4 mb-6">
        <div className="grid grid-cols-2 md:grid-cols-3 gap-4">
          <div>
            <p className="text-xs text-sharkLight-300 uppercase">Total Units</p>

            <p className="text-xl font-bold mt-1">{summary.totalUnits || 0}</p>
          </div>

          <div>
            <p className="text-xs text-sharkLight-300 uppercase">Potential Retail Value</p>

            <p className="text-xl font-bold mt-1">{formatCurrency(summary.totalRetailValue)}</p>
          </div>

          <div>
            <p className="text-xs text-sharkLight-300 uppercase">Archived Products</p>

            <p className="text-xl font-bold mt-1">{summary.archivedProducts || 0}</p>
          </div>
        </div>
      </div>

      {/* ========================================================
          FILTERS
      ======================================================== */}

      <div className="bg-white rounded-lg shadow-sm p-4 mb-6">
        <div className="grid grid-cols-1 md:grid-cols-3 gap-3">
          {/* Search */}
          <div className="relative">
            <FaSearch className="absolute left-3 top-1/2 -translate-y-1/2 text-sharkLight-300" />

            <input
              type="text"
              value={searchTerm}
              onChange={(e) => {
                setSearchTerm(e.target.value);
                setCurrentPage(1);
              }}
              placeholder="Search inventory..."
              className="w-full pl-10 pr-3 py-2 rounded border border-sharkLight-100 focus:outline-none focus:ring-2 focus:ring-sharkLight-400"
            />
          </div>

          {/* Stock filter */}
          <select
            value={stockFilter}
            onChange={(e) => {
              setStockFilter(e.target.value);
              setCurrentPage(1);
            }}
            className="px-3 py-2 rounded border border-sharkLight-100 bg-white focus:outline-none focus:ring-2 focus:ring-sharkLight-400"
          >
            <option value="all">All Active Inventory</option>

            <option value="in_stock">In Stock</option>

            <option value="low_stock">Low Stock</option>

            <option value="out_of_stock">Out of Stock</option>

            <option value="archived">Archived Products</option>
          </select>

          {/* Category */}
          <select
            value={categoryFilter}
            onChange={(e) => {
              setCategoryFilter(e.target.value);
              setCurrentPage(1);
            }}
            className="px-3 py-2 rounded border border-sharkLight-100 bg-white focus:outline-none focus:ring-2 focus:ring-sharkLight-400"
          >
            <option value="all">All Categories</option>

            {categories.map((category) => (
              <option key={category} value={category}>
                {category}
              </option>
            ))}
          </select>
        </div>
      </div>

      {/* ========================================================
          INVENTORY TABLE
      ======================================================== */}

      <div className="bg-white rounded-lg shadow-md overflow-hidden">
        <div className="p-4 border-b">
          <h3 className="font-semibold">Current Inventory</h3>

          <p className="text-xs text-sharkLight-300 mt-1">
            {filteredProducts.length} {filteredProducts.length === 1 ? "product" : "products"} shown
          </p>
        </div>

        {filteredProducts.length === 0 ? (
          <div className="p-12 text-center">
            <FaBoxOpen className="mx-auto text-5xl text-sharkLight-300 mb-3" />

            <p className="font-semibold">No inventory found</p>

            <p className="text-sm text-sharkLight-300 mt-1">Try changing your search or filters.</p>
          </div>
        ) : (
          <>
            <div className="overflow-x-auto">
              <table className="w-full min-w-[1100px]">
                <thead>
                  <tr className="text-left text-xs uppercase border-b border-shark">
                    <th className="p-3">S/N</th>

                    <th className="p-3">Product</th>

                    <th className="p-3">SKU</th>

                    <th className="p-3">Category</th>

                    <th className="p-3 text-right">Cost</th>

                    <th className="p-3 text-right">Selling</th>

                    <th className="p-3 text-center">Stock</th>

                    <th className="p-3">Status</th>

                    <th className="p-3 text-center">Actions</th>
                  </tr>
                </thead>

                <tbody>
                  {productsOnCurrentPage.map((product, index) => {
                    const status = product.isActive
                      ? getStockStatus(product)
                      : {
                          key: "archived",
                          label: "Archived",
                          className: "bg-gray-200 text-gray-700",
                        };

                    return (
                      <tr
                        key={product._id}
                        className="border-b border-gray-200 hover:bg-sharkLight-100/30 transition"
                      >
                        {/* S/N */}
                        <td className="p-3">{index + 1 + (currentPage - 1) * productsPerPage}</td>

                        {/* Product */}
                        <td className="p-3">
                          <div className="flex items-center gap-3 min-w-[220px]">
                            <div className="w-10 h-10 rounded-md overflow-hidden bg-sharkLight-100 flex items-center justify-center flex-shrink-0">
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

                        {/* Cost */}
                        <td className="p-3 text-right whitespace-nowrap">
                          {formatCurrency(product.costPrice)}
                        </td>

                        {/* Selling */}
                        <td className="p-3 text-right whitespace-nowrap">
                          {formatCurrency(product.price)}
                        </td>

                        {/* Stock */}
                        <td className="p-3 text-center">
                          <div className="font-semibold">{product.stockQuantity}</div>

                          <div className="text-xs text-sharkLight-300">{product.unit}</div>
                        </td>

                        {/* Status */}
                        <td className="p-3">
                          <span
                            className={`inline-flex items-center px-2.5 py-1 rounded-full text-xs font-semibold whitespace-nowrap ${status.className}`}
                          >
                            {status.key === "in_stock" && <FaCheckCircle className="mr-1" />}

                            {status.key === "low_stock" && (
                              <FaExclamationTriangle className="mr-1" />
                            )}

                            {status.key === "out_of_stock" && <FaTimesCircle className="mr-1" />}

                            {status.label}
                          </span>
                        </td>

                        {/* Actions */}
                        <td className="p-3">
                          {product.isActive ? (
                            <div className="flex justify-center gap-1">
                              <div className="group relative">
                                <button
                                  type="button"
                                  onClick={() => openInventoryAction(product, "add")}
                                  className="p-2 bg-green-800 hover:bg-green-900 text-white rounded transition"
                                >
                                  <FaPlus />
                                </button>

                                {/* Add stock ToolTip */}
                                <span className="absolute bottom-full right-0 mb-2 px-2 py-1 text-sm text-white bg-green-900 rounded-md opacity-0 group-hover:opacity-100 transition-opacity duration-300 whitespace-nowrap z-10 pointer-events-none">
                                  Add stock
                                </span>
                              </div>

                              <div className="group relative">
                                <button
                                  type="button"
                                  onClick={() => openInventoryAction(product, "remove")}
                                  className="p-2 bg-red-800 hover:bg-red-900 text-white rounded transition"
                                >
                                  <FaMinus />
                                </button>

                                {/* Remove stock ToolTip */}
                                <span className="absolute bottom-full right-0 mb-2 px-2 py-1 text-sm text-white bg-red-900 rounded-md opacity-0 group-hover:opacity-100 transition-opacity duration-300 whitespace-nowrap z-10 pointer-events-none">
                                  Remove stock
                                </span>
                              </div>

                              <div className="group relative">
                                <button
                                  type="button"
                                  onClick={() => openInventoryAction(product, "adjust")}
                                  className="p-2 bg-shark hover:bg-sharkDark-300 text-white rounded transition"
                                >
                                  <FaTools />
                                </button>

                                {/* Adjust stock ToolTip */}
                                <span className="absolute bottom-full right-0 mb-2 px-2 py-1 text-sm text-white bg-sharkDark-300 rounded-md opacity-0 group-hover:opacity-100 transition-opacity duration-300 whitespace-nowrap z-10 pointer-events-none">
                                  Adjust stock
                                </span>
                              </div>

                              <div className="group relative">
                                <button
                                  type="button"
                                  onClick={() => openInventoryAction(product, "damage")}
                                  className="p-2 bg-orange-700 hover:bg-orange-800 text-white rounded transition"
                                >
                                  <FaExclamationTriangle />
                                </button>

                                {/* Damaged stock ToolTip */}
                                <span className="absolute bottom-full right-0 mb-2 px-2 py-1 text-sm text-white bg-orange-800 rounded-md opacity-0 group-hover:opacity-100 transition-opacity duration-300 whitespace-nowrap z-10 pointer-events-none">
                                  Damaged stock
                                </span>
                              </div>

                              <div className="group relative">
                                <button
                                  type="button"
                                  onClick={() => openInventoryAction(product, "return")}
                                  className="p-2 bg-blue-700 hover:bg-blue-800 text-white rounded transition"
                                >
                                  <FaUndo />
                                </button>

                                {/*Returned stock ToolTip */}
                                <span className="absolute bottom-full right-0 mb-2 px-2 py-1 text-sm text-white bg-blue-800 rounded-md opacity-0 group-hover:opacity-100 transition-opacity duration-300 whitespace-nowrap z-10 pointer-events-none">
                                  Returned stock
                                </span>
                              </div>

                              <div className="group relative">
                                <button
                                  type="button"
                                  onClick={() => navigate(`/admin/inventory/${product._id}`)}
                                  className="p-2 bg-sharkLight-400 hover:bg-sharkLight-500 text-white rounded transition"
                                >
                                  <FaHistory />
                                </button>

                                {/* Inventory history ToolTip */}
                                <span className="absolute bottom-full right-0 mb-2 px-2 py-1 text-sm text-white bg-sharkLight-500 rounded-md opacity-0 group-hover:opacity-100 transition-opacity duration-300 whitespace-nowrap z-10 pointer-events-none">
                                  View inventory history
                                </span>
                              </div>
                            </div>
                          ) : (
                            <div className="text-center text-xs text-sharkLight-300">Archived</div>
                          )}
                        </td>
                      </tr>
                    );
                  })}
                </tbody>
              </table>
            </div>

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

      {/* ========================================================
          INVENTORY ACTION MODAL
      ======================================================== */}

      {selectedProduct && inventoryAction && (
        <div className="fixed inset-0 z-[100] flex items-center justify-center bg-black/50 p-4">
          <div className="bg-white w-full max-w-md rounded-lg shadow-xl">
            {/* Header */}
            <div className="flex items-center justify-between p-4 border-b">
              <div>
                <h3 className="text-lg font-bold">{actionConfig[inventoryAction].title}</h3>

                <p className="text-xs text-sharkLight-300 mt-1">{selectedProduct.name}</p>
              </div>

              <button
                type="button"
                onClick={closeInventoryAction}
                className="text-xl text-sharkLight-300 hover:text-shark"
              >
                ×
              </button>
            </div>

            {/* Body */}
            <form onSubmit={handleInventoryAction} className="p-4 space-y-4">
              <div className="bg-sharkLight-100/50 rounded p-3">
                <div className="flex justify-between text-sm">
                  <span>Current Stock</span>

                  <strong>
                    {selectedProduct.stockQuantity} {selectedProduct.unit}
                  </strong>
                </div>

                {inventoryAction === "adjust" && (
                  <p className="text-xs text-sharkLight-300 mt-2">
                    Enter the exact physical stock count.
                  </p>
                )}
              </div>

              {/* Quantity */}
              <div>
                <label htmlFor="inventory-quantity" className="block text-sm font-medium mb-1">
                  {inventoryAction === "adjust" ? "New Stock Quantity" : "Quantity"}
                </label>

                <input
                  id="inventory-quantity"
                  type="number"
                  min={inventoryAction === "adjust" ? "0" : "1"}
                  step="1"
                  value={quantity}
                  onChange={(e) => setQuantity(e.target.value)}
                  required
                  disabled={
                    isAddingStock ||
                    isRemovingStock ||
                    isAdjustingStock ||
                    isDamagingStock ||
                    isReturningStock
                  }
                  autoFocus
                  className="w-full px-3 py-2 rounded border border-sharkLight-100 focus:outline-none focus:ring-2 focus:ring-sharkLight-400"
                />
              </div>

              {/* Reason */}
              <div>
                <label htmlFor="inventory-reason" className="block text-sm font-medium mb-1">
                  Reason
                </label>

                <textarea
                  id="inventory-reason"
                  rows="3"
                  value={reason}
                  onChange={(e) => setReason(e.target.value)}
                  placeholder="Enter a reason..."
                  disabled={
                    isAddingStock ||
                    isRemovingStock ||
                    isAdjustingStock ||
                    isDamagingStock ||
                    isReturningStock
                  }
                  className="w-full px-3 py-2 rounded border border-sharkLight-100 focus:outline-none focus:ring-2 focus:ring-sharkLight-400 resize-y"
                />
              </div>

              {/* Buttons */}
              <div className="flex gap-2 pt-2">
                <button
                  type="button"
                  onClick={closeInventoryAction}
                  disabled={
                    isAddingStock ||
                    isRemovingStock ||
                    isAdjustingStock ||
                    isDamagingStock ||
                    isReturningStock
                  }
                  className="flex-1 px-4 py-2 bg-sharkLight-100 hover:bg-sharkLight-200 rounded transition disabled:opacity-50"
                >
                  Cancel
                </button>

                <button
                  type="submit"
                  disabled={
                    isAddingStock ||
                    isRemovingStock ||
                    isAdjustingStock ||
                    isDamagingStock ||
                    isReturningStock
                  }
                  className={`flex-1 flex items-center justify-center gap-2 px-4 py-2 text-white rounded transition ${
                    actionConfig[inventoryAction].color
                  } disabled:opacity-50`}
                >
                  {isAddingStock ||
                  isRemovingStock ||
                  isAdjustingStock ||
                  isDamagingStock ||
                  isReturningStock ? (
                    <>
                      <Loader />
                      Processing...
                    </>
                  ) : (
                    <>
                      {(() => {
                        const ActionIcon = actionConfig[inventoryAction].icon;

                        return <ActionIcon />;
                      })()}

                      {actionConfig[inventoryAction].button}
                    </>
                  )}
                </button>
              </div>
            </form>
          </div>
        </div>
      )}
    </div>
  );
};

export default InventoryPage;
