import React, { useState } from 'react';
import { X, Send } from 'lucide-react';
import { useLanguage } from '../context/LanguageContext';
import { useCart } from '../context/CartContext';
import { submitOrder } from '../services/api';
import { generateWhatsAppLink } from '../utils/whatsapp';

const CheckoutForm = ({ isOpen, onClose }) => {
  const { t, lang } = useLanguage();
  const { cartItems, cartTotal, clearCart } = useCart();
  
  const [formData, setFormData] = useState({
    name: '',
    email: '',
    phone: '',
    country: '',
    address: '',
    notes: ''
  });
  const [isSubmitting, setIsSubmitting] = useState(false);

  if (!isOpen) return null;

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
      
      // 3. Clear cart and close form
      clearCart();
      onClose();

      // 4. Redirect to WA
      window.open(waLink, '_blank');
    } catch (error) {
      console.error("Submission failed", error);
      alert("Terjadi kesalahan. Silakan coba lagi.");
    } finally {
      setIsSubmitting(false);
    }
  };

  return (
    <>
      <div 
        className="fixed inset-0 bg-stone-900/50 backdrop-blur-sm z-50 transition-opacity"
        onClick={onClose}
      />
      
      <div className="fixed inset-0 flex items-center justify-center z-50 p-4">
        <div className="bg-white rounded-3xl shadow-2xl w-full max-w-lg overflow-hidden flex flex-col max-h-full">
          
          <div className="flex items-center justify-between p-6 border-b border-stone-100 bg-white">
            <h2 className="text-xl font-heading font-bold text-stone-900">
              {t('checkout')}
            </h2>
            <button 
              onClick={onClose}
              className="p-2 hover:bg-stone-100 rounded-full transition-colors text-stone-500 hover:text-stone-900"
            >
              <X size={20} />
            </button>
          </div>

          <div className="overflow-y-auto p-6">
            <form id="checkout-form" onSubmit={handleSubmit} className="space-y-4">
              
              <div>
                <label className="block text-sm font-medium text-stone-700 mb-1">{t('name')} *</label>
                <input 
                  type="text" 
                  name="name"
                  required
                  value={formData.name}
                  onChange={handleChange}
                  className="w-full px-4 py-2 border border-stone-300 rounded-xl focus:ring-2 focus:ring-stone-900 focus:border-transparent outline-none transition-all bg-stone-50 focus:bg-white"
                />
              </div>

              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <div>
                  <label className="block text-sm font-medium text-stone-700 mb-1">{t('phone')} *</label>
                  <input 
                    type="tel" 
                    name="phone"
                    required
                    placeholder="+62..."
                    value={formData.phone}
                    onChange={handleChange}
                    className="w-full px-4 py-2 border border-stone-300 rounded-xl focus:ring-2 focus:ring-stone-900 focus:border-transparent outline-none transition-all bg-stone-50 focus:bg-white"
                  />
                </div>
                <div>
                  <label className="block text-sm font-medium text-stone-700 mb-1">{t('email')}</label>
                  <input 
                    type="email" 
                    name="email"
                    value={formData.email}
                    onChange={handleChange}
                    className="w-full px-4 py-2 border border-stone-300 rounded-xl focus:ring-2 focus:ring-stone-900 focus:border-transparent outline-none transition-all bg-stone-50 focus:bg-white"
                  />
                </div>
              </div>

              <div>
                <label className="block text-sm font-medium text-stone-700 mb-1">{t('country')} *</label>
                <input 
                  type="text" 
                  name="country"
                  required
                  value={formData.country}
                  onChange={handleChange}
                  className="w-full px-4 py-2 border border-stone-300 rounded-xl focus:ring-2 focus:ring-stone-900 focus:border-transparent outline-none transition-all bg-stone-50 focus:bg-white"
                />
              </div>

              <div>
                <label className="block text-sm font-medium text-stone-700 mb-1">{t('address')} *</label>
                <textarea 
                  name="address"
                  required
                  rows="3"
                  value={formData.address}
                  onChange={handleChange}
                  className="w-full px-4 py-2 border border-stone-300 rounded-xl focus:ring-2 focus:ring-stone-900 focus:border-transparent outline-none transition-all bg-stone-50 focus:bg-white resize-none"
                ></textarea>
              </div>

              <div>
                <label className="block text-sm font-medium text-stone-700 mb-1">{t('notes')}</label>
                <textarea 
                  name="notes"
                  rows="2"
                  value={formData.notes}
                  onChange={handleChange}
                  className="w-full px-4 py-2 border border-stone-300 rounded-xl focus:ring-2 focus:ring-stone-900 focus:border-transparent outline-none transition-all bg-stone-50 focus:bg-white resize-none"
                ></textarea>
              </div>

            </form>
          </div>

          <div className="p-6 border-t border-stone-100 bg-stone-50">
            <button 
              type="submit"
              form="checkout-form"
              disabled={isSubmitting}
              className="w-full py-4 px-6 bg-stone-900 text-white rounded-full font-bold text-lg hover:bg-stone-800 hover:shadow-lg transition-all flex items-center justify-center space-x-2 disabled:bg-stone-400"
            >
              <span>{isSubmitting ? 'Memproses...' : t('sendOrder')}</span>
              {!isSubmitting && <Send size={20} />}
            </button>
          </div>

        </div>
      </div>
    </>
  );
};

export default CheckoutForm;
