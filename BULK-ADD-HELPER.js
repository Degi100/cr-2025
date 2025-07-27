// 🚀 BULK-ADD HELPER - Mehrere Bilder schnell hinzufügen
// Kopiere die generierten Objekte und füge sie in PhotoGallery.vue ein!

// 📋 TEMPLATE für schnelles Hinzufügen:
function generatePhotosBulk(config) {
  const photos = [];
  let currentId = config.startId || 1;
  
  config.batches.forEach(batch => {
    for (let i = 1; i <= batch.count; i++) {
      const photoNumber = i.toString().padStart(3, '0');
      const fileName = batch.filePrefix ? `${batch.filePrefix}_${photoNumber}` : `IMG_${photoNumber}`;
      
      photos.push({
        id: currentId++,
        url: `/bilder/${batch.folder}/${fileName}.jpg`,
        thumbnail: `/bilder/${batch.folder}/thumbs/${fileName}.jpg`,
        title: batch.generateTitle ? batch.generateTitle(i) : `${batch.defaultTitle} ${i}`,
        description: batch.generateDescription ? batch.generateDescription(i) : batch.defaultDescription,
        date: batch.date || '2025-07-15',
        location: batch.location,
        category: batch.category
      });
    }
  });
  
  return photos;
}

// 🎯 DEINE AKTUELLE KONFIGURATION:
const myPhotosConfig = {
  startId: 1,
  batches: [
    // ✈️ ANREISE BILDER (viele!)
    {
      folder: 'anreise',
      category: 'anreise',
      count: 50, // ⬅️ FIRST BATCH - ÄNDERE HIER DIE ANZAHL (max 50 pro batch)
      location: 'Frankfurt → San José',
      date: '2025-07-15',
      defaultTitle: 'Anreise',
      defaultDescription: 'Auf dem Weg nach Costa Rica!',
      filePrefix: 'ANREISE', // z.B. ANREISE_001.jpg
      generateTitle: (i) => {
        const titles = [
          'Abflug Frankfurt', 'Check-in Terminal', 'Boarding Gate', 'Im Flugzeug',
          'Über den Wolken', 'Zwischenstopp', 'Landeanflug', 'Ankunft San José',
          'Gepäckausgabe', 'Immigration', 'Erste Eindrücke', 'Transfer Hotel',
          'Taxi zum Hotel', 'Erste Straßen', 'Verkehr San José', 'Stadtrand',
          'Berge im Blick', 'Tropische Vegetation', 'Erste Palmen', 'Highway',
          'Dörfer unterwegs', 'Lokale Häuser', 'Straßenszenen', 'Wetter',
          'Landschaft', 'Reisebus', 'Mitreisende', 'Pause Tankstelle',
          'Snacks unterwegs', 'Getränke', 'Toilettenpause', 'Weiterfahrt',
          'Ankunft Escazú', 'Erste Eindrücke', 'Hotel Suche', 'Navigation',
          'Straßenschilder', 'Lokale Geschäfte', 'Menschen', 'Architektur',
          'Abends angekommen', 'Müde aber glücklich', 'Erstes Abendessen', 'Zimmer bezogen',
          'Ausblick Fenster', 'Koffer auspacken', 'Erste Nacht', 'Geschafft!'
        ];
        return titles[i-1] || `Anreise ${i}`;
      }
    },
    
    // 🏨 ESCAZÚ BILDER (viele!)
    {
      folder: 'escazu',
      category: 'ankunft',
      count: 50, // ⬅️ FIRST BATCH - ÄNDERE HIER DIE ANZAHL  
      location: 'Escazú',
      date: '2025-07-16',
      defaultTitle: 'Escazú',
      defaultDescription: 'Leben in Escazú!',
      filePrefix: 'ESCAZU',
      generateTitle: (i) => {
        const titles = [
          'Hotel Ankunft', 'Zimmer Check-in', 'Hotellobby', 'Poolbereich',
          'Stadtblick', 'Lokale Straße', 'Escazú Center', 'Erstes Abendessen',
          'Stadtspaziergang', 'Lokaler Markt', 'Kaffeeshop', 'Sonnenuntergang',
          'Morgens in Escazú', 'Frühstück', 'Hotel Pool', 'Garten',
          'Stadtmitte', 'Shopping Center', 'Lokale Restaurants', 'Straßenmusik',
          'Kirche', 'Stadtpark', 'Jugendliche', 'Schulkinder',
          'Verkäufer', 'Obststände', 'Blumenmarkt', 'Geldwechsel',
          'Internet Café', 'Apotheke', 'Supermarkt', 'Bäckerei',
          'Taxi fahren', 'Bus Station', 'Verkehr', 'Rush Hour',
          'Abends ausgehen', 'Bar Besuch', 'Locals treffen', 'Salsa lernen',
          'Nachtleben', 'Sicherheit', 'Polizei', 'Touristenpolizei',
          'Geld abheben', 'Bank', 'Wäsche waschen', 'Internet',
          'Pläne machen', 'Touren buchen', 'Reiseführer', 'Geschafft!'
        ];
        return titles[i-1] || `Escazú ${i}`;
      }
    }
  ]
};

