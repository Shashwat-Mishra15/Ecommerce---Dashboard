// frontend/src/pages/CartPage.js
import React from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { useApp } from '../context/AppContext';

const CATEGORY_EMOJI = {
  'Electronics':'⚡','Clothing':'👗','Home & Kitchen':'🏠','Books':'📚','Beauty & Health':'✨',
};

export default function CartPage() {
  const { cart, removeFromCart, updateQty, cartTotal } = useApp();
  const navigate = useNavigate();

  if (cart.length === 0) {
    return (
      <div style={{ textAlign:'center', padding:'100px 20px' }}>
        <div style={{ fontSize:80, marginBottom:24 }}>🛒</div>
        <h2 style={{ fontFamily:"'Playfair Display',serif", fontSize:32, marginBottom:12 }}>Your cart is empty</h2>
        <p style={{ color:'#6b6b8a', marginBottom:32 }}>Looks like you haven't added anything yet.</p>
        <Link to="/products" style={{
          background:'#e94560', color:'#fff', padding:'14px 36px',
          borderRadius:8, fontSize:16, fontWeight:700,
        }}>Start Shopping</Link>
      </div>
    );
  }

  const deliveryFee = cartTotal >= 499 ? 0 : 49;
  const grandTotal  = cartTotal + deliveryFee;

  return (
    <div style={{ maxWidth:1100, margin:'40px auto', padding:'0 20px' }}>
      <h1 style={{ fontFamily:"'Playfair Display',serif", fontSize:40, marginBottom:8 }}>Shopping Cart</h1>
      <p style={{ color:'#6b6b8a', marginBottom:36 }}>{cart.length} item{cart.length>1?'s':''} in your cart</p>

      <div style={{ display:'grid', gridTemplateColumns:'1fr 340px', gap:32, alignItems:'start' }}>
        {/* Items */}
        <div style={{ display:'flex', flexDirection:'column', gap:16 }}>
          {cart.map(item => (
            <div key={item.product_id} style={{
              background:'#fff', borderRadius:12,
              boxShadow:'0 4px 24px rgba(26,26,46,.08)',
              padding:20, display:'flex', gap:20, alignItems:'center',
            }}>
              {/* Image */}
              <div style={{
                width:80, height:80, borderRadius:10, flexShrink:0,
                background: 'linear-gradient(135deg,#667eea,#764ba2)',
                display:'flex', alignItems:'center', justifyContent:'center', fontSize:32,
              }}>
                {CATEGORY_EMOJI[item.category] || '📦'}
              </div>

              {/* Details */}
              <div style={{ flex:1, minWidth:0 }}>
                <span style={{ fontSize:11, fontWeight:700, color:'#e94560', letterSpacing:1, textTransform:'uppercase' }}>{item.category}</span>
                <h3 style={{ fontSize:16, fontWeight:600, color:'#1a1a2e', marginTop:4, marginBottom:8, whiteSpace:'nowrap', overflow:'hidden', textOverflow:'ellipsis' }}>
                  {item.product_name}
                </h3>
                <div style={{ display:'flex', alignItems:'center', gap:20 }}>
                  {/* Qty controls */}
                  <div style={{ display:'flex', alignItems:'center', border:'1.5px solid #e8e8f0', borderRadius:8, overflow:'hidden' }}>
                    <button onClick={() => updateQty(item.product_id, item.quantity-1)}
                      style={{ width:32,height:32, background:'#f8f8fc', border:'none', fontSize:16, cursor:'pointer' }}>−</button>
                    <span style={{ width:36, textAlign:'center', fontSize:14, fontWeight:700 }}>{item.quantity}</span>
                    <button onClick={() => updateQty(item.product_id, item.quantity+1)}
                      style={{ width:32,height:32, background:'#f8f8fc', border:'none', fontSize:16, cursor:'pointer' }}>+</button>
                  </div>
                  <span style={{ fontSize:13, color:'#6b6b8a' }}>
                    ₹{Number(item.price).toLocaleString('en-IN')} each
                  </span>
                </div>
              </div>

              {/* Price + remove */}
              <div style={{ textAlign:'right', flexShrink:0 }}>
                <div style={{ fontSize:20, fontWeight:800, color:'#1a1a2e', marginBottom:8 }}>
                  ₹{(item.price * item.quantity).toLocaleString('en-IN')}
                </div>
                <button onClick={() => removeFromCart(item.product_id)}
                  style={{ background:'none', border:'none', color:'#e94560', fontSize:13, fontWeight:600, cursor:'pointer' }}>
                  Remove ✕
                </button>
              </div>
            </div>
          ))}
        </div>

        {/* Order Summary */}
        <div style={{ background:'#fff', borderRadius:12, boxShadow:'0 4px 24px rgba(26,26,46,.08)', padding:28, position:'sticky', top:84 }}>
          <h2 style={{ fontFamily:"'Playfair Display',serif", fontSize:22, marginBottom:24 }}>Order Summary</h2>

          <div style={{ display:'flex', flexDirection:'column', gap:14, marginBottom:20 }}>
            {cart.map(item => (
              <div key={item.product_id} style={{ display:'flex', justifyContent:'space-between', fontSize:13, color:'#6b6b8a' }}>
                <span style={{ flex:1, marginRight:8, overflow:'hidden', textOverflow:'ellipsis', whiteSpace:'nowrap' }}>
                  {item.product_name} × {item.quantity}
                </span>
                <span style={{ fontWeight:600, color:'#1a1a2e', flexShrink:0 }}>₹{(item.price*item.quantity).toLocaleString('en-IN')}</span>
              </div>
            ))}
          </div>

          <div style={{ borderTop:'1.5px solid #e8e8f0', paddingTop:16, display:'flex', flexDirection:'column', gap:12 }}>
            <div style={{ display:'flex', justifyContent:'space-between', fontSize:14 }}>
              <span style={{ color:'#6b6b8a' }}>Subtotal</span>
              <span style={{ fontWeight:600 }}>₹{cartTotal.toLocaleString('en-IN')}</span>
            </div>
            <div style={{ display:'flex', justifyContent:'space-between', fontSize:14 }}>
              <span style={{ color:'#6b6b8a' }}>Delivery</span>
              <span style={{ fontWeight:600, color: deliveryFee===0 ? '#22c55e' : '#1a1a2e' }}>
                {deliveryFee===0 ? 'FREE' : `₹${deliveryFee}`}
              </span>
            </div>
            {deliveryFee>0 && (
              <p style={{ fontSize:12, color:'#6b6b8a', background:'#f8f8fc', padding:'8px 12px', borderRadius:6 }}>
                Add ₹{(499-cartTotal).toLocaleString('en-IN')} more for free delivery
              </p>
            )}
            <div style={{ borderTop:'1.5px solid #e8e8f0', paddingTop:12, display:'flex', justifyContent:'space-between' }}>
              <span style={{ fontSize:18, fontWeight:800, color:'#1a1a2e' }}>Total</span>
              <span style={{ fontSize:22, fontWeight:900, color:'#1a1a2e' }}>₹{grandTotal.toLocaleString('en-IN')}</span>
            </div>
          </div>

          <button onClick={() => navigate('/checkout')} style={{
            width:'100%', marginTop:24,
            background:'#e94560', color:'#fff',
            padding:'16px 0', borderRadius:10,
            fontSize:16, fontWeight:700, border:'none', cursor:'pointer',
          }}>
            Proceed to Checkout →
          </button>
          <Link to="/products" style={{
            display:'block', textAlign:'center', marginTop:12,
            color:'#6b6b8a', fontSize:13,
          }}>← Continue Shopping</Link>
        </div>
      </div>
    </div>
  );
}
