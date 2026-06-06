import React from 'react';
import { NavLink, Outlet, useNavigate } from 'react-router-dom';
import { useAuth } from '../../context/AuthContext';
import { User, MapPin, Lock, ShoppingBag, LogOut, Store } from 'lucide-react';

const ProfileLayout = () => {
  const { user, logout } = useAuth();
  const navigate = useNavigate();

  const handleLogout = () => {
    logout();
    navigate('/');
  };

  if (!user) return null;

  return (
    <div className="bg-[#f5f5f5] min-h-screen py-8">
      <div className="max-w-6xl mx-auto px-4 sm:px-6 flex flex-col md:flex-row gap-6">
        
        {/* Sidebar */}
        <div className="w-full md:w-64 flex-shrink-0">
          <div className="flex items-center gap-3 mb-6 px-2">
            <div className="w-12 h-12 bg-stone-300 rounded-full flex items-center justify-center text-stone-600 overflow-hidden">
              {/* Dummy Avatar */}
              <User size={24} />
            </div>
            <div>
              <p className="font-bold text-stone-800 text-sm">{user.name || user.email}</p>
              <p className="text-xs text-stone-500 flex items-center gap-1">
                <span className="w-2 h-2 bg-green-500 rounded-full"></span>
                Ubah Profil
              </p>
            </div>
          </div>

          <nav className="space-y-1">
            <div className="mb-4">
              <div className="flex items-center gap-3 px-3 py-2 text-stone-800 font-bold text-sm mb-1">
                <User size={18} className="text-blue-600" />
                Akun Saya
              </div>
              <div className="flex flex-col space-y-1 pl-9">
                <NavLink 
                  to="/profile/account" 
                  className={({isActive}) => `text-sm py-1.5 transition-colors ${isActive ? 'text-[#ee4d2d] font-medium' : 'text-stone-600 hover:text-[#ee4d2d]'}`}
                >
                  Profil
                </NavLink>
                <NavLink 
                  to="/profile/address" 
                  className={({isActive}) => `text-sm py-1.5 transition-colors ${isActive ? 'text-[#ee4d2d] font-medium' : 'text-stone-600 hover:text-[#ee4d2d]'}`}
                >
                  Alamat
                </NavLink>
                <NavLink 
                  to="/profile/password" 
                  className={({isActive}) => `text-sm py-1.5 transition-colors ${isActive ? 'text-[#ee4d2d] font-medium' : 'text-stone-600 hover:text-[#ee4d2d]'}`}
                >
                  Ubah Password
                </NavLink>
              </div>
            </div>

            <div>
              <NavLink 
                to="/profile/orders" 
                className={({isActive}) => `flex items-center gap-3 px-3 py-2 text-sm font-bold transition-colors ${isActive ? 'text-[#ee4d2d]' : 'text-stone-800 hover:text-[#ee4d2d]'}`}
              >
                <ShoppingBag size={18} className="text-blue-500" />
                Pesanan Saya
              </NavLink>
            </div>

            {user.role === 'user' && (
              <div className="pt-2 mt-2 border-t border-stone-200">
                <NavLink 
                  to="/profile/apply-seller" 
                  className={({isActive}) => `flex items-center gap-3 px-3 py-2 text-sm font-bold transition-colors ${isActive ? 'text-[#ee4d2d]' : 'text-stone-800 hover:text-[#ee4d2d]'}`}
                >
                  <Store size={18} className="text-orange-500" />
                  Mulai Berjualan
                </NavLink>
              </div>
            )}
          </nav>

          <button 
            onClick={handleLogout}
            className="flex items-center gap-3 px-3 py-2 text-sm font-bold text-red-600 hover:bg-red-50 rounded-lg mt-8 transition-colors w-full"
          >
            <LogOut size={18} />
            Keluar
          </button>
        </div>

        {/* Main Content Area */}
        <div className="flex-grow bg-white shadow-sm rounded-sm">
          <Outlet />
        </div>

      </div>
    </div>
  );
};

export default ProfileLayout;
