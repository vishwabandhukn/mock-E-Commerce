# Vibe Commerce Mock Cart

Full-stack shopping cart demo used for Vibe Commerce screenings. The project showcases typical e-commerce flows: product catalog, cart management, totals, and mock checkout. The backend exposes REST APIs via Express with MongoDB persistence (in-memory by default) while the frontend is built with React + Vite.

## Features

- Product listing grid sourced from Fake Store API (falls back to curated seed data)
- Add, update, and remove cart items with automatic totals
- Checkout form (name + email) returning a generated receipt
- Responsive design with soft-error handling and loading states
- In-memory MongoDB (MongoMemoryServer) for zero-config persistence; optionally point to a real Mongo instance via `MONGO_URL`

## Project Structure

```
backend/   # Express + MongoDB API server
frontend/  # React + Vite single-page app
```

## Prerequisites

- Node.js 18+

## Getting Started

Install all dependencies and launch both servers in development mode:

```bash
npm install
npm run dev
```

This starts the API on `http://localhost:4000` and the Vite dev server on `http://localhost:5173` (or the next available port). The frontend is pre-configured to call the API at `http://localhost:4000`. Override the base URL by creating `frontend/.env`:

```bash
VITE_API_URL=http://localhost:4000
```

### Running Individually

```bash
# Backend only
npm run backend

# Frontend only
npm run frontend

# Production build (frontend)
npm run build
```

## Backend Environment

The API attempts to connect to a `MONGO_URL` if provided, otherwise spins up an in-memory MongoDB instance. To use a real MongoDB database, set:

```bash
set MONGO_URL=mongodb://localhost:27017/vibe-commerce   # Windows PowerShell
export MONGO_URL=mongodb://localhost:27017/vibe-commerce  # macOS/Linux
```

Disable the Fake Store API seeding by setting `DISABLE_FAKE_STORE=true` before starting the server.

## API Overview

- `GET /api/products` — Fetch product catalog
- `GET /api/cart` — Retrieve cart items and total
- `POST /api/cart` — Upsert cart item `{ productId, quantity }`
- `DELETE /api/cart/:id` — Remove product from cart
- `POST /api/checkout` — Submit `{ name, email }`; returns mock receipt and clears cart

## Testing & Linting

- `npm run build` (from root) verifies the frontend compiles
- Add your preferred test runner or lint config as needed

## Notes

- The backend uses `fetch` to request Fake Store data. If the request fails, it gracefully falls back to local seed products.
- All code remains ASCII to ease diffs and cross-platform support.
- Feel free to extend the project with authentication, order history, or payment gateway integrations.

