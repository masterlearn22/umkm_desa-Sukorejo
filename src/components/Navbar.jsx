import React from 'react';
import { ShoppingCart, Globe, Search, User } from 'lucide-react';
import { Link, useLocation } from 'react-router-dom';
import { useLanguage } from '../context/LanguageContext';
import { useCart } from '../context/CartContext';
import { useAuth } from '../context/AuthContext';

const Navbar = ({ onCartClick }) => {
  const { lang, toggleLanguage } = useLanguage();
  const { cartItems } = useCart();
  const { user } = useAuth();
  const location = useLocation();
  
  const totalItems = cartItems.reduce((sum, item) => sum + item.quantity, 0);

  return (
    <div className="flex flex-col w-full">
      {/* Announcement Bar */}
      <div className="bg-[#eae7df] text-stone-800 text-[10px] sm:text-xs font-bold uppercase tracking-widest py-2 px-4 overflow-hidden border-b border-stone-200">
        <div className="flex whitespace-nowrap animate-marquee">
          {/* Repeating announcement text */}
          <span className="mx-4">PROMO DISKON 50% UNTUK PEMBELIAN PERTAMA</span>
          <span className="mx-4">BELI 3 BUAH NAGA GRATIS 1 BIBIT</span>
          <span className="mx-4">PROMO DISKON 50% UNTUK PEMBELIAN PERTAMA</span>
          <span className="mx-4">BELI 3 BUAH NAGA GRATIS 1 BIBIT</span>
          <span className="mx-4">PROMO DISKON 50% UNTUK PEMBELIAN PERTAMA</span>
          <span className="mx-4">BELI 3 BUAH NAGA GRATIS 1 BIBIT</span>
        </div>
      </div>

      {/* Main Navbar */}
      <nav className="sticky top-0 z-50 bg-white/95 backdrop-blur-md text-stone-900 border-b border-stone-200 shadow-sm">
        <div className="max-w-screen-2xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex justify-between items-center h-20">
            
            {/* Left: Logo */}
            <div className="flex-shrink-0">
              <Link to="/" className="font-heading text-2xl font-black tracking-widest uppercase hover:opacity-80 transition-opacity">
                BUMDes <span className="font-light text-stone-500">SUKOREJO</span>
              </Link>
            </div>

            {/* Center: Navigation */}
            <div className="hidden lg:flex items-center space-x-10">
              <Link to="/" className={`text-xs font-bold uppercase tracking-widest transition-colors ${location.pathname === '/' ? 'text-stone-900 border-b-2 border-stone-900 pb-1' : 'text-stone-500 hover:text-stone-900'}`}>
                {lang === 'en' ? 'HOME' : 'BERANDA'}
              </Link>
              <Link to="/katalog" className={`text-xs font-bold uppercase tracking-widest transition-colors ${location.pathname === '/katalog' ? 'text-stone-900 border-b-2 border-stone-900 pb-1' : 'text-stone-500 hover:text-stone-900'}`}>
                {lang === 'en' ? 'CATALOG' : 'KATALOG'}
              </Link>
              <Link to="/tentang-kami" className={`text-xs font-bold uppercase tracking-widest transition-colors ${location.pathname === '/tentang-kami' ? 'text-stone-900 border-b-2 border-stone-900 pb-1' : 'text-stone-500 hover:text-stone-900'}`}>
                {lang === 'en' ? 'ABOUT US' : 'TENTANG KAMI'}
              </Link>
              {(user?.permissions?.ManageProducts || user?.permissions?.ManageOrders || user?.permissions?.ManageUsers) && (
                <Link to="/dashboard" className={`text-xs font-bold uppercase tracking-widest transition-colors text-red-600 hover:text-red-800`}>
                  DASHBOARD
                </Link>
              )}
            </div>

            {/* Right: Icons */}
            <div className="flex items-center space-x-5">
              <button className="text-stone-900 hover:text-stone-500 transition-colors hidden sm:block">
                <Search size={20} strokeWidth={1.5} />
              </button>
              
              <Link to="/profile" className="text-stone-900 hover:text-stone-500 transition-colors hidden sm:block">
                <User size={20} strokeWidth={1.5} />
              </Link>

              <button 
                onClick={toggleLanguage}
                className="flex items-center space-x-1 text-stone-900 hover:text-stone-500 transition-colors text-xs font-bold uppercase tracking-widest"
              >
                <Globe size={18} strokeWidth={1.5} />
                <span>{lang}</span>
              </button>

              <button 
                onClick={onCartClick}
                className="relative text-stone-900 hover:text-stone-500 transition-colors"
              >
                <ShoppingCart size={20} strokeWidth={1.5} />
                {totalItems > 0 && (
                  <span className="absolute -top-2 -right-2 inline-flex items-center justify-center w-4 h-4 text-[10px] font-bold text-white bg-stone-900 rounded-full">
                    {totalItems}
                  </span>
                )}
              </button>
            </div>
          </div>
        </div>
      </nav>
    </div>
  );
};

export default Navbar;
