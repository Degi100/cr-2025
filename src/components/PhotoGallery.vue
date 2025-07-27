<script setup>
import { ref, computed } from 'vue'
import PhotoCard from './PhotoCard.vue'
import Lightbox from './Lightbox.vue'
import PhotoUploader from './PhotoUploader.vue'

// Costa Rica Urlaubsbilder - organisiert nach Reisephasen
const photos = ref([
  // Hinflug & Anreise
  {
    id: 1,
    url: 'https://images.unsplash.com/photo-1436491865332-7a61a109cc05?w=800&q=80',
    thumbnail: 'https://images.unsplash.com/photo-1436491865332-7a61a109cc05?w=400&q=80',
    title: 'Abflug nach Costa Rica',
    description: 'Der Beginn unseres großen Abenteuers! Vom Flugzeugfenster aus sehen wir Deutschland zum letzten Mal.',
    date: '2025-07-15',
    location: 'Hinflug',
    category: 'anreise'
  },
  {
    id: 2,
    url: 'https://images.unsplash.com/photo-1469854523086-cc02fe5d8800?w=800&q=80',
    thumbnail: 'https://images.unsplash.com/photo-1469854523086-cc02fe5d8800?w=400&q=80',
    title: 'Über den Wolken',
    description: 'Stundenlang über den Atlantik - die Vorfreude steigt mit jedem Kilometer!',
    date: '2025-07-15',
    location: 'Hinflug',
    category: 'anreise'
  },
  
  // Erste Ankunft in Escazú
  {
    id: 3,
    url: 'https://images.unsplash.com/photo-1518105779142-d975f22f1b0a?w=800&q=80',
    thumbnail: 'https://images.unsplash.com/photo-1518105779142-d975f22f1b0a?w=400&q=80',
    title: 'Willkommen in San José',
    description: 'Erste Eindrücke am Flughafen - die tropische Luft und das Gefühl von Abenteuer!',
    date: '2025-07-16',
    location: 'San José',
    category: 'ankunft'
  },
  {
    id: 4,
    url: 'https://images.unsplash.com/photo-1579952363873-27d3bfad9c0d?w=800&q=80',
    thumbnail: 'https://images.unsplash.com/photo-1579952363873-27d3bfad9c0d?w=400&q=80',
    title: 'Fahrt nach Escazú',
    description: 'Die Berge von Costa Rica begrüßen uns - so grün und majestätisch!',
    date: '2025-07-16',
    location: 'Escazú',
    category: 'ankunft'
  },
  {
    id: 5,
    url: 'https://images.unsplash.com/photo-1578662996442-48f60103fc96?w=800&q=80',
    thumbnail: 'https://images.unsplash.com/photo-1578662996442-48f60103fc96?w=400&q=80',
    title: 'Unser Hotel in Escazú',
    description: 'Eingecheckt! Die Aussicht auf die Berge ist atemberaubend. Pura Vida beginnt jetzt!',
    date: '2025-07-16',
    location: 'Escazú',
    category: 'ankunft'
  },
  
  // Lokale Erkundungen
  {
    id: 6,
    url: 'https://images.unsplash.com/photo-1552830869-6f6ac85e5ba9?w=800&q=80',
    thumbnail: 'https://images.unsplash.com/photo-1552830869-6f6ac85e5ba9?w=400&q=80',
    title: 'Markt in Escazú',
    description: 'Lokale Früchte probieren - so viele exotische Geschmäcker, die wir noch nie erlebt haben!',
    date: '2025-07-17',
    location: 'Escazú',
    category: 'erkundung'
  },
  {
    id: 7,
    url: 'https://images.unsplash.com/photo-1551632436-cbf8dd35adfa?w=800&q=80',
    thumbnail: 'https://images.unsplash.com/photo-1551632436-cbf8dd35adfa?w=400&q=80',
    title: 'Erstes Gallo Pinto',
    description: 'Das Nationalgericht Costa Ricas zum Frühstück - einfach köstlich!',
    date: '2025-07-17',
    location: 'Escazú',
    category: 'kulinarik'
  },
  
  // Abenteuer & Natur
  {
    id: 8,
    url: 'https://images.unsplash.com/photo-1539650116574-75c0c6d73c6e?w=800&q=80',
    thumbnail: 'https://images.unsplash.com/photo-1539650116574-75c0c6d73c6e?w=400&q=80',
    title: 'Regenwald-Wanderung',
    description: 'Tief im costaricanischen Regenwald - die Artenvielfalt ist unglaublich!',
    date: '2025-07-18',
    location: 'Manuel Antonio',
    category: 'natur'
  },
  {
    id: 9,
    url: 'https://images.unsplash.com/photo-1575550959106-5a7defe28b56?w=800&q=80',
    thumbnail: 'https://images.unsplash.com/photo-1575550959106-5a7defe28b56?w=400&q=80',
    title: 'Faultier-Begegnung',
    description: 'Unser erstes Faultier in freier Wildbahn! So friedlich und entspannt - echte Pura Vida!',
    date: '2025-07-18',
    location: 'Manuel Antonio',
    category: 'tierwelt'
  },
  {
    id: 10,
    url: 'https://images.unsplash.com/photo-1547036967-23d11aacaee0?w=800&q=80',
    thumbnail: 'https://images.unsplash.com/photo-1547036967-23d11aacaee0?w=400&q=80',
    title: 'Zip-Line Abenteuer',
    description: 'Durch die Baumkronen sausen - Adrenalin pur mit spektakulärer Aussicht!',
    date: '2025-07-19',
    location: 'Monteverde',
    category: 'abenteuer'
  },
  
  // Strände & Entspannung
  {
    id: 11,
    url: 'https://images.unsplash.com/photo-1582719478250-c89cae4dc85b?w=800&q=80',
    thumbnail: 'https://images.unsplash.com/photo-1582719478250-c89cae4dc85b?w=400&q=80',
    title: 'Sonnenuntergang in Tamarindo',
    description: 'Der perfekte Strandtag endet mit diesem magischen Sonnenuntergang am Pazifik.',
    date: '2025-07-20',
    location: 'Tamarindo',
    category: 'strand'
  },
  {
    id: 12,
    url: 'https://images.unsplash.com/photo-1544551763-46a013bb70d5?w=800&q=80',
    thumbnail: 'https://images.unsplash.com/photo-1544551763-46a013bb70d5?w=400&q=80',
    title: 'Palmen am Pazifik',
    description: 'Traumhafte Palmen säumen die Küste - das ist das Costa Rica aus unseren Träumen!',
    date: '2025-07-20',
    location: 'Tamarindo',
    category: 'strand'
  }
])

// State für Lightbox
const selectedPhoto = ref(null)
const showLightbox = ref(false)

// State für PhotoUploader
const showUploader = ref(false)

// Filter und Sortierung
const selectedLocation = ref('all')
const selectedCategory = ref('all')
const sortBy = ref('date')
const searchQuery = ref('')

// Eindeutige Locations für Filter
const locations = computed(() => {
  const locs = [...new Set(photos.value.map(photo => photo.location))]
  return ['all', ...locs]
})

// Eindeutige Kategorien für Filter
const categories = computed(() => {
  const cats = [...new Set(photos.value.map(photo => photo.category))]
  return ['all', ...cats]
})

// Kategorie-Labels für bessere UX
const categoryLabels = {
  'all': 'Alle Kategorien',
  'anreise': '✈️ Anreise',
  'ankunft': '🏨 Ankunft',
  'erkundung': '🗺️ Erkundung',
  'kulinarik': '🍽️ Kulinarik',
  'natur': '🌿 Natur',
  'tierwelt': '🦥 Tierwelt',
  'abenteuer': '🎢 Abenteuer',
  'strand': '🏖️ Strand',
  'nachtleben': '🎉 Party & Nachtleben'
}

// Gefilterte und sortierte Fotos
const filteredPhotos = computed(() => {
  let filtered = photos.value

  // Spezial-Filter: Neueste Bilder (letzte 7 Tage)
  if (sortBy.value === 'newest') {
    const oneWeekAgo = new Date()
    oneWeekAgo.setDate(oneWeekAgo.getDate() - 7)
    
    filtered = filtered.filter(photo => {
      const photoDate = new Date(photo.date)
      return photoDate >= oneWeekAgo
    })
  }

  // Suchfunktion - durchsucht Titel, Beschreibung und Location
  if (searchQuery.value.trim()) {
    const query = searchQuery.value.toLowerCase().trim()
    filtered = filtered.filter(photo => 
      photo.title.toLowerCase().includes(query) ||
      photo.description.toLowerCase().includes(query) ||
      photo.location.toLowerCase().includes(query) ||
      photo.category.toLowerCase().includes(query)
    )
  }

  // Nach Location filtern
  if (selectedLocation.value !== 'all') {
    filtered = filtered.filter(photo => photo.location === selectedLocation.value)
  }

  // Nach Kategorie filtern
  if (selectedCategory.value !== 'all') {
    filtered = filtered.filter(photo => photo.category === selectedCategory.value)
  }

  // Sortieren
  filtered.sort((a, b) => {
    if (sortBy.value === 'date' || sortBy.value === 'newest') {
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

// PhotoUploader Funktionen
const toggleUploader = () => {
  showUploader.value = !showUploader.value
}

const addPhotos = (newPhotos) => {
  // Neue Fotos zur bestehenden Liste hinzufügen
  const maxId = Math.max(...photos.value.map(p => p.id), 0)
  newPhotos.forEach((photo, index) => {
    photo.id = maxId + index + 1
    photos.value.push(photo)
  })
  
  showUploader.value = false
  
  // Erfolgsbenachrichtigung
  alert(`🎉 ${newPhotos.length} Foto${newPhotos.length !== 1 ? 's' : ''} erfolgreich hinzugefügt!`)
}

// Neueste Bilder Funktionen
const sortByNewest = () => {
  selectedCategory.value = 'all'
  selectedLocation.value = 'all'
  sortBy.value = 'newest'
}

const getNewestCount = () => {
  // Zeige Bilder der letzten 7 Tage
  const oneWeekAgo = new Date()
  oneWeekAgo.setDate(oneWeekAgo.getDate() - 7)
  
  return photos.value.filter(photo => {
    const photoDate = new Date(photo.date)
    return photoDate >= oneWeekAgo
  }).length
}

// Suchfunktionen
const clearSearch = () => {
  searchQuery.value = ''
}

const clearAllFilters = () => {
  searchQuery.value = ''
  selectedCategory.value = 'all'
  selectedLocation.value = 'all'
  sortBy.value = 'date'
}

const hasActiveFilters = computed(() => {
  return searchQuery.value.trim() !== '' || 
         selectedCategory.value !== 'all' || 
         selectedLocation.value !== 'all' ||
         sortBy.value === 'newest'
})
</script>

<template>
  <div class="photo-gallery">
    <!-- Suchleiste -->
    <div class="search-section">
      <div class="search-container">
        <div class="search-input-wrapper">
          <span class="search-icon">🔍</span>
          <input 
            type="text" 
            v-model="searchQuery"
            placeholder="Suche nach Titel, Beschreibung, Ort oder Kategorie..."
            class="search-input"
          />
          <button 
            v-if="searchQuery"
            @click="clearSearch"
            class="clear-search-btn"
            title="Suche löschen"
          >
            ❌
          </button>
        </div>
        
        <button 
          v-if="hasActiveFilters"
          @click="clearAllFilters"
          class="clear-all-btn"
          title="Alle Filter zurücksetzen"
        >
          🔄 Filter zurücksetzen
        </button>
      </div>
      
      <!-- Suchergebnisse Info -->
      <div v-if="searchQuery.trim()" class="search-results-info">
        <span class="search-query">Suche nach: "<strong>{{ searchQuery }}</strong>"</span>
        <span class="search-count">{{ filteredPhotos.length }} Ergebnis{{ filteredPhotos.length !== 1 ? 'se' : '' }}</span>
      </div>
    </div>

    <!-- Filter und Sortierung -->
    <div class="gallery-controls">
      <div class="control-group">
        <label for="category-filter">📂 Kategorie:</label>
        <select id="category-filter" v-model="selectedCategory">
          <option v-for="category in categories" :key="category" :value="category">
            {{ categoryLabels[category] || category }}
          </option>
        </select>
      </div>

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

    <!-- Schnellfilter Buttons -->
    <div class="quick-filters">
      <div class="filter-header">
        <h3>🚀 Schnellfilter:</h3>
        <button 
          class="upload-btn"
          @click="toggleUploader"
          :class="{ active: showUploader }"
        >
          {{ showUploader ? '❌ Upload schließen' : '➕ Bilder hinzufügen' }}
        </button>
      </div>
      
      <div class="filter-buttons">
        <button 
          class="filter-btn newest"
          :class="{ active: sortBy === 'newest' }"
          @click="sortByNewest"
        >
          🆕 Neueste ({{ getNewestCount() }})
        </button>
        <button 
          class="filter-btn all-photos"
          :class="{ active: !hasActiveFilters }"
          @click="clearAllFilters"
        >
          📸 Alle ({{ photos.length }})
        </button>
        <button 
          class="filter-btn"
          :class="{ active: selectedCategory === 'anreise' && !searchQuery }"
          @click="selectedCategory = 'anreise'; searchQuery = ''"
        >
          ✈️ Anreise ({{ photos.filter(p => p.category === 'anreise').length }})
        </button>
        <button 
          class="filter-btn"
          :class="{ active: selectedCategory === 'strand' && !searchQuery }"
          @click="selectedCategory = 'strand'; searchQuery = ''"
        >
          🏖️ Strand ({{ photos.filter(p => p.category === 'strand').length }})
        </button>
        <button 
          class="filter-btn"
          :class="{ active: selectedCategory === 'tierwelt' && !searchQuery }"
          @click="selectedCategory = 'tierwelt'; searchQuery = ''"
        >
          🦥 Tiere ({{ photos.filter(p => p.category === 'tierwelt').length }})
        </button>
        <button 
          class="filter-btn"
          :class="{ active: selectedCategory === 'natur' && !searchQuery }"
          @click="selectedCategory = 'natur'; searchQuery = ''"
        >
          🌿 Natur ({{ photos.filter(p => p.category === 'natur').length }})
        </button>
        <button 
          class="filter-btn"
          :class="{ active: selectedLocation === 'Escazú' && !searchQuery }"
          @click="selectedLocation = 'Escazú'; selectedCategory = 'all'; searchQuery = ''"
        >
          🏨 Escazú ({{ photos.filter(p => p.location === 'Escazú').length }})
        </button>
        <button 
          class="filter-btn"
          :class="{ active: selectedCategory === 'kulinarik' && !searchQuery }"
          @click="selectedCategory = 'kulinarik'; searchQuery = ''"
        >
          🍽️ Speisen ({{ photos.filter(p => p.category === 'kulinarik').length }})
        </button>
        <button 
          class="filter-btn"
          :class="{ active: selectedCategory === 'nachtleben' && !searchQuery }"
          @click="selectedCategory = 'nachtleben'; searchQuery = ''"
        >
          🎉 Party ({{ photos.filter(p => p.category === 'nachtleben').length }})
        </button>
      </div>
    </div>

    <!-- PhotoUploader (konditionell angezeigt) -->
    <transition name="slide-down">
      <PhotoUploader 
        v-if="showUploader"
        @photos-added="addPhotos"
      />
    </transition>

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

/* Suchsektion */
.search-section {
  background: rgba(255, 255, 255, 0.95);
  backdrop-filter: blur(10px);
  padding: 1.5rem;
  border-radius: 15px;
  margin-bottom: 1.5rem;
  box-shadow: 0 8px 25px rgba(0, 0, 0, 0.1);
}

.search-container {
  display: flex;
  gap: 1rem;
  align-items: center;
  flex-wrap: wrap;
}

.search-input-wrapper {
  position: relative;
  flex: 1;
  min-width: 300px;
  display: flex;
  align-items: center;
}

.search-icon {
  position: absolute;
  left: 15px;
  font-size: 1.2rem;
  color: #666;
  z-index: 2;
}

.search-input {
  width: 100%;
  padding: 1rem 1rem 1rem 3rem;
  border: 2px solid #e1e5e9;
  border-radius: 25px;
  font-size: 1rem;
  background: white;
  transition: all 0.3s ease;
  outline: none;
}

.search-input:focus {
  border-color: #667eea;
  box-shadow: 0 0 0 3px rgba(102, 126, 234, 0.1);
}

.search-input::placeholder {
  color: #999;
}

.clear-search-btn {
  position: absolute;
  right: 10px;
  background: none;
  border: none;
  font-size: 1rem;
  cursor: pointer;
  padding: 0.5rem;
  border-radius: 50%;
  transition: background-color 0.3s ease;
}

.clear-search-btn:hover {
  background-color: #f5f5f5;
}

.clear-all-btn {
  background: linear-gradient(135deg, #6c757d, #5a6268);
  color: white;
  border: none;
  border-radius: 25px;
  padding: 0.75rem 1.5rem;
  font-size: 0.9rem;
  font-weight: 600;
  cursor: pointer;
  transition: all 0.3s ease;
  white-space: nowrap;
  box-shadow: 0 4px 12px rgba(108, 117, 125, 0.3);
}

.clear-all-btn:hover {
  background: linear-gradient(135deg, #5a6268, #495057);
  transform: translateY(-2px);
  box-shadow: 0 6px 20px rgba(108, 117, 125, 0.4);
}

.search-results-info {
  display: flex;
  justify-content: space-between;
  align-items: center;
  margin-top: 1rem;
  padding-top: 1rem;
  border-top: 1px solid #e9ecef;
  flex-wrap: wrap;
  gap: 0.5rem;
}

.search-query {
  color: #666;
  font-size: 0.9rem;
}

.search-count {
  background: linear-gradient(135deg, #28a745, #20c997);
  color: white;
  padding: 0.4rem 1rem;
  border-radius: 20px;
  font-size: 0.85rem;
  font-weight: 600;
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

.quick-filters {
  background: rgba(255, 255, 255, 0.95);
  backdrop-filter: blur(10px);
  padding: 1.5rem;
  border-radius: 15px;
  margin-bottom: 2rem;
  box-shadow: 0 8px 25px rgba(0, 0, 0, 0.1);
}

.quick-filters h3 {
  margin-bottom: 1rem;
  color: #333;
  font-size: 1.1rem;
}

.filter-header {
  display: flex;
  justify-content: space-between;
  align-items: center;
  margin-bottom: 1rem;
  width: 100%;
}

.upload-btn {
  background: linear-gradient(135deg, #28a745, #20c997);
  color: white;
  border: none;
  border-radius: 25px;
  padding: 0.75rem 1.5rem;
  font-size: 0.9rem;
  font-weight: 600;
  cursor: pointer;
  transition: all 0.3s ease;
  white-space: nowrap;
  box-shadow: 0 4px 12px rgba(40, 167, 69, 0.3);
}

.upload-btn:hover {
  background: linear-gradient(135deg, #218838, #1ea085);
  transform: translateY(-2px);
  box-shadow: 0 6px 20px rgba(40, 167, 69, 0.4);
}

.upload-btn.active {
  background: linear-gradient(135deg, #dc3545, #e83e8c);
  box-shadow: 0 6px 20px rgba(220, 53, 69, 0.4);
}

/* Slide-Down Animation für PhotoUploader */
.slide-down-enter-active,
.slide-down-leave-active {
  transition: all 0.5s ease;
  max-height: 1000px;
  opacity: 1;
}

.slide-down-enter-from,
.slide-down-leave-to {
  max-height: 0;
  opacity: 0;
  transform: translateY(-20px);
}

.filter-buttons {
  display: flex;
  flex-wrap: wrap;
  gap: 0.75rem;
}

.filter-btn {
  padding: 0.75rem 1.25rem;
  border: 2px solid #e1e5e9;
  border-radius: 25px;
  background: white;
  color: #666;
  font-size: 0.9rem;
  font-weight: 500;
  cursor: pointer;
  transition: all 0.3s ease;
  white-space: nowrap;
}

.filter-btn:hover {
  border-color: #667eea;
  background: #f8f9ff;
  transform: translateY(-2px);
  box-shadow: 0 4px 12px rgba(102, 126, 234, 0.2);
}

.filter-btn.active {
  background: linear-gradient(135deg, #667eea, #764ba2);
  border-color: #667eea;
  color: white;
  transform: translateY(-2px);
  box-shadow: 0 6px 20px rgba(102, 126, 234, 0.3);
}

.filter-btn.newest {
  background: linear-gradient(135deg, #4CAF50, #45a049);
  color: white;
  border-color: #4CAF50;
  font-weight: 600;
}

.filter-btn.newest:hover {
  background: linear-gradient(135deg, #45a049, #3d8b40);
  border-color: #45a049;
}

.filter-btn.newest.active {
  background: linear-gradient(135deg, #2E7D32, #1B5E20);
  border-color: #2E7D32;
  box-shadow: 0 6px 20px rgba(46, 125, 50, 0.4);
}

.filter-btn.all-photos.active {
  background: linear-gradient(135deg, #667eea, #764ba2);
  border-color: #667eea;
  color: white;
  transform: translateY(-2px);
  box-shadow: 0 6px 20px rgba(102, 126, 234, 0.3);
}

.photos-grid {
  display: grid;
  grid-template-columns: repeat(auto-fit, minmax(300px, 1fr));
  gap: 1.5rem;
  padding: 1rem 0;
}

@media (max-width: 768px) {
  .search-section {
    padding: 1rem;
  }

  .search-container {
    flex-direction: column;
    align-items: stretch;
  }

  .search-input-wrapper {
    min-width: auto;
  }

  .search-input {
    padding: 0.8rem 0.8rem 0.8rem 2.5rem;
    font-size: 0.9rem;
  }

  .search-icon {
    left: 12px;
    font-size: 1rem;
  }

  .clear-all-btn {
    font-size: 0.8rem;
    padding: 0.6rem 1rem;
  }

  .search-results-info {
    flex-direction: column;
    align-items: stretch;
    text-align: center;
    gap: 0.5rem;
  }

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

  .quick-filters {
    padding: 1rem;
  }

  .filter-header {
    flex-direction: column;
    gap: 1rem;
    align-items: stretch;
  }

  .upload-btn {
    font-size: 0.8rem;
    padding: 0.6rem 1rem;
  }

  .filter-buttons {
    justify-content: center;
  }

  .filter-btn {
    font-size: 0.8rem;
    padding: 0.6rem 1rem;
  }

  .photos-grid {
    grid-template-columns: 1fr;
    gap: 1rem;
  }
}
</style>
