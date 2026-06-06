import React, { useState, useEffect } from 'react';
import { useAuth } from '../../context/AuthContext';
import { User } from 'lucide-react';

const ProfileSettings = () => {
  const { user, updateProfile } = useAuth();
  
  const [formData, setFormData] = useState({
    username: '',
    name: '',
    email: '',
    phone: '',
    shopName: '',
    gender: 'Laki-laki',
    dob: ''
  });

  useEffect(() => {
    if (user) {
      setFormData({
        username: user.email ? user.email.split('@')[0] : '',
        name: user.name || '',
        email: user.email || '',
        phone: user.phone || '',
        shopName: user.role === 'penjual' ? (user.name + ' Store') : '',
        gender: 'Laki-laki', // Dummy default
        dob: '2004-01-01' // Dummy default
      });
    }
  }, [user]);

  const handleChange = (e) => {
    setFormData(prev => ({ ...prev, [e.target.name]: e.target.value }));
  };

  const handleSave = (e) => {
    e.preventDefault();
    // We only update name and phone to AuthContext since that's what it supports
    updateProfile({
      name: formData.name,
      phone: formData.phone
    });
    alert('Profil berhasil diperbarui!');
  };

  return (
    <div className="p-6 md:p-8">
      <div className="border-b border-stone-200 pb-4 mb-6">
        <h2 className="text-lg font-medium text-stone-900">Profil Saya</h2>
        <p className="text-sm text-stone-500">Kelola informasi profil Anda untuk mengontrol, melindungi dan mengamankan akun</p>
      </div>

      <div className="flex flex-col-reverse md:flex-row gap-8">
        {/* Form Fields */}
        <div className="flex-grow">
          <form onSubmit={handleSave} className="space-y-6">
            <div className="flex items-center">
              <label className="w-1/3 text-right pr-4 text-sm text-stone-500">Username</label>
              <div className="w-2/3">
                <span className="text-sm font-medium text-stone-800">{formData.username}</span>
              </div>
            </div>

            <div className="flex items-center">
              <label className="w-1/3 text-right pr-4 text-sm text-stone-500">Nama</label>
              <div className="w-2/3">
                <input 
                  type="text" 
                  name="name"
                  value={formData.name}
                  onChange={handleChange}
                  className="w-full px-3 py-2 border border-stone-300 rounded focus:outline-none focus:border-stone-500 text-sm"
                />
              </div>
            </div>

            <div className="flex items-center">
              <label className="w-1/3 text-right pr-4 text-sm text-stone-500">Email</label>
              <div className="w-2/3 text-sm">
                <span className="text-stone-800">{formData.email.replace(/(.{2})(.*)(?=@)/, (gp1, gp2, gp3) => gp2 + '*'.repeat(gp3.length))}</span>
                <button type="button" className="ml-2 text-blue-600 hover:underline">Ubah</button>
              </div>
            </div>

            <div className="flex items-center">
              <label className="w-1/3 text-right pr-4 text-sm text-stone-500">Nomor Telepon</label>
              <div className="w-2/3 text-sm">
                <span className="text-stone-800">{formData.phone ? formData.phone.replace(/.(?=.{2})/g, '*') : '-'}</span>
                <button type="button" className="ml-2 text-blue-600 hover:underline">Ubah</button>
              </div>
            </div>

            <div className="flex items-center">
              <label className="w-1/3 text-right pr-4 text-sm text-stone-500">Nama Toko</label>
              <div className="w-2/3">
                <input 
                  type="text" 
                  name="shopName"
                  value={formData.shopName}
                  onChange={handleChange}
                  className="w-full px-3 py-2 border border-stone-300 rounded focus:outline-none focus:border-stone-500 text-sm"
                />
              </div>
            </div>

            <div className="flex items-center">
              <label className="w-1/3 text-right pr-4 text-sm text-stone-500">Jenis Kelamin</label>
              <div className="w-2/3 flex items-center gap-4 text-sm text-stone-800">
                <label className="flex items-center gap-2 cursor-pointer">
                  <input type="radio" name="gender" value="Laki-laki" checked={formData.gender === 'Laki-laki'} onChange={handleChange} className="accent-[#ee4d2d]" />
                  Laki-laki
                </label>
                <label className="flex items-center gap-2 cursor-pointer">
                  <input type="radio" name="gender" value="Perempuan" checked={formData.gender === 'Perempuan'} onChange={handleChange} className="accent-[#ee4d2d]" />
                  Perempuan
                </label>
                <label className="flex items-center gap-2 cursor-pointer">
                  <input type="radio" name="gender" value="Lainnya" checked={formData.gender === 'Lainnya'} onChange={handleChange} className="accent-[#ee4d2d]" />
                  Lainnya
                </label>
              </div>
            </div>

            <div className="flex items-center">
              <label className="w-1/3 text-right pr-4 text-sm text-stone-500">Tanggal Lahir</label>
              <div className="w-2/3 text-sm flex items-center gap-3">
                <input 
                  type="date" 
                  name="dob"
                  value={formData.dob}
                  onChange={handleChange}
                  className="px-3 py-1.5 border border-stone-300 rounded focus:outline-none focus:border-stone-500"
                />
                <span className="text-green-600 text-xs flex items-center gap-1">
                  <svg xmlns="http://www.w3.org/2000/svg" className="h-4 w-4" viewBox="0 0 20 20" fill="currentColor">
                    <path fillRule="evenodd" d="M10 18a8 8 0 100-16 8 8 0 000 16zm3.707-9.293a1 1 0 00-1.414-1.414L9 10.586 7.707 9.293a1 1 0 00-1.414 1.414l2 2a1 1 0 001.414 0l4-4z" clipRule="evenodd" />
                  </svg>
                  Terverifikasi
                </span>
              </div>
            </div>

            <div className="flex items-center pt-4">
              <div className="w-1/3"></div>
              <div className="w-2/3">
                <button type="submit" className="bg-[#ee4d2d] hover:bg-[#d73f22] text-white px-6 py-2 rounded shadow-sm text-sm font-medium transition-colors">
                  Simpan
                </button>
              </div>
            </div>
          </form>
        </div>

        {/* Avatar Upload */}
        <div className="w-full md:w-64 border-l border-stone-100 flex flex-col items-center justify-start pt-4">
          <div className="w-28 h-28 bg-stone-100 rounded-full flex items-center justify-center text-stone-400 overflow-hidden mb-4 border border-stone-200">
            <User size={48} />
          </div>
          <button className="border border-stone-300 px-4 py-2 rounded bg-white text-stone-700 text-sm hover:bg-stone-50 font-medium transition-colors mb-4">
            Pilih Gambar
          </button>
          <div className="text-xs text-stone-400 text-center">
            <p>Ukuran gambar: maks. 1 MB</p>
            <p>Format gambar: .JPEG, .PNG</p>
          </div>
        </div>

      </div>
    </div>
  );
};

export default ProfileSettings;
