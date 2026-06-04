// This URL should be replaced with the actual Google Apps Script Web App URL
const GAS_URL = 'https://script.google.com/macros/s/AKfycbwXXX_YOUR_GAS_ID_XXX/exec';

// Since we might not have GAS deployed yet, we use mock data if fetch fails
const mockProducts = [
  {
    ID_Produk: 'P001',
    Nama_Indo: 'Buah Naga Merah Super',
    Nama_Eng: 'Premium Red Dragon Fruit',
    Kategori: 'Fresh',
    Harga_Rp: 15000,
    Berat_Gram: 1000,
    Foto_URL: 'https://images.unsplash.com/photo-1527325678964-54921661f888?ixlib=rb-1.2.1&auto=format&fit=crop&w=800&q=80',
    Status: 'Ready',
    Deskripsi_Indo: 'Buah naga segar langsung dipetik dari kebun organik Desa Sukorejo. Kaya akan antioksidan dan vitamin.',
    Deskripsi_Eng: 'Fresh dragon fruit picked directly from organic farms in Sukorejo Village. Rich in antioxidants and vitamins.'
  },
  {
    ID_Produk: 'P002',
    Nama_Indo: 'Selai Buah Naga Sukorejo',
    Nama_Eng: 'Sukorejo Dragon Fruit Jam',
    Kategori: 'Processed',
    Harga_Rp: 25000,
    Berat_Gram: 250,
    Foto_URL: 'https://images.unsplash.com/photo-1558961363-fa8fdf82db35?ixlib=rb-1.2.1&auto=format&fit=crop&w=800&q=80',
    Status: 'Unggulan',
    Deskripsi_Indo: 'Olahan selai organik tanpa bahan pengawet buatan. Cocok untuk sarapan sehat keluarga.',
    Deskripsi_Eng: 'Organic jam without artificial preservatives. Perfect for a healthy family breakfast.'
  },
  {
    ID_Produk: 'P003',
    Nama_Indo: 'Keripik Buah Naga Premium',
    Nama_Eng: 'Premium Dragon Fruit Chips',
    Kategori: 'Processed',
    Harga_Rp: 35000,
    Berat_Gram: 150,
    Foto_URL: 'https://images.unsplash.com/photo-1621939514649-280e2ee25f60?ixlib=rb-1.2.1&auto=format&fit=crop&w=800&q=80',
    Status: 'Ekspor',
    Deskripsi_Indo: 'Keripik renyah dari buah naga pilihan, diproses dengan teknologi vacuum frying.',
    Deskripsi_Eng: 'Crispy chips from selected dragon fruits, processed with vacuum frying technology.'
  },
  {
    ID_Produk: 'P004',
    Nama_Indo: 'Bibit Buah Naga Unggul',
    Nama_Eng: 'Superior Dragon Fruit Seedling',
    Kategori: 'Craft',
    Harga_Rp: 50000,
    Berat_Gram: 500,
    Foto_URL: 'https://images.unsplash.com/photo-1596431940177-3e11f71df420?ixlib=rb-1.2.1&auto=format&fit=crop&w=800&q=80',
    Status: 'Habis',
    Deskripsi_Indo: 'Bibit stek siap tanam yang telah teruji menghasilkan buah berkualitas ekspor.',
    Deskripsi_Eng: 'Ready-to-plant cuttings that are proven to produce export-quality fruits.'
  }
];

export const fetchProducts = async () => {
  try {
    const response = await fetch(GAS_URL);
    if (!response.ok) throw new Error('Network response was not ok');
    const data = await response.json();
    return data;
  } catch (error) {
    console.warn("Failed to fetch from GAS. Falling back to mock data.", error);
    // Simulate network delay
    return new Promise((resolve) => {
      setTimeout(() => {
        resolve(mockProducts);
      }, 800);
    });
  }
};

export const submitOrder = async (orderData, cartItems) => {
  const payload = {
    orderId: orderData.orderId,
    name: orderData.name,
    phone: orderData.phone,
    country: orderData.country,
    address: orderData.address,
    notes: orderData.notes,
    cartItems: cartItems.map(item => ({
      id: item.ID_Produk,
      name: item.Nama_Indo,
      quantity: item.quantity,
      price: item.Harga_Rp
    })),
    totalPrice: orderData.totalPrice,
    timestamp: new Date().toISOString()
  };

  try {
    const response = await fetch(GAS_URL, {
      method: 'POST',
      body: JSON.stringify(payload),
      headers: {
        'Content-Type': 'text/plain;charset=utf-8',
      }
    });
    
    if (!response.ok) throw new Error('Network response was not ok');
    const result = await response.json();
    return result;
  } catch (error) {
    console.warn("Failed to submit to GAS. Simulating success.", error);
    return new Promise((resolve) => {
      setTimeout(() => {
        resolve({ status: 'success' });
      }, 1000);
    });
  }
};
