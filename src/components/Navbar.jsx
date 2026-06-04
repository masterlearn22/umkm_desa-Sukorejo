import React from 'react';
import { ShoppingCart, Globe, Menu } from 'lucide-react';
import { useLanguage } from '../context/LanguageContext';
import { useCart } from '../context/CartContext';

const Navbar = ({ onCartClick }) => {
  const { lang, toggleLanguage } = useLanguage();
  const { cartItems } = useCart();
  
  const totalItems = cartItems.reduce((sum, item) => sum + item.quantity, 0);

  return (
    <nav className="sticky top-0 z-50 bg-dragon-crimson text-white shadow-md">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex justify-between items-center h-16">
          
          <div className="flex items-center">
            <span className="font-heading text-xl font-bold tracking-wider">
              BUMDes Sukorejo
            </span>
          </div>

          <div className="flex items-center space-x-4">
            <button 
              onClick={toggleLanguage}
              className="flex items-center space-x-1 hover:text-eco-cream transition-colors bg-white/10 px-3 py-1 rounded-full text-sm font-medium"
            >
              <Globe size={18} />
              <span className="uppercase">{lang}</span>
            </button>

            <button 
              onClick={onCartClick}
              className="relative p-2 hover:bg-white/10 rounded-full transition-colors"
            >
              <ShoppingCart size={24} />
              {totalItems > 0 && (
                <span className="absolute top-0 right-0 inline-flex items-center justify-center px-2 py-1 text-xs font-bold leading-none text-dragon-crimson bg-eco-cream rounded-full transform translate-x-1/4 -translate-y-1/4">
                  {totalItems}
                </span>
              )}
            </button>
          </div>
        </div>
      </div>
    </nav>
  );
};

export default Navbar;
