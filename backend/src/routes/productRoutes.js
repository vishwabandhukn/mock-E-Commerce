const express = require('express');
const Product = require('../models/Product');

const router = express.Router();

router.get('/', async (req, res, next) => {
  try {
    const products = await Product.find().lean();
    res.json(products);
  } catch (error) {
    next(error);
  }
});

module.exports = router;

