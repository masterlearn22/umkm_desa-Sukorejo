import React from 'react';
import FilterBar from '../components/FilterBar';
import ProductList from '../components/ProductList';
import { useLanguage } from '../context/LanguageContext';

const Catalog = ({ 
  products, 
  loading, 
  categories, 
  activeCategory, 
  setActiveCategory, 
  searchQuery, 
  setSearchQuery 
}) => {
  const { lang } = useLanguage();

  const filteredProducts = products.filter(product => {
    const matchesCategory = activeCategory === 'All' || product.Kategori === activeCategory;
    
    const searchTarget = lang === 'en' 
      ? (product.Nama_Eng || product.Nama_Indo).toLowerCase()
      : product.Nama_Indo.toLowerCase();
      
    const matchesSearch = searchTarget.includes(searchQuery.toLowerCase());
    
    return matchesCategory && matchesSearch;
  });

  return (
    <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-12">
      <div className="mb-8 text-center md:text-left">
        <h1 className="text-4xl font-heading font-bold text-stone-900">Eksplorasi Katalog</h1>
        <p className="text-stone-600 mt-3 max-w-2xl">
          Temukan berbagai produk unggulan hasil bumi dan kreasi UMKM Desa Sukorejo. 
          Gunakan filter di bawah untuk memudahkan pencarian Anda.
        </p>
      </div>

      <FilterBar 
        categories={categories}
        activeCategory={activeCategory}
        onCategoryChange={setActiveCategory}
        searchQuery={searchQuery}
        onSearchChange={setSearchQuery}
      />
      
      <ProductList products={filteredProducts} loading={loading} />
    </div>
  );
};

export default Catalog;
