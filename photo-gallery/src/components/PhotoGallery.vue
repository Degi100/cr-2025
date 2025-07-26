<script setup>
import { ref, computed } from 'vue'
import PhotoCard from './PhotoCard.vue'
import Lightbox from './Lightbox.vue'

// Sample Urlaubsbilder - in einer echten App würden diese von einer API kommen
const photos = ref([
  {
    id: 1,
    url: 'https://images.unsplash.com/photo-1507525428034-b723cf961d3e?w=800&q=80',
    thumbnail: 'https://images.unsplash.com/photo-1507525428034-b723cf961d3e?w=400&q=80',
    title: 'Strand am ersten Tag',
    description: 'Wunderschöner Sonnenuntergang am Strand. Das Wasser war so klar und warm!',
    date: '2025-07-15',
    location: 'Malediven'
  },
  {
    id: 2,
    url: 'https://images.unsplash.com/photo-1544551763-46a013bb70d5?w=800&q=80',
    thumbnail: 'https://images.unsplash.com/photo-1544551763-46a013bb70d5?w=400&q=80',
    title: 'Palmen und Paradies',
    description: 'Diese Palmen haben uns jeden Morgen begrüßt. Einfach traumhaft!',
    date: '2025-07-16',
    location: 'Malediven'
  },
  {
    id: 3,
    url: 'https://images.unsplash.com/photo-1559827260-dc66d52bef19?w=800&q=80',
    thumbnail: 'https://images.unsplash.com/photo-1559827260-dc66d52bef19?w=400&q=80',
    title: 'Schnorchel-Abenteuer',
    description: 'Die Unterwasserwelt war atemberaubend. So viele bunte Fische!',
    date: '2025-07-17',
    location: 'Malediven'
  },
  {
    id: 4,
    url: 'https://images.unsplash.com/photo-1540206351-d6465b3ac5c1?w=800&q=80',
    thumbnail: 'https://images.unsplash.com/photo-1540206351-d6465b3ac5c1?w=400&q=80',
    title: 'Cocktails bei Sonnenuntergang',
    description: 'Entspannung pur mit einem kühlen Getränk und dem besten Ausblick der Welt.',
    date: '2025-07-18',
    location: 'Malediven'
  },
  {
    id: 5,
    url: 'https://images.unsplash.com/photo-1571019613454-1cb2f99b2d8b?w=800&q=80',
    thumbnail: 'https://images.unsplash.com/photo-1571019613454-1cb2f99b2d8b?w=400&q=80',
    title: 'Wasserbungalow',
    description: 'Unser Zuhause für eine Woche. Direkt über dem türkisblauen Wasser!',
    date: '2025-07-19',
    location: 'Malediven'
  },
  {
    id: 6,
    url: 'https://images.unsplash.com/photo-1582719478250-c89cae4dc85b?w=800&q=80',
    thumbnail: 'https://images.unsplash.com/photo-1582719478250-c89cae4dc85b?w=400&q=80',
    title: 'Romantisches Dinner',
    description: 'Ein unvergesslicher Abend zu zweit am Strand mit Kerzenschein.',
    date: '2025-07-20',
    location: 'Malediven'
  }
])

// State für Lightbox
const selectedPhoto = ref(null)
const showLightbox = ref(false)

// Filter und Sortierung
const selectedLocation = ref('all')
const sortBy = ref('date')

// Eindeutige Locations für Filter
const locations = computed(() => {
  const locs = [...new Set(photos.value.map(photo => photo.location))]
  return ['all', ...locs]
})

// Gefilterte und sortierte Fotos
const filteredPhotos = computed(() => {
  let filtered = photos.value

  // Nach Location filtern
  if (selectedLocation.value !== 'all') {
    filtered = filtered.filter(photo => photo.location === selectedLocation.value)
  }

  // Sortieren
  filtered.sort((a, b) => {
    if (sortBy.value === 'date') {
      return new Date(b.date) - new Date(a.date)
    }
    return a.title.localeCompare(b.title)
  })

  return filtered
})

// Funktionen
const openLightbox = (photo) => {
  selectedPhoto.value = photo
  showLightbox.value = true
}

const closeLightbox = () => {
  showLightbox.value = false
  selectedPhoto.value = null
}

const formatDate = (dateString) => {
  return new Date(dateString).toLocaleDateString('de-DE', {
    year: 'numeric',
    month: 'long',
    day: 'numeric'
  })
}
</script>

<template>
  <div class="photo-gallery">
    <!-- Filter und Sortierung -->
    <div class="gallery-controls">
      <div class="control-group">
        <label for="location-filter">📍 Ort:</label>
        <select id="location-filter" v-model="selectedLocation">
          <option value="all">Alle Orte</option>
          <option v-for="location in locations.slice(1)" :key="location" :value="location">
            {{ location }}
          </option>
        </select>
      </div>
      
      <div class="control-group">
        <label for="sort-select">🔄 Sortieren:</label>
        <select id="sort-select" v-model="sortBy">
          <option value="date">Nach Datum</option>
          <option value="title">Nach Titel</option>
        </select>
      </div>

      <div class="photo-count">
        📸 {{ filteredPhotos.length }} Foto{{ filteredPhotos.length !== 1 ? 's' : '' }}
      </div>
    </div>

    <!-- Foto Grid -->
    <div class="photos-grid">
      <PhotoCard
        v-for="photo in filteredPhotos"
        :key="photo.id"
        :photo="photo"
        @click="openLightbox(photo)"
      />
    </div>

    <!-- Lightbox -->
    <Lightbox
      v-if="showLightbox"
      :photo="selectedPhoto"
      :photos="filteredPhotos"
      @close="closeLightbox"
      @navigate="(photo) => selectedPhoto = photo"
    />
  </div>
</template>

<style scoped>
.photo-gallery {
  max-width: 1200px;
  margin: 0 auto;
}

.gallery-controls {
  display: flex;
  flex-wrap: wrap;
  gap: 1rem;
  align-items: center;
  background: rgba(255, 255, 255, 0.9);
  backdrop-filter: blur(10px);
  padding: 1.5rem;
  border-radius: 15px;
  margin-bottom: 2rem;
  box-shadow: 0 8px 25px rgba(0, 0, 0, 0.1);
}

.control-group {
  display: flex;
  align-items: center;
  gap: 0.5rem;
}

.control-group label {
  font-weight: 600;
  color: #555;
}

.control-group select {
  padding: 0.5rem 1rem;
  border: 2px solid #e1e5e9;
  border-radius: 8px;
  background: white;
  font-size: 0.9rem;
  cursor: pointer;
  transition: border-color 0.3s ease;
}

.control-group select:focus {
  outline: none;
  border-color: #667eea;
}

.photo-count {
  margin-left: auto;
  background: linear-gradient(135deg, #667eea, #764ba2);
  color: white;
  padding: 0.5rem 1rem;
  border-radius: 25px;
  font-weight: 600;
  font-size: 0.9rem;
}

.photos-grid {
  display: grid;
  grid-template-columns: repeat(auto-fit, minmax(300px, 1fr));
  gap: 1.5rem;
  padding: 1rem 0;
}

@media (max-width: 768px) {
  .gallery-controls {
    flex-direction: column;
    align-items: stretch;
  }
  
  .control-group {
    justify-content: space-between;
  }

  .photo-count {
    margin: 0;
    text-align: center;
  }

  .photos-grid {
    grid-template-columns: 1fr;
    gap: 1rem;
  }
}
</style>
