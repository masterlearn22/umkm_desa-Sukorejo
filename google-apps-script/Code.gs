const SHEET_PRODUK = "Produk";
const SHEET_PESANAN = "Pesanan";
const SHEET_PENGGUNA = "Pengguna";
const SHEET_PERMISSIONS = "Permissions";
const SHEET_PENGAJUAN = "Pengajuan_Penjual";
const SHEET_ARTIKEL = "Artikel";

// Inisialisasi Tabel Izin Default
function initPermissions() {
  let sheet = SpreadsheetApp.getActiveSpreadsheet().getSheetByName(SHEET_PERMISSIONS);
  if (!sheet) {
    sheet = SpreadsheetApp.getActiveSpreadsheet().insertSheet(SHEET_PERMISSIONS);
    sheet.appendRow(["Role", "ManageProducts", "ManageOrders", "ManageUsers", "ManageArticles"]);
    sheet.appendRow(["admin", true, true, true, true]);
    sheet.appendRow(["penjual", true, true, false, false]);
    sheet.appendRow(["user", false, false, false, false]);
  }
  return sheet;
}

function getPermissionsObject(roleName) {
  const sheet = initPermissions();
  const data = sheet.getDataRange().getValues();
  let perms = { ManageProducts: false, ManageOrders: false, ManageUsers: false, ManageArticles: false };
  
  for (let i = 1; i < data.length; i++) {
    if (data[i][0] === roleName) {
      perms = {
        ManageProducts: data[i][1] === true || data[i][1] === "TRUE" || data[i][1] === "true",
        ManageOrders: data[i][2] === true || data[i][2] === "TRUE" || data[i][2] === "true",
        ManageUsers: data[i][3] === true || data[i][3] === "TRUE" || data[i][3] === "true",
        ManageArticles: data[i][4] === true || data[i][4] === "TRUE" || data[i][4] === "true",
      };
      break;
    }
  }
  return perms;
}

