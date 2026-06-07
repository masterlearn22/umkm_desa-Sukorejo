import React, { useState } from 'react';
import { Link } from 'react-router-dom';
import { Swiper, SwiperSlide } from 'swiper/react';
import { Autoplay } from 'swiper/modules';
import { resolveImageUrl } from '../utils/image';

import 'swiper/css';

const heroImages = [
  { src: '/assets/images/dragon_fruit_1780579681534.png', title: 'Buah Naga Merah Segar' },
  { src: '/assets/images/dragon_fruit_seedling_1780579696787.png', title: 'Bibit Buah Naga Unggulan' },
  { src: '/assets/images/dragon_fruit_juice_1780579713413.png', title: 'Jus Buah Naga Segar' },
  { src: '/assets/images/dragon_fruit_jam_1780579726270.png', title: 'Selai Buah Naga Premium' },
  { src: '/assets/images/dragon_fruit_chips_1780579741290.png', title: 'Keripik Buah Naga Renyah' }
];

const Hero = () => {
  const [activeIndex, setActiveIndex] = useState(0);
  const [swiperInstance, setSwiperInstance] = useState(null);

  return (
    <div className="w-full bg-[#f4f2ec] py-12 lg:py-16 overflow-hidden relative flex flex-col lg:flex-row items-center">
      
      {/* Left Text Content */}
      <div className="w-full lg:w-5/12 px-4 sm:px-8 lg:pl-16 xl:pl-32 z-10 mb-8 lg:mb-0 flex flex-col justify-center">
        <h1 className="text-4xl md:text-5xl lg:text-6xl xl:text-7xl font-heading font-black text-stone-900 leading-[1.1] mb-6 uppercase tracking-tight">
          Mahakarya <br/>
          <span className="text-transparent bg-clip-text bg-gradient-to-r from-red-600 to-rose-400">
            Alam Sukorejo
          </span>
        </h1>
        <p className="text-base md:text-lg text-stone-600 mb-8 max-w-md leading-relaxed">
          "Menghadirkan hasil bumi terbaik dan olahan organik premium langsung dari kebun petani lokal desa kami ke meja makan Anda."
        </p>
        <div className="flex gap-4 items-center">
          <Link 
            to="/katalog" 
            className="bg-stone-900 text-white font-bold uppercase tracking-widest text-sm px-8 py-4 rounded-full hover:bg-stone-800 transition-colors shadow-lg flex items-center gap-3 group"
          >
            Jelajahi Produk
            <span className="group-hover:translate-x-1 transition-transform">→</span>
          </Link>
        </div>
      </div>

      {/* Right Slider Container */}
      <div className="w-full lg:w-7/12 flex items-center pl-4 sm:pl-8 lg:pl-0 lg:mt-0 mt-8">
        <div className="w-full">
          <Swiper
            modules={[Autoplay]}
            onSwiper={setSwiperInstance}
            onSlideChange={(swiper) => setActiveIndex(swiper.realIndex)}
            spaceBetween={24}
            slidesPerView={'auto'}
            centeredSlides={false}
            loop={true}
            autoplay={{
              delay: 4000,
              disableOnInteraction: false,
            }}
            breakpoints={{
              640: {
                spaceBetween: 32,
              },
            }}
            className="w-full"
          >
            {heroImages.map((item, index) => (
              <SwiperSlide key={index} className="flex justify-center items-center py-8" style={{ width: 'auto' }}>
                {({ isActive }) => (
                  <div 
                    className={`relative aspect-[3/4] h-[350px] sm:h-[400px] lg:h-[450px] xl:h-[550px] rounded-2xl overflow-hidden shadow-2xl group transition-all duration-700 ease-out ${
                      isActive ? 'scale-100 opacity-100' : 'scale-90 opacity-50'
                    }`}
                  >
                    <div className="absolute inset-0 bg-gradient-to-t from-stone-900/60 to-transparent z-10 rounded-2xl"></div>
                    <img 
                      src={resolveImageUrl(item.src)} 
                      alt={item.title} 
                      className="absolute inset-0 w-full h-full object-cover group-hover:scale-105 transition-transform duration-1000"
                    />
                    
                    {/* Subtle gradient overlay for text readability */}
                    <div className="absolute inset-0 bg-gradient-to-t from-black/80 via-black/20 to-transparent pointer-events-none" />
                    
                    {/* Content (only fully visible on active slide) */}
                    <div className={`absolute bottom-8 left-0 right-0 flex flex-col items-center justify-center px-6 text-center transition-opacity duration-500 ${isActive ? 'opacity-100' : 'opacity-0'}`}>
                      <h2 className="text-2xl md:text-3xl font-heading font-black text-white uppercase tracking-widest mb-4 drop-shadow-lg leading-tight">
                        {item.title}
                      </h2>
                    </div>
                  </div>
                )}
              </SwiperSlide>
            ))}
          </Swiper>
          
          {/* Custom Slider Dots */}
          <div className="flex justify-start items-center gap-2 mt-8 lg:ml-0 relative z-10">
            {heroImages.map((_, index) => (
              <button
                key={index}
                onClick={() => swiperInstance && swiperInstance.slideToLoop(index)}
                className={`h-2 rounded-full transition-all duration-300 ${
                  index === activeIndex ? 'w-8 bg-stone-900' : 'w-2 bg-stone-300 hover:bg-stone-400'
                }`}
                aria-label={`Go to slide ${index + 1}`}
              />
            ))}
          </div>
        </div>
      </div>
    </div>
  );
};

export default Hero;
