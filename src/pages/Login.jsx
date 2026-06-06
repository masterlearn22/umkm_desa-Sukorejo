import React, { useState } from 'react';
import { Link, useNavigate, useLocation } from 'react-router-dom';
import { useAuth } from '../context/AuthContext';
import { hashPassword } from '../utils/hash';
import { loginUser } from '../services/api';
import { LogIn } from 'lucide-react';

export const Login = () => {
  const { login } = useAuth();
  const navigate = useNavigate();
  const location = useLocation();
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [isSubmitting, setIsSubmitting] = useState(false);

  const from = location.state?.from?.pathname || '/';

  const handleSubmit = async (e) => {
    e.preventDefault();
    setIsSubmitting(true);
    
    try {
      // Hash input password
      const hashedInputPass = await hashPassword(password);
      
      // Request login via GAS
      const response = await loginUser(email, hashedInputPass);
      
      if (response.status === 'success') {
        login(response.user, response.permissions);
        alert('Berhasil login!');
        navigate(from, { replace: true });
      } else {
        alert(response.message || 'Email atau password salah!');
      }
    } catch (error) {
      console.error("Login caught error:", error);
      alert('Gagal login: ' + (error.message || 'Kesalahan jaringan. Pastikan internet Anda lancar.'));
    } finally {
      setIsSubmitting(false);
    }
  };

  return (
    <div className="min-h-[80vh] flex items-center justify-center bg-stone-50 py-12 px-4 sm:px-6 lg:px-8">
      <div className="max-w-md w-full space-y-8 bg-white p-10 rounded-[2rem] shadow-sm border border-stone-200">
        <div className="text-center">
          <h2 className="mt-6 text-3xl font-heading font-black text-stone-900 uppercase tracking-widest">
            Selamat Datang
          </h2>
          <p className="mt-2 text-sm text-stone-500">
            Masuk untuk melanjutkan pesanan Anda
          </p>
        </div>
        <form className="mt-8 space-y-6" onSubmit={handleSubmit}>
          <div className="space-y-4">
            <div>
              <label className="block text-xs font-bold uppercase tracking-widest text-stone-700 mb-2">Email</label>
              <input
                type="email"
                required
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                className="w-full px-5 py-4 bg-stone-50 border border-stone-200 rounded-xl focus:ring-2 focus:ring-stone-900 focus:border-transparent outline-none transition-all focus:bg-white text-stone-900"
                placeholder="email@anda.com"
              />
            </div>
            <div>
              <label className="block text-xs font-bold uppercase tracking-widest text-stone-700 mb-2">Password</label>
              <input
                type="password"
                required
                value={password}
                onChange={(e) => setPassword(e.target.value)}
                className="w-full px-5 py-4 bg-stone-50 border border-stone-200 rounded-xl focus:ring-2 focus:ring-stone-900 focus:border-transparent outline-none transition-all focus:bg-white text-stone-900"
                placeholder="••••••••"
              />
            </div>
          </div>

          <button
            type="submit"
            disabled={isSubmitting}
            className="w-full py-4 px-6 bg-stone-900 text-white rounded-full font-bold uppercase tracking-widest text-sm hover:bg-stone-800 transition-all flex items-center justify-center gap-2 disabled:bg-stone-400"
          >
            {isSubmitting ? 'Memproses...' : 'Masuk Sekarang'}
            {!isSubmitting && <LogIn size={18} />}
          </button>
          
          <p className="text-center text-sm text-stone-600">
            Belum punya akun?{' '}
            <Link to="/register" className="font-bold text-stone-900 hover:underline">
              Daftar di sini
            </Link>
          </p>
        </form>
      </div>
    </div>
  );
};