// 🚀 ZWEITER BATCH (falls du noch mehr hast):
const additionalPhotosConfig = {
  startId: 101, // Nach ersten 100 Bildern
  batches: [
    // ✈️ MEHR ANREISE (falls über 50)
    {
      folder: 'anreise',
      category: 'anreise', 
      count: 0, // ⬅️ SETZE AUF REST-ANZAHL (z.B. wenn du 70 hast, dann 20)
      location: 'Anreise Teil 2',
      date: '2025-07-15',
      defaultTitle: 'Weitere Anreise',
      defaultDescription: 'Noch mehr von der Reise!',
      filePrefix: 'ANREISE2'
    },
    
    // 🏨 MEHR ESCAZÚ (falls über 50)  
    {
      folder: 'escazu',
      category: 'ankunft',
      count: 0, // ⬅️ SETZE AUF REST-ANZAHL
      location: 'Escazú Extended',
      date: '2025-07-16',
      defaultTitle: 'Mehr Escazú',
      defaultDescription: 'Noch mehr Escazú Erlebnisse!',
      filePrefix: 'ESCAZU2'
    }
  ]
};

// 🎨 ERWEITERTE KATEGORIEN (für zukünftige Bilder):
const futureCategories = {
  startId: 201, // Nach den ersten 200 Bildern
  batches: [
    // 🦥 TIERE (wenn du welche machst)
    {
      folder: 'tiere',
      category: 'tierwelt',
      count: 0, // ⬅️ SETZE AUF GEWÜNSCHTE ANZAHL
      location: 'Manuel Antonio / Monteverde',
      date: '2025-07-18',
      defaultTitle: 'Tierwelt',
      defaultDescription: 'Costa Ricas fantastische Tierwelt!',
      filePrefix: 'TIER',
      generateTitle: (i) => {
        const titles = [
          'Faultier entdeckt', 'Tukan im Baum', 'Affen Familie', 'Kolibri',
          'Leguan sonnt sich', 'Schmetterlinge', 'Frosch versteckt', 'Vögel Paradies',
          'Krokodil am Fluss', 'Schildkröte', 'Nasenbär', 'Kapuzineraffe'
        ];
        return titles[i-1] || `Tier ${i}`;
      }
    },
    
    // �️ STRAND (für Beach Days)
    {
      folder: 'strand',
      category: 'strand',
      count: 0, // ⬅️ SETZE AUF GEWÜNSCHTE ANZAHL
      location: 'Manuel Antonio / Tamarindo',
      date: '2025-07-20',
      defaultTitle: 'Strand',
      defaultDescription: 'Pazifik Strand Erlebnis!',
      filePrefix: 'BEACH',
      generateTitle: (i) => {
        const titles = [
          'Erster Strandblick', 'Pazifik Wellen', 'Sonnenaufgang', 'Surfer',
          'Strand spazieren', 'Muscheln sammeln', 'Beach Bar', 'Sonnenuntergang',
          'Strandfußball', 'Locals am Strand', 'Fischerboote', 'Palmen'
        ];
        return titles[i-1] || `Strand ${i}`;
      }
    },

    // 🍽️ ESSEN (für Food-Pics)
    {
      folder: 'essen',
      category: 'kulinarik', 
      count: 0, // ⬅️ SETZE AUF GEWÜNSCHTE ANZAHL
      location: 'Verschiedene Orte',
      date: '2025-07-17',
      defaultTitle: 'Kulinarik',
      defaultDescription: 'Leckeres costaricanisches Essen!',
      filePrefix: 'FOOD',
      generateTitle: (i) => {
        const titles = [
          'Gallo Pinto', 'Casado Teller', 'Ceviche frisch', 'Plantains',
          'Reis & Bohnen', 'Tropical Fruits', 'Coconut Water', 'Fish Tacos',
          'Local Restaurant', 'Street Food', 'Market Food', 'Hotel Buffet'
        ];
        return titles[i-1] || `Essen ${i}`;
      }
    },
    
    // 🎉 PARTY / NACHTLEBEN (für Party-Pics)
    {
      folder: 'party',
      category: 'nachtleben',
      count: 0, // ⬅️ SETZE AUF GEWÜNSCHTE ANZAHL  
      location: 'San José / Escazú',
      date: '2025-07-19',
      defaultTitle: 'Nachtleben',
      defaultDescription: 'Pura Vida Party!',
      filePrefix: 'PARTY',
      generateTitle: (i) => {
        const titles = [
          'Bar Opening', 'Salsa Tanzen', 'Live Musik', 'Cocktails',
          'Locals treffen', 'Tanzfläche', 'Karaoke', 'Late Night',
          'Club Atmosphäre', 'Reggaeton', 'Friends', 'Pura Vida!'
        ];
        return titles[i-1] || `Party ${i}`;
      }
    },

    // 🌿 NATUR / ABENTEUER (für Outdoor-Pics)
    {
      folder: 'natur',
      category: 'abenteuer',
      count: 0, // ⬅️ SETZE AUF GEWÜNSCHTE ANZAHL
      location: 'Monteverde / Arenal',
      date: '2025-07-21',
      defaultTitle: 'Abenteuer',
      defaultDescription: 'Costa Rica Outdoor Erlebnisse!',
      filePrefix: 'ADVENTURE',
      generateTitle: (i) => {
        const titles = [
          'Zip Line Start', 'Canopy Tour', 'Hängebrücken', 'Vulkan Arenal',
          'Wanderung', 'Wasserfälle', 'Dschungel Pfad', 'Aussichtspunkt',
          'Nebelwald', 'Regenwald', 'Fluss Rafting', 'Adrenalin'
        ];
        return titles[i-1] || `Abenteuer ${i}`;
      }
    }
  ]
};

