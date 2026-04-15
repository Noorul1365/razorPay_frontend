import { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';

export default function Cart() {
  const [cart, setCart] = useState([]);
  const navigate = useNavigate();

  useEffect(() => {
    loadCart();
  }, []);

  const loadCart = () => {
    const savedCart = JSON.parse(localStorage.getItem('cart') || '[]');
    setCart(savedCart);
  };

  const updateQuantity = (index, newQuantity) => {
    if (newQuantity < 1) return;
    const newCart = [...cart];
    newCart[index].quantity = newQuantity;
    setCart(newCart);
    localStorage.setItem('cart', JSON.stringify(newCart));
  };

  const removeItem = (index) => {
    const newCart = cart.filter((_, i) => i !== index);
    setCart(newCart);
    localStorage.setItem('cart', JSON.stringify(newCart));
  };

  const totalAmount = cart.reduce((sum, item) => sum + (item.price * item.quantity), 0);

  const proceedToCheckout = () => {
    navigate('/checkout');
  };

  if (cart.length === 0) {
    return (
      <div className="container">
        <h1>Your Cart is Empty</h1>
        <button onClick={() => navigate('/')}>Continue Shopping</button>
      </div>
    );
  }

  return (
    <div className="container">
      <h1>Shopping Cart</h1>
      <div style={{ marginTop: '20px' }}>
        {cart.map((item, index) => (
          <div key={index} style={{ borderBottom: '1px solid #ddd', padding: '15px', display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
            <div>
              <h3>{item.name}</h3>
              <p>₹{item.price} x {item.quantity} = ₹{item.price * item.quantity}</p>
            </div>
            <div>
              <button onClick={() => updateQuantity(index, item.quantity - 1)} style={{ marginRight: '5px' }}>-</button>
              <span style={{ margin: '0 10px' }}>{item.quantity}</span>
              <button onClick={() => updateQuantity(index, item.quantity + 1)} style={{ marginRight: '10px' }}>+</button>
              <button onClick={() => removeItem(index)} style={{ backgroundColor: '#dc3545' }}>Remove</button>
            </div>
          </div>
        ))}
        
        <div style={{ marginTop: '20px', textAlign: 'right' }}>
          <h2>Total: ₹{totalAmount}</h2>
          <button onClick={proceedToCheckout}>Proceed to Checkout</button>
        </div>
      </div>
    </div>
  );
}