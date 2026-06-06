import React from 'react';
import { Link, Outlet, useLocation } from 'react-router-dom';
import { useAuth } from '../../context/AuthContext';
import { LayoutDashboard, Package, ShoppingBag, Users, Store } from 'lucide-react';

const DashboardLayout = () => {
  const { user } = useAuth();
  const location = useLocation();

  const navItems = [
    { 
      name: 'Produk', 
      path: '/dashboard/products', 
      icon: <Package size={20} />, 
      show: user?.permissions?.ManageProducts 
    },
    { 
      name: 'Pesanan', 
      path: '/dashboard/orders', 
      icon: <ShoppingBag size={20} />, 
      show: user?.permissions?.ManageOrders 
    },
    { 
      name: 'Pengguna', 
      path: '/dashboard/users', 
      icon: <Users size={20} />, 
      show: user?.permissions?.ManageUsers 
    },
    { 
      name: 'Pengajuan Penjual', 
      path: '/dashboard/applications', 
      icon: <Store size={20} />, 
      show: user?.permissions?.ManageUsers 
    }
  ];

  return (
    <div className="flex min-h-[80vh] bg-stone-50">
      {/* Sidebar */}
      <div className="w-64 bg-white border-r border-stone-200 flex flex-col">
        <div className="h-20 flex items-center px-6 border-b border-stone-200">
          <h2 className="font-heading font-black tracking-widest text-lg flex items-center gap-2">
            <LayoutDashboard size={24} /> DASHBOARD
          </h2>
        </div>
        <nav className="flex-1 px-4 py-6 space-y-2">
          {navItems.filter(item => item.show).map(item => (
            <Link
              key={item.path}
              to={item.path}
              className={`flex items-center gap-3 px-4 py-3 rounded-xl font-bold uppercase tracking-widest text-xs transition-colors ${
                location.pathname === item.path 
                  ? 'bg-stone-900 text-white' 
                  : 'text-stone-500 hover:bg-stone-100 hover:text-stone-900'
              }`}
            >
              {item.icon}
              {item.name}
            </Link>
          ))}
        </nav>
      </div>

      {/* Main Content */}
      <div className="flex-1 flex flex-col">
        <div className="h-20 bg-white border-b border-stone-200 flex items-center px-8">
          <p className="text-sm font-bold text-stone-600">
            Login sebagai: <span className="text-stone-900 uppercase">{user?.role}</span> ({user?.name})
          </p>
        </div>
        <div className="p-8 flex-1 overflow-auto">
          <Outlet />
        </div>
      </div>
    </div>
  );
};

export default DashboardLayout;
