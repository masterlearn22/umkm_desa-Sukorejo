// This URL should be replaced with the actual Google Apps Script Web App URL
const GAS_URL = 'https://script.google.com/macros/s/AKfycbzl3aIoTRYVuhWnxNIQSXSEz1PlQCkdQbWquJPGVz4adPBBPtnfynbfAVFbzdg9iWrD/exec';

// Since we might not have GAS deployed yet, we use mock data if fetch fails
const mockArticles = [
  {
    ID_Artikel: 'ART-1700000001',
    Judul: 'Potensi Wisata Desa Sukorejo',
    Konten: 'Desa Sukorejo memiliki banyak potensi wisata, mulai dari agrowisata buah naga hingga kerajinan tangan lokal. Keindahan alam dan keramahan penduduk membuat desa ini cocok sebagai destinasi wisata akhir pekan.',
    Penulis: 'Admin',
    Tanggal: '2023-10-01T10:00:00.000Z',
    Gambar: 'https://images.unsplash.com/photo-1596431940177-3e11f71df420?ixlib=rb-1.2.1&auto=format&fit=crop&w=800&q=80',
    Status: 'Published'
  },
  {
    ID_Artikel: 'ART-1700000002',
    Judul: 'Cara Menanam Buah Naga',
    Konten: 'Menanam buah naga membutuhkan perawatan khusus. Pastikan tanah cukup gembur dan mendapat sinar matahari yang cukup. Pemupukan rutin dengan kompos organik sangat disarankan untuk hasil panen optimal.',
    Penulis: 'BUMDes',
    Tanggal: '2023-10-15T10:00:00.000Z',
    Gambar: 'https://images.unsplash.com/photo-1527325678964-54921661f888?ixlib=rb-1.2.1&auto=format&fit=crop&w=800&q=80',
    Status: 'Published'
  }
];

// Since we might not have GAS deployed yet, we use mock data if fetch fails
const mockProducts = [
  {
    ID_Produk: 'P001',
    Nama_Indo: 'Buah Naga Merah Pak Tarno',
    Nama_Eng: 'Red Dragon Fruit by Pak Tarno',
    Kategori: 'Fresh',
    Harga_Rp: 15000,
    Berat_Gram: 1000,
    Foto_URL: '/assets/images/dragon_fruit_1780579681534.png',
    Status: 'Ready',
    Deskripsi_Indo: 'Buah naga merah segar langsung dipetik dari kebun organik Pak Tarno di sisi timur Desa Sukorejo. Ditanam tanpa pestisida kimia, memiliki rasa manis alami dengan tingkat brix di atas rata-rata. Daging buahnya sangat tebal dan kaya akan antioksidan, cocok untuk dikonsumsi langsung atau dijadikan jus sehat.',
    Deskripsi_Eng: 'Fresh red dragon fruit picked directly from Pak Tarno\'s organic farm in the eastern part of Sukorejo Village. Grown without chemical pesticides, it has a naturally sweet taste with above-average brix levels. The flesh is very thick and rich in antioxidants, perfect for direct consumption or healthy juice.'
  },
  {
    ID_Produk: 'P002',
    Nama_Indo: 'Buah Naga Merah Mbak Tutik',
    Nama_Eng: 'Red Dragon Fruit by Mbak Tutik',
    Kategori: 'Fresh',
    Harga_Rp: 16000,
    Berat_Gram: 1000,
    Foto_URL: 'https://images.unsplash.com/photo-1527325678964-54921661f888?ixlib=rb-1.2.1&auto=format&fit=crop&w=800&q=80',
    Status: 'Unggulan',
    Deskripsi_Indo: 'Hasil panen pilihan dari kebun Mbak Tutik yang terkenal dengan ukurannya yang besar (jumbo). Setiap buah disortir dengan ketat untuk memastikan tidak ada cacat. Warna merah pekatnya menandakan kandungan vitamin C dan zat besi yang sangat tinggi, sangat baik untuk kesehatan darah dan kulit.',
    Deskripsi_Eng: 'Selected harvest from Mbak Tutik\'s farm, famous for its jumbo size. Each fruit is strictly sorted to ensure no defects. Its deep red color indicates a very high content of vitamin C and iron, excellent for blood and skin health.'
  }
];

