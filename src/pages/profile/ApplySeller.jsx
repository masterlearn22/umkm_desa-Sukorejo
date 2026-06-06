import React, { useState } from 'react';
import { useAuth } from '../../context/AuthContext';
import { submitSellerApplication } from '../../services/api';
import { useNavigate } from 'react-router-dom';
import { Store } from 'lucide-react';

const ApplySeller = () => {
  const { user } = useAuth();
  const navigate = useNavigate();
  
  const [formData, setFormData] = useState({
    shopName: '',
    shopDescription: '',
    shopAddress: ''
  });
  
  const [loading, setLoading] = useState(false);
  const [isSuccess, setIsSuccess] = useState(false);

  const handleChange = (e) => {
    setFormData(prev => ({ ...prev, [e.target.name]: e.target.value }));
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    if (!formData.shopName) {
      alert('Nama Toko wajib diisi!');
      return;
    }
    
    setLoading(true);
    try {
      const res = await submitSellerApplication({
        email: user.email,
        shopName: formData.shopName,
        shopDescription: formData.shopDescription,
        shopAddress: formData.shopAddress
      });
      
      if (res.status === 'success') {
        setIsSuccess(true);
      } else {
        alert(res.message || 'Gagal mengirim pengajuan.');
      }
    } catch (err) {
      alert('Terjadi kesalahan koneksi saat mengirim pengajuan.');
    } finally {
      setLoading(false);
    }
  };

  if (isSuccess) {
    return (
      <div className="p-6 md:p-10 flex flex-col items-center justify-center text-center">
        <div className="w-20 h-20 bg-green-100 rounded-full flex items-center justify-center text-green-500 mb-6">
          <svg className="w-10 h-10" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M5 13l4 4L19 7"></path></svg>
        </div>
        <h2 className="text-xl font-bold text-stone-800 mb-2">Pengajuan Berhasil Dikirim!</h2>
        <p className="text-stone-500 max-w-md mb-8">
          Permintaan Anda untuk menjadi penjual sedang ditinjau oleh Admin. Silakan periksa kembali beberapa saat lagi.
        </p>
        <button onClick={() => navigate('/profile')} className="bg-[#ee4d2d] hover:bg-[#d73f22] text-white px-6 py-2 rounded text-sm font-medium transition-colors">
          Kembali ke Profil
        </button>
      </div>
    );
  }

  return (
    <div className="p-6 md:p-8">
      <div className="border-b border-stone-200 pb-4 mb-6">
        <h2 className="text-lg font-medium text-stone-900">Daftar Menjadi Penjual</h2>
        <p className="text-sm text-stone-500">Isi data toko Anda untuk mulai berjualan bersama BUMDes Sukorejo.</p>
      </div>

      <div className="flex gap-8">
        <div className="flex-grow">
          <form onSubmit={handleSubmit} className="space-y-6">
            <div className="flex flex-col md:flex-row md:items-start">
              <label className="w-full md:w-1/3 md:text-right pr-4 text-sm text-stone-500 pt-2 mb-1 md:mb-0">
                Nama Toko <span className="text-red-500">*</span>
              </label>
              <div className="w-full md:w-2/3">
                <input 
                  type="text" 
                  name="shopName"
                  value={formData.shopName}
                  onChange={handleChange}
                  placeholder="Contoh: Toko Berkah"
                  className="w-full px-3 py-2 border border-stone-300 rounded focus:outline-none focus:border-stone-500 text-sm"
                />
              </div>
            </div>

            <div className="flex flex-col md:flex-row md:items-start">
              <label className="w-full md:w-1/3 md:text-right pr-4 text-sm text-stone-500 pt-2 mb-1 md:mb-0">
                Deskripsi Toko
              </label>
              <div className="w-full md:w-2/3">
                <textarea 
                  name="shopDescription"
                  value={formData.shopDescription}
                  onChange={handleChange}
                  rows="3"
                  placeholder="Jelaskan secara singkat tentang toko Anda..."
                  className="w-full px-3 py-2 border border-stone-300 rounded focus:outline-none focus:border-stone-500 text-sm"
                ></textarea>
              </div>
            </div>

            <div className="flex flex-col md:flex-row md:items-start">
              <label className="w-full md:w-1/3 md:text-right pr-4 text-sm text-stone-500 pt-2 mb-1 md:mb-0">
                Alamat Toko
              </label>
              <div className="w-full md:w-2/3">
                <textarea 
                  name="shopAddress"
                  value={formData.shopAddress}
                  onChange={handleChange}
                  rows="2"
                  placeholder="Contoh: Jl. Merdeka No.1, RT 01 RW 02"
                  className="w-full px-3 py-2 border border-stone-300 rounded focus:outline-none focus:border-stone-500 text-sm"
                ></textarea>
              </div>
            </div>

            <div className="flex items-center pt-4">
              <div className="hidden md:block w-1/3"></div>
              <div className="w-full md:w-2/3">
                <button type="submit" disabled={loading} className="w-full md:w-auto bg-[#ee4d2d] hover:bg-[#d73f22] disabled:opacity-50 text-white px-8 py-2 rounded shadow-sm text-sm font-medium transition-colors">
                  {loading ? 'Mengirim...' : 'Kirim Pengajuan'}
                </button>
              </div>
            </div>
          </form>
        </div>

        {/* Info Sidebar */}
        <div className="hidden lg:flex w-64 border-l border-stone-100 flex-col items-center justify-start pt-4 px-6 text-center">
          <div className="w-20 h-20 bg-stone-100 rounded-full flex items-center justify-center text-[#ee4d2d] overflow-hidden mb-4">
            <Store size={36} />
          </div>
          <h3 className="font-medium text-stone-800 text-sm mb-2">Keuntungan Berjualan</h3>
          <p className="text-xs text-stone-500 mb-2">Jangkau lebih banyak pembeli di desa dan sekitarnya.</p>
          <p className="text-xs text-stone-500">Gratis tanpa biaya pendaftaran.</p>
        </div>
      </div>
    </div>
  );
};

export default ApplySeller;
