// frontend/src/components/Navbar.js
import React, { useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { useApp } from '../context/AppContext';

const styles = {
  nav: {
    background: '#1a1a2e',
    padding: '0 20px',
    position: 'sticky',
    top: 0,
    zIndex: 1000,
    boxShadow: '0 2px 20px rgba(0,0,0,.3)',
  },
  inner: {
    maxWidth: 1200,
    margin: '0 auto',
    display: 'flex',
    alignItems: 'center',
    justifyContent: 'space-between',
    height: 64,
  },
  logo: {
    fontFamily: "'Playfair Display', serif",
    fontSize: 22,
    fontWeight: 900,
    color: '#fff',
    letterSpacing: '-0.5px',
  },
  logoSpan: { color: '#e94560' },
  links: {
    display: 'flex',
    alignItems: 'center',
    gap: 28,
    listStyle: 'none',
  },
  link: {
    color: 'rgba(255,255,255,.75)',
    fontSize: 14,
    fontWeight: 500,
    transition: 'color .2s',
    cursor: 'pointer',
    background: 'none',
    border: 'none',
    fontFamily: "'DM Sans', sans-serif",
  },
  cartBtn: {
    position: 'relative',
    background: '#e94560',
    color: '#fff',
    padding: '8px 18px',
    borderRadius: 8,
    fontSize: 14,
    fontWeight: 600,
    display: 'flex',
    alignItems: 'center',
    gap: 8,
  },
  badge: {
    background: '#f5a623',
    color: '#1a1a2e',
    borderRadius: '50%',
    width: 18,
    height: 18,
    fontSize: 11,
    fontWeight: 800,
    display: 'flex',
    alignItems: 'center',
    justifyContent: 'center',
  },
};

export default function Navbar() {
  const { user, logout, cartCount } = useApp();
  const navigate = useNavigate();

  const handleLogout = () => {
    logout();
    navigate('/');
  };

  return (
    <nav style={styles.nav}>
      <div style={styles.inner}>
        <Link to="/" style={styles.logo}>
          Shop<span style={styles.logoSpan}>Nova</span>
        </Link>

        <ul style={styles.links}>
          <li><Link to="/"        style={styles.link}>Home</Link></li>
          <li><Link to="/products" style={styles.link}>Products</Link></li>
          {user ? (
            <>
              <li><Link to="/orders" style={styles.link}>My Orders</Link></li>
              <li><button onClick={handleLogout} style={styles.link}>Logout</button></li>
              <li style={{ color: 'rgba(255,255,255,.45)', fontSize: 13 }}>Hi, {user.customer_name?.split(' ')[0]}</li>
            </>
          ) : (
            <li><Link to="/login" style={styles.link}>Login</Link></li>
          )}
          <li>
            <Link to="/cart" style={styles.cartBtn}>
              🛒 Cart
              {cartCount > 0 && <span style={styles.badge}>{cartCount}</span>}
            </Link>
          </li>
        </ul>
      </div>
    </nav>
  );
}
