import React, { useState, useEffect } from 'react';
import { fetchOrders } from '../../services/api';

const ManageOrders = () => {
  const [orders, setOrders] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const loadData = async () => {
      const data = await fetchOrders();
      // Sort by Waktu descending roughly if string dates
      data.reverse();
      setOrders(data);
      setLoading(false);
    };
    loadData();
  }, []);

  return (
    <div className="bg-white rounded-2xl shadow-sm border border-stone-200 p-6">
      <div className="flex justify-between items-center mb-6">
        <h3 className="font-heading font-black text-xl tracking-widest uppercase text-stone-900">Pesanan Masuk</h3>
      </div>
      
      {loading ? (
        <div className="text-center py-10 text-stone-500">Memuat data...</div>
      ) : (
        <div className="overflow-x-auto">
          <table className="w-full text-left border-collapse">
            <thead>
              <tr className="border-b border-stone-200 text-xs text-stone-500 uppercase tracking-widest">
                <th className="p-3 font-bold">Waktu</th>
                <th className="p-3 font-bold">Order ID</th>
                <th className="p-3 font-bold">Nama Pembeli</th>
                <th className="p-3 font-bold">Total</th>
                <th className="p-3 font-bold">Status</th>
                <th className="p-3 font-bold">Aksi</th>
              </tr>
            </thead>
            <tbody>
              {orders.map((o, i) => (
                <tr key={i} className="border-b border-stone-100 hover:bg-stone-50 transition-colors">
                  <td className="p-3 font-medium text-stone-900 whitespace-nowrap">{new Date(o.Waktu).toLocaleDateString('id-ID')}</td>
                  <td className="p-3 text-stone-600 font-mono text-xs">{o.Order_ID || '-'}</td>
                  <td className="p-3 text-stone-600">{o.Nama_Pelanggan || '-'}</td>
                  <td className="p-3 text-stone-600">Rp {o.Total_Harga || '0'}</td>
                  <td className="p-3">
                    <span className="px-2 py-1 bg-yellow-100 text-yellow-800 rounded-full text-xs font-bold">Diproses</span>
                  </td>
                  <td className="p-3">
                    <button className="text-blue-600 hover:underline text-sm">Detail</button>
                  </td>
                </tr>
              ))}
              {orders.length === 0 && (
                <tr>
                  <td colSpan="6" className="p-4 text-center text-stone-500">Belum ada pesanan</td>
                </tr>
              )}
            </tbody>
          </table>
        </div>
      )}
    </div>
  );
};

export default ManageOrders;
