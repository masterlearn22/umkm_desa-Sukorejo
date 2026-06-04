import React from 'react';
import { Leaf, Users, MapPin, TrendingUp } from 'lucide-react';
import { useLanguage } from '../context/LanguageContext';

const AboutUs = () => {
  const { lang, t } = useLanguage();

  return (
    <div className="bg-white min-h-screen">
      
      {/* Hero Section */}
      <section className="relative w-full bg-[#f4f2ec] py-24 md:py-32 flex flex-col items-center justify-center text-center px-4 overflow-hidden border-b border-stone-200">
        <h1 className="text-5xl md:text-6xl lg:text-7xl font-heading font-black text-stone-900 uppercase tracking-widest mb-6 relative z-10">
          TENTANG KAMI
        </h1>
        <p className="max-w-2xl text-stone-600 text-base md:text-lg leading-relaxed relative z-10">
          Kami adalah penggerak ekonomi Desa Sukorejo, berdedikasi tinggi untuk menghadirkan buah naga organik berkualitas premium sembari memberdayakan para petani lokal agar hidup lebih sejahtera.
        </p>
        
        {/* Subtle decorative elements behind text */}
        <div className="absolute top-0 left-0 w-64 h-64 bg-white opacity-40 rounded-full blur-3xl -translate-x-1/2 -translate-y-1/2 pointer-events-none" />
        <div className="absolute bottom-0 right-0 w-96 h-96 bg-white opacity-40 rounded-full blur-3xl translate-x-1/3 translate-y-1/3 pointer-events-none" />
      </section>

      {/* Our Story Section */}
      <section className="max-w-screen-xl mx-auto px-4 sm:px-6 lg:px-8 py-20 md:py-32">
        <div className="flex flex-col lg:flex-row gap-16 items-center">
          
          <div className="w-full lg:w-1/2">
            <div className="bg-stone-100 rounded-3xl aspect-[4/3] w-full overflow-hidden flex items-center justify-center relative">
               {/* Decorative placeholder for farm image */}
               <div className="absolute inset-0 bg-stone-200"></div>
               <Leaf size={64} className="text-stone-300 relative z-10" />
               <span className="absolute bottom-6 left-6 text-xs font-bold text-stone-400 uppercase tracking-widest">
                 Kebun Organik Sukorejo
               </span>
            </div>
          </div>
          
          <div className="w-full lg:w-1/2 flex flex-col justify-center">
            <h2 className="text-3xl md:text-4xl font-heading font-black text-stone-900 uppercase tracking-widest mb-8">
              CERITA KAMI
            </h2>
            <p className="text-stone-600 leading-relaxed mb-6">
              BUMDes Sukorejo lahir dari semangat gotong royong warga desa untuk memaksimalkan potensi alam luar biasa yang kami miliki. Berawal dari beberapa petani yang menanam buah naga secara tradisional, kami bertransformasi menjadi pusat agrikultur modern berbasis organik.
            </p>
            <p className="text-stone-600 leading-relaxed">
              Kami percaya bahwa kualitas hasil bumi berbanding lurus dengan kelestarian alam tempatnya tumbuh. Oleh karena itu, kami menetapkan standar nol pestisida dan pengelolaan limbah sirkular untuk memastikan setiap gigitan buah naga kami tidak hanya lezat dan sehat, namun juga menjaga keseimbangan ekosistem desa.
            </p>
          </div>

        </div>
      </section>

      {/* Values Section */}
      <section className="w-full bg-[#1c1c1a] text-white py-20 md:py-32">
        <div className="max-w-screen-xl mx-auto px-4 sm:px-6 lg:px-8">
          
          <div className="text-center mb-16 md:mb-24">
             <h2 className="text-3xl md:text-4xl font-heading font-black uppercase tracking-widest mb-6">
               VISI & MISI
             </h2>
             <p className="max-w-2xl mx-auto text-stone-400 leading-relaxed">
               Langkah besar kami selalu dipandu oleh nilai-nilai mulia untuk mewujudkan masyarakat mandiri dan lingkungan lestari.
             </p>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-12">
             <div className="flex flex-col items-center text-center">
                <div className="w-16 h-16 bg-stone-800 rounded-full flex items-center justify-center mb-6">
                   <Leaf size={28} className="text-stone-100" />
                </div>
                <h3 className="text-sm font-bold uppercase tracking-widest mb-4">100% Organik</h3>
                <p className="text-sm text-stone-400 leading-relaxed">
                  Menjaga kemurnian tanah dan memproduksi buah naga bebas bahan kimia secara konsisten.
                </p>
             </div>
             
             <div className="flex flex-col items-center text-center">
                <div className="w-16 h-16 bg-stone-800 rounded-full flex items-center justify-center mb-6">
                   <Users size={28} className="text-stone-100" />
                </div>
                <h3 className="text-sm font-bold uppercase tracking-widest mb-4">Kesejahteraan Petani</h3>
                <p className="text-sm text-stone-400 leading-relaxed">
                  Menciptakan harga jual yang adil dan ekosistem bisnis yang memberdayakan masyarakat desa.
                </p>
             </div>
             
             <div className="flex flex-col items-center text-center">
                <div className="w-16 h-16 bg-stone-800 rounded-full flex items-center justify-center mb-6">
                   <TrendingUp size={28} className="text-stone-100" />
                </div>
                <h3 className="text-sm font-bold uppercase tracking-widest mb-4">Inovasi Olahan</h3>
                <p className="text-sm text-stone-400 leading-relaxed">
                  Tidak berhenti di buah segar, kami mengembangkan berbagai varian produk turunan untuk menambah nilai ekonomi.
                </p>
             </div>
             
             <div className="flex flex-col items-center text-center">
                <div className="w-16 h-16 bg-stone-800 rounded-full flex items-center justify-center mb-6">
                   <MapPin size={28} className="text-stone-100" />
                </div>
                <h3 className="text-sm font-bold uppercase tracking-widest mb-4">Kualitas Ekspor</h3>
                <p className="text-sm text-stone-400 leading-relaxed">
                  Membawa nama Desa Sukorejo ke pasar nasional dan internasional melalui standar mutu yang tinggi.
                </p>
             </div>
          </div>

        </div>
      </section>

      {/* Contact & Location */}
      <section className="max-w-screen-xl mx-auto px-4 sm:px-6 lg:px-8 py-20 md:py-32">
        <div className="bg-[#f4f2ec] rounded-[2rem] p-8 md:p-16 flex flex-col md:flex-row gap-12 items-center justify-between border border-stone-200">
           
           <div className="w-full md:w-1/2">
             <h2 className="text-2xl md:text-3xl font-heading font-black text-stone-900 uppercase tracking-widest mb-6">
               Kunjungi Kami
             </h2>
             <p className="text-stone-600 mb-8 leading-relaxed max-w-md">
               Ingin melihat langsung proses penanaman buah naga organik atau berdiskusi soal kemitraan? Pintu kami selalu terbuka.
             </p>
             <div className="space-y-4">
               <div className="flex items-center gap-4 text-stone-800 font-medium text-sm">
                 <div className="w-10 h-10 bg-white rounded-full flex items-center justify-center border border-stone-200">
                   <MapPin size={18} />
                 </div>
                 Desa Sukorejo, Jawa Timur, Indonesia
               </div>
             </div>
           </div>
           
           <div className="w-full md:w-1/2 h-64 md:h-80 bg-stone-200 rounded-2xl overflow-hidden relative flex items-center justify-center">
              <span className="text-stone-400 font-bold tracking-widest uppercase text-xs">Peta Lokasi Dummy</span>
           </div>

        </div>
      </section>

    </div>
  );
};

export default AboutUs;
