import { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { useAuth } from '../context/AuthContext';
import axios from 'axios';

const API_URL = import.meta.env.VITE_API_URL;

export default function Checkout() {
  const { token, user } = useAuth();
  const navigate = useNavigate();
  const [cart, setCart] = useState([]);
  const [loading, setLoading] = useState(false);
  const [address, setAddress] = useState({
    street: '',
    city: '',
    state: '',
    zipCode: '',
    country: 'India'
  });

  useEffect(() => {
    if (!token) {
      navigate('/login');
      return;
    }
    const savedCart = JSON.parse(localStorage.getItem('cart') || '[]');
    if (savedCart.length === 0) {
      navigate('/cart');
    }
    setCart(savedCart);
  }, [token, navigate]);

  const totalAmount = cart.reduce((sum, item) => sum + (item.price * item.quantity), 0);

  const handlePayment = async () => {
    setLoading(true);
    
    try {
      // Step 1: Create order in backend
      const orderResponse = await axios.post(`${API_URL}/api/orders/create`, {
        items: cart.map(item => ({
          product: item.product,
          quantity: item.quantity
        })),
        shippingAddress: address
      }, {
        headers: { Authorization: `Bearer ${token}` }
      });

      const { razorpayOrderId, amount, key, orderId } = orderResponse.data;

      // Step 2: Load Razorpay script
      const script = document.createElement('script');
      script.src = 'https://checkout.razorpay.com/v1/checkout.js';
      script.onload = () => {
        const options = {
          key: key,
          amount: amount * 100,
          currency: "INR",
          name: "My Ecommerce Store",
          description: `Order #${orderId}`,
          order_id: razorpayOrderId,
          handler: async (response) => {
            // Step 3: Verify payment on backend (YAHAN SE VERIFY API CALL HOTI HAI!)
            try {
              const verifyResponse = await axios.post(`${API_URL}/api/orders/verify`, {
                razorpay_order_id: response.razorpay_order_id,
                razorpay_payment_id: response.razorpay_payment_id,
                razorpay_signature: response.razorpay_signature,
                orderId: orderId
              }, {
                headers: { Authorization: `Bearer ${token}` }
              });

              if (verifyResponse.data.success) {
                // Clear cart and redirect to success page
                localStorage.removeItem('cart');
                navigate('/order-success', { state: { orderId } });
              }
            } catch (error) {
              alert('Payment verification failed! Please contact support.');
              console.error(error);
            }
            setLoading(false);
          },
          modal: {
            ondismiss: () => {
              setLoading(false);
            }
          }
        };

        const razorpay = new window.Razorpay(options);
        razorpay.open();
      };
      
      document.body.appendChild(script);
      
    } catch (error) {
      console.error('Payment error:', error);
      alert('Failed to initiate payment. Please try again.');
      setLoading(false);
    }
  };

  return (
    <div className="container">
      <h1>Checkout</h1>
      
      <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '30px' }}>
        {/* Address Form */}
        <div>
          <h3>Shipping Address</h3>
          <input
            type="text"
            placeholder="Street Address"
            value={address.street}
            onChange={(e) => setAddress({...address, street: e.target.value})}
            style={{ width: '100%', marginBottom: '10px' }}
            required
          />
          <input
            type="text"
            placeholder="City"
            value={address.city}
            onChange={(e) => setAddress({...address, city: e.target.value})}
            style={{ width: '100%', marginBottom: '10px' }}
            required
          />
          <input
            type="text"
            placeholder="State"
            value={address.state}
            onChange={(e) => setAddress({...address, state: e.target.value})}
            style={{ width: '100%', marginBottom: '10px' }}
            required
          />
          <input
            type="text"
            placeholder="Zip Code"
            value={address.zipCode}
            onChange={(e) => setAddress({...address, zipCode: e.target.value})}
            style={{ width: '100%', marginBottom: '10px' }}
            required
          />
        </div>
        
        {/* Order Summary */}
        <div>
          <h3>Order Summary</h3>
          {cart.map((item, idx) => (
            <div key={idx} style={{ marginBottom: '10px' }}>
              {item.name} x {item.quantity} = ₹{item.price * item.quantity}
            </div>
          ))}
          <hr />
          <h3>Total: ₹{totalAmount}</h3>
          
          <button 
            onClick={handlePayment} 
            disabled={loading || !address.street || !address.city}
            style={{ width: '100%', marginTop: '20px' }}
          >
            {loading ? 'Processing...' : `Pay ₹${totalAmount}`}
          </button>
        </div>
      </div>
    </div>
  );
}