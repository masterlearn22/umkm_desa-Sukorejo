import React from 'react';
import { Heart, Sparkles, Droplets, Recycle, Briefcase, Clock } from 'lucide-react';

const values = [
  {
    icon: <Heart size={40} strokeWidth={1} />,
    title: 'DITANAM LOKAL',
    desc: 'Apakah Anda tahu dari mana produk Anda berasal? Di BUMDes Sukorejo, setiap buah ditanam dengan penuh cinta oleh petani lokal Desa Sukorejo.'
  },
  {
    icon: <Sparkles size={40} strokeWidth={1} />,
    title: 'KUALITAS PREMIUM',
    desc: 'Hasil panen disortir dengan standar tinggi untuk menghasilkan kualitas ekspor. Hanya buah dan bibit terbaik yang sampai ke tangan Anda.'
  },
  {
    icon: <Droplets size={40} strokeWidth={1} />,
    title: 'BEBAS PESTISIDA',
    desc: 'Semua produk kami ditanam dengan mengedepankan prinsip pertanian organik. Tanpa bahan kimia berbahaya, menjaga kemurnian tanah dan kesehatan konsumen.'
  },
  {
    icon: <Recycle size={40} strokeWidth={1} />,
    title: 'RAMAH LINGKUNGAN',
    desc: 'Kemasan produk olahan kami menggunakan bahan yang mudah terurai dan dapat didaur ulang, sejalan dengan visi misi keberlanjutan BUMDes.'
  },
  {
    icon: <Briefcase size={40} strokeWidth={1} />,
    title: 'MENDUKUNG UMKM',
    desc: 'Setiap pembelian Anda berkontribusi langsung pada kesejahteraan ekonomi keluarga petani dan perajin lokal di Desa Sukorejo.'
  },
  {
    icon: <Clock size={40} strokeWidth={1} />,
    title: 'TAHAN LAMA',
    desc: 'Bibit unggul dan produk olahan kami dirancang untuk memiliki daya simpan dan daya tumbuh maksimal dengan perawatan yang tepat.'
  }
];

const ValuesGrid = () => {
  return (
    <div className="w-full bg-[#f4f2ec] py-12 lg:py-20 px-4 sm:px-6 lg:px-8">
      <div className="max-w-screen-xl mx-auto">
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-x-12 gap-y-10 lg:gap-y-16 text-center">
          {values.map((val, idx) => (
            <div key={idx} className="flex flex-col items-center">
              <div className="text-stone-800 mb-6">
                {val.icon}
              </div>
              <h3 className="font-heading text-lg font-bold uppercase tracking-widest text-stone-900 mb-4">
                {val.title}
              </h3>
              <p className="text-sm font-sans text-stone-600 leading-relaxed max-w-sm">
                {val.desc}
              </p>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
};

export default ValuesGrid;
