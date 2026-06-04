const SHEET_PRODUK = "Produk";
const SHEET_PESANAN = "Pesanan";
const SHEET_PENGGUNA = "Pengguna"; // <-- Ini kunci utamanya!

function doGet(e) {
  try {
    const sheet = SpreadsheetApp.getActiveSpreadsheet().getSheetByName(SHEET_PRODUK);
    if (!sheet) return ContentService.createTextOutput("[]").setMimeType(ContentService.MimeType.JSON);

    const data = sheet.getDataRange().getValues();
    const headers = data[0];
    const products = [];

    for (let i = 1; i < data.length; i++) {
      let product = {};
      for (let j = 0; j < headers.length; j++) {
        product[headers[j]] = data[i][j];
      }
      products.push(product);
    }
    return ContentService.createTextOutput(JSON.stringify(products)).setMimeType(ContentService.MimeType.JSON);
  } catch (error) {
    return ContentService.createTextOutput(JSON.stringify({ error: error.message })).setMimeType(ContentService.MimeType.JSON);
  }
}

function doPost(e) {
  try {
    const payload = JSON.parse(e.postData.contents);
    const action = payload.action;

    // 1. JIKA YANG DIKIRIM ADALAH REGISTRASI PENGGUNA BARU
    if (action === 'register') {
      let targetSheet = SpreadsheetApp.getActiveSpreadsheet().getSheetByName(SHEET_PENGGUNA);
      if (!targetSheet) {
        targetSheet = SpreadsheetApp.getActiveSpreadsheet().insertSheet(SHEET_PENGGUNA);
        targetSheet.appendRow(["Waktu_Daftar", "Nama", "Nomor_WA", "Email", "Password", "Alamat"]);
      }

      targetSheet.appendRow([
        payload.timestamp,
        payload.name,
        "'" + payload.phone, 
        payload.email,
        payload.password,
        payload.address
      ]);

      return ContentService.createTextOutput(JSON.stringify({ status: "success" })).setMimeType(ContentService.MimeType.JSON);
    }
    
    // 2. JIKA YANG DIKIRIM ADALAH PESANAN (CHECKOUT)
    else {
      let targetSheet = SpreadsheetApp.getActiveSpreadsheet().getSheetByName(SHEET_PESANAN);
      if (!targetSheet) {
        targetSheet = SpreadsheetApp.getActiveSpreadsheet().insertSheet(SHEET_PESANAN);
        targetSheet.appendRow([
          "Waktu", "Order_ID", "Nama_Pelanggan", "Nomor_WA", "Email", 
          "Alamat", "Kurir", "Metode_Pembayaran", "Total_Harga", "Catatan", "Detail_Produk"
        ]);
      }
      
      const detailProduk = payload.cartItems ? payload.cartItems.map(item => item.name + " (x" + item.quantity + ")").join(", ") : "-";

      targetSheet.appendRow([
        payload.timestamp,
        payload.orderId || "-",
        payload.name || "-",
        "'" + (payload.phone || "-"), 
        payload.email || "-",
        payload.address || "-",
        payload.courier || "-",
        payload.paymentMethod || "-",
        payload.totalPrice || 0,
        payload.notes || "-",
        detailProduk
      ]);

      return ContentService.createTextOutput(JSON.stringify({ status: "success" })).setMimeType(ContentService.MimeType.JSON);
    }
  } catch (error) {
    return ContentService.createTextOutput(JSON.stringify({ status: "error", message: error.message })).setMimeType(ContentService.MimeType.JSON);
  }
}

function doOptions(e) {
  const headers = {
    "Access-Control-Allow-Origin": "*",
    "Access-Control-Allow-Methods": "GET, POST, OPTIONS",
    "Access-Control-Allow-Headers": "Content-Type",
    "Access-Control-Max-Age": "86400"
  };
  return ContentService.createTextOutput("").setMimeType(ContentService.MimeType.JSON).setHeaders(headers);
}