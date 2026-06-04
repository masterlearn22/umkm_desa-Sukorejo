import React, { useState } from 'react';
import ProductCard from '../components/ProductCard';
import { useLanguage } from '../context/LanguageContext';
import { Search, ChevronDown } from 'lucide-react';

const Catalog = ({ 
  products, 
  loading,
  searchQuery, 
  setSearchQuery 
}) => {
  const { lang, t } = useLanguage();
  
  // State for sidebar filters
  const [activeCategory, setActiveCategory] = useState('All');
  const [activeStatus, setActiveStatus] = useState('All');

  // Categories & Statuses
  const categories = [
    { id: 'All', label: 'Semua Kategori' },
    { id: 'Fresh', label: 'Segar' },
    { id: 'Processed', label: 'Olahan' },
    { id: 'Craft', label: 'Kerajinan & Bibit' },
  ];

  const statuses = [
    { id: 'All', label: 'Semua Status' },
    { id: 'Ready', label: 'Ready' },
    { id: 'Unggulan', label: 'Unggulan' },
    { id: 'Ekspor', label: 'Ekspor' },
  ];

  // Filtering Logic
  const filteredProducts = products.filter(product => {
    const matchesCategory = activeCategory === 'All' || product.Kategori === activeCategory;
    const matchesStatus = activeStatus === 'All' || product.Status === activeStatus;
    
    const searchTarget = lang === 'en' 
      ? (product.Nama_Eng || product.Nama_Indo).toLowerCase()
      : product.Nama_Indo.toLowerCase();
      
    const matchesSearch = searchTarget.includes(searchQuery.toLowerCase());
    
    return matchesCategory && matchesStatus && matchesSearch;
  });

  return (
    <div className="max-w-screen-2xl mx-auto px-4 sm:px-6 lg:px-8 py-12">
      
      {/* Header Info (Breadcrumb/Title space if needed) */}
      <div className="flex justify-between items-end mb-8 border-b border-stone-200 pb-4">
        <div>
          <h1 className="text-3xl font-heading font-black text-stone-900 uppercase tracking-widest">
            Katalog Produk
          </h1>
        </div>
      </div>

      <div className="flex flex-col md:flex-row gap-10">
        
        {/* Sidebar Filters */}
        <aside className="w-full md:w-64 shrink-0">
          
          {/* Search Box */}
          <div className="relative w-full mb-8">
            <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
              <Search size={16} className="text-stone-400" />
            </div>
            <input
              type="text"
              placeholder={t('searchPlaceholder')}
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              className="block w-full pl-10 pr-3 py-2 border-b border-stone-300 bg-transparent placeholder-stone-400 focus:outline-none focus:border-stone-900 text-sm transition-colors uppercase tracking-wide"
            />
          </div>

          {/* Accordion: Kategori */}
          <div className="mb-6">
            <h3 className="text-sm font-bold text-stone-900 uppercase tracking-widest flex justify-between items-center mb-4 cursor-pointer">
              KATEGORI
              <ChevronDown size={16} className="text-stone-400" />
            </h3>
            <ul className="space-y-3">
              {categories.map((cat) => (
                <li key={cat.id}>
                  <button
                    onClick={() => setActiveCategory(cat.id)}
                    className={`text-sm tracking-wider uppercase transition-colors ${
                      activeCategory === cat.id 
                        ? 'font-bold text-stone-900' 
                        : 'text-stone-500 hover:text-stone-800'
                    }`}
                  >
                    {cat.label}
                  </button>
                </li>
              ))}
            </ul>
          </div>

          {/* Accordion: Status */}
          <div className="mb-6 border-t border-stone-200 pt-6">
            <h3 className="text-sm font-bold text-stone-900 uppercase tracking-widest flex justify-between items-center mb-4 cursor-pointer">
              STATUS
              <ChevronDown size={16} className="text-stone-400" />
            </h3>
            <ul className="space-y-3">
              {statuses.map((stat) => (
                <li key={stat.id}>
                  <button
                    onClick={() => setActiveStatus(stat.id)}
                    className={`text-sm tracking-wider uppercase transition-colors ${
                      activeStatus === stat.id 
                        ? 'font-bold text-stone-900' 
                        : 'text-stone-500 hover:text-stone-800'
                    }`}
                  >
                    {stat.label}
                  </button>
                </li>
              ))}
            </ul>
          </div>

        </aside>

        {/* Main Product Grid */}
        <div className="flex-1">
          {/* Top Bar for Grid (Count & Sort) */}
          <div className="flex justify-between items-center mb-6">
            <span className="text-xs font-bold text-stone-400 uppercase tracking-widest">
              PRODUK {filteredProducts.length}
            </span>
          </div>

          {/* Grid Layout */}
          {loading ? (
            <div className="grid grid-cols-2 md:grid-cols-2 lg:grid-cols-3 gap-x-4 gap-y-8 lg:gap-x-8 lg:gap-y-12">
              {[1, 2, 3, 4, 5, 6].map(i => (
                <div key={i} className="w-full bg-white rounded-xl overflow-hidden shadow-sm animate-pulse">
                  <div className="aspect-[4/3] bg-stone-200"></div>
                  <div className="p-4">
                    <div className="h-4 bg-stone-200 rounded w-3/4 mb-2"></div>
                    <div className="h-3 bg-stone-200 rounded w-1/2 mb-4"></div>
                    <div className="h-4 bg-stone-200 rounded w-1/3"></div>
                  </div>
                </div>
              ))}
            </div>
          ) : filteredProducts.length > 0 ? (
            <div className="grid grid-cols-2 md:grid-cols-2 lg:grid-cols-3 gap-x-4 gap-y-8 lg:gap-x-8 lg:gap-y-12">
              {filteredProducts.map(product => (
                <ProductCard key={product.ID_Produk} product={product} />
              ))}
            </div>
          ) : (
            <div className="text-center py-20 bg-white rounded-xl border border-stone-100">
              <p className="text-stone-500 text-sm uppercase tracking-widest">Tidak ada produk yang ditemukan.</p>
            </div>
          )}
        </div>

      </div>
    </div>
  );
};

export default Catalog;
