import React from 'react';
import { Link } from 'react-router-dom';
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

  // Badge logic
  const renderBadge = () => {
    if (product.Status === 'Ready') {
      return <span className="absolute top-3 left-3 bg-stone-500 text-white text-[10px] font-bold px-2 py-1 rounded uppercase tracking-wider">{t('ready')}</span>;
    } else if (product.Status === 'Unggulan') {
      return <span className="absolute top-3 left-3 bg-stone-900 text-white text-[10px] font-bold px-2 py-1 rounded uppercase tracking-wider">{t('bestSeller')}</span>;
    } else if (product.Status === 'Habis') {
      return <span className="absolute top-3 left-3 bg-stone-400 text-white text-[10px] font-bold px-2 py-1 rounded uppercase tracking-wider">{t('outOfStock')}</span>;
    } else if (product.Status === 'Ekspor') {
      return <span className="absolute top-3 left-3 bg-blue-600 text-white text-[10px] font-bold px-2 py-1 rounded uppercase tracking-wider">{t('exportReady')}</span>;
    }
    return null;
  };

  return (
    <Link to={`/produk/${product.ID_Produk}`} className="block h-full outline-none">
      <div className="group w-full cursor-pointer flex flex-col h-full bg-[#f4f2ec] rounded-xl overflow-hidden hover:shadow-md transition-shadow">
        
        {/* Image Container */}
        <div className="relative w-full aspect-[4/3] bg-stone-100 overflow-hidden">
          {product.Foto_URL ? (
            <img 
              src={product.Foto_URL} 
              alt={title} 
              className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-700 ease-out"
            />
          ) : (
            <div className="w-full h-full flex items-center justify-center text-stone-400">
              No Image
            </div>
          )}
          {renderBadge()}
        </div>

        {/* Content Container */}
        <div className="p-5 flex flex-col flex-grow bg-white">
          <h3 className="text-sm font-bold text-stone-900 mb-1 line-clamp-2 uppercase tracking-wide group-hover:text-stone-600 transition-colors">
            {title}
          </h3>
          <p className="text-xs text-stone-500 line-clamp-1 mb-3">
            {product.Kategori} - {product.Berat_Gram >= 1000 ? `${product.Berat_Gram / 1000} kg` : `${product.Berat_Gram} g`}
          </p>
          
          <div className="mt-auto pt-2">
            <p className="text-sm font-bold text-stone-900">
              {formatPrice(product.Harga_Rp)}
            </p>
          </div>
        </div>
        
      </div>
    </Link>
  );
};

export default ProductCard;
