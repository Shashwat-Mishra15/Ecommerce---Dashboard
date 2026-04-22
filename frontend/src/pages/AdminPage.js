// frontend/src/pages/AdminPage.js
import React, { useEffect, useState } from 'react';
import API from '../api';
import { useApp } from '../context/AppContext';
import { Link } from 'react-router-dom';

export default function AdminPage() {
  const { user } = useApp();
  const [orders,    setOrders]    = useState([]);
  const [customers, setCustomers] = useState([]);
  const [products,  setProducts]  = useState([]);
  const [tab, setTab] = useState('overview');
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    Promise.all([
      API.get('/orders'),
      API.get('/customers'),
      API.get('/products'),
    ]).then(([o, c, p]) => {
      setOrders(o.data);
      setCustomers(c.data);
      setProducts(p.data);
    }).catch(console.error)
      .finally(() => setLoading(false));
  }, []);

  if (!user) {
    return (
      <div style={{ textAlign:'center', padding:'100px 20px' }}>
        <div style={{ fontSize:64, marginBottom:16 }}>🔒</div>
        <h2 style={{ fontFamily:"'Playfair Display',serif", fontSize:28, marginBottom:12 }}>Admin access required</h2>
        <Link to="/login" style={{ background:'#e94560', color:'#fff', padding:'12px 28px', borderRadius:8, fontWeight:700 }}>Login</Link>
      </div>
    );
  }

  const totalRevenue  = orders.reduce((s,o) => s + Number(o.total_amount), 0);
  const lowStock      = products.filter(p => p.stock_quantity < 10);

  const statCard = (emoji, label, value, color='#e94560') => (
    <div style={{ background:'#fff', borderRadius:12, padding:24, boxShadow:'0 4px 24px rgba(26,26,46,.08)', display:'flex', gap:18, alignItems:'center' }}>
      <div style={{ fontSize:40, background: color+'22', width:64, height:64, borderRadius:12, display:'flex', alignItems:'center', justifyContent:'center' }}>{emoji}</div>
      <div>
        <div style={{ fontSize:13, color:'#6b6b8a', fontWeight:600 }}>{label}</div>
        <div style={{ fontSize:28, fontWeight:900, color:'#1a1a2e', marginTop:2 }}>{value}</div>
      </div>
    </div>
  );

  const TAB_STYLE = (active) => ({
    padding:'10px 22px', borderRadius:8, border:'none', cursor:'pointer',
    fontFamily:"'DM Sans',sans-serif", fontSize:14, fontWeight:700,
    background: active ? '#e94560' : '#fff',
    color: active ? '#fff' : '#6b6b8a',
    boxShadow: active ? '0 4px 12px rgba(233,69,96,.3)' : 'none',
    transition:'all .2s',
  });

  return (
    <div style={{ maxWidth:1200, margin:'40px auto', padding:'0 20px' }}>
      <div style={{ display:'flex', alignItems:'center', justifyContent:'space-between', marginBottom:36, flexWrap:'wrap', gap:16 }}>
        <div>
          <h1 style={{ fontFamily:"'Playfair Display',serif", fontSize:40, marginBottom:4 }}>Admin Dashboard</h1>
          <p style={{ color:'#6b6b8a' }}>Welcome back, {user.customer_name?.split(' ')[0]}!</p>
        </div>
        <a
          href="/api/export/report/csv"
          target="_blank"
          rel="noreferrer"
          style={{ background:'#1a1a2e', color:'#fff', padding:'12px 24px', borderRadius:8, fontWeight:700, fontSize:14 }}
        >
          📥 Export CSV for Tableau
        </a>
      </div>

      {loading ? <div className="spinner" /> : (
        <>
          {/* Stats */}
          <div style={{ display:'grid', gridTemplateColumns:'repeat(auto-fill,minmax(220px,1fr))', gap:20, marginBottom:36 }}>
            {statCard('💰','Total Revenue', `₹${totalRevenue.toLocaleString('en-IN',{maximumFractionDigits:0})}`, '#e94560')}
            {statCard('📦','Total Orders',  orders.length,    '#f5a623')}
            {statCard('👥','Customers',     customers.length, '#667eea')}
            {statCard('🏷️','Products',      products.length,  '#43e97b')}
          </div>

          {/* Low stock alert */}
          {lowStock.length > 0 && (
            <div style={{ background:'#fff8e1', border:'1.5px solid #f5a623', borderRadius:10, padding:'16px 20px', marginBottom:28, display:'flex', alignItems:'center', gap:12 }}>
              <span style={{ fontSize:20 }}>⚠️</span>
              <span style={{ fontSize:14, fontWeight:600, color:'#92400e' }}>
                {lowStock.length} product{lowStock.length>1?'s':''} running low on stock: {lowStock.map(p=>p.product_name).slice(0,3).join(', ')}{lowStock.length>3?'...':''}
              </span>
            </div>
          )}

          {/* Tabs */}
          <div style={{ display:'flex', gap:10, marginBottom:28, flexWrap:'wrap' }}>
            {['overview','orders','customers','products'].map(t => (
              <button key={t} onClick={() => setTab(t)} style={TAB_STYLE(tab===t)}>
                {t.charAt(0).toUpperCase()+t.slice(1)}
              </button>
            ))}
          </div>

          {/* Orders Table */}
          {tab === 'orders' && (
            <div style={{ background:'#fff', borderRadius:12, boxShadow:'0 4px 24px rgba(26,26,46,.08)', overflow:'auto' }}>
              <table style={{ width:'100%', borderCollapse:'collapse' }}>
                <thead>
                  <tr style={{ background:'#f8f8fc' }}>
                    {['Order ID','Date','Customer','City','Items','Payment','Total'].map(h => (
                      <th key={h} style={{ padding:'14px 16px', textAlign:'left', fontSize:12, fontWeight:700, color:'#6b6b8a', textTransform:'uppercase', letterSpacing:1, borderBottom:'1.5px solid #e8e8f0' }}>{h}</th>
                    ))}
                  </tr>
                </thead>
                <tbody>
                  {orders.map((o,i) => (
                    <tr key={o.order_id} style={{ background: i%2===0?'#fff':'#fafafa' }}>
                      <td style={{ padding:'12px 16px', fontSize:14, fontWeight:700, color:'#e94560' }}>#{o.order_id}</td>
                      <td style={{ padding:'12px 16px', fontSize:13, color:'#6b6b8a' }}>{new Date(o.order_date).toLocaleDateString('en-IN')}</td>
                      <td style={{ padding:'12px 16px', fontSize:14, fontWeight:600 }}>{o.customer_name}</td>
                      <td style={{ padding:'12px 16px', fontSize:13, color:'#6b6b8a' }}>{o.city}</td>
                      <td style={{ padding:'12px 16px', fontSize:13, color:'#6b6b8a' }}>{o.item_count}</td>
                      <td style={{ padding:'12px 16px', fontSize:13 }}>{o.payment_method}</td>
                      <td style={{ padding:'12px 16px', fontSize:15, fontWeight:800, color:'#1a1a2e' }}>₹{Number(o.total_amount).toLocaleString('en-IN')}</td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          )}

          {/* Customers Table */}
          {tab === 'customers' && (
            <div style={{ background:'#fff', borderRadius:12, boxShadow:'0 4px 24px rgba(26,26,46,.08)', overflow:'auto' }}>
              <table style={{ width:'100%', borderCollapse:'collapse' }}>
                <thead>
                  <tr style={{ background:'#f8f8fc' }}>
                    {['ID','Name','Email','Phone','City','Orders','Lifetime Value','Joined'].map(h => (
                      <th key={h} style={{ padding:'14px 16px', textAlign:'left', fontSize:12, fontWeight:700, color:'#6b6b8a', textTransform:'uppercase', letterSpacing:1, borderBottom:'1.5px solid #e8e8f0' }}>{h}</th>
                    ))}
                  </tr>
                </thead>
                <tbody>
                  {customers.map((c,i) => (
                    <tr key={c.customer_id} style={{ background: i%2===0?'#fff':'#fafafa' }}>
                      <td style={{ padding:'12px 16px', fontSize:14, fontWeight:700, color:'#e94560' }}>{c.customer_id}</td>
                      <td style={{ padding:'12px 16px', fontSize:14, fontWeight:600 }}>{c.customer_name}</td>
                      <td style={{ padding:'12px 16px', fontSize:13, color:'#6b6b8a' }}>{c.email}</td>
                      <td style={{ padding:'12px 16px', fontSize:13, color:'#6b6b8a' }}>{c.phone}</td>
                      <td style={{ padding:'12px 16px', fontSize:13, color:'#6b6b8a' }}>{c.city}</td>
                      <td style={{ padding:'12px 16px', fontSize:13 }}>{c.total_orders}</td>
                      <td style={{ padding:'12px 16px', fontSize:14, fontWeight:700 }}>₹{Number(c.lifetime_value).toLocaleString('en-IN')}</td>
                      <td style={{ padding:'12px 16px', fontSize:13, color:'#6b6b8a' }}>{new Date(c.registration_date).toLocaleDateString('en-IN')}</td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          )}

          {/* Products Table */}
          {tab === 'products' && (
            <div style={{ background:'#fff', borderRadius:12, boxShadow:'0 4px 24px rgba(26,26,46,.08)', overflow:'auto' }}>
              <table style={{ width:'100%', borderCollapse:'collapse' }}>
                <thead>
                  <tr style={{ background:'#f8f8fc' }}>
                    {['ID','Product','Category','Price','Cost','Margin','Stock'].map(h => (
                      <th key={h} style={{ padding:'14px 16px', textAlign:'left', fontSize:12, fontWeight:700, color:'#6b6b8a', textTransform:'uppercase', letterSpacing:1, borderBottom:'1.5px solid #e8e8f0' }}>{h}</th>
                    ))}
                  </tr>
                </thead>
                <tbody>
                  {products.map((p,i) => {
                    const margin = (((p.price - p.cost_price) / p.price) * 100).toFixed(0);
                    return (
                      <tr key={p.product_id} style={{ background: i%2===0?'#fff':'#fafafa' }}>
                        <td style={{ padding:'12px 16px', fontSize:14, fontWeight:700, color:'#e94560' }}>{p.product_id}</td>
                        <td style={{ padding:'12px 16px', fontSize:14, fontWeight:600, maxWidth:200 }}>{p.product_name}</td>
                        <td style={{ padding:'12px 16px', fontSize:13, color:'#6b6b8a' }}>{p.category}</td>
                        <td style={{ padding:'12px 16px', fontSize:14, fontWeight:700 }}>₹{Number(p.price).toLocaleString('en-IN')}</td>
                        <td style={{ padding:'12px 16px', fontSize:13, color:'#6b6b8a' }}>₹{Number(p.cost_price).toLocaleString('en-IN')}</td>
                        <td style={{ padding:'12px 16px' }}>
                          <span style={{ background:'#dcfce7', color:'#15803d', padding:'3px 10px', borderRadius:20, fontSize:12, fontWeight:700 }}>{margin}%</span>
                        </td>
                        <td style={{ padding:'12px 16px' }}>
                          <span style={{
                            background: p.stock_quantity<10 ? '#fde8ec' : '#f8f8fc',
                            color: p.stock_quantity<10 ? '#e94560' : '#1a1a2e',
                            padding:'3px 10px', borderRadius:20, fontSize:13, fontWeight:700,
                          }}>{p.stock_quantity}</span>
                        </td>
                      </tr>
                    );
                  })}
                </tbody>
              </table>
            </div>
          )}

          {/* Overview tab: recent orders + top products */}
          {tab === 'overview' && (
            <div style={{ display:'grid', gridTemplateColumns:'1fr 1fr', gap:24 }}>
              <div style={{ background:'#fff', borderRadius:12, boxShadow:'0 4px 24px rgba(26,26,46,.08)', padding:24 }}>
                <h3 style={{ fontFamily:"'Playfair Display',serif", fontSize:20, marginBottom:16 }}>Recent Orders</h3>
                <div style={{ display:'flex', flexDirection:'column', gap:12 }}>
                  {orders.slice(0,5).map(o => (
                    <div key={o.order_id} style={{ display:'flex', justifyContent:'space-between', alignItems:'center', padding:'10px 14px', background:'#f8f8fc', borderRadius:8 }}>
                      <div>
                        <div style={{ fontSize:14, fontWeight:700, color:'#1a1a2e' }}>#{o.order_id} · {o.customer_name}</div>
                        <div style={{ fontSize:12, color:'#6b6b8a', marginTop:2 }}>{new Date(o.order_date).toLocaleDateString('en-IN')}</div>
                      </div>
                      <span style={{ fontWeight:800, color:'#e94560' }}>₹{Number(o.total_amount).toLocaleString('en-IN')}</span>
                    </div>
                  ))}
                </div>
              </div>
              <div style={{ background:'#fff', borderRadius:12, boxShadow:'0 4px 24px rgba(26,26,46,.08)', padding:24 }}>
                <h3 style={{ fontFamily:"'Playfair Display',serif", fontSize:20, marginBottom:16 }}>Low Stock Alert</h3>
                {lowStock.length===0 ? (
                  <div style={{ textAlign:'center', padding:'32px 0', color:'#22c55e' }}>
                    <div style={{ fontSize:40, marginBottom:8 }}>✅</div>
                    <p style={{ fontWeight:600 }}>All products well-stocked!</p>
                  </div>
                ) : (
                  <div style={{ display:'flex', flexDirection:'column', gap:12 }}>
                    {lowStock.map(p => (
                      <div key={p.product_id} style={{ display:'flex', justifyContent:'space-between', alignItems:'center', padding:'10px 14px', background:'#fde8ec', borderRadius:8 }}>
                        <div>
                          <div style={{ fontSize:14, fontWeight:700, color:'#1a1a2e' }}>{p.product_name}</div>
                          <div style={{ fontSize:12, color:'#6b6b8a', marginTop:2 }}>{p.category}</div>
                        </div>
                        <span style={{ fontWeight:800, color:'#e94560' }}>{p.stock_quantity} left</span>
                      </div>
                    ))}
                  </div>
                )}
              </div>
            </div>
          )}
        </>
      )}
    </div>
  );
}
