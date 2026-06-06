import React, { useState, useEffect } from 'react';
import { useAuth } from '../../context/AuthContext';

const AddressSettings = () => {
  const { user, updateProfile } = useAuth();
  
  const [address, setAddress] = useState('');

  useEffect(() => {
    if (user) {
      setAddress(user.address || '');
    }
  }, [user]);

  const handleSave = (e) => {
    e.preventDefault();
    updateProfile({
      address: address
    });
    alert('Alamat berhasil diperbarui!');
  };

  return (
    <div className="p-6 md:p-8">
      <div className="border-b border-stone-200 pb-4 mb-6">
        <h2 className="text-lg font-medium text-stone-900">Alamat Saya</h2>
        <p className="text-sm text-stone-500">Kelola informasi alamat pengiriman Anda</p>
      </div>

      <form onSubmit={handleSave} className="space-y-6 max-w-2xl">
        <div>
          <label className="block text-sm text-stone-700 font-medium mb-2">Alamat Lengkap</label>
          <textarea
            required
            rows="4"
            value={address}
            onChange={(e) => setAddress(e.target.value)}
            className="w-full px-4 py-3 border border-stone-300 rounded focus:outline-none focus:border-stone-500 text-sm resize-none"
            placeholder="Contoh: Jl. Sudirman No. 123, RT 01/RW 02, Desa Sukorejo..."
          ></textarea>
        </div>

        <button type="submit" className="bg-[#ee4d2d] hover:bg-[#d73f22] text-white px-6 py-2 rounded shadow-sm text-sm font-medium transition-colors">
          Simpan Alamat
        </button>
      </form>
    </div>
  );
};

export default AddressSettings;
