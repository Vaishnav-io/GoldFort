import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { useDispatch, useSelector } from 'react-redux';
import { motion } from 'framer-motion';
import { PayPalScriptProvider, PayPalButtons } from '@paypal/react-paypal-js';
import { FiCreditCard, FiCheck, FiPlus, FiMinus } from 'react-icons/fi';
import { getCart, clearCart } from '../../features/cart/cartSlice';
import Button from '../../components/comms/Button';

const Checkout = () => {
  const navigate = useNavigate();
  const dispatch = useDispatch();
  const { items, totalAmount } = useSelector(state => state.cart);
  const { user } = useSelector(state => state.auth);
  
  const [activeStep, setActiveStep] = useState(1);
  const [shippingAddress, setShippingAddress] = useState({
    firstName: '',
    lastName: '',
    street: '',
    city: '',
    state: '',
    postalCode: '',
    country: '',
    phone: '',
  });
  const [paymentMethod, setPaymentMethod] = useState('PayPal');
  const [isOrderPlaced, setIsOrderPlaced] = useState(false);
  const [orderId, setOrderId] = useState(null);
  
  // Calculate order summary
  const shipping = 0; // Free shipping
  const tax = totalAmount * 0.1; // 10% tax
  const orderTotal = totalAmount + tax + shipping;
  
  useEffect(() => {
    if (!user) {
      navigate('/login?redirect=checkout');
    }
    
    dispatch(getCart());
    
    // If cart is empty, redirect to cart page
    if (items.length === 0) {
      navigate('/cart');
    }
  }, [dispatch, navigate, user, items.length]);
  
  // Auto-fill user address if available
  useEffect(() => {
    if (user && user.addresses && user.addresses.length > 0) {
      const defaultAddress = user.addresses.find(addr => addr.default) || user.addresses[0];
      
      if (defaultAddress) {
        setShippingAddress({
          firstName: user.name.split(' ')[0] || '',
          lastName: user.name.split(' ').slice(1).join(' ') || '',
          street: defaultAddress.street || '',
          city: defaultAddress.city || '',
          state: defaultAddress.state || '',
          postalCode: defaultAddress.postalCode || '',
          country: defaultAddress.country || '',
          phone: user.phone || '',
        });
      }
    }
  }, [user]);
  
  const handleInputChange = (e) => {
    const { name, value } = e.target;
    setShippingAddress(prev => ({
      ...prev,
      [name]: value,
    }));
  };
  
  const handleShippingSubmit = (e) => {
    e.preventDefault();
    setActiveStep(2);
    window.scrollTo(0, 0);
  };
  
  const handlePaymentMethodChange = (method) => {
    setPaymentMethod(method);
  };
  
  const handlePaymentSubmit = (e) => {
    e.preventDefault();
    setActiveStep(3);
    window.scrollTo(0, 0);
  };
  
  const createOrder = (data, actions) => {
    return actions.order.create({
      purchase_units: [
        {
          amount: {
            value: orderTotal.toFixed(2),
          },
        },
      ],
    });
  };
  
  const onApprove = (data, actions) => {
    return actions.order.capture().then((details) => {
      // Handle successful payment
      handleOrderSuccess(details.id);
    });
  };
  
  const handleOrderSuccess = (paymentId) => {
    // In a real application, you would make an API call to create the order in your database
    const generatedOrderId = 'ORD-' + Math.random().toString(36).substr(2, 9).toUpperCase();
    
    setOrderId(generatedOrderId);
    setIsOrderPlaced(true);
    setActiveStep(4);
    
    // Clear the cart
    dispatch(clearCart());
    
    window.scrollTo(0, 0);
  };
  
  const getStepContent = () => {
    switch (activeStep) {
      case 1:
        return (
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: -20 }}
          >
            <h2 className="text-2xl font-bold mb-6">Shipping Address</h2>
            <form onSubmit={handleShippingSubmit}>
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4 mb-6">
                <div>
                  <label htmlFor="firstName" className="block text-gray-700 mb-1">
                    First Name *
                  </label>
                  <input
                    type="text"
                    id="firstName"
                    name="firstName"
                    value={shippingAddress.firstName}
                    onChange={handleInputChange}
                    className="w-full px-4 py-2 border rounded-md focus:outline-none focus:ring-2 focus:ring-indigo-500"
                    required
                  />
                </div>
                <div>
                  <label htmlFor="lastName" className="block text-gray-700 mb-1">
                    Last Name *
                  </label>
                  <input
                    type="text"
                    id="lastName"
                    name="lastName"
                    value={shippingAddress.lastName}
                    onChange={handleInputChange}
                    className="w-full px-4 py-2 border rounded-md focus:outline-none focus:ring-2 focus:ring-indigo-500"
                    required
                  />
                </div>
              </div>
              
              <div className="mb-4">
                <label htmlFor="street" className="block text-gray-700 mb-1">
                  Street Address *
                </label>
                <input
                  type="text"
                  id="street"
                  name="street"
                  value={shippingAddress.street}
                  onChange={handleInputChange}
                  className="w-full px-4 py-2 border rounded-md focus:outline-none focus:ring-2 focus:ring-indigo-500"
                  required
                />
              </div>
              
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4 mb-4">
                <div>
                  <label htmlFor="city" className="block text-gray-700 mb-1">
                    City *
                  </label>
                  <input
                    type="text"
                    id="city"
                    name="city"
                    value={shippingAddress.city}
                    onChange={handleInputChange}
                    className="w-full px-4 py-2 border rounded-md focus:outline-none focus:ring-2 focus:ring-indigo-500"
                    required
                  />
                </div>
                <div>
                  <label htmlFor="state" className="block text-gray-700 mb-1">
                    State/Province *
                  </label>
                  <input
                    type="text"
                    id="state"
                    name="state"
                    value={shippingAddress.state}
                    onChange={handleInputChange}
                    className="w-full px-4 py-2 border rounded-md focus:outline-none focus:ring-2 focus:ring-indigo-500"
                    required
                  />
                </div>
              </div>
              
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4 mb-4">
                <div>
                  <label htmlFor="postalCode" className="block text-gray-700 mb-1">
                    Postal Code *
                  </label>
                  <input
                    type="text"
                    id="postalCode"
                    name="postalCode"
                    value={shippingAddress.postalCode}
                    onChange={handleInputChange}
                    className="w-full px-4 py-2 border rounded-md focus:outline-none focus:ring-2 focus:ring-indigo-500"
                    required
                  />
                </div>
                <div>
                  <label htmlFor="country" className="block text-gray-700 mb-1">
                    Country *
                  </label>
                  <input
                    type="text"
                    id="country"
                    name="country"
                    value={shippingAddress.country}
                    onChange={handleInputChange}
                    className="w-full px-4 py-2 border rounded-md focus:outline-none focus:ring-2 focus:ring-indigo-500"
                    required
                  />
                </div>
              </div>
              
              <div className="mb-6">
                <label htmlFor="phone" className="block text-gray-700 mb-1">
                  Phone Number *
                </label>
                <input
                  type="tel"
                  id="phone"
                  name="phone"
                  value={shippingAddress.phone}
                  onChange={handleInputChange}
                  className="w-full px-4 py-2 border rounded-md focus:outline-none focus:ring-2 focus:ring-indigo-500"
                  required
                />
              </div>
              
              <div className="flex justify-end">
                <Button type="submit" variant="primary">
                  Continue to Payment
                </Button>
              </div>
            </form>
          </motion.div>
        );
      
      case 2:
        return (
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: -20 }}
          >
            <h2 className="text-2xl font-bold mb-6">Payment Method</h2>
            <form onSubmit={handlePaymentSubmit}>
              <div className="mb-6">
                <div className="flex items-center mb-4">
                  <input
                    type="radio"
                    id="paypal"
                    name="paymentMethod"
                    value="PayPal"
                    checked={paymentMethod === 'PayPal'}
                    onChange={() => handlePaymentMethodChange('PayPal')}
                    className="h-4 w-4 text-indigo-600 focus:ring-indigo-500"
                  />
                  <label htmlFor="paypal" className="ml-2 block text-gray-700">
                    PayPal
                  </label>
                </div>
                
                <div className="flex items-center mb-4">
                  <input
                    type="radio"
                    id="creditCard"
                    name="paymentMethod"
                    value="Credit Card"
                    checked={paymentMethod === 'Credit Card'}
                    onChange={() => handlePaymentMethodChange('Credit Card')}
                    className="h-4 w-4 text-indigo-600 focus:ring-indigo-500"
                  />
                  <label htmlFor="creditCard" className="ml-2 block text-gray-700">
                    Credit Card
                  </label>
                </div>
              </div>
              
              {paymentMethod === 'Credit Card' && (
                <div className="mb-6 p-4 border rounded-md bg-gray-50">
                  <div className="flex items-center mb-4">
                    <FiCreditCard className="text-xl text-indigo-600 mr-2" />
                    <h3 className="font-medium">Credit Card Information</h3>
                  </div>
                  
                  <div className="mb-4">
                    <label htmlFor="cardName" className="block text-gray-700 mb-1">
                      Name on Card
                    </label>
                    <input
                      type="text"
                      id="cardName"
                      className="w-full px-4 py-2 border rounded-md focus:outline-none focus:ring-2 focus:ring-indigo-500"
                      placeholder="John Doe"
                      required
                    />
                  </div>
                  
                  <div className="mb-4">
                    <label htmlFor="cardNumber" className="block text-gray-700 mb-1">
                      Card Number
                    </label>
                    <input
                      type="text"
                      id="cardNumber"
                      className="w-full px-4 py-2 border rounded-md focus:outline-none focus:ring-2 focus:ring-indigo-500"
                      placeholder="XXXX XXXX XXXX XXXX"
                      required
                    />
                  </div>
                  
                  <div className="grid grid-cols-2 gap-4">
                    <div>
                      <label htmlFor="expiry" className="block text-gray-700 mb-1">
                        Expiry Date
                      </label>
                      <input
                        type="text"
                        id="expiry"
                        className="w-full px-4 py-2 border rounded-md focus:outline-none focus:ring-2 focus:ring-indigo-500"
                        placeholder="MM/YY"
                        required
                      />
                    </div>
                    <div>
                      <label htmlFor="cvv" className="block text-gray-700 mb-1">
                        CVV
                      </label>
                      <input
                        type="text"
                        id="cvv"
                        className="w-full px-4 py-2 border rounded-md focus:outline-none focus:ring-2 focus:ring-indigo-500"
                        placeholder="XXX"
                        required
                      />
                    </div>
                  </div>
                </div>
              )}
              
              <div className="flex justify-between">
                <Button
                  type="button"
                  variant="outline"
                  onClick={() => setActiveStep(1)}
                >
                  Back
                </Button>
                <Button type="submit" variant="primary">
                  Continue to Review
                </Button>
              </div>
            </form>
          </motion.div>
        );
      
      case 3:
        return (
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: -20 }}
          >
            <h2 className="text-2xl font-bold mb-6">Review Your Order</h2>
            
            <div className="bg-gray-50 rounded-lg p-6 mb-6">
              <h3 className="font-semibold text-lg mb-4">Shipping Information</h3>
              <div className="text-gray-700">
                <p>{shippingAddress.firstName} {shippingAddress.lastName}</p>
                <p>{shippingAddress.street}</p>
                <p>{shippingAddress.city}, {shippingAddress.state} {shippingAddress.postalCode}</p>
                <p>{shippingAddress.country}</p>
                <p>Phone: {shippingAddress.phone}</p>
              </div>
            </div>
            
            <div className="bg-gray-50 rounded-lg p-6 mb-6">
              <h3 className="font-semibold text-lg mb-4">Payment Method</h3>
              <p className="text-gray-700">{paymentMethod}</p>
            </div>
            
            <div className="border rounded-lg mb-6">
              <div className="px-6 py-4 border-b">
                <h3 className="font-semibold text-lg">Order Items</h3>
              </div>
              <div className="divide-y">
                {items.map((item) => {
                  const itemPrice = item.price * (1 - (item.discount || 0) / 100);
                  
                  return (
                    <div key={item.productId} className="px-6 py-4 flex items-center">
                      <div className="w-16 h-16 flex-shrink-0">
                        <img
                          src={item.image}
                          alt={item.name}
                          className="w-full h-full object-cover rounded"
                        />
                      </div>
                      <div className="ml-4 flex-grow">
                        <h4 className="font-medium">{item.name}</h4>
                        <p className="text-gray-600 text-sm">
                          Qty: {item.quantity} x ${itemPrice.toFixed(2)}
                        </p>
                      </div>
                      <div className="font-semibold">
                        ${(itemPrice * item.quantity).toFixed(2)}
                      </div>
                    </div>
                  );
                })}
              </div>
            </div>
            
            <div className="bg-gray-50 rounded-lg p-6 mb-6">
              <h3 className="font-semibold text-lg mb-4">Order Summary</h3>
              <div className="space-y-2">
                <div className="flex justify-between">
                  <span className="text-gray-600">Subtotal</span>
                  <span>${totalAmount.toFixed(2)}</span>
                </div>
                <div className="flex justify-between">
                  <span className="text-gray-600">Shipping</span>
                  <span>{shipping === 0 ? 'Free' : `${shipping.toFixed(2)}`}</span>
                </div>
                <div className="flex justify-between">
                  <span className="text-gray-600">Tax (10%)</span>
                  <span>${tax.toFixed(2)}</span>
                </div>
                <div className="border-t pt-2 mt-2">
                  <div className="flex justify-between font-bold">
                    <span>Total</span>
                    <span>${orderTotal.toFixed(2)}</span>
                  </div>
                </div>
              </div>
            </div>
            
            <div className="bg-white rounded-lg p-6 mb-6">
              <h3 className="font-semibold text-lg mb-4">Complete Your Payment</h3>
              
              {paymentMethod === 'PayPal' ? (
                <PayPalScriptProvider options={{ "client-id": "test" }}>
                  <PayPalButtons 
                    createOrder={createOrder}
                    onApprove={onApprove}
                    style={{ layout: "horizontal" }}
                  />
                </PayPalScriptProvider>
              ) : (
                <Button 
                  onClick={() => handleOrderSuccess('SIMULATED-CC-PAYMENT')}
                  variant="primary"
                  fullWidth
                  className="py-3"
                >
                  Pay ${orderTotal.toFixed(2)}
                </Button>
              )}
              
              <p className="text-xs text-gray-500 mt-4">
                By completing your purchase, you agree to our Terms of Service and Privacy Policy.
              </p>
            </div>
            
            <div className="flex justify-between">
              <Button
                type="button"
                variant="outline"
                onClick={() => setActiveStep(2)}
              >
                Back
              </Button>
            </div>
          </motion.div>
        );
      
      case 4:
        return (
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            className="text-center py-12"
          >
            <div className="mb-6 mx-auto bg-green-100 rounded-full w-24 h-24 flex items-center justify-center">
              <FiCheck className="text-4xl text-green-600" />
            </div>
            
            <h2 className="text-3xl font-bold mb-4">Thank You For Your Order!</h2>
            <p className="text-gray-600 mb-6">
              Your order has been placed and will be processed soon.
            </p>
            
            <div className="bg-gray-50 rounded-lg p-6 mb-6 max-w-md mx-auto">
              <h3 className="font-semibold text-lg mb-4">Order Information</h3>
              <div className="text-gray-700 text-left">
                <p className="flex justify-between mb-2">
                  <span>Order Number:</span>
                  <span className="font-medium">{orderId}</span>
                </p>
                <p className="flex justify-between mb-2">
                  <span>Date:</span>
                  <span>{new Date().toLocaleDateString()}</span>
                </p>
                <p className="flex justify-between mb-2">
                  <span>Total:</span>
                  <span>${orderTotal.toFixed(2)}</span>
                </p>
                <p className="flex justify-between">
                  <span>Payment Method:</span>
                  <span>{paymentMethod}</span>
                </p>
              </div>
            </div>
            
            <Button
              onClick={() => navigate('/products')}
              variant="primary"
              className="px-8"
            >
              Continue Shopping
            </Button>
          </motion.div>
        );
      
      default:
        return null;
    }
  };
  
  return (
    <div className="bg-gray-50 min-h-screen py-10">
      <div className="container mx-auto px-4 pt-16">
        {/* Checkout Steps */}
        <div className="flex justify-between items-center mb-12 max-w-3xl mx-auto">
          {[1, 2, 3, 4].map((step) => (
            <div key={step} className="flex flex-col items-center">
              <div
                className={`w-10 h-10 rounded-full flex items-center justify-center font-medium ${
                  step === activeStep
                    ? 'bg-indigo-600 text-white'
                    : step < activeStep
                    ? 'bg-green-500 text-white'
                    : 'bg-gray-200 text-gray-700'
                }`}
              >
                {step < activeStep ? <FiCheck /> : step}
              </div>
              <span
                className={`mt-2 text-sm ${
                  step <= activeStep ? 'text-gray-800' : 'text-gray-500'
                }`}
              >
                {step === 1
                  ? 'Shipping'
                  : step === 2
                  ? 'Payment'
                  : step === 3
                  ? 'Review'
                  : 'Confirmation'}
              </span>
            </div>
          ))}
        </div>
        
        {/* Checkout Content */}
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
          <div className="lg:col-span-2 bg-white rounded-lg shadow-md p-8">
            {getStepContent()}
          </div>
          
          {/* Order Summary Sidebar */}
          {activeStep < 4 && (
            <div className="lg:col-span-1">
              <div className="bg-white rounded-lg shadow-md overflow-hidden sticky top-24">
                <div className="p-6 border-b">
                  <h2 className="text-xl font-semibold">Order Summary</h2>
                </div>
                
                <div className="p-6 space-y-4">
                  <div className="flex justify-between">
                    <span className="text-gray-600">Subtotal ({items.length} items)</span>
                    <span>${totalAmount.toFixed(2)}</span>
                  </div>
                  
                  <div className="flex justify-between">
                    <span className="text-gray-600">Shipping</span>
                    <span className="text-green-500">Free</span>
                  </div>
                  
                  <div className="flex justify-between">
                    <span className="text-gray-600">Tax (10%)</span>
                    <span>${tax.toFixed(2)}</span>
                  </div>
                  
                  <div className="border-t pt-4 mt-4">
                    <div className="flex justify-between font-bold text-lg">
                      <span>Total</span>
                      <span>${orderTotal.toFixed(2)}</span>
                    </div>
                  </div>
                </div>
              </div>
            </div>
          )}
        </div>
      </div>
    </div>
  );
};

export default Checkout;