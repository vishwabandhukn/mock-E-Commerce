import { useEffect, useMemo, useState } from 'react';
import './App.css';
import {
  getProducts,
  getCart,
  addToCart,
  removeFromCart,
  checkout,
  healthcheck
} from './services/api';
import ProductCard from './components/ProductCard';
import OrderCart from './components/OrderCart';
import ReceiptModal from './components/ReceiptModal';
import Toast from './components/Toast';

function App() {
  const [products, setProducts] = useState([]);
  const [filteredProducts, setFilteredProducts] = useState([]);
  const [cart, setCart] = useState({ items: [], total: 0 });
  const [loading, setLoading] = useState(true);
  const [cartLoading, setCartLoading] = useState(false);
  const [error, setError] = useState(null);
  const [searchTerm, setSearchTerm] = useState('');
  const [isCartOpen, setIsCartOpen] = useState(false);
  const [checkoutForm, setCheckoutForm] = useState({ name: '', email: '' });
  const [receipt, setReceipt] = useState(null);
  const [toast, setToast] = useState(null);
  const [isReceiptOpen, setReceiptOpen] = useState(false);
  const [checkoutError, setCheckoutError] = useState(null);
  const [checkoutLoading, setCheckoutLoading] = useState(false);

  useEffect(() => {
    async function bootstrap() {
      try {
        setLoading(true);
        const [productData, cartData] = await Promise.all([
          getProducts(),
          getCart()
        ]);
        setProducts(productData);
        setFilteredProducts(productData);
        setCart(cartData);
        setError(null);
      } catch (err) {
        setError(err.message || 'Failed to load storefront');
      } finally {
        setLoading(false);
      }
    }

    bootstrap();
  }, []);

  useEffect(() => {
    const filtered = products.filter(product => 
      product.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
      product.description.toLowerCase().includes(searchTerm.toLowerCase())
    );
    setFilteredProducts(filtered);
  }, [searchTerm, products]);

  const cartCount = useMemo(
    () => cart.items.reduce((sum, item) => sum + item.quantity, 0),
    [cart.items]
  );

  async function refreshCart(requestPromise) {
    try {
      setCartLoading(true);
      const updatedCart = await requestPromise;
      setCart(updatedCart);
      setError(null);
    } catch (err) {
      setError(err.message || 'Unable to update cart');
    } finally {
      setCartLoading(false);
    }
  }

  function handleAddToCart(productId) {
    const existing = cart.items.find((item) => item.productId === productId);
    const nextQuantity = existing ? existing.quantity + 1 : 1;
    const product = products.find((p) => p._id === productId);
    refreshCart(addToCart(productId, nextQuantity))
      .then(() => setToast({ message: `${product.name} added to cart!`, type: 'success' }))
      .catch((err) => setToast({ message: `Failed to add ${product.name} to cart`, type: 'error' }));
  }

  function handleQuantityChange(productId, quantity) {
    refreshCart(addToCart(productId, quantity));
  }

  function handleRemove(productId) {
    refreshCart(removeFromCart(productId));
  }

  function onCheckoutFieldChange(event) {
    const { name, value } = event.target;
    setCheckoutForm((prev) => ({ ...prev, [name]: value }));
  }

  async function handleCheckout(event) {
    event.preventDefault();

    setCheckoutError(null);
    setCheckoutLoading(true);

    if (!checkoutForm.name.trim() || !checkoutForm.email.trim()) {
      setCheckoutError('Please fill in all fields');
      setToast({ message: 'Please fill in all fields', type: 'warning' });
      setCheckoutLoading(false);
      return;
    }

    if (!/\S+@\S+\.\S+/.test(checkoutForm.email)) {
      setCheckoutError('Please enter a valid email');
      setToast({ message: 'Please enter a valid email', type: 'warning' });
      setCheckoutLoading(false);
      return;
    }

    try {
      const payload = {
        name: checkoutForm.name,
        email: checkoutForm.email
      };

      const receiptResponse = await checkout(payload);
      setReceipt(receiptResponse);
      setReceiptOpen(true);
      setCheckoutForm({ name: '', email: '' });
      setToast({ message: 'Order placed successfully!', type: 'success' });
      const resetCart = await getCart();
      setCart(resetCart);
    } catch (err) {
      setCheckoutError(err.message || 'Checkout failed');
      setToast({ message: 'Failed to place order', type: 'error' });
    } finally {
      setCheckoutLoading(false);
    }
  }

  return (
    <div className="app">
      <header className="app__header">
        <div className="header__brand">
          <h1>🛍️ Vibe Commerce</h1>
          <p>Discover amazing products at great prices</p>
        </div>
        
        <div className="header__search">
          <div className="search__container">
            <span className="search__icon">🔍</span>
            <input
              type="text"
              placeholder="Search products..."
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
              className="search__input"
            />
            {searchTerm && (
              <button 
                className="search__clear"
                onClick={() => setSearchTerm('')}
              >
                ✕
              </button>
            )}
          </div>
        </div>

        <div className="header__actions">
          <button 
            className="cart__toggle"
            onClick={() => setIsCartOpen(!isCartOpen)}
          >
            <span className="cart__icon">🛒</span>
            <span className="cart__count">{cartCount}</span>
          </button>
        </div>
      </header>

      {error && (
        <div className="app__error" role="alert">
          {error}
        </div>
      )}

      <main className="app__content">
        <section className="app__products" aria-live="polite">
          {loading ? (
            <div className="app__loading">
              <div className="loading-spinner">
                <div className="loading-spinner__circle"></div>
                <p className="loading-spinner__text">Loading amazing products...</p>
              </div>
            </div>
          ) : (
            <>
              {searchTerm && (
                <div className="search__results">
                  <p>Found {filteredProducts.length} products matching "{searchTerm}"</p>
                  {filteredProducts.length === 0 && (
                    <p className="search__no-results">
                      No products found. Try a different search term.
                    </p>
                  )}
                </div>
              )}
              <div className="product-grid">
                {filteredProducts.map((product) => (
                  <ProductCard
                    key={product._id}
                    product={product}
                    onAddToCart={() => handleAddToCart(product._id)}
                  />
                ))}
              </div>
            </>
          )}
        </section>

        <aside className={`app__sidebar ${isCartOpen ? 'app__sidebar--open' : ''}`}>
          <OrderCart
            cart={cart}
            onQuantityChange={handleQuantityChange}
            onRemove={handleRemove}
            cartLoading={cartLoading}
            onCheckout={handleCheckout}
            checkoutForm={checkoutForm}
            onCheckoutFieldChange={onCheckoutFieldChange}
            checkoutLoading={checkoutLoading}
            checkoutError={checkoutError}
          />
        </aside>
      </main>

      <ReceiptModal
        isOpen={isReceiptOpen}
        receipt={receipt}
        onClose={() => setReceiptOpen(false)}
      />
      
      {toast && (
        <Toast
          message={toast.message}
          type={toast.type}
          onClose={() => setToast(null)}
        />
      )}
    </div>
  );
}

export default App;
