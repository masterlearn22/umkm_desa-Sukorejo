import React, { createContext, useState, useContext } from 'react';

const LanguageContext = createContext();

export const translations = {
  id: {
    heroTitle: "Katalog Digital BUMDes Sukorejo",
    heroDesc: "Menghadirkan produk unggulan buah naga segar dan olahan berkualitas dari Desa Sukorejo ke seluruh dunia.",
    searchPlaceholder: "Cari produk...",
    filterAll: "Semua",
    filterFresh: "Buah Segar",
    filterProcessed: "Makanan Olahan",
    filterCraft: "Kraf & Lainnya",
    addToCart: "Tambah ke Keranjang",
    cartTitle: "Keranjang Belanja",
    checkout: "Lanjut Checkout",
    totalEstimates: "Total Estimasi",
    weight: "Berat",
    emptyCart: "Keranjang masih kosong.",
    // Checkout form
    name: "Nama Lengkap",
    email: "Email",
    phone: "Nomor WhatsApp",
    country: "Negara Tujuan",
    address: "Alamat Lengkap",
    notes: "Catatan Tambahan",
    sendOrder: "Kirim Pesanan",
    // Badges
    ready: "Ready",
    bestSeller: "Produk Unggulan",
    exportReady: "Ekspor Ready",
    outOfStock: "Stok Habis"
  },
  en: {
    heroTitle: "Sukorejo BUMDes Digital Catalog",
    heroDesc: "Bringing premium fresh dragon fruit and high-quality processed products from Sukorejo Village to the world.",
    searchPlaceholder: "Search products...",
    filterAll: "All",
    filterFresh: "Fresh Fruit",
    filterProcessed: "Processed Food",
    filterCraft: "Crafts & Others",
    addToCart: "Add to Cart",
    cartTitle: "Shopping Cart",
    checkout: "Proceed to Checkout",
    totalEstimates: "Total Estimates",
    weight: "Weight",
    emptyCart: "Your cart is empty.",
    // Checkout form
    name: "Full Name",
    email: "Email",
    phone: "WhatsApp Number",
    country: "Destination Country",
    address: "Full Address",
    notes: "Additional Notes",
    sendOrder: "Send Order",
    // Badges
    ready: "Ready",
    bestSeller: "Best Seller",
    exportReady: "Export Ready",
    outOfStock: "Out of Stock"
  }
};

export const LanguageProvider = ({ children }) => {
  const [lang, setLang] = useState('id'); // default id

  const toggleLanguage = () => {
    setLang(prev => prev === 'id' ? 'en' : 'id');
  };

  const t = (key) => {
    return translations[lang][key] || key;
  };

  return (
    <LanguageContext.Provider value={{ lang, toggleLanguage, t }}>
      {children}
    </LanguageContext.Provider>
  );
};

export const useLanguage = () => useContext(LanguageContext);
