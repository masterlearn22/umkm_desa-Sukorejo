import React, { useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { useAuth } from '../context/AuthContext';
import { UserPlus } from 'lucide-react';

export const Register = () => {
  const { login } = useAuth();
  const navigate = useNavigate();
  
  const [formData, setFormData] = useState({
    name: '',
    phone: '',
    email: '',
    password: '',
    address: ''
  });

  const handleChange = (e) => {
    setFormData(prev => ({ ...prev, [e.target.name]: e.target.value }));
  };

  const handleSubmit = (e) => {
    e.preventDefault();
    
    // Simulate registration
    const savedUserStr = localStorage.getItem('umkm-registered-users');
    let users = savedUserStr ? JSON.parse(savedUserStr) : [];
    
    if (users.find(u => u.email === formData.email)) {
      alert('Email sudah terdaftar!');
      return;
    }

    users.push(formData);
    localStorage.setItem('umkm-registered-users', JSON.stringify(users));
    
    // Auto login
    const { password, ...userSession } = formData;
    login(userSession);
    navigate('/');
  };

  return (
    <div className="min-h-[90vh] flex items-center justify-center bg-stone-50 py-12 px-4 sm:px-6 lg:px-8">
      <div className="max-w-xl w-full space-y-8 bg-white p-10 rounded-[2rem] shadow-sm border border-stone-200">
        <div className="text-center">
          <h2 className="mt-2 text-3xl font-heading font-black text-stone-900 uppercase tracking-widest">
            Daftar Akun
          </h2>
          <p className="mt-2 text-sm text-stone-500">
            Lengkapi data diri Anda untuk memudahkan proses belanja
          </p>
        </div>
        
        <form className="mt-8 space-y-6" onSubmit={handleSubmit}>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            <div>
              <label className="block text-xs font-bold uppercase tracking-widest text-stone-700 mb-2">Nama Lengkap</label>
              <input
                type="text"
                name="name"
                required
                value={formData.name}
                onChange={handleChange}
                className="w-full px-5 py-4 bg-stone-50 border border-stone-200 rounded-xl focus:ring-2 focus:ring-stone-900 focus:border-transparent outline-none transition-all focus:bg-white text-stone-900"
              />
            </div>
            <div>
              <label className="block text-xs font-bold uppercase tracking-widest text-stone-700 mb-2">No. WhatsApp</label>
              <input
                type="tel"
                name="phone"
                required
                placeholder="+62..."
                value={formData.phone}
                onChange={handleChange}
                className="w-full px-5 py-4 bg-stone-50 border border-stone-200 rounded-xl focus:ring-2 focus:ring-stone-900 focus:border-transparent outline-none transition-all focus:bg-white text-stone-900"
              />
            </div>
            <div>
              <label className="block text-xs font-bold uppercase tracking-widest text-stone-700 mb-2">Email</label>
              <input
                type="email"
                name="email"
                required
                value={formData.email}
                onChange={handleChange}
                className="w-full px-5 py-4 bg-stone-50 border border-stone-200 rounded-xl focus:ring-2 focus:ring-stone-900 focus:border-transparent outline-none transition-all focus:bg-white text-stone-900"
              />
            </div>
            <div>
              <label className="block text-xs font-bold uppercase tracking-widest text-stone-700 mb-2">Password</label>
              <input
                type="password"
                name="password"
                required
                value={formData.password}
                onChange={handleChange}
                className="w-full px-5 py-4 bg-stone-50 border border-stone-200 rounded-xl focus:ring-2 focus:ring-stone-900 focus:border-transparent outline-none transition-all focus:bg-white text-stone-900"
              />
            </div>
          </div>
          
          <div>
            <label className="block text-xs font-bold uppercase tracking-widest text-stone-700 mb-2">Alamat Pengiriman Default</label>
            <textarea
              name="address"
              required
              rows="3"
              value={formData.address}
              onChange={handleChange}
              placeholder="Jl. Raya Sukorejo No. 1..."
              className="w-full px-5 py-4 bg-stone-50 border border-stone-200 rounded-xl focus:ring-2 focus:ring-stone-900 focus:border-transparent outline-none transition-all focus:bg-white text-stone-900 resize-none"
            ></textarea>
          </div>

          <button
            type="submit"
            className="w-full py-4 px-6 bg-stone-900 text-white rounded-full font-bold uppercase tracking-widest text-sm hover:bg-stone-800 transition-all flex items-center justify-center gap-2"
          >
            Buat Akun <UserPlus size={18} />
          </button>
          
          <p className="text-center text-sm text-stone-600">
            Sudah punya akun?{' '}
            <Link to="/login" className="font-bold text-stone-900 hover:underline">
              Masuk di sini
            </Link>
          </p>
        </form>
      </div>
    </div>
  );
};
