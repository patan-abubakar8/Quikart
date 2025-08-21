import { useState } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query';
import { 
  ArrowLeft, 
  Edit, 
  Trash2, 
  Package, 
  Tag, 
  DollarSign,
  Calendar,
  Eye,
  EyeOff,
  Star,
  AlertTriangle,
  CheckCircle,
  Image as ImageIcon,
  Upload,
  X
} from 'lucide-react';
import { productService } from '../../services/productService';
import { adminService } from '../../services/adminService';
import { formatPrice } from '../../utils/currency';
import LoadingSpinner from '../../components/common/LoadingSpinner';
import toast from 'react-hot-toast';

const ProductView = () => {
  const { productId } = useParams();
  const navigate = useNavigate();
  const queryClient = useQueryClient();
  const [selectedImageIndex, setSelectedImageIndex] = useState(0);
  const [isImageModalOpen, setIsImageModalOpen] = useState(false);

  // Fetch product details
  const { data: product, isLoading, error } = useQuery({
    queryKey: ['admin-product', productId],
    queryFn: () => productService.getProductById(productId),
    enabled: !!productId,
    refetchOnWindowFocus: true, // Refetch when window gains focus
    staleTime: 0 // Always consider data stale to ensure fresh data
  });

  // Delete product mutation
  const deleteProductMutation = useMutation({
    mutationFn: adminService.deleteProduct,
    onSuccess: () => {
      queryClient.invalidateQueries(['admin-products']);
      toast.success('Product deleted successfully');
      navigate('/admin/products');
    },
    onError: (error) => {
      toast.error(error.response?.data?.message || 'Failed to delete product');
    }
  });

  // Delete image mutation
  const deleteImageMutation = useMutation({
    mutationFn: adminService.deleteProductImage,
    onSuccess: () => {
      queryClient.invalidateQueries(['admin-product', productId]);
      toast.success('Image deleted successfully');
    },
    onError: (error) => {
      toast.error(error.response?.data?.message || 'Failed to delete image');
    }
  });

  // Set primary image mutation
  const setPrimaryImageMutation = useMutation({
    mutationFn: ({ productId, imageId }) => adminService.setPrimaryImage(productId, imageId),
    onSuccess: () => {
      queryClient.invalidateQueries(['admin-product', productId]);
      toast.success('Primary image updated');
    },
    onError: (error) => {
      toast.error(error.response?.data?.message || 'Failed to set primary image');
    }
  });

  const productData = product?.data;

  const handleDeleteProduct = () => {
    if (window.confirm(`Are you sure you want to delete "${productData.name}"? This action cannot be undone.`)) {
      deleteProductMutation.mutate(productId);
    }
  };

  const handleDeleteImage = (imageId) => {
    if (window.confirm('Are you sure you want to delete this image?')) {
      deleteImageMutation.mutate(imageId);
    }
  };

  const handleSetPrimaryImage = (imageId) => {
    setPrimaryImageMutation.mutate({ productId, imageId });
  };

  const getStockStatus = (quantity) => {
    if (quantity === 0) {
      return { 
        text: 'Out of Stock', 
        color: 'text-red-600 bg-red-100',
        icon: AlertTriangle
      };
    } else if (quantity <= 10) {
      return { 
        text: 'Low Stock', 
        color: 'text-yellow-600 bg-yellow-100',
        icon: AlertTriangle
      };
    } else {
      return { 
        text: 'In Stock', 
        color: 'text-green-600 bg-green-100',
        icon: CheckCircle
      };
    }
  };

  if (isLoading) {
    return (
      <div className="flex items-center justify-center h-64">
        <LoadingSpinner size="large" />
      </div>
    );
  }

  if (error || !productData) {
    return (
      <div className="p-6">
        <div className="text-center">
          <Package className="h-16 w-16 text-gray-300 mx-auto mb-4" />
          <h2 className="text-xl font-medium text-gray-900 mb-2">Product Not Found</h2>
          <p className="text-gray-500 mb-4">The product you're looking for doesn't exist.</p>
          <button
            onClick={() => navigate('/admin/products')}
            className="btn-primary"
          >
            Back to Products
          </button>
        </div>
      </div>
    );
  }

  const stockStatus = getStockStatus(productData.stockQuantity);
  const images = productData.images || [];
  const primaryImage = images.find(img => img.isPrimary) || images[0];

  return (
    <div className="p-6">
      {/* Header */}
      <div className="flex items-center justify-between mb-6">
        <div className="flex items-center">
          <button
            onClick={() => navigate('/admin/products')}
            className="flex items-center text-gray-600 hover:text-gray-900 mr-4"
          >
            <ArrowLeft className="h-5 w-5 mr-2" />
            Back to Products
          </button>
          <h1 className="text-3xl font-bold text-gray-900">Product Details</h1>
        </div>
        
        <div className="flex items-center space-x-3">
          <button
            onClick={() => {
              queryClient.invalidateQueries(['admin-product', productId]);
              toast.success('Refreshed product data');
            }}
            className="btn-outline flex items-center"
          >
            <Eye className="h-4 w-4 mr-2" />
            Refresh
          </button>
          <button
            onClick={() => navigate(`/admin/products/${productId}/edit`)}
            className="btn-secondary flex items-center"
          >
            <Edit className="h-4 w-4 mr-2" />
            Edit Product
          </button>
          <button
            onClick={handleDeleteProduct}
            disabled={deleteProductMutation.isLoading}
            className="bg-red-600 hover:bg-red-700 text-white font-medium py-2 px-4 rounded-lg transition-colors flex items-center"
          >
            <Trash2 className="h-4 w-4 mr-2" />
            Delete
          </button>
        </div>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
        {/* Product Images */}
        <div className="space-y-4">
          {/* Main Image */}
          <div className="aspect-square bg-gray-100 rounded-lg overflow-hidden">
            {primaryImage ? (
              <img
                src={primaryImage.imageUrl}
                alt={productData.name}
                className="w-full h-full object-cover cursor-pointer"
                onClick={() => setIsImageModalOpen(true)}
              />
            ) : (
              <div className="w-full h-full flex items-center justify-center">
                <ImageIcon className="h-24 w-24 text-gray-300" />
              </div>
            )}
          </div>

          {/* Image Thumbnails */}
          {images.length > 1 && (
            <div className="grid grid-cols-4 gap-2">
              {images.map((image, index) => (
                <div
                  key={image.id}
                  className={`aspect-square bg-gray-100 rounded-lg overflow-hidden cursor-pointer border-2 ${
                    image.isPrimary ? 'border-primary-500' : 'border-transparent'
                  }`}
                  onClick={() => setSelectedImageIndex(index)}
                >
                  <img
                    src={image.imageUrl}
                    alt={`${productData.name} ${index + 1}`}
                    className="w-full h-full object-cover"
                  />
                </div>
              ))}
            </div>
          )}

          {/* Image Management */}
          {images.length > 0 && (
            <div className="bg-white rounded-lg border border-gray-200 p-4">
              <h3 className="text-lg font-medium text-gray-900 mb-3">Image Management</h3>
              <div className="space-y-2">
                {images.map((image) => (
                  <div key={image.id} className="flex items-center justify-between p-2 bg-gray-50 rounded">
                    <div className="flex items-center space-x-3">
                      <img
                        src={image.imageUrl}
                        alt={image.originalFileName}
                        className="w-12 h-12 object-cover rounded"
                      />
                      <div>
                        <p className="text-sm font-medium text-gray-900">
                          {image.originalFileName}
                        </p>
                        <p className="text-xs text-gray-500">
                          {image.isPrimary && <span className="text-primary-600 font-medium">Primary • </span>}
                          {(image.fileSize / 1024 / 1024).toFixed(2)} MB
                        </p>
                      </div>
                    </div>
                    <div className="flex items-center space-x-2">
                      {!image.isPrimary && (
                        <button
                          onClick={() => handleSetPrimaryImage(image.id)}
                          className="text-xs text-blue-600 hover:text-blue-800"
                        >
                          Set Primary
                        </button>
                      )}
                      <button
                        onClick={() => handleDeleteImage(image.id)}
                        className="text-xs text-red-600 hover:text-red-800"
                      >
                        Delete
                      </button>
                    </div>
                  </div>
                ))}
              </div>
            </div>
          )}
        </div>

        {/* Product Information */}
        <div className="space-y-6">
          {/* Basic Info */}
          <div className="bg-white rounded-lg border border-gray-200 p-6">
            <div className="flex items-start justify-between mb-4">
              <div>
                <h2 className="text-2xl font-bold text-gray-900 mb-2">{productData.name}</h2>
                {productData.brand && (
                  <p className="text-lg text-gray-600">{productData.brand}</p>
                )}
              </div>
              <div className={`inline-flex items-center px-3 py-1 rounded-full text-sm font-medium ${stockStatus.color}`}>
                <stockStatus.icon className="h-4 w-4 mr-1" />
                {stockStatus.text}
              </div>
            </div>

            {productData.description && (
              <div className="mb-4">
                <h3 className="text-sm font-medium text-gray-700 mb-2">Description</h3>
                <p className="text-gray-600">{productData.description}</p>
              </div>
            )}

            <div className="grid grid-cols-2 gap-4">
              <div>
                <h3 className="text-sm font-medium text-gray-700 mb-1">Price</h3>
                <p className="text-2xl font-bold text-primary-600">{formatPrice(productData.price)}</p>
              </div>
              <div>
                <h3 className="text-sm font-medium text-gray-700 mb-1">Stock Quantity</h3>
                <p className="text-2xl font-bold text-gray-900">{productData.stockQuantity}</p>
              </div>
            </div>
          </div>

          {/* Additional Details */}
          <div className="bg-white rounded-lg border border-gray-200 p-6">
            <h3 className="text-lg font-medium text-gray-900 mb-4">Product Details</h3>
            <div className="grid grid-cols-1 gap-4">
              {productData.category && (
                <div>
                  <h4 className="text-sm font-medium text-gray-700">Category</h4>
                  <p className="text-gray-900">{productData.category.name}</p>
                </div>
              )}
              
              {productData.model && (
                <div>
                  <h4 className="text-sm font-medium text-gray-700">Model</h4>
                  <p className="text-gray-900">{productData.model}</p>
                </div>
              )}
              
              {productData.sku && (
                <div>
                  <h4 className="text-sm font-medium text-gray-700">SKU</h4>
                  <p className="text-gray-900">{productData.sku}</p>
                </div>
              )}
              
              {productData.weight && (
                <div>
                  <h4 className="text-sm font-medium text-gray-700">Weight</h4>
                  <p className="text-gray-900">{productData.weight} kg</p>
                </div>
              )}
              
              {productData.dimensions && (
                <div>
                  <h4 className="text-sm font-medium text-gray-700">Dimensions</h4>
                  <p className="text-gray-900">{productData.dimensions}</p>
                </div>
              )}
              
              <div>
                <h4 className="text-sm font-medium text-gray-700">Status</h4>
                <p className="text-gray-900">{productData.isActive ? 'Active' : 'Inactive'}</p>
              </div>
              
              {productData.createdAt && (
                <div>
                  <h4 className="text-sm font-medium text-gray-700">Created</h4>
                  <p className="text-gray-900">
                    {new Date(productData.createdAt).toLocaleDateString('en-IN')}
                  </p>
                </div>
              )}
              
              {productData.updatedAt && (
                <div>
                  <h4 className="text-sm font-medium text-gray-700">Last Updated</h4>
                  <p className="text-gray-900">
                    {new Date(productData.updatedAt).toLocaleDateString('en-IN')}
                  </p>
                </div>
              )}
            </div>
          </div>

          {/* Specifications */}
          {productData.specifications && (
            <div className="bg-white rounded-lg border border-gray-200 p-6">
              <h3 className="text-lg font-medium text-gray-900 mb-4">Specifications</h3>
              <div className="prose prose-sm max-w-none">
                <p className="text-gray-600 whitespace-pre-wrap">{productData.specifications}</p>
              </div>
            </div>
          )}
        </div>
      </div>

      {/* Image Modal */}
      {isImageModalOpen && primaryImage && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-black bg-opacity-75">
          <div className="relative max-w-4xl max-h-full p-4">
            <button
              onClick={() => setIsImageModalOpen(false)}
              className="absolute top-4 right-4 text-white hover:text-gray-300 z-10"
            >
              <X className="h-8 w-8" />
            </button>
            <img
              src={primaryImage.imageUrl}
              alt={productData.name}
              className="max-w-full max-h-full object-contain"
            />
          </div>
        </div>
      )}
    </div>
  );
};

export default ProductView;