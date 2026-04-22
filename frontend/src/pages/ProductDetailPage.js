// frontend/src/pages/ProductDetailPage.js
import React, { useEffect, useState } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import API from '../api';
import { useApp } from '../context/AppContext';

const CATEGORY_BG = {
  'Electronics':     'linear-gradient(135deg,#667eea,#764ba2)',
  'Clothing':        'linear-gradient(135deg,#f093fb,#f5576c)',
  'Home & Kitchen':  'linear-gradient(135deg,#4facfe,#00f2fe)',
  'Books':           'linear-gradient(135deg,#43e97b,#38f9d7)',
  'Beauty & Health': 'linear-gradient(135deg,#fa709a,#fee140)',
};
const CATEGORY_EMOJI = {
  'Electronics':'⚡','Clothing':'👗','Home & Kitchen':'🏠','Books':'📚','Beauty & Health':'✨',
};

export default function ProductDetailPage() {
  const { id } = useParams();
  const navigate = useNavigate();
  const { addToCart } = useApp();
  const [product, setProduct] = useState(null);
  const [loading, setLoading] = useState(true);
  const [qty, setQty] = useState(1);
  const [added, setAdded] = useState(false);

  useEffect(() => {
    API.get(`/products/${id}`)
      .then(r => setProduct(r.data))
      .catch(() => navigate('/products'))
      .finally(() => setLoading(false));
  }, [id]);

  if (loading) return <div className="spinner" style={{ marginTop: 80 }} />;
  if (!product) return null;

  const outOfStock = product.stock_quantity === 0;
  const margin = (((product.price - product.cost_price) / product.price) * 100).toFixed(0);

  const handleAdd = () => {
    addToCart(product, qty);
    setAdded(true);
    setTimeout(() => setAdded(false), 2000);
  };

  return (
    <div style={{ maxWidth: 1100, margin: '40px auto', padding: '0 20px' }}>
      {/* Back */}
      <button
        onClick={() => navigate(-1)}
        style={{ background:'none', border:'none', color:'#6b6b8a', fontSize:14, cursor:'pointer', marginBottom:24, display:'flex', alignItems:'center', gap:6 }}
      >← Back to products</button>

      <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: 48, alignItems: 'start' }}>
        {/* Image */}
        <div style={{
          background: CATEGORY_BG[product.category] || '#f0f0f0',
          borderRadius: 16,
          height: 380,
          display: 'flex',
          alignItems: 'center',
          justifyContent: 'center',
          fontSize: 120,
          boxShadow: '0 12px 48px rgba(0,0,0,.15)',
        }}>
          {CATEGORY_EMOJI[product.category] || '📦'}
        </div>

        {/* Info */}
        <div>
          <span style={{ fontSize: 12, fontWeight: 700, letterSpacing: 2, color: '#e94560', textTransform: 'uppercase' }}>
            {product.category}
          </span>
          <h1 style={{ fontFamily: "'Playfair Display', serif", fontSize: 36, color: '#1a1a2e', margin: '12px 0 16px', lineHeight: 1.2 }}>
            {product.product_name}
          </h1>

          {/* Price */}
          <div style={{ display: 'flex', alignItems: 'baseline', gap: 12, marginBottom: 24 }}>
            <span style={{ fontSize: 40, fontWeight: 800, color: '#1a1a2e' }}>
              ₹{Number(product.price).toLocaleString('en-IN')}
            </span>
            <span style={{ fontSize: 16, color: '#6b6b8a', textDecoration: 'line-through' }}>
              ₹{Number(product.cost_price * 1.5).toLocaleString('en-IN')}
            </span>
            <span style={{ background:'#dcfce7', color:'#15803d', padding:'3px 10px', borderRadius:20, fontSize:12, fontWeight:700 }}>
              {margin}% off
            </span>
          </div>

          {/* Stock */}
          <div style={{ marginBottom: 28 }}>
            {outOfStock ? (
              <span style={{ background:'#fde8ec', color:'#e94560', padding:'6px 14px', borderRadius:20, fontSize:13, fontWeight:600 }}>
                ✗ Out of Stock
              </span>
            ) : (
              <span style={{ background:'#dcfce7', color:'#15803d', padding:'6px 14px', borderRadius:20, fontSize:13, fontWeight:600 }}>
                ✓ In Stock — {product.stock_quantity} units available
              </span>
            )}
          </div>

          {/* Quantity */}
          {!outOfStock && (
            <div style={{ display:'flex', alignItems:'center', gap:16, marginBottom:24 }}>
              <span style={{ fontSize:14, fontWeight:600, color:'#1a1a2e' }}>Quantity:</span>
              <div style={{ display:'flex', alignItems:'center', border:'1.5px solid #e8e8f0', borderRadius:8, overflow:'hidden' }}>
                <button onClick={() => setQty(q => Math.max(1,q-1))}
                  style={{ width:40, height:40, background:'#f8f8fc', border:'none', fontSize:18, cursor:'pointer' }}>−</button>
                <span style={{ width:48, textAlign:'center', fontSize:16, fontWeight:700 }}>{qty}</span>
                <button onClick={() => setQty(q => Math.min(product.stock_quantity, q+1))}
                  style={{ width:40, height:40, background:'#f8f8fc', border:'none', fontSize:18, cursor:'pointer' }}>+</button>
              </div>
            </div>
          )}

          {/* Buttons */}
          <div style={{ display:'flex', gap:12, flexWrap:'wrap', marginBottom:32 }}>
            <button onClick={handleAdd} disabled={outOfStock} style={{
              flex:1, minWidth:140,
              background: added ? '#22c55e' : outOfStock ? '#e8e8f0' : '#e94560',
              color: outOfStock ? '#aaa' : '#fff',
              padding:'14px 0', borderRadius:8, fontSize:15, fontWeight:700,
              border:'none', cursor: outOfStock ? 'not-allowed' : 'pointer', transition:'background .2s',
            }}>
              {added ? '✓ Added to Cart!' : outOfStock ? 'Out of Stock' : '+ Add to Cart'}
            </button>
            <button
              onClick={() => { if (!outOfStock) { addToCart(product, qty); navigate('/cart'); }}}
              disabled={outOfStock}
              style={{
                flex:1, minWidth:140,
                background: outOfStock ? '#e8e8f0' : '#1a1a2e',
                color: outOfStock ? '#aaa' : '#fff',
                padding:'14px 0', borderRadius:8, fontSize:15, fontWeight:700,
                border:'none', cursor: outOfStock ? 'not-allowed' : 'pointer',
              }}
            >Buy Now</button>
          </div>

          {/* Info cards */}
          <div style={{ display:'grid', gridTemplateColumns:'1fr 1fr', gap:12 }}>
            {[['🚚','Free Delivery','On all orders above ₹499'],['↩️','Easy Returns','7-day return policy'],['🔒','Secure Payment','100% safe checkout'],['⭐','Quality Assured','Certified products']].map(([icon,title,sub])=>(
              <div key={title} style={{ background:'#f8f8fc', borderRadius:10, padding:'14px', display:'flex', gap:12, alignItems:'flex-start' }}>
                <span style={{ fontSize:20 }}>{icon}</span>
                <div>
                  <div style={{ fontSize:13, fontWeight:700, color:'#1a1a2e' }}>{title}</div>
                  <div style={{ fontSize:12, color:'#6b6b8a' }}>{sub}</div>
                </div>
              </div>
            ))}
          </div>
        </div>
      </div>

      {/* Mobile layout fix */}
      <style>{`@media(max-width:768px){.product-grid{grid-template-columns:1fr!important}}`}</style>
    </div>
  );
}