// 🚀 GENERIERE DEINE BILDER:
console.log('=== BATCH 1: ANREISE + ESCAZÚ (100 Bilder) ===');
const myPhotos = generatePhotosBulk(myPhotosConfig);
console.log(`Generated ${myPhotos.length} photos`);

// Zusätzliche Batches (falls du mehr als 50 pro Kategorie hast)
console.log('\n=== BATCH 2: ADDITIONAL PHOTOS (falls nötig) ===');
const additionalPhotos = generatePhotosBulk(additionalPhotosConfig);
if (additionalPhotos.length > 0) {
  console.log(`Generated ${additionalPhotos.length} additional photos`);
}

// Kombiniere alle Bilder
const allPhotos = [...myPhotos, ...additionalPhotos];
console.log(`\n📊 TOTAL: ${allPhotos.length} Bilder generiert!`);

// 📋 KOPIERVORLAGE für PhotoGallery.vue:
console.log('\n=== KOPIERE DIES IN PhotoGallery.vue ===');
console.log('const photos = ref([');
allPhotos.forEach((photo, index) => {
  console.log(`  ${JSON.stringify(photo, null, 2)}${index < allPhotos.length - 1 ? ',' : ''}`);
});
console.log(']);');

// 📈 STATISTIKEN:
console.log('\n=== STATISTIKEN ===');
const stats = {};
allPhotos.forEach(photo => {
  stats[photo.category] = (stats[photo.category] || 0) + 1;
});
Object.entries(stats).forEach(([category, count]) => {
  console.log(`${category}: ${count} Bilder`);
});

// 💡 QUICK-USAGE:
/*
📝 SO VERWENDEST DU DEN BULK-HELPER:

1. ✏️ ANZAHLEN ANPASSEN:
   - myPhotosConfig: count für anreise & escazu (je max 50)
   - additionalPhotosConfig: falls du mehr als 50 pro Kategorie hast

2. ▶️ SCRIPT AUSFÜHREN:
   node BULK-ADD-HELPER.js

3. 📋 CODE KOPIEREN:
   Kopiere die Ausgabe in PhotoGallery.vue

4. 📁 BILDER ORGANISIEREN:
   Erstelle die Ordner-Struktur:
   /public/bilder/anreise/ANREISE_001.jpg bis ANREISE_050.jpg
   /public/bilder/escazu/ESCAZU_001.jpg bis ESCAZU_050.jpg

5. 🔄 ERWEITERN:
   Für neue Kategorien: futureCategories verwenden

🎯 BEISPIELE:
- 70 Anreise Bilder: Erste 50 in myPhotosConfig, Rest 20 in additionalPhotosConfig
- 40 Escazú Bilder: Setze count auf 40 in myPhotosConfig
- Neue Kategorie "Strand": Aktiviere in futureCategories

🚀 READY FOR 100+ BILDER!
*/
