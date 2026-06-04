import React from 'react';
import { Link } from 'react-router-dom';
import { useLanguage } from '../context/LanguageContext';

const Hero = () => {
  const { t } = useLanguage();

  return (
    <div className="bg-stone-50 relative overflow-hidden border-b border-stone-200">
      <div className="absolute inset-0 opacity-40">
        <div className="absolute inset-0 bg-gradient-to-r from-stone-50 to-transparent z-10" />
        {/* Placeholder background pattern since we don't have images yet */}
        <div className="w-full h-full bg-[radial-gradient(ellipse_at_center,_var(--tw-gradient-stops))] from-stone-200 to-transparent"></div>
      </div>
      
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 relative z-20 py-16 sm:py-24 lg:py-32">
        <div className="text-center md:text-left md:w-2/3">
          <h1 className="text-4xl sm:text-5xl md:text-6xl font-heading font-extrabold text-stone-900 leading-tight mb-6">
            {t('heroTitle')}
          </h1>
          <p className="mt-4 max-w-2xl text-lg sm:text-xl text-stone-600 font-sans leading-relaxed">
            {t('heroDesc')}
          </p>
          <div className="mt-10">
            <Link to="/katalog" className="inline-flex items-center justify-center px-8 py-4 text-base font-bold rounded-full text-white bg-stone-900 hover:bg-stone-800 hover:scale-105 transition-all shadow-lg">
              Eksplorasi Katalog
            </Link>
          </div>
        </div>
      </div>
    </div>
  );
};

export default Hero;
