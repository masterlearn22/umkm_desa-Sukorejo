import React, { useState } from 'react';
import { useNavigate, Link } from 'react-router-dom';
import { useLanguage } from '../context/LanguageContext';
import { useCart } from '../context/CartContext';
import { submitOrder } from '../services/api';
import { generateWhatsAppLink } from '../utils/whatsapp';
import { Send, ArrowLeft } from 'lucide-react';

const Payment = () => {
  const { t, lang } = useLanguage();
  const { cartItems, cartTotal, clearCart } = useCart();
  const navigate = useNavigate();
  
  const [formData, setFormData] = useState({
    name: '',
    email: '',
    phone: '',
    country: '',
    address: '',
    notes: ''
  });
  const [isSubmitting, setIsSubmitting] = useState(false);

  // Redirect if cart is empty
  if (cartItems.length === 0) {
    return (
      <div className="min-h-[70vh] flex flex-col items-center justify-center bg-stone-50 px-4">
        <h2 className="text-2xl font-bold font-heading uppercase tracking-widest text-stone-900 mb-4">
          Keranjang Kosong
        </h2>
        <p className="text-stone-500 mb-8">Belum ada produk untuk dibayar.</p>
        <Link 
          to="/katalog" 
          className="bg-stone-900 text-white px-8 py-4 rounded-full font-bold uppercase tracking-widest text-sm hover:bg-stone-800 transition-colors"
        >
          Kembali Belanja
        </Link>
      </div>
    );
  }

  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData(prev => ({ ...prev, [name]: value }));
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setIsSubmitting(true);

    const orderId = `ORD-${Math.floor(1000 + Math.random() * 9000)}`;
    const fullOrderData = { ...formData, orderId, totalPrice: cartTotal };

    try {
      // 1. Submit to GAS
      await submitOrder(fullOrderData, cartItems);
      
      // 2. Generate WA Link
      const waLink = generateWhatsAppLink(fullOrderData, cartItems, cartTotal, lang);
      
      // 3. Clear cart
      clearCart();

      // 4. Redirect to WA and go back home
      window.open(waLink, '_blank');
      navigate('/');
    } catch (error) {
      console.error("Submission failed", error);
      alert("Terjadi kesalahan. Silakan coba lagi.");
    } finally {
      setIsSubmitting(false);
    }
  };

  const formatPrice = (price) => {
    return new Intl.NumberFormat('id-ID', {
      style: 'currency',
      currency: 'IDR',
      minimumFractionDigits: 0
    }).format(price);
  };

  return (
    <div className="bg-stone-50 min-h-screen pb-20">
      {/* Simple Header */}
      <div className="bg-white border-b border-stone-200">
        <div className="max-w-screen-xl mx-auto px-4 sm:px-6 lg:px-8 py-6">
          <Link to="/katalog" className="inline-flex items-center gap-2 text-stone-500 hover:text-stone-900 transition-colors text-sm font-bold uppercase tracking-widest">
            <ArrowLeft size={16} />
            Kembali
          </Link>
          <h1 className="text-3xl mt-4 font-heading font-black text-stone-900 uppercase tracking-widest">
            {t('checkout') || 'Pembayaran'}
          </h1>
        </div>
      </div>

      <div className="max-w-screen-xl mx-auto px-4 sm:px-6 lg:px-8 py-12">
        <div className="flex flex-col-reverse lg:flex-row gap-12 lg:gap-24">
          
          {/* Left Column: Form */}
          <div className="w-full lg:w-3/5">
            <div className="bg-white p-8 rounded-3xl shadow-sm border border-stone-200">
              <h2 className="text-xl font-bold font-heading text-stone-900 mb-8 uppercase tracking-widest border-b border-stone-100 pb-4">
                Informasi Pengiriman
              </h2>
              
              <form id="checkout-form" onSubmit={handleSubmit} className="space-y-6">
                <div>
                  <label className="block text-xs font-bold uppercase tracking-widest text-stone-700 mb-2">{t('name')} *</label>
                  <input 
                    type="text" 
                    name="name"
                    required
                    value={formData.name}
                    onChange={handleChange}
                    className="w-full px-5 py-4 bg-stone-50 border border-stone-200 rounded-xl focus:ring-2 focus:ring-stone-900 focus:border-transparent outline-none transition-all focus:bg-white text-stone-900"
                  />
                </div>

                <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                  <div>
                    <label className="block text-xs font-bold uppercase tracking-widest text-stone-700 mb-2">{t('phone')} *</label>
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
                    <label className="block text-xs font-bold uppercase tracking-widest text-stone-700 mb-2">{t('email')}</label>
                    <input 
                      type="email" 
                      name="email"
                      value={formData.email}
                      onChange={handleChange}
                      className="w-full px-5 py-4 bg-stone-50 border border-stone-200 rounded-xl focus:ring-2 focus:ring-stone-900 focus:border-transparent outline-none transition-all focus:bg-white text-stone-900"
                    />
                  </div>
                </div>

                <div>
                  <label className="block text-xs font-bold uppercase tracking-widest text-stone-700 mb-2">{t('country')} *</label>
                  <input 
                    type="text" 
                    name="country"
                    required
                    value={formData.country}
                    onChange={handleChange}
                    className="w-full px-5 py-4 bg-stone-50 border border-stone-200 rounded-xl focus:ring-2 focus:ring-stone-900 focus:border-transparent outline-none transition-all focus:bg-white text-stone-900"
                  />
                </div>

                <div>
                  <label className="block text-xs font-bold uppercase tracking-widest text-stone-700 mb-2">{t('address')} *</label>
                  <textarea 
                    name="address"
                    required
                    rows="4"
                    value={formData.address}
                    onChange={handleChange}
                    className="w-full px-5 py-4 bg-stone-50 border border-stone-200 rounded-xl focus:ring-2 focus:ring-stone-900 focus:border-transparent outline-none transition-all focus:bg-white text-stone-900 resize-none"
                  ></textarea>
                </div>

                <div>
                  <label className="block text-xs font-bold uppercase tracking-widest text-stone-700 mb-2">{t('notes')}</label>
                  <textarea 
                    name="notes"
                    rows="2"
                    value={formData.notes}
                    onChange={handleChange}
                    className="w-full px-5 py-4 bg-stone-50 border border-stone-200 rounded-xl focus:ring-2 focus:ring-stone-900 focus:border-transparent outline-none transition-all focus:bg-white text-stone-900 resize-none"
                  ></textarea>
                </div>
              </form>
            </div>
          </div>

          {/* Right Column: Order Summary */}
          <div className="w-full lg:w-2/5">
            <div className="bg-[#f4f2ec] p-8 rounded-3xl sticky top-28">
              <h2 className="text-xl font-bold font-heading text-stone-900 mb-8 uppercase tracking-widest border-b border-stone-300 pb-4">
                Ringkasan Pesanan
              </h2>

              <div className="space-y-6 max-h-96 overflow-y-auto custom-scrollbar pr-2 mb-6 border-b border-stone-300 pb-6">
                {cartItems.map((item) => (
                  <div key={item.ID_Produk} className="flex gap-4">
                    <div className="w-20 h-20 bg-white rounded-xl overflow-hidden shrink-0 relative border border-stone-200">
                      {item.Foto_URL ? (
                        <img src={item.Foto_URL} alt="Product" className="w-full h-full object-cover" />
                      ) : (
                        <div className="w-full h-full bg-stone-100 flex items-center justify-center text-[10px] text-stone-400">No Img</div>
                      )}
                      <span className="absolute -top-2 -right-2 bg-stone-900 text-white w-5 h-5 rounded-full flex items-center justify-center text-[10px] font-bold">
                        {item.quantity}
                      </span>
                    </div>
                    <div className="flex-1 flex flex-col justify-center">
                      <h4 className="text-sm font-bold text-stone-900 line-clamp-2 uppercase">
                        {lang === 'en' && item.Nama_Eng ? item.Nama_Eng : item.Nama_Indo}
                      </h4>
                      <p className="text-xs text-stone-500 mt-1">{item.Kategori}</p>
                      <p className="text-sm font-bold text-stone-900 mt-1">{formatPrice(item.Harga_Rp * item.quantity)}</p>
                    </div>
                  </div>
                ))}
              </div>

              <div className="space-y-3 text-sm mb-6">
                <div className="flex justify-between text-stone-600">
                  <span>Subtotal</span>
                  <span>{formatPrice(cartTotal)}</span>
                </div>
                <div className="flex justify-between text-stone-600">
                  <span>Pengiriman</span>
                  <span>Dihitung via WA</span>
                </div>
              </div>

              <div className="flex justify-between items-center text-xl font-bold text-stone-900 mb-8 border-t border-stone-300 pt-6">
                <span>Total</span>
                <span>{formatPrice(cartTotal)}</span>
              </div>

              <button 
                type="submit"
                form="checkout-form"
                disabled={isSubmitting}
                className="w-full py-4 px-6 bg-stone-900 text-white rounded-full font-bold uppercase tracking-widest text-sm hover:bg-stone-800 hover:shadow-lg transition-all flex items-center justify-center gap-3 disabled:bg-stone-400"
              >
                {isSubmitting ? 'Memproses...' : t('sendOrder')}
                {!isSubmitting && <Send size={18} />}
              </button>
              
              <p className="text-[10px] text-center text-stone-500 mt-4 leading-relaxed px-4">
                Pembayaran dilakukan melalui transfer bank atau e-wallet setelah mengkonfirmasi ongkos kirim melalui admin WhatsApp BUMDes.
              </p>
            </div>
          </div>

        </div>
      </div>
    </div>
  );
};

export default Payment;
