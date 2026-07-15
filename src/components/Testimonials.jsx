import React from 'react';
import { ChevronLeft, ChevronRight } from 'lucide-react';

const testimonials = [
  {
    name: 'BU ANI',
    review: 'Kualitas buah naga dari Sukorejo memang luar biasa. Dagingnya tebal dan sangat manis. Anak-anak saya sangat menyukainya. Pengiriman juga sangat aman dan cepat sampai.',
    productName: 'BUAH NAGA MERAH PAK TARNO',
    image: 'https://images.unsplash.com/photo-1544005313-94ddf0286df2?q=80&w=1976&auto=format&fit=crop',
    productIcon: '🍉'
  },
  {
    name: 'PAK BUDI',
    review: 'Saya mencoba membeli bibit unggul dari BUMDes ini, dan setelah beberapa bulan langsung berbuah lebat! Sangat direkomendasikan untuk yang hobi berkebun di rumah.',
    productName: 'BIBIT BUAH NAGA UNGGULAN',
    image: 'https://images.unsplash.com/photo-1506794778202-cad84cf45f1d?q=80&w=1974&auto=format&fit=crop',
    productIcon: '🌱'
  },
  {
    name: 'SITI',
    review: 'Cake buah naga lapis cokelatnya juara! Perpaduan rasa manis alami buah naga dan cokelat premiumnya sangat pas. Selalu jadi pesanan wajib kalau ada acara keluarga.',
    productName: 'CAKE BUAH NAGA',
    image: 'https://images.unsplash.com/photo-1534528741775-53994a69daeb?q=80&w=1964&auto=format&fit=crop',
    productIcon: '🍰'
  }
];

const Testimonials = () => {
  return (
    <div className="w-full bg-[#f4f2ec] py-12 lg:py-24 px-4 sm:px-6 lg:px-8">
      <div className="max-w-screen-2xl mx-auto">
        
        {/* Header */}
        <div className="flex justify-between items-center mb-10">
          <h2 className="font-heading text-xl md:text-2xl font-bold uppercase tracking-widest text-stone-900">
            ULASAN PELANGGAN
          </h2>
          <div className="flex gap-2">
            <button className="p-2 rounded-full border border-stone-300 hover:bg-stone-200 transition-colors">
              <ChevronLeft size={20} />
            </button>
            <button className="p-2 rounded-full border border-stone-300 hover:bg-stone-200 transition-colors">
              <ChevronRight size={20} />
            </button>
          </div>
        </div>

        {/* Grid */}
        <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
          {testimonials.map((testi, idx) => (
            <div key={idx} className="bg-white rounded-3xl overflow-hidden shadow-sm border border-stone-100 flex flex-col h-full">
              
              {/* Photo */}
              <div className="h-64 sm:h-72 md:h-80 w-full overflow-hidden">
                <img 
                  src={testi.image} 
                  alt={testi.name} 
                  className="w-full h-full object-cover"
                />
              </div>

              {/* Review Content */}
              <div className="p-8 flex flex-col flex-grow">
                <h4 className="font-heading font-bold text-sm uppercase tracking-widest text-stone-900 mb-4">
                  {testi.name}
                </h4>
                <p className="text-sm font-sans text-stone-600 leading-relaxed mb-8 flex-grow">
                  {testi.review}
                </p>
                
                {/* Product Mention */}
                <div className="flex items-center gap-3 pt-4 border-t border-stone-100">
                  <div className="w-8 h-8 flex items-center justify-center bg-stone-100 rounded-full text-lg">
                    {testi.productIcon}
                  </div>
                  <span className="font-heading font-bold text-xs uppercase tracking-wider text-stone-900">
                    {testi.productName}
                  </span>
                </div>
              </div>

            </div>
          ))}
        </div>

      </div>
    </div>
  );
};

export default Testimonials;
