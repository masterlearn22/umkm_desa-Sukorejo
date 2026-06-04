import React from 'react';
import { useLanguage } from '../context/LanguageContext';

const ProductCard = ({ product }) => {
  const { lang, t } = useLanguage();

  const title = lang === 'en' && product.Nama_Eng ? product.Nama_Eng : product.Nama_Indo;
  const description = lang === 'en' && product.Deskripsi_Eng ? product.Deskripsi_Eng : product.Deskripsi_Indo;

  const formatPrice = (price) => {
    return new Intl.NumberFormat('id-ID', {
      style: 'currency',
      currency: 'IDR',
      minimumFractionDigits: 0
    }).format(price);
  };

  const formatWeight = (gram) => {
    if (gram >= 1000) {
      return `${gram / 1000} kg`;
    }
    return `${gram} g`;
  };

  // Badge logic
  const renderBadge = () => {
    if (product.Status === 'Ready') {
      return <span className="absolute top-4 right-4 bg-stone-800 text-white text-xs font-bold px-3 py-1 rounded-full shadow-md">{t('ready')}</span>;
    } else if (product.Status === 'Unggulan') {
      return <span className="absolute top-4 right-4 bg-stone-900 text-white text-xs font-bold px-3 py-1 rounded-full shadow-md">{t('bestSeller')}</span>;
    } else if (product.Status === 'Habis') {
      return <span className="absolute top-4 right-4 bg-stone-500 text-white text-xs font-bold px-3 py-1 rounded-full shadow-md">{t('outOfStock')}</span>;
    } else if (product.Status === 'Ekspor') {
      return <span className="absolute top-4 right-4 bg-blue-600 text-white text-xs font-bold px-3 py-1 rounded-full shadow-md">{t('exportReady')}</span>;
    }
    return null;
  };

  return (
    <div className="group h-[28rem] w-full perspective-1000 cursor-pointer">
      <div className="relative w-full h-full transition-transform duration-700 transform-style-3d group-hover:rotate-y-180">
        
        {/* Front Face: Image and Title only */}
        <div className="absolute inset-0 w-full h-full backface-hidden bg-white rounded-[2rem] shadow-sm border border-stone-100 flex flex-col overflow-hidden">
          <div className="relative h-3/4 w-full bg-stone-100">
            {product.Foto_URL ? (
              <img 
                src={product.Foto_URL} 
                alt={title} 
                className="w-full h-full object-cover"
              />
            ) : (
              <div className="w-full h-full flex items-center justify-center text-stone-400">
                No Image
              </div>
            )}
            {renderBadge()}
          </div>
          <div className="h-1/4 p-6 flex items-center justify-center text-center bg-white">
            <h3 className="text-xl lg:text-2xl font-heading font-bold text-stone-900 leading-tight">
              {title}
            </h3>
          </div>
        </div>

        {/* Back Face: Product Information */}
        <div className="absolute inset-0 w-full h-full backface-hidden rotate-y-180 bg-stone-900 text-stone-50 rounded-[2rem] p-8 flex flex-col overflow-y-auto custom-scrollbar shadow-xl border border-stone-800">
          <div className="mb-6 border-b border-stone-700 pb-4">
            <h3 className="text-2xl font-heading font-bold text-white leading-tight mb-4">
              {title}
            </h3>
            <div className="flex flex-wrap gap-2 mb-4">
               <span className="text-xs font-medium text-stone-900 bg-stone-100 px-3 py-1 rounded-full">
                 {formatWeight(product.Berat_Gram)}
               </span>
               <span className="text-xs font-medium text-stone-100 bg-stone-700 px-3 py-1 rounded-full">
                 {product.Kategori}
               </span>
            </div>
            <p className="text-2xl font-bold text-white">
              {formatPrice(product.Harga_Rp)}
            </p>
          </div>
          
          <p className="text-stone-300 text-base leading-relaxed flex-grow">
            {description}
          </p>
        </div>

      </div>
    </div>
  );
};

export default ProductCard;
