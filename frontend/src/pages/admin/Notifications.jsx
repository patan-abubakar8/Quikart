import { useState } from 'react';
import { useQuery } from '@tanstack/react-query';
import { 
  Bell, 
  AlertTriangle, 
  Package, 
  TrendingDown, 
  Edit,
  CheckCircle,
  XCircle
} from 'lucide-react';
import { useNavigate } from 'react-router-dom';
import { productService } from '../../services/productService';
import { formatPrice } from '../../utils/currency';
import LoadingSpinner from '../../components/common/LoadingSpinner';

const Notifications = () => {
  const [filter, setFilter] = useState('all'); // all, critical, warning
  const navigate = useNavigate();

  // Fetch products to check stock levels
  const { data: products, isLoading } = useQuery({
    queryKey: ['admin-products'],
    queryFn: () => productService.getAllProductsSimple()
  });

  const productsList = products?.data || [];

  // Generate notifications based on stock levels
  const generateNotifications = () => {
    const notifications = [];

    productsList.forEach(product => {
      if (product.stockQuantity === 0) {
        notifications.push({
          id: `out-of-stock-${product.id}`,
          type: 'critical',
          title: 'Out of Stock',
          message: `${product.name} is completely out of stock`,
          product: product,
          timestamp: new Date(),
          icon: XCircle,
          color: 'text-red-600 bg-red-100'
        });
      } else if (product.stockQuantity <= 5) {
        notifications.push({
          id: `critical-low-${product.id}`,
          type: 'critical',
          title: 'Critical Low Stock',
          message: `${product.name} has only ${product.stockQuantity} units left`,
          product: product,
          timestamp: new Date(),
          icon: AlertTriangle,
          color: 'text-red-600 bg-red-100'
        });
      } else if (product.stockQuantity <= 10) {
        notifications.push({
          id: `low-stock-${product.id}`,
          type: 'warning',
          title: 'Low Stock Warning',
          message: `${product.name} is running low with ${product.stockQuantity} units`,
          product: product,
          timestamp: new Date(),
          icon: TrendingDown,
          color: 'text-yellow-600 bg-yellow-100'
        });
      }
    });

    return notifications.sort((a, b) => {
      // Sort by severity: critical first, then warning
      if (a.type === 'critical' && b.type === 'warning') return -1;
      if (a.type === 'warning' && b.type === 'critical') return 1;
      return 0;
    });
  };

  const notifications = generateNotifications();

  // Filter notifications
  const filteredNotifications = notifications.filter(notification => {
    if (filter === 'all') return true;
    return notification.type === filter;
  });

  const criticalCount = notifications.filter(n => n.type === 'critical').length;
  const warningCount = notifications.filter(n => n.type === 'warning').length;

  const handleUpdateStock = (productId) => {
    navigate(`/admin/products/${productId}/edit`);
  };

  if (isLoading) {
    return (
      <div className="flex items-center justify-center h-64">
        <LoadingSpinner size="large" />
      </div>
    );
  }

  return (
    <div className="p-6">
      {/* Header */}
      <div className="mb-6">
        <h1 className="text-3xl font-bold text-gray-900 flex items-center">
          <Bell className="h-8 w-8 mr-3" />
          Notifications
        </h1>
        <p className="text-gray-600 mt-2">Stay updated on your inventory status</p>
      </div>

      {/* Summary Cards */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mb-6">
        <div className="bg-white rounded-lg shadow-sm border border-gray-200 p-6">
          <div className="flex items-center">
            <div className="bg-red-100 p-3 rounded-lg">
              <AlertTriangle className="h-6 w-6 text-red-600" />
            </div>
            <div className="ml-4">
              <p className="text-sm font-medium text-gray-600">Critical Alerts</p>
              <p className="text-2xl font-bold text-red-600">{criticalCount}</p>
            </div>
          </div>
        </div>

        <div className="bg-white rounded-lg shadow-sm border border-gray-200 p-6">
          <div className="flex items-center">
            <div className="bg-yellow-100 p-3 rounded-lg">
              <TrendingDown className="h-6 w-6 text-yellow-600" />
            </div>
            <div className="ml-4">
              <p className="text-sm font-medium text-gray-600">Warnings</p>
              <p className="text-2xl font-bold text-yellow-600">{warningCount}</p>
            </div>
          </div>
        </div>

        <div className="bg-white rounded-lg shadow-sm border border-gray-200 p-6">
          <div className="flex items-center">
            <div className="bg-green-100 p-3 rounded-lg">
              <CheckCircle className="h-6 w-6 text-green-600" />
            </div>
            <div className="ml-4">
              <p className="text-sm font-medium text-gray-600">Well Stocked</p>
              <p className="text-2xl font-bold text-green-600">
                {productsList.length - notifications.length}
              </p>
            </div>
          </div>
        </div>
      </div>

      {/* Filter Tabs */}
      <div className="bg-white rounded-lg shadow-sm border border-gray-200 mb-6">
        <div className="border-b border-gray-200">
          <nav className="-mb-px flex">
            <button
              onClick={() => setFilter('all')}
              className={`py-4 px-6 text-sm font-medium border-b-2 ${
                filter === 'all'
                  ? 'border-primary-500 text-primary-600'
                  : 'border-transparent text-gray-500 hover:text-gray-700 hover:border-gray-300'
              }`}
            >
              All Notifications ({notifications.length})
            </button>
            <button
              onClick={() => setFilter('critical')}
              className={`py-4 px-6 text-sm font-medium border-b-2 ${
                filter === 'critical'
                  ? 'border-red-500 text-red-600'
                  : 'border-transparent text-gray-500 hover:text-gray-700 hover:border-gray-300'
              }`}
            >
              Critical ({criticalCount})
            </button>
            <button
              onClick={() => setFilter('warning')}
              className={`py-4 px-6 text-sm font-medium border-b-2 ${
                filter === 'warning'
                  ? 'border-yellow-500 text-yellow-600'
                  : 'border-transparent text-gray-500 hover:text-gray-700 hover:border-gray-300'
              }`}
            >
              Warnings ({warningCount})
            </button>
          </nav>
        </div>

        {/* Notifications List */}
        <div className="p-6">
          {filteredNotifications.length === 0 ? (
            <div className="text-center py-8">
              <CheckCircle className="h-12 w-12 text-green-500 mx-auto mb-4" />
              <h3 className="text-lg font-medium text-gray-900 mb-2">
                {filter === 'all' ? 'No notifications' : `No ${filter} notifications`}
              </h3>
              <p className="text-gray-500">
                {filter === 'all' 
                  ? 'All your products are well stocked! 🎉'
                  : `No ${filter} stock alerts at the moment.`
                }
              </p>
            </div>
          ) : (
            <div className="space-y-4">
              {filteredNotifications.map((notification) => {
                const primaryImage = notification.product.images?.find(img => img.isPrimary) || 
                                   notification.product.images?.[0];
                
                return (
                  <div
                    key={notification.id}
                    className="flex items-start p-4 bg-gray-50 rounded-lg hover:bg-gray-100 transition-colors"
                  >
                    {/* Icon */}
                    <div className={`flex-shrink-0 p-2 rounded-lg ${notification.color}`}>
                      <notification.icon className="h-5 w-5" />
                    </div>

                    {/* Product Image */}
                    <div className="ml-4 flex-shrink-0">
                      {primaryImage ? (
                        <img
                          src={primaryImage.imageUrl}
                          alt={notification.product.name}
                          className="h-12 w-12 rounded-lg object-cover"
                          onError={(e) => {
                            e.target.src = 'https://via.placeholder.com/48x48?text=No+Image';
                          }}
                        />
                      ) : (
                        <div className="h-12 w-12 rounded-lg bg-gray-200 flex items-center justify-center">
                          <Package className="h-6 w-6 text-gray-400" />
                        </div>
                      )}
                    </div>

                    {/* Content */}
                    <div className="ml-4 flex-1">
                      <div className="flex items-start justify-between">
                        <div>
                          <h4 className="text-sm font-semibold text-gray-900">
                            {notification.title}
                          </h4>
                          <p className="text-sm text-gray-600 mt-1">
                            {notification.message}
                          </p>
                          <div className="mt-2 text-xs text-gray-500">
                            <span className="font-medium">{notification.product.name}</span>
                            {notification.product.brand && (
                              <span> • {notification.product.brand}</span>
                            )}
                            <span> • {formatPrice(notification.product.price)}</span>
                          </div>
                        </div>

                        {/* Action Button */}
                        <button
                          onClick={() => handleUpdateStock(notification.product.id)}
                          className="ml-4 flex items-center px-3 py-1 text-xs font-medium text-blue-600 bg-blue-100 rounded-full hover:bg-blue-200 transition-colors"
                        >
                          <Edit className="h-3 w-3 mr-1" />
                          Update Stock
                        </button>
                      </div>
                    </div>
                  </div>
                );
              })}
            </div>
          )}
        </div>
      </div>

      {/* Quick Actions */}
      {notifications.length > 0 && (
        <div className="bg-white rounded-lg shadow-sm border border-gray-200 p-6">
          <h3 className="text-lg font-semibold text-gray-900 mb-4">Quick Actions</h3>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <button
              onClick={() => navigate('/admin/products?filter=low-stock')}
              className="flex items-center justify-center px-4 py-3 bg-yellow-100 text-yellow-800 rounded-lg hover:bg-yellow-200 transition-colors"
            >
              <TrendingDown className="h-5 w-5 mr-2" />
              View All Low Stock Products
            </button>
            <button
              onClick={() => navigate('/admin/products/add')}
              className="flex items-center justify-center px-4 py-3 bg-blue-100 text-blue-800 rounded-lg hover:bg-blue-200 transition-colors"
            >
              <Package className="h-5 w-5 mr-2" />
              Add New Product
            </button>
          </div>
        </div>
      )}
    </div>
  );
};

export default Notifications;