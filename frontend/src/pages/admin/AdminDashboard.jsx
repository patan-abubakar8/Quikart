import { useState, useEffect } from 'react';
import { useQuery } from '@tanstack/react-query';
import { 
  Package, 
  Users, 
  ShoppingCart, 
  TrendingUp, 
  AlertTriangle,
  Plus,
  Eye,
  Edit
} from 'lucide-react';
import { useNavigate } from 'react-router-dom';
import { productService } from '../../services/productService';
import { categoryService } from '../../services/categoryService';
import { formatPrice } from '../../utils/currency';
import LoadingSpinner from '../../components/common/LoadingSpinner';

const AdminDashboard = () => {
  const navigate = useNavigate();

  // Fetch dashboard data
  const { data: products, isLoading: productsLoading } = useQuery({
    queryKey: ['admin-products'],
    queryFn: () => productService.getAllProductsSimple()
  });

  const { data: categories, isLoading: categoriesLoading } = useQuery({
    queryKey: ['admin-categories'],
    queryFn: () => categoryService.getAllCategories()
  });

  const productsList = products?.data || [];
  const categoriesList = categories?.data || [];

  // Calculate stats
  const totalProducts = productsList.length;
  const totalCategories = categoriesList.length;
  const lowStockProducts = productsList.filter(product => product.stockQuantity <= 10);
  const outOfStockProducts = productsList.filter(product => product.stockQuantity === 0);
  const totalValue = productsList.reduce((sum, product) => sum + (product.price * product.stockQuantity), 0);

  const stats = [
    {
      name: 'Total Products',
      value: totalProducts,
      icon: Package,
      color: 'bg-blue-500',
      change: '+12%',
      changeType: 'positive'
    },
    {
      name: 'Categories',
      value: totalCategories,
      icon: TrendingUp,
      color: 'bg-green-500',
      change: '+5%',
      changeType: 'positive'
    },
    {
      name: 'Low Stock Alert',
      value: lowStockProducts.length,
      icon: AlertTriangle,
      color: 'bg-yellow-500',
      change: lowStockProducts.length > 0 ? 'Action needed' : 'All good',
      changeType: lowStockProducts.length > 0 ? 'negative' : 'positive'
    },
    {
      name: 'Inventory Value',
      value: formatPrice(totalValue),
      icon: ShoppingCart,
      color: 'bg-purple-500',
      change: '+8%',
      changeType: 'positive'
    }
  ];

  const quickActions = [
    {
      name: 'Add Product',
      description: 'Add a new product to your inventory',
      icon: Package,
      color: 'bg-blue-500',
      action: () => navigate('/admin/products/add')
    },
    {
      name: 'Add Category',
      description: 'Create a new product category',
      icon: Plus,
      color: 'bg-green-500',
      action: () => navigate('/admin/categories/add')
    },
    {
      name: 'View Products',
      description: 'Manage your product inventory',
      icon: Eye,
      color: 'bg-purple-500',
      action: () => navigate('/admin/products')
    },
    {
      name: 'Manage Orders',
      description: 'View and manage customer orders',
      icon: ShoppingCart,
      color: 'bg-orange-500',
      action: () => navigate('/admin/orders')
    }
  ];

  if (productsLoading || categoriesLoading) {
    return (
      <div className="flex items-center justify-center h-64">
        <LoadingSpinner size="large" />
      </div>
    );
  }

  return (
    <div className="p-6">
      {/* Header */}
      <div className="mb-8">
        <h1 className="text-3xl font-bold text-gray-900">Admin Dashboard</h1>
        <p className="text-gray-600 mt-2">Welcome back! Here's what's happening with your store.</p>
      </div>

      {/* Stats Grid */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6 mb-8">
        {stats.map((stat) => (
          <div key={stat.name} className="bg-white rounded-lg shadow-sm border border-gray-200 p-6">
            <div className="flex items-center">
              <div className={`${stat.color} p-3 rounded-lg`}>
                <stat.icon className="h-6 w-6 text-white" />
              </div>
              <div className="ml-4">
                <p className="text-sm font-medium text-gray-600">{stat.name}</p>
                <p className="text-2xl font-bold text-gray-900">{stat.value}</p>
              </div>
            </div>
            <div className="mt-4">
              <span className={`text-sm font-medium ${
                stat.changeType === 'positive' ? 'text-green-600' : 'text-red-600'
              }`}>
                {stat.change}
              </span>
              <span className="text-sm text-gray-500 ml-2">from last month</span>
            </div>
          </div>
        ))}
      </div>

      {/* Quick Actions */}
      <div className="mb-8">
        <h2 className="text-xl font-bold text-gray-900 mb-4">Quick Actions</h2>
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
          {quickActions.map((action) => (
            <button
              key={action.name}
              onClick={action.action}
              className="bg-white rounded-lg shadow-sm border border-gray-200 p-6 text-left hover:shadow-md transition-shadow"
            >
              <div className={`${action.color} p-3 rounded-lg w-fit mb-4`}>
                <action.icon className="h-6 w-6 text-white" />
              </div>
              <h3 className="text-lg font-semibold text-gray-900 mb-2">{action.name}</h3>
              <p className="text-sm text-gray-600">{action.description}</p>
            </button>
          ))}
        </div>
      </div>

      {/* Alerts and Recent Activity */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        {/* Low Stock Alert */}
        <div className="bg-white rounded-lg shadow-sm border border-gray-200 p-6">
          <div className="flex items-center justify-between mb-4">
            <h3 className="text-lg font-semibold text-gray-900">Low Stock Alert</h3>
            <AlertTriangle className="h-5 w-5 text-yellow-500" />
          </div>
          
          {lowStockProducts.length === 0 ? (
            <p className="text-gray-500">All products are well stocked! 🎉</p>
          ) : (
            <div className="space-y-3">
              {lowStockProducts.slice(0, 5).map((product) => (
                <div key={product.id} className="flex items-center justify-between p-3 bg-yellow-50 rounded-lg">
                  <div>
                    <p className="font-medium text-gray-900">{product.name}</p>
                    <p className="text-sm text-gray-600">
                      Stock: {product.stockQuantity} units
                    </p>
                  </div>
                  <button
                    onClick={() => navigate(`/admin/products/${product.id}/edit`)}
                    className="text-yellow-600 hover:text-yellow-800"
                  >
                    <Edit className="h-4 w-4" />
                  </button>
                </div>
              ))}
              {lowStockProducts.length > 5 && (
                <button
                  onClick={() => navigate('/admin/products?filter=low-stock')}
                  className="text-sm text-blue-600 hover:text-blue-800 font-medium"
                >
                  View all {lowStockProducts.length} low stock products →
                </button>
              )}
            </div>
          )}
        </div>

        {/* Recent Products */}
        <div className="bg-white rounded-lg shadow-sm border border-gray-200 p-6">
          <div className="flex items-center justify-between mb-4">
            <h3 className="text-lg font-semibold text-gray-900">Recent Products</h3>
            <Package className="h-5 w-5 text-blue-500" />
          </div>
          
          <div className="space-y-3">
            {productsList.slice(0, 5).map((product) => (
              <div key={product.id} className="flex items-center justify-between p-3 bg-gray-50 rounded-lg">
                <div>
                  <p className="font-medium text-gray-900">{product.name}</p>
                  <p className="text-sm text-gray-600">
                    {formatPrice(product.price)} • Stock: {product.stockQuantity}
                  </p>
                </div>
                <button
                  onClick={() => navigate(`/admin/products/${product.id}`)}
                  className="text-blue-600 hover:text-blue-800 p-1 rounded hover:bg-blue-50"
                  title="View Product"
                >
                  <Eye className="h-4 w-4" />
                </button>
              </div>
            ))}
            <button
              onClick={() => navigate('/admin/products')}
              className="text-sm text-blue-600 hover:text-blue-800 font-medium"
            >
              View all products →
            </button>
          </div>
        </div>
      </div>
    </div>
  );
};

export default AdminDashboard;