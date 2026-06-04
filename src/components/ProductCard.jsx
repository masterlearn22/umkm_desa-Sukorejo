import React from 'react';
import { ShoppingCart } from 'lucide-react';
import { useLanguage } from '../context/LanguageContext';
import { useCart } from '../context/CartContext';

const ProductCard = ({ product }) => {
  const { lang, t } = useLanguage();
  const { addToCart } = useCart();

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
    <div className="bg-white rounded-3xl overflow-hidden shadow-sm hover:shadow-xl transition-all duration-300 border border-stone-100 flex flex-col group">
      
      <div className="relative h-64 overflow-hidden bg-stone-100">
        {product.Foto_URL ? (
          <img 
            src={product.Foto_URL} 
            alt={title} 
            className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-500"
          />
        ) : (
          <div className="w-full h-full flex items-center justify-center text-stone-400">
            No Image
          </div>
        )}
        {renderBadge()}
      </div>

      <div className="p-6 flex flex-col flex-grow">
        <div className="flex justify-between items-start mb-2 gap-2">
          <h3 className="text-xl font-heading font-bold text-stone-900 leading-tight">
            {title}
          </h3>
          <span className="text-sm font-medium text-stone-500 whitespace-nowrap bg-stone-100 px-2 py-1 rounded-md">
            {formatWeight(product.Berat_Gram)}
          </span>
        </div>
        
        <p className="text-stone-600 text-sm mb-6 line-clamp-2 flex-grow">
          {description}
        </p>

        <div className="flex items-center justify-between mt-auto">
          <span className="text-xl font-bold text-stone-900">
            {formatPrice(product.Harga_Rp)}
          </span>
          <button 
            onClick={() => addToCart(product)}
            disabled={product.Status === 'Habis'}
            className="p-3 bg-stone-900 text-white rounded-full hover:bg-stone-700 transition-colors disabled:bg-stone-200 disabled:text-stone-400 disabled:cursor-not-allowed group/btn"
            aria-label={t('addToCart')}
          >
            <ShoppingCart size={20} className="group-hover/btn:scale-110 transition-transform" />
          </button>
        </div>
      </div>
    </div>
  );
};

export default ProductCard;
