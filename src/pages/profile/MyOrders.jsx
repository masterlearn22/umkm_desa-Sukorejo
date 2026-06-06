import React, { useState, useEffect } from 'react';
import { useAuth } from '../../context/AuthContext';
import { fetchOrders } from '../../services/api';
import { Store, MessageSquare } from 'lucide-react';

const TABS = [
  { id: 'all', label: 'Semua' },
  { id: 'Belum Bayar', label: 'Belum Bayar' },
  { id: 'Sedang Dikemas', label: 'Sedang Dikemas' },
  { id: 'Dikirim', label: 'Dikirim' },
  { id: 'Selesai', label: 'Selesai' },
  { id: 'Dibatalkan', label: 'Dibatalkan' },
  { id: 'Pengembalian', label: 'Pengembalian Barang/Dana' }
];

const MOCK_STATUSES = ['Selesai', 'Belum Bayar', 'Sedang Dikemas', 'Dikirim', 'Dibatalkan', 'Pengembalian'];

const MyOrders = () => {
  const { user } = useAuth();
  const [activeTab, setActiveTab] = useState('all');
  const [orders, setOrders] = useState([]);
  const [loading, setLoading] = useState(true);
  const [searchQuery, setSearchQuery] = useState('');

  useEffect(() => {
    const loadOrders = async () => {
      setLoading(true);
      const data = await fetchOrders();
      // Filter based on user email
      const userOrders = data.filter(o => o.Email === user?.email);
      
      // Inject dummy status for UI demonstration because GAS doesn't have it yet
      const ordersWithStatus = userOrders.map((o, idx) => ({
        ...o,
        Status_Pesanan: MOCK_STATUSES[idx % MOCK_STATUSES.length]
      }));

      setOrders(ordersWithStatus);
      setLoading(false);
    };

    if (user) {
      loadOrders();
    }
  }, [user]);

  // Filter orders by tab and search query
  const filteredOrders = orders.filter(order => {
    const matchTab = activeTab === 'all' || order.Status_Pesanan === activeTab || (activeTab === 'Pengembalian' && order.Status_Pesanan === 'Pengembalian');
    const matchSearch = order.Nama_Pelanggan?.toLowerCase().includes(searchQuery.toLowerCase()) || 
                        order.Order_ID?.toLowerCase().includes(searchQuery.toLowerCase()) ||
                        order.Detail_Produk?.toLowerCase().includes(searchQuery.toLowerCase());
    return matchTab && matchSearch;
  });

  return (
    <div className="flex flex-col h-full bg-stone-50">
      {/* Tabs */}
      <div className="bg-white flex overflow-x-auto shadow-sm sticky top-0 z-10 scrollbar-hide">
        {TABS.map(tab => (
          <button
            key={tab.id}
            onClick={() => setActiveTab(tab.id)}
            className={`whitespace-nowrap flex-1 py-4 px-4 text-sm font-medium transition-colors border-b-2 ${
              activeTab === tab.id 
                ? 'border-[#ee4d2d] text-[#ee4d2d]' 
                : 'border-transparent text-stone-700 hover:text-[#ee4d2d]'
            }`}
          >
            {tab.label}
          </button>
        ))}
      </div>

      {/* Search Bar */}
      <div className="p-4">
        <div className="relative bg-stone-200/50 rounded flex items-center px-4 py-2">
          <svg className="w-4 h-4 text-stone-500 mr-2" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M21 21l-6-6m2-5a7 7 0 11-14 0 7 7 0 0114 0z"></path></svg>
          <input 
            type="text" 
            placeholder="Kamu bisa cari berdasarkan Nama Penjual, No. Pesanan atau Nama Produk" 
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
            className="bg-transparent border-none outline-none w-full text-sm text-stone-700 placeholder-stone-500"
          />
        </div>
      </div>

      {/* Order List */}
      <div className="px-4 pb-8 space-y-4">
        {loading ? (
          <div className="text-center py-10 text-stone-500">Memuat pesanan...</div>
        ) : filteredOrders.length === 0 ? (
          <div className="bg-white p-10 text-center text-stone-500 shadow-sm rounded-sm">
            <div className="w-24 h-24 mx-auto mb-4 bg-stone-100 rounded-full flex items-center justify-center">
              <ShoppingBag size={40} className="text-stone-300" />
            </div>
            Belum ada pesanan
          </div>
        ) : (
          filteredOrders.map((order, idx) => (
            <div key={idx} className="bg-white shadow-sm rounded-sm overflow-hidden">
              {/* Header: Shop Name & Status */}
              <div className="px-6 py-3 border-b border-stone-100 flex justify-between items-center bg-stone-50/50">
                <div className="flex items-center gap-2">
                  <span className="bg-[#ee4d2d] text-white text-[10px] px-1 rounded font-bold">Mall</span>
                  <span className="font-bold text-sm text-stone-800">Toko Desa Sukorejo</span>
                  <button className="flex items-center gap-1 bg-[#ee4d2d] text-white px-2 py-0.5 rounded text-[10px] font-medium ml-2">
                    <MessageSquare size={10} /> Chat
                  </button>
                  <button className="flex items-center gap-1 border border-stone-300 text-stone-600 px-2 py-0.5 rounded text-[10px] font-medium hover:bg-stone-50">
                    <Store size={10} /> Kunjungi Toko
                  </button>
                </div>
                <div className="flex items-center gap-2">
                  <span className="text-[#26aa99] text-xs font-medium flex items-center gap-1">
                    <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M5 8h14M5 8a2 2 0 110-4h14a2 2 0 110 4M5 8v10a2 2 0 002 2h10a2 2 0 002-2V8m-9 4h4"></path></svg>
                    Pesanan tiba di alamat tujuan.
                  </span>
                  <span className="text-stone-300">|</span>
                  <span className="text-[#ee4d2d] font-bold text-sm uppercase">{order.Status_Pesanan}</span>
                </div>
              </div>

              {/* Body: Products */}
              <div className="px-6 py-4 flex gap-4 cursor-pointer hover:bg-stone-50 transition-colors">
                <div className="w-20 h-20 bg-stone-100 border border-stone-200 flex-shrink-0">
                  <img src="https://images.unsplash.com/photo-1527325678964-54921661f888?ixlib=rb-1.2.1&auto=format&fit=crop&w=150&q=80" alt="Product" className="w-full h-full object-cover" />
                </div>
                <div className="flex-grow">
                  <div className="flex justify-between items-start">
                    <h3 className="text-stone-800 text-sm">{order.Detail_Produk || 'Produk Pesanan'}</h3>
                    <div className="text-right ml-4">
                      <p className="text-sm text-[#ee4d2d]">Rp{order.Total_Harga?.toLocaleString('id-ID') || 0}</p>
                    </div>
                  </div>
                  <p className="text-stone-500 text-xs mt-1">Variasi: -</p>
                  <p className="text-stone-800 text-xs mt-1">x1</p>
                </div>
              </div>

              {/* Footer: Total & Actions */}
              <div className="px-6 py-4 border-t border-stone-100 bg-[#fffefb]">
                <div className="flex justify-end items-center mb-4">
                  <span className="text-sm text-stone-800 mr-2">Total Pesanan:</span>
                  <span className="text-2xl font-medium text-[#ee4d2d]">Rp{order.Total_Harga?.toLocaleString('id-ID') || 0}</span>
                </div>
                <div className="flex justify-between items-center">
                  <div className="text-xs text-stone-500">
                    <p>Pesanan ID: <span className="font-mono">{order.Order_ID}</span></p>
                    <p className="text-[#ee4d2d] mt-1">Nilai sekarang & dapatkan 25 Koin!</p>
                  </div>
                  <div className="flex gap-2">
                    {order.Status_Pesanan === 'Selesai' && (
                      <button className="bg-[#ee4d2d] hover:bg-[#d73f22] text-white px-8 py-2 text-sm rounded shadow-sm transition-colors min-w-[130px]">
                        Nilai
                      </button>
                    )}
                    <button className="border border-stone-300 bg-white text-stone-700 hover:bg-stone-50 px-4 py-2 text-sm rounded transition-colors">
                      Hubungi Penjual
                    </button>
                    <button className="border border-stone-300 bg-white text-stone-700 hover:bg-stone-50 px-4 py-2 text-sm rounded transition-colors">
                      Beli Lagi
                    </button>
                  </div>
                </div>
              </div>

            </div>
          ))
        )}
      </div>
    </div>
  );
};

export default MyOrders;
