import { useState } from "react";
import { Star, ShoppingCart, Zap, Heart } from "lucide-react";
import { useCart } from "../../context/CartContext";
import { useNavigate } from "react-router-dom";
import { formatPrice } from "../../utils/currency";
import toast from "react-hot-toast";

const ProductCard = ({ product }) => {
  const [isLoading, setIsLoading] = useState(false);
  const [isWishlisted, setIsWishlisted] = useState(false);
  const { addToCart } = useCart();
  const navigate = useNavigate();

  // Get primary image or first available image
  const primaryImage =
    product.images?.find((img) => img.isPrimary) || product.images?.[0];
  const imageUrl = primaryImage?.imageUrl || "/api/placeholder-image.jpg";

  // Generate random rating for demo (you can replace with actual rating from backend)
  const rating = (Math.random() * 2 + 3).toFixed(1); // Random rating between 3.0-5.0
  const reviewCount = Math.floor(Math.random() * 1000) + 10; // Random review count

  const handleAddToCart = async (e) => {
    e.stopPropagation(); // Prevent card click
    setIsLoading(true);

    try {
      const result = await addToCart(product.id, 1);
      if (result.success) {
        toast.success("Added to cart!");
      }
    } catch (error) {
      toast.error("Failed to add to cart");
    } finally {
      setIsLoading(false);
    }
  };

  const handleBuyNow = async (e) => {
    e.stopPropagation(); // Prevent card click
    setIsLoading(true);

    try {
      const result = await addToCart(product.id, 1);
      if (result.success) {
        navigate("/checkout");
      }
    } catch (error) {
      toast.error("Failed to proceed to checkout");
    } finally {
      setIsLoading(false);
    }
  };

  const handleCardClick = () => {
    // Navigate to product detail page (we'll create this later)
    navigate(`/products/${product.id}`);
  };

  const handleWishlist = (e) => {
    e.stopPropagation();
    setIsWishlisted(!isWishlisted);
    toast.success(isWishlisted ? "Removed from wishlist" : "Added to wishlist");
  };

  // formatPrice is now imported from utils

  const isOutOfStock = product.stockQuantity === 0;

  return (
    <div
      className="product-card group relative bg-white border border-gray-200 rounded-lg overflow-hidden hover:shadow-lg transition-all duration-300 cursor-pointer"
      onClick={handleCardClick}
    >
      {/* Wishlist Button */}
      <button
        onClick={handleWishlist}
        className="absolute top-2 right-2 z-10 p-2 bg-white/80 hover:bg-white rounded-full shadow-sm transition-colors"
      >
        <Heart
          className={`h-4 w-4 ${
            isWishlisted
              ? "fill-red-500 text-red-500"
              : "text-gray-400 hover:text-red-500"
          }`}
        />
      </button>

      {/* Out of Stock Badge */}
      {isOutOfStock && (
        <div className="absolute top-2 left-2 z-10 bg-red-500 text-white text-xs px-2 py-1 rounded">
          Out of Stock
        </div>
      )}

      {/* Product Image */}
      <div className="relative aspect-square overflow-hidden bg-gray-100">
        <img
          src={imageUrl}
          alt={product.name}
          className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-300"
          onError={(e) => {
            e.target.src = "https://via.placeholder.com/300x300?text=No+Image";
          }}
        />

        {/* Quick View Overlay */}
        <div className="absolute inset-0 bg-black/0 group-hover:bg-black/10 transition-colors duration-300" />
      </div>

      {/* Product Info */}
      <div className="p-4">
        {/* Brand */}
        {product.brand && (
          <p className="text-xs text-gray-500 uppercase tracking-wide mb-1">
            {product.brand}
          </p>
        )}

        {/* Product Name */}
        <h3 className="text-sm font-medium text-gray-900 line-clamp-2 mb-2 group-hover:text-primary-600 transition-colors">
          {product.name}
        </h3>

        {/* Rating */}
        <div className="flex items-center mb-2">
          <div className="flex items-center">
            {[...Array(5)].map((_, i) => (
              <Star
                key={i}
                className={`h-3 w-3 ${
                  i < Math.floor(rating)
                    ? "text-yellow-400 fill-current"
                    : "text-gray-300"
                }`}
              />
            ))}
          </div>
          <span className="text-xs text-gray-500 ml-1">
            {rating} ({reviewCount})
          </span>
        </div>

        {/* Price */}
        <div className="mb-3">
          <span className="text-lg font-bold text-gray-900">
            {formatPrice(product.price)}
          </span>
          {/* You can add original price and discount here */}
        </div>

        {/* Stock Status */}
        <div className="mb-3">
          {isOutOfStock ? (
            <span className="text-sm text-red-600 font-medium">
              Out of Stock
            </span>
          ) : product.stockQuantity <= 5 ? (
            <span className="text-sm text-orange-600 font-medium">
              Only {product.stockQuantity} left in stock
            </span>
          ) : (
            <span className="text-sm text-green-600 font-medium">In Stock</span>
          )}
        </div>

        {/* Action Buttons */}
        <div className="space-y-2">
          <button
            onClick={handleAddToCart}
            disabled={isLoading || isOutOfStock}
            className="w-full bg-zinc-400 hover:bg-zinc-500 text-gray-900 font-medium py-2 px-4 rounded-lg transition-colors duration-200 disabled:opacity-50 disabled:cursor-not-allowed flex items-center justify-center"
          >
            {isLoading ? (
              <div className="w-4 h-4 border-2 border-gray-600 border-t-transparent rounded-full animate-spin" />
            ) : (
              <>
                <ShoppingCart className="h-4 w-4 mr-2" />
                Add to Cart
              </>
            )}
          </button>

          <button
            onClick={handleBuyNow}
            disabled={isLoading || isOutOfStock}
            className="w-full bg-blue-500 hover:bg-blue-600 text-white font-medium py-2 px-4 rounded-lg transition-colors duration-200 disabled:opacity-50 disabled:cursor-not-allowed flex items-center justify-center"
          >
            {isLoading ? (
              <div className="w-4 h-4 border-2 border-white border-t-transparent rounded-full animate-spin" />
            ) : (
              <>
                <Zap className="h-4 w-4 mr-2" />
                Buy Now
              </>
            )}
          </button>
        </div>
      </div>
    </div>
  );
};

export default ProductCard;
