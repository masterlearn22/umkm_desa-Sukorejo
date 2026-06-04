import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { useAuth } from '../context/AuthContext';
import { Save, LogOut, User } from 'lucide-react';

export const Profile = () => {
  const { user, isLoggedIn, updateProfile, logout } = useAuth();
  const navigate = useNavigate();

  const [formData, setFormData] = useState({
    name: '',
    phone: '',
    email: '',
    address: ''
  });

  const [isEditing, setIsEditing] = useState(false);

  useEffect(() => {
    if (!isLoggedIn) {
      navigate('/login', { replace: true });
    } else if (user) {
      setFormData({
        name: user.name || '',
        phone: user.phone || '',
        email: user.email || '',
        address: user.address || ''
      });
    }
  }, [isLoggedIn, user, navigate]);

  const handleChange = (e) => {
    setFormData(prev => ({ ...prev, [e.target.name]: e.target.value }));
  };

  const handleSave = (e) => {
    e.preventDefault();
    updateProfile(formData);
    
    // Also update the pseudo-database in localStorage
    const savedUserStr = localStorage.getItem('umkm-registered-users');
    let users = savedUserStr ? JSON.parse(savedUserStr) : [];
    const userIndex = users.findIndex(u => u.email === formData.email);
    if (userIndex !== -1) {
      users[userIndex] = { ...users[userIndex], ...formData };
      localStorage.setItem('umkm-registered-users', JSON.stringify(users));
    }

    setIsEditing(false);
    alert('Profil berhasil diperbarui!');
  };

  const handleLogout = () => {
    logout();
    navigate('/');
  };

  if (!user) return null;

  return (
    <div className="bg-stone-50 min-h-screen py-12">
      <div className="max-w-screen-md mx-auto px-4 sm:px-6 lg:px-8">
        
        <div className="bg-white rounded-3xl shadow-sm border border-stone-200 overflow-hidden">
          {/* Header */}
          <div className="bg-[#f4f2ec] px-8 py-10 flex flex-col items-center text-center border-b border-stone-200">
            <div className="w-24 h-24 bg-stone-900 rounded-full flex items-center justify-center text-white mb-4">
              <User size={40} />
            </div>
            <h1 className="text-3xl font-heading font-black text-stone-900 uppercase tracking-widest">
              Profil Saya
            </h1>
            <p className="text-stone-500 mt-2">{user.email}</p>
          </div>

          {/* Body */}
          <div className="p-8 md:p-12">
            <form onSubmit={handleSave} className="space-y-6">
              
              <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                <div>
                  <label className="block text-xs font-bold uppercase tracking-widest text-stone-700 mb-2">Nama Lengkap</label>
                  <input
                    type="text"
                    name="name"
                    required
                    disabled={!isEditing}
                    value={formData.name}
                    onChange={handleChange}
                    className="w-full px-5 py-4 bg-stone-50 border border-stone-200 rounded-xl focus:ring-2 focus:ring-stone-900 focus:border-transparent outline-none transition-all disabled:opacity-70 disabled:bg-stone-100 text-stone-900"
                  />
                </div>
                <div>
                  <label className="block text-xs font-bold uppercase tracking-widest text-stone-700 mb-2">No. WhatsApp</label>
                  <input
                    type="tel"
                    name="phone"
                    required
                    disabled={!isEditing}
                    value={formData.phone}
                    onChange={handleChange}
                    className="w-full px-5 py-4 bg-stone-50 border border-stone-200 rounded-xl focus:ring-2 focus:ring-stone-900 focus:border-transparent outline-none transition-all disabled:opacity-70 disabled:bg-stone-100 text-stone-900"
                  />
                </div>
              </div>

              <div>
                <label className="block text-xs font-bold uppercase tracking-widest text-stone-700 mb-2">Alamat Pengiriman (Default)</label>
                <textarea
                  name="address"
                  required
                  rows="4"
                  disabled={!isEditing}
                  value={formData.address}
                  onChange={handleChange}
                  className="w-full px-5 py-4 bg-stone-50 border border-stone-200 rounded-xl focus:ring-2 focus:ring-stone-900 focus:border-transparent outline-none transition-all disabled:opacity-70 disabled:bg-stone-100 text-stone-900 resize-none"
                ></textarea>
                <p className="text-xs text-stone-400 mt-2">
                  Alamat ini akan otomatis digunakan saat Anda melakukan pesanan.
                </p>
              </div>

              <div className="flex flex-col sm:flex-row justify-between items-center gap-4 pt-6 border-t border-stone-100 mt-8">
                <button
                  type="button"
                  onClick={handleLogout}
                  className="w-full sm:w-auto px-6 py-3 flex items-center justify-center gap-2 text-red-500 font-bold uppercase tracking-widest text-sm hover:bg-red-50 rounded-full transition-colors"
                >
                  <LogOut size={18} /> Keluar
                </button>
                
                {isEditing ? (
                  <button
                    type="submit"
                    className="w-full sm:w-auto px-8 py-3 bg-stone-900 text-white rounded-full font-bold uppercase tracking-widest text-sm hover:bg-stone-800 transition-colors flex items-center justify-center gap-2"
                  >
                    Simpan Perubahan <Save size={18} />
                  </button>
                ) : (
                  <button
                    type="button"
                    onClick={() => setIsEditing(true)}
                    className="w-full sm:w-auto px-8 py-3 bg-stone-200 text-stone-900 rounded-full font-bold uppercase tracking-widest text-sm hover:bg-stone-300 transition-colors"
                  >
                    Edit Profil
                  </button>
                )}
              </div>

            </form>
          </div>
        </div>

      </div>
    </div>
  );
};
