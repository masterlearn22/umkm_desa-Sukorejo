const fs = require('fs');

async function fetchPlaces() {
  // Query Overpass API for nodes with amenity, shop, or landuse within 3km of -8.49, 114.17
  const query = `
    [out:json][timeout:25];
    (
      node["amenity"](around:3000,-8.49,114.17);
      node["shop"](around:3000,-8.49,114.17);
      way["amenity"](around:3000,-8.49,114.17);
      way["shop"](around:3000,-8.49,114.17);
    );
    out body;
    >;
    out skel qt;
  `;

  try {
    const response = await fetch('https://overpass-api.de/api/interpreter', {
      method: 'POST',
      body: query
    });
    const data = await response.json();
    
    let csv = "no|nama tempat|jenis tempat|titik koordinat di maps|review maps\n";
    let count = 1;
    
    for (const element of data.elements) {
      if (element.tags && element.tags.name) {
        let type = element.tags.amenity || element.tags.shop || element.tags.landuse || 'Lainnya';
        let lat = element.lat || (element.center && element.center.lat) || '-8.49';
        let lon = element.lon || (element.center && element.center.lon) || '114.17';
        
        // Translate type
        let jenis = type;
        if (type === 'place_of_worship') jenis = 'Tempat Ibadah';
        else if (type === 'school') jenis = 'Sekolah';
        else if (type === 'hospital' || type === 'clinic') jenis = 'Kesehatan';
        else if (type === 'convenience' || type === 'supermarket') jenis = 'Toko / Minimarket';
        else if (type === 'laundry') jenis = 'Laundry';
        else if (type === 'restaurant' || type === 'cafe') jenis = 'Tempat Makan';
        else if (type === 'fuel') jenis = 'SPBU';
        else if (type === 'marketplace') jenis = 'Pasar';
        
        csv += `${count}|${element.tags.name}|${jenis}|${lat}, ${lon}|-\n`;
        count++;
      }
    }
    
    fs.writeFileSync('places.csv', csv);
    console.log(`Found ${count - 1} places.`);
  } catch (error) {
    console.error("Error fetching places:", error);
  }
}

fetchPlaces();
