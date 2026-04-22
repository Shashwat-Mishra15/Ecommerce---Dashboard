// frontend/src/pages/LoginPage.js
import React, { useState } from 'react';
import { useNavigate, Link } from 'react-router-dom';
import API from '../api';
import { useApp } from '../context/AppContext';

export default function LoginPage() {
  const { login } = useApp();
  const navigate  = useNavigate();
  const [tab, setTab]         = useState('login');   // 'login' | 'register'
  const [form, setForm]       = useState({ customer_name:'', email:'', password:'', phone:'', city:'' });
  const [loading, setLoading] = useState(false);
  const [error, setError]     = useState('');

  const update = (k, v) => setForm(f => ({ ...f, [k]: v }));

  const handleSubmit = async (e) => {
    e.preventDefault();
    setLoading(true); setError('');
    try {
      if (tab === 'login') {
        const res = await API.post('/auth/login', { email: form.email, password: form.password });
        login(res.data.customer, res.data.token);
        navigate('/');
      } else {
        if (!form.customer_name || !form.email || !form.password) {
          setError('Name, email and password are required.'); setLoading(false); return;
        }
        const res = await API.post('/auth/register', form);
        login(res.data.customer, res.data.token);
        navigate('/');
      }
    } catch (err) {
      setError(err.response?.data?.message || 'Something went wrong.');
    } finally {
      setLoading(false);
    }
  };

  const inputStyle = {
    width:'100%', padding:'12px 14px',
    border:'1.5px solid #e8e8f0', borderRadius:8,
    fontSize:14, fontFamily:"'DM Sans',sans-serif",
    outline:'none', transition:'border .2s',
  };
  const labelStyle = { fontSize:13, fontWeight:600, color:'#6b6b8a', display:'block', marginBottom:6 };

  return (
    <div style={{
      minHeight:'calc(100vh - 64px)',
      display:'flex', alignItems:'center', justifyContent:'center',
      background:'linear-gradient(135deg,#f8f8fc,#fff)',
      padding:20,
    }}>
      <div style={{ width:'100%', maxWidth:460 }}>
        {/* Logo */}
        <div style={{ textAlign:'center', marginBottom:32 }}>
          <h1 style={{ fontFamily:"'Playfair Display',serif", fontSize:32, color:'#1a1a2e' }}>
            Shop<span style={{ color:'#e94560' }}>Nova</span>
          </h1>
          <p style={{ color:'#6b6b8a', fontSize:14, marginTop:4 }}>
            {tab==='login' ? 'Welcome back! Sign in to continue.' : 'Create an account to get started.'}
          </p>
        </div>

        {/* Card */}
        <div style={{ background:'#fff', borderRadius:16, boxShadow:'0 12px 48px rgba(26,26,46,.12)', overflow:'hidden' }}>
          {/* Tabs */}
          <div style={{ display:'flex' }}>
            {['login','register'].map(t => (
              <button key={t} onClick={() => { setTab(t); setError(''); }}
                style={{
                  flex:1, padding:'16px 0', border:'none', cursor:'pointer',
                  fontFamily:"'DM Sans',sans-serif", fontSize:14, fontWeight:700,
                  background: tab===t ? '#fff' : '#f8f8fc',
                  color: tab===t ? '#e94560' : '#6b6b8a',
                  borderBottom: tab===t ? '2px solid #e94560' : '2px solid #e8e8f0',
                  transition:'all .2s',
                }}>
                {t==='login' ? 'Sign In' : 'Register'}
              </button>
            ))}
          </div>

          {/* Form */}
          <form onSubmit={handleSubmit} style={{ padding:32, display:'flex', flexDirection:'column', gap:18 }}>
            {tab === 'register' && (
              <>
                <div>
                  <label style={labelStyle}>Full Name *</label>
                  <input type="text" required placeholder="John Doe" value={form.customer_name}
                    onChange={e => update('customer_name', e.target.value)} style={inputStyle}
                    onFocus={e => e.target.style.borderColor='#e94560'}
                    onBlur={e => e.target.style.borderColor='#e8e8f0'} />
                </div>
                <div style={{ display:'grid', gridTemplateColumns:'1fr 1fr', gap:14 }}>
                  <div>
                    <label style={labelStyle}>Phone</label>
                    <input type="tel" placeholder="9876543210" value={form.phone}
                      onChange={e => update('phone', e.target.value)} style={inputStyle}
                      onFocus={e => e.target.style.borderColor='#e94560'}
                      onBlur={e => e.target.style.borderColor='#e8e8f0'} />
                  </div>
                  <div>
                    <label style={labelStyle}>City</label>
                    <input type="text" placeholder="Mumbai" value={form.city}
                      onChange={e => update('city', e.target.value)} style={inputStyle}
                      onFocus={e => e.target.style.borderColor='#e94560'}
                      onBlur={e => e.target.style.borderColor='#e8e8f0'} />
                  </div>
                </div>
              </>
            )}

            <div>
              <label style={labelStyle}>Email Address *</label>
              <input type="email" required placeholder="you@email.com" value={form.email}
                onChange={e => update('email', e.target.value)} style={inputStyle}
                onFocus={e => e.target.style.borderColor='#e94560'}
                onBlur={e => e.target.style.borderColor='#e8e8f0'} />
            </div>

            <div>
              <label style={labelStyle}>Password *</label>
              <input type="password" required placeholder="••••••••" value={form.password}
                onChange={e => update('password', e.target.value)} style={inputStyle}
                onFocus={e => e.target.style.borderColor='#e94560'}
                onBlur={e => e.target.style.borderColor='#e8e8f0'} />
            </div>

            {error && (
              <div style={{ background:'#fde8ec', color:'#e94560', padding:'12px 14px', borderRadius:8, fontSize:13, fontWeight:600 }}>
                ⚠ {error}
              </div>
            )}

            <button type="submit" disabled={loading} style={{
              background: loading ? '#ccc' : '#e94560', color:'#fff',
              padding:'14px 0', borderRadius:8, fontSize:15, fontWeight:700,
              border:'none', cursor: loading ? 'not-allowed' : 'pointer',
              marginTop:4,
            }}>
              {loading ? 'Please wait...' : tab==='login' ? 'Sign In' : 'Create Account'}
            </button>

            {tab==='login' && (
              <p style={{ textAlign:'center', fontSize:13, color:'#6b6b8a' }}>
                Demo: use any sample customer email (e.g. aarav.sharma@email.com) with any password.
              </p>
            )}
          </form>
        </div>
      </div>
    </div>
  );
}
