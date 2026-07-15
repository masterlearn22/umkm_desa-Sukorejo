import React, { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import { fetchArticles } from '../services/api';
import SEO from '../components/SEO';
import { useLanguage } from '../context/LanguageContext';
import { Calendar, User, ArrowRight } from 'lucide-react';

const Articles = () => {
  const { t } = useLanguage();
  const [articles, setArticles] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const loadArticles = async () => {
      setLoading(true);
      try {
        const data = await fetchArticles();
        // Only show published articles
        const published = data.filter(a => a.Status === 'Published');
        setArticles(published);
      } catch (error) {
        console.error("Failed to load articles:", error);
      } finally {
        setLoading(false);
      }
    };
    loadArticles();
  }, []);

  const getExcerpt = (konten) => {
    try {
      const blocks = JSON.parse(konten);
      if (Array.isArray(blocks)) {
        const firstText = blocks.find(b => b.type === 'paragraph' && b.content)?.content;
        return firstText || 'Tidak ada deskripsi.';
      }
    } catch {
      return konten || 'Tidak ada deskripsi.';
    }
    return 'Tidak ada deskripsi.';
  };

  return (
    <div className="bg-stone-50 min-h-screen pt-32 pb-24">
      <SEO 
        title="Berita & Artikel"
        description="Kumpulan berita, artikel, dan wawasan terbaru seputar UMKM, kerajinan, dan perkembangan Desa Sukorejo Banyuwangi."
        keywords="Berita BUMDes, Artikel UMKM, Kabar Sukorejo, Blog Desa"
      />
      
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="text-center mb-16">
          <h1 className="text-4xl md:text-5xl font-playfair font-bold text-stone-900 mb-4">
            Berita & Artikel
          </h1>
          <p className="text-stone-500 max-w-2xl mx-auto text-lg">
            Ikuti perkembangan terbaru, kegiatan desa, dan cerita inspiratif dari para pelaku UMKM di Sukorejo.
          </p>
        </div>
        
        {loading ? (
          <div className="flex justify-center items-center h-64">
            <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-emerald-600"></div>
          </div>
        ) : articles.length === 0 ? (
          <div className="text-center text-stone-500 py-12 bg-white rounded-2xl shadow-sm border border-stone-100">
            Belum ada artikel yang dipublikasikan saat ini.
          </div>
        ) : (
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
            {articles.map((article) => (
              <div key={article.ID_Artikel} className="bg-white rounded-2xl shadow-sm border border-stone-100 overflow-hidden hover:shadow-xl hover:-translate-y-1 transition-all duration-300 flex flex-col group">
                <div className="relative h-56 overflow-hidden bg-stone-200">
                  {article.Gambar ? (
                    <img 
                      src={article.Gambar} 
                      alt={article.Judul} 
                      className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-500"
                    />
                  ) : (
                    <div className="w-full h-full flex items-center justify-center text-stone-400">
                      <span>No Image</span>
                    </div>
                  )}
                  <div className="absolute top-4 left-4 bg-white/90 backdrop-blur-sm px-3 py-1 rounded-full text-xs font-semibold text-stone-700 shadow-sm">
                    Kabar Desa
                  </div>
                </div>
                
                <div className="p-6 flex flex-col flex-grow">
                  <h2 className="text-xl font-bold text-stone-900 mb-3 line-clamp-2 leading-snug group-hover:text-emerald-700 transition-colors">
                    {article.Judul}
                  </h2>
                  
                  <div className="flex items-center text-xs text-stone-500 mb-4 space-x-4">
                    <div className="flex items-center">
                      <User size={14} className="mr-1.5" />
                      <span className="font-medium">{article.Penulis}</span>
                    </div>
                    <div className="flex items-center">
                      <Calendar size={14} className="mr-1.5" />
                      <span>{new Date(article.Tanggal).toLocaleDateString('id-ID', { day: 'numeric', month: 'long', year: 'numeric' })}</span>
                    </div>
                  </div>
                  
                  <p className="text-stone-600 text-sm mb-6 line-clamp-3 flex-grow leading-relaxed">
                    {getExcerpt(article.Konten)}
                  </p>
                  
                  <Link 
                    to={`/artikel/${article.ID_Artikel}`}
                    className="inline-flex items-center text-emerald-600 font-semibold hover:text-emerald-800 transition-colors mt-auto group/link"
                  >
                    Baca Selengkapnya 
                    <ArrowRight size={16} className="ml-1 transform group-hover/link:translate-x-1 transition-transform" />
                  </Link>
                </div>
              </div>
            ))}
          </div>
        )}
      </div>
    </div>
  );
};

export default Articles;
