export default function ProductCard({ product, onAddToCart }) {
  return (
    <div style={{
      border: '1px solid #ddd',
      borderRadius: '8px',
      padding: '15px',
      backgroundColor: 'white',
      transition: 'transform 0.2s'
    }}>
      <h3>{product.name}</h3>
      <p style={{ color: '#666', margin: '10px 0' }}>{product.description}</p>
      <p style={{ fontSize: '24px', color: '#007bff', fontWeight: 'bold' }}>
        ₹{product.price}
      </p>
      <p>Stock: {product.stock}</p>
      <button onClick={() => onAddToCart(product)}>
        Add to Cart
      </button>
    </div>
  );
}