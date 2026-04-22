// frontend/src/components/ProductCard.js
import React from 'react';
import { useNavigate } from 'react-router-dom';
import { useApp } from '../context/AppContext';

// Category emoji mapping
const CATEGORY_EMOJI = {
  'Electronics':     '⚡',
  'Clothing':        '👗',
  'Home & Kitchen':  '🏠',
  'Books':           '📚',
  'Beauty & Health': '✨',
};

// Category gradient mapping
const CATEGORY_BG = {
  'Electronics':     'linear-gradient(135deg,#667eea,#764ba2)',
  'Clothing':        'linear-gradient(135deg,#f093fb,#f5576c)',
  'Home & Kitchen':  'linear-gradient(135deg,#4facfe,#00f2fe)',
  'Books':           'linear-gradient(135deg,#43e97b,#38f9d7)',
  'Beauty & Health': 'linear-gradient(135deg,#fa709a,#fee140)',
};

export default function ProductCard({ product }) {
  const navigate = useNavigate();
  const { addToCart } = useApp();
  const [added, setAdded] = React.useState(false);

  const handleAdd = (e) => {
    e.stopPropagation();
    addToCart(product, 1);
    setAdded(true);
    setTimeout(() => setAdded(false), 1500);
  };

  const outOfStock = product.stock_quantity === 0;

  return (
    <div
      onClick={() => navigate(`/products/${product.product_id}`)}
      style={{
        background: '#fff',
        borderRadius: 12,
        overflow: 'hidden',
        boxShadow: '0 4px 24px rgba(26,26,46,.08)',
        cursor: 'pointer',
        transition: 'transform .2s, box-shadow .2s',
        display: 'flex',
        flexDirection: 'column',
      }}
      onMouseEnter={e => { e.currentTarget.style.transform='translateY(-4px)'; e.currentTarget.style.boxShadow='0 12px 32px rgba(26,26,46,.16)'; }}
      onMouseLeave={e => { e.currentTarget.style.transform='translateY(0)'; e.currentTarget.style.boxShadow='0 4px 24px rgba(26,26,46,.08)'; }}
    >
      {/* Image placeholder */}
      <div style={{
        background: CATEGORY_BG[product.category] || 'linear-gradient(135deg,#ccc,#aaa)',
        height: 180,
        display: 'flex',
        alignItems: 'center',
        justifyContent: 'center',
        fontSize: 64,
        position: 'relative',
      }}>
        {CATEGORY_EMOJI[product.category] || '📦'}
        {outOfStock && (
          <div style={{
            position: 'absolute', inset: 0,
            background: 'rgba(0,0,0,.5)',
            display: 'flex', alignItems: 'center', justifyContent: 'center',
            color: '#fff', fontSize: 14, fontWeight: 700, letterSpacing: 1,
          }}>OUT OF STOCK</div>
        )}
      </div>

      {/* Content */}
      <div style={{ padding: 16, flex: 1, display: 'flex', flexDirection: 'column', gap: 8 }}>
        <span style={{
          fontSize: 11, fontWeight: 700, letterSpacing: 1,
          color: '#e94560', textTransform: 'uppercase',
        }}>{product.category}</span>

        <h3 style={{ fontSize: 15, fontWeight: 600, color: '#1a1a2e', lineHeight: 1.3 }}>
          {product.product_name}
        </h3>

        <div style={{ marginTop: 'auto', display: 'flex', alignItems: 'center', justifyContent: 'space-between' }}>
          <span style={{ fontSize: 20, fontWeight: 700, color: '#1a1a2e' }}>
            ₹{product.price.toLocaleString('en-IN')}
          </span>
          <span style={{ fontSize: 12, color: '#6b6b8a' }}>
            {product.stock_quantity > 0 ? `${product.stock_quantity} left` : 'Sold out'}
          </span>
        </div>

        <button
          onClick={handleAdd}
          disabled={outOfStock}
          style={{
            marginTop: 8,
            background: added ? '#22c55e' : outOfStock ? '#e8e8f0' : '#e94560',
            color: outOfStock ? '#aaa' : '#fff',
            padding: '10px 0',
            borderRadius: 8,
            fontSize: 13,
            fontWeight: 600,
            border: 'none',
            cursor: outOfStock ? 'not-allowed' : 'pointer',
            transition: 'background .2s',
          }}
        >
          {added ? '✓ Added!' : outOfStock ? 'Out of Stock' : '+ Add to Cart'}
        </button>
      </div>
    </div>
  );
}
