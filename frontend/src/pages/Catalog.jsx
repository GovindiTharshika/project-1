import React, { useState, useEffect } from 'react';
import { useAuth } from '../context/AuthContext';
import { useToast } from '../context/ToastContext';
import { api } from '../services/api';
import ProductCard from '../components/ProductCard';

export default function Catalog() {
  const { user } = useAuth();
  const { showToast } = useToast();
  const [products, setProducts] = useState([]);
  const [search, setSearch] = useState('');
  const [category, setCategory] = useState('');
  const [stockFilter, setStockFilter] = useState('');
  const [loading, setLoading] = useState(true);

  // New product modal state
  const [showModal, setShowModal] = useState(false);
  const [name, setName] = useState('');
  const [sku, setSku] = useState('');
  const [cat, setCat] = useState('Electronics');
  const [price, setPrice] = useState('');
  const [stock, setStock] = useState('');
  const [description, setDescription] = useState('');
  const [emoji, setEmoji] = useState('📦');

  // Stock edit modal state (Replaces browser window.prompt / alert)
  const [stockModalProduct, setStockModalProduct] = useState(null);
  const [stockModalQty, setStockModalQty] = useState('');

  const isAdmin = user?.role === 'admin';

  const loadProducts = async () => {
    try {
      const res = await api.getProducts({
        search,
        category,
        stock: stockFilter
      });
      setProducts(res.data || []);
    } catch (err) {
      console.error('Failed to load products:', err);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    loadProducts();
  }, [search, category, stockFilter]);

  const handleCreateProduct = async (e) => {
    e.preventDefault();
    try {
      await api.createProduct({
        name,
        sku,
        category: cat,
        price: parseFloat(price),
        stock: parseInt(stock),
        description,
        emoji
      });
      setShowModal(false);
      setName(''); setSku(''); setPrice(''); setStock(''); setDescription('');
      loadProducts();
      showToast(`Product "${name}" (${sku}) added to catalog.`, 'success', 'Product Created');
    } catch (err) {
      showToast(err.message, 'error', 'Failed to Create Product');
    }
  };

  const openStockModal = (product) => {
    setStockModalProduct(product);
    setStockModalQty(product.stock);
  };

  const handleSaveStock = async (e) => {
    e.preventDefault();
    if (!stockModalProduct) return;
    const newStock = parseInt(stockModalQty);
    if (isNaN(newStock) || newStock < 0) {
      showToast('Please enter a valid non-negative inventory number', 'warning', 'Invalid Input');
      return;
    }
    try {
      await api.updateStock(stockModalProduct.id, newStock);
      showToast(`Inventory for ${stockModalProduct.name} updated to ${newStock} units`, 'success', 'Stock Saved');
      setStockModalProduct(null);
      loadProducts();
    } catch (err) {
      showToast(err.message, 'error', 'Failed to Update Stock');
    }
  };

  return (
    <div>
      <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: 20 }}>
        <div>
          <h2 style={{ fontSize: '1.6rem', fontWeight: 800 }}>📦 Wholesale Product Catalog</h2>
          <p style={{ color: 'var(--text-muted)' }}>Browse available wholesale inventory with real-time stock status</p>
        </div>
        {isAdmin && (
          <button className="btn btn-primary" onClick={() => setShowModal(true)}>
            + Add New Product
          </button>
        )}
      </div>

      <div style={{ display: 'flex', gap: 12, marginBottom: 24, flexWrap: 'wrap' }}>
        <input
          type="text"
          placeholder="🔍 Search by product name or SKU..."
          value={search}
          onChange={e => setSearch(e.target.value)}
          style={{ flex: 1, minWidth: 240, padding: '10px 14px', borderRadius: 8, border: '1.5px solid var(--border)' }}
        />
        <select
          value={category}
          onChange={e => setCategory(e.target.value)}
          style={{ padding: '10px 14px', borderRadius: 8, border: '1.5px solid var(--border)', background: '#fff' }}
        >
          <option value="">All Categories</option>
          <option value="Electronics">Electronics</option>
          <option value="Office Supplies">Office Supplies</option>
          <option value="Furniture">Furniture</option>
          <option value="Accessories">Accessories</option>
        </select>
        <select
          value={stockFilter}
          onChange={e => setStockFilter(e.target.value)}
          style={{ padding: '10px 14px', borderRadius: 8, border: '1.5px solid var(--border)', background: '#fff' }}
        >
          <option value="">All Stock Levels</option>
          <option value="in">In Stock Only</option>
          <option value="low">Low Stock Alerts</option>
          <option value="out">Out of Stock</option>
        </select>
      </div>

      {loading ? (
        <div style={{ padding: 40, textAlign: 'center' }}>Loading catalog items...</div>
      ) : products.length === 0 ? (
        <div className="card" style={{ textAlign: 'center', padding: '60px 20px', color: 'var(--text-muted)' }}>
          <div style={{ fontSize: '3rem', marginBottom: 8 }}>📭</div>
          <h3>No products match your criteria</h3>
          <p>Try clearing filters or search keywords</p>
        </div>
      ) : (
        <div style={{
          display: 'grid',
          gridTemplateColumns: 'repeat(auto-fill, minmax(250px, 1fr))',
          gap: 20
        }}>
          {products.map(p => (
            <ProductCard key={p.id} product={p} onEditStock={openStockModal} />
          ))}
        </div>
      )}

      {showModal && (
        <div style={{
          position: 'fixed', inset: 0, background: 'rgba(0,0,0,0.5)', zIndex: 200,
          display: 'flex', alignItems: 'center', justifyContent: 'center'
        }}>
          <div className="card" style={{ width: '90%', maxWidth: 500, maxHeight: '90vh', overflowY: 'auto' }}>
            <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: 16 }}>
              <h3>Add Product to Catalog</h3>
              <button className="btn btn-outline btn-sm" onClick={() => setShowModal(false)}>✕</button>
            </div>
            <form onSubmit={handleCreateProduct}>
              <div style={{ marginBottom: 10 }}>
                <label style={{ display: 'block', fontSize: '0.8rem', fontWeight: 600, marginBottom: 4 }}>Product Title</label>
                <input type="text" value={name} onChange={e => setName(e.target.value)} required style={{ width: '100%', padding: 8, borderRadius: 6, border: '1px solid var(--border)' }} />
              </div>
              <div style={{ marginBottom: 10 }}>
                <label style={{ display: 'block', fontSize: '0.8rem', fontWeight: 600, marginBottom: 4 }}>Unique SKU</label>
                <input type="text" value={sku} onChange={e => setSku(e.target.value)} required placeholder="e.g. WH-109" style={{ width: '100%', padding: 8, borderRadius: 6, border: '1px solid var(--border)' }} />
              </div>
              <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: 10, marginBottom: 10 }}>
                <div>
                  <label style={{ display: 'block', fontSize: '0.8rem', fontWeight: 600, marginBottom: 4 }}>Price ($)</label>
                  <input type="number" step="0.01" value={price} onChange={e => setPrice(e.target.value)} required style={{ width: '100%', padding: 8, borderRadius: 6, border: '1px solid var(--border)' }} />
                </div>
                <div>
                  <label style={{ display: 'block', fontSize: '0.8rem', fontWeight: 600, marginBottom: 4 }}>Initial Stock</label>
                  <input type="number" value={stock} onChange={e => setStock(e.target.value)} required style={{ width: '100%', padding: 8, borderRadius: 6, border: '1px solid var(--border)' }} />
                </div>
              </div>
              <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: 10, marginBottom: 10 }}>
                <div>
                  <label style={{ display: 'block', fontSize: '0.8rem', fontWeight: 600, marginBottom: 4 }}>Category</label>
                  <select value={cat} onChange={e => setCat(e.target.value)} style={{ width: '100%', padding: 8, borderRadius: 6, border: '1px solid var(--border)' }}>
                    <option>Electronics</option><option>Office Supplies</option><option>Furniture</option><option>Accessories</option>
                  </select>
                </div>
                <div>
                  <label style={{ display: 'block', fontSize: '0.8rem', fontWeight: 600, marginBottom: 4 }}>Icon Emoji</label>
                  <input type="text" value={emoji} onChange={e => setEmoji(e.target.value)} placeholder="e.g. 💻" style={{ width: '100%', padding: 8, borderRadius: 6, border: '1px solid var(--border)' }} />
                </div>
              </div>
              <div style={{ marginBottom: 16 }}>
                <label style={{ display: 'block', fontSize: '0.8rem', fontWeight: 600, marginBottom: 4 }}>Description</label>
                <textarea value={description} onChange={e => setDescription(e.target.value)} rows={3} style={{ width: '100%', padding: 8, borderRadius: 6, border: '1px solid var(--border)' }} />
              </div>
              <div style={{ display: 'flex', gap: 10, justifyContent: 'flex-end' }}>
                <button type="button" className="btn btn-outline" onClick={() => setShowModal(false)}>Cancel</button>
                <button type="submit" className="btn btn-primary">Save to Catalog</button>
              </div>
            </form>
          </div>
        </div>
      )}

      {/* Stock Edit Modal (Replaces browser prompt dialogs) */}
      {stockModalProduct && (
        <div style={{
          position: 'fixed', inset: 0, background: 'rgba(15, 23, 42, 0.6)',
          backdropFilter: 'blur(4px)', display: 'flex', alignItems: 'center',
          justifyContent: 'center', zIndex: 1000
        }}>
          <div style={{
            background: '#fff', borderRadius: 16, padding: 32, width: '90%',
            maxWidth: 420, boxShadow: '0 20px 60px rgba(0,0,0,0.2)'
          }}>
            <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: 16 }}>
              <h3 style={{ margin: 0, fontSize: '1.2rem', fontWeight: 700 }}>📦 Update Warehouse Stock</h3>
              <button
                className="btn btn-outline btn-sm"
                onClick={() => setStockModalProduct(null)}
              >
                ✕
              </button>
            </div>
            <p style={{ fontSize: '0.88rem', color: 'var(--text-muted)', marginBottom: 16 }}>
              SKU: {stockModalProduct.sku} — {stockModalProduct.name}
            </p>
            <form onSubmit={handleSaveStock}>
              <div style={{ marginBottom: 20 }}>
                <label style={{ display: 'block', fontSize: '0.82rem', fontWeight: 600, marginBottom: 6 }}>
                  Available Quantity (Units)
                </label>
                <input
                  type="number"
                  min="0"
                  required
                  value={stockModalQty}
                  onChange={(e) => setStockModalQty(e.target.value)}
                  style={{
                    width: '100%',
                    padding: 10,
                    borderRadius: 8,
                    border: '1.5px solid var(--border)',
                    fontSize: '1.15rem',
                    fontWeight: 700
                  }}
                  autoFocus
                />
              </div>
              <div style={{ display: 'flex', justifyContent: 'flex-end', gap: 10 }}>
                <button
                  type="button"
                  className="btn btn-outline"
                  onClick={() => setStockModalProduct(null)}
                >
                  Cancel
                </button>
                <button type="submit" className="btn btn-primary">
                  Save Changes
                </button>
              </div>
            </form>
          </div>
        </div>
      )}
    </div>
  );
}

