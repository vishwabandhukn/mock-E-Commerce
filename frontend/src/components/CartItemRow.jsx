import PropTypes from 'prop-types';

function CartItemRow({ item, onQuantityChange, onRemove, disabled }) {
  const price = `$${item.price.toFixed(2)}`;
  const subTotal = `$${item.subTotal.toFixed(2)}`;

  return (
    <li className="cart-item">
      <div className="cart-item__info">
        <h3>{item.name}</h3>
        <span>{price}</span>
      </div>
      <div className="cart-item__actions">
        <div className="cart-item__quantity">
          <button
            type="button"
            onClick={() => onQuantityChange(item.quantity - 1)}
            disabled={disabled || item.quantity <= 1}
            aria-label={`Decrease quantity of ${item.name}`}
          >
            -
          </button>
          <span>{item.quantity}</span>
          <button
            type="button"
            onClick={() => onQuantityChange(item.quantity + 1)}
            disabled={disabled}
            aria-label={`Increase quantity of ${item.name}`}
          >
            +
          </button>
        </div>
        <strong>{subTotal}</strong>
        <button
          type="button"
          className="cart-item__remove"
          onClick={onRemove}
          disabled={disabled}
        >
          Remove
        </button>
      </div>
    </li>
  );
}

CartItemRow.propTypes = {
  item: PropTypes.shape({
    productId: PropTypes.string.isRequired,
    name: PropTypes.string.isRequired,
    price: PropTypes.number.isRequired,
    quantity: PropTypes.number.isRequired,
    subTotal: PropTypes.number.isRequired
  }).isRequired,
  onQuantityChange: PropTypes.func.isRequired,
  onRemove: PropTypes.func.isRequired,
  disabled: PropTypes.bool
};

CartItemRow.defaultProps = {
  disabled: false
};

export default CartItemRow;

