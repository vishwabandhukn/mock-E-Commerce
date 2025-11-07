const express = require('express');
const cors = require('cors');
const morgan = require('morgan');

const { connectDB } = require('./config/db');
const seedProducts = require('./utils/seedProducts');
const productRoutes = require('./routes/productRoutes');
const { router: cartRoutes } = require('./routes/cartRoutes');
const checkoutRoutes = require('./routes/checkoutRoutes');

const PORT = process.env.PORT || 4000;

async function bootstrap() {
  await connectDB();
  await seedProducts();

  const app = express();

  app.use(cors());
  app.use(express.json());
  app.use(morgan('dev'));

  app.get('/api/health', (req, res) => {
    res.json({ status: 'ok' });
  });

  app.use('/api/products', productRoutes);
  app.use('/api/cart', cartRoutes);
  app.use('/api/checkout', checkoutRoutes);

  app.use((req, res) => {
    res.status(404).json({ message: 'Not Found' });
  });

  app.use((err, req, res, next) => {
    // eslint-disable-next-line no-console
    console.error(err);
    res
      .status(err.status || 500)
      .json({ message: err.message || 'Internal Server Error' });
  });

  app.listen(PORT, () => {
    // eslint-disable-next-line no-console
    console.log(`API server running on http://localhost:${PORT}`);
  });
}

bootstrap().catch((error) => {
  // eslint-disable-next-line no-console
  console.error('Failed to start server', error);
  process.exit(1);
});

