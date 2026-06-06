import React, { useState, useEffect } from 'react';
import { useAuth } from '../../context/AuthContext';
import { User } from 'lucide-react';
import { updateProfileData } from '../../services/api';

const ProfileSettings = () => {
  const { user, updateProfile } = useAuth();
  
  const [formData, setFormData] = useState({
    username: '',
    name: '',
    email: '',
    phone: '',
    gender: 'Laki-laki',
    dob: ''
  });
  
  const [loading, setLoading] = useState(false);

  useEffect(() => {
    if (user) {
      setFormData({
        username: user.email ? user.email.split('@')[0] : '',
        name: user.name || '',
        email: user.email || '',
        phone: user.phone || '',
        gender: user.gender || 'Laki-laki',
        dob: user.dob || ''
      });
    }
  }, [user]);

  const handleChange = (e) => {
    setFormData(prev => ({ ...prev, [e.target.name]: e.target.value }));
  };

  const handleSave = async (e) => {
    e.preventDefault();
    setLoading(true);
    try {
      const response = await updateProfileData({
        email: formData.email,
        name: formData.name,
        phone: formData.phone,
        gender: formData.gender,
        dob: formData.dob
      });
      
      if (response.status === 'success') {
        updateProfile({
          name: formData.name,
          phone: formData.phone,
          gender: formData.gender,
          dob: formData.dob
        });
        alert('Profil berhasil diperbarui!');
      } else {
        alert(response.message || 'Gagal memperbarui profil.');
      }
    } catch (error) {
      alert('Terjadi kesalahan koneksi.');
    } finally {
      setLoading(false);
    }
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
              </div>
            </div>

            <div className="flex items-center">
              <label className="w-1/3 text-right pr-4 text-sm text-stone-500">Nomor Telepon</label>
              <div className="w-2/3 text-sm">
                <input 
                  type="text" 
                  name="phone"
                  value={formData.phone}
                  onChange={handleChange}
                  className="w-full px-3 py-2 border border-stone-300 rounded focus:outline-none focus:border-stone-500 text-sm"
                  placeholder="Contoh: 08123456789"
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
              </div>
            </div>

            <div className="flex items-center pt-4">
              <div className="w-1/3"></div>
              <div className="w-2/3">
                <button type="submit" disabled={loading} className="bg-[#ee4d2d] hover:bg-[#d73f22] disabled:opacity-50 text-white px-6 py-2 rounded shadow-sm text-sm font-medium transition-colors">
                  {loading ? 'Menyimpan...' : 'Simpan'}
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
