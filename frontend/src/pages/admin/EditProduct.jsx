import { useState, useEffect } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import { useForm } from 'react-hook-form';
import { useMutation, useQuery, useQueryClient } from '@tanstack/react-query';
import { 
  ArrowLeft, 
  Upload, 
  X, 
  Image as ImageIcon, 
  Star,
  Trash2,
  Eye
} from 'lucide-react';
import { productService } from '../../services/productService';
import { categoryService } from '../../services/categoryService';
import { adminService } from '../../services/adminService';
import LoadingSpinner from '../../components/common/LoadingSpinner';
import toast from 'react-hot-toast';

const EditProduct = () => {
  const { productId } = useParams();
  const navigate = useNavigate();
  const queryClient = useQueryClient();
  const [selectedImages, setSelectedImages] = useState([]);
  const [imagePreview, setImagePreview] = useState([]);

  const {
    register,
    handleSubmit,
    formState: { errors },
    reset,
    setValue
  } = useForm();

  // Fetch product details
  const { data: product, isLoading: productLoading } = useQuery({
    queryKey: ['admin-product', productId],
    queryFn: () => productService.getProductById(productId),
    enabled: !!productId
  });

  // Fetch categories
  const { data: categories, isLoading: categoriesLoading } = useQuery({
    queryKey: ['categories'],
    queryFn: () => categoryService.getAllCategories()
  });

  // Update product mutation
  const updateProductMutation = useMutation({
    mutationFn: async ({ productId, productData }) => {
      // First update the product
      const productResponse = await adminService.updateProduct(productId, productData);
      
      // Then upload new images if any
      if (selectedImages.length > 0) {
        try {
          await adminService.uploadMultipleProductImages(productId, selectedImages);
        } catch (error) {
          console.error('Failed to upload images:', error);
          throw new Error('Product updated but failed to upload some images');
        }
      }
      
      return productResponse;
    },
    onSuccess: () => {
      // Clear the selected images and previews
      setSelectedImages([]);
      setImagePreview([]);
      
      // Invalidate all related queries to refresh data
      queryClient.invalidateQueries(['admin-products']);
      queryClient.invalidateQueries(['admin-product', productId]);
      queryClient.invalidateQueries(['products']); // Also invalidate general products cache
      
      toast.success('Product and images updated successfully!');
      navigate(`/admin/products/${productId}`);
    },
    onError: (error) => {
      toast.error(error.message || error.response?.data?.message || 'Failed to update product');
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

  // Separate image upload mutation for testing
  const uploadImagesMutation = useMutation({
    mutationFn: ({ productId, files }) => adminService.uploadMultipleProductImages(productId, files),
    onSuccess: (response) => {
      console.log('Images uploaded successfully:', response);
      setSelectedImages([]);
      setImagePreview([]);
      queryClient.invalidateQueries(['admin-product', productId]);
      queryClient.invalidateQueries(['admin-products']);
      toast.success(`${response.data?.length || 0} images uploaded successfully!`);
    },
    onError: (error) => {
      console.error('Image upload failed:', error);
      toast.error(error.response?.data?.message || 'Failed to upload images');
    }
  });

  const productData = product?.data;
  const categoriesList = categories?.data || [];

  // Populate form when product data is loaded
  useEffect(() => {
    if (productData) {
      reset({
        name: productData.name || '',
        brand: productData.brand || '',
        model: productData.model || '',
        sku: productData.sku || '',
        categoryId: productData.category?.id || '',
        description: productData.description || '',
        specifications: productData.specifications || '',
        price: productData.price || '',
        stockQuantity: productData.stockQuantity || '',
        weight: productData.weight || '',
        dimensions: productData.dimensions || '',
        isActive: productData.isActive !== false
      });
    }
  }, [productData, reset]);

  const onSubmit = async (data) => {
    console.log('Form submitted with data:', data);
    console.log('Selected images to upload:', selectedImages);
    
    const productUpdateData = {
      ...data,
      price: parseFloat(data.price),
      stockQuantity: parseInt(data.stockQuantity),
      weight: data.weight ? parseFloat(data.weight) : null,
      category: { id: parseInt(data.categoryId) }
    };

    console.log('Product update data:', productUpdateData);
    updateProductMutation.mutate({ productId, productData: productUpdateData });
  };

  const handleImageSelect = (e) => {
    const files = Array.from(e.target.files);
    console.log('Selected files:', files);
    
    // Validate file types and sizes
    const validFiles = files.filter(file => {
      if (!file.type.startsWith('image/')) {
        toast.error(`${file.name} is not an image file`);
        return false;
      }
      if (file.size > 5 * 1024 * 1024) { // 5MB limit
        toast.error(`${file.name} is too large (max 5MB)`);
        return false;
      }
      return true;
    });

    const currentImageCount = productData?.images?.length || 0;
    if (validFiles.length + selectedImages.length + currentImageCount > 5) {
      toast.error('Maximum 5 images allowed per product');
      return;
    }

    console.log('Valid files to add:', validFiles);
    setSelectedImages(prev => {
      const newImages = [...prev, ...validFiles];
      console.log('Updated selected images:', newImages);
      return newImages;
    });

    // Create preview URLs
    validFiles.forEach(file => {
      const reader = new FileReader();
      reader.onload = (e) => {
        setImagePreview(prev => [...prev, {
          file,
          url: e.target.result,
          name: file.name
        }]);
      };
      reader.readAsDataURL(file);
    });
    
    // Clear the input value so the same file can be selected again if needed
    e.target.value = '';
  };

  const removeNewImage = (index) => {
    setSelectedImages(prev => prev.filter((_, i) => i !== index));
    setImagePreview(prev => prev.filter((_, i) => i !== index));
  };

  const handleDeleteExistingImage = (imageId) => {
    if (window.confirm('Are you sure you want to delete this image?')) {
      deleteImageMutation.mutate(imageId);
    }
  };

  const handleSetPrimaryImage = (imageId) => {
    setPrimaryImageMutation.mutate({ productId, imageId });
  };

  // Test function to upload images separately
  const handleTestImageUpload = async () => {
    if (selectedImages.length === 0) {
      toast.error('No images selected');
      return;
    }

    uploadImagesMutation.mutate({ productId, files: selectedImages });
  };

  if (productLoading || categoriesLoading) {
    return (
      <div className="flex items-center justify-center h-64">
        <LoadingSpinner size="large" />
      </div>
    );
  }

  if (!productData) {
    return (
      <div className="p-6">
        <div className="text-center">
          <h2 className="text-xl font-medium text-gray-900 mb-2">Product Not Found</h2>
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

  const existingImages = productData.images || [];

  return (
    <div className="p-6">
      {/* Header */}
      <div className="flex items-center justify-between mb-6">
        <div className="flex items-center">
          <button
            onClick={() => navigate(`/admin/products/${productId}`)}
            className="flex items-center text-gray-600 hover:text-gray-900 mr-4"
          >
            <ArrowLeft className="h-5 w-5 mr-2" />
            Back to Product
          </button>
          <h1 className="text-3xl font-bold text-gray-900">Edit Product</h1>
        </div>
        
        <button
          onClick={() => navigate(`/admin/products/${productId}`)}
          className="btn-secondary flex items-center"
        >
          <Eye className="h-4 w-4 mr-2" />
          View Product
        </button>
      </div>

      <form onSubmit={handleSubmit(onSubmit)} className="max-w-6xl">
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
          {/* Main Form */}
          <div className="lg:col-span-2 space-y-6">
            {/* Basic Information */}
            <div className="bg-white rounded-lg shadow-sm border border-gray-200 p-6">
              <h2 className="text-lg font-semibold text-gray-900 mb-4">Basic Information</h2>
              
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <div className="md:col-span-2">
                  <label className="block text-sm font-medium text-gray-700 mb-2">
                    Product Name *
                  </label>
                  <input
                    {...register('name', { required: 'Product name is required' })}
                    className="input-field"
                    placeholder="Enter product name"
                  />
                  {errors.name && (
                    <p className="mt-1 text-sm text-red-600">{errors.name.message}</p>
                  )}
                </div>

                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">
                    Brand
                  </label>
                  <input
                    {...register('brand')}
                    className="input-field"
                    placeholder="Enter brand name"
                  />
                </div>

                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">
                    Model
                  </label>
                  <input
                    {...register('model')}
                    className="input-field"
                    placeholder="Enter model"
                  />
                </div>

                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">
                    SKU
                  </label>
                  <input
                    {...register('sku')}
                    className="input-field"
                    placeholder="Enter SKU"
                  />
                </div>

                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">
                    Category *
                  </label>
                  <select
                    {...register('categoryId', { required: 'Category is required' })}
                    className="input-field"
                  >
                    <option value="">Select Category</option>
                    {categoriesList.map(category => (
                      <option key={category.id} value={category.id}>
                        {category.name}
                      </option>
                    ))}
                  </select>
                  {errors.categoryId && (
                    <p className="mt-1 text-sm text-red-600">{errors.categoryId.message}</p>
                  )}
                </div>

                <div className="md:col-span-2">
                  <label className="block text-sm font-medium text-gray-700 mb-2">
                    Description
                  </label>
                  <textarea
                    {...register('description')}
                    rows={4}
                    className="input-field"
                    placeholder="Enter product description"
                  />
                </div>

                <div className="md:col-span-2">
                  <label className="block text-sm font-medium text-gray-700 mb-2">
                    Specifications
                  </label>
                  <textarea
                    {...register('specifications')}
                    rows={3}
                    className="input-field"
                    placeholder="Enter product specifications"
                  />
                </div>
              </div>
            </div>

            {/* Pricing and Inventory */}
            <div className="bg-white rounded-lg shadow-sm border border-gray-200 p-6">
              <h2 className="text-lg font-semibold text-gray-900 mb-4">Pricing & Inventory</h2>
              
              <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">
                    Price (₹) *
                  </label>
                  <input
                    {...register('price', { 
                      required: 'Price is required',
                      min: { value: 0, message: 'Price must be positive' }
                    })}
                    type="number"
                    step="0.01"
                    className="input-field"
                    placeholder="0.00"
                  />
                  {errors.price && (
                    <p className="mt-1 text-sm text-red-600">{errors.price.message}</p>
                  )}
                </div>

                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">
                    Stock Quantity *
                  </label>
                  <input
                    {...register('stockQuantity', { 
                      required: 'Stock quantity is required',
                      min: { value: 0, message: 'Stock must be non-negative' }
                    })}
                    type="number"
                    className="input-field"
                    placeholder="0"
                  />
                  {errors.stockQuantity && (
                    <p className="mt-1 text-sm text-red-600">{errors.stockQuantity.message}</p>
                  )}
                </div>

                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">
                    Weight (kg)
                  </label>
                  <input
                    {...register('weight')}
                    type="number"
                    step="0.01"
                    className="input-field"
                    placeholder="0.00"
                  />
                </div>

                <div className="md:col-span-2">
                  <label className="block text-sm font-medium text-gray-700 mb-2">
                    Dimensions
                  </label>
                  <input
                    {...register('dimensions')}
                    className="input-field"
                    placeholder="L x W x H (e.g., 10 x 5 x 3 cm)"
                  />
                </div>

                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">
                    Status
                  </label>
                  <div className="flex items-center">
                    <input
                      {...register('isActive')}
                      type="checkbox"
                      className="h-4 w-4 text-primary-600 focus:ring-primary-500 border-gray-300 rounded"
                    />
                    <label className="ml-2 block text-sm text-gray-900">
                      Product is active
                    </label>
                  </div>
                </div>
              </div>
            </div>
          </div>

          {/* Image Management */}
          <div className="lg:col-span-1 space-y-6">
            {/* Existing Images */}
            {existingImages.length > 0 && (
              <div className="bg-white rounded-lg shadow-sm border border-gray-200 p-6">
                <h2 className="text-lg font-semibold text-gray-900 mb-4">Current Images</h2>
                <div className="space-y-3">
                  {existingImages.map((image) => (
                    <div key={image.id} className="relative group">
                      <div className="flex items-center p-2 bg-gray-50 rounded-lg">
                        <img
                          src={image.imageUrl}
                          alt={image.originalFileName}
                          className="h-16 w-16 object-cover rounded"
                        />
                        <div className="ml-3 flex-1 min-w-0">
                          <p className="text-sm font-medium text-gray-900 truncate">
                            {image.originalFileName}
                          </p>
                          <div className="flex items-center mt-1">
                            {image.isPrimary && (
                              <span className="inline-flex items-center px-2 py-1 rounded-full text-xs font-medium bg-primary-100 text-primary-800 mr-2">
                                <Star className="h-3 w-3 mr-1" />
                                Primary
                              </span>
                            )}
                            <span className="text-xs text-gray-500">
                              {(image.fileSize / 1024 / 1024).toFixed(2)} MB
                            </span>
                          </div>
                        </div>
                        <div className="flex flex-col space-y-1">
                          {!image.isPrimary && (
                            <button
                              type="button"
                              onClick={() => handleSetPrimaryImage(image.id)}
                              className="text-xs text-blue-600 hover:text-blue-800"
                            >
                              Set Primary
                            </button>
                          )}
                          <button
                            type="button"
                            onClick={() => handleDeleteExistingImage(image.id)}
                            className="text-xs text-red-600 hover:text-red-800"
                          >
                            Delete
                          </button>
                        </div>
                      </div>
                    </div>
                  ))}
                </div>
              </div>
            )}

            {/* Upload New Images */}
            <div className="bg-white rounded-lg shadow-sm border border-gray-200 p-6">
              <h2 className="text-lg font-semibold text-gray-900 mb-4">Add New Images</h2>
              
              {/* Upload Area */}
              <div className="mb-4">
                <label className="block">
                  <div className="border-2 border-dashed border-gray-300 rounded-lg p-6 text-center hover:border-gray-400 transition-colors cursor-pointer">
                    <Upload className="h-8 w-8 text-gray-400 mx-auto mb-2" />
                    <p className="text-sm text-gray-600 mb-1">Click to upload images</p>
                    <p className="text-xs text-gray-500">PNG, JPG, GIF up to 5MB</p>
                  </div>
                  <input
                    type="file"
                    multiple
                    accept="image/*"
                    onChange={handleImageSelect}
                    className="hidden"
                  />
                </label>
              </div>

              {/* New Image Previews */}
              {imagePreview.length > 0 && (
                <div className="space-y-3">
                  <div className="flex items-center justify-between">
                    <h3 className="text-sm font-medium text-gray-700">New Images to Upload</h3>
                    <button
                      type="button"
                      onClick={handleTestImageUpload}
                      className="text-xs bg-blue-100 text-blue-800 px-2 py-1 rounded hover:bg-blue-200"
                    >
                      Test Upload
                    </button>
                  </div>
                  {imagePreview.map((preview, index) => (
                    <div key={index} className="relative">
                      <div className="flex items-center p-2 bg-blue-50 rounded-lg">
                        <img
                          src={preview.url}
                          alt={preview.name}
                          className="h-12 w-12 object-cover rounded"
                        />
                        <div className="ml-3 flex-1 min-w-0">
                          <p className="text-sm font-medium text-gray-900 truncate">
                            {preview.name}
                          </p>
                          <p className="text-xs text-blue-600">New image</p>
                        </div>
                        <button
                          type="button"
                          onClick={() => removeNewImage(index)}
                          className="ml-2 text-red-500 hover:text-red-700"
                        >
                          <X className="h-4 w-4" />
                        </button>
                      </div>
                    </div>
                  ))}
                </div>
              )}

              {imagePreview.length === 0 && existingImages.length === 0 && (
                <div className="text-center py-8">
                  <ImageIcon className="h-12 w-12 text-gray-300 mx-auto mb-2" />
                  <p className="text-sm text-gray-500">No images selected</p>
                </div>
              )}
            </div>

            {/* Submit Button */}
            <div>
              <button
                type="submit"
                disabled={updateProductMutation.isLoading}
                className="w-full btn-primary flex items-center justify-center"
              >
                {updateProductMutation.isLoading ? (
                  <>
                    <LoadingSpinner size="small" />
                    <span className="ml-2">Updating Product...</span>
                  </>
                ) : (
                  'Update Product'
                )}
              </button>
            </div>
          </div>
        </div>
      </form>
    </div>
  );
};

export default EditProduct;