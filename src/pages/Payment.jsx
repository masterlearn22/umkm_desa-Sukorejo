import React, { useState, useEffect } from 'react';
import { useNavigate, Link, useLocation } from 'react-router-dom';
import { useLanguage } from '../context/LanguageContext';
import { useCart } from '../context/CartContext';
import { useAuth } from '../context/AuthContext';
import { submitOrder } from '../services/api';
import { generateWhatsAppLink } from '../utils/whatsapp';
import { Send, ArrowLeft, Truck, CreditCard, MapPin, AlertTriangle } from 'lucide-react';
import { resolveImageUrl } from '../utils/image';

const Payment = () => {
  const { t, lang } = useLanguage();
  const { cartItems, cartTotal, clearCart } = useCart();
  const { user, isLoggedIn } = useAuth();
  const navigate = useNavigate();
  const location = useLocation();
  
  const [formData, setFormData] = useState({
    notes: '',
    courier: 'Antar Langsung (Khusus Desa)',
    paymentMethod: 'COD (Bayar di Tempat)'
  });
  const [isSubmitting, setIsSubmitting] = useState(false);

  // Require Login
  useEffect(() => {
    if (!isLoggedIn) {
      // Pass the current location so login can redirect back
      navigate('/login', { state: { from: location }, replace: true });
    }
  }, [isLoggedIn, navigate, location]);

  if (!isLoggedIn || !user) return null; // Wait for redirect

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
    
    // Combine user details with form data
    const fullOrderData = { 
      name: user.name,
      email: user.email,
      phone: user.phone,
      address: user.address,
      country: 'Indonesia', // default
      notes: formData.notes,
      courier: formData.courier,
      paymentMethod: formData.paymentMethod,
      orderId, 
      totalPrice: cartTotal 
    };

    try {
      // 1. Submit to GAS
      await submitOrder(fullOrderData, cartItems);
      
      // 2. Generate WA Link
      const waLink = generateWhatsAppLink(fullOrderData, cartItems, cartTotal, lang);
      
      // 3. Clear cart
      clearCart();

      // 4. Redirect to WA
      window.location.href = waLink;
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
          <div className="w-full lg:w-3/5 space-y-8">
            
            {/* Address Confirmation Box */}
            <div className="bg-white p-6 rounded-3xl shadow-sm border border-stone-200">
              <div className="flex justify-between items-start mb-4 border-b border-stone-100 pb-4">
                <h2 className="text-lg font-bold font-heading text-stone-900 uppercase tracking-widest flex items-center gap-2">
                  <MapPin size={20} /> Alamat Pengiriman
                </h2>
                <Link to="/profile" className="text-xs font-bold text-stone-500 hover:text-stone-900 underline uppercase">Ubah</Link>
              </div>
              <div>
                <p className="font-bold text-stone-900">{user.name} <span className="text-stone-500 font-normal">({user.phone})</span></p>
                <p className="text-sm text-stone-600 mt-2">{user.address || 'Alamat belum diisi. Mohon lengkapi profil Anda.'}</p>
              </div>
            </div>

            {/* Address Warning Banner */}
            {!user.address && (
              <div className="bg-red-50 border border-red-200 rounded-3xl p-6 flex flex-col items-center text-center">
                <AlertTriangle size={32} className="text-red-500 mb-3" />
                <h3 className="text-lg font-bold font-heading text-red-900 uppercase tracking-widest mb-2">Alamat Belum Diisi</h3>
                <p className="text-red-700 text-sm mb-4 max-w-md">
                  Anda harus mengisi alamat pengiriman di profil Anda sebelum dapat melanjutkan pembayaran.
                </p>
                <Link 
                  to="/profile" 
                  className="bg-red-600 text-white px-6 py-3 rounded-full font-bold uppercase tracking-widest text-xs hover:bg-red-700 transition-colors"
                >
                  Isi Alamat Sekarang
                </Link>
              </div>
            )}

            <form id="checkout-form" onSubmit={handleSubmit} className="space-y-8">
              
              {/* Courier Selection */}
              <div className="bg-white p-6 rounded-3xl shadow-sm border border-stone-200">
                <h2 className="text-lg font-bold font-heading text-stone-900 uppercase tracking-widest flex items-center gap-2 border-b border-stone-100 pb-4 mb-4">
                  <Truck size={20} /> Jasa Pengiriman
                </h2>
                <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                  {['Antar Langsung (Khusus Desa)', 'Ambil di Tempat'].map((courierOption) => (
                    <label key={courierOption} className={`relative flex cursor-pointer rounded-xl border p-4 transition-all ${formData.courier === courierOption ? 'border-stone-900 bg-stone-50' : 'border-stone-200 bg-white hover:border-stone-300'}`}>
                      <input 
                        type="radio" 
                        name="courier" 
                        value={courierOption}
                        checked={formData.courier === courierOption}
                        onChange={handleChange}
                        className="sr-only" 
                      />
                      <div className="flex flex-col">
                        <span className="text-sm font-bold text-stone-900">{courierOption}</span>
                        {courierOption.includes('Desa') && <span className="text-xs text-stone-500 mt-1">Ongkir Rp0</span>}
                      </div>
                      {formData.courier === courierOption && (
                        <div className="absolute right-4 top-1/2 -translate-y-1/2 w-4 h-4 rounded-full border-[5px] border-stone-900"></div>
                      )}
                    </label>
                  ))}
                </div>
              </div>

              {/* Payment Method */}
              <div className="bg-white p-6 rounded-3xl shadow-sm border border-stone-200">
                <h2 className="text-lg font-bold font-heading text-stone-900 uppercase tracking-widest flex items-center gap-2 border-b border-stone-100 pb-4 mb-4">
                  <CreditCard size={20} /> Metode Pembayaran
                </h2>
                <div className="grid grid-cols-1 gap-4">
                  {['COD (Bayar di Tempat)'].map((methodOption) => (
                    <label key={methodOption} className={`relative flex cursor-pointer rounded-xl border p-4 transition-all ${formData.paymentMethod === methodOption ? 'border-stone-900 bg-stone-50' : 'border-stone-200 bg-white hover:border-stone-300'}`}>
                      <input 
                        type="radio" 
                        name="paymentMethod" 
                        value={methodOption}
                        checked={formData.paymentMethod === methodOption}
                        onChange={handleChange}
                        className="sr-only" 
                      />
                      <span className="text-sm font-bold text-stone-900 text-center w-full">{methodOption}</span>
                    </label>
                  ))}
                </div>
              </div>

              <div className="bg-white p-6 rounded-3xl shadow-sm border border-stone-200">
                <label className="block text-xs font-bold uppercase tracking-widest text-stone-700 mb-2">Catatan Tambahan (Opsional)</label>
                <textarea 
                  name="notes"
                  rows="2"
                  value={formData.notes}
                  onChange={handleChange}
                  placeholder="Titipkan di pos satpam..."
                  className="w-full px-5 py-4 bg-stone-50 border border-stone-200 rounded-xl focus:ring-2 focus:ring-stone-900 focus:border-transparent outline-none transition-all focus:bg-white text-stone-900 resize-none"
                ></textarea>
              </div>

            </form>
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
                        <img src={resolveImageUrl(item.Foto_URL)} alt={item.Nama_Indo} className="w-full h-full object-cover" />
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
                  <span>Pengiriman ({formData.courier})</span>
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
                disabled={isSubmitting || !user.address}
                className="w-full py-4 px-6 bg-stone-900 text-white rounded-full font-bold uppercase tracking-widest text-sm hover:bg-stone-800 hover:shadow-lg transition-all flex items-center justify-center gap-3 disabled:bg-stone-400 disabled:cursor-not-allowed"
              >
                {isSubmitting ? 'Memproses...' : (!user.address ? 'Lengkapi Alamat Dulu' : 'Pesan via WhatsApp')}
                {!isSubmitting && user.address && <Send size={18} />}
              </button>
              
              <p className="text-[10px] text-center text-stone-500 mt-4 leading-relaxed px-4">
                Pesanan Anda akan diteruskan ke penjual produk pertama di keranjang ini melalui WhatsApp.
              </p>
            </div>
          </div>

        </div>
      </div>
    </div>
  );
};

export default Payment;
