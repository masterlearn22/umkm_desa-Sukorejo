import React from 'react';
import { X, Plus, Minus, Trash2, ArrowRight } from 'lucide-react';
import { useLanguage } from '../context/LanguageContext';
import { useCart } from '../context/CartContext';

const CartSidebar = ({ isOpen, onClose, onCheckout }) => {
  const { lang, t } = useLanguage();
  const { cartItems, updateQuantity, removeFromCart, cartTotal, cartWeight } = useCart();

  if (!isOpen) return null;

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

  const getProductName = (item) => {
    return lang === 'en' && item.Nama_Eng ? item.Nama_Eng : item.Nama_Indo;
  };

  return (
    <>
      <div 
        className="fixed inset-0 bg-stone-900/50 backdrop-blur-sm z-50 transition-opacity"
        onClick={onClose}
      />
      
      <div className="fixed inset-y-0 right-0 w-full md:w-96 bg-white shadow-2xl z-50 flex flex-col transition-transform transform">
        
        {/* Header */}
        <div className="flex items-center justify-between p-6 border-b border-stone-100 bg-white">
          <h2 className="text-xl font-heading font-bold text-stone-900">
            {t('cartTitle')}
          </h2>
          <button 
            onClick={onClose}
            className="p-2 hover:bg-stone-100 rounded-full transition-colors text-stone-500 hover:text-stone-900"
          >
            <X size={20} />
          </button>
        </div>

        {/* Cart Items */}
        <div className="flex-1 overflow-y-auto p-6 bg-stone-50">
          {cartItems.length === 0 ? (
            <div className="flex flex-col items-center justify-center h-full text-stone-400 space-y-4">
              <ShoppingCartIcon size={48} className="opacity-20" />
              <p>{t('emptyCart')}</p>
            </div>
          ) : (
            <div className="space-y-6">
              {cartItems.map(item => (
                <div key={item.ID_Produk} className="flex gap-4 bg-white p-3 rounded-2xl border border-stone-100 shadow-sm">
                  <div className="w-20 h-20 rounded-xl overflow-hidden bg-stone-100 flex-shrink-0">
                    {item.Foto_URL ? (
                      <img src={item.Foto_URL} alt="Product" className="w-full h-full object-cover" />
                    ) : (
                      <div className="w-full h-full flex items-center justify-center text-xs text-stone-400">Img</div>
                    )}
                  </div>
                  
                  <div className="flex-1 flex flex-col justify-between">
                    <div>
                      <h4 className="font-bold text-stone-800 text-sm line-clamp-2">
                        {getProductName(item)}
                      </h4>
                      <p className="text-stone-900 font-bold text-sm mt-1">
                        {formatPrice(item.Harga_Rp)}
                      </p>
                    </div>
                    
                    <div className="flex items-center justify-between mt-2">
                      <div className="flex items-center border border-stone-200 rounded-full overflow-hidden bg-stone-50">
                        <button 
                          onClick={() => updateQuantity(item.ID_Produk, item.quantity - 1)}
                          className="px-2 py-1 hover:bg-stone-200 text-stone-600 transition-colors"
                        >
                          <Minus size={14} />
                        </button>
                        <span className="px-3 text-sm font-bold text-stone-700 min-w-[2rem] text-center">
                          {item.quantity}
                        </span>
                        <button 
                          onClick={() => updateQuantity(item.ID_Produk, item.quantity + 1)}
                          className="px-2 py-1 hover:bg-stone-200 text-stone-600 transition-colors"
                        >
                          <Plus size={14} />
                        </button>
                      </div>
                      
                      <button 
                        onClick={() => removeFromCart(item.ID_Produk)}
                        className="p-1.5 text-stone-400 hover:text-red-600 hover:bg-red-50 rounded-full transition-colors"
                      >
                        <Trash2 size={16} />
                      </button>
                    </div>
                  </div>
                </div>
              ))}
            </div>
          )}
        </div>

        {/* Footer */}
        {cartItems.length > 0 && (
          <div className="p-6 border-t border-stone-100 bg-white">
            <div className="space-y-3 mb-6">
              <div className="flex justify-between text-sm text-stone-500">
                <span>{t('totalEstimates')} {t('weight')}</span>
                <span className="font-medium text-stone-700">{formatWeight(cartWeight)}</span>
              </div>
              <div className="flex justify-between items-end">
                <span className="text-stone-600 font-medium">{t('totalEstimates')}</span>
                <span className="text-2xl font-bold text-stone-900">{formatPrice(cartTotal)}</span>
              </div>
            </div>
            
            <button 
              onClick={() => {
                onClose();
                onCheckout();
              }}
              className="w-full py-4 px-6 bg-stone-900 text-white rounded-full font-bold text-lg hover:bg-stone-800 hover:shadow-lg transition-all flex items-center justify-center space-x-2 group"
            >
              <span>{t('checkout')}</span>
              <ArrowRight size={20} className="group-hover:translate-x-1 transition-transform" />
            </button>
          </div>
        )}
        
      </div>
    </>
  );
};

// Dummy icon if ShoppingCart from lucide is not imported properly above
const ShoppingCartIcon = ({ size, className }) => (
  <svg width={size} height={size} viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" className={className}>
    <circle cx="9" cy="21" r="1"></circle>
    <circle cx="20" cy="21" r="1"></circle>
    <path d="M1 1h4l2.68 13.39a2 2 0 0 0 2 1.61h9.72a2 2 0 0 0 2-1.61L23 6H6"></path>
  </svg>
)

export default CartSidebar;
