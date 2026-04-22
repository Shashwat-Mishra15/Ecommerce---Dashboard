// frontend/src/pages/CheckoutPage.js
import React, { useState } from 'react';
import { useNavigate, Link } from 'react-router-dom';
import { useApp } from '../context/AppContext';
import API from '../api';

const PAYMENT_METHODS = ['Credit Card', 'Debit Card', 'UPI', 'Net Banking', 'COD'];

export default function CheckoutPage() {
  const { cart, cartTotal, clearCart, user } = useApp();
  const navigate = useNavigate();

  const [paymentMethod, setPaymentMethod] = useState('UPI');
  const [placing, setPlacing]             = useState(false);
  const [error, setError]                 = useState('');
  const [success, setSuccess]             = useState(null);

  const deliveryFee = cartTotal >= 499 ? 0 : 49;
  const grandTotal  = cartTotal + deliveryFee;

  if (cart.length === 0 && !success) {
    return (
      <div style={{ textAlign:'center', padding:'100px 20px' }}>
        <div style={{ fontSize:64, marginBottom:16 }}>🛒</div>
        <h2 style={{ fontFamily:"'Playfair Display',serif", fontSize:28, marginBottom:12 }}>Your cart is empty</h2>
        <Link to="/products" style={{ background:'#e94560', color:'#fff', padding:'12px 28px', borderRadius:8, fontWeight:700 }}>Shop Now</Link>
      </div>
    );
  }

  if (!user) {
    return (
      <div style={{ textAlign:'center', padding:'100px 20px' }}>
        <div style={{ fontSize:64, marginBottom:16 }}>🔒</div>
        <h2 style={{ fontFamily:"'Playfair Display',serif", fontSize:28, marginBottom:12 }}>Please login to checkout</h2>
        <Link to="/login" style={{ background:'#e94560', color:'#fff', padding:'12px 28px', borderRadius:8, fontWeight:700 }}>Login</Link>
      </div>
    );
  }

  if (success) {
    return (
      <div style={{ textAlign:'center', padding:'100px 20px' }}>
        <div style={{ fontSize:80, marginBottom:24 }}>🎉</div>
        <h2 style={{ fontFamily:"'Playfair Display',serif", fontSize:40, marginBottom:12, color:'#1a1a2e' }}>Order Placed!</h2>
        <p style={{ color:'#6b6b8a', fontSize:16, marginBottom:8 }}>
          Order <strong>#{success.order_id}</strong> has been placed successfully.
        </p>
        <p style={{ color:'#6b6b8a', fontSize:16, marginBottom:40 }}>
          Total: <strong>₹{Number(success.total_amount).toLocaleString('en-IN')}</strong>
        </p>
        <div style={{ display:'flex', gap:16, justifyContent:'center', flexWrap:'wrap' }}>
          <Link to="/orders" style={{ background:'#1a1a2e', color:'#fff', padding:'14px 32px', borderRadius:8, fontWeight:700 }}>
            View My Orders
          </Link>
          <Link to="/products" style={{ background:'#e94560', color:'#fff', padding:'14px 32px', borderRadius:8, fontWeight:700 }}>
            Continue Shopping
          </Link>
        </div>
      </div>
    );
  }

  const handlePlaceOrder = async () => {
    setPlacing(true);
    setError('');
    try {
      const items = cart.map(i => ({ product_id: i.product_id, quantity: i.quantity }));
      const res = await API.post('/orders', { payment_method: paymentMethod, items });
      clearCart();
      setSuccess(res.data);
    } catch (err) {
      setError(err.response?.data?.message || 'Failed to place order. Please try again.');
    } finally {
      setPlacing(false);
    }
  };

  return (
    <div style={{ maxWidth:1000, margin:'40px auto', padding:'0 20px' }}>
      <h1 style={{ fontFamily:"'Playfair Display',serif", fontSize:40, marginBottom:36 }}>Checkout</h1>

      <div style={{ display:'grid', gridTemplateColumns:'1fr 340px', gap:32, alignItems:'start' }}>
        {/* Left column */}
        <div style={{ display:'flex', flexDirection:'column', gap:24 }}>
          {/* Delivery info */}
          <div style={{ background:'#fff', borderRadius:12, boxShadow:'0 4px 24px rgba(26,26,46,.08)', padding:28 }}>
            <h2 style={{ fontFamily:"'Playfair Display',serif", fontSize:22, marginBottom:20 }}>Delivery Info</h2>
            <div style={{ display:'grid', gap:16 }}>
              <div>
                <label style={{ fontSize:13, fontWeight:600, color:'#6b6b8a', display:'block', marginBottom:6 }}>Name</label>
                <input readOnly value={user.customer_name || ''} className="input"
                  style={{ background:'#f8f8fc', border:'1.5px solid #e8e8f0', borderRadius:8, padding:'10px 14px', width:'100%', fontSize:14 }} />
              </div>
              <div>
                <label style={{ fontSize:13, fontWeight:600, color:'#6b6b8a', display:'block', marginBottom:6 }}>Email</label>
                <input readOnly value={user.email || ''} className="input"
                  style={{ background:'#f8f8fc', border:'1.5px solid #e8e8f0', borderRadius:8, padding:'10px 14px', width:'100%', fontSize:14 }} />
              </div>
              <div>
                <label style={{ fontSize:13, fontWeight:600, color:'#6b6b8a', display:'block', marginBottom:6 }}>City</label>
                <input readOnly value={user.city || 'Not specified'} className="input"
                  style={{ background:'#f8f8fc', border:'1.5px solid #e8e8f0', borderRadius:8, padding:'10px 14px', width:'100%', fontSize:14 }} />
              </div>
            </div>
          </div>

          {/* Payment method */}
          <div style={{ background:'#fff', borderRadius:12, boxShadow:'0 4px 24px rgba(26,26,46,.08)', padding:28 }}>
            <h2 style={{ fontFamily:"'Playfair Display',serif", fontSize:22, marginBottom:20 }}>Payment Method</h2>
            <div style={{ display:'flex', flexDirection:'column', gap:12 }}>
              {PAYMENT_METHODS.map(method => (
                <label key={method} style={{
                  display:'flex', alignItems:'center', gap:14,
                  padding:'14px 18px', borderRadius:10, cursor:'pointer',
                  border:'2px solid', borderColor: paymentMethod===method ? '#e94560' : '#e8e8f0',
                  background: paymentMethod===method ? '#fde8ec' : '#f8f8fc',
                  transition:'all .15s',
                }}>
                  <input type="radio" name="payment" value={method}
                    checked={paymentMethod===method}
                    onChange={() => setPaymentMethod(method)}
                    style={{ accentColor:'#e94560' }} />
                  <span style={{ fontSize:14, fontWeight:600, color: paymentMethod===method ? '#e94560' : '#1a1a2e' }}>
                    {method==='COD'?'💵':method==='UPI'?'📱':method==='Credit Card'?'💳':method==='Debit Card'?'💳':'🏦'} {method}
                  </span>
                </label>
              ))}
            </div>
          </div>
        </div>

        {/* Right: summary */}
        <div style={{ background:'#fff', borderRadius:12, boxShadow:'0 4px 24px rgba(26,26,46,.08)', padding:28, position:'sticky', top:84 }}>
          <h2 style={{ fontFamily:"'Playfair Display',serif", fontSize:22, marginBottom:20 }}>Order Summary</h2>

          <div style={{ display:'flex', flexDirection:'column', gap:10, marginBottom:16 }}>
            {cart.map(item => (
              <div key={item.product_id} style={{ display:'flex', justifyContent:'space-between', fontSize:13 }}>
                <span style={{ color:'#6b6b8a', flex:1, marginRight:8, overflow:'hidden', textOverflow:'ellipsis', whiteSpace:'nowrap' }}>
                  {item.product_name} × {item.quantity}
                </span>
                <span style={{ fontWeight:600, color:'#1a1a2e', flexShrink:0 }}>₹{(item.price*item.quantity).toLocaleString('en-IN')}</span>
              </div>
            ))}
          </div>

          <div style={{ borderTop:'1.5px solid #e8e8f0', paddingTop:14, display:'flex', flexDirection:'column', gap:10 }}>
            <div style={{ display:'flex', justifyContent:'space-between', fontSize:14 }}>
              <span style={{ color:'#6b6b8a' }}>Subtotal</span><span style={{ fontWeight:600 }}>₹{cartTotal.toLocaleString('en-IN')}</span>
            </div>
            <div style={{ display:'flex', justifyContent:'space-between', fontSize:14 }}>
              <span style={{ color:'#6b6b8a' }}>Delivery</span>
              <span style={{ fontWeight:600, color: deliveryFee===0?'#22c55e':'#1a1a2e' }}>{deliveryFee===0?'FREE':`₹${deliveryFee}`}</span>
            </div>
            <div style={{ borderTop:'1.5px solid #e8e8f0', paddingTop:12, display:'flex', justifyContent:'space-between' }}>
              <span style={{ fontSize:18, fontWeight:800 }}>Total</span>
              <span style={{ fontSize:22, fontWeight:900, color:'#1a1a2e' }}>₹{grandTotal.toLocaleString('en-IN')}</span>
            </div>
          </div>

          {error && (
            <div style={{ marginTop:16, background:'#fde8ec', color:'#e94560', padding:'12px 16px', borderRadius:8, fontSize:13, fontWeight:600 }}>
              ⚠ {error}
            </div>
          )}

          <button onClick={handlePlaceOrder} disabled={placing} style={{
            width:'100%', marginTop:24,
            background: placing ? '#ccc' : '#e94560', color:'#fff',
            padding:'16px 0', borderRadius:10, fontSize:16, fontWeight:700,
            border:'none', cursor: placing ? 'not-allowed' : 'pointer',
          }}>
            {placing ? 'Placing Order...' : `Place Order · ₹${grandTotal.toLocaleString('en-IN')}`}
          </button>
        </div>
      </div>
    </div>
  );
}
