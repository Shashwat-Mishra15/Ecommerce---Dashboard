// frontend/src/pages/ProductsPage.js
import React, { useEffect, useState } from 'react';
import { useSearchParams } from 'react-router-dom';
import API from '../api';
import ProductCard from '../components/ProductCard';

const CATEGORIES = ['All', 'Electronics', 'Clothing', 'Home & Kitchen', 'Books', 'Beauty & Health'];

export default function ProductsPage() {
  const [products, setProducts]   = useState([]);
  const [loading, setLoading]     = useState(true);
  const [search, setSearch]       = useState('');
  const [searchParams, setSearchParams] = useSearchParams();
  const activeCategory = searchParams.get('category') || 'All';

  const fetchProducts = async () => {
    setLoading(true);
    try {
      const params = {};
      if (activeCategory !== 'All') params.category = activeCategory;
      if (search.trim()) params.search = search.trim();
      const res = await API.get('/products', { params });
      setProducts(res.data);
    } catch (e) {
      console.error(e);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => { fetchProducts(); }, [activeCategory]);

  const handleSearch = (e) => {
    e.preventDefault();
    fetchProducts();
  };

  const setCategory = (cat) => {
    if (cat === 'All') setSearchParams({});
    else setSearchParams({ category: cat });
  };

  return (
    <div style={{ maxWidth: 1200, margin: '0 auto', padding: '40px 20px' }}>
      {/* Header */}
      <div style={{ marginBottom: 36 }}>
        <h1 style={{ fontFamily: "'Playfair Display', serif", fontSize: 40, color: '#1a1a2e', marginBottom: 8 }}>
          All Products
        </h1>
        <p style={{ color: '#6b6b8a' }}>
          {products.length} product{products.length !== 1 ? 's' : ''} found
        </p>
      </div>

      {/* Search bar */}
      <form onSubmit={handleSearch} style={{ display: 'flex', gap: 12, marginBottom: 32 }}>
        <input
          type="text"
          placeholder="Search products..."
          value={search}
          onChange={e => setSearch(e.target.value)}
          style={{
            flex: 1, padding: '12px 16px',
            border: '1.5px solid #e8e8f0', borderRadius: 8,
            fontSize: 14, fontFamily: "'DM Sans', sans-serif",
          }}
        />
        <button type="submit" style={{
          background: '#e94560', color: '#fff',
          padding: '12px 24px', borderRadius: 8,
          fontSize: 14, fontWeight: 600, border: 'none', cursor: 'pointer',
        }}>Search</button>
        {search && (
          <button type="button" onClick={() => { setSearch(''); fetchProducts(); }} style={{
            background: '#f8f8fc', color: '#6b6b8a',
            padding: '12px 16px', borderRadius: 8,
            fontSize: 14, border: '1.5px solid #e8e8f0', cursor: 'pointer',
          }}>Clear</button>
        )}
      </form>

      {/* Category filters */}
      <div style={{ display: 'flex', gap: 10, flexWrap: 'wrap', marginBottom: 36 }}>
        {CATEGORIES.map(cat => (
          <button
            key={cat}
            onClick={() => setCategory(cat)}
            style={{
              padding: '8px 20px', borderRadius: 20, fontSize: 13, fontWeight: 600,
              border: '1.5px solid',
              borderColor: activeCategory === cat ? '#e94560' : '#e8e8f0',
              background: activeCategory === cat ? '#e94560' : '#fff',
              color: activeCategory === cat ? '#fff' : '#6b6b8a',
              cursor: 'pointer', transition: 'all .2s',
            }}
          >{cat}</button>
        ))}
      </div>

      {/* Products grid */}
      {loading ? (
        <div className="spinner" />
      ) : products.length === 0 ? (
        <div style={{ textAlign: 'center', padding: '80px 0', color: '#6b6b8a' }}>
          <div style={{ fontSize: 64, marginBottom: 16 }}>🔍</div>
          <h3 style={{ fontFamily: "'Playfair Display', serif", fontSize: 24, marginBottom: 8 }}>No products found</h3>
          <p>Try a different search term or category.</p>
        </div>
      ) : (
        <div className="grid-4">
          {products.map(p => <ProductCard key={p.product_id} product={p} />)}
        </div>
      )}
    </div>
  );
}
