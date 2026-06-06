const SHEET_PRODUK = "Produk";
const SHEET_PESANAN = "Pesanan";
const SHEET_PENGGUNA = "Pengguna";
const SHEET_PERMISSIONS = "Permissions";
const SHEET_PENGAJUAN = "Pengajuan_Penjual";

// Inisialisasi Tabel Izin Default
function initPermissions() {
  let sheet = SpreadsheetApp.getActiveSpreadsheet().getSheetByName(SHEET_PERMISSIONS);
  if (!sheet) {
    sheet = SpreadsheetApp.getActiveSpreadsheet().insertSheet(SHEET_PERMISSIONS);
    sheet.appendRow(["Role", "ManageProducts", "ManageOrders", "ManageUsers"]);
    sheet.appendRow(["admin", true, true, true]);
    sheet.appendRow(["penjual", true, true, false]);
    sheet.appendRow(["user", false, false, false]);
  }
  return sheet;
}

function getPermissionsObject(roleName) {
  const sheet = initPermissions();
  const data = sheet.getDataRange().getValues();
  let perms = { ManageProducts: false, ManageOrders: false, ManageUsers: false };
  
  for (let i = 1; i < data.length; i++) {
    if (data[i][0] === roleName) {
      perms = {
        ManageProducts: data[i][1] === true || data[i][1] === "TRUE" || data[i][1] === "true",
        ManageOrders: data[i][2] === true || data[i][2] === "TRUE" || data[i][2] === "true",
        ManageUsers: data[i][3] === true || data[i][3] === "TRUE" || data[i][3] === "true",
      };
      break;
    }
  }
  return perms;
}

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

function getColIndex(headers, colName) {
  return headers.findIndex(h => String(h).trim().toLowerCase() === colName.trim().toLowerCase());
}

function doPost(e) {
  try {
    const payload = JSON.parse(e.postData.contents);
    const action = payload.action;

    // 1. REGISTRASI PENGGUNA BARU
    if (action === 'register') {
      let sheet = SpreadsheetApp.getActiveSpreadsheet().getSheetByName(SHEET_PENGGUNA);
      if (!sheet) {
        sheet = SpreadsheetApp.getActiveSpreadsheet().insertSheet(SHEET_PENGGUNA);
        sheet.appendRow(["Waktu_Daftar", "Nama_Lengkap", "Nomor_WA", "Email", "Password_Hash", "Alamat", "Role", "ID_Pengguna", "Jenis_Kelamin", "Tanggal_Lahir"]);
      }

      const headers = sheet.getDataRange().getValues()[0];
      let newRow = new Array(headers.length).fill("");
      
      headers.forEach((h, i) => {
        const col = String(h).trim().toLowerCase();
        if (col === "waktu_daftar") newRow[i] = payload.timestamp || new Date().toISOString();
        else if (col === "nama_lengkap") newRow[i] = payload.name;
        else if (col === "nomor_wa") newRow[i] = "'" + payload.phone;
        else if (col === "email") newRow[i] = payload.email;
        else if (col === "password_hash") newRow[i] = payload.password;
        else if (col === "alamat") newRow[i] = payload.address || "";
        else if (col === "role") newRow[i] = "user";
        else if (col === "id_pengguna") newRow[i] = "USR-" + new Date().getTime();
      });

      sheet.appendRow(newRow);
      return ContentService.createTextOutput(JSON.stringify({ status: "success" })).setMimeType(ContentService.MimeType.JSON);
    }
    
    // 2. LOGIN
    else if (action === 'login') {
      let sheet = SpreadsheetApp.getActiveSpreadsheet().getSheetByName(SHEET_PENGGUNA);
      if (!sheet) return ContentService.createTextOutput(JSON.stringify({ status: "error", message: "Database pengguna belum siap." })).setMimeType(ContentService.MimeType.JSON);
      
      const data = sheet.getDataRange().getValues();
      const headers = data[0];
      const idxEmail = getColIndex(headers, "Email");
      const idxPass = getColIndex(headers, "Password_Hash");
      const idxRole = getColIndex(headers, "Role");
      const idxName = getColIndex(headers, "Nama_Lengkap");
      const idxPhone = getColIndex(headers, "Nomor_WA");
      const idxAddress = getColIndex(headers, "Alamat");
      const idxId = getColIndex(headers, "ID_Pengguna");
      const idxGender = getColIndex(headers, "Jenis_Kelamin");
      const idxDob = getColIndex(headers, "Tanggal_Lahir");
      
      if (idxEmail === -1 || idxPass === -1) return ContentService.createTextOutput(JSON.stringify({ status: "error", message: "Kolom Email/Password tidak ditemukan." })).setMimeType(ContentService.MimeType.JSON);

      let foundUser = null;
      let userRole = "user";
      
      for (let i = 1; i < data.length; i++) {
        const row = data[i];
        if (String(row[idxEmail]).trim().toLowerCase() === String(payload.email).trim().toLowerCase() && 
            String(row[idxPass]).trim() === String(payload.password).trim()) {
          
          userRole = (idxRole !== -1 && row[idxRole]) ? row[idxRole].toString().toLowerCase() : "user";
          foundUser = {
            name: idxName !== -1 ? row[idxName] : "",
            phone: idxPhone !== -1 && row[idxPhone] ? row[idxPhone].toString().replace("'", "") : "",
            email: row[idxEmail],
            address: idxAddress !== -1 ? row[idxAddress] : "",
            role: userRole,
            id_pengguna: idxId !== -1 ? row[idxId] : "",
            gender: idxGender !== -1 ? row[idxGender] : "",
            dob: idxDob !== -1 && row[idxDob] ? new Date(row[idxDob]).toISOString().split('T')[0] : ""
          };
          break;
        }
      }
      
      if (foundUser) {
        if (userRole === 'penjual') {
          let sheetPengajuan = SpreadsheetApp.getActiveSpreadsheet().getSheetByName(SHEET_PENGAJUAN);
          if (sheetPengajuan) {
            const dataPengajuan = sheetPengajuan.getDataRange().getValues();
            const hPengajuan = dataPengajuan[0];
            const pIdxEmail = getColIndex(hPengajuan, "Email_Pengguna");
            const pIdxStatus = getColIndex(hPengajuan, "Status_Pengajuan");
            const pIdxToko = getColIndex(hPengajuan, "Nama_Toko");
            
            for (let j = 1; j < dataPengajuan.length; j++) {
              if (String(dataPengajuan[j][pIdxEmail]).toLowerCase() === String(payload.email).toLowerCase() && 
                  dataPengajuan[j][pIdxStatus] === 'Disetujui') {
                foundUser.shopName = dataPengajuan[j][pIdxToko];
                break;
              }
            }
          }
        }

        const permissions = getPermissionsObject(userRole);
        return ContentService.createTextOutput(JSON.stringify({ status: "success", user: foundUser, permissions: permissions })).setMimeType(ContentService.MimeType.JSON);
      } else {
        return ContentService.createTextOutput(JSON.stringify({ status: "error", message: "Email atau Password salah, atau pengguna tidak ditemukan." })).setMimeType(ContentService.MimeType.JSON);
      }
    }

    // 3. UPDATE PROFIL
    else if (action === 'update_profile') {
      let sheet = SpreadsheetApp.getActiveSpreadsheet().getSheetByName(SHEET_PENGGUNA);
      if (!sheet) return ContentService.createTextOutput(JSON.stringify({ status: "error", message: "Sheet Pengguna tidak ditemukan." })).setMimeType(ContentService.MimeType.JSON);
      
      const data = sheet.getDataRange().getValues();
      const headers = data[0];
      const idxEmail = getColIndex(headers, "Email");
      
      let found = false;
      for (let i = 1; i < data.length; i++) {
        if (String(data[i][idxEmail]).trim().toLowerCase() === String(payload.email).trim().toLowerCase()) {
          // Cari indeks tiap kolom yang ingin diupdate dan set nilainya jika ketemu
          if (payload.name !== undefined) {
             const c = getColIndex(headers, "Nama_Lengkap");
             if (c !== -1) sheet.getRange(i + 1, c + 1).setValue(payload.name);
          }
          if (payload.phone !== undefined) {
             const c = getColIndex(headers, "Nomor_WA");
             if (c !== -1) sheet.getRange(i + 1, c + 1).setValue("'" + payload.phone);
          }
          if (payload.address !== undefined) {
             const c = getColIndex(headers, "Alamat");
             if (c !== -1) sheet.getRange(i + 1, c + 1).setValue(payload.address);
          }
          if (payload.gender !== undefined) {
             const c = getColIndex(headers, "Jenis_Kelamin");
             if (c !== -1) sheet.getRange(i + 1, c + 1).setValue(payload.gender);
          }
          if (payload.dob !== undefined) {
             const c = getColIndex(headers, "Tanggal_Lahir");
             if (c !== -1) sheet.getRange(i + 1, c + 1).setValue(payload.dob);
          }
          
          found = true;
          break;
        }
      }
      
      if (found) return ContentService.createTextOutput(JSON.stringify({ status: "success" })).setMimeType(ContentService.MimeType.JSON);
      else return ContentService.createTextOutput(JSON.stringify({ status: "error", message: "Pengguna tidak ditemukan." })).setMimeType(ContentService.MimeType.JSON);
    }

    // 4. UBAH PASSWORD
    else if (action === 'change_password') {
      let sheet = SpreadsheetApp.getActiveSpreadsheet().getSheetByName(SHEET_PENGGUNA);
      if (!sheet) return ContentService.createTextOutput(JSON.stringify({ status: "error", message: "Sheet Pengguna tidak ditemukan." })).setMimeType(ContentService.MimeType.JSON);
      
      const data = sheet.getDataRange().getValues();
      const headers = data[0];
      const idxEmail = getColIndex(headers, "Email");
      const idxPass = getColIndex(headers, "Password_Hash");
      
      let found = false;
      let oldPasswordMatch = false;
      
      for (let i = 1; i < data.length; i++) {
        if (String(data[i][idxEmail]).trim().toLowerCase() === String(payload.email).trim().toLowerCase()) {
          found = true;
          if (String(data[i][idxPass]).trim() === String(payload.oldPassword).trim()) {
            oldPasswordMatch = true;
            sheet.getRange(i + 1, idxPass + 1).setValue("'" + payload.newPassword);
          }
          break;
        }
      }
      
      if (!found) return ContentService.createTextOutput(JSON.stringify({ status: "error", message: "Pengguna tidak ditemukan." })).setMimeType(ContentService.MimeType.JSON);
      if (!oldPasswordMatch) return ContentService.createTextOutput(JSON.stringify({ status: "error", message: "Password lama salah." })).setMimeType(ContentService.MimeType.JSON);
      
      return ContentService.createTextOutput(JSON.stringify({ status: "success" })).setMimeType(ContentService.MimeType.JSON);
    }

    // 5. SUBMIT PENGAJUAN PENJUAL
    else if (action === 'submit_application') {
      let sheet = SpreadsheetApp.getActiveSpreadsheet().getSheetByName(SHEET_PENGAJUAN);
      if (!sheet) {
        sheet = SpreadsheetApp.getActiveSpreadsheet().insertSheet(SHEET_PENGAJUAN);
        sheet.appendRow(["Waktu_Pengajuan", "ID_Pengajuan", "Email_Pengguna", "Nama_Toko", "Deskripsi_Toko", "Alamat_Toko", "Status_Pengajuan"]);
      }
      
      const headers = sheet.getDataRange().getValues()[0];
      let newRow = new Array(headers.length).fill("");
      
      headers.forEach((h, i) => {
        const col = String(h).trim().toLowerCase();
        if (col === "waktu_pengajuan") newRow[i] = new Date().toISOString();
        else if (col === "id_pengajuan") newRow[i] = "APP-" + new Date().getTime();
        else if (col === "email_pengguna") newRow[i] = payload.email;
        else if (col === "nama_toko") newRow[i] = payload.shopName;
        else if (col === "deskripsi_toko") newRow[i] = payload.shopDescription;
        else if (col === "alamat_toko") newRow[i] = payload.shopAddress;
        else if (col === "status_pengajuan") newRow[i] = "Pending";
      });
      
      sheet.appendRow(newRow);
      return ContentService.createTextOutput(JSON.stringify({ status: "success" })).setMimeType(ContentService.MimeType.JSON);
    }

    // 6. GET PENGAJUAN PENJUAL
    else if (action === 'get_applications') {
      let sheet = SpreadsheetApp.getActiveSpreadsheet().getSheetByName(SHEET_PENGAJUAN);
      if (!sheet) return ContentService.createTextOutput("[]").setMimeType(ContentService.MimeType.JSON);
      
      const data = sheet.getDataRange().getValues();
      const headers = data[0];
      const apps = [];
      for (let i = 1; i < data.length; i++) {
        let app = {};
        headers.forEach((h, j) => {
          app[h] = data[i][j];
        });
        apps.push(app);
      }
      return ContentService.createTextOutput(JSON.stringify(apps)).setMimeType(ContentService.MimeType.JSON);
    }

    // 7. APPROVE PENGAJUAN
    else if (action === 'approve_application') {
      let sheetApp = SpreadsheetApp.getActiveSpreadsheet().getSheetByName(SHEET_PENGAJUAN);
      let sheetUser = SpreadsheetApp.getActiveSpreadsheet().getSheetByName(SHEET_PENGGUNA);
      
      if (!sheetApp || !sheetUser) return ContentService.createTextOutput(JSON.stringify({ status: "error", message: "Sheet tidak ditemukan." })).setMimeType(ContentService.MimeType.JSON);
      
      const dataApp = sheetApp.getDataRange().getValues();
      const hApp = dataApp[0];
      const idxAppId = getColIndex(hApp, "ID_Pengajuan");
      const idxAppStatus = getColIndex(hApp, "Status_Pengajuan");
      const idxAppEmail = getColIndex(hApp, "Email_Pengguna");
      
      let emailUser = "";
      
      // Update status di tabel pengajuan
      for (let i = 1; i < dataApp.length; i++) {
        if (dataApp[i][idxAppId] === payload.idPengajuan) {
          if (idxAppStatus !== -1) sheetApp.getRange(i + 1, idxAppStatus + 1).setValue(payload.newStatus);
          emailUser = dataApp[i][idxAppEmail];
          break;
        }
      }
      
      // Jika disetujui, update role di tabel pengguna
      if (emailUser && payload.newStatus === 'Disetujui') {
        const dataUser = sheetUser.getDataRange().getValues();
        const hUser = dataUser[0];
        const idxUserEmail = getColIndex(hUser, "Email");
        const idxUserRole = getColIndex(hUser, "Role");
        
        for (let j = 1; j < dataUser.length; j++) {
          if (dataUser[j][idxUserEmail] === emailUser) {
            if (idxUserRole !== -1) sheetUser.getRange(j + 1, idxUserRole + 1).setValue("penjual");
            break;
          }
        }
      }
      
      return ContentService.createTextOutput(JSON.stringify({ status: "success" })).setMimeType(ContentService.MimeType.JSON);
    }
    
    // 8. ORDER
    else if (action === 'order') {
      let sheet = SpreadsheetApp.getActiveSpreadsheet().getSheetByName(SHEET_PESANAN);
      if (!sheet) {
        sheet = SpreadsheetApp.getActiveSpreadsheet().insertSheet(SHEET_PESANAN);
        sheet.appendRow([
          "Waktu", "Order_ID", "Nama_Pelanggan", "Nomor_WA", "Email", 
          "Alamat", "Kurir", "Metode_Pembayaran", "Total_Harga", "Catatan", "Detail_Produk"
        ]);
      }
      const headers = sheet.getDataRange().getValues()[0];
      let newRow = new Array(headers.length).fill("-");
      const detailProduk = payload.cartItems ? payload.cartItems.map(item => item.name + " (x" + item.quantity + ")").join(", ") : "-";
      
      headers.forEach((h, i) => {
        const col = String(h).trim().toLowerCase();
        if (col === "waktu") newRow[i] = payload.timestamp || new Date().toISOString();
        else if (col === "order_id") newRow[i] = payload.orderId || "-";
        else if (col === "nama_pelanggan") newRow[i] = payload.name || "-";
        else if (col === "nomor_wa") newRow[i] = "'" + (payload.phone || "-");
        else if (col === "email") newRow[i] = payload.email || "-";
        else if (col === "alamat") newRow[i] = payload.address || "-";
        else if (col === "kurir") newRow[i] = payload.courier || "-";
        else if (col === "metode_pembayaran") newRow[i] = payload.paymentMethod || "-";
        else if (col === "total_harga") newRow[i] = payload.totalPrice || 0;
        else if (col === "catatan") newRow[i] = payload.notes || "-";
        else if (col === "detail_produk") newRow[i] = detailProduk;
      });
      
      sheet.appendRow(newRow);
      return ContentService.createTextOutput(JSON.stringify({ status: "success" })).setMimeType(ContentService.MimeType.JSON);
    }
    
    // 9. GET ORDERS
    else if (action === 'get_orders') {
      let sheet = SpreadsheetApp.getActiveSpreadsheet().getSheetByName(SHEET_PESANAN);
      if (!sheet) return ContentService.createTextOutput("[]").setMimeType(ContentService.MimeType.JSON);
      const data = sheet.getDataRange().getValues();
      const headers = data[0];
      const orders = [];
      for (let i = 1; i < data.length; i++) {
        let order = {};
        for (let j = 0; j < headers.length; j++) { order[headers[j]] = data[i][j]; }
        orders.push(order);
      }
      return ContentService.createTextOutput(JSON.stringify(orders)).setMimeType(ContentService.MimeType.JSON);
    }
    
    // 10. GET USERS
    else if (action === 'get_users') {
      let sheet = SpreadsheetApp.getActiveSpreadsheet().getSheetByName(SHEET_PENGGUNA);
      if (!sheet) return ContentService.createTextOutput("[]").setMimeType(ContentService.MimeType.JSON);
      const data = sheet.getDataRange().getValues();
      const headers = data[0];
      const users = [];
      for (let i = 1; i < data.length; i++) {
        let user = {};
        for (let j = 0; j < headers.length; j++) { user[headers[j]] = data[i][j]; }
        users.push(user);
      }
      return ContentService.createTextOutput(JSON.stringify(users)).setMimeType(ContentService.MimeType.JSON);
    }
    
    // 11. ADD PRODUCT
    else if (action === 'add_product') {
      let sheet = SpreadsheetApp.getActiveSpreadsheet().getSheetByName(SHEET_PRODUK);
      if (!sheet) return ContentService.createTextOutput(JSON.stringify({ status: "error", message: "Sheet Produk tidak ditemukan." })).setMimeType(ContentService.MimeType.JSON);
      const headers = sheet.getDataRange().getValues()[0];
      let newRow = new Array(headers.length).fill("-");
      headers.forEach((header, index) => {
        const h = header.toString().toLowerCase().trim();
        if (h === "id_produk") newRow[index] = "P" + new Date().getTime();
        else if (h === "nama_indo" || h === "nama" || h === "nama produk") newRow[index] = payload.nama;
        else if (h === "kategori") newRow[index] = payload.kategori;
        else if (h === "harga_rp" || h === "harga") newRow[index] = payload.harga;
        else if (h === "stok" || h === "berat_gram") newRow[index] = payload.stok || 1000;
        else if (h === "foto_url" || h === "gambar" || h === "url gambar") newRow[index] = payload.gambar;
        else if (h === "status") newRow[index] = "Ready";
        else if (h === "deskripsi_indo" || h === "deskripsi") newRow[index] = payload.deskripsi;
        else if (h === "id_pengguna") newRow[index] = payload.id_pengguna;
      });
      sheet.appendRow(newRow);
      return ContentService.createTextOutput(JSON.stringify({ status: "success" })).setMimeType(ContentService.MimeType.JSON);
    }
    
    // 12. UPDATE ROLE
    else if (action === 'update_role') {
      let sheet = SpreadsheetApp.getActiveSpreadsheet().getSheetByName(SHEET_PENGGUNA);
      if (!sheet) return ContentService.createTextOutput(JSON.stringify({ status: "error", message: "Sheet Pengguna tidak ditemukan." })).setMimeType(ContentService.MimeType.JSON);
      const data = sheet.getDataRange().getValues();
      const headers = data[0];
      const idxEmail = getColIndex(headers, "Email");
      const idxRole = getColIndex(headers, "Role");
      
      if (idxEmail === -1 || idxRole === -1) return ContentService.createTextOutput(JSON.stringify({ status: "error", message: "Kolom Email/Role tidak ditemukan." })).setMimeType(ContentService.MimeType.JSON);
      
      let found = false;
      for (let i = 1; i < data.length; i++) {
        if (String(data[i][idxEmail]).trim().toLowerCase() === String(payload.email).trim().toLowerCase()) {
          sheet.getRange(i + 1, idxRole + 1).setValue(payload.new_role);
          found = true;
          break;
        }
      }
      if (found) return ContentService.createTextOutput(JSON.stringify({ status: "success" })).setMimeType(ContentService.MimeType.JSON);
      else return ContentService.createTextOutput(JSON.stringify({ status: "error", message: "Pengguna tidak ditemukan." })).setMimeType(ContentService.MimeType.JSON);
    }
    
    // Fallback
    else {
      return ContentService.createTextOutput(JSON.stringify({ status: "error", message: "Action tidak valid." })).setMimeType(ContentService.MimeType.JSON);
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