// 🌍 GPS Geotagging System für Costa Rica
// Automatische Ortserkennung aus EXIF-Daten

// Vereinfachte EXIF-Reader (ohne externe Bibliothek)
// In Produktion würde man exifreader oder piexifjs verwenden

// Costa Rica GPS-Bereiche und POIs
const costaRicaLocations = {
  // San José Bereich
  sanJose: {
    center: { lat: 9.9281, lng: -84.0907 },
    radius: 15, // km
    name: 'San José',
    category: 'stadt',
    pois: [
      { name: 'Flughafen Juan Santamaría (SJO)', lat: 9.9937, lng: -84.2088, category: 'anreise' },
      { name: 'Centro San José', lat: 9.9281, lng: -84.0907, category: 'erkundung' },
      { name: 'Mercado Central', lat: 9.9334, lng: -84.0789, category: 'erkundung' },
      { name: 'Teatro Nacional', lat: 9.9326, lng: -84.0787, category: 'kultur' }
    ]
  },

  // Escazú - dein Hauptort!
  escazu: {
    center: { lat: 9.9189, lng: -84.1370 },
    radius: 8, // km
    name: 'Escazú',
    category: 'ankunft',
    pois: [
      { name: 'Centro Escazú', lat: 9.9189, lng: -84.1370, category: 'erkundung' },
      { name: 'Multiplaza Escazú', lat: 9.9167, lng: -84.1297, category: 'erkundung' },
      { name: 'Hotel Belmont Escazú', lat: 9.9156, lng: -84.1389, category: 'ankunft' },
      { name: 'Restaurants Escazú', lat: 9.9189, lng: -84.1370, category: 'kulinarik' },
      { name: 'Bars Escazú', lat: 9.9200, lng: -84.1350, category: 'nachtleben' }
    ]
  },

  // Manuel Antonio - Natur & Tiere
  manuelAntonio: {
    center: { lat: 9.3908, lng: -84.1417 },
    radius: 12, // km
    name: 'Manuel Antonio',
    category: 'natur',
    pois: [
      { name: 'Manuel Antonio Nationalpark', lat: 9.3908, lng: -84.1417, category: 'natur' },
      { name: 'Playa Manuel Antonio', lat: 9.3856, lng: -84.1494, category: 'strand' },
      { name: 'Playa Espadilla', lat: 9.3928, lng: -84.1500, category: 'strand' },
      { name: 'Sloth Sanctuary', lat: 9.3850, lng: -84.1400, category: 'tierwelt' },
      { name: 'Zip-Line Manuel Antonio', lat: 9.3950, lng: -84.1350, category: 'abenteuer' }
    ]
  },

  // Monteverde - Abenteuer
  monteverde: {
    center: { lat: 10.3181, lng: -84.8066 },
    radius: 10, // km
    name: 'Monteverde',
    category: 'abenteuer',
    pois: [
      { name: 'Monteverde Cloud Forest', lat: 10.3181, lng: -84.8066, category: 'natur' },
      { name: 'Sky Adventures Zip-Line', lat: 10.3200, lng: -84.8100, category: 'abenteuer' },
      { name: 'Selvatura Park', lat: 10.3250, lng: -84.8150, category: 'abenteuer' },
      { name: 'Monteverde Coffee Tours', lat: 10.3150, lng: -84.8050, category: 'erkundung' }
    ]
  },

  // Tamarindo - Strand
  tamarindo: {
    center: { lat: 10.2994, lng: -85.8397 },
    radius: 8, // km
    name: 'Tamarindo',
    category: 'strand',
    pois: [
      { name: 'Playa Tamarindo', lat: 10.2994, lng: -85.8397, category: 'strand' },
      { name: 'Tamarindo Beach Bars', lat: 10.2990, lng: -85.8390, category: 'nachtleben' },
      { name: 'Surf Spots Tamarindo', lat: 10.3000, lng: -85.8400, category: 'abenteuer' },
      { name: 'Restaurants Tamarindo', lat: 10.2985, lng: -85.8385, category: 'kulinarik' }
    ]
  },

  // Arenal - Vulkan
  arenal: {
    center: { lat: 10.4630, lng: -84.7033 },
    radius: 15, // km
    name: 'Arenal',
    category: 'natur',
    pois: [
      { name: 'Arenal Vulkan', lat: 10.4630, lng: -84.7033, category: 'natur' },
      { name: 'La Fortuna', lat: 10.4697, lng: -84.6431, category: 'erkundung' },
      { name: 'Arenal Hot Springs', lat: 10.4650, lng: -84.7000, category: 'abenteuer' },
      { name: 'Hanging Bridges Arenal', lat: 10.4600, lng: -84.7100, category: 'abenteuer' }
    ]
  },

  // Poás Vulkan
  poas: {
    center: { lat: 10.1989, lng: -84.2328 },
    radius: 8, // km
    name: 'Poás',
    category: 'natur',
    pois: [
      { name: 'Poás Vulkan Nationalpark', lat: 10.1989, lng: -84.2328, category: 'natur' },
      { name: 'Poás Krater', lat: 10.1980, lng: -84.2330, category: 'natur' }
    ]
  },

  // Jaco - Strand & Party
  jaco: {
    center: { lat: 9.6146, lng: -84.6297 },
    radius: 6, // km
    name: 'Jacó',
    category: 'strand',
    pois: [
      { name: 'Playa Jacó', lat: 9.6146, lng: -84.6297, category: 'strand' },
      { name: 'Jacó Nightlife', lat: 9.6150, lng: -84.6290, category: 'nachtleben' },
      { name: 'Jacó Surf', lat: 9.6140, lng: -84.6300, category: 'abenteuer' }
    ]
  },

  // Puerto Viejo - Karibik
  puertoViejo: {
    center: { lat: 9.6533, lng: -82.7581 },
    radius: 10, // km
    name: 'Puerto Viejo',
    category: 'strand',
    pois: [
      { name: 'Puerto Viejo Beach', lat: 9.6533, lng: -82.7581, category: 'strand' },
      { name: 'Cahuita Nationalpark', lat: 9.7358, lng: -82.7881, category: 'natur' },
      { name: 'Sloth Sanctuary Cahuita', lat: 9.7200, lng: -82.7700, category: 'tierwelt' }
    ]
  }
};

