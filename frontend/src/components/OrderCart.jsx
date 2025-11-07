import { useState } from 'react';
import PropTypes from 'prop-types';
import CartItemRow from './CartItemRow';

function OrderCart({ cart, onQuantityChange, onRemove, cartLoading, onCheckout, checkoutForm, onCheckoutFieldChange, checkoutLoading, checkoutError }) {
  const [isExpanded, setIsExpanded] = useState(true);

  return (
    <>
      <button className="order-cart__toggle" onClick={() => setIsExpanded(!isExpanded)}>
        🛒 {cart.items.length > 0 && <span className="cart-badge">{cart.items.length}</span>}
      </button>
      
      <div className={`order-cart ${isExpanded ? 'order-cart--open' : ''}`}>
        <div className="order-cart__header">
          <h2>🛒 Your Cart</h2>
          <button className="order-cart__close" onClick={() => setIsExpanded(false)}>×</button>
        </div>

      {isExpanded && (
        <div className="order-cart__content">
          {cart.items.length === 0 ? (
            <div className="order-cart__empty">
              <div className="empty-cart__icon">🛒</div>
              <p>Your cart is empty</p>
              <p className="empty-cart__subtitle">Add some amazing products to get started!</p>
            </div>
          ) : (
            <>
              <div className="order-cart__items">
                {cart.items.map((item) => (
                  <CartItemRow
                    key={item.productId}
                    item={item}
                    onRemove={() => onRemove(item.productId)}
                    onQuantityChange={(quantity) => onQuantityChange(item.productId, quantity)}
                    disabled={cartLoading}
                  />
                ))}
              </div>

              <div className="order-cart__summary">
                <div className="summary__row">
                  <span>Subtotal</span>
                  <span>${cart.total.toFixed(2)}</span>
                </div>
                <div className="summary__row">
                  <span>Shipping</span>
                  <span>Free</span>
                </div>
                <div className="summary__row summary__total">
                  <span>Total</span>
                  <strong>${cart.total.toFixed(2)}</strong>
                </div>
              </div>

              <form className="order-cart__checkout" onSubmit={onCheckout}>
                <h3>Checkout Details</h3>
                
                <div className="form__group">
                  <label htmlFor="name">Full Name</label>
                  <input
                    id="name"
                    name="name"
                    type="text"
                    required
                    placeholder="Enter your full name"
                    value={checkoutForm.name}
                    onChange={onCheckoutFieldChange}
                    disabled={checkoutLoading}
                    className="form__input"
                  />
                </div>

                <div className="form__group">
                  <label htmlFor="email">Email Address</label>
                  <input
                    id="email"
                    name="email"
                    type="email"
                    required
                    placeholder="Enter your email address"
                    value={checkoutForm.email}
                    onChange={onCheckoutFieldChange}
                    disabled={checkoutLoading}
                    className="form__input"
                  />
                </div>

                {checkoutError && (
                  <div className="checkout__error" role="alert">
                    ⚠️ {checkoutError}
                  </div>
                )}

                <button 
                  type="submit" 
                  className="checkout__button"
                  disabled={checkoutLoading || cart.items.length === 0}
                >
                  {checkoutLoading ? (
                    <span className="button__loading">
                      <span className="loading__spinner"></span>
                      Processing...
                    </span>
                  ) : (
                    <span>🛍️ Complete Order - ${cart.total.toFixed(2)}</span>
                  )}
                </button>
              </form>
            </>
          )}
        </div>
      )}
      </div>
    </>
  );
}

OrderCart.propTypes = {
  cart: PropTypes.shape({
    items: PropTypes.array.isRequired,
    total: PropTypes.number.isRequired
  }).isRequired,
  onQuantityChange: PropTypes.func.isRequired,
  onRemove: PropTypes.func.isRequired,
  cartLoading: PropTypes.bool,
  onCheckout: PropTypes.func.isRequired,
  checkoutForm: PropTypes.shape({
    name: PropTypes.string.isRequired,
    email: PropTypes.string.isRequired
  }).isRequired,
  onCheckoutFieldChange: PropTypes.func.isRequired,
  checkoutLoading: PropTypes.bool,
  checkoutError: PropTypes.string
};

OrderCart.defaultProps = {
  cartLoading: false,
  checkoutLoading: false,
  checkoutError: null
};

export default OrderCart;