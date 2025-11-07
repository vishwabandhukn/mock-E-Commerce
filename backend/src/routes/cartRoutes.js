const express = require('express');
const CartItem = require('../models/CartItem');
const Product = require('../models/Product');

const router = express.Router();

async function buildCartResponse() {
  const items = await CartItem.find().populate('product').lean();

  const cartItems = items.map((item) => ({
    _id: item._id,
    productId: item.product._id,
    name: item.product.name,
    price: item.product.price,
    quantity: item.quantity,
    subTotal: Number((item.quantity * item.product.price).toFixed(2))
  }));

  const total = Number(
    cartItems.reduce((sum, item) => sum + item.subTotal, 0).toFixed(2)
  );

  return { items: cartItems, total };
}

router.get('/', async (req, res, next) => {
  try {
    const cart = await buildCartResponse();
    res.json(cart);
  } catch (error) {
    next(error);
  }
});

router.post('/', async (req, res, next) => {
  try {
    const { productId, quantity } = req.body;

    if (!productId) {
      return res.status(400).json({ message: 'productId is required' });
    }

    const product = await Product.findById(productId);

    if (!product) {
      return res.status(404).json({ message: 'Product not found' });
    }

    if (!quantity || quantity < 1) {
      await CartItem.findOneAndDelete({ product: productId });
    } else {
      await CartItem.findOneAndUpdate(
        { product: productId },
        { product: productId, quantity },
        { upsert: true, new: true, setDefaultsOnInsert: true }
      );
    }

    const cart = await buildCartResponse();
    res.status(201).json(cart);
  } catch (error) {
    next(error);
  }
});

router.delete('/:id', async (req, res, next) => {
  try {
    const { id } = req.params;
    await CartItem.findOneAndDelete({ product: id });
    const cart = await buildCartResponse();
    res.json(cart);
  } catch (error) {
    next(error);
  }
});

module.exports = { router, buildCartResponse };

