import React, { useState, useEffect } from 'react';
import { fetchUsers } from '../../services/api';

const ManageUsers = () => {
  const [users, setUsers] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const loadData = async () => {
      const data = await fetchUsers();
      // Remove header row if it leaked from GAS, though we handled it in script
      setUsers(data);
      setLoading(false);
    };
    loadData();
  }, []);

  return (
    <div className="bg-white rounded-2xl shadow-sm border border-stone-200 p-6">
      <div className="flex justify-between items-center mb-6">
        <h3 className="font-heading font-black text-xl tracking-widest uppercase text-stone-900">Manajemen Pengguna</h3>
      </div>
      
      {loading ? (
        <div className="text-center py-10 text-stone-500">Memuat data...</div>
      ) : (
        <div className="overflow-x-auto">
          <table className="w-full text-left border-collapse">
            <thead>
              <tr className="border-b border-stone-200 text-xs text-stone-500 uppercase tracking-widest">
                <th className="p-3 font-bold">Terdaftar</th>
                <th className="p-3 font-bold">Nama Lengkap</th>
                <th className="p-3 font-bold">Email</th>
                <th className="p-3 font-bold">Nomor WA</th>
                <th className="p-3 font-bold">Role</th>
                <th className="p-3 font-bold">Aksi</th>
              </tr>
            </thead>
            <tbody>
              {users.map((u, i) => (
                <tr key={i} className="border-b border-stone-100 hover:bg-stone-50 transition-colors">
                  <td className="p-3 font-medium text-stone-900 whitespace-nowrap">{new Date(u.Waktu_Daftar).toLocaleDateString('id-ID')}</td>
                  <td className="p-3 text-stone-600 font-medium">{u.Nama_Lengkap || '-'}</td>
                  <td className="p-3 text-stone-600">{u.Email || '-'}</td>
                  <td className="p-3 text-stone-600">{u.Nomor_WA || '-'}</td>
                  <td className="p-3">
                    <span className={`px-2 py-1 rounded-full text-[10px] font-bold uppercase tracking-wider ${
                      u.Role === 'admin' ? 'bg-red-100 text-red-800' :
                      u.Role === 'penjual' ? 'bg-blue-100 text-blue-800' :
                      'bg-stone-200 text-stone-800'
                    }`}>
                      {u.Role || 'user'}
                    </span>
                  </td>
                  <td className="p-3">
                    <button className="text-blue-600 hover:underline text-sm">Ubah Role</button>
                  </td>
                </tr>
              ))}
              {users.length === 0 && (
                <tr>
                  <td colSpan="6" className="p-4 text-center text-stone-500">Belum ada pengguna</td>
                </tr>
              )}
            </tbody>
          </table>
        </div>
      )}
    </div>
  );
};

export default ManageUsers;
