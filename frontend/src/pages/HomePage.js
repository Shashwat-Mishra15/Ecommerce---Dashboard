// frontend/src/pages/HomePage.js
import React, { useEffect, useState } from 'react';
import { Link } from 'react-router-dom';
import API from '../api';
import ProductCard from '../components/ProductCard';

const CATEGORIES = [
  { name: 'Electronics',     emoji: '⚡', color: '#667eea' },
  { name: 'Clothing',        emoji: '👗', color: '#f5576c' },
  { name: 'Home & Kitchen',  emoji: '🏠', color: '#4facfe' },
  { name: 'Books',           emoji: '📚', color: '#43e97b' },
  { name: 'Beauty & Health', emoji: '✨', color: '#fa709a' },
];

export default function HomePage() {
  const [featured, setFeatured] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    API.get('/products')
      .then(r => setFeatured(r.data.slice(0, 8)))
      .catch(console.error)
      .finally(() => setLoading(false));
  }, []);

  return (
    <div>
      {/* Hero */}
      <section style={{
        background: 'linear-gradient(135deg, #1a1a2e 0%, #16213e 60%, #0f3460 100%)',
        padding: '80px 20px',
        textAlign: 'center',
        position: 'relative',
        overflow: 'hidden',
      }}>
        {/* Decorative circles */}
        {[...Array(3)].map((_, i) => (
          <div key={i} style={{
            position: 'absolute',
            borderRadius: '50%',
            border: '1px solid rgba(233,69,96,.2)',
            width: 300 + i * 200,
            height: 300 + i * 200,
            top: '50%', left: '50%',
            transform: 'translate(-50%,-50%)',
            pointerEvents: 'none',
          }} />
        ))}
        <p style={{ color: '#e94560', fontSize: 13, fontWeight: 700, letterSpacing: 3, textTransform: 'uppercase', marginBottom: 16 }}>
          Welcome to ShopNova
        </p>
        <h1 style={{ fontFamily: "'Playfair Display', serif", color: '#fff', fontSize: 'clamp(36px,6vw,72px)', lineHeight: 1.1, marginBottom: 24 }}>
          Discover Products<br />You'll <span style={{ color: '#e94560' }}>Love</span>
        </h1>
        <p style={{ color: 'rgba(255,255,255,.65)', fontSize: 18, maxWidth: 500, margin: '0 auto 40px' }}>
          Premium quality products across Electronics, Clothing, Books, and more — delivered fast.
        </p>
        <div style={{ display: 'flex', gap: 16, justifyContent: 'center', flexWrap: 'wrap' }}>
          <Link to="/products" style={{
            background: '#e94560', color: '#fff', padding: '14px 36px',
            borderRadius: 8, fontSize: 16, fontWeight: 700, display: 'inline-block',
          }}>Shop Now →</Link>
          <Link to="/products" style={{
            background: 'transparent', color: '#fff', padding: '14px 36px',
            borderRadius: 8, fontSize: 16, fontWeight: 500,
            border: '1.5px solid rgba(255,255,255,.4)', display: 'inline-block',
          }}>Browse Categories</Link>
        </div>
      </section>

      {/* Stats bar */}
      <section style={{ background: '#e94560', padding: '20px' }}>
        <div style={{ maxWidth: 1200, margin: '0 auto', display: 'flex', justifyContent: 'space-around', flexWrap: 'wrap', gap: 16 }}>
          {[['30+', 'Products'], ['5', 'Categories'], ['Free', 'Shipping'], ['Easy', 'Returns']].map(([val, label]) => (
            <div key={label} style={{ textAlign: 'center', color: '#fff' }}>
              <div style={{ fontSize: 24, fontWeight: 900, fontFamily: "'Playfair Display', serif" }}>{val}</div>
              <div style={{ fontSize: 13, opacity: .85 }}>{label}</div>
            </div>
          ))}
        </div>
      </section>

      {/* Categories */}
      <section style={{ padding: '60px 20px', maxWidth: 1200, margin: '0 auto' }}>
        <h2 style={{ fontFamily: "'Playfair Display', serif", fontSize: 32, marginBottom: 8 }}>Shop by Category</h2>
        <p style={{ color: '#6b6b8a', marginBottom: 36 }}>Find exactly what you're looking for</p>
        <div style={{ display: 'flex', gap: 16, flexWrap: 'wrap' }}>
          {CATEGORIES.map(cat => (
            <Link
              key={cat.name}
              to={`/products?category=${encodeURIComponent(cat.name)}`}
              style={{
                flex: '1 1 160px',
                background: '#fff',
                borderRadius: 12,
                padding: '24px 20px',
                textAlign: 'center',
                boxShadow: '0 4px 24px rgba(26,26,46,.07)',
                transition: 'transform .2s, box-shadow .2s',
                border: `2px solid transparent`,
              }}
              onMouseEnter={e => { e.currentTarget.style.transform='translateY(-4px)'; e.currentTarget.style.borderColor=cat.color; }}
              onMouseLeave={e => { e.currentTarget.style.transform='translateY(0)'; e.currentTarget.style.borderColor='transparent'; }}
            >
              <div style={{ fontSize: 40, marginBottom: 10 }}>{cat.emoji}</div>
              <div style={{ fontSize: 14, fontWeight: 600, color: '#1a1a2e' }}>{cat.name}</div>
            </Link>
          ))}
        </div>
      </section>

      {/* Featured Products */}
      <section style={{ padding: '0 20px 60px', maxWidth: 1200, margin: '0 auto' }}>
        <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: 32 }}>
          <div>
            <h2 style={{ fontFamily: "'Playfair Display', serif", fontSize: 32, marginBottom: 4 }}>Featured Products</h2>
            <p style={{ color: '#6b6b8a' }}>Handpicked for you</p>
          </div>
          <Link to="/products" style={{ color: '#e94560', fontWeight: 600, fontSize: 14 }}>View All →</Link>
        </div>
        {loading ? (
          <div className="spinner" />
        ) : (
          <div className="grid-4">
            {featured.map(p => <ProductCard key={p.product_id} product={p} />)}
          </div>
        )}
      </section>

      {/* CTA Banner */}
      <section style={{
        background: 'linear-gradient(135deg,#f5a623,#e94560)',
        padding: '60px 20px',
        textAlign: 'center',
      }}>
        <h2 style={{ fontFamily: "'Playfair Display', serif", color: '#fff', fontSize: 36, marginBottom: 16 }}>
          Ready to Start Shopping?
        </h2>
        <p style={{ color: 'rgba(255,255,255,.85)', fontSize: 16, marginBottom: 32 }}>
          Create an account to track orders, save favourites, and checkout faster.
        </p>
        <Link to="/register" style={{
          background: '#fff', color: '#e94560',
          padding: '14px 36px', borderRadius: 8, fontSize: 16, fontWeight: 700,
        }}>Get Started Free</Link>
      </section>

      {/* Footer */}
      <footer style={{ background: '#1a1a2e', color: 'rgba(255,255,255,.5)', textAlign: 'center', padding: '24px' }}>
        <p style={{ fontFamily: "'Playfair Display', serif", color: '#fff', marginBottom: 4 }}>ShopNova</p>
        <p style={{ fontSize: 13 }}>© 2024 ShopNova — E-Commerce Demo Project | MySQL + Express + React</p>
      </footer>
    </div>
  );
}
