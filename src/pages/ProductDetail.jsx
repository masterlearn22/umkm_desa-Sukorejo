import React, { useState, useEffect } from 'react';
import { useParams, Link, useNavigate } from 'react-router-dom';
import { useLanguage } from '../context/LanguageContext';
import { useCart } from '../context/CartContext';
import { ChevronDown, ChevronUp, Share2, HelpCircle, Leaf, ShieldCheck, MapPin, Recycle, Minus, Plus } from 'lucide-react';

const ProductDetail = ({ products }) => {
  const { id } = useParams();
  const { lang, t } = useLanguage();
  const { addToCart } = useCart();
  const navigate = useNavigate();
  
  const [product, setProduct] = useState(null);
  
  // Accordion state
  const [openSections, setSections] = useState({
    description: true,
    specs: false,
    shipping: false
  });

  const [quantity, setQuantity] = useState(1);

  useEffect(() => {
    // Find product from props. (In a real app, might fetch if not found)
    if (products && products.length > 0) {
      const found = products.find(p => p.ID_Produk === id);
      setProduct(found);
    }
  }, [id, products]);

  if (!products || products.length === 0) {
    return <div className="min-h-screen pt-24 text-center">Loading...</div>;
  }

  if (!product) {
    return (
      <div className="min-h-screen pt-24 text-center">
        <h1 className="text-2xl font-bold">Produk tidak ditemukan.</h1>
        <Link to="/katalog" className="text-blue-500 hover:underline mt-4 inline-block">Kembali ke Katalog</Link>
      </div>
    );
  }

  const title = lang === 'en' && product.Nama_Eng ? product.Nama_Eng : product.Nama_Indo;
  const description = lang === 'en' && product.Deskripsi_Eng ? product.Deskripsi_Eng : product.Deskripsi_Indo;

  const formatPrice = (price) => {
    return new Intl.NumberFormat('id-ID', {
      style: 'currency',
      currency: 'IDR',
      minimumFractionDigits: 0
    }).format(price);
  };

  const isOutOfStock = product.Status === 'Habis';

  const toggleSection = (section) => {
    setSections(prev => ({
      ...prev,
      [section]: !prev[section]
    }));
  };

  const handleBuyNow = () => {
    if (!isOutOfStock) {
      addToCart(product, quantity);
      navigate('/payment');
    }
  };

  return (
    <div className="bg-white min-h-screen">
      {/* Breadcrumbs */}
      <div className="max-w-screen-2xl mx-auto px-4 sm:px-6 lg:px-8 py-6 text-sm text-stone-500">
        <Link to="/" className="hover:text-stone-900 transition-colors">Beranda</Link>
        <span className="mx-2">&gt;</span>
        <Link to="/katalog" className="hover:text-stone-900 transition-colors">Katalog</Link>
        <span className="mx-2">&gt;</span>
        <span className="text-stone-900">{title}</span>
      </div>

      <div className="max-w-screen-2xl mx-auto px-4 sm:px-6 lg:px-8 py-8 md:py-12">
        <div className="flex flex-col lg:flex-row gap-12 lg:gap-24">
          
          {/* Left Column: Image */}
          <div className="w-full lg:w-1/2">
            <div className="bg-[#f4f2ec] rounded-[2rem] aspect-square flex items-center justify-center p-8 relative">
              {product.Foto_URL ? (
                <img 
                  src={product.Foto_URL} 
                  alt={title} 
                  className="w-full h-full object-contain drop-shadow-xl"
                />
              ) : (
                <div className="text-stone-400">No Image</div>
              )}
            </div>
          </div>

          {/* Right Column: Details */}
          <div className="w-full lg:w-1/2 flex flex-col">
            <h1 className="text-4xl md:text-5xl font-heading font-black text-stone-900 uppercase tracking-wide mb-4">
              {title}
            </h1>
            
            <div className="mb-6">
              <p className="text-2xl font-bold text-stone-900">{formatPrice(product.Harga_Rp)}</p>
              <p className="text-sm text-stone-500 mt-1">Termasuk pajak.</p>
            </div>

            <p className="text-stone-600 leading-relaxed mb-6">
              {description}
            </p>

            {/* Availability Indicator */}
            <div className="flex items-center gap-2 mb-8">
              <span className={`w-3 h-3 rounded-full ${isOutOfStock ? 'bg-stone-300' : 'bg-green-500'}`}></span>
              <span className="text-stone-500 text-sm">{isOutOfStock ? 'Terjual habis' : 'Tersedia'}</span>
            </div>

            {/* Add to Cart Controls */}
            <div className="flex flex-col sm:flex-row gap-4 mb-8">
              <div className="flex items-center justify-between border border-stone-200 rounded-full w-full sm:w-32 h-14 px-4 bg-white">
                <button 
                  onClick={() => setQuantity(Math.max(1, quantity - 1))}
                  className="text-stone-400 hover:text-stone-900 transition-colors"
                  disabled={isOutOfStock}
                >
                  <Minus size={18} />
                </button>
                <span className="font-medium">{quantity}</span>
                <button 
                  onClick={() => setQuantity(quantity + 1)}
                  className="text-stone-400 hover:text-stone-900 transition-colors"
                  disabled={isOutOfStock}
                >
                  <Plus size={18} />
                </button>
              </div>
              <button 
                onClick={handleBuyNow}
                className={`flex-1 h-14 rounded-full font-bold tracking-widest uppercase transition-colors ${
                  isOutOfStock 
                    ? 'bg-stone-100 text-stone-400 cursor-not-allowed' 
                    : 'bg-stone-900 text-white hover:bg-stone-800'
                }`}
                disabled={isOutOfStock}
              >
                {isOutOfStock ? 'Terjual Habis' : 'Beli Sekarang'}
              </button>
            </div>

            {/* Feature Icons */}
            <div className="grid grid-cols-2 gap-y-4 gap-x-2 text-sm text-stone-600 mb-10">
              <div className="flex items-center gap-2">
                <Leaf size={16} className="text-stone-800" />
                <span>100% Organik</span>
              </div>
              <div className="flex items-center gap-2">
                <ShieldCheck size={16} className="text-stone-800" />
                <span>Tanpa Pestisida</span>
              </div>
              <div className="flex items-center gap-2">
                <MapPin size={16} className="text-stone-800" />
                <span>Produksi Desa Sukorejo</span>
              </div>
              <div className="flex items-center gap-2">
                <Recycle size={16} className="text-stone-800" />
                <span>Kemasan Ramah Lingkungan</span>
              </div>
            </div>

            {/* Accordions */}
            <div className="border-t border-stone-200">
              {/* Description */}
              <div className="border-b border-stone-200">
                <button 
                  onClick={() => toggleSection('description')}
                  className="w-full py-5 flex justify-between items-center font-bold text-stone-900 uppercase tracking-widest text-sm"
                >
                  DESKRIPSI
                  {openSections.description ? <Minus size={18} /> : <Plus size={18} />}
                </button>
                {openSections.description && (
                  <div className="pb-6 text-stone-600 text-sm leading-relaxed">
                    {description}
                  </div>
                )}
              </div>

              {/* Specifications */}
              <div className="border-b border-stone-200">
                <button 
                  onClick={() => toggleSection('specs')}
                  className="w-full py-5 flex justify-between items-center font-bold text-stone-900 uppercase tracking-widest text-sm"
                >
                  TENTANG PRODUK INI
                  {openSections.specs ? <Minus size={18} /> : <Plus size={18} />}
                </button>
                {openSections.specs && (
                  <div className="pb-6 text-stone-600 text-sm leading-relaxed space-y-2">
                    <p><strong>Kategori:</strong> {product.Kategori}</p>
                    <p><strong>Berat Bersih:</strong> {product.Berat_Gram} gram</p>
                    <p><strong>Status Ketersediaan:</strong> {product.Status}</p>
                    <p><strong>Metode Tanam:</strong> BUMDes Standard Organik</p>
                  </div>
                )}
              </div>

              {/* Shipping */}
              <div className="border-b border-stone-200">
                <button 
                  onClick={() => toggleSection('shipping')}
                  className="w-full py-5 flex justify-between items-center font-bold text-stone-900 uppercase tracking-widest text-sm"
                >
                  PENGIRIMAN & KEMASAN
                  {openSections.shipping ? <Minus size={18} /> : <Plus size={18} />}
                </button>
                {openSections.shipping && (
                  <div className="pb-6 text-stone-600 text-sm leading-relaxed">
                    Dikemas dengan aman menggunakan bahan ramah lingkungan. Pesanan sebelum pukul 14:00 akan dikirim pada hari yang sama. Kami melayani pengiriman ke seluruh Indonesia dan mancanegara (khusus produk berlabel Ekspor).
                  </div>
                )}
              </div>
            </div>

            {/* Bottom Actions */}
            <div className="flex gap-6 mt-8">
              <button className="flex items-center gap-2 text-sm font-medium text-stone-600 hover:text-stone-900 transition-colors">
                <Share2 size={16} />
                Bagikan
              </button>
              <button className="flex items-center gap-2 text-sm font-medium text-stone-600 hover:text-stone-900 transition-colors">
                <HelpCircle size={16} />
                Ajukan Pertanyaan
              </button>
            </div>

          </div>
        </div>
      </div>
    </div>
  );
};

export default ProductDetail;
