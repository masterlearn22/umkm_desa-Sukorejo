import React, { useState, useEffect } from 'react';
import { fetchProducts } from '../../services/api';

const ManageProducts = () => {
  const [products, setProducts] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const loadData = async () => {
      const data = await fetchProducts();
      setProducts(data);
      setLoading(false);
    };
    loadData();
  }, []);

  return (
    <div className="bg-white rounded-2xl shadow-sm border border-stone-200 p-6">
      <div className="flex justify-between items-center mb-6">
        <h3 className="font-heading font-black text-xl tracking-widest uppercase text-stone-900">Manajemen Produk</h3>
        <button className="px-4 py-2 bg-stone-900 text-white rounded-xl text-xs font-bold uppercase tracking-widest hover:bg-stone-800 transition-colors">
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
                <th className="p-3 font-bold">Aksi</th>
              </tr>
            </thead>
            <tbody>
              {products.map((p, i) => (
                <tr key={i} className="border-b border-stone-100 hover:bg-stone-50 transition-colors">
                  <td className="p-3 font-medium text-stone-900">{p.Nama || '-'}</td>
                  <td className="p-3 text-stone-600">{p.Kategori || '-'}</td>
                  <td className="p-3 text-stone-600">Rp {p.Harga || '0'}</td>
                  <td className="p-3 text-stone-600">{p.Stok || '0'}</td>
                  <td className="p-3">
                    <button className="text-blue-600 hover:underline mr-3 text-sm">Edit</button>
                    <button className="text-red-600 hover:underline text-sm">Hapus</button>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      )}
    </div>
  );
};

export default ManageProducts;
