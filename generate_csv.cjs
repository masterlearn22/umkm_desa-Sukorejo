const fs = require('fs');

try {
  const data = fs.readFileSync('src/services/api.js', 'utf8');
  const match = data.match(/const mockProducts = (\[.*?\]);/s);
  
  if (match) {
    const arr = eval(match[1]);
    if (arr.length) {
      const keys = Object.keys(arr[0]);
      // Append Nomor_WA header since we'll add it
      keys.push('Nomor_WA');

      const rows = arr.map((obj, index) => {
        // Mock different WA numbers based on index, exactly like api.js does
        const WA = `628123456789${index % 10}`;
        
        return keys.map(k => {
          let val = (k === 'Nomor_WA') ? WA : obj[k];
          // Escape quotes
          const escaped = String(val).replace(/"/g, '""');
          return `"${escaped}"`;
        }).join(',');
      });
      
      const csv = [keys.join(','), ...rows].join('\n');
      fs.writeFileSync('Data_Produk_BUMDes.csv', csv);
      console.log('CSV Created successfully!');
    }
  } else {
    console.log('mockProducts not found');
  }
} catch (e) {
  console.error(e);
}
