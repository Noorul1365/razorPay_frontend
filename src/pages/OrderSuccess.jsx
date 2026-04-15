import { useLocation, useNavigate } from 'react-router-dom';

export default function OrderSuccess() {
  const location = useLocation();
  const navigate = useNavigate();
  const { orderId } = location.state || {};

  return (
    <div className="container" style={{ textAlign: 'center', marginTop: '50px' }}>
      <h1>🎉 Order Placed Successfully!</h1>
      <p>Your order ID is: <strong>{orderId}</strong></p>
      <p>You will receive a confirmation email shortly.</p>
      <button onClick={() => navigate('/')}>Continue Shopping</button>
    </div>
  );
}