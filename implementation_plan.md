# Implementasi Platform Digital Katalog & WA Order UMKM Desa Sukorejo

Berdasarkan PRD yang diberikan, rencana implementasi ini akan menguraikan langkah-langkah teknis untuk membangun platform katalog digital UMKM Desa Sukorejo. Proyek ini akan menggunakan React (via Vite) dan Tailwind CSS untuk frontend, serta Google Apps Script (GAS) & Google Sheets sebagai backend serverless.

## User Review Required

> [!IMPORTANT]
> **Setup Google Apps Script & Google Sheets**
> Saya dapat membantu membuat kode untuk Google Apps Script (GAS). Namun, penerapan (deployment) kode GAS dan pembuatan Google Sheets harus dilakukan secara manual oleh Anda melalui akun Google Anda. Saya akan menyediakan instruksi langkah demi langkah dan kode yang diperlukan saat kita sampai pada tahap tersebut. Apakah Anda bersedia melakukan setup manual ini nanti?

> [!WARNING]
> **Framework React**
> PRD menyebutkan penggunaan "React". Untuk pengembangan yang modern dan cepat, saya mengusulkan penggunaan **Vite** dengan template React (Single Page Application) daripada Next.js, karena arsitekturnya sepenuhnya SPA dan sangat cocok dipadukan dengan Vercel secara gratis. Apakah penggunaan Vite disetujui?

## Open Questions

> [!NOTE]
> 1. **Data Awal:** Apakah Anda sudah memiliki contoh data (foto, nama, harga) untuk dimasukkan ke Google Sheets nantinya, atau haruskah saya membuat data *dummy* sementara selama proses pengembangan?
> 2. **Desain Spesifik:** PRD menyebutkan warna (`#C91A54`, `#1E4620`, `#FAF8F5`). Apakah ada referensi desain visual spesifik (mockup/UI kit) yang harus saya ikuti, atau saya dapat merancang UI premium berdasarkan panduan warna tersebut?

## Proposed Changes

Proses pengembangan akan dibagi menjadi beberapa fase utama.

### Fase 1: Inisialisasi Proyek & Setup Desain Dasar
Tahap ini berfokus pada pembuatan fondasi proyek dan konfigurasi tema Tailwind sesuai panduan warna.

#### [NEW] `package.json`
- Inisialisasi proyek menggunakan Vite (React + JavaScript/TypeScript).
- Instalasi dependensi: `react-router-dom` (opsional jika butuh banyak halaman, tapi SPA bisa tanpa router), `lucide-react` (untuk ikon), `tailwindcss`, `postcss`, `autoprefixer`.

#### [NEW] `tailwind.config.js`
- Konfigurasi warna utama: `dragon-crimson` (`#C91A54`), `agro-green` (`#1E4620`), dan `eco-cream` (`#FAF8F5`).
- Konfigurasi font: `Plus Jakarta Sans` / `Inter` sebagai default sans, dan `Playfair Display` untuk judul.

#### [NEW] `index.html` & `src/index.css`
- Import font dari Google Fonts.
- Set background default ke warna `eco-cream`.

---

### Fase 2: State Management (Context)
Pembuatan sistem manajemen *state* untuk menampung bahasa (ID/EN) dan keranjang belanja (Cart).

#### [NEW] `src/context/LanguageContext.jsx`
- Menyediakan *state* bahasa saat ini dan fungsi *toggle* untuk berpindah antara Bahasa Indonesia dan English.
- Menyediakan kamus terjemahan dasar (Dictionary).

#### [NEW] `src/context/CartContext.jsx`
- Mengelola daftar item yang dimasukkan ke keranjang.
- Fungsi: tambah, hapus, ubah kuantitas, hitung total harga.
- Sinkronisasi dengan `localStorage` agar data tidak hilang saat *refresh*.

---

### Fase 3: Komponen UI (User Interface)
Pembuatan antarmuka pengguna berdasarkan struktur komponen yang modular.

#### [NEW] `src/components/Navbar.jsx`
- Logo BUMDes / Katalog.
- Tombol *toggle* Bahasa (ID/EN).
- Indikator keranjang (jumlah item).

#### [NEW] `src/components/Hero.jsx`
- Banner selamat datang dengan tipografi `Playfair Display`.
- Deskripsi singkat mengenai UMKM Desa Sukorejo.

#### [NEW] `src/components/ProductList.jsx` & `src/components/ProductCard.jsx`
- Menampilkan grid katalog produk.
- Menampilkan badge ("Produk Unggulan", "Ekspor Ready", dll).
- Tombol "Tambah ke Keranjang".

#### [NEW] `src/components/FilterBar.jsx`
- Tombol kategori (Fresh, Processed, dll).
- Kolom pencarian teks.

#### [NEW] `src/components/CartSidebar.jsx` atau `src/components/CartModal.jsx`
- Menampilkan rincian pesanan.
- Menghitung total harga dan estimasi berat.
- Tombol lanjut ke Checkout.

---

### Fase 4: Sistem Checkout & Integrasi API
Pembuatan formulir checkout, logika pengiriman data ke GAS, dan *redirect* ke WhatsApp.

#### [NEW] `src/components/CheckoutForm.jsx`
- Form input data pembeli (Nama, Email, No WA, Negara, Alamat, Catatan).
- Validasi input sederhana (terutama format No WA).

#### [NEW] `src/services/api.js`
- Fungsi `fetchProducts()` untuk mengambil data dari Google Apps Script (metode GET).
- Fungsi `submitOrder()` untuk mengirim data ke Google Apps Script (metode POST).

#### [NEW] `src/utils/whatsapp.js`
- Fungsi untuk memformat (*url encoding*) teks pesanan sesuai "Contoh Format Pesanan WhatsApp" dari PRD dan men-generate link `wa.me`.

---

### Fase 5: Google Apps Script (Sisi Server - Manual Setup)
File ini akan disertakan dalam *repository* sebagai referensi, namun harus di-deploy manual ke Google Drive.

#### [NEW] `google-apps-script/Code.gs`
- Fungsi `doGet()` untuk mengembalikan data produk dari sheet "Produk" dalam format JSON.
- Fungsi `doPost()` untuk menerima payload pesanan dari React, mencatatnya ke baris baru di sheet "Pesanan_Masuk", dan merespons dengan status success.
- Konfigurasi CORS agar bisa diakses dari domain Vercel.

## Verification Plan

### Automated Tests (Linting/Formatting)
- Menjalankan `eslint` untuk memastikan kebersihan kode.
- Memastikan tidak ada *error* pada *build* lokal (`npm run build`).

### Manual Verification
1. **Pengujian Fungsional UI:**
   - Memastikan tombol *toggle* bahasa mengubah teks di seluruh aplikasi (Navbar, Hero, Produk).
   - Memastikan filter kategori berfungsi memunculkan produk yang tepat.
   - Memastikan keranjang belanja (tambah, kurangi) tersimpan setelah *refresh browser*.
2. **Pengujian Form & Flow Transaksi:**
   - Mengisi form checkout dengan berbagai format nomor telepon.
   - Mengamati log saat data di-*submit* (ke *mock endpoint* jika GAS belum siap).
   - Memverifikasi *redirect* WhatsApp membuka URL dengan pesan teks terformat secara akurat.
3. **Pengujian Responsif:**
   - Mengecilkan jendela *browser* untuk memverifikasi tampilan pada mode *mobile* (smartphone).
4. **Deploy Vercel:** (Dapat dilakukan oleh *User* setelah kode selesai dan di-*push* ke GitHub).
