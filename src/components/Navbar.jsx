import React from 'react';
import { ShoppingCart, Globe, Menu } from 'lucide-react';
import { Link, useLocation } from 'react-router-dom';
import { useLanguage } from '../context/LanguageContext';
import { useCart } from '../context/CartContext';

const Navbar = ({ onCartClick }) => {
  const { lang, toggleLanguage } = useLanguage();
  const { cartItems } = useCart();
  const location = useLocation();
  
  const totalItems = cartItems.reduce((sum, item) => sum + item.quantity, 0);

  return (
    <nav className="sticky top-0 z-50 bg-white/90 backdrop-blur-md text-stone-900 border-b border-stone-200 shadow-sm">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex justify-between items-center h-16">
          
          <div className="flex items-center space-x-6">
            <Link to="/" className="font-heading text-xl font-bold tracking-wider hover:text-stone-600 transition-colors">
              BUMDes Sukorejo
            </Link>
            <div className="hidden md:flex items-center space-x-4">
              <Link to="/" className={`text-sm font-medium transition-colors ${location.pathname === '/' ? 'text-stone-900 font-bold border-b-2 border-stone-900 pb-1' : 'text-stone-500 hover:text-stone-900'}`}>
                {lang === 'en' ? 'Home' : 'Beranda'}
              </Link>
              <Link to="/katalog" className={`text-sm font-medium transition-colors ${location.pathname === '/katalog' ? 'text-stone-900 font-bold border-b-2 border-stone-900 pb-1' : 'text-stone-500 hover:text-stone-900'}`}>
                {lang === 'en' ? 'Catalog' : 'Katalog'}
              </Link>
            </div>
          </div>

          <div className="flex items-center space-x-4">
            <button 
              onClick={toggleLanguage}
              className="flex items-center space-x-1 hover:text-stone-600 transition-colors bg-stone-100 px-3 py-1 rounded-full text-sm font-medium"
            >
              <Globe size={18} />
              <span className="uppercase">{lang}</span>
            </button>

            <button 
              onClick={onCartClick}
              className="relative p-2 hover:bg-stone-100 rounded-full transition-colors"
            >
              <ShoppingCart size={24} />
              {totalItems > 0 && (
                <span className="absolute top-0 right-0 inline-flex items-center justify-center px-2 py-1 text-xs font-bold leading-none text-white bg-stone-900 rounded-full transform translate-x-1/4 -translate-y-1/4">
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
