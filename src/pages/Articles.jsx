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
          <div className="flex flex-col space-y-10">
            {articles.map((article) => (
              <div key={article.ID_Artikel} className="group flex flex-col md:flex-row gap-6 md:gap-8 pb-10 border-b border-stone-200 last:border-0 last:pb-0 items-start">
                {article.Gambar && (
                  <div className="w-full md:w-72 h-52 md:h-48 flex-shrink-0 bg-stone-100 rounded-xl overflow-hidden relative">
                    <img 
                      src={article.Gambar} 
                      alt={article.Judul} 
                      className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-500"
                      onError={(e) => {
                        e.target.parentElement.style.display = 'none';
                      }}
                    />
                    <div className="absolute top-3 left-3 bg-white/90 backdrop-blur-sm px-2.5 py-1 rounded text-[10px] font-bold tracking-wider uppercase text-stone-700 shadow-sm">
                      Kabar Desa
                    </div>
                  </div>
                )}
                
                <div className="flex flex-col flex-grow py-1">
                  <h2 className="text-2xl md:text-3xl font-bold text-stone-900 mb-3 group-hover:text-emerald-700 transition-colors leading-tight">
                    <Link to={`/artikel/${article.ID_Artikel}`}>
                      {article.Judul}
                    </Link>
                  </h2>
                  
                  <div className="flex items-center text-sm text-stone-500 mb-4 space-x-5">
                    <div className="flex items-center">
                      <User size={16} className="mr-2" />
                      <span className="font-medium">{article.Penulis}</span>
                    </div>
                    <div className="flex items-center">
                      <Calendar size={16} className="mr-2" />
                      <span>{new Date(article.Tanggal).toLocaleDateString('id-ID', { day: 'numeric', month: 'long', year: 'numeric' })}</span>
                    </div>
                  </div>
                  
                  <p className="text-stone-600 text-base mb-6 line-clamp-3 leading-relaxed">
                    {getExcerpt(article.Konten)}
                  </p>
                  
                  <Link 
                    to={`/artikel/${article.ID_Artikel}`}
                    className="inline-flex items-center text-emerald-600 font-bold hover:text-emerald-800 transition-colors group/link mt-auto w-fit"
                  >
                    Baca Selengkapnya 
                    <ArrowRight size={18} className="ml-1.5 transform group-hover/link:translate-x-1.5 transition-transform" />
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
