import PropTypes from 'prop-types';
import { useState } from 'react';

function ProductCard({ product, onAddToCart }) {
  const [isHovered, setIsHovered] = useState(false);
  const [isAdding, setIsAdding] = useState(false);

  const handleAddToCart = async () => {
    setIsAdding(true);
    try {
      await onAddToCart(product);
      setTimeout(() => setIsAdding(false), 600);
    } catch (error) {
      setIsAdding(false);
    }
  };

  const price = `$${product.price.toFixed(2)}`;

  return (
    <article
      className={`product-card ${isHovered ? 'product-card--hovered' : ''} ${isAdding ? 'product-card--adding' : ''}`}
      onMouseEnter={() => setIsHovered(true)}
      onMouseLeave={() => setIsHovered(false)}
    >
      <div className="product-card__image">
        <img
          src={product.image}
          alt={product.name}
          loading="lazy"
          onError={(event) => {
            event.currentTarget.src =
              'https://images.unsplash.com/photo-1460925895917-afdab827c52f';
          }}
        />
        <div className="product-card__badge">
          <span className="product-card__price-badge">${product.price.toFixed(2)}</span>
        </div>
        <div className="product-card__overlay">
          <button
            className="product-card__quick-view"
            onClick={() => console.log('Quick view:', product.name)}
          >
            Quick View
          </button>
        </div>
      </div>
      <div className="product-card__body">
        <div className="product-card__header">
          <h3 className="product-card__title">{product.name}</h3>
          <div className="product-card__rating">
            <span className="product-card__stars">★★★★☆</span>
            <span className="product-card__reviews">(4.5)</span>
          </div>
        </div>
        <p className="product-card__description">{product.description}</p>
        <div className="product-card__features">
          <span className="product-card__feature">Premium Quality</span>
          <span className="product-card__feature">Fast Shipping</span>
        </div>
      </div>
      <footer className="product-card__footer">
        <div className="product-card__price-section">
          <span className="product-card__price">{price}</span>
          <span className="product-card__original-price">${(product.price * 1.2).toFixed(2)}</span>
        </div>
        <button
          type="button"
          className={`product-card__add-btn ${isAdding ? 'product-card__add-btn--loading' : ''}`}
          onClick={handleAddToCart}
          disabled={isAdding}
        >
          {isAdding ? (
            <>
              <span className="product-card__spinner"></span>
              Adding...
            </>
          ) : (
            'Add to Cart'
          )}
        </button>
      </footer>
    </article>
  );
}

ProductCard.propTypes = {
  product: PropTypes.shape({
    name: PropTypes.string.isRequired,
    description: PropTypes.string,
    price: PropTypes.number.isRequired,
    image: PropTypes.string
  }).isRequired,
  onAddToCart: PropTypes.func.isRequired
};

export default ProductCard;

