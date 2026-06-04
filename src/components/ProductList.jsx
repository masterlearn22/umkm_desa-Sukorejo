import React, { useState, useEffect } from 'react';
import ProductCard from './ProductCard';
import { ChevronLeft, ChevronRight } from 'lucide-react';

const ProductList = ({ products, loading }) => {
  const [currentIndex, setCurrentIndex] = useState(0);
  const [itemsPerView, setItemsPerView] = useState(2);

  // Responsive logic: 1 per view on mobile, 2 per view on larger screens
  useEffect(() => {
    const handleResize = () => {
      if (window.innerWidth < 1024) { // lg breakpoint
        setItemsPerView(1);
      } else {
        setItemsPerView(2);
      }
    };
    handleResize(); // initial check
    window.addEventListener('resize', handleResize);
    return () => window.removeEventListener('resize', handleResize);
  }, []);

  // Reset to first page when products change (e.g. from filtering)
  useEffect(() => {
    setCurrentIndex(0);
  }, [products, itemsPerView]);

  if (loading) {
    return (
      <div className="flex gap-10 overflow-hidden">
        {[1, 2].map(i => (
          <div key={i} className="w-full lg:w-[calc(50%-1.25rem)] bg-white rounded-[2rem] overflow-hidden shadow-sm border border-stone-100 animate-pulse shrink-0">
            <div className="h-80 bg-stone-200"></div>
            <div className="p-8">
              <div className="h-8 bg-stone-200 rounded w-3/4 mb-4"></div>
              <div className="h-6 bg-stone-200 rounded w-full mb-8"></div>
              <div className="h-12 bg-stone-200 rounded-full w-1/3 mt-auto"></div>
            </div>
          </div>
        ))}
      </div>
    );
  }

  if (!products || products.length === 0) {
    return (
      <div className="text-center py-20 bg-white rounded-3xl border border-stone-100">
        <p className="text-stone-500 text-lg">Tidak ada produk yang ditemukan.</p>
      </div>
    );
  }

  const totalPages = Math.ceil(products.length / itemsPerView);

  const handleNext = () => {
    setCurrentIndex((prev) => (prev + 1) % totalPages);
  };

  const handlePrev = () => {
    setCurrentIndex((prev) => (prev - 1 + totalPages) % totalPages);
  };

  const goToPage = (pageIndex) => {
    setCurrentIndex(pageIndex);
  };

  return (
    <div className="relative w-full">
      <div className="overflow-hidden px-2 py-4">
        {/* Slider Track */}
        <div 
          className="flex transition-transform duration-500 ease-in-out gap-10"
          style={{ transform: `translateX(calc(-${currentIndex * 100}% - ${currentIndex * 2.5}rem))` }}
        >
          {Array.from({ length: totalPages }).map((_, pageIndex) => {
            const pageProducts = products.slice(pageIndex * itemsPerView, (pageIndex + 1) * itemsPerView);
            
            return (
              <div key={pageIndex} className="w-full shrink-0 flex gap-10">
                {pageProducts.map(product => (
                  <div key={product.ID_Produk} className={`w-full ${itemsPerView === 2 ? 'lg:w-[calc(50%-1.25rem)]' : ''} shrink-0`}>
                    <ProductCard product={product} />
                  </div>
                ))}
              </div>
            );
          })}
        </div>
      </div>

      {/* Navigation Arrows */}
      <button 
        onClick={handlePrev} 
        className="absolute left-0 top-1/2 -translate-y-1/2 -translate-x-4 lg:-translate-x-6 bg-white shadow-xl border border-stone-100 p-3 lg:p-4 rounded-full text-stone-900 hover:bg-stone-900 hover:text-white transition-colors z-10 hidden sm:block"
        aria-label="Previous products"
      >
        <ChevronLeft size={24} />
      </button>
      <button 
        onClick={handleNext} 
        className="absolute right-0 top-1/2 -translate-y-1/2 translate-x-4 lg:translate-x-6 bg-white shadow-xl border border-stone-100 p-3 lg:p-4 rounded-full text-stone-900 hover:bg-stone-900 hover:text-white transition-colors z-10 hidden sm:block"
        aria-label="Next products"
      >
        <ChevronRight size={24} />
      </button>

      {/* Indicators (Dots & Line) */}
      <div className="flex justify-center items-center gap-3 mt-8">
        {Array.from({ length: totalPages }).map((_, idx) => (
          <button
            key={idx}
            onClick={() => goToPage(idx)}
            className={`h-3 rounded-full transition-all duration-300 ${
              idx === currentIndex 
                ? 'w-10 bg-stone-900' // garis (line)
                : 'w-3 bg-stone-300 hover:bg-stone-400' // titik (dot)
            }`}
            aria-label={`Go to page ${idx + 1}`}
          />
        ))}
      </div>
    </div>
  );
};

export default ProductList;
