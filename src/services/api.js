// This URL should be replaced with the actual Google Apps Script Web App URL
const GAS_URL = 'https://script.google.com/macros/s/AKfycbyVsNCTmjIknym5hg9YyXbIBpacxyBit8FUvLs-dUNAfFd-qyzDGPgpptsu75sQpJaZAg/exec';

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
  },
  {
    ID_Produk: 'P003',
    Nama_Indo: 'Bibit Buah Naga Unggulan Pak Jo',
    Nama_Eng: 'Superior Dragon Fruit Seedling by Pak Jo',
    Kategori: 'Craft',
    Harga_Rp: 50000,
    Berat_Gram: 1500,
    Foto_URL: '/assets/images/dragon_fruit_seedling_1780579696787.png',
    Status: 'Ekspor',
    Deskripsi_Indo: 'Bibit stek buah naga jenis Hylocereus polyrhizus (merah) yang telah melewati masa karantina dan rooting sempurna. Dikembangkan oleh Pak Jo, petani senior Desa Sukorejo. Bibit ini dijamin bebas virus dan jamur, tingkat persentase hidup 99%, dan siap berbuah pada usia tanam 8-10 bulan jika dirawat dengan baik.',
    Deskripsi_Eng: 'Hylocereus polyrhizus (red) dragon fruit cuttings that have passed quarantine and perfect rooting. Developed by Pak Jo, a senior farmer. Guaranteed virus and fungus free, 99% survival rate, and ready to bear fruit at 8-10 months of age if well maintained.'
  },
  {
    ID_Produk: 'P004',
    Nama_Indo: 'Buah Naga Putih Bu Tejo',
    Nama_Eng: 'White Dragon Fruit by Bu Tejo',
    Kategori: 'Fresh',
    Harga_Rp: 18000,
    Berat_Gram: 1000,
    Foto_URL: 'https://images.unsplash.com/photo-1605807646983-377bc5a76493?ixlib=rb-1.2.1&auto=format&fit=crop&w=800&q=80',
    Status: 'Ready',
    Deskripsi_Indo: 'Varian buah naga putih segar dari kebun Bu Tejo. Meski dagingnya berwarna putih transparan dengan biji hitam renyah, rasanya sangat menyegarkan dan tidak terlalu manis (low glycemic). Sangat direkomendasikan bagi penderita diabetes atau mereka yang sedang menjalani program diet rendah gula.',
    Deskripsi_Eng: 'Fresh white dragon fruit variant from Bu Tejo\'s farm. Although the flesh is transparent white with crunchy black seeds, the taste is very refreshing and not too sweet (low glycemic). Highly recommended for diabetics or those on a low-sugar diet program.'
  },
  {
    ID_Produk: 'P005',
    Nama_Indo: 'Selai Buah Naga Mbak Minah',
    Nama_Eng: 'Dragon Fruit Jam by Mbak Minah',
    Kategori: 'Processed',
    Harga_Rp: 25000,
    Berat_Gram: 250,
    Foto_URL: '/assets/images/dragon_fruit_jam_1780579726270.png',
    Status: 'Unggulan',
    Deskripsi_Indo: 'Selai home-made buatan Mbak Minah yang terbuat dari 100% buah naga merah asli Sukorejo dan gula tebu murni, tanpa tambahan pektin sintetis maupun pengawet. Dimasak perlahan (slow-cooked) untuk mempertahankan aroma khas buah naga. Cocok dioleskan pada roti gandum atau sebagai topping yogurt.',
    Deskripsi_Eng: 'Home-made jam by Mbak Minah made from 100% authentic Sukorejo red dragon fruit and pure cane sugar, without synthetic pectin or preservatives. Slow-cooked to retain the signature aroma. Perfect spread on whole wheat bread or as a yogurt topping.'
  },
  {
    ID_Produk: 'P006',
    Nama_Indo: 'Keripik Buah Naga Renyah Kang Maman',
    Nama_Eng: 'Crispy Dragon Fruit Chips by Kang Maman',
    Kategori: 'Processed',
    Harga_Rp: 35000,
    Berat_Gram: 150,
    Foto_URL: '/assets/images/dragon_fruit_chips_1780579741290.png',
    Status: 'Ready',
    Deskripsi_Indo: 'Camilan sehat masa kini! Keripik buah naga Kang Maman diproses menggunakan mesin vacuum frying bersuhu rendah. Proses ini menghilangkan kadar air tanpa merusak nutrisi dan warna alaminya. Hasilnya adalah keripik yang super renyah, manis alami, dan bebas kolesterol. Kemasan ziplock menjaga kerenyahan.',
    Deskripsi_Eng: 'Today\'s healthy snack! Kang Maman\'s dragon fruit chips are processed using a low-temperature vacuum frying machine. This removes moisture without destroying natural nutrients and color. The result is super crispy, naturally sweet, cholesterol-free chips. Ziplock packaging maintains crispness.'
  },
  {
    ID_Produk: 'P007',
    Nama_Indo: 'Sirup Buah Naga Segar Mbah Darmo',
    Nama_Eng: 'Fresh Dragon Fruit Syrup by Mbah Darmo',
    Kategori: 'Processed',
    Harga_Rp: 40000,
    Berat_Gram: 500,
    Foto_URL: '/assets/images/dragon_fruit_juice_1780579713413.png',
    Status: 'Ready',
    Deskripsi_Indo: 'Sirup kental ekstrak buah naga resep warisan Mbah Darmo. Diekstrak menggunakan metode cold-press untuk menjaga kesegaran vitamin C. Cukup campurkan 3 sendok makan sirup dengan air es dan perasan jeruk nipis untuk minuman pelepas dahaga yang menyehatkan di siang hari yang terik.',
    Deskripsi_Eng: 'Thick dragon fruit extract syrup from Mbah Darmo\'s heritage recipe. Extracted using cold-press method to maintain vitamin C freshness. Just mix 3 tablespoons of syrup with ice water and lime juice for a healthy thirst-quenching drink on a hot day.'
  },
  {
    ID_Produk: 'P008',
    Nama_Indo: 'Buah Naga Merah Super Pak Slamet',
    Nama_Eng: 'Super Red Dragon Fruit by Pak Slamet',
    Kategori: 'Fresh',
    Harga_Rp: 17500,
    Berat_Gram: 1000,
    Foto_URL: 'https://images.unsplash.com/photo-1527325678964-54921661f888?ixlib=rb-1.2.1&auto=format&fit=crop&w=800&q=80',
    Status: 'Ekspor',
    Deskripsi_Indo: 'Grade A premium dari kebun Pak Slamet. Buah naga ini dikhususkan untuk pasar ekspor karena ukurannya yang merata (1 buah mencapai 600-800 gram), sisiknya yang utuh hijau segar, dan bebas hama kutu putih. Rasa dijamin konsisten manis dan daging buah padat tidak berair.',
    Deskripsi_Eng: 'Premium Grade A from Pak Slamet\'s farm. Dedicated for export market due to uniform size (600-800g per fruit), fresh green intact scales, and mealybug-free. Guaranteed consistent sweet taste and dense, non-watery flesh.'
  },
  {
    ID_Produk: 'P009',
    Nama_Indo: 'Dodol Buah Naga Asli Sukorejo',
    Nama_Eng: 'Authentic Sukorejo Dragon Fruit Dodol',
    Kategori: 'Processed',
    Harga_Rp: 30000,
    Berat_Gram: 400,
    Foto_URL: 'https://images.unsplash.com/photo-1558961363-fa8fdf82db35?ixlib=rb-1.2.1&auto=format&fit=crop&w=800&q=80',
    Status: 'Ready',
    Deskripsi_Indo: 'Jajanan tradisional nusantara dengan sentuhan modern! Dodol yang diadon dengan santan kelapa asli, tepung ketan, dan sari buah naga merah murni yang memberikan warna merah keunguan alami tanpa pewarna buatan. Teksturnya kenyal, legit, dan tidak lengket di gigi. Sangat cocok untuk oleh-oleh.',
    Deskripsi_Eng: 'Traditional archipelago snack with a modern twist! Dodol mixed with real coconut milk, glutinous rice flour, and pure red dragon fruit juice giving natural purplish-red color without artificial dyes. Chewy, sweet, and doesn\'t stick to teeth. Perfect for souvenirs.'
  },
  {
    ID_Produk: 'P010',
    Nama_Indo: 'Bibit Buah Naga Kuning Premium',
    Nama_Eng: 'Premium Yellow Dragon Fruit Seedling',
    Kategori: 'Craft',
    Harga_Rp: 75000,
    Berat_Gram: 1500,
    Foto_URL: 'https://images.unsplash.com/photo-1596431940177-3e11f71df420?ixlib=rb-1.2.1&auto=format&fit=crop&w=800&q=80',
    Status: 'Habis',
    Deskripsi_Indo: 'Varian langka! Bibit buah naga kulit kuning (Selenicereus megalanthus) dengan daging buah berwarna putih transparan. Diketahui memiliki rasa paling manis (brix tertinggi) dibandingkan varian naga lainnya. Bibit ini adalah hasil kultur jaringan, menjamin produktivitas buah lebat.',
    Deskripsi_Eng: 'Rare variant! Yellow-skinned dragon fruit seedling (Selenicereus megalanthus) with transparent white flesh. Known to have the sweetest taste (highest brix) compared to other dragon variants. Tissue culture seedlings, guaranteeing heavy fruit productivity.'
  },
  {
    ID_Produk: 'P011',
    Nama_Indo: 'Teh Kulit Buah Naga Bu Sri',
    Nama_Eng: 'Dragon Fruit Peel Tea by Bu Sri',
    Kategori: 'Processed',
    Harga_Rp: 20000,
    Berat_Gram: 100,
    Foto_URL: 'https://images.unsplash.com/photo-1558961363-fa8fdf82db35?ixlib=rb-1.2.1&auto=format&fit=crop&w=800&q=80',
    Status: 'Ready',
    Deskripsi_Indo: 'Inovasi zero waste dari Bu Sri. Kulit buah naga merah dikeringkan secara higienis menggunakan dehidrator untuk dijadikan teh seduh herbal. Kaya akan antosianin dan senyawa bioaktif yang berkhasiat melenturkan pembuluh darah dan menurunkan tekanan darah tinggi. Rasa tawar dengan aroma floral yang menenangkan.',
    Deskripsi_Eng: 'Zero waste innovation from Bu Sri. Red dragon fruit peels are hygienically dried using dehydrator to make herbal brewed tea. Rich in anthocyanins and bioactive compounds beneficial for blood vessel elasticity and lowering high blood pressure. Plain taste with soothing floral aroma.'
  },
  {
    ID_Produk: 'P012',
    Nama_Indo: 'Sabun Organik Ekstrak Buah Naga',
    Nama_Eng: 'Organic Dragon Fruit Extract Soap',
    Kategori: 'Craft',
    Harga_Rp: 15000,
    Berat_Gram: 80,
    Foto_URL: 'https://images.unsplash.com/photo-1596431940177-3e11f71df420?ixlib=rb-1.2.1&auto=format&fit=crop&w=800&q=80',
    Status: 'Ready',
    Deskripsi_Indo: 'Sabun kecantikan buatan tangan (handmade soap) yang diformulasikan dengan minyak zaitun, minyak kelapa, dan esktrak murni buah naga merah. Memiliki sifat anti-aging berkat kandungan antioksidan tinggi buah naga. Mampu melembapkan kulit kering, mencerahkan, dan meredakan kemerahan pada kulit sensitif.',
    Deskripsi_Eng: 'Handmade beauty soap formulated with olive oil, coconut oil, and pure red dragon fruit extract. Has anti-aging properties thanks to high antioxidant content. Capable of moisturizing dry skin, brightening, and soothing redness on sensitive skin.'
  },
  {
    ID_Produk: 'P013',
    Nama_Indo: 'Buah Naga Merah Organik Kebun Utara',
    Nama_Eng: 'Organic Red Dragon Fruit Northern Farm',
    Kategori: 'Fresh',
    Harga_Rp: 15500,
    Berat_Gram: 1000,
    Foto_URL: 'https://images.unsplash.com/photo-1527325678964-54921661f888?ixlib=rb-1.2.1&auto=format&fit=crop&w=800&q=80',
    Status: 'Ready',
    Deskripsi_Indo: 'Dipanen dari gugusan lahan perkebunan sisi utara Desa Sukorejo yang memiliki karakteristik tanah vulkanik gembur. Menghasilkan buah naga dengan karakter rasa manis-asam seimbang yang sangat menyegarkan. Dipupuk full menggunakan kompos organik sapi dan kotoran kambing.',
    Deskripsi_Eng: 'Harvested from the northern cluster of Sukorejo Village which has loose volcanic soil characteristics. Produces dragon fruit with a perfectly balanced sweet-sour refreshing taste. Fully fertilized using cow and goat organic compost.'
  },
  {
    ID_Produk: 'P014',
    Nama_Indo: 'Buah Naga Putih Manis Kebun Selatan',
    Nama_Eng: 'Sweet White Dragon Fruit Southern Farm',
    Kategori: 'Fresh',
    Harga_Rp: 17000,
    Berat_Gram: 1000,
    Foto_URL: 'https://images.unsplash.com/photo-1605807646983-377bc5a76493?ixlib=rb-1.2.1&auto=format&fit=crop&w=800&q=80',
    Status: 'Ready',
    Deskripsi_Indo: 'Karakter iklim kebun selatan yang lebih hangat membuat buah naga putih dari lahan ini memiliki tingkat kemanisan lebih tinggi dari varian naga putih biasa. Daging buah sangat lembut, seperti memakan jelly alami. Sangat disukai oleh anak-anak sebagai pengganti permen.',
    Deskripsi_Eng: 'The warmer climate of the southern farm gives this white dragon fruit a higher sweetness level than regular white variants. The flesh is very soft, like eating natural jelly. Highly favored by children as a candy substitute.'
  },
  {
    ID_Produk: 'P015',
    Nama_Indo: 'Pudding Jelly Buah Naga Mbak Siti',
    Nama_Eng: 'Dragon Fruit Jelly Pudding by Mbak Siti',
    Kategori: 'Processed',
    Harga_Rp: 12000,
    Berat_Gram: 200,
    Foto_URL: 'https://images.unsplash.com/photo-1558961363-fa8fdf82db35?ixlib=rb-1.2.1&auto=format&fit=crop&w=800&q=80',
    Status: 'Ready',
    Deskripsi_Indo: 'Dessert dingin dan menyegarkan! Pudding jelly yang memadukan lapisan susu kental manis dan sari murni buah naga merah dengan potongan buah asli di dalamnya. Dibuat fresh setiap hari tanpa pemanis buatan. Cocok dihidangkan dingin saat acara arisan atau kumpul keluarga.',
    Deskripsi_Eng: 'Cold and refreshing dessert! Jelly pudding combining sweet condensed milk layer and pure red dragon fruit juice with real fruit chunks inside. Made fresh daily without artificial sweeteners. Best served cold for gatherings or family events.'
  },
  {
    ID_Produk: 'P016',
    Nama_Indo: 'Pupuk Kompos Batang Naga Pak Budi',
    Nama_Eng: 'Dragon Stem Compost Fertilizer by Pak Budi',
    Kategori: 'Craft',
    Harga_Rp: 25000,
    Berat_Gram: 5000,
    Foto_URL: 'https://images.unsplash.com/photo-1596431940177-3e11f71df420?ixlib=rb-1.2.1&auto=format&fit=crop&w=800&q=80',
    Status: 'Ready',
    Deskripsi_Indo: 'Kompos organik berkualitas tinggi hasil permentasi limbah batang buah naga pasca pruning (pemangkasan). Diolah oleh Pak Budi dengan tambahan mikroorganisme lokal (MOL). Sangat efektif untuk memperbaiki struktur tanah, mengembalikan unsur hara makro, dan memacu pertumbuhan vegetatif semua jenis tanaman hias dan sayur.',
    Deskripsi_Eng: 'High quality organic compost from fermented post-pruning dragon fruit stems. Processed by Pak Budi with local microorganisms (MOL). Highly effective for improving soil structure, restoring macro nutrients, and boosting vegetative growth of all plants.'
  },
  {
    ID_Produk: 'P017',
    Nama_Indo: 'Manisan Buah Naga Kering',
    Nama_Eng: 'Dried Candied Dragon Fruit',
    Kategori: 'Processed',
    Harga_Rp: 28000,
    Berat_Gram: 200,
    Foto_URL: 'https://images.unsplash.com/photo-1621939514649-280e2ee25f60?ixlib=rb-1.2.1&auto=format&fit=crop&w=800&q=80',
    Status: 'Unggulan',
    Deskripsi_Indo: 'Inovasi dari BUMDes Sukorejo. Potongan daging buah naga dikristalisasi dengan gula tebu untuk membentuk manisan kering yang kenyal di dalam dan renyah di luar. Cemilan awet tahan lama yang bisa menemani perjalanan jauh atau sekadar ngemil santai sambil minum kopi pahit.',
    Deskripsi_Eng: 'Innovation from BUMDes Sukorejo. Dragon fruit chunks are crystallized with cane sugar to form dried candies that are chewy inside and crispy outside. Long-lasting snack perfect for long trips or casual snacking with black coffee.'
  },
  {
    ID_Produk: 'P018',
    Nama_Indo: 'Jus Buah Naga Segar Siap Minum',
    Nama_Eng: 'Ready-to-Drink Fresh Dragon Fruit Juice',
    Kategori: 'Processed',
    Harga_Rp: 10000,
    Berat_Gram: 350,
    Foto_URL: 'https://images.unsplash.com/photo-1558961363-fa8fdf82db35?ixlib=rb-1.2.1&auto=format&fit=crop&w=800&q=80',
    Status: 'Ready',
    Deskripsi_Indo: 'Jus buah naga segar dalam botol higienis. Hanya terbuat dari air murni, sedikit madu hutan, dan banyak buah naga merah. Tidak melalui proses pemanasan pasteurisasi agar enzim dan vitamin tetap hidup. Wajib disimpan di dalam kulkas dan bertahan maksimal 3 hari.',
    Deskripsi_Eng: 'Fresh dragon fruit juice in hygienic bottles. Made only from pure water, a little forest honey, and lots of red dragon fruit. Unpasteurized to keep enzymes and vitamins alive. Must be refrigerated and lasts up to 3 days.'
  },
  {
    ID_Produk: 'P019',
    Nama_Indo: 'Buah Naga Merah Sortiran Grade A',
    Nama_Eng: 'Sorted Grade A Red Dragon Fruit',
    Kategori: 'Fresh',
    Harga_Rp: 16500,
    Berat_Gram: 1000,
    Foto_URL: 'https://images.unsplash.com/photo-1527325678964-54921661f888?ixlib=rb-1.2.1&auto=format&fit=crop&w=800&q=80',
    Status: 'Ekspor',
    Deskripsi_Indo: 'Kumpulan buah naga terbaik dari gabungan beberapa petani mitra BUMDes. Telah melewati proses Quality Control (QC) ketat: bebas memar, kulit mengkilap, sisik panjang hijau, dan bobot minimal 500 gram per buah. Ideal untuk dikirim sebagai parcel atau hadiah premium untuk kerabat.',
    Deskripsi_Eng: 'Collection of the best dragon fruits from various BUMDes partner farmers. Passed strict QC: bruise-free, shiny skin, long green scales, and minimum 500g per fruit. Ideal to be sent as parcels or premium gifts for relatives.'
  },
  {
    ID_Produk: 'P020',
    Nama_Indo: 'Bibit Buah Naga Merah Super Cepat Berbuah',
    Nama_Eng: 'Fast Fruiting Super Red Dragon Seedling',
    Kategori: 'Craft',
    Harga_Rp: 55000,
    Berat_Gram: 1500,
    Foto_URL: 'https://images.unsplash.com/photo-1596431940177-3e11f71df420?ixlib=rb-1.2.1&auto=format&fit=crop&w=800&q=80',
    Status: 'Unggulan',
    Deskripsi_Indo: 'Ini adalah produk bibit paling dicari! Hasil silangan (hybrid) spesifik dari BUMDes Sukorejo yang memiliki genotip super adaptif. Batangnya besar berduri jarang. Memiliki keunggulan waktu berbunga lebih cepat dan resistensi tinggi terhadap penyakit cacar batang (Neoscytalidium dimidiatum).',
    Deskripsi_Eng: 'This is the most sought-after seedling product! A specific hybrid from BUMDes Sukorejo with super adaptive genotype. Thick stems with sparse thorns. Features faster blooming time and high resistance to stem canker disease (Neoscytalidium dimidiatum).'
  }
];

export const fetchProducts = async () => {
  try {
    const response = await fetch(GAS_URL);
    if (!response.ok) throw new Error('Network response was not ok');
    let data = await response.json();
    // Simulate Nomor_WA if backend doesn't provide it
    data = data.map((item, index) => ({
      ...item,
      Nomor_WA: item.Nomor_WA || `628123456789${index % 10}`
    }));
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

export const loginUser = async (email, hashedPassword) => {
  const payload = {
    action: 'login',
    email: email,
    password: hashedPassword
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
    console.warn("Failed to login via GAS.", error);
    throw new Error('Gagal terhubung ke server login.');
  }
};
