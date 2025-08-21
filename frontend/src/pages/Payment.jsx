import { useState, useEffect } from 'react';
import { useLocation, useNavigate } from 'react-router-dom';
import { CheckCircle, CreditCard, Download, ArrowLeft, Clock } from 'lucide-react';
import { orderService } from '../services/orderService';
import { formatPrice } from '../utils/currency';
import LoadingSpinner from '../components/common/LoadingSpinner';
import toast from 'react-hot-toast';

const Payment = () => {
  const [isProcessingPayment, setIsProcessingPayment] = useState(false);
  const [paymentStatus, setPaymentStatus] = useState('pending'); // 'pending', 'processing', 'success', 'failed'
  const location = useLocation();
  const navigate = useNavigate();

  const order = location.state?.order;
  const paymentMethod = location.state?.paymentMethod;

  useEffect(() => {
    if (!order) {
      navigate('/cart');
      return;
    }

    // Auto-process payment based on method
    if (paymentMethod === 'cod') {
      // For COD, mark as success immediately
      setPaymentStatus('success');
    } else if (paymentMethod === 'razorpay') {
      // Initialize Razorpay payment
      initializeRazorpayPayment();
    }
  }, [order, paymentMethod, navigate]);

  // formatPrice is now imported from utils

  const initializeRazorpayPayment = () => {
    setIsProcessingPayment(true);
    setPaymentStatus('processing');

    // Simulate Razorpay integration
    // In a real app, you would load the Razorpay script and create a payment
    setTimeout(() => {
      // Simulate payment success (90% success rate for demo)
      const isSuccess = Math.random() > 0.1;
      
      if (isSuccess) {
        setPaymentStatus('success');
        toast.success('Payment successful!');
      } else {
        setPaymentStatus('failed');
        toast.error('Payment failed. Please try again.');
      }
      
      setIsProcessingPayment(false);
    }, 3000);

    // Real Razorpay integration would look like this:
    /*
    const options = {
      key: 'your_razorpay_key_id', // Replace with your Razorpay key
      amount: order.totalAmount * 100, // Amount in paise (₹1 = 100 paise)
      currency: 'INR',
      name: 'EcomStore India',
      description: `Order #${order.id}`,
      order_id: order.razorpayOrderId, // This should come from your backend
      handler: function (response) {
        // Payment success
        setPaymentStatus('success');
        toast.success('भुगतान सफल! Payment successful!');
        setIsProcessingPayment(false);
      },
      prefill: {
        name: order.user.name,
        email: order.user.email,
        contact: order.shippingAddress?.mobile || ''
      },
      theme: {
        color: '#2563eb'
      },
      modal: {
        ondismiss: function() {
          setPaymentStatus('failed');
          setIsProcessingPayment(false);
        }
      }
    };

    const rzp = new window.Razorpay(options);
    rzp.open();
    */
  };

  const handleDownloadInvoice = async () => {
    try {
      await orderService.downloadInvoicePdf(order.id);
      toast.success('Invoice downloaded successfully!');
    } catch (error) {
      toast.error('Failed to download invoice');
    }
  };

  const handleDownloadReceipt = async () => {
    try {
      await orderService.downloadOrderPdf(order.id);
      toast.success('Receipt downloaded successfully!');
    } catch (error) {
      toast.error('Failed to download receipt');
    }
  };

  const handleRetryPayment = () => {
    if (paymentMethod === 'razorpay') {
      initializeRazorpayPayment();
    }
  };

  const handleBackToProducts = () => {
    navigate('/products');
  };

  if (!order) {
    return (
      <div className="min-h-screen bg-gray-50 flex items-center justify-center">
        <div className="text-center">
          <h2 className="text-2xl font-medium text-gray-900 mb-4">No order found</h2>
          <button onClick={() => navigate('/products')} className="btn-primary">
            Continue Shopping
          </button>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gray-50">
      <div className="max-w-3xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        {/* Header */}
        <div className="text-center mb-8">
          <h1 className="text-3xl font-bold text-gray-900 mb-2">
            {paymentStatus === 'success' ? 'Order Confirmed!' : 'Payment Processing'}
          </h1>
          <p className="text-gray-600">Order #{order.id}</p>
        </div>

        {/* Payment Status */}
        <div className="bg-white rounded-lg shadow-sm border border-gray-200 p-8 mb-8">
          <div className="text-center">
            {paymentStatus === 'pending' && (
              <div className="mb-6">
                <Clock className="h-16 w-16 text-gray-400 mx-auto mb-4" />
                <h2 className="text-xl font-medium text-gray-900 mb-2">
                  Preparing Payment
                </h2>
                <p className="text-gray-600">Please wait while we set up your payment...</p>
              </div>
            )}

            {paymentStatus === 'processing' && (
              <div className="mb-6">
                <div className="flex justify-center mb-4">
                  <LoadingSpinner size="large" />
                </div>
                <h2 className="text-xl font-medium text-gray-900 mb-2">
                  Processing Payment
                </h2>
                <p className="text-gray-600">
                  {paymentMethod === 'razorpay' 
                    ? 'Please complete the payment in the Razorpay window...'
                    : 'Processing your payment...'
                  }
                </p>
              </div>
            )}

            {paymentStatus === 'success' && (
              <div className="mb-6">
                <CheckCircle className="h-16 w-16 text-green-500 mx-auto mb-4" />
                <h2 className="text-xl font-medium text-gray-900 mb-2">
                  Payment Successful!
                </h2>
                <p className="text-gray-600">
                  {paymentMethod === 'cod' 
                    ? 'Your order has been placed. Pay when you receive your items.'
                    : 'Your payment has been processed successfully.'
                  }
                </p>
              </div>
            )}

            {paymentStatus === 'failed' && (
              <div className="mb-6">
                <CreditCard className="h-16 w-16 text-red-500 mx-auto mb-4" />
                <h2 className="text-xl font-medium text-gray-900 mb-2">
                  Payment Failed
                </h2>
                <p className="text-gray-600 mb-4">
                  We couldn't process your payment. Please try again.
                </p>
                <button
                  onClick={handleRetryPayment}
                  className="btn-primary mr-4"
                >
                  Retry Payment
                </button>
                <button
                  onClick={() => navigate('/checkout')}
                  className="btn-outline"
                >
                  Back to Checkout
                </button>
              </div>
            )}
          </div>
        </div>

        {/* Order Details */}
        <div className="bg-white rounded-lg shadow-sm border border-gray-200 p-6 mb-8">
          <h3 className="text-lg font-medium text-gray-900 mb-4">Order Details</h3>
          
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            <div>
              <h4 className="text-sm font-medium text-gray-900 mb-2">Order Information</h4>
              <div className="text-sm text-gray-600 space-y-1">
                <p>Order ID: #{order.id}</p>
                <p>Date: {new Date(order.orderedAt).toLocaleDateString()}</p>
                <p>Status: {order.orderStatus}</p>
                <p>Payment Method: {paymentMethod === 'cod' ? 'Cash on Delivery' : 'Razorpay'}</p>
              </div>
            </div>
            
            <div>
              <h4 className="text-sm font-medium text-gray-900 mb-2">Total Amount</h4>
              <div className="text-2xl font-bold text-gray-900">
                {formatPrice(order.totalAmount)}
              </div>
            </div>
          </div>

          {/* Order Items */}
          <div className="mt-6">
            <h4 className="text-sm font-medium text-gray-900 mb-3">Items Ordered</h4>
            <div className="space-y-3">
              {order.items?.map((item, index) => (
                <div key={index} className="flex justify-between items-center py-2 border-b border-gray-100 last:border-b-0">
                  <div>
                    <p className="text-sm font-medium text-gray-900">{item.product?.name}</p>
                    <p className="text-sm text-gray-500">Qty: {item.quantity}</p>
                  </div>
                  <p className="text-sm font-medium text-gray-900">
                    {formatPrice(item.price * item.quantity)}
                  </p>
                </div>
              ))}
            </div>
          </div>
        </div>

        {/* Actions */}
        {paymentStatus === 'success' && (
          <div className="bg-white rounded-lg shadow-sm border border-gray-200 p-6 mb-8">
            <h3 className="text-lg font-medium text-gray-900 mb-4">What's Next?</h3>
            
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4 mb-6">
              <button
                onClick={handleDownloadInvoice}
                className="flex items-center justify-center px-4 py-2 border border-gray-300 rounded-lg text-sm font-medium text-gray-700 hover:bg-gray-50 transition-colors"
              >
                <Download className="h-4 w-4 mr-2" />
                Download Invoice
              </button>
              
              <button
                onClick={handleDownloadReceipt}
                className="flex items-center justify-center px-4 py-2 border border-gray-300 rounded-lg text-sm font-medium text-gray-700 hover:bg-gray-50 transition-colors"
              >
                <Download className="h-4 w-4 mr-2" />
                Download Receipt
              </button>
            </div>

            <div className="text-center">
              <button
                onClick={handleBackToProducts}
                className="btn-primary"
              >
                Continue Shopping
              </button>
            </div>

            <div className="mt-6 p-4 bg-blue-50 rounded-lg">
              <h4 className="text-sm font-medium text-blue-900 mb-2">Order Tracking</h4>
              <p className="text-sm text-blue-700">
                You will receive an email confirmation shortly. You can track your order status in your account.
              </p>
            </div>
          </div>
        )}

        {/* Back Button */}
        <div className="text-center">
          <button
            onClick={() => navigate('/products')}
            className="flex items-center text-gray-600 hover:text-gray-900 mx-auto"
          >
            <ArrowLeft className="h-4 w-4 mr-2" />
            Back to Products
          </button>
        </div>
      </div>
    </div>
  );
};

export default Payment;