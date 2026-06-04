import React, { useState } from 'react';
import { Link } from 'react-router-dom';
import { Swiper, SwiperSlide } from 'swiper/react';
import { Autoplay } from 'swiper/modules';

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
    <div className="w-full bg-[#f4f2ec] pb-8 pt-4 overflow-hidden relative">
      {/* Slider Container */}
      <div className="w-full">
        <Swiper
          modules={[Autoplay]}
          onSwiper={setSwiperInstance}
          onSlideChange={(swiper) => setActiveIndex(swiper.realIndex)}
          spaceBetween={4}
          slidesPerView={1.1}
          centeredSlides={true}
          loop={true}
          autoplay={{
            delay: 5000,
            disableOnInteraction: false,
          }}
          breakpoints={{
            640: {
              slidesPerView: 1.15,
              spaceBetween: 8,
            },
            1024: {
              slidesPerView: 1.25,
              spaceBetween: 10,
            }
          }}
          className="w-full"
        >
          {heroImages.map((item, index) => (
            <SwiperSlide key={index} className="flex justify-center items-center py-4">
              {({ isActive }) => (
                <div 
                  className={`relative w-full h-[60vh] sm:h-[70vh] lg:h-[80vh] min-h-[500px] rounded-xl overflow-hidden shadow-md group transition-all duration-500 ease-out ${
                    isActive ? 'scale-100 opacity-100' : 'scale-[0.98] opacity-50'
                  }`}
                >
                  <img 
                    src={item.src} 
                    alt={item.title} 
                    className="absolute inset-0 w-full h-full object-cover group-hover:scale-105 transition-transform duration-1000"
                  />
                  
                  {/* Subtle gradient overlay for text readability */}
                  <div className="absolute inset-0 bg-gradient-to-t from-black/70 via-black/20 to-transparent pointer-events-none" />
                  
                  {/* Content (only fully visible on active slide) */}
                  <div className={`absolute bottom-12 left-0 right-0 flex flex-col items-center justify-center px-4 text-center transition-opacity duration-500 ${isActive ? 'opacity-100' : 'opacity-0'}`}>
                    <h1 className="text-3xl md:text-4xl lg:text-5xl font-heading font-black text-white uppercase tracking-widest mb-6 drop-shadow-lg">
                      {item.title}
                    </h1>
                    <Link 
                      to="/katalog" 
                      className="bg-white text-stone-900 text-sm font-bold uppercase tracking-widest px-10 py-4 rounded-full hover:bg-stone-200 transition-colors shadow-lg"
                    >
                      BELI SEKARANG
                    </Link>
                  </div>
                </div>
              )}
            </SwiperSlide>
          ))}
        </Swiper>
      </div>

      {/* Custom Slider Dots */}
      <div className="flex justify-center items-center gap-2 mt-4 relative z-10">
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
  );
};

export default Hero;