/**
 * 📷 Extrahiert GPS-Daten aus Bildern (vereinfachte Version)
 * In Produktion: npm install exifreader
 */
export async function extractGPSFromImage(file) {
  try {
    // Simuliere GPS-Extraktion für Demo
    // In echter Anwendung würde hier EXIF-Parsing stattfinden
    
    // Für Demo: Simuliere GPS-Daten basierend auf Dateiname
    const fileName = file.name.toLowerCase();
    
    // Simulierte GPS-Daten für verschiedene Orte
    if (fileName.includes('escazu') || fileName.includes('hotel')) {
      return { lat: 9.9189, lng: -84.1370 }; // Escazú
    }
    if (fileName.includes('san_jose') || fileName.includes('airport')) {
      return { lat: 9.9937, lng: -84.2088 }; // Flughafen
    }
    if (fileName.includes('manuel') || fileName.includes('antonio')) {
      return { lat: 9.3908, lng: -84.1417 }; // Manuel Antonio
    }
    if (fileName.includes('tamarindo') || fileName.includes('beach')) {
      return { lat: 10.2994, lng: -85.8397 }; // Tamarindo
    }
    if (fileName.includes('monteverde') || fileName.includes('zip')) {
      return { lat: 10.3181, lng: -84.8066 }; // Monteverde
    }
    if (fileName.includes('arenal') || fileName.includes('volcano')) {
      return { lat: 10.4630, lng: -84.7033 }; // Arenal
    }
    
    // Zufällige Costa Rica Koordinaten für Demo
    if (Math.random() > 0.3) {
      return {
        lat: 9.5 + Math.random() * 1.5,  // Costa Rica Breitengrad
        lng: -85.5 + Math.random() * 2.0  // Costa Rica Längengrad
      };
    }
    
    return null; // Kein GPS
  } catch (error) {
    console.warn('Konnte GPS-Daten nicht extrahieren:', error);
    return null;
  }
}

