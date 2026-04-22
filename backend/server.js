// backend/server.js
// Entry point — Express app with all routes mounted

require('dotenv').config();
const express = require('express');
const cors    = require('cors');

const app = express();

/* ── Middleware ───────────────────────────────────────────── */
app.use(cors({ origin: process.env.CLIENT_URL || 'http://localhost:3000', credentials: true }));
app.use(express.json());

/* ── Routes ───────────────────────────────────────────────── */
app.use('/api/auth',      require('./routes/auth'));
app.use('/api/products',  require('./routes/products'));
app.use('/api/orders',    require('./routes/orders'));
app.use('/api/customers', require('./routes/customers'));
app.use('/api/export',    require('./routes/export'));

/* ── Health check ─────────────────────────────────────────── */
app.get('/api/health', (_req, res) => res.json({ status: 'ok', timestamp: new Date() }));

/* ── 404 handler ──────────────────────────────────────────── */
app.use((_req, res) => res.status(404).json({ message: 'Route not found.' }));

/* ── Start ────────────────────────────────────────────────── */
const PORT = process.env.PORT || 5000;
app.listen(PORT, () => {
  console.log(`🚀  Server running on http://localhost:${PORT}`);
});
