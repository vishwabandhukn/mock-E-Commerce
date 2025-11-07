import PropTypes from 'prop-types';

function ReceiptModal({ isOpen, receipt, onClose }) {
  if (!isOpen || !receipt) {
    return null;
  }

  return (
    <div className="modal__backdrop" role="dialog" aria-modal="true">
      <div className="modal">
        <header className="modal__header">
          <h2>Order Confirmed</h2>
          <button type="button" onClick={onClose} aria-label="Close receipt">
            ×
          </button>
        </header>

        <section className="modal__body">
          <p>Thank you, {receipt.customer.name}! Your order is complete.</p>
          <div className="modal__summary">
            <span>Order</span>
            <strong>{receipt.orderNumber}</strong>
          </div>
          <div className="modal__summary">
            <span>Total Charged</span>
            <strong>${receipt.total.toFixed(2)}</strong>
          </div>
          <div className="modal__summary">
            <span>Timestamp</span>
            <time dateTime={receipt.timestamp}>
              {new Date(receipt.timestamp).toLocaleString()}
            </time>
          </div>

          <ul className="modal__items">
            {receipt.items.map((item) => (
              <li key={item.productId}>
                <span>
                  {item.quantity} × {item.name}
                </span>
                <span>${item.subTotal.toFixed(2)}</span>
              </li>
            ))}
          </ul>

          <p className="modal__footer-note">
            A confirmation email is on its way to {receipt.customer.email}.
          </p>
        </section>

        <footer className="modal__footer">
          <button type="button" onClick={onClose}>
            Back to Store
          </button>
        </footer>
      </div>
    </div>
  );
}

ReceiptModal.propTypes = {
  isOpen: PropTypes.bool,
  receipt: PropTypes.shape({
    customer: PropTypes.shape({
      name: PropTypes.string.isRequired,
      email: PropTypes.string.isRequired
    }).isRequired,
    total: PropTypes.number.isRequired,
    items: PropTypes.arrayOf(
      PropTypes.shape({
        productId: PropTypes.string.isRequired,
        name: PropTypes.string.isRequired,
        quantity: PropTypes.number.isRequired,
        subTotal: PropTypes.number.isRequired
      })
    ).isRequired,
    timestamp: PropTypes.string.isRequired,
    orderNumber: PropTypes.string.isRequired
  }),
  onClose: PropTypes.func
};

ReceiptModal.defaultProps = {
  isOpen: false,
  receipt: null,
  onClose: () => {}
};

export default ReceiptModal;

