import React from 'react';
import Hero from '../components/Hero';
import ProductList from '../components/ProductList';
import { Link } from 'react-router-dom';
import { useLanguage } from '../context/LanguageContext';

const Home = ({ products, loading }) => {
  const { t } = useLanguage();
  const topProducts = products.slice(0, 4);

  return (
    <div>
      <Hero />
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-16">
        <div className="flex justify-between items-end mb-8">
          <div>
            <h2 className="text-3xl font-heading font-bold text-stone-900">Top Produk Kami</h2>
            <p className="text-stone-600 mt-2">Pilihan produk terbaik dari Desa Sukorejo</p>
          </div>
          <Link to="/katalog" className="hidden sm:inline-flex text-stone-900 font-bold hover:underline">
            Lihat Semua &rarr;
          </Link>
        </div>
        
        <ProductList products={topProducts} loading={loading} />
        
        <div className="mt-10 text-center sm:hidden">
          <Link to="/katalog" className="inline-block px-6 py-3 border border-stone-300 rounded-full text-stone-900 font-bold hover:bg-stone-50 transition-colors">
            Lihat Semua Produk
          </Link>
        </div>
      </div>
    </div>
  );
};

export default Home;