function doGet(e) {
  try {
    const sheetProduk = SpreadsheetApp.getActiveSpreadsheet().getSheetByName(SHEET_PRODUK);
    const sheetPengguna = SpreadsheetApp.getActiveSpreadsheet().getSheetByName(SHEET_PENGGUNA);
    if (!sheetProduk) return ContentService.createTextOutput("[]").setMimeType(ContentService.MimeType.JSON);

    const dataProduk = sheetProduk.getDataRange().getValues();
    const headersProduk = dataProduk[0];
    const products = [];

    let userWaMap = {};
    if (sheetPengguna) {
      const dataPengguna = sheetPengguna.getDataRange().getValues();
      const headersPengguna = dataPengguna[0];
      const idxIdPengguna = headersPengguna.indexOf("ID_Pengguna");
      const idxWa = headersPengguna.indexOf("Nomor_WA");
      if (idxIdPengguna !== -1 && idxWa !== -1) {
        for (let k = 1; k < dataPengguna.length; k++) {
          userWaMap[dataPengguna[k][idxIdPengguna]] = dataPengguna[k][idxWa] ? dataPengguna[k][idxWa].toString().replace("'", "") : "";
        }
      }
    }

    for (let i = 1; i < dataProduk.length; i++) {
      let product = {};
      for (let j = 0; j < headersProduk.length; j++) {
        product[headersProduk[j]] = dataProduk[i][j];
      }
      if (product.ID_Pengguna && userWaMap[product.ID_Pengguna]) {
        product.Nomor_WA = userWaMap[product.ID_Pengguna];
      } else {
        product.Nomor_WA = "";
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

    // 1. REGISTRASI PENGGUNA BARU
    if (action === 'register') {
      let targetSheet = SpreadsheetApp.getActiveSpreadsheet().getSheetByName(SHEET_PENGGUNA);
      if (!targetSheet) {
        targetSheet = SpreadsheetApp.getActiveSpreadsheet().insertSheet(SHEET_PENGGUNA);
        targetSheet.appendRow(["Waktu_Daftar", "Nama_Lengkap", "Nomor_WA", "Email", "Password_Hash", "Alamat", "Role", "ID_Pengguna", "Jenis_Kelamin", "Tanggal_Lahir"]);
      }

      const role = "user";
      const idPengguna = "USR-" + new Date().getTime();

      targetSheet.appendRow([
        payload.timestamp,
        payload.name,
        "'" + payload.phone, 
        payload.email,
        payload.password,
        payload.address,
        role,
        idPengguna,
        "", // Jenis Kelamin
        ""  // Tanggal Lahir
      ]);

      return ContentService.createTextOutput(JSON.stringify({ status: "success" })).setMimeType(ContentService.MimeType.JSON);
    }
    
    // 2. LOGIN
    else if (action === 'login') {
      let targetSheet = SpreadsheetApp.getActiveSpreadsheet().getSheetByName(SHEET_PENGGUNA);
      if (!targetSheet) {
        return ContentService.createTextOutput(JSON.stringify({ status: "error", message: "Database pengguna belum siap." })).setMimeType(ContentService.MimeType.JSON);
      }
      
      const data = targetSheet.getDataRange().getValues();
      let foundUser = null;
      let userRole = "user";
      
      for (let i = 1; i < data.length; i++) {
        const row = data[i];
        if (String(row[3]).trim() === String(payload.email).trim() && String(row[4]).trim() === String(payload.password).trim()) {
          userRole = row[6] ? row[6].toString().toLowerCase() : "user";
          foundUser = {
            name: row[1],
            phone: row[2] ? row[2].toString().replace("'", "") : "",
            email: row[3],
            address: row[5],
            role: userRole,
            id_pengguna: row[7] || "",
            gender: row[8] || "",
            dob: row[9] ? new Date(row[9]).toISOString().split('T')[0] : "",
            avatar: row[10] || ""
          };
          break;
        }
      }
      
      if (foundUser) {
        // Cek juga nama toko di pengajuan (jika dia penjual)
        if (userRole === 'penjual') {
          let sheetPengajuan = SpreadsheetApp.getActiveSpreadsheet().getSheetByName(SHEET_PENGAJUAN);
          if (sheetPengajuan) {
            const dataPengajuan = sheetPengajuan.getDataRange().getValues();
            for (let j = 1; j < dataPengajuan.length; j++) {
              if (String(dataPengajuan[j][2]) === String(payload.email) && dataPengajuan[j][6] === 'Disetujui') {
                foundUser.shopName = dataPengajuan[j][3]; // Nama Toko
                break;
              }
            }
          }
        }

        const permissions = getPermissionsObject(userRole);
        return ContentService.createTextOutput(JSON.stringify({ 
          status: "success", 
          user: foundUser,
          permissions: permissions 
        })).setMimeType(ContentService.MimeType.JSON);
      } else {
        return ContentService.createTextOutput(JSON.stringify({ status: "error", message: "Email atau Password salah, atau pengguna tidak ditemukan." })).setMimeType(ContentService.MimeType.JSON);
      }
    }

    // 3. UPDATE PROFIL
    else if (action === 'update_profile') {
      let sheet = SpreadsheetApp.getActiveSpreadsheet().getSheetByName(SHEET_PENGGUNA);
      if (!sheet) return ContentService.createTextOutput(JSON.stringify({ status: "error", message: "Sheet Pengguna tidak ditemukan." })).setMimeType(ContentService.MimeType.JSON);
      
      const data = sheet.getDataRange().getValues();
      let found = false;
      
      for (let i = 1; i < data.length; i++) {
        if (String(data[i][3]) === String(payload.email)) {
          if (payload.name !== undefined) sheet.getRange(i + 1, 2).setValue(payload.name);
          if (payload.phone !== undefined) sheet.getRange(i + 1, 3).setValue("'" + payload.phone);
          if (payload.address !== undefined) sheet.getRange(i + 1, 6).setValue(payload.address);
          if (payload.gender !== undefined) sheet.getRange(i + 1, 9).setValue(payload.gender);
          if (payload.dob !== undefined) sheet.getRange(i + 1, 10).setValue(payload.dob);
          if (payload.avatar !== undefined) sheet.getRange(i + 1, 11).setValue(payload.avatar);
          
          found = true;
          break;
        }
      }
      
      if (found) {
        return ContentService.createTextOutput(JSON.stringify({ status: "success" })).setMimeType(ContentService.MimeType.JSON);
      } else {
        return ContentService.createTextOutput(JSON.stringify({ status: "error", message: "Pengguna tidak ditemukan." })).setMimeType(ContentService.MimeType.JSON);
      }
    }

    // 4. UBAH PASSWORD
    else if (action === 'change_password') {
      let sheet = SpreadsheetApp.getActiveSpreadsheet().getSheetByName(SHEET_PENGGUNA);
      if (!sheet) return ContentService.createTextOutput(JSON.stringify({ status: "error", message: "Sheet Pengguna tidak ditemukan." })).setMimeType(ContentService.MimeType.JSON);
      
      const data = sheet.getDataRange().getValues();
      let found = false;
      let oldPasswordMatch = false;
      
      for (let i = 1; i < data.length; i++) {
        if (String(data[i][3]).trim() === String(payload.email).trim()) {
          found = true;
          let debugDbPass = String(data[i][4]).trim();
          if (debugDbPass === String(payload.oldPassword).trim()) {
            oldPasswordMatch = true;
            sheet.getRange(i + 1, 5).setValue("'" + payload.newPassword);
          }
          break;
        }
      }
      
      if (!found) return ContentService.createTextOutput(JSON.stringify({ status: "error", message: "Pengguna tidak ditemukan." })).setMimeType(ContentService.MimeType.JSON);
      if (!oldPasswordMatch) {
         return ContentService.createTextOutput(JSON.stringify({ status: "error", message: "Password lama salah." })).setMimeType(ContentService.MimeType.JSON);
      }
      
      return ContentService.createTextOutput(JSON.stringify({ status: "success" })).setMimeType(ContentService.MimeType.JSON);
    }

    // 5. SUBMIT PENGAJUAN PENJUAL
    else if (action === 'submit_application') {
      let sheet = SpreadsheetApp.getActiveSpreadsheet().getSheetByName(SHEET_PENGAJUAN);
      if (!sheet) {
        sheet = SpreadsheetApp.getActiveSpreadsheet().insertSheet(SHEET_PENGAJUAN);
        sheet.appendRow(["Waktu_Pengajuan", "ID_Pengajuan", "Email_Pengguna", "Nama_Toko", "Deskripsi_Toko", "Alamat_Toko", "Status_Pengajuan"]);
      }
      
      const idPengajuan = "APP-" + new Date().getTime();
      
      sheet.appendRow([
        new Date().toISOString(),
        idPengajuan,
        payload.email,
        payload.shopName,
        payload.shopDescription,
        payload.shopAddress,
        "Pending"
      ]);
      return ContentService.createTextOutput(JSON.stringify({ status: "success" })).setMimeType(ContentService.MimeType.JSON);
    }

    // 6. GET PENGAJUAN PENJUAL
    else if (action === 'get_applications') {
      let sheet = SpreadsheetApp.getActiveSpreadsheet().getSheetByName(SHEET_PENGAJUAN);
      if (!sheet) return ContentService.createTextOutput("[]").setMimeType(ContentService.MimeType.JSON);
      
      const data = sheet.getDataRange().getValues();
      const apps = [];
      for (let i = 1; i < data.length; i++) {
        apps.push({
          Waktu_Pengajuan: data[i][0],
          ID_Pengajuan: data[i][1],
          Email_Pengguna: data[i][2],
          Nama_Toko: data[i][3],
          Deskripsi_Toko: data[i][4],
          Alamat_Toko: data[i][5],
          Status_Pengajuan: data[i][6]
        });
      }
      return ContentService.createTextOutput(JSON.stringify(apps)).setMimeType(ContentService.MimeType.JSON);
    }

    // 7. APPROVE PENGAJUAN
    else if (action === 'approve_application') {
      let sheetApp = SpreadsheetApp.getActiveSpreadsheet().getSheetByName(SHEET_PENGAJUAN);
      let sheetUser = SpreadsheetApp.getActiveSpreadsheet().getSheetByName(SHEET_PENGGUNA);
      
      if (!sheetApp || !sheetUser) return ContentService.createTextOutput(JSON.stringify({ status: "error", message: "Sheet tidak ditemukan." })).setMimeType(ContentService.MimeType.JSON);
      
      const dataApp = sheetApp.getDataRange().getValues();
      let emailUser = "";
      
      // Update status di tabel pengajuan
      for (let i = 1; i < dataApp.length; i++) {
        if (dataApp[i][1] === payload.idPengajuan) {
          sheetApp.getRange(i + 1, 7).setValue(payload.newStatus); // Status kolom ke-7
          emailUser = dataApp[i][2]; // Email kolom ke-3
          break;
        }
      }
      
      // Jika disetujui, update role di tabel pengguna
      if (emailUser && payload.newStatus === 'Disetujui') {
        const dataUser = sheetUser.getDataRange().getValues();
        for (let j = 1; j < dataUser.length; j++) {
          if (dataUser[j][3] === emailUser) {
            sheetUser.getRange(j + 1, 7).setValue("penjual");
            break;
          }
        }
      }
      
      return ContentService.createTextOutput(JSON.stringify({ status: "success" })).setMimeType(ContentService.MimeType.JSON);
    }
    
    // 8. PESANAN
    else if (action === 'order') {
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
        payload.timestamp, payload.orderId || "-", payload.name || "-", "'" + (payload.phone || "-"), 
        payload.email || "-", payload.address || "-", payload.courier || "-", payload.paymentMethod || "-",
        payload.totalPrice || 0, payload.notes || "-", detailProduk
      ]);
      return ContentService.createTextOutput(JSON.stringify({ status: "success" })).setMimeType(ContentService.MimeType.JSON);
    }

    // 9. DAPATKAN SEMUA PESANAN
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

    // 10. DAPATKAN SEMUA PENGGUNA
    else if (action === 'get_users') {
      let sheet = SpreadsheetApp.getActiveSpreadsheet().getSheetByName(SHEET_PENGGUNA);
      if (!sheet) return ContentService.createTextOutput("[]").setMimeType(ContentService.MimeType.JSON);
      const data = sheet.getDataRange().getValues();
      const users = [];
      for (let i = 1; i < data.length; i++) {
        users.push({
          Waktu_Daftar: data[i][0], Nama_Lengkap: data[i][1], Nomor_WA: data[i][2],
          Email: data[i][3], Alamat: data[i][5], Role: data[i][6] || "user", ID_Pengguna: data[i][7] || ""
        });
      }
      return ContentService.createTextOutput(JSON.stringify(users)).setMimeType(ContentService.MimeType.JSON);
    }

    // 11. TAMBAH PRODUK (DIPERBAIKI)
    else if (action === 'add_product') {
      let sheet = SpreadsheetApp.getActiveSpreadsheet().getSheetByName(SHEET_PRODUK);
      if (!sheet) return ContentService.createTextOutput(JSON.stringify({ status: "error", message: "Sheet Produk tidak ditemukan." })).setMimeType(ContentService.MimeType.JSON);
      
      const headers = sheet.getDataRange().getValues()[0];
      let newRow = new Array(headers.length).fill("-"); // Default nilai adalah "-"
      
      headers.forEach((header, index) => {
        const h = header.toString().toLowerCase().trim();
        if (h === "id_produk") newRow[index] = "P" + new Date().getTime();
        else if (h === "nama_indo" || h === "nama" || h === "nama produk") newRow[index] = payload.nama || "-";
        else if (h === "kategori") newRow[index] = payload.kategori || "-";
        else if (h === "harga_rp" || h === "harga") newRow[index] = payload.harga || 0;
        else if (h === "stok" || h === "berat_gram") newRow[index] = payload.stok || 1000;
        else if (h === "foto_url" || h === "gambar" || h === "url gambar") newRow[index] = payload.gambar || "-";
        else if (h === "status") newRow[index] = "Ready";
        else if (h === "deskripsi_indo" || h === "deskripsi") newRow[index] = payload.deskripsi || "-";
        else if (h === "id_pengguna") newRow[index] = payload.id_pengguna || "-";
      });
      
      sheet.appendRow(newRow);
      return ContentService.createTextOutput(JSON.stringify({ status: "success" })).setMimeType(ContentService.MimeType.JSON);
    }

    // 12. UPDATE ROLE PENGGUNA
    else if (action === 'update_role') {
      let sheet = SpreadsheetApp.getActiveSpreadsheet().getSheetByName(SHEET_PENGGUNA);
      if (!sheet) return ContentService.createTextOutput(JSON.stringify({ status: "error", message: "Sheet Pengguna tidak ditemukan." })).setMimeType(ContentService.MimeType.JSON);
      const data = sheet.getDataRange().getValues();
      let found = false;
      for (let i = 1; i < data.length; i++) {
        if (data[i][3] === payload.email) {
          sheet.getRange(i + 1, 7).setValue(payload.new_role);
          found = true;
          break;
        }
      }
      if (found) return ContentService.createTextOutput(JSON.stringify({ status: "success" })).setMimeType(ContentService.MimeType.JSON);
      else return ContentService.createTextOutput(JSON.stringify({ status: "error", message: "Pengguna tidak ditemukan." })).setMimeType(ContentService.MimeType.JSON);
    }

    // 13. GET ARTIKEL
    else if (action === 'get_articles') {
      let sheet = SpreadsheetApp.getActiveSpreadsheet().getSheetByName(SHEET_ARTIKEL);
      if (!sheet) return ContentService.createTextOutput("[]").setMimeType(ContentService.MimeType.JSON);
      const data = sheet.getDataRange().getValues();
      const headers = data[0];
      const articles = [];
      for (let i = 1; i < data.length; i++) {
        let article = {};
        for (let j = 0; j < headers.length; j++) { 
          article[headers[j]] = data[i][j]; 
        }
        articles.push(article);
      }
      return ContentService.createTextOutput(JSON.stringify(articles)).setMimeType(ContentService.MimeType.JSON);
    }

    // 14. ADD ARTIKEL
    else if (action === 'add_article') {
      let sheet = SpreadsheetApp.getActiveSpreadsheet().getSheetByName(SHEET_ARTIKEL);
      if (!sheet) {
        sheet = SpreadsheetApp.getActiveSpreadsheet().insertSheet(SHEET_ARTIKEL);
      }
      
      let data = sheet.getDataRange().getValues();
      // Jika sheet kosong melompong, inisialisasi header
      if (!data || !data[0] || data[0][0] === "") {
        sheet.appendRow(["ID_Artikel", "Judul", "Konten", "Penulis", "Tanggal", "Gambar", "Status"]);
        data = sheet.getDataRange().getValues();
      }
      
      const headers = data[0];
      let newRow = new Array(headers.length).fill("");
      
      headers.forEach((h, i) => {
        const col = String(h).trim().toLowerCase();
        if (col === "id_artikel") newRow[i] = "ART-" + new Date().getTime();
        else if (col === "judul") newRow[i] = payload.judul || "";
        else if (col === "konten") newRow[i] = payload.konten || "";
        else if (col === "penulis") newRow[i] = payload.penulis || "Admin";
        else if (col === "tanggal") newRow[i] = new Date().toISOString();
        else if (col === "gambar") newRow[i] = payload.gambar || "";
        else if (col === "status") newRow[i] = payload.status || "Draft";
      });
      sheet.appendRow(newRow);
      return ContentService.createTextOutput(JSON.stringify({ status: "success" })).setMimeType(ContentService.MimeType.JSON);
    }

    // 15. UPDATE ARTIKEL
    else if (action === 'update_article') {
      let sheet = SpreadsheetApp.getActiveSpreadsheet().getSheetByName(SHEET_ARTIKEL);
      if (!sheet) return ContentService.createTextOutput(JSON.stringify({ status: "error", message: "Sheet Artikel tidak ditemukan." })).setMimeType(ContentService.MimeType.JSON);
      
      const data = sheet.getDataRange().getValues();
      const headers = data[0];
      let getColIdx = (name) => headers.findIndex(h => String(h).trim().toLowerCase() === name.trim().toLowerCase());
      
      const idxId = getColIdx("ID_Artikel");
      
      let found = false;
      for (let i = 1; i < data.length; i++) {
        if (data[i][idxId] === payload.id_artikel) {
          if (payload.judul !== undefined) sheet.getRange(i + 1, getColIdx("Judul") + 1).setValue(payload.judul);
          if (payload.konten !== undefined) sheet.getRange(i + 1, getColIdx("Konten") + 1).setValue(payload.konten);
          if (payload.gambar !== undefined) sheet.getRange(i + 1, getColIdx("Gambar") + 1).setValue(payload.gambar);
          if (payload.status !== undefined) sheet.getRange(i + 1, getColIdx("Status") + 1).setValue(payload.status);
          
          found = true;
          break;
        }
      }
      if (found) return ContentService.createTextOutput(JSON.stringify({ status: "success" })).setMimeType(ContentService.MimeType.JSON);
      else return ContentService.createTextOutput(JSON.stringify({ status: "error", message: "Artikel tidak ditemukan." })).setMimeType(ContentService.MimeType.JSON);
    }

    // 16. DELETE ARTIKEL
    else if (action === 'delete_article') {
      let sheet = SpreadsheetApp.getActiveSpreadsheet().getSheetByName(SHEET_ARTIKEL);
      if (!sheet) return ContentService.createTextOutput(JSON.stringify({ status: "error", message: "Sheet Artikel tidak ditemukan." })).setMimeType(ContentService.MimeType.JSON);
      
      const data = sheet.getDataRange().getValues();
      const headers = data[0];
      let getColIdx = (name) => headers.findIndex(h => String(h).trim().toLowerCase() === name.trim().toLowerCase());
      const idxId = getColIdx("ID_Artikel");
      
      let found = false;
      for (let i = 1; i < data.length; i++) {
        if (data[i][idxId] === payload.id_artikel) {
          sheet.deleteRow(i + 1);
          found = true;
          break;
        }
      }
      if (found) return ContentService.createTextOutput(JSON.stringify({ status: "success" })).setMimeType(ContentService.MimeType.JSON);
      else return ContentService.createTextOutput(JSON.stringify({ status: "error", message: "Artikel tidak ditemukan." })).setMimeType(ContentService.MimeType.JSON);
    }
    
    // 17. UPLOAD IMAGE TO DRIVE
    else if (action === 'upload_image') {
      try {
        const folder = DriveApp.getFolderById(payload.folderId);
        const base64String = payload.base64Data;
        const contentType = base64String.substring(5, base64String.indexOf(';'));
        const bytes = Utilities.base64Decode(base64String.split(',')[1]);
        
        const blob = Utilities.newBlob(bytes, contentType, payload.filename);
        const file = folder.createFile(blob);
        
        file.setSharing(DriveApp.Access.ANYONE_WITH_LINK, DriveApp.Permission.VIEW);
        
        const fileUrl = "https://drive.google.com/uc?export=view&id=" + file.getId();
        return ContentService.createTextOutput(JSON.stringify({ status: "success", url: fileUrl })).setMimeType(ContentService.MimeType.JSON);
      } catch (err) {
        return ContentService.createTextOutput(JSON.stringify({ status: "error", message: err.message })).setMimeType(ContentService.MimeType.JSON);
      }
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