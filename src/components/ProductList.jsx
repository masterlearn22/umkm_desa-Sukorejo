import React from 'react';
import ProductCard from './ProductCard';

const ProductList = ({ products, loading }) => {
  if (loading) {
    return (
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-10">
        {[1, 2, 3, 4, 5, 6].map(i => (
          <div key={i} className="bg-white rounded-3xl overflow-hidden shadow-sm border border-stone-100 animate-pulse">
            <div className="h-64 bg-stone-200"></div>
            <div className="p-6">
              <div className="h-6 bg-stone-200 rounded w-3/4 mb-4"></div>
              <div className="h-4 bg-stone-200 rounded w-full mb-2"></div>
              <div className="h-4 bg-stone-200 rounded w-5/6 mb-6"></div>
              <div className="h-8 bg-stone-200 rounded w-1/3"></div>
            </div>
          </div>
        ))}
      </div>
    );
  }

  if (!products || products.length === 0) {
    return (
      <div className="text-center py-20 bg-white rounded-3xl border border-stone-100">
        <p className="text-stone-500 text-lg">Tidak ada produk yang ditemukan.</p>
      </div>
    );
  }

  return (
    <div className="grid grid-cols-1 lg:grid-cols-2 gap-10">
      {products.map(product => (
        <ProductCard key={product.ID_Produk} product={product} />
      ))}
    </div>
  );
};

export default ProductList;
