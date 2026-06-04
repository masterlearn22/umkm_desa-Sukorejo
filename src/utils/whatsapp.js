export const generateWhatsAppLink = (orderData, cartItems, cartTotal, lang) => {
  // Destination Phone Number (Admin BUMDes Sukorejo)
  // Hardcoded for now. In a real app this might come from env or config
  const adminPhone = "6281234567890"; 

  const isId = lang === 'id';
  const greeting = isId 
    ? "Halo Admin UMKM Desa Sukorejo, saya ingin melakukan pemesanan produk:"
    : "Hello Admin of Sukorejo Village UMKM, I would like to order the following products:";

  const detailHeader = isId ? "Detail Pesanan:" : "Order Details:";
  const formatPrice = (price) => {
    return new Intl.NumberFormat('id-ID', {
      style: 'currency',
      currency: 'IDR',
      minimumFractionDigits: 0
    }).format(price);
  };

  let itemsText = cartItems.map(item => {
    const itemName = isId ? item.Nama_Indo : (item.Nama_Eng || item.Nama_Indo);
    const itemTotal = formatPrice(item.Harga_Rp * item.quantity);
    return `- ${itemName} (x${item.quantity}) - ${itemTotal}`;
  }).join("\n");

  const shippingHeader = isId ? "Data Pengiriman:" : "Shipping Information:";
  const totalHeader = isId ? "Total Estimasi:" : "Total Estimates:";
  const invoiceHeader = isId ? "Nomor Invoice Database:" : "Database Invoice Number:";
  const closing = isId ? "Terima kasih!" : "Thank you!";
  
  const shippingDisclaimer = isId ? "(Belum termasuk ongkos kirim)" : "(Shipping cost not included)";

  const message = `[NAMA TOKO / BUMDES SUKOREJO DIGITAL CATALOG]
${greeting}

${detailHeader}
${itemsText}

${shippingHeader}
Nama: ${orderData.name}
WhatsApp: ${orderData.phone}
Negara: ${orderData.country}
Alamat: ${orderData.address}
Catatan: ${orderData.notes || '-'}

${totalHeader} ${formatPrice(cartTotal)} ${shippingDisclaimer}
${invoiceHeader} ${orderData.orderId}

${closing}`;

  const encodedMessage = encodeURIComponent(message);
  return `https://wa.me/${adminPhone}?text=${encodedMessage}`;
};
