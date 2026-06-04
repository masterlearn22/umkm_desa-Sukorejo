import React from 'react';
import Hero from '../components/Hero';
import ProductList from '../components/ProductList';
import ValuesGrid from '../components/ValuesGrid';
import Testimonials from '../components/Testimonials';
import { Link } from 'react-router-dom';

const Home = ({ products, loading }) => {
  // We can show top 8 products in the carousel to make the infinite loop more obvious
  const topProducts = products.slice(0, 8);

  return (
    <div className="bg-[#f4f2ec]">
      <Hero />
      
      {/* Product List Section */}
      <div className="max-w-screen-2xl mx-auto px-4 sm:px-6 lg:px-8 py-16">
        <div className="flex flex-col md:flex-row justify-between items-baseline mb-10 border-b border-stone-200 pb-4">
          <div className="flex flex-wrap items-baseline gap-6">
            <h2 className="text-2xl md:text-3xl font-heading font-black text-stone-900 uppercase tracking-widest">
              FAVORIT
            </h2>
            <div className="flex gap-4">
              <button className="text-stone-400 hover:text-stone-900 text-sm font-bold uppercase tracking-widest transition-colors">
                BUAH NAGA
              </button>
              <button className="text-stone-400 hover:text-stone-900 text-sm font-bold uppercase tracking-widest transition-colors">
                OLAHAN
              </button>
              <button className="text-stone-400 hover:text-stone-900 text-sm font-bold uppercase tracking-widest transition-colors">
                BIBIT
              </button>
            </div>
          </div>
          <Link to="/katalog" className="mt-4 md:mt-0 text-stone-900 text-sm font-bold uppercase tracking-widest hover:opacity-70 transition-opacity">
            Lihat Semua &gt;&gt;
          </Link>
        </div>
        
        <ProductList products={topProducts} loading={loading} />
      </div>

      {/* Trust Banner */}
      <div className="w-full bg-white border-y border-stone-200 py-8 mb-16">
        <div className="max-w-screen-2xl mx-auto flex flex-wrap justify-center items-center gap-8 md:gap-16 text-center px-4">
          <div className="flex items-center gap-3">
            <span className="text-3xl">🍃</span>
            <span className="font-heading font-black text-xl md:text-2xl lg:text-3xl uppercase tracking-widest text-stone-900">Tanpa Pestisida</span>
          </div>
          <div className="flex items-center gap-3">
            <span className="text-3xl">📦</span>
            <span className="font-heading font-black text-xl md:text-2xl lg:text-3xl uppercase tracking-widest text-stone-900">100% Organik</span>
          </div>
          <div className="flex items-center gap-3">
            <span className="text-3xl">♻️</span>
            <span className="font-heading font-black text-xl md:text-2xl lg:text-3xl uppercase tracking-widest text-stone-900">Ramah Lingkungan</span>
          </div>
        </div>
      </div>

      {/* Values Section */}
      <ValuesGrid />

      {/* Testimonials Section */}
      <Testimonials />

    </div>
  );
};

export default Home;