/**
 * 🧭 Konvertiert GPS von DMS zu Dezimalgrad
 */
function convertDMSToDD(dms, ref) {
  const parts = dms.split(/[°'"]/).map(x => parseFloat(x)).filter(x => !isNaN(x));
  let dd = parts[0] + (parts[1] || 0) / 60 + (parts[2] || 0) / 3600;
  
  if (ref === 'S' || ref === 'W') {
    dd = dd * -1;
  }
  
  return dd;
}

/**
 * 🎯 Findet den nächstgelegenen Ort
 */
export function findNearestLocation(lat, lng) {
  let closestLocation = null;
  let closestPOI = null;
  let minDistance = Infinity;

  // Prüfe alle Regionen
  Object.values(costaRicaLocations).forEach(region => {
    const distance = calculateDistance(lat, lng, region.center.lat, region.center.lng);
    
    if (distance <= region.radius) {
      // Innerhalb der Region - suche nächsten POI
      region.pois.forEach(poi => {
        const poiDistance = calculateDistance(lat, lng, poi.lat, poi.lng);
        if (poiDistance < minDistance) {
          minDistance = poiDistance;
          closestLocation = region;
          closestPOI = poi;
        }
      });
    }
  });

  if (closestPOI) {
    return {
      found: true,
      location: closestPOI.name,
      region: closestLocation.name,
      category: closestPOI.category,
      distance: minDistance,
      coordinates: { lat, lng },
      accuracy: minDistance < 0.5 ? 'sehr_genau' : minDistance < 2 ? 'genau' : 'ungefähr'
    };
  }

  // Kein POI gefunden - prüfe nur Regionen
  Object.values(costaRicaLocations).forEach(region => {
    const distance = calculateDistance(lat, lng, region.center.lat, region.center.lng);
    if (distance < minDistance) {
      minDistance = distance;
      closestLocation = region;
    }
  });

  if (closestLocation && minDistance <= closestLocation.radius) {
    return {
      found: true,
      location: closestLocation.name,
      region: closestLocation.name,
      category: closestLocation.category,
      distance: minDistance,
      coordinates: { lat, lng },
      accuracy: 'region'
    };
  }

  // Gar nichts gefunden
  return {
    found: false,
    coordinates: { lat, lng },
    distance: minDistance,
    nearestRegion: closestLocation?.name || 'Unbekannt'
  };
}

/**
 * 📐 Berechnet Distanz zwischen zwei GPS-Punkten (Haversine)
 */
function calculateDistance(lat1, lng1, lat2, lng2) {
  const R = 6371; // Erdradius in km
  const dLat = (lat2 - lat1) * Math.PI / 180;
  const dLng = (lng2 - lng1) * Math.PI / 180;
  
  const a = Math.sin(dLat/2) * Math.sin(dLat/2) +
    Math.cos(lat1 * Math.PI / 180) * Math.cos(lat2 * Math.PI / 180) *
    Math.sin(dLng/2) * Math.sin(dLng/2);
  
  const c = 2 * Math.atan2(Math.sqrt(a), Math.sqrt(1-a));
  return R * c;
}

/**
 * 🎨 Kategorielogik basierend auf Ort und Kontext
 */
export function suggestCategory(locationResult, fileName, timestamp) {
  if (!locationResult.found) {
    return 'erkundung'; // Default
  }

  // POI-basierte Kategorien haben Vorrang
  if (locationResult.category) {
    return locationResult.category;
  }

  // Fallback auf Regions-Kategorie
  return locationResult.region === 'Escazú' ? 'ankunft' : 'erkundung';
}

export { costaRicaLocations };
