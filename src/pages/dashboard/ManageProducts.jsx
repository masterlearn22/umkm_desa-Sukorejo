import React, { useState, useEffect } from 'react';
import { fetchProducts, addProduct } from '../../services/api';
import { useAuth } from '../../context/AuthContext';
import { X } from 'lucide-react';

const ManageProducts = () => {
  const { user } = useAuth();
  const [products, setProducts] = useState([]);
  const [loading, setLoading] = useState(true);
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [isSubmitting, setIsSubmitting] = useState(false);

  // Form State
  const [formData, setFormData] = useState({
    nama: '',
    kategori: 'Fresh',
    harga: '',
    stok: '',
    gambar: '',
    deskripsi: ''
  });

  const loadData = async () => {
    setLoading(true);
    const data = await fetchProducts();
    // Filter by role
    if (user?.role === 'admin') {
      setProducts(data);
    } else {
      // Penjual only sees their own products
      const filtered = data.filter(p => p.ID_Pengguna === user?.id_pengguna);
      setProducts(filtered);
    }
    setLoading(false);
  };

  useEffect(() => {
    loadData();
  }, [user]);

  const handleChange = (e) => {
    setFormData({ ...formData, [e.target.name]: e.target.value });
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setIsSubmitting(true);
    
    const payload = {
      ...formData,
      id_pengguna: user?.id_pengguna || ''
    };

    const res = await addProduct(payload);
    setIsSubmitting(false);

    if (res && res.status === 'success') {
      setIsModalOpen(false);
      setFormData({ nama: '', kategori: 'Fresh', harga: '', stok: '', gambar: '', deskripsi: '' });
      loadData(); // Refresh table
    } else {
      alert("Gagal menambahkan produk: " + (res?.message || "Unknown error"));
    }
  };

  return (
    <div className="bg-white rounded-2xl shadow-sm border border-stone-200 p-6 relative">
      <div className="flex justify-between items-center mb-6">
        <h3 className="font-heading font-black text-xl tracking-widest uppercase text-stone-900">Manajemen Produk</h3>
        <button 
          onClick={() => setIsModalOpen(true)}
          className="px-4 py-2 bg-stone-900 text-white rounded-xl text-xs font-bold uppercase tracking-widest hover:bg-stone-800 transition-colors"
        >
          + Tambah Produk
        </button>
      </div>
      
      {loading ? (
        <div className="text-center py-10 text-stone-500">Memuat data...</div>
      ) : (
        <div className="overflow-x-auto">
          <table className="w-full text-left border-collapse">
            <thead>
              <tr className="border-b border-stone-200 text-xs text-stone-500 uppercase tracking-widest">
                <th className="p-3 font-bold">Nama Produk</th>
                <th className="p-3 font-bold">Kategori</th>
                <th className="p-3 font-bold">Harga</th>
                <th className="p-3 font-bold">Stok</th>
                {user?.role === 'admin' && <th className="p-3 font-bold">ID Pengguna</th>}
                <th className="p-3 font-bold">Aksi</th>
              </tr>
            </thead>
            <tbody>
              {products.map((p, i) => (
                <tr key={i} className="border-b border-stone-100 hover:bg-stone-50 transition-colors">
                  <td className="p-3 font-medium text-stone-900">{p.Nama || p.Nama_Indo || '-'}</td>
                  <td className="p-3 text-stone-600">{p.Kategori || '-'}</td>
                  <td className="p-3 text-stone-600">Rp {p.Harga || p.Harga_Rp || '0'}</td>
                  <td className="p-3 text-stone-600">{p.Stok || '0'}</td>
                  {user?.role === 'admin' && <td className="p-3 text-stone-600 text-xs font-mono">{p.ID_Pengguna || '-'}</td>}
                  <td className="p-3">
                    <button className="text-blue-600 hover:underline mr-3 text-sm">Edit</button>
                    <button className="text-red-600 hover:underline text-sm">Hapus</button>
                  </td>
                </tr>
              ))}
              {products.length === 0 && (
                <tr>
                  <td colSpan={user?.role === 'admin' ? 6 : 5} className="p-4 text-center text-stone-500">Belum ada produk</td>
                </tr>
              )}
            </tbody>
          </table>
        </div>
      )}

      {/* Modal Tambah Produk */}
      {isModalOpen && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/50 p-4">
          <div className="bg-white rounded-2xl w-full max-w-lg overflow-hidden shadow-xl animate-in fade-in zoom-in duration-200">
            <div className="flex justify-between items-center p-6 border-b border-stone-100">
              <h3 className="font-heading font-black text-lg tracking-widest uppercase">Tambah Produk Baru</h3>
              <button onClick={() => setIsModalOpen(false)} className="text-stone-400 hover:text-stone-900 transition-colors">
                <X size={24} />
              </button>
            </div>
            <form onSubmit={handleSubmit} className="p-6 space-y-4 max-h-[70vh] overflow-y-auto">
              <div>
                <label className="block text-[10px] font-bold text-stone-500 uppercase tracking-widest mb-1">Nama Produk</label>
                <input required name="nama" value={formData.nama} onChange={handleChange} className="w-full px-4 py-3 rounded-xl bg-stone-50 border border-stone-200 focus:outline-none focus:border-stone-900 focus:ring-1 focus:ring-stone-900 transition-all text-sm" placeholder="Contoh: Buah Naga Merah Super" />
              </div>
              <div className="grid grid-cols-2 gap-4">
                <div>
                  <label className="block text-[10px] font-bold text-stone-500 uppercase tracking-widest mb-1">Kategori</label>
                  <select required name="kategori" value={formData.kategori} onChange={handleChange} className="w-full px-4 py-3 rounded-xl bg-stone-50 border border-stone-200 focus:outline-none focus:border-stone-900 focus:ring-1 focus:ring-stone-900 transition-all text-sm">
                    <option value="Fresh">Fresh</option>
                    <option value="Processed">Processed</option>
                    <option value="Craft">Craft</option>
                  </select>
                </div>
                <div>
                  <label className="block text-[10px] font-bold text-stone-500 uppercase tracking-widest mb-1">Stok</label>
                  <input required type="number" name="stok" value={formData.stok} onChange={handleChange} className="w-full px-4 py-3 rounded-xl bg-stone-50 border border-stone-200 focus:outline-none focus:border-stone-900 focus:ring-1 focus:ring-stone-900 transition-all text-sm" placeholder="Contoh: 100" />
                </div>
              </div>
              <div>
                <label className="block text-[10px] font-bold text-stone-500 uppercase tracking-widest mb-1">Harga (Rp)</label>
                <input required type="number" name="harga" value={formData.harga} onChange={handleChange} className="w-full px-4 py-3 rounded-xl bg-stone-50 border border-stone-200 focus:outline-none focus:border-stone-900 focus:ring-1 focus:ring-stone-900 transition-all text-sm" placeholder="Contoh: 15000" />
              </div>
              <div>
                <label className="block text-[10px] font-bold text-stone-500 uppercase tracking-widest mb-1">URL Gambar</label>
                <input required name="gambar" value={formData.gambar} onChange={handleChange} className="w-full px-4 py-3 rounded-xl bg-stone-50 border border-stone-200 focus:outline-none focus:border-stone-900 focus:ring-1 focus:ring-stone-900 transition-all text-sm" placeholder="Contoh: https://example.com/image.jpg" />
              </div>
              <div>
                <label className="block text-[10px] font-bold text-stone-500 uppercase tracking-widest mb-1">Deskripsi</label>
                <textarea required name="deskripsi" value={formData.deskripsi} onChange={handleChange} rows="3" className="w-full px-4 py-3 rounded-xl bg-stone-50 border border-stone-200 focus:outline-none focus:border-stone-900 focus:ring-1 focus:ring-stone-900 transition-all text-sm" placeholder="Deskripsikan produk Anda..." />
              </div>
              <div className="pt-4 flex justify-end">
                <button type="submit" disabled={isSubmitting} className="px-6 py-3 bg-stone-900 text-white rounded-xl text-xs font-bold uppercase tracking-widest hover:bg-stone-800 transition-colors disabled:opacity-50">
                  {isSubmitting ? 'Menyimpan...' : 'Simpan Produk'}
                </button>
              </div>
            </form>
          </div>
        </div>
      )}
    </div>
  );
};

export default ManageProducts;
