import React, { useState, useEffect } from 'react';
import Navbar from './components/Navbar';
import Hero from './components/Hero';
import FilterBar from './components/FilterBar';
import ProductList from './components/ProductList';
import CartSidebar from './components/CartSidebar';
import CheckoutForm from './components/CheckoutForm';
import { fetchProducts } from './services/api';
import { useLanguage } from './context/LanguageContext';

const App = () => {
  const { lang } = useLanguage();
  const [products, setProducts] = useState([]);
  const [loading, setLoading] = useState(true);
  const [activeCategory, setActiveCategory] = useState('All');
  const [searchQuery, setSearchQuery] = useState('');
  
  const [isCartOpen, setIsCartOpen] = useState(false);
  const [isCheckoutOpen, setIsCheckoutOpen] = useState(false);

  const categories = [
    { id: 'All', labelKey: 'filterAll' },
    { id: 'Fresh', labelKey: 'filterFresh' },
    { id: 'Processed', labelKey: 'filterProcessed' },
    { id: 'Craft', labelKey: 'filterCraft' },
  ];

  useEffect(() => {
    const loadProducts = async () => {
      setLoading(true);
      try {
        const data = await fetchProducts();
        setProducts(data);
      } catch (error) {
        console.error("Failed to load products:", error);
      } finally {
        setLoading(false);
      }
    };
    loadProducts();
  }, []);

  const filteredProducts = products.filter(product => {
    const matchesCategory = activeCategory === 'All' || product.Kategori === activeCategory;
    
    const searchTarget = lang === 'en' 
      ? (product.Nama_Eng || product.Nama_Indo).toLowerCase()
      : product.Nama_Indo.toLowerCase();
      
    const matchesSearch = searchTarget.includes(searchQuery.toLowerCase());
    
    return matchesCategory && matchesSearch;
  });

  return (
    <div className="min-h-screen flex flex-col bg-eco-cream">
      <Navbar onCartClick={() => setIsCartOpen(true)} />
      
      <main className="flex-grow">
        <Hero />
        
        <div id="katalog" className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-16">
          <FilterBar 
            categories={categories}
            activeCategory={activeCategory}
            onCategoryChange={setActiveCategory}
            searchQuery={searchQuery}
            onSearchChange={setSearchQuery}
          />
          
          <ProductList products={filteredProducts} loading={loading} />
        </div>
      </main>

      <footer className="bg-agro-green text-stone-300 py-8 text-center mt-auto">
        <div className="max-w-7xl mx-auto px-4">
          <p className="mb-2">&copy; {new Date().getFullYear()} BUMDes Sukorejo. All rights reserved.</p>
          <p className="text-sm opacity-75">Platform Digital Katalog & WA Order UMKM Desa Sukorejo</p>
        </div>
      </footer>

      <CartSidebar 
        isOpen={isCartOpen} 
        onClose={() => setIsCartOpen(false)} 
        onCheckout={() => setIsCheckoutOpen(true)}
      />

      <CheckoutForm 
        isOpen={isCheckoutOpen}
        onClose={() => setIsCheckoutOpen(false)}
      />
    </div>
  );
};

export default App;
