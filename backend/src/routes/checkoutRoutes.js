const express = require('express');
const CartItem = require('../models/CartItem');
const { buildCartResponse } = require('./cartRoutes');

const router = express.Router();

router.post('/', async (req, res, next) => {
  try {
    const { name, email } = req.body;

    if (!name || !email) {
      return res.status(400).json({ message: 'name and email are required' });
    }

    const cart = await buildCartResponse();

    if (cart.items.length === 0) {
      return res.status(400).json({ message: 'Cart is empty' });
    }

    const receipt = {
      customer: { name, email },
      total: cart.total,
      items: cart.items,
      timestamp: new Date().toISOString(),
      orderNumber: `VIBE-${Math.random().toString(36).slice(2, 8).toUpperCase()}`
    };

    await CartItem.deleteMany();

    res.status(201).json(receipt);
  } catch (error) {
    next(error);
  }
});

module.exports = router;

