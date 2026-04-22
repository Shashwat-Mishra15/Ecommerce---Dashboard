// frontend/src/pages/OrdersPage.js
import React, { useEffect, useState } from 'react';
import { Link } from 'react-router-dom';
import API from '../api';
import { useApp } from '../context/AppContext';

const PM_EMOJI = { 'Credit Card':'💳', 'Debit Card':'💳', 'UPI':'📱', 'Net Banking':'🏦', 'COD':'💵' };

export default function OrdersPage() {
  const { user } = useApp();
  const [orders, setOrders]   = useState([]);
  const [loading, setLoading] = useState(true);
  const [expanded, setExpanded] = useState(null);
  const [details, setDetails]   = useState({});

  useEffect(() => {
    if (!user) return;
    API.get('/orders/my')
      .then(r => setOrders(r.data))
      .catch(console.error)
      .finally(() => setLoading(false));
  }, [user]);

  const toggleOrder = async (orderId) => {
    if (expanded === orderId) { setExpanded(null); return; }
    setExpanded(orderId);
    if (!details[orderId]) {
      try {
        const res = await API.get(`/orders/${orderId}`);
        setDetails(d => ({ ...d, [orderId]: res.data }));
      } catch {}
    }
  };

  if (!user) {
    return (
      <div style={{ textAlign:'center', padding:'100px 20px' }}>
        <div style={{ fontSize:64, marginBottom:16 }}>🔒</div>
        <h2 style={{ fontFamily:"'Playfair Display',serif", fontSize:28, marginBottom:12 }}>Please login to view orders</h2>
        <Link to="/login" style={{ background:'#e94560', color:'#fff', padding:'12px 28px', borderRadius:8, fontWeight:700 }}>Login</Link>
      </div>
    );
  }

  return (
    <div style={{ maxWidth:900, margin:'40px auto', padding:'0 20px' }}>
      <h1 style={{ fontFamily:"'Playfair Display',serif", fontSize:40, marginBottom:8 }}>My Orders</h1>
      <p style={{ color:'#6b6b8a', marginBottom:36 }}>Hi {user.customer_name?.split(' ')[0]}, here are all your orders.</p>

      {loading ? (
        <div className="spinner" />
      ) : orders.length === 0 ? (
        <div style={{ textAlign:'center', padding:'80px 0' }}>
          <div style={{ fontSize:64, marginBottom:16 }}>📦</div>
          <h3 style={{ fontFamily:"'Playfair Display',serif", fontSize:26, marginBottom:12 }}>No orders yet</h3>
          <p style={{ color:'#6b6b8a', marginBottom:28 }}>Looks like you haven't placed any orders.</p>
          <Link to="/products" style={{ background:'#e94560', color:'#fff', padding:'14px 32px', borderRadius:8, fontWeight:700 }}>Start Shopping</Link>
        </div>
      ) : (
        <div style={{ display:'flex', flexDirection:'column', gap:16 }}>
          {orders.map(order => (
            <div key={order.order_id} style={{ background:'#fff', borderRadius:12, boxShadow:'0 4px 24px rgba(26,26,46,.08)', overflow:'hidden' }}>
              {/* Order header */}
              <div
                onClick={() => toggleOrder(order.order_id)}
                style={{ padding:'20px 24px', cursor:'pointer', display:'flex', alignItems:'center', gap:20, flexWrap:'wrap' }}
              >
                <div style={{ flex:1 }}>
                  <div style={{ display:'flex', alignItems:'center', gap:12, marginBottom:6 }}>
                    <span style={{ fontWeight:800, color:'#1a1a2e', fontSize:16 }}>Order #{order.order_id}</span>
                    <span style={{ background:'#dcfce7', color:'#15803d', padding:'3px 10px', borderRadius:20, fontSize:12, fontWeight:700 }}>Delivered</span>
                  </div>
                  <div style={{ fontSize:13, color:'#6b6b8a' }}>
                    {new Date(order.order_date).toLocaleDateString('en-IN',{day:'numeric',month:'long',year:'numeric'})}
                    &nbsp;·&nbsp;{order.item_count} item{order.item_count>1?'s':''}
                    &nbsp;·&nbsp;{PM_EMOJI[order.payment_method]} {order.payment_method}
                  </div>
                </div>
                <div style={{ textAlign:'right' }}>
                  <div style={{ fontSize:22, fontWeight:900, color:'#1a1a2e' }}>₹{Number(order.total_amount).toLocaleString('en-IN')}</div>
                  <div style={{ fontSize:12, color:'#6b6b8a', marginTop:2 }}>
                    {expanded===order.order_id ? '▲ Hide details' : '▼ View details'}
                  </div>
                </div>
              </div>

              {/* Expanded details */}
              {expanded === order.order_id && (
                <div style={{ borderTop:'1px solid #e8e8f0', padding:'20px 24px', background:'#f8f8fc' }}>
                  {!details[order.order_id] ? (
                    <div className="spinner" style={{ width:24, height:24, margin:'10px auto' }} />
                  ) : (
                    <div style={{ display:'flex', flexDirection:'column', gap:12 }}>
                      {details[order.order_id].items?.map(item => (
                        <div key={item.order_item_id} style={{ display:'flex', justifyContent:'space-between', alignItems:'center', padding:'12px 16px', background:'#fff', borderRadius:8 }}>
                          <div>
                            <div style={{ fontWeight:600, color:'#1a1a2e', fontSize:14 }}>{item.product_name}</div>
                            <div style={{ fontSize:12, color:'#6b6b8a', marginTop:2 }}>{item.category} · Qty: {item.quantity}</div>
                          </div>
                          <div style={{ fontWeight:700, color:'#1a1a2e' }}>₹{(item.item_price * item.quantity).toLocaleString('en-IN')}</div>
                        </div>
                      ))}
                    </div>
                  )}
                </div>
              )}
            </div>
          ))}
        </div>
      )}
    </div>
  );
}
