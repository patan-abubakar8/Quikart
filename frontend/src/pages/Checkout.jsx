import { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { useForm } from 'react-hook-form';
import { ArrowLeft, CreditCard, Truck, Shield, CheckCircle } from 'lucide-react';
import { useCart } from '../context/CartContext';
import { orderService } from '../services/orderService';
import { formatPrice } from '../utils/currency';
import { indianStates, majorCities } from '../utils/indianStates';
import CartItem from '../components/cart/CartItem';
import LoadingSpinner from '../components/common/LoadingSpinner';
import toast from 'react-hot-toast';

const Checkout = () => {
  const [isProcessing, setIsProcessing] = useState(false);
  const [currentStep, setCurrentStep] = useState(1); // 1: Info, 2: Payment, 3: Review
  const { items, totalAmount, getCartItemCount, clearCart } = useCart();
  const navigate = useNavigate();

  const {
    register,
    handleSubmit,
    formState: { errors },
    watch
  } = useForm();

  const itemCount = getCartItemCount();
  const subtotal = totalAmount || 0;
  const shipping = subtotal > 500 ? 0 : 49; // Free shipping over ₹500
  const gst = subtotal * 0.18; // 18% GST
  const total = subtotal + shipping + gst;

  // Redirect if cart is empty
  if (items.length === 0) {
    return (
      <div className="min-h-screen bg-gray-50 flex items-center justify-center">
        <div className="text-center">
          <h2 className="text-2xl font-medium text-gray-900 mb-4">Your cart is empty</h2>
          <p className="text-gray-500 mb-8">Add some items to your cart before checking out.</p>
          <button
            onClick={() => navigate('/products')}
            className="btn-primary"
          >
            Continue Shopping
          </button>
        </div>
      </div>
    );
  }

  const onSubmit = async (data) => {
    setIsProcessing(true);
    
    try {
      // Prepare order data
      const orderData = {
        userId: JSON.parse(localStorage.getItem('user')).id,
        items: items.map(item => ({
          productId: item.product.id,
          quantity: item.quantity,
          price: item.product.price
        })),
        shippingAddress: {
          fullName: data.fullName,
          mobile: data.mobile,
          houseNo: data.houseNo,
          area: data.area,
          city: data.city,
          state: data.state,
          pinCode: data.pinCode,
          landmark: data.landmark,
          country: 'IN'
        },
        paymentMethod: data.paymentMethod,
        totalAmount: total
      };

      // Place the order
      const response = await orderService.placeOrder(orderData);
      
      if (response.data) {
        // Clear the cart
        await clearCart();
        
        // Navigate to payment page with order details
        navigate('/payment', { 
          state: { 
            order: response.data,
            paymentMethod: data.paymentMethod 
          }
        });
        
        toast.success('Order placed successfully!');
      }
    } catch (error) {
      console.error('Order placement failed:', error);
      toast.error(error.response?.data?.message || 'Failed to place order');
    } finally {
      setIsProcessing(false);
    }
  };

  const steps = [
    { id: 1, name: 'Shipping Information', icon: Truck },
    { id: 2, name: 'Payment Method', icon: CreditCard },
    { id: 3, name: 'Review Order', icon: CheckCircle }
  ];

  return (
    <div className="min-h-screen bg-gray-50">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        {/* Header */}
        <div className="flex items-center mb-8">
          <button
            onClick={() => navigate('/cart')}
            className="flex items-center text-gray-600 hover:text-gray-900 mr-4"
          >
            <ArrowLeft className="h-5 w-5 mr-2" />
            Back to Cart
          </button>
          <h1 className="text-3xl font-bold text-gray-900">Checkout</h1>
        </div>

        {/* Progress Steps */}
        <div className="mb-8">
          <div className="flex items-center justify-center">
            {steps.map((step, index) => (
              <div key={step.id} className="flex items-center">
                <div className={`flex items-center justify-center w-10 h-10 rounded-full border-2 ${
                  currentStep >= step.id 
                    ? 'bg-primary-600 border-primary-600 text-white' 
                    : 'border-gray-300 text-gray-500'
                }`}>
                  <step.icon className="h-5 w-5" />
                </div>
                <span className={`ml-2 text-sm font-medium ${
                  currentStep >= step.id ? 'text-primary-600' : 'text-gray-500'
                }`}>
                  {step.name}
                </span>
                {index < steps.length - 1 && (
                  <div className={`w-16 h-0.5 mx-4 ${
                    currentStep > step.id ? 'bg-primary-600' : 'bg-gray-300'
                  }`} />
                )}
              </div>
            ))}
          </div>
        </div>

        <form onSubmit={handleSubmit(onSubmit)}>
          <div className="lg:grid lg:grid-cols-12 lg:gap-8">
            {/* Main Content */}
            <div className="lg:col-span-8">
              {/* Shipping Information */}
              <div className="bg-white rounded-lg shadow-sm border border-gray-200 p-6 mb-6">
                <h2 className="text-lg font-medium text-gray-900 mb-6 flex items-center">
                  <Truck className="h-5 w-5 mr-2" />
                  Shipping Information
                </h2>
                
                <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                  <div className="md:col-span-2">
                    <label className="block text-sm font-medium text-gray-700 mb-2">
                      Full Name *
                    </label>
                    <input
                      {...register('fullName', { required: 'Full name is required' })}
                      className="input-field"
                      placeholder="Rajesh Kumar"
                    />
                    {errors.fullName && (
                      <p className="mt-1 text-sm text-red-600">{errors.fullName.message}</p>
                    )}
                  </div>

                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-2">
                      Mobile Number *
                    </label>
                    <input
                      {...register('mobile', { 
                        required: 'Mobile number is required',
                        pattern: {
                          value: /^[6-9]\d{9}$/,
                          message: 'Please enter a valid 10-digit mobile number'
                        }
                      })}
                      className="input-field"
                      placeholder="9876543210"
                      maxLength="10"
                    />
                    {errors.mobile && (
                      <p className="mt-1 text-sm text-red-600">{errors.mobile.message}</p>
                    )}
                  </div>

                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-2">
                      PIN Code *
                    </label>
                    <input
                      {...register('pinCode', { 
                        required: 'PIN code is required',
                        pattern: {
                          value: /^[1-9][0-9]{5}$/,
                          message: 'Please enter a valid 6-digit PIN code'
                        }
                      })}
                      className="input-field"
                      placeholder="400001"
                      maxLength="6"
                    />
                    {errors.pinCode && (
                      <p className="mt-1 text-sm text-red-600">{errors.pinCode.message}</p>
                    )}
                  </div>

                  <div className="md:col-span-2">
                    <label className="block text-sm font-medium text-gray-700 mb-2">
                      House No, Building Name *
                    </label>
                    <input
                      {...register('houseNo', { required: 'House number is required' })}
                      className="input-field"
                      placeholder="A-101, Sunrise Apartments"
                    />
                    {errors.houseNo && (
                      <p className="mt-1 text-sm text-red-600">{errors.houseNo.message}</p>
                    )}
                  </div>

                  <div className="md:col-span-2">
                    <label className="block text-sm font-medium text-gray-700 mb-2">
                      Road Name, Area, Colony *
                    </label>
                    <input
                      {...register('area', { required: 'Area is required' })}
                      className="input-field"
                      placeholder="MG Road, Bandra West"
                    />
                    {errors.area && (
                      <p className="mt-1 text-sm text-red-600">{errors.area.message}</p>
                    )}
                  </div>

                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-2">
                      City *
                    </label>
                    <input
                      {...register('city', { required: 'City is required' })}
                      className="input-field"
                      placeholder="Mumbai"
                      list="cities"
                    />
                    <datalist id="cities">
                      {majorCities.map(city => (
                        <option key={city} value={city} />
                      ))}
                    </datalist>
                    {errors.city && (
                      <p className="mt-1 text-sm text-red-600">{errors.city.message}</p>
                    )}
                  </div>

                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-2">
                      State *
                    </label>
                    <select
                      {...register('state', { required: 'State is required' })}
                      className="input-field"
                    >
                      <option value="">Select State</option>
                      {indianStates.map(state => (
                        <option key={state.code} value={state.code}>
                          {state.name}
                        </option>
                      ))}
                    </select>
                    {errors.state && (
                      <p className="mt-1 text-sm text-red-600">{errors.state.message}</p>
                    )}
                  </div>

                  <div className="md:col-span-2">
                    <label className="block text-sm font-medium text-gray-700 mb-2">
                      Landmark (Optional)
                    </label>
                    <input
                      {...register('landmark')}
                      className="input-field"
                      placeholder="Near City Mall"
                    />
                  </div>
                </div>
              </div>

              {/* Payment Method */}
              <div className="bg-white rounded-lg shadow-sm border border-gray-200 p-6">
                <h2 className="text-lg font-medium text-gray-900 mb-6 flex items-center">
                  <CreditCard className="h-5 w-5 mr-2" />
                  Payment Method
                </h2>
                
                <div className="space-y-4">
                  <div className="flex items-center">
                    <input
                      {...register('paymentMethod', { required: 'Please select a payment method' })}
                      id="razorpay"
                      type="radio"
                      value="razorpay"
                      className="h-4 w-4 text-primary-600 focus:ring-primary-500 border-gray-300"
                    />
                    <label htmlFor="razorpay" className="ml-3 block text-sm font-medium text-gray-700">
                      Razorpay (Credit/Debit Card, UPI, Net Banking)
                    </label>
                  </div>
                  
                  <div className="flex items-center">
                    <input
                      {...register('paymentMethod')}
                      id="cod"
                      type="radio"
                      value="cod"
                      className="h-4 w-4 text-primary-600 focus:ring-primary-500 border-gray-300"
                    />
                    <label htmlFor="cod" className="ml-3 block text-sm font-medium text-gray-700">
                      Cash on Delivery
                    </label>
                  </div>
                </div>
                
                {errors.paymentMethod && (
                  <p className="mt-2 text-sm text-red-600">{errors.paymentMethod.message}</p>
                )}

                <div className="mt-6 p-4 bg-gray-50 rounded-lg flex items-center">
                  <Shield className="h-5 w-5 text-green-600 mr-2" />
                  <span className="text-sm text-gray-600">
                    Your payment information is encrypted and secure
                  </span>
                </div>
              </div>
            </div>

            {/* Order Summary */}
            <div className="lg:col-span-4 mt-8 lg:mt-0">
              <div className="bg-white rounded-lg shadow-sm border border-gray-200 p-6 sticky top-8">
                <h2 className="text-lg font-medium text-gray-900 mb-6">Order Summary</h2>
                
                {/* Order Items */}
                <div className="mb-6 max-h-64 overflow-y-auto">
                  <h3 className="text-sm font-medium text-gray-900 mb-3">
                    Items ({itemCount})
                  </h3>
                  <div className="space-y-3">
                    {items.map((item) => (
                      <CartItem 
                        key={item.id} 
                        item={item} 
                        compact={true}
                        showQuantityControls={false}
                      />
                    ))}
                  </div>
                </div>

                {/* Price Breakdown */}
                <div className="space-y-3 border-t border-gray-200 pt-4">
                  <div className="flex justify-between text-sm">
                    <span className="text-gray-600">Subtotal</span>
                    <span className="font-medium">{formatPrice(subtotal)}</span>
                  </div>
                  
                  <div className="flex justify-between text-sm">
                    <span className="text-gray-600">Shipping</span>
                    <span className="font-medium">
                      {shipping === 0 ? (
                        <span className="text-green-600">FREE</span>
                      ) : (
                        formatPrice(shipping)
                      )}
                    </span>
                  </div>
                  
                  <div className="flex justify-between text-sm">
                    <span className="text-gray-600">GST (18%)</span>
                    <span className="font-medium">{formatPrice(gst)}</span>
                  </div>
                  
                  <div className="border-t border-gray-200 pt-3">
                    <div className="flex justify-between text-lg font-semibold">
                      <span>Total</span>
                      <span>{formatPrice(total)}</span>
                    </div>
                  </div>
                </div>

                <button
                  type="submit"
                  disabled={isProcessing}
                  className="w-full mt-6 bg-primary-600 text-white py-3 px-4 rounded-lg font-medium hover:bg-primary-700 transition-colors disabled:opacity-50 disabled:cursor-not-allowed flex items-center justify-center"
                >
                  {isProcessing ? (
                    <>
                      <LoadingSpinner size="small" />
                      <span className="ml-2">Processing...</span>
                    </>
                  ) : (
                    'Place Order'
                  )}
                </button>

                <p className="mt-4 text-xs text-gray-500 text-center">
                  By placing your order, you agree to our Terms of Service and Privacy Policy.
                </p>
              </div>
            </div>
          </div>
        </form>
      </div>
    </div>
  );
};

export default Checkout;