import React, { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';

const heroImages = [
  '/assets/images/dragon_fruit_1780579681534.png',
  '/assets/images/dragon_fruit_seedling_1780579696787.png',
  '/assets/images/dragon_fruit_juice_1780579713413.png',
  '/assets/images/dragon_fruit_jam_1780579726270.png',
  '/assets/images/dragon_fruit_chips_1780579741290.png'
];

const Hero = () => {
  const [currentIndex, setCurrentIndex] = useState(0);

  // Auto-slide every 5 seconds
  useEffect(() => {
    const timer = setInterval(() => {
      setCurrentIndex((prev) => (prev === heroImages.length - 1 ? 0 : prev + 1));
    }, 5000);
    return () => clearInterval(timer);
  }, []);

  return (
    <div className="w-full bg-[#f4f2ec] pb-8 pt-4">
      <div className="max-w-screen-2xl mx-auto px-4 sm:px-6 lg:px-8">
        
        {/* Banner Container */}
        <div className="relative w-full h-[60vh] sm:h-[70vh] lg:h-[80vh] min-h-[500px] rounded-[2rem] overflow-hidden group shadow-md bg-stone-200">
          
          {/* Background Images */}
          {heroImages.map((src, index) => (
            <img 
              key={index}
              src={src} 
              alt={`Produk Unggulan ${index + 1}`} 
              className={`absolute inset-0 w-full h-full object-cover transition-opacity duration-1000 ${
                index === currentIndex ? 'opacity-100' : 'opacity-0'
              }`}
            />
          ))}
          
          {/* Subtle gradient overlay for text readability */}
          <div className="absolute inset-0 bg-gradient-to-t from-black/60 via-black/10 to-transparent" />
          
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

        {/* Slider Dots */}
        <div className="flex justify-center items-center gap-2 mt-6">
          {heroImages.map((_, index) => (
            <button
              key={index}
              onClick={() => setCurrentIndex(index)}
              className={`h-2 rounded-full transition-all duration-300 ${
                index === currentIndex ? 'w-8 bg-stone-900' : 'w-2 bg-stone-300 hover:bg-stone-400'
              }`}
              aria-label={`Slide ${index + 1}`}
            />
          ))}
        </div>

      </div>
    </div>
  );
};

export default Hero;
