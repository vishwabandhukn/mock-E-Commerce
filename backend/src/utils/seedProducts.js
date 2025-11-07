const Product = require('../models/Product');

const FALLBACK_PRODUCTS = [
  // Electronics & Tech
  {
    name: 'Aurora Pulse Headphones',
    price: 129.99,
    image: 'https://images.unsplash.com/photo-1516747773449-7ad4f8f41c86',
    description: 'Immersive over-ear headphones with adaptive noise cancellation.'
  },
  {
    name: 'NovaFit Tracker',
    price: 59.0,
    image: 'https://images.unsplash.com/photo-1511732351661-5c2be6993761',
    description: 'Sleek fitness wearable with 7-day battery life and sleep tracking.'
  },
  {
    name: 'WaveCharge Dock',
    price: 39.99,
    image: 'https://images.unsplash.com/photo-1583391733956-6c971a7dcd5e',
    description: 'Multi-device wireless charging dock with nightstand mode.'
  },
  {
    name: 'Quantum Wireless Mouse',
    price: 79.99,
    image: 'https://images.unsplash.com/photo-1527864550417-7fd91fc51a46',
    description: 'Ergonomic wireless mouse with precision tracking and RGB lighting.'
  },
  {
    name: 'EchoSlate Tablet',
    price: 299.99,
    image: 'https://images.unsplash.com/photo-1544244015-0df4b3ffc6b0',
    description: '10-inch tablet with stylus support and cloud synchronization.'
  },
  
  // Home & Living
  {
    name: 'Lumen Smart Lamp',
    price: 89.5,
    image: 'https://images.unsplash.com/photo-1505691723518-36a5ac3be353',
    description: 'Voice-controlled ambient lighting with dynamic color presets.'
  },
  {
    name: 'SonicBrew Portable',
    price: 149.0,
    image: 'https://images.unsplash.com/photo-1521017432531-fbd92d768814',
    description: 'Barista-grade espresso maker for travelers and minimalists.'
  },
  {
    name: 'AromaSphere Diffuser',
    price: 45.99,
    image: 'https://images.unsplash.com/photo-1558618666-fcd25c85cd64',
    description: 'Smart aromatherapy diffuser with app control and LED lighting.'
  },
  {
    name: 'Zenith Air Purifier',
    price: 199.99,
    image: 'https://images.unsplash.com/photo-1558618666-fcd25c85cd64',
    description: 'HEPA air purifier with quiet operation and smart sensors.'
  },
  
  // Fashion & Accessories
  {
    name: 'Titan Leather Wallet',
    price: 89.99,
    image: 'https://images.unsplash.com/photo-1627123424574-724758594e93',
    description: 'Premium leather wallet with RFID protection and minimalist design.'
  },
  {
    name: 'Velocity Running Shoes',
    price: 129.99,
    image: 'https://images.unsplash.com/photo-1542291026-7eec264c27ff',
    description: 'Lightweight running shoes with responsive cushioning technology.'
  },
  {
    name: 'Solaris Sunglasses',
    price: 159.99,
    image: 'https://images.unsplash.com/photo-1572635196237-14b3f281503f',
    description: 'Polarized sunglasses with UV protection and durable frame.'
  },
  
  // Books & Stationery
  {
    name: 'EchoSlate Notebook',
    price: 24.99,
    image: 'https://images.unsplash.com/photo-1518976024611-28bf4b48222e',
    description: 'Reusable smart notebook that syncs handwritten notes to the cloud.'
  },
  {
    name: 'Artisan Sketch Set',
    price: 79.99,
    image: 'https://images.unsplash.com/photo-1513475382585-d06e58bcb0e0',
    description: 'Professional drawing set with graphite pencils and sketchbook.'
  },
  {
    name: 'Mindful Journal',
    price: 34.99,
    image: 'https://images.unsplash.com/photo-1544947950-fa07a98d237f',
    description: 'Guided journal with prompts for mindfulness and gratitude practice.'
  },
  
  // Health & Wellness
  {
    name: 'YogaFlow Mat',
    price: 69.99,
    image: 'https://images.unsplash.com/photo-1544367567-0f2fcb009e0b',
    description: 'Premium yoga mat with alignment guides and non-slip surface.'
  },
  {
    name: 'HydroFlask Pro',
    price: 49.99,
    image: 'https://images.unsplash.com/photo-1602143407151-7111542de6e8',
    description: 'Insulated water bottle with temperature display and smart reminders.'
  },
  {
    name: 'Pulse Massage Gun',
    price: 199.99,
    image: 'https://images.unsplash.com/photo-1540497077202-7c8a3999166f',
    description: 'Deep tissue massage gun with multiple speed settings and attachments.'
  },
  
  // Kitchen & Dining
  {
    name: 'Ceramic Chef Knife',
    price: 89.99,
    image: 'https://images.unsplash.com/photo-1593618998160-e34014e67546',
    description: 'Professional ceramic knife set with ergonomic handles and sharp blades.'
  },
  {
    name: 'Bamboo Serving Board',
    price: 59.99,
    image: 'https://images.unsplash.com/photo-1556909114-f6e7ad7d3136',
    description: 'Eco-friendly bamboo cutting board with juice grooves and handles.'
  },
  {
    name: 'Thermal Food Container',
    price: 39.99,
    image: 'https://images.unsplash.com/photo-1556909114-44ab1f97e301',
    description: 'Stainless steel food container with vacuum insulation and leak-proof lid.'
  }
];

async function fetchFakeStoreProducts() {
  if (process.env.DISABLE_FAKE_STORE === 'true') {
    return null;
  }

  if (typeof fetch !== 'function') {
    return null;
  }

  try {
    const response = await fetch('https://fakestoreapi.com/products?limit=8');

    if (!response.ok) {
      return null;
    }

    const data = await response.json();

    const normalized = data
      .filter((item) => item && item.title && item.price)
      .map((item) => ({
        name: item.title,
        price: Number(item.price) || 0,
        image: item.image,
        description: item.description
      }))
      .filter((item) => item.price > 0);

    return normalized.length ? normalized : null;
  } catch (error) {
    return null;
  }
}

async function seedProducts() {
  const count = await Product.estimatedDocumentCount();
  if (count > 0) {
    return Product.find();
  }

  const externalProducts = await fetchFakeStoreProducts();
  const productsToInsert = externalProducts || FALLBACK_PRODUCTS;

  return Product.insertMany(productsToInsert);
}

module.exports = seedProducts;

