import React, { useState, useEffect } from 'react';
import { Routes, Route } from 'react-router-dom';
import Navbar from './components/Navbar';
import CartSidebar from './components/CartSidebar';
import CheckoutForm from './components/CheckoutForm';
import Home from './pages/Home';
import Catalog from './pages/Catalog';
import Footer from './components/Footer';
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

  // Filtering logic is moved to Catalog.jsx, but we keep state here so it persists across navigation

  return (
    <div className="min-h-screen flex flex-col bg-stone-50">
      <Navbar onCartClick={() => setIsCartOpen(true)} />
      
      <main className="flex-grow">
        <Routes>
          <Route path="/" element={<Home products={products} loading={loading} />} />
          <Route path="/katalog" element={
            <Catalog 
              products={products} 
              loading={loading}
              searchQuery={searchQuery}
              setSearchQuery={setSearchQuery}
            />
          } />
        </Routes>
      </main>

      <Footer />

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
