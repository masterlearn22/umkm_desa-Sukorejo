import React from 'react';
import { ChevronRight } from 'lucide-react';

const Footer = () => {
  return (
    <footer className="bg-[#f4f2ec] border-t border-stone-200 pt-24 pb-12 px-4 sm:px-6 lg:px-8 mt-auto">
      <div className="max-w-screen-2xl mx-auto flex flex-col lg:flex-row gap-16 lg:gap-24">
        
        {/* Left: Newsletter */}
        <div className="flex-1 lg:max-w-md">
          <h3 className="font-heading font-black text-xl md:text-2xl uppercase tracking-widest text-stone-900 mb-4">
            BERLANGGANAN NEWSLETTER KAMI
          </h3>
          <p className="text-sm font-sans text-stone-600 mb-6 leading-relaxed">
            Jadilah yang pertama tahu tentang produk baru, panen terbaru, dan dapatkan penawaran eksklusif dari Desa Sukorejo.
          </p>
          <div className="relative">
            <input 
              type="email" 
              placeholder="Alamat email Anda" 
              className="w-full bg-stone-100 border border-stone-200 rounded-full px-6 py-4 text-sm focus:outline-none focus:ring-1 focus:ring-stone-900 transition-shadow"
            />
            <button className="absolute right-2 top-1/2 -translate-y-1/2 p-2 hover:bg-stone-200 rounded-full transition-colors text-stone-900">
              <ChevronRight size={20} />
            </button>
          </div>
          <p className="text-[10px] text-stone-400 mt-4 leading-relaxed">
            Dengan berlangganan, Anda menyetujui Kebijakan Privasi kami. Anda dapat berhenti berlangganan kapan saja.
          </p>
        </div>
        
        {/* Middle: Links */}
        <div className="flex gap-12 sm:gap-24">
          <div>
            <h4 className="font-heading font-bold text-sm uppercase tracking-widest text-stone-900 mb-6">INFORMASI</h4>
            <ul className="space-y-4 text-sm font-sans text-stone-600">
              <li><a href="#" className="hover:text-stone-900 transition-colors">Kebijakan Privasi</a></li>
              <li><a href="#" className="hover:text-stone-900 transition-colors">Syarat & Ketentuan</a></li>
              <li><a href="#" className="hover:text-stone-900 transition-colors">Pengiriman & Pengembalian</a></li>
              <li><a href="#" className="hover:text-stone-900 transition-colors">Katalog Produk</a></li>
            </ul>
          </div>
          <div>
            <h4 className="font-heading font-bold text-sm uppercase tracking-widest text-stone-900 mb-6">TENTANG</h4>
            <ul className="space-y-4 text-sm font-sans text-stone-600">
              <li><a href="#" className="hover:text-stone-900 transition-colors">Cerita Kami</a></li>
              <li><a href="#" className="hover:text-stone-900 transition-colors">Petani Lokal</a></li>
              <li><a href="#" className="hover:text-stone-900 transition-colors">Hubungi Kami</a></li>
            </ul>
          </div>
        </div>
        
        {/* Right: Box Logo & Address */}
        <div className="flex flex-col items-start lg:items-end flex-1">
          <div className="border-[6px] border-stone-900 p-6 inline-flex flex-col font-heading font-black text-4xl md:text-5xl uppercase tracking-[0.2em] leading-none mb-6">
            <span>BUM</span>
            <span>DES.</span>
          </div>
          <div className="text-sm font-sans text-stone-600 lg:text-right space-y-1">
            <p className="font-bold text-stone-900">BUMDes Sukorejo</p>
            <p>Pusat Oleh-Oleh & Agrowisata</p>
            <p>Desa Sukorejo, Bangorejo</p>
            <p>Banyuwangi, Jawa Timur</p>
            <p className="pt-2">info@bumdes-sukorejo.com</p>
          </div>
        </div>
        
      </div>
      
      {/* Bottom Bar */}
      <div className="max-w-screen-2xl mx-auto mt-20 pt-8 border-t border-stone-200 flex flex-col md:flex-row justify-between items-center gap-6 text-xs font-sans text-stone-500">
        <p>&copy; {new Date().getFullYear()} BUMDes Sukorejo. Seluruh hak cipta dilindungi.</p>
        <div className="flex items-center gap-6 text-stone-900 font-bold uppercase">
          <a href="#" className="hover:text-stone-500 transition-colors">FB</a>
          <a href="#" className="hover:text-stone-500 transition-colors">IG</a>
          <a href="#" className="hover:text-stone-500 transition-colors">TW</a>
        </div>
      </div>
    </footer>
  );
};

export default Footer;
