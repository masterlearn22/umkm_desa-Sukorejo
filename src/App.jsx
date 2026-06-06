import React, { useState, useEffect } from 'react';
import { Routes, Route } from 'react-router-dom';
import Navbar from './components/Navbar';
import CartSidebar from './components/CartSidebar';
import Home from './pages/Home';
import Catalog from './pages/Catalog';
import ProductDetail from './pages/ProductDetail';
import AboutUs from './pages/AboutUs';
import Payment from './pages/Payment';
import { Login } from './pages/Login';
import { Register } from './pages/Register';
import { Profile } from './pages/Profile';
import DashboardLayout from './pages/dashboard/DashboardLayout';
import ManageProducts from './pages/dashboard/ManageProducts';
import ManageOrders from './pages/dashboard/ManageOrders';
import ManageUsers from './pages/dashboard/ManageUsers';
import ProtectedRoute from './components/ProtectedRoute';
import Footer from './components/Footer';
import { fetchProducts } from './services/api';
import { useLanguage } from './context/LanguageContext';
import { AuthProvider } from './context/AuthContext';

const App = () => {
  const { lang } = useLanguage();
  const [products, setProducts] = useState([]);
  const [loading, setLoading] = useState(true);
  const [searchQuery, setSearchQuery] = useState('');
  
  const [isCartOpen, setIsCartOpen] = useState(false);

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

  return (
    <AuthProvider>
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
            <Route path="/produk/:id" element={<ProductDetail products={products} />} />
            <Route path="/tentang-kami" element={<AboutUs />} />
            <Route path="/payment" element={<Payment />} />
            <Route path="/login" element={<Login />} />
            <Route path="/register" element={<Register />} />
            <Route path="/profile" element={
              <ProtectedRoute>
                <Profile />
              </ProtectedRoute>
            } />

            {/* Dashboard Routes */}
            <Route path="/dashboard" element={
              <ProtectedRoute>
                <DashboardLayout />
              </ProtectedRoute>
            }>
              {/* Default dashboard path redirects to products or orders depending on permission, but for simplicity let's default to orders if possible, or just a placeholder. Let's default to products. */}
              <Route path="products" element={
                <ProtectedRoute requiredPermission="ManageProducts">
                  <ManageProducts />
                </ProtectedRoute>
              } />
              <Route path="orders" element={
                <ProtectedRoute requiredPermission="ManageOrders">
                  <ManageOrders />
                </ProtectedRoute>
              } />
              <Route path="users" element={
                <ProtectedRoute requiredPermission="ManageUsers">
                  <ManageUsers />
                </ProtectedRoute>
              } />
            </Route>

          </Routes>
        </main>

        <Footer />

        <CartSidebar 
          isOpen={isCartOpen} 
          onClose={() => setIsCartOpen(false)} 
        />
      </div>
    </AuthProvider>
  );
};

export default App;
