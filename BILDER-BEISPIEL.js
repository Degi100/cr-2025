// Beispiel für deine echten Bilder - füge diese in PhotoGallery.vue ein:

const photos = ref([
  // === ANREISE (50 Bilder) ===
  {
    id: 1,
    url: '/bilder/anreise/IMG_001.jpg',
    thumbnail: '/bilder/anreise/thumbs/IMG_001.jpg',
    title: 'Abflug Frankfurt',
    description: 'Los geht das Abenteuer!',
    date: '2025-07-15',
    location: 'Frankfurt',
    category: 'anreise'
  },
  {
    id: 2,
    url: '/bilder/anreise/IMG_002.jpg',
    thumbnail: '/bilder/anreise/thumbs/IMG_002.jpg',
    title: 'Über den Wolken',
    description: 'Erster Blick auf die Karibik',
    date: '2025-07-15',
    location: 'Hinflug',
    category: 'anreise'
  },
  // ... weitere 48 Anreise-Bilder

  // === TIERE (10 Bilder) ===
  {
    id: 51,
    url: '/bilder/tiere/IMG_051.jpg',
    thumbnail: '/bilder/tiere/thumbs/IMG_051.jpg',
    title: 'Faultier im Baum',
    description: 'So entspannt wie die Ticos!',
    date: '2025-07-18',
    location: 'Manuel Antonio',
    category: 'tierwelt'
  },
  // ... weitere 9 Tier-Bilder

  // === UNTERKUNFT (5 Bilder) ===
  {
    id: 61,
    url: '/bilder/hotel/IMG_061.jpg',
    thumbnail: '/bilder/hotel/thumbs/IMG_061.jpg',
    title: 'Hotel Lobby',
    description: 'Willkommen in Escazú',
    date: '2025-07-16',
    location: 'Escazú',
    category: 'ankunft'
  },
  // ... weitere 4 Hotel-Bilder

  // === SPEISEN (10 Bilder) ===
  {
    id: 66,
    url: '/bilder/essen/IMG_066.jpg',
    thumbnail: '/bilder/essen/thumbs/IMG_066.jpg',
    title: 'Gallo Pinto Breakfast',
    description: 'Traditionelles costaricanisches Frühstück',
    date: '2025-07-17',
    location: 'Escazú',
    category: 'kulinarik'
  },
  // ... weitere 9 Essen-Bilder

  // === PARTY (30 Bilder) ===
  {
    id: 76,
    url: '/bilder/party/IMG_076.jpg',
    thumbnail: '/bilder/party/thumbs/IMG_076.jpg',
    title: 'Salsa Night',
    description: 'Tanzen bis zum Morgengrauen!',
    date: '2025-07-19',
    location: 'San José',
    category: 'nachtleben'
  }
  // ... weitere 29 Party-Bilder
]);
