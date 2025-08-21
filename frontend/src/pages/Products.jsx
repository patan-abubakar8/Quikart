import { useState, useEffect } from "react";
import { useSearchParams } from "react-router-dom";
import { useQuery } from "@tanstack/react-query";
import SearchBar from "../components/products/SearchBar";
import ProductFilters from "../components/products/ProductFilters";
import ProductGrid from "../components/products/ProductGrid";
import Pagination from "../components/products/Pagination";
import { productService } from "../services/productService";
import { Grid, List, SlidersHorizontal } from "lucide-react";

const Products = () => {
  const [searchParams, setSearchParams] = useSearchParams();
  const [currentPage, setCurrentPage] = useState(0);
  const [pageSize] = useState(12);
  const [searchQuery, setSearchQuery] = useState(
    searchParams.get("search") || ""
  );
  const [filters, setFilters] = useState({});
  const [viewMode, setViewMode] = useState("grid"); // 'grid' or 'list'
  const [sortBy, setSortBy] = useState("name"); // 'name', 'price', 'newest'

  // Fetch products based on current state
  const { data, isLoading, error, refetch } = useQuery({
    queryKey: ["products", currentPage, pageSize, searchQuery, filters, sortBy],
    queryFn: async () => {
      if (searchQuery) {
        return await productService.searchProducts(searchQuery);
      } else if (Object.keys(filters).length > 0) {
        return await productService.filterProducts(filters);
      } else {
        return await productService.getAllProducts(currentPage, pageSize);
      }
    },
    keepPreviousData: true,
  });

  // Update search params when search query changes
  useEffect(() => {
    if (searchQuery) {
      setSearchParams({ search: searchQuery });
    } else {
      setSearchParams({});
    }
  }, [searchQuery, setSearchParams]);

  // Reset page when search or filters change
  useEffect(() => {
    setCurrentPage(0);
  }, [searchQuery, filters]);

  const handleSearch = (query) => {
    setSearchQuery(query);
    setFilters({}); // Clear filters when searching
  };

  const handleFiltersChange = (newFilters) => {
    setFilters(newFilters);
    setSearchQuery(""); // Clear search when filtering
  };

  const handlePageChange = (page) => {
    setCurrentPage(page);
    window.scrollTo({ top: 0, behavior: "smooth" });
  };

  const handleSortChange = (newSortBy) => {
    setSortBy(newSortBy);
    // You can implement sorting logic here or on the backend
  };

  // Extract products and pagination info
  const products = data?.data?.content || data?.data || [];
  const totalPages = data?.data?.totalPages || 1;
  const totalElements = data?.data?.totalElements || products.length;

  return (
    <div className="min-h-screen bg-gray-50">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        {/* Header */}
        <div className="mb-8">
          <h1 className="text-3xl font-bold text-gray-900 mb-4">Products</h1>

          {/* Search Bar */}
          <div className="max-w-2xl">
            <SearchBar
              onSearch={handleSearch}
              initialValue={searchQuery}
              placeholder="Search for products, brands, categories..."
            />
          </div>
        </div>

        {/* Filters */}
        <ProductFilters
          onFiltersChange={handleFiltersChange}
          initialFilters={filters}
        />

        {/* Toolbar */}
        <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between mb-6 bg-white p-4 rounded-lg border border-gray-200">
          {/* Results Count */}
          <div className="text-sm text-gray-600 mb-4 sm:mb-0">
            {isLoading
              ? "Loading products..."
              : `${totalElements} product${
                  totalElements !== 1 ? "s" : ""
                } found`}
          </div>

          {/* Controls */}
          <div className="flex items-center space-x-4">
            {/* Sort Dropdown */}
            <div className="flex items-center space-x-2">
              <SlidersHorizontal className="h-4 w-4 text-gray-500" />
              <select
                value={sortBy}
                onChange={(e) => handleSortChange(e.target.value)}
                className="text-sm border border-gray-300 rounded px-2 py-1 focus:outline-none focus:ring-2 focus:ring-primary-500"
              >
                <option value="name">Sort by Name</option>
                <option value="price-low">Price: Low to High</option>
                <option value="price-high">Price: High to Low</option>
                <option value="newest">Newest First</option>
                <option value="popular">Most Popular</option>
              </select>
            </div>

            {/* View Mode Toggle */}
            <div className="flex items-center border border-gray-300 rounded">
              <button
                onClick={() => setViewMode("grid")}
                className={`p-2 ${
                  viewMode === "grid"
                    ? "bg-primary-600 text-white"
                    : "text-gray-500 hover:text-gray-700"
                }`}
              >
                <Grid className="h-4 w-4" />
              </button>
              <button
                onClick={() => setViewMode("list")}
                className={`p-2 ${
                  viewMode === "list"
                    ? "bg-primary-600 text-white"
                    : "text-gray-500 hover:text-gray-700"
                }`}
              >
                <List className="h-4 w-4" />
              </button>
            </div>
          </div>
        </div>

        {/* Products Grid */}
        <div className="mb-8">
          <ProductGrid
            products={products}
            loading={isLoading}
            error={error?.message}
          />
        </div>

        {/* Pagination */}
        {totalPages > 1 && (
          <Pagination
            currentPage={currentPage}
            totalPages={totalPages}
            totalElements={totalElements}
            pageSize={pageSize}
            onPageChange={handlePageChange}
          />
        )}
      </div>
    </div>
  );
};

export default Products;
