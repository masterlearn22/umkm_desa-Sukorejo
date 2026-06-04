# Product Requirement Document (PRD)
## Project: Platform Digital Katalog & WA Order UMKM Desa Sukorejo (Banyuwangi Dragon Fruit Global Initiative)
**Version:** 1.0  
**Target Stack:** React, Tailwind CSS, Google Apps Script (GAS), Google Sheets, Vercel  
**Language Support:** Bilingual (Bahasa Indonesia & English)

---

## 1. Latar Belakang & Masalah (Background & Problem Statement)
Desa Sukorejo, Kecamatan Bangorejo, Kabupaten Banyuwangi merupakan salah satu sentra penghasil buah naga terbesar di Indonesia. Namun, para petani sering kali menghadapi fenomena **oversupply** (panen raya yang berlebihan) yang mengakibatkan jatuhnya harga secara drastis di pasar lokal. Karena keterbatasan akses pasar luar daerah dan luar negeri, beberapa petani terpaksa membuang hasil panen untuk menciptakan kelangkaan semu demi menstabilkan harga. 

Untuk menyelesaikan masalah ini, diperlukan digitalisasi yang berfokus pada dua hal:
1. **Hilirisasi Produk:** Mendorong penjualan produk olahan buah naga (selai, keripik, sirup, kosmetik alami) yang memiliki masa simpan lebih lama dan nilai jual lebih tinggi.
2. **Perluasan Pasar (Global Reach):** Menyediakan platform katalog digital berbiaya operasional nol (*zero operational cost*) yang dapat diakses oleh pembeli nasional maupun mancanegara, yang langsung terintegrasi dengan WhatsApp sebagai kanal negosiasi dan transaksi utama.

---

## 2. Tujuan Proyek (Project Objectives)
- Membangun website katalog produk UMKM Desa Sukorejo yang responsif, berwawasan global, dan ringan dijalankan di perangkat mobile.
- Mengimplementasikan sistem basis data gratis menggunakan Google Sheets untuk manajemen produk dan pencatatan pesanan otomatis.
- Menghubungkan pembeli langsung ke pengelola UMKM/BUMDes via WhatsApp dengan format pesan yang terstruktur (otomatis mendukung format ekspor/domestik).
- Membantu menurunkan angka kerugian pangan (*food loss*) petani buah naga di Desa Sukorejo melalui promosi produk olahan kreatif.

---

## 3. Arsitektur Sistem & Stack Teknologi
Platform ini menggunakan pendekatan **Serverless & Free-Tier Stack** untuk memastikan keberlanjutan finansial UMKM desa:
- **Frontend:** React.js (Single Page Application) + Tailwind CSS.
- **Hosting:** Vercel (Gratis, menggunakan integrasi repositori GitHub).
- **Database & CMS:** Google Sheets (Tempat menyimpan daftar produk, harga, stok, dan log pesanan masuk).
- **Backend/API Layer:** Google Apps Script (GAS) dipublikasikan sebagai Web App untuk menerima request `POST` dari React dan memanipulasi data di Google Sheets secara real-time.
- **Transaction Handler:** Custom WhatsApp Link Generator (`wa.me`) dengan format pesan otomatis berbasis URL encoding.

---

## 4. Karakteristik Pengguna (User Persona)
1. **Pembeli Domestik & Internasional (B2C / B2B):**
   - Ingin melihat produk unggulan buah naga segar dan olahannya dari Desa Sukorejo.
   - Membutuhkan informasi standarisasi produk (Halal, PIRT, sertifikasi ekspor).
   - Menginginkan proses pemesanan langsung tanpa perlu mendaftar akun rumit.
2. **Admin UMKM / Pengelola BUMDes Sukorejo:**
   - Memiliki keterbatasan kemampuan coding, tetapi mahir menggunakan Excel/Google Sheets.
   - Mengelola pembaruan harga, foto produk, dan status ketersediaan barang langsung dari smartphone via aplikasi Google Sheets.
   - Menerima pesanan yang sudah rapi di WhatsApp untuk proses packing dan penentuan ongkos kirim.

---

## 5. Alur Pengguna (User Flow)
```
[Landing Page / Katalog] ──> [Pilih Bahasa: ID/EN] ──> [Filter Kategori: Fresh / Processed]
                                                                     │
[Redirect ke WhatsApp] <── [GAS Simpan Data] <── [Isi Form Checkout] <── [Tambah ke Keranjang]
```

---

## 6. Kebutuhan Fungsional (Functional Requirements)

### 6.1. Fitur Internasionalisasi (Localization)
- **Multi-language Toggle:** Fitur tombol switch Bahasa Indonesia (ID) dan English (EN) di bagian Navbar untuk memfasilitasi pembeli mancanegara.
- **Sistem Satuan Ganda:** Menampilkan informasi berat produk dalam skala ritel (gram/kg) dan skala grosir/ekspor (kuintal/ton).

### 6.2. Manajemen Katalog Dinamis
- **Fetching Data Produk:** React melakukan `fetch` ke API Google Apps Script saat aplikasi pertama kali dimuat untuk mengambil data produk terbaru dari Google Sheets.
- **Sistem Filter & Pencarian:** Filter produk berdasarkan kategori (`Semua`, `Buah Segar`, `Makanan Olahan`, `Kraf & Lainnya`) serta kolom pencarian teks real-time.
- **Badge Status Produk:** Menampilkan penanda khusus seperti "Produk Unggulan", "Ekspor Ready", atau "Stok Habis" berdasarkan kondisi di Google Sheets.

### 6.3. Sistem Keranjang Belanja (Shopping Cart)
- **State Persistence:** Keranjang belanja menyimpan data di `localStorage` agar item pilihan pengguna tidak hilang jika halaman tidak sengaja ter-refresh.
- **Kalkulator Otomatis:** Menghitung total berat estimasi dan total harga pesanan secara langsung di dalam komponen keranjang.

### 6.4. Form Checkout & Integrasi Ekspor
- **Input Data Pembeli:** Nama, Email, Nomor WhatsApp, Alamat Lengkap, Negara Tujuan, dan Catatan Tambahan.
- **Sistem Validasi:** Validasi nomor telepon menggunakan format kode negara internasional (misal: +62 untuk Indonesia).
- **Dokumentasi Legalitas:** Menampilkan info kelayakan ekspor (Sertifikat Halal, PIRT, atau fitosanitari jika ada) pada detail produk untuk membangun kepercayaan pembeli luar negeri.

### 6.5. Integrasi Google Apps Script (GAS) & WhatsApp
- **Endpoint POST:** Saat tombol "Kirim Pesanan" diklik, React mengirimkan objek data pesanan ke URL GAS.
- **Auto-logging Sheets:** GAS menerima data dan menambahkannya ke baris baru pada sheet `Pesanan_Masuk` (berguna untuk pembukuan digital BUMDes).
- **WhatsApp Deep Linking:** Setelah respons GAS berhasil (`status: success`), website membuka tab baru menuju WhatsApp dengan pesan pra-format yang berisi rekap detail barang dan data pengiriman pembeli.

---

## 7. Desain & Panduan UI/UX (Tailwind CSS Configuration)

### 7.1. Palet Warna (Colour Style)
Tema yang diangkat adalah **"Premium Agro-Global"**, memadukan kesegaran alam eksotis dengan profesionalisme bisnis internasional.
- **Primary Color (Dragon Fruit Crimson):** `#C91A54` (Tailwind equivalent: `rose-600` / `rose-700`). Digunakan untuk tombol utama, harga produk, dan elemen penarik perhatian utama.
- **Secondary Color (Organic Agriculture Green):** `#1E4620` (Tailwind equivalent: `emerald-800` / `emerald-900`). Digunakan untuk aksen hilirisasi, ikon lingkungan, dan badge keaslian desa.
- **Background Color (Warm Eco-Cream):** `#FAF8F5` (Tailwind equivalent: `stone-50`). Mencegah kesan kaku seperti website korporat putih polos.
- **Text Color:** `#1C1917` (`stone-900`) untuk keterbacaan tinggi di layar mobile luar ruangan.

### 7.2. Tipografi (Font Style)
- **Font Utama:** `Plus Jakarta Sans` atau `Inter` (Sans-serif populer yang sangat bersih pada resolusi layar mobile).
- **Font Heading (Opsional untuk Judul Besar Hero):** `Playfair Display` (Serif) untuk menonjolkan kesan produk lokal yang premium, dikombinasikan dengan sub-heading Sans-serif.

---

## 8. Kebutuhan Non-Fungsional (Non-Functional Requirements)
- **Mobile-First Core:** Komponen UI wajib disusun dengan prioritas layar smartphone (`sm:`, `md:` pada Tailwind) karena 90% transaksi berbasis WhatsApp berawal dari perangkat seluler.
- **Kecepatan Muat Page:** Ukuran aset gambar harus dioptimalkan (WebP format) agar website dapat dimuat di bawah 2 detik meski di area dengan sinyal seluler terbatas.
- **CORS Handling:** Script pada Google Apps Script harus dikonfigurasi dengan header yang tepat (`HtmlService.createHtmlOutput`) untuk menghindari pemblokiran lintas domain (CORS) saat React melakukan hit API.

---

## 9. Struktur Data Google Sheets (Database Schema)

### Sheet 1: `Produk`
| ID_Produk | Nama_Indo | Nama_Eng | Kategori | Harga_Rp | Berat_Gram | Foto_URL | Status | Deskripsi_Indo | Deskripsi_Eng |
| :--- | :--- | :--- | :--- | :--- | :--- | :--- | :--- | :--- | :--- |
| P001 | Buah Naga Merah Super | Premium Red Dragon Fruit | Fresh | 15000 | 1000 | https://... | Ready | Buah naga segar langsung... | Fresh dragon fruit picked... |
| P002 | Selai Buah Naga Sukorejo | Sukorejo Dragon Fruit Jam | Processed | 25000 | 250 | https://... | Ready | Olahan selai organik tanpa... | Organic jam without artificial... |

### Sheet 2: `Pesanan_Masuk`
| Timestamp | ID_Pesanan | Nama_Pembeli | No_WA | Negara | Alamat_Lengkap | Detail_Pesanan | Total_Harga | Status_Proses |
| :--- | :--- | :--- | :--- | :--- | :--- | :--- | :--- | :--- |
| 04/06/2026 | ORD-9921 | John Doe | +12025550143 | USA | 123 Street Ave, NY | P002 (x10) | 250000 | Pending |

---

## 10. Contoh Format Pesanan WhatsApp (Output Template)
```
[NAMA TOKO / BUMDES SUKOREJO DIGITAL CATALOG]
Halo Admin UMKM Desa Sukorejo, saya ingin melakukan pemesanan produk:

Detail Pesanan:
- Selai Buah Naga Sukorejo (x10) - Rp 250.000

Data Pengiriman:
Nama: John Doe
WhatsApp: +12025550143
Negara: United States (USA)
Alamat: 123 Street Ave, New York, 10001
Catatan: Please include export custom invoice.

Total Estimasi: Rp 250.000 (Belum termasuk ongkos kirim internasional)
Nomor Invoice Database: ORD-9921
Terima kasih!
```
