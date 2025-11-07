const mongoose = require('mongoose');

const cartItemSchema = new mongoose.Schema(
  {
    product: {
      type: mongoose.Schema.Types.ObjectId,
      ref: 'Product',
      required: true
    },
    quantity: {
      type: Number,
      required: true,
      min: 1
    }
  },
  { timestamps: true }
);

cartItemSchema.virtual('subTotal').get(function deriveSubtotal() {
  if (!this.populated('product')) {
    return 0;
  }
  return this.quantity * this.product.price;
});

cartItemSchema.index({ product: 1 }, { unique: true });

module.exports = mongoose.model('CartItem', cartItemSchema);

