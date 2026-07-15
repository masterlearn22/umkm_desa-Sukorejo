import React, { useState, useEffect } from 'react';
import { useParams, Link } from 'react-router-dom';
import { fetchArticles } from '../services/api';
import { Calendar, User, ArrowLeft, ChevronRight } from 'lucide-react';
import SEO from '../components/SEO';

const ArticleDetail = () => {
  const { id } = useParams();
  const [article, setArticle] = useState(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const loadArticle = async () => {
      setLoading(true);
      try {
        const data = await fetchArticles();
        const found = data.find(a => a.ID_Artikel === id);
        setArticle(found);
      } catch (error) {
        console.error("Failed to load article:", error);
      } finally {
        setLoading(false);
      }
    };
    loadArticle();
  }, [id]);

  const getExcerpt = () => {
    try {
      const blocks = JSON.parse(article.Konten);
      if (Array.isArray(blocks)) {
        const firstText = blocks.find(b => b.type === 'paragraph' && b.content)?.content;
        return firstText ? firstText.substring(0, 160) + '...' : '';
      }
    } catch {
      return article.Konten ? article.Konten.substring(0, 160) + '...' : '';
    }
    return '';
  };

  if (loading) {
    return (
      <div className="flex justify-center items-center h-screen bg-stone-50">
        <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-emerald-600"></div>
      </div>
    );
  }

  if (!article) {
    return (
      <div className="container mx-auto px-4 py-32 text-center bg-stone-50 min-h-screen">
        <h2 className="text-3xl font-bold text-stone-800 mb-4">Artikel Tidak Ditemukan</h2>
        <Link to="/artikel" className="text-emerald-600 font-semibold hover:underline">
          &larr; Kembali ke daftar artikel
        </Link>
      </div>
    );
  }

  // Parse blocks once
  let blocks = [];
  try {
    blocks = JSON.parse(article.Konten);
    if (!Array.isArray(blocks)) blocks = [];
  } catch {
    // If not JSON, it's just raw text
  }

  // Extract headings for Table of Contents
  const tocHeadings = blocks.filter(b => b.type === 'heading' && b.content.trim() !== '');

  const scrollToHeading = (e, id) => {
    e.preventDefault();
    const element = document.getElementById(`heading-${id}`);
    if (element) {
      const y = element.getBoundingClientRect().top + window.scrollY - 100; // offset for navbar
      window.scrollTo({ top: y, behavior: 'smooth' });
    }
  };

  return (
    <div className="bg-stone-50 min-h-screen pt-28 pb-24">
      <SEO 
        title={article.Judul}
        description={getExcerpt()}
        image={article.Gambar}
        type="article"
      />
      
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        
        {/* Breadcrumb Navigation */}
        <nav className="flex text-sm text-stone-500 mb-8 font-medium">
          <Link to="/" className="hover:text-emerald-600 transition-colors">Beranda</Link>
          <ChevronRight size={16} className="mx-2 mt-0.5" />
          <Link to="/artikel" className="hover:text-emerald-600 transition-colors">Artikel</Link>
          <ChevronRight size={16} className="mx-2 mt-0.5" />
          <span className="text-stone-800 line-clamp-1">{article.Judul}</span>
        </nav>

        {/* Hero Section */}
        <div className="mb-12">
          <h1 className="text-4xl md:text-5xl lg:text-6xl font-playfair font-bold text-stone-900 leading-tight mb-6">
            {article.Judul}
          </h1>
          
          <div className="flex flex-wrap items-center text-sm font-medium text-stone-500 gap-y-4 gap-x-8 border-y border-stone-200 py-4">
            <div className="flex items-center">
              <div className="w-8 h-8 rounded-full bg-emerald-100 text-emerald-700 flex items-center justify-center mr-3">
                <User size={16} />
              </div>
              <div>
                <p className="text-xs text-stone-400">Penulis</p>
                <p className="text-stone-800">{article.Penulis}</p>
              </div>
            </div>
            <div className="flex items-center border-l border-stone-200 pl-8">
              <Calendar size={18} className="mr-2 text-stone-400" />
              <div>
                <p className="text-xs text-stone-400">Diterbitkan pada</p>
                <p className="text-stone-800">{new Date(article.Tanggal).toLocaleDateString('id-ID', { day: 'numeric', month: 'long', year: 'numeric' })}</p>
              </div>
            </div>
          </div>
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-12 gap-12 relative">
          
          {/* Main Article Content */}
          <article className="lg:col-span-8">
            {article.Gambar && (
              <img 
                src={article.Gambar} 
                alt={article.Judul} 
                className="w-full h-auto max-h-[500px] object-cover rounded-2xl shadow-sm mb-12"
              />
            )}
            
            <div className="prose prose-stone prose-lg max-w-none">
              {blocks.length > 0 ? (
                blocks.map((block) => {
                  if (block.type === 'heading') {
                    return (
                      <h2 
                        key={block.id} 
                        id={`heading-${block.id}`} 
                        className="text-3xl font-bold font-playfair text-stone-900 mt-12 mb-6 scroll-mt-28"
                      >
                        {block.content}
                      </h2>
                    );
                  }
                  if (block.type === 'image') {
                    return (
                      <div key={block.id} className="my-10">
                        <img src={block.content} alt="Visualisasi Artikel" className="w-full rounded-2xl shadow-sm" />
                      </div>
                    );
                  }
                  if (block.type === 'list') {
                    return (
                      <ol key={block.id} className="list-decimal list-outside ml-6 mb-6 text-stone-700 leading-relaxed text-lg space-y-2">
                        {block.content.split('\n').filter(i => i.trim() !== '').map((item, idx) => (
                          <li key={idx} className="pl-2">{item}</li>
                        ))}
                      </ol>
                    );
                  }
                  if (block.type === 'table') {
                    let tableData = [];
                    try { tableData = JSON.parse(block.content); } catch {}
                    if (!Array.isArray(tableData) || tableData.length === 0) return null;
                    return (
                      <div key={block.id} className="overflow-x-auto my-8">
                        <table className="w-full border-collapse border border-stone-200 rounded-lg overflow-hidden shadow-sm text-base">
                          <thead>
                            <tr className="bg-emerald-50 text-emerald-900 border-b border-stone-200">
                              {tableData[0].map((h, i) => (
                                <th key={i} className="px-6 py-3 text-left font-bold border-r border-stone-200 last:border-r-0">{h}</th>
                              ))}
                            </tr>
                          </thead>
                          <tbody>
                            {tableData.slice(1).map((row, r) => (
                              <tr key={r} className="border-b border-stone-200 last:border-b-0 hover:bg-stone-50 transition-colors">
                                {row.map((cell, c) => (
                                  <td key={c} className="px-6 py-4 border-r border-stone-200 last:border-r-0 text-stone-700">{cell}</td>
                                ))}
                              </tr>
                            ))}
                          </tbody>
                        </table>
                      </div>
                    );
                  }
                  // default: paragraph
                  return (
                    <p key={block.id} className="mb-6 text-stone-700 leading-relaxed text-lg text-justify indent-8">
                      {block.content}
                    </p>
                  );
                })
              ) : (
                // Fallback to simple text rendering if no blocks
                article.Konten.split('\n').map((paragraph, idx) => (
                  <p key={idx} className="mb-6 text-stone-700 leading-relaxed text-lg text-justify indent-8">
                    {paragraph}
                  </p>
                ))
              )}
            </div>
          </article>

          {/* Sidebar: Table of Contents */}
          <aside className="lg:col-span-4 hidden lg:block">
            <div className="sticky top-28 bg-white p-8 rounded-2xl shadow-sm border border-stone-100">
              <h3 className="text-lg font-bold text-stone-900 mb-6 font-playfair border-b border-stone-100 pb-4">
                Daftar Isi
              </h3>
              
              {tocHeadings.length > 0 ? (
                <ul className="space-y-4">
                  {tocHeadings.map((heading, index) => (
                    <li key={heading.id}>
                      <a 
                        href={`#heading-${heading.id}`}
                        onClick={(e) => scrollToHeading(e, heading.id)}
                        className="text-stone-600 hover:text-emerald-600 transition-colors text-sm flex font-medium"
                      >
                        <span className="text-emerald-500 mr-3">{index + 1}.</span>
                        <span className="leading-tight">{heading.content}</span>
                      </a>
                    </li>
                  ))}
                </ul>
              ) : (
                <p className="text-stone-400 text-sm italic">
                  Artikel ini tidak memiliki sub-judul.
                </p>
              )}
              
              <div className="mt-10 pt-6 border-t border-stone-100">
                <p className="text-xs font-bold text-stone-400 uppercase tracking-wider mb-4">Bagikan Artikel</p>
                <div className="flex space-x-2">
                  <button onClick={() => navigator.clipboard.writeText(window.location.href)} className="flex-1 py-2 bg-stone-100 hover:bg-stone-200 text-stone-700 rounded-lg text-sm font-medium transition-colors">
                    Salin Tautan
                  </button>
                </div>
              </div>
            </div>
          </aside>
          
        </div>
      </div>
    </div>
  );
};

export default ArticleDetail;
