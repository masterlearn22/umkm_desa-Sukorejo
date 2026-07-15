import React, { useState, useEffect } from 'react';
import { Plus, Edit2, Trash2, Search, FileText } from 'lucide-react';
import { fetchArticles, deleteArticle } from '../../services/api';
import { useNavigate } from 'react-router-dom';

const ManageArticles = () => {
  const [articles, setArticles] = useState([]);
  const [loading, setLoading] = useState(true);
  const [searchQuery, setSearchQuery] = useState('');
  const navigate = useNavigate();

  const loadArticles = async () => {
    try {
      const data = await fetchArticles();
      setArticles(data);
    } catch (error) {
      console.error("Failed to load articles:", error);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    loadArticles();
  }, []);

  const handleDelete = async (id) => {
    if (window.confirm('Yakin ingin menghapus artikel ini?')) {
      try {
        await deleteArticle(id);
        loadArticles();
      } catch (error) {
        console.error("Error deleting article:", error);
        alert("Gagal menghapus artikel.");
      }
    }
  };

  const filteredArticles = articles.filter(article => 
    article.Judul?.toLowerCase().includes(searchQuery.toLowerCase()) ||
    article.Penulis?.toLowerCase().includes(searchQuery.toLowerCase())
  );

  return (
    <div className="bg-white rounded-xl shadow-sm border border-stone-200">
      {/* Header */}
      <div className="p-6 border-b border-stone-200 flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4">
        <div>
          <h2 className="text-xl font-bold text-stone-800">Manajemen Artikel</h2>
          <p className="text-sm text-stone-500 mt-1">Kelola publikasi artikel dan berita desa.</p>
        </div>
          <button
            onClick={() => navigate('/dashboard/articles/create')}
            className="flex items-center gap-2 px-4 py-2 bg-emerald-600 text-white rounded-lg hover:bg-emerald-700 transition-colors"
          >
            <Plus size={20} />
            Buat Artikel
          </button>
      </div>

      {/* Toolbar */}
      <div className="p-6 border-b border-stone-200 bg-stone-50/50">
        <div className="relative">
          <Search className="absolute left-3 top-1/2 -translate-y-1/2 text-stone-400" size={20} />
          <input
            type="text"
            placeholder="Cari berdasarkan judul atau penulis..."
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
            className="w-full pl-10 pr-4 py-2 bg-white border border-stone-300 rounded-lg focus:ring-2 focus:ring-emerald-500 focus:border-emerald-500 outline-none transition-all"
          />
        </div>
      </div>

      {/* Table */}
      <div className="overflow-x-auto">
        {loading ? (
          <div className="p-12 text-center text-stone-500 flex flex-col items-center">
            <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-emerald-600 mb-4"></div>
            <p>Memuat data artikel...</p>
          </div>
        ) : filteredArticles.length === 0 ? (
          <div className="p-12 text-center text-stone-500 flex flex-col items-center">
            <FileText size={48} className="mb-4 text-stone-300" />
            <p>Tidak ada artikel yang ditemukan.</p>
          </div>
        ) : (
          <table className="w-full text-left text-sm">
            <thead className="bg-stone-50 text-stone-600 font-medium">
              <tr>
                <th className="px-6 py-4">Judul</th>
                <th className="px-6 py-4">Penulis</th>
                <th className="px-6 py-4">Tanggal</th>
                <th className="px-6 py-4">Status</th>
                <th className="px-6 py-4 text-right">Aksi</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-stone-200">
              {filteredArticles.map((article) => (
                <tr key={article.ID_Artikel} className="hover:bg-stone-50 transition-colors">
                  <td className="px-6 py-4">
                    <div className="font-medium text-stone-900 line-clamp-1">{article.Judul}</div>
                  </td>
                  <td className="px-6 py-4 text-stone-600">{article.Penulis}</td>
                  <td className="px-6 py-4 text-stone-600">
                    {new Date(article.Tanggal).toLocaleDateString()}
                  </td>
                  <td className="px-6 py-4">
                    <span className={`px-3 py-1 rounded-full text-xs font-medium ${
                      article.Status === 'Published' 
                        ? 'bg-emerald-100 text-emerald-700' 
                        : 'bg-amber-100 text-amber-700'
                    }`}>
                      {article.Status}
                    </span>
                  </td>
                      <td className="px-6 py-4 whitespace-nowrap text-sm font-medium">
                        <div className="flex space-x-2 justify-end">
                          <button
                            onClick={() => navigate(`/dashboard/articles/edit/${article.ID_Artikel}`)}
                            className="text-emerald-600 hover:text-emerald-900 bg-emerald-50 p-2 rounded-lg"
                            title="Edit"
                          >
                            <Edit2 size={16} />
                          </button>
                          <button
                            onClick={() => handleDelete(article.ID_Artikel)}
                            className="text-red-600 hover:text-red-900 bg-red-50 p-2 rounded-lg"
                            title="Hapus"
                          >
                            <Trash2 size={16} />
                          </button>
                        </div>
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
        )}
      </div>
    </div>
  );
};

export default ManageArticles;
