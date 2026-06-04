import React from 'react';
import { Link } from 'react-router-dom';

const Hero = () => {
  return (
    <div className="w-full bg-[#f4f2ec] pb-8 pt-4">
      <div className="max-w-screen-2xl mx-auto px-4 sm:px-6 lg:px-8">
        
        {/* Banner Container */}
        <div className="relative w-full h-[60vh] sm:h-[70vh] lg:h-[80vh] min-h-[500px] rounded-[2rem] overflow-hidden group shadow-md">
          
          {/* Background Image (using dragon fruit farm placeholder) */}
          <img 
            src="https://images.unsplash.com/photo-1596434452589-73891465e902?q=80&w=2070&auto=format&fit=crop" 
            alt="Buah Naga Sukorejo" 
            className="absolute inset-0 w-full h-full object-cover group-hover:scale-105 transition-transform duration-1000"
          />
          
          {/* Subtle gradient overlay for text readability */}
          <div className="absolute inset-0 bg-gradient-to-t from-black/60 via-transparent to-transparent" />
          
          {/* Content */}
          <div className="absolute bottom-12 left-0 right-0 flex flex-col items-center justify-center px-4 text-center">
            <h1 className="text-4xl md:text-5xl lg:text-6xl font-heading font-black text-white uppercase tracking-widest mb-6 drop-shadow-lg">
              PRODUK FAVORIT
            </h1>
            <Link 
              to="/katalog" 
              className="bg-white text-stone-900 text-sm font-bold uppercase tracking-widest px-10 py-4 rounded-full hover:bg-stone-200 transition-colors shadow-lg"
            >
              BELI SEKARANG
            </Link>
          </div>
        </div>

        {/* Dummy Slider Dots (to match the reference UI) */}
        <div className="flex justify-center items-center gap-2 mt-6">
          <div className="w-2 h-2 rounded-full bg-stone-300"></div>
          <div className="w-8 h-2 rounded-full bg-stone-900"></div>
          <div className="w-2 h-2 rounded-full bg-stone-300"></div>
        </div>

      </div>
    </div>
  );
};

export default Hero;
