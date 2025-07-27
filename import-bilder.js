#!/usr/bin/env node

/**
 * 🚀 Costa Rica Bilder Import Script
 * 
 * Dieses Script hilft dir dabei, deine 105 Bilder automatisch zu kategorisieren
 * und in die richtige Datenstruktur zu bringen.
 */

const fs = require('fs');
const path = require('path');

// Konfiguration für deine Bildordner
const imageConfig = {
  // Ordnerstruktur auf deinem Computer
  folders: {
    'anreise': {
      path: './bilder/anreise',
      category: 'anreise',
      location: 'Hinflug',
      expectedCount: 50
    },
    'tiere': {
      path: './bilder/tiere',
      category: 'tierwelt',
      location: 'Manuel Antonio',
      expectedCount: 10
    },
    'hotel': {
      path: './bilder/hotel',
      category: 'ankunft',
      location: 'Escazú',
      expectedCount: 5
    },
    'essen': {
      path: './bilder/essen',
      category: 'kulinarik',
      location: 'Escazú',
      expectedCount: 10
    },
    'party': {
      path: './bilder/party',
      category: 'nachtleben',
      location: 'San José',
      expectedCount: 30
    }
  }
};

// Unterstützte Bildformate
const supportedFormats = ['.jpg', '.jpeg', '.png', '.gif', '.webp'];

/**
 * Erstellt die Foto-Datenstruktur für Vue.js
 */
function generatePhotoArray() {
  let photos = [];
  let currentId = 1;

  console.log('🔍 Scanne Bildordner...\n');

  Object.entries(imageConfig.folders).forEach(([folderName, config]) => {
    console.log(`📁 Verarbeite Ordner: ${folderName}`);
    
    if (!fs.existsSync(config.path)) {
      console.log(`⚠️  Ordner nicht gefunden: ${config.path}`);
      console.log(`💡 Erstelle den Ordner oder passe den Pfad an.\n`);
      return;
    }

    const files = fs.readdirSync(config.path);
    const imageFiles = files.filter(file => 
      supportedFormats.includes(path.extname(file).toLowerCase())
    );

    console.log(`   📸 ${imageFiles.length} Bilder gefunden (erwartet: ${config.expectedCount})`);

    imageFiles.forEach((file, index) => {
      const fileName = path.parse(file).name;
      const photo = {
        id: currentId++,
        url: `./bilder/${folderName}/${file}`,
        thumbnail: `./bilder/${folderName}/thumbs/${file}`,
        title: generateTitle(fileName, config.category, index),
        description: generateDescription(config.category, fileName),
        date: generateDate(config.category, index),
        location: config.location,
        category: config.category
      };
      photos.push(photo);
    });

    console.log(`   ✅ ${imageFiles.length} Bilder hinzugefügt\n`);
  });

  return photos;
}

/**
 * Generiert passende Titel basierend auf Kategorie
 */
function generateTitle(fileName, category, index) {
  const titles = {
    'anreise': [
      'Abflug aus Deutschland', 'Über den Wolken', 'Erste Karibik-Sicht', 
      'Landeanflug Costa Rica', 'Flughafen San José'
    ],
    'tierwelt': [
      'Faultier-Begegnung', 'Tukan im Baum', 'Affen-Familie', 
      'Bunter Frosch', 'Kolibri im Flug'
    ],
    'ankunft': [
      'Hotel Check-in', 'Unser Zimmer', 'Pool-Bereich', 'Hotel-Lobby', 'Aussicht vom Balkon'
    ],
    'kulinarik': [
      'Gallo Pinto', 'Casado Typical', 'Tropische Früchte', 
      'Ceviche frisch', 'Café costarricense'
    ],
    'nachtleben': [
      'Salsa Night', 'Bar-Hopping', 'Live Musik', 'Cocktail Time', 
      'Dance Floor', 'Late Night Tacos'
    ]
  };

  const categoryTitles = titles[category] || [`${category} Bild`];
  return categoryTitles[index % categoryTitles.length] || `${fileName}`;
}

/**
 * Generiert passende Beschreibungen
 */
function generateDescription(category, fileName) {
  const descriptions = {
    'anreise': 'Ein unvergesslicher Moment auf dem Weg ins Paradies!',
    'tierwelt': 'Die unglaubliche Tierwelt Costa Ricas hautnah erleben!',
    'ankunft': 'Willkommen in unserem costaricanischen Zuhause!',
    'kulinarik': 'Pura Vida schmeckt man in jedem Bissen!',
    'nachtleben': 'Wenn die Sonne untergeht, beginnt das Abenteuer!'
  };

  return descriptions[category] || `Tolles Erlebnis in Costa Rica!`;
}

/**
 * Generiert realistische Daten
 */
function generateDate(category, index) {
  const baseDate = new Date('2025-07-15');
  const categoryDays = {
    'anreise': 0,
    'ankunft': 1,
    'kulinarik': 2 + (index % 5),
    'tierwelt': 3 + (index % 3),
    'nachtleben': 4 + (index % 7)
  };

  const dayOffset = categoryDays[category] || index;
  const date = new Date(baseDate);
  date.setDate(baseDate.getDate() + dayOffset);
  
  return date.toISOString().split('T')[0];
}

/**
 * Hauptfunktion
 */
function main() {
  console.log('🇨🇷 Costa Rica Bilder Import Tool\n');
  console.log('='.repeat(50));
  
  const photos = generatePhotoArray();
  
  // Erstelle Vue.js kompatiblen Code
  const vueCode = `// Automatisch generiert von Costa Rica Import Tool
// 📊 Statistik: ${photos.length} Bilder in ${Object.keys(imageConfig.folders).length} Kategorien

const photos = ref([
${photos.map(photo => `  {
    id: ${photo.id},
    url: '${photo.url}',
    thumbnail: '${photo.thumbnail}',
    title: '${photo.title}',
    description: '${photo.description}',
    date: '${photo.date}',
    location: '${photo.location}',
    category: '${photo.category}'
  }`).join(',\n')}
]);`;

  // Speichere die Datei
  fs.writeFileSync('./generated-photos.js', vueCode);
  
  console.log('📊 ZUSAMMENFASSUNG:');
  console.log('='.repeat(30));
  
  Object.entries(imageConfig.folders).forEach(([name, config]) => {
    const count = photos.filter(p => p.category === config.category).length;
    console.log(`${config.category.padEnd(12)} : ${count.toString().padStart(3)} Bilder`);
  });
  
  console.log('-'.repeat(30));
  console.log(`${'GESAMT'.padEnd(12)} : ${photos.length.toString().padStart(3)} Bilder`);
  console.log('\n✅ Datei erstellt: generated-photos.js');
  console.log('💡 Kopiere den Inhalt in deine PhotoGallery.vue!');
}

// Script ausführen
if (require.main === module) {
  main();
}

module.exports = { generatePhotoArray, imageConfig };