export const fetchProducts = async () => {
  try {
    const response = await fetch(GAS_URL);
    if (!response.ok) throw new Error('Network response was not ok');
    let data = await response.json();
    return data;
  } catch (error) {
    console.warn("Failed to fetch from GAS. Falling back to mock data.", error);
    // Simulate network delay and append Nomor_WA
    const modifiedMock = mockProducts.map((item, index) => ({
      ...item,
      Nomor_WA: `628123456789${index % 10}` // Fake different numbers for sellers
    }));
    return new Promise((resolve) => {
      setTimeout(() => {
        resolve(modifiedMock);
      }, 800);
    });
  }
};

export const submitOrder = async (orderData, cartItems) => {
  const payload = {
    action: 'order',
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

export const registerUser = async (userData) => {
  const payload = {
    action: 'register',
    name: userData.name,
    phone: userData.phone,
    email: userData.email,
    password: userData.password,
    address: userData.address,
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
    console.warn("Failed to register to GAS. Simulating success.", error);
    return new Promise((resolve) => {
      setTimeout(() => {
        resolve({ status: 'success' });
      }, 1000);
    });
  }
};

export const loginUser = async (email, password) => {
  try {
    const payload = {
      action: 'login',
      email: email,
      password: password
    };
    
    const response = await fetch(GAS_URL, {
      method: 'POST',
      headers: {
        'Content-Type': 'text/plain;charset=utf-8',
      },
      body: JSON.stringify(payload)
    });
    
    const result = await response.json();
    if (result.status === 'error') {
      throw new Error(result.message || 'Login gagal.');
    }
    
    // Result contains: status, user (name, email, role, etc), permissions (ManageProducts, etc)
    return result;
  } catch (error) {
    console.warn("Failed to login via GAS.", error);
    throw error;
  }
};

/**
 * Fetch all orders from GAS (for Admin/Seller)
 */
export const fetchOrders = async () => {
  try {
    const payload = { action: 'get_orders' };
    const response = await fetch(GAS_URL, {
      method: 'POST',
      headers: {
        'Content-Type': 'text/plain;charset=utf-8',
      },
      body: JSON.stringify(payload)
    });
    
    return await response.json();
  } catch (error) {
    console.warn("Failed to fetch orders from GAS.", error);
    return [];
  }
};

/**
 * Fetch all users from GAS (for Admin)
 */
export const fetchUsers = async () => {
  try {
    const payload = { action: 'get_users' };
    const response = await fetch(GAS_URL, {
      method: 'POST',
      headers: {
        'Content-Type': 'text/plain;charset=utf-8',
      },
      body: JSON.stringify(payload)
    });
    
    return await response.json();
  } catch (error) {
    console.warn("Failed to fetch users from GAS.", error);
    return [];
  }
};

export const updateUserRole = async (email, newRole) => {
  try {
    const payload = { action: 'update_role', email, new_role: newRole };
    const response = await fetch(GAS_URL, {
      method: 'POST',
      headers: {
        'Content-Type': 'text/plain;charset=utf-8',
      },
      body: JSON.stringify(payload),
    });
    return await response.json();
  } catch (error) {
    console.error("Error updating user role:", error);
    throw error;
  }
};

export const updateProfileData = async (data) => {
  try {
    const payload = { action: 'update_profile', ...data };
    const response = await fetch(GAS_URL, {
      method: 'POST',
      headers: { 'Content-Type': 'text/plain;charset=utf-8' },
      body: JSON.stringify(payload),
    });
    return await response.json();
  } catch (error) {
    console.error("Error updating profile:", error);
    throw error;
  }
};

export const changePassword = async (email, oldPassword, newPassword) => {
  try {
    const payload = { action: 'change_password', email, oldPassword, newPassword };
    const response = await fetch(GAS_URL, {
      method: 'POST',
      headers: { 'Content-Type': 'text/plain;charset=utf-8' },
      body: JSON.stringify(payload),
    });
    return await response.json();
  } catch (error) {
    console.error("Error changing password:", error);
    throw error;
  }
};

export const submitSellerApplication = async (data) => {
  try {
    const payload = { action: 'submit_application', ...data };
    const response = await fetch(GAS_URL, {
      method: 'POST',
      headers: { 'Content-Type': 'text/plain;charset=utf-8' },
      body: JSON.stringify(payload),
    });
    return await response.json();
  } catch (error) {
    console.error("Error submitting application:", error);
    throw error;
  }
};

export const fetchApplications = async () => {
  try {
    const payload = { action: 'get_applications' };
    const response = await fetch(GAS_URL, {
      method: 'POST',
      headers: { 'Content-Type': 'text/plain;charset=utf-8' },
      body: JSON.stringify(payload),
    });
    return await response.json();
  } catch (error) {
    console.error("Error fetching applications:", error);
    return [];
  }
};

export const approveApplication = async (idPengajuan, newStatus) => {
  try {
    const payload = { action: 'approve_application', idPengajuan, newStatus };
    const response = await fetch(GAS_URL, {
      method: 'POST',
      headers: { 'Content-Type': 'text/plain;charset=utf-8' },
      body: JSON.stringify(payload),
    });
    return await response.json();
  } catch (error) {
    console.error("Error approving application:", error);
    throw error;
  }
};

export const addProduct = async (productData) => {
  try {
    const payload = {
      action: 'add_product',
      ...productData
    };
    
    const response = await fetch(GAS_URL, {
      method: 'POST',
      headers: {
        'Content-Type': 'text/plain;charset=utf-8',
      },
      body: JSON.stringify(payload)
    });
    
    return await response.json();
  } catch (error) {
    console.warn("Failed to add product to GAS.", error);
    return { status: "error", message: error.message };
  }
};

/**
 * Fetch all articles from GAS
 */
export const fetchArticles = async () => {
  try {
    const payload = { action: 'get_articles' };
    const response = await fetch(GAS_URL, {
      method: 'POST',
      headers: { 'Content-Type': 'text/plain;charset=utf-8' },
      body: JSON.stringify(payload)
    });
    const result = await response.json();
    return result;
  } catch (error) {
    console.warn("Failed to fetch articles from GAS. Using mock data.", error);
    return new Promise(resolve => setTimeout(() => resolve([...mockArticles]), 800));
  }
};

export const addArticle = async (articleData) => {
  try {
    const payload = { action: 'add_article', ...articleData };
    const response = await fetch(GAS_URL, {
      method: 'POST',
      headers: { 'Content-Type': 'text/plain;charset=utf-8' },
      body: JSON.stringify(payload)
    });
    return await response.json();
  } catch (error) {
    console.warn("Failed to add article to GAS. Simulating success.", error);
    return new Promise(resolve => setTimeout(() => resolve({ status: 'success' }), 800));
  }
};

export const updateArticle = async (articleData) => {
  try {
    const payload = { action: 'update_article', ...articleData };
    const response = await fetch(GAS_URL, {
      method: 'POST',
      headers: { 'Content-Type': 'text/plain;charset=utf-8' },
      body: JSON.stringify(payload)
    });
    return await response.json();
  } catch (error) {
    console.warn("Failed to update article in GAS. Simulating success.", error);
    return new Promise(resolve => setTimeout(() => resolve({ status: 'success' }), 800));
  }
};

export const deleteArticle = async (id_artikel) => {
  try {
    const payload = { action: 'delete_article', id_artikel };
    const response = await fetch(GAS_URL, {
      method: 'POST',
      headers: { 'Content-Type': 'text/plain;charset=utf-8' },
      body: JSON.stringify(payload)
    });
    return await response.json();
  } catch (error) {
    console.warn("Failed to delete article in GAS. Simulating success.", error);
    return new Promise(resolve => setTimeout(() => resolve({ status: 'success' }), 800));
  }
};

export const uploadImageToDrive = async (base64Data, filename, folderId) => {
  try {
    const payload = {
      action: 'upload_image',
      base64Data,
      filename,
      folderId
    };
    
    const response = await fetch(GAS_URL, {
      method: 'POST',
      headers: { 'Content-Type': 'text/plain;charset=utf-8' },
      body: JSON.stringify(payload)
    });
    
    return await response.json();
  } catch (error) {
    console.error("Error uploading image to drive:", error);
    throw error;
  }
};


