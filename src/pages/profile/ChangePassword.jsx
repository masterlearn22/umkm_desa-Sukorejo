import React, { useState } from 'react';
import { useAuth } from '../../context/AuthContext';
import { changePassword } from '../../services/api';

const ChangePassword = () => {
  const { user } = useAuth();
  const [passwords, setPasswords] = useState({
    oldPassword: '',
    newPassword: '',
    confirmPassword: ''
  });
  const [loading, setLoading] = useState(false);

  const handleChange = (e) => {
    setPasswords(prev => ({ ...prev, [e.target.name]: e.target.value }));
  };

  const handleSave = async (e) => {
    e.preventDefault();
    if (passwords.newPassword !== passwords.confirmPassword) {
      alert('Password baru dan konfirmasi tidak cocok!');
      return;
    }
    setLoading(true);
    try {
      const { hashPassword } = await import('../../utils/hash');
      const hashedOld = await hashPassword(passwords.oldPassword);
      const hashedNew = await hashPassword(passwords.newPassword);
      
      const res = await changePassword(user.email, hashedOld, hashedNew);
      if (res.status === 'success') {
        alert('Password berhasil diubah!');
        setPasswords({ oldPassword: '', newPassword: '', confirmPassword: '' });
      } else {
        alert(res.message || 'Gagal mengubah password');
      }
    } catch (err) {
      alert('Terjadi kesalahan koneksi.');
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="p-6 md:p-8">
      <div className="border-b border-stone-200 pb-4 mb-6">
        <h2 className="text-lg font-medium text-stone-900">Ubah Password</h2>
        <p className="text-sm text-stone-500">Untuk keamanan akun Anda, mohon tidak menyebarkan password Anda ke orang lain.</p>
      </div>

      <form onSubmit={handleSave} className="space-y-6 max-w-2xl">
        <div className="flex items-center">
          <label className="w-1/3 text-right pr-4 text-sm text-stone-500">Password Saat Ini</label>
          <div className="w-2/3">
            <input 
              type="password" 
              name="oldPassword"
              required
              value={passwords.oldPassword}
              onChange={handleChange}
              className="w-full px-3 py-2 border border-stone-300 rounded focus:outline-none focus:border-stone-500 text-sm"
            />
          </div>
        </div>

        <div className="flex items-center">
          <label className="w-1/3 text-right pr-4 text-sm text-stone-500">Password Baru</label>
          <div className="w-2/3">
            <input 
              type="password" 
              name="newPassword"
              required
              value={passwords.newPassword}
              onChange={handleChange}
              className="w-full px-3 py-2 border border-stone-300 rounded focus:outline-none focus:border-stone-500 text-sm"
            />
          </div>
        </div>

        <div className="flex items-center">
          <label className="w-1/3 text-right pr-4 text-sm text-stone-500">Konfirmasi Password</label>
          <div className="w-2/3">
            <input 
              type="password" 
              name="confirmPassword"
              required
              value={passwords.confirmPassword}
              onChange={handleChange}
              className="w-full px-3 py-2 border border-stone-300 rounded focus:outline-none focus:border-stone-500 text-sm"
            />
          </div>
        </div>

        <div className="flex items-center pt-4">
          <div className="w-1/3"></div>
          <div className="w-2/3">
            <button type="submit" disabled={loading} className="bg-[#ee4d2d] hover:bg-[#d73f22] disabled:opacity-50 text-white px-6 py-2 rounded shadow-sm text-sm font-medium transition-colors">
              {loading ? 'Memproses...' : 'Konfirmasi'}
            </button>
          </div>
        </div>
      </form>
    </div>
  );
};

export default ChangePassword;
