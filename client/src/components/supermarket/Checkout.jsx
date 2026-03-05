// client/src/components/supermarket/Checkout.jsx
import { useCart } from '../../hooks/useCart'

const Checkout = ({ isOpen, onClose, onCheckout }) => {
  const { cart, updateQuantity, removeFromCart } = useCart()

  return (
    <div className={`checkout-panel ${isOpen ? 'open' : ''}`}>
      <div className="checkout-header">
        <h2>Your Cart</h2>
        <button 
          onClick={onClose}
          style={{
            background: 'none',
            border: 'none',
            color: 'white',
            fontSize: '1.5rem',
            cursor: 'pointer'
          }}
        >
          ×
        </button>
      </div>

      {cart.items.length === 0 ? (
        <p style={{ textAlign: 'center', color: '#888', marginTop: '40px' }}>
          Your cart is empty
        </p>
      ) : (
        <>
          {cart.items.map((item) => (
            <div key={item.product._id} className="checkout-item">
              <div 
                className="checkout-item-image"
                style={{ background: item.product.color || '#333' }}
              />
              <div className="checkout-item-details">
                <div className="checkout-item-name">{item.product.name}</div>
                <div className="checkout-item-price">
                  ${item.price.toFixed(2)} each
                </div>
              </div>
              <div className="quantity-control">
                <button 
                  className="quantity-btn"
                  onClick={() => updateQuantity(item.product._id, item.quantity - 1)}
                >
                  −
                </button>
                <span>{item.quantity}</span>
                <button 
                  className="quantity-btn"
                  onClick={() => updateQuantity(item.product._id, item.quantity + 1)}
                >
                  +
                </button>
              </div>
              <button
                onClick={() => removeFromCart(item.product._id)}
                style={{
                  background: 'none',
                  border: 'none',
                  color: '#ff4757',
                  cursor: 'pointer',
                  fontSize: '1.2rem'
                }}
              >
                🗑
              </button>
            </div>
          ))}

          <div className="checkout-total">
            <div className="total-row">
              <span>Subtotal</span>
              <span>${cart.total.toFixed(2)}</span>
            </div>
            <div className="total-row">
              <span>Tax (8%)</span>
              <span>${(cart.total * 0.08).toFixed(2)}</span>
            </div>
            <div className="total-row final">
              <span>Total</span>
              <span>${(cart.total * 1.08).toFixed(2)}</span>
            </div>
          </div>

          <div className="payment-methods">
            <h3 style={{ marginBottom: '16px', fontSize: '1.1rem' }}>
              Select Payment Method
            </h3>
            <button className="payment-method" onClick={onCheckout}>
              <span>💳</span>
              <div style={{ textAlign: 'left' }}>
                <div style={{ fontWeight: 600 }}>Pay with Card</div>
                <div style={{ fontSize: '0.85rem', color: '#888' }}>
                  Visa, Mastercard, etc.
                </div>
              </div>
            </button>
            <button className="payment-method" onClick={onCheckout}>
              <span>📱</span>
              <div style={{ textAlign: 'left' }}>
                <div style={{ fontWeight: 600 }}>M-Pesa</div>
                <div style={{ fontSize: '0.85rem', color: '#888' }}>
                  Pay with mobile money
                </div>
              </div>
            </button>
          </div>
        </>
      )}
    </div>
  )
}

export default Checkout