import { useState } from 'react';
import { Plus, Minus, Trash2, Heart } from 'lucide-react';
import { useCart } from '../../context/CartContext';
import { formatPrice } from '../../utils/currency';
import toast from 'react-hot-toast';

const CartItem = ({ item, showQuantityControls = true, compact = false }) => {
  const [isUpdating, setIsUpdating] = useState(false);
  const { updateItemQuantity, removeFromCart } = useCart();

  const handleQuantityChange = async (newQuantity) => {
    if (newQuantity < 0) return;
    
    setIsUpdating(true);
    try {
      if (newQuantity === 0) {
        await removeFromCart(item.id);
      } else {
        await updateItemQuantity(item.id, item.product.id, newQuantity);
      }
    } catch (error) {
      toast.error('Failed to update quantity');
    } finally {
      setIsUpdating(false);
    }
  };

  const handleRemove = async () => {
    setIsUpdating(true);
    try {
      await removeFromCart(item.id);
    } catch (error) {
      toast.error('Failed to remove item');
    } finally {
      setIsUpdating(false);
    }
  };

  // formatPrice is now imported from utils

  // Get primary image or first available image
  const primaryImage = item.product?.images?.find(img => img.isPrimary) || item.product?.images?.[0];
  const imageUrl = primaryImage?.imageUrl || 'https://via.placeholder.com/150x150?text=No+Image';

  if (compact) {
    return (
      <div className="flex items-center space-x-3 py-2">
        <img
          src={imageUrl}
          alt={item.product?.name}
          className="w-12 h-12 object-cover rounded"
          onError={(e) => {
            e.target.src = 'https://via.placeholder.com/150x150?text=No+Image';
          }}
        />
        <div className="flex-1 min-w-0">
          <p className="text-sm font-medium text-gray-900 truncate">
            {item.product?.name}
          </p>
          <p className="text-sm text-gray-500">
            Qty: {item.quantity} × {formatPrice(item.product?.price)}
          </p>
        </div>
        <p className="text-sm font-medium text-gray-900">
          {formatPrice(item.totalPrice)}
        </p>
      </div>
    );
  }

  return (
    <div className="flex items-start space-x-4 py-6 border-b border-gray-200 last:border-b-0">
      {/* Product Image */}
      <div className="flex-shrink-0">
        <img
          src={imageUrl}
          alt={item.product?.name}
          className="w-24 h-24 object-cover rounded-lg"
          onError={(e) => {
            e.target.src = 'https://via.placeholder.com/150x150?text=No+Image';
          }}
        />
      </div>

      {/* Product Details */}
      <div className="flex-1 min-w-0">
        <div className="flex items-start justify-between">
          <div className="flex-1">
            <h3 className="text-lg font-medium text-gray-900 mb-1">
              {item.product?.name}
            </h3>
            
            {item.product?.brand && (
              <p className="text-sm text-gray-500 mb-2">
                Brand: {item.product.brand}
              </p>
            )}

            <div className="flex items-center space-x-4 mb-3">
              <span className="text-lg font-semibold text-gray-900">
                {formatPrice(item.product?.price)}
              </span>
              
              {item.product?.stockQuantity <= 5 && item.product?.stockQuantity > 0 && (
                <span className="text-sm text-orange-600 font-medium">
                  Only {item.product.stockQuantity} left
                </span>
              )}
            </div>

            {/* Quantity Controls */}
            {showQuantityControls && (
              <div className="flex items-center space-x-3">
                <div className="flex items-center border border-gray-300 rounded-lg">
                  <button
                    onClick={() => handleQuantityChange(item.quantity - 1)}
                    disabled={isUpdating || item.quantity <= 1}
                    className="p-2 hover:bg-gray-50 disabled:opacity-50 disabled:cursor-not-allowed"
                  >
                    <Minus className="h-4 w-4" />
                  </button>
                  
                  <span className="px-4 py-2 text-center min-w-[3rem] border-x border-gray-300">
                    {isUpdating ? '...' : item.quantity}
                  </span>
                  
                  <button
                    onClick={() => handleQuantityChange(item.quantity + 1)}
                    disabled={isUpdating || item.quantity >= (item.product?.stockQuantity || 99)}
                    className="p-2 hover:bg-gray-50 disabled:opacity-50 disabled:cursor-not-allowed"
                  >
                    <Plus className="h-4 w-4" />
                  </button>
                </div>

                <div className="flex items-center space-x-2">
                  <button
                    onClick={handleRemove}
                    disabled={isUpdating}
                    className="flex items-center text-red-600 hover:text-red-800 text-sm font-medium disabled:opacity-50"
                  >
                    <Trash2 className="h-4 w-4 mr-1" />
                    Remove
                  </button>
                  
                  <button className="flex items-center text-gray-600 hover:text-gray-800 text-sm font-medium">
                    <Heart className="h-4 w-4 mr-1" />
                    Save for later
                  </button>
                </div>
              </div>
            )}
          </div>

          {/* Item Total */}
          <div className="text-right ml-4">
            <p className="text-lg font-semibold text-gray-900">
              {formatPrice(item.totalPrice)}
            </p>
            {item.quantity > 1 && (
              <p className="text-sm text-gray-500">
                {item.quantity} × {formatPrice(item.product?.price)}
              </p>
            )}
          </div>
        </div>
      </div>
    </div>
  );
};

export default CartItem;