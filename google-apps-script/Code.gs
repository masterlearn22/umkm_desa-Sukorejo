// ==========================================
// GOOGLE APPS SCRIPT FOR BUMDES SUKOREJO
// ==========================================

const SHEET_ID = 'YOUR_GOOGLE_SHEET_ID_HERE'; // Ganti dengan ID Spreadsheet Anda
const TAB_PRODUK = 'Produk';
const TAB_PESANAN = 'Pesanan_Masuk';

// Fungsi GET untuk mengambil data produk dari sheet "Produk"
function doGet(e) {
  try {
    const ss = SpreadsheetApp.openById(SHEET_ID);
    const sheet = ss.getSheetByName(TAB_PRODUK);
    const data = sheet.getDataRange().getValues();
    
    // Asumsi baris 1 adalah header
    const headers = data[0];
    const products = [];
    
    for (let i = 1; i < data.length; i++) {
      const row = data[i];
      const product = {};
      for (let j = 0; j < headers.length; j++) {
        product[headers[j]] = row[j];
      }
      products.push(product);
    }
    
    return ContentService
      .createTextOutput(JSON.stringify(products))
      .setMimeType(ContentService.MimeType.JSON);
      
  } catch (error) {
    return ContentService
      .createTextOutput(JSON.stringify({ 'error': error.message }))
      .setMimeType(ContentService.MimeType.JSON);
  }
}

// Fungsi POST untuk menerima data pesanan dan mencatatnya ke sheet "Pesanan_Masuk"
function doPost(e) {
  try {
    const ss = SpreadsheetApp.openById(SHEET_ID);
    const sheet = ss.getSheetByName(TAB_PESANAN);
    
    // Parse data JSON yang dikirim dari React
    let data;
    try {
      data = JSON.parse(e.postData.contents);
    } catch(err) {
      data = e.parameter;
    }
    
    // Format detail pesanan menjadi string yang rapi
    const detailPesanan = data.cartItems ? data.cartItems.map(item => `${item.name} (x${item.quantity})`).join(", ") : "-";
    
    // Siapkan baris baru sesuai urutan kolom:
    // Timestamp | ID_Pesanan | Nama_Pembeli | No_WA | Negara | Alamat_Lengkap | Detail_Pesanan | Total_Harga | Status_Proses
    const newRow = [
      data.timestamp || new Date(),
      data.orderId || "-",
      data.name || "-",
      data.phone || "-",
      data.country || "-",
      data.address || "-",
      detailPesanan,
      data.totalPrice || 0,
      "Pending" // Status default
    ];
    
    sheet.appendRow(newRow);
    
    return ContentService
      .createTextOutput(JSON.stringify({ 'status': 'success', 'orderId': data.orderId }))
      .setMimeType(ContentService.MimeType.JSON);
      
  } catch (error) {
    return ContentService
      .createTextOutput(JSON.stringify({ 'status': 'error', 'message': error.message }))
      .setMimeType(ContentService.MimeType.JSON);
  }
}

// Untuk menangani CORS preflight request (OPTIONS) jika diperlukan
function doOptions(e) {
  const headers = {
    "Access-Control-Allow-Origin": "*",
    "Access-Control-Allow-Methods": "GET, POST, OPTIONS",
    "Access-Control-Allow-Headers": "Content-Type",
    "Access-Control-Max-Age": "86400"
  };
  
  return ContentService.createTextOutput("")
    .setMimeType(ContentService.MimeType.JSON)
    .setHeaders(headers);
}
