import React, { useState, useEffect } from 'react';
import { fetchApplications, approveApplication } from '../../services/api';
import { Check, X, Store } from 'lucide-react';

const ManageApplications = () => {
  const [applications, setApplications] = useState([]);
  const [loading, setLoading] = useState(true);
  const [updating, setUpdating] = useState(null);

  useEffect(() => {
    loadApplications();
  }, []);

  const loadApplications = async () => {
    setLoading(true);
    const data = await fetchApplications();
    // Only show pending applications
    setApplications(data.filter(app => app.Status_Pengajuan === 'Pending'));
    setLoading(false);
  };

  const handleApprove = async (idPengajuan) => {
    if (window.confirm('Setujui pengguna ini menjadi penjual?')) {
      setUpdating(idPengajuan);
      try {
        const res = await approveApplication(idPengajuan, 'Disetujui');
        if (res.status === 'success') {
          alert('Pengajuan disetujui!');
          loadApplications();
        } else {
          alert(res.message || 'Gagal menyetujui pengajuan.');
        }
      } catch (err) {
        alert('Terjadi kesalahan koneksi.');
      } finally {
        setUpdating(null);
      }
    }
  };

  const handleReject = async (idPengajuan) => {
    if (window.confirm('Tolak pengajuan pengguna ini?')) {
      setUpdating(idPengajuan);
      try {
        const res = await approveApplication(idPengajuan, 'Ditolak');
        if (res.status === 'success') {
          alert('Pengajuan ditolak.');
          loadApplications();
        } else {
          alert(res.message || 'Gagal menolak pengajuan.');
        }
      } catch (err) {
        alert('Terjadi kesalahan koneksi.');
      } finally {
        setUpdating(null);
      }
    }
  };

  return (
    <div className="bg-white rounded-lg shadow-sm">
      <div className="p-6 border-b border-stone-200">
        <h2 className="text-xl font-bold text-stone-800">Pengajuan Penjual</h2>
        <p className="text-stone-500 text-sm mt-1">Daftar pengguna yang mengajukan diri untuk membuka toko</p>
      </div>
      
      <div className="p-6">
        {loading ? (
          <div className="text-center py-10 text-stone-500">Memuat pengajuan...</div>
        ) : applications.length === 0 ? (
          <div className="text-center py-10 text-stone-500 flex flex-col items-center">
            <Store size={40} className="text-stone-300 mb-3" />
            <p>Tidak ada pengajuan baru yang menunggu persetujuan.</p>
          </div>
        ) : (
          <div className="overflow-x-auto">
            <table className="w-full text-left border-collapse">
              <thead>
                <tr className="bg-stone-50 text-stone-600 text-sm">
                  <th className="p-4 border-b border-stone-200 font-medium">Tanggal</th>
                  <th className="p-4 border-b border-stone-200 font-medium">Email Pengguna</th>
                  <th className="p-4 border-b border-stone-200 font-medium">Informasi Toko</th>
                  <th className="p-4 border-b border-stone-200 font-medium text-center">Aksi</th>
                </tr>
              </thead>
              <tbody>
                {applications.map(app => (
                  <tr key={app.ID_Pengajuan} className="border-b border-stone-100 hover:bg-stone-50/50">
                    <td className="p-4 align-top text-sm">
                      {new Date(app.Waktu_Pengajuan).toLocaleDateString('id-ID')}
                    </td>
                    <td className="p-4 align-top text-sm">
                      <span className="font-medium text-stone-800">{app.Email_Pengguna}</span>
                    </td>
                    <td className="p-4 align-top">
                      <div className="mb-1">
                        <span className="font-bold text-stone-800">{app.Nama_Toko}</span>
                      </div>
                      {app.Deskripsi_Toko && (
                        <p className="text-xs text-stone-500 mb-1">{app.Deskripsi_Toko}</p>
                      )}
                      {app.Alamat_Toko && (
                        <p className="text-xs text-stone-500 italic flex items-start gap-1 mt-2">
                          <svg className="w-3 h-3 mt-0.5 flex-shrink-0" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M17.657 16.657L13.414 20.9a1.998 1.998 0 01-2.827 0l-4.244-4.243a8 8 0 1111.314 0z"></path><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M15 11a3 3 0 11-6 0 3 3 0 016 0z"></path></svg>
                          {app.Alamat_Toko}
                        </p>
                      )}
                    </td>
                    <td className="p-4 align-top text-center space-x-2">
                      <button 
                        onClick={() => handleApprove(app.ID_Pengajuan)}
                        disabled={updating === app.ID_Pengajuan}
                        className="inline-flex items-center gap-1 bg-green-500 hover:bg-green-600 disabled:opacity-50 text-white px-3 py-1.5 rounded text-sm font-medium transition-colors"
                      >
                        <Check size={14} /> Setujui
                      </button>
                      <button 
                        onClick={() => handleReject(app.ID_Pengajuan)}
                        disabled={updating === app.ID_Pengajuan}
                        className="inline-flex items-center gap-1 bg-red-500 hover:bg-red-600 disabled:opacity-50 text-white px-3 py-1.5 rounded text-sm font-medium transition-colors"
                      >
                        <X size={14} /> Tolak
                      </button>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        )}
      </div>
    </div>
  );
};

export default ManageApplications;
