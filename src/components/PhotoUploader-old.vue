<script setup>
import { ref, computed } from 'vue'
import { extractGPSFromImage, findNearestLocation, suggestCategory } from '../utils/geotagging.js'

const emit = defineEmits(['photos-added'])

const newPhotos = ref([])
const currentCategory = ref('strand')
const currentLocation = ref('Tamarindo')
const dragActive = ref(false)
const processingGPS = ref(false)
const unknownLocationPhotos = ref([])
const showAdvanced = ref(false)
const uploadMode = ref('auto') // 'auto', 'manual', 'bulk'

const categories = [
  { value: 'strand', label: '🏖️ Strand', color: '#FF6B6B', count: 0 },
  { value: 'tierwelt', label: '🦥 Tierwelt', color: '#4ECDC4', count: 0 },
  { value: 'natur', label: '🌿 Natur', color: '#45B7D1', count: 0 },
  { value: 'abenteuer', label: '� Abenteuer', color: '#96CEB4', count: 0 },
  { value: 'kulinarik', label: '🍽️ Kulinarik', color: '#FECA57', count: 0 },
  { value: 'ankunft', label: '🏨 Ankunft', color: '#A8E6CF', count: 0 },
  { value: 'anreise', label: '✈️ Anreise', color: '#DDA0DD', count: 0 },
  { value: 'nachtleben', label: '🎉 Party', color: '#FFB6C1', count: 0 }
]

const quickModes = [
  { 
    id: 'auto', 
    label: '🤖 Smart Upload', 
    desc: 'GPS erkennt Ort & Kategorie automatisch',
    icon: '🎯'
  },
  { 
    id: 'manual', 
    label: '✋ Manuell', 
    desc: 'Du wählst Kategorie & Ort selbst',
    icon: '🎛️'
  },
  { 
    id: 'bulk', 
    label: '⚡ Bulk Upload', 
    desc: 'Viele Bilder, gleiche Einstellungen',
    icon: '📦'
  }
]

const totalPhotos = computed(() => newPhotos.value.length)
const hasPhotos = computed(() => totalPhotos.value > 0)
const isProcessing = computed(() => processingGPS.value)

const handleDrop = (event) => {
  event.preventDefault()
  dragActive.value = false
  
  const files = [...event.dataTransfer.files]
  processFiles(files)
}

const handleFileSelect = (event) => {
  const files = [...event.target.files]
  processFiles(files)
}

const processFiles = async (files) => {
  processingGPS.value = true
  
  for (let i = 0; i < files.length; i++) {
    const file = files[i]
    if (file.type.startsWith('image/')) {
      await processImageWithGPS(file, i)
    }
  }
  
  processingGPS.value = false
  
  // Auto-Kategorisierung nach GPS Update
  updateCategoryCounts()
}

const processImageWithGPS = async (file, index) => {
  return new Promise((resolve) => {
    const reader = new FileReader()
    reader.onload = async (e) => {
      let finalLocation = currentLocation.value
      let finalCategory = currentCategory.value
      let gpsData = null
      let locationResult = null

      // Smart Mode: GPS-Analyse
      if (uploadMode.value === 'auto') {
        gpsData = await extractGPSFromImage(file)
        
        if (gpsData) {
          locationResult = findNearestLocation(gpsData.lat, gpsData.lng)
          
          if (locationResult.found) {
            finalLocation = locationResult.location
            finalCategory = suggestCategory(locationResult, file.name, new Date())
          }
        }
      }

      const photo = {
        id: Date.now() + index,
        url: e.target.result,
        thumbnail: e.target.result,
        title: file.name.replace(/\.[^/.]+$/, ""),
        description: gpsData 
          ? `📍 ${finalLocation} ${locationResult?.accuracy === 'sehr_genau' ? '✨' : ''}` 
          : `Aufgenommen in ${finalLocation}`,
        date: new Date().toISOString().split('T')[0],
        location: finalLocation,
        category: finalCategory,
        fileName: file.name,
        gpsData: gpsData,
        locationResult: locationResult,
        isGpsDetected: !!gpsData
      }
      
      newPhotos.value.push(photo)
      resolve()
    }
    reader.readAsDataURL(file)
  })
}

const updateCategoryCounts = () => {
  categories.forEach(cat => {
    cat.count = newPhotos.value.filter(p => p.category === cat.value).length
  })
}

const quickSetCategory = (category) => {
  currentCategory.value = category
  // Alle neuen Fotos auf diese Kategorie setzen (Bulk Mode)
  if (uploadMode.value === 'bulk' && newPhotos.value.length > 0) {
    newPhotos.value.forEach(photo => {
      photo.category = category
    })
    updateCategoryCounts()
  }
}

const switchMode = (mode) => {
  uploadMode.value = mode
  if (mode === 'manual') {
    showAdvanced.value = true
  }
}

const toggleAdvanced = () => {
  showAdvanced.value = !showAdvanced.value
}

const removePhoto = (index) => {
  newPhotos.value.splice(index, 1)
  updateCategoryCounts()
}

const updatePhotoCategory = (index, category) => {
  newPhotos.value[index].category = category
  updateCategoryCounts()
}

const addPhotosToGallery = () => {
  if (newPhotos.value.length > 0) {
    emit('photos-added', [...newPhotos.value])
    newPhotos.value = []
    unknownLocationPhotos.value = []
    updateCategoryCounts()
  }
}

const clearAll = () => {
  newPhotos.value = []
  unknownLocationPhotos.value = []
  updateCategoryCounts()
}

const getCategoryColor = (categoryValue) => {
  const cat = categories.find(c => c.value === categoryValue)
  return cat ? cat.color : '#666'
}

const getCategoryLabel = (categoryValue) => {
  const cat = categories.find(c => c.value === categoryValue)
  return cat ? cat.label : categoryValue
}

const handleUnknownLocation = (photo, newLocation) => {
  const photoIndex = newPhotos.value.findIndex(p => p.fileName === photo.fileName)
  if (photoIndex !== -1) {
    newPhotos.value[photoIndex].location = newLocation
    newPhotos.value[photoIndex].description = `📍 ${newLocation} (manuell zugeordnet)`
  }
  
  unknownLocationPhotos.value = unknownLocationPhotos.value.filter(p => p.file.name !== photo.fileName)
}
</script>

<template>
  <div class="photo-uploader">
    <!-- Kompakter Header mit Modi -->
    <div class="uploader-header">
      <div class="header-main">
        <h2>📤 Bilder hinzufügen</h2>
        <div class="quick-stats" v-if="hasPhotos">
          <span class="photo-count">{{ totalPhotos }} Foto{{ totalPhotos !== 1 ? 's' : '' }}</span>
          <button @click="addPhotosToGallery" class="quick-add-btn">
            ✅ Hinzufügen
          </button>
        </div>
      </div>
      
      <!-- Upload Modi (Smart Tabs) -->
      <div class="upload-modes">
        <button 
          v-for="mode in quickModes" 
          :key="mode.id"
          @click="switchMode(mode.id)"
          class="mode-btn"
          :class="{ active: uploadMode === mode.id }"
        >
          <span class="mode-icon">{{ mode.icon }}</span>
          <div class="mode-info">
            <div class="mode-label">{{ mode.label }}</div>
            <div class="mode-desc">{{ mode.desc }}</div>
          </div>
        </button>
      </div>
    </div>

    <!-- Smart Drop Zone -->
    <div 
      class="smart-drop-zone"
      :class="{ 
        active: dragActive, 
        processing: isProcessing,
        'has-photos': hasPhotos
      }"
      @drop="handleDrop"
      @dragover.prevent="dragActive = true"
      @dragleave="dragActive = false"
      @click="$refs.fileInput.click()"
    >
      <div class="drop-content">
        <div v-if="isProcessing" class="processing-state">
          <div class="spinner"></div>
          <h3>🧠 KI analysiert GPS-Daten...</h3>
          <p>Erkenne Orte und kategorisiere automatisch</p>
        </div>
        
        <div v-else-if="!hasPhotos" class="upload-state">
          <div class="drop-icon">{{ uploadMode === 'auto' ? '🎯' : uploadMode === 'bulk' ? '📦' : '📷' }}</div>
          <h3>{{ uploadMode === 'auto' ? 'Smart Upload aktiviert' : uploadMode === 'bulk' ? 'Bulk Upload bereit' : 'Manuelle Kontrolle' }}</h3>
          <p>{{ uploadMode === 'auto' ? 'GPS erkennt automatisch Ort & Kategorie' : uploadMode === 'bulk' ? 'Viele Bilder, gleiche Einstellungen' : 'Du wählst Kategorie & Ort selbst' }}</p>
          <div class="upload-hint">Bilder hier hinziehen oder klicken</div>
        </div>

        <div v-else class="preview-state">
          <div class="preview-summary">
            <span class="summary-icon">�</span>
            <div class="summary-text">
              <strong>{{ totalPhotos }} Foto{{ totalPhotos !== 1 ? 's' : '' }} bereit</strong>
              <p>Weitere hinzufügen oder bestätigen</p>
            </div>
          </div>
        </div>
      </div>

      <input 
        ref="fileInput"
        type="file" 
        multiple 
        accept="image/*"
        @change="handleFileSelect"
        style="display: none;"
      >
    </div>

    <!-- Schnell-Kategorien (nur bei Manual/Bulk Mode) -->
    <div v-if="uploadMode !== 'auto' || hasPhotos" class="quick-categories">
      <div class="category-header">
        <span>🏷️ Kategorie:</span>
        <button 
          @click="toggleAdvanced" 
          class="settings-btn"
          :class="{ active: showAdvanced }"
        >
          ⚙️ {{ showAdvanced ? 'Einfach' : 'Erweitert' }}
        </button>
      </div>
      
      <div class="category-pills">
        <button
          v-for="cat in categories"
          :key="cat.value"
          @click="quickSetCategory(cat.value)"
          class="category-pill"
          :class="{ active: currentCategory === cat.value }"
          :style="{ '--category-color': cat.color }"
        >
          {{ cat.label }}
          <span v-if="cat.count > 0" class="pill-count">{{ cat.count }}</span>
        </button>
      </div>
    </div>

    <!-- Erweiterte Einstellungen (konditionell) -->
    <transition name="slide-down">
      <div v-if="showAdvanced || uploadMode === 'manual'" class="advanced-settings">
        <div class="setting-group">
          <label>📍 Standard-Ort:</label>
          <input 
            v-model="currentLocation" 
            type="text" 
            placeholder="z.B. Tamarindo, Manuel Antonio"
            class="location-input"
          >
        </div>
      </div>
    </transition>

    <!-- Kompakte Vorschau (nur wenn Bilder vorhanden) -->
    <transition name="fade-in">
      <div v-if="hasPhotos" class="compact-preview">
        <div class="preview-header">
          <h3>🖼️ Vorschau</h3>
          <div class="preview-actions">
            <button @click="clearAll" class="clear-btn">�️ Alle löschen</button>
            <button @click="addPhotosToGallery" class="confirm-btn">
              ✅ {{ totalPhotos }} zur Galerie hinzufügen
            </button>
          </div>
        </div>

        <div class="preview-grid">
          <div v-for="(photo, index) in newPhotos" :key="photo.id" class="preview-card">
            <img :src="photo.thumbnail" :alt="photo.title" class="preview-image">
            
            <div class="card-overlay">
              <button @click="removePhoto(index)" class="remove-btn">❌</button>
              
              <div class="photo-info">
                <div class="photo-title">{{ photo.title }}</div>
                <div class="photo-meta">
                  <span class="location-tag">📍 {{ photo.location }}</span>
                  <span class="category-tag" :style="{ backgroundColor: getCategoryColor(photo.category) }">
                    {{ getCategoryLabel(photo.category) }}
                  </span>
                  <span v-if="photo.isGpsDetected" class="gps-tag">🎯 GPS</span>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </transition>
  </div>
</template>
      <p>Diese Bilder haben GPS-Daten, aber der Ort konnte nicht automatisch erkannt werden:</p>
      
      <div v-for="photo in unknownLocationPhotos" :key="photo.file.name" class="unknown-location-item">
        <div class="unknown-info">
          <strong>📷 {{ photo.file.name }}</strong>
          <p>📍 Koordinaten: {{ photo.coordinates.lat.toFixed(4) }}, {{ photo.coordinates.lng.toFixed(4) }}</p>
          <p>🗺️ Nächster bekannter Ort: {{ photo.nearestRegion }}</p>
        </div>
        
        <div class="location-input-group">
          <input 
            type="text" 
            placeholder="Wo wurde dieses Bild aufgenommen?"
            class="unknown-location-input"
            @keyup.enter="handleUnknownLocation(photo, $event.target.value)"
          >
          <button 
            @click="handleUnknownLocation(photo, $event.target.previousElementSibling.value)"
            class="assign-btn"
          >
            📍 Zuordnen
          </button>
        </div>
      </div>
    </div>
  </div>
</template>

<style scoped>
.photo-uploader {
  background: rgba(255, 255, 255, 0.95);
  backdrop-filter: blur(10px);
  padding: 2rem;
  border-radius: 15px;
  margin-bottom: 2rem;
  box-shadow: 0 8px 25px rgba(0, 0, 0, 0.1);
}

.category-selection {
  margin-bottom: 2rem;
}

.category-grid {
  display: grid;
  grid-template-columns: repeat(auto-fit, minmax(200px, 1fr));
  gap: 1rem;
  margin-top: 1rem;
}

.category-option {
  cursor: pointer;
}

.category-card {
  border: 2px solid #e1e5e9;
  border-radius: 10px;
  padding: 1rem;
  transition: all 0.3s ease;
  background: white;
}

.category-option.active .category-card {
  border-color: #667eea;
  background: #f8f9ff;
}

.category-header {
  font-weight: 600;
  margin-bottom: 0.5rem;
}

.category-desc {
  font-size: 0.8rem;
  color: #666;
}

.location-input {
  margin-bottom: 2rem;
}

.location-field {
  width: 100%;
  padding: 0.75rem;
  border: 2px solid #e1e5e9;
  border-radius: 8px;
  font-size: 1rem;
  margin-top: 0.5rem;
}

.drop-zone {
  border: 3px dashed #ccc;
  border-radius: 15px;
  padding: 3rem;
  text-align: center;
  cursor: pointer;
  transition: all 0.3s ease;
  margin-bottom: 2rem;
}

.drop-zone.active {
  border-color: #667eea;
  background: #f8f9ff;
}

.drop-icon {
  font-size: 4rem;
  margin-bottom: 1rem;
}

.preview-grid {
  display: grid;
  grid-template-columns: repeat(auto-fill, minmax(200px, 1fr));
  gap: 1rem;
  margin: 1rem 0;
}

.preview-item {
  border: 1px solid #eee;
  border-radius: 8px;
  overflow: hidden;
  background: white;
}

.preview-image {
  width: 100%;
  height: 150px;
  object-fit: cover;
}

.preview-info {
  padding: 0.5rem;
}

.photo-title-input {
  width: 100%;
  padding: 0.25rem;
  border: 1px solid #ddd;
  border-radius: 4px;
  margin-bottom: 0.5rem;
}

.category-select {
  width: calc(100% - 40px);
  padding: 0.25rem;
  margin-right: 0.5rem;
}

.remove-btn {
  background: #ff4757;
  color: white;
  border: none;
  border-radius: 4px;
  padding: 0.25rem 0.5rem;
  cursor: pointer;
}

.add-photos-btn {
  background: linear-gradient(135deg, #667eea, #764ba2);
  color: white;
  border: none;
  border-radius: 25px;
  padding: 1rem 2rem;
  font-size: 1.1rem;
  font-weight: 600;
  cursor: pointer;
  width: 100%;
  margin-top: 1rem;
}

/* GPS Processing */
.gps-processing {
  display: flex;
  align-items: center;
  gap: 1rem;
  background: #e3f2fd;
  border: 2px solid #2196f3;
  border-radius: 10px;
  padding: 1rem;
  margin-bottom: 2rem;
}

.processing-spinner {
  width: 30px;
  height: 30px;
  border: 3px solid #e3f2fd;
  border-top: 3px solid #2196f3;
  border-radius: 50%;
  animation: spin 1s linear infinite;
}

@keyframes spin {
  0% { transform: rotate(0deg); }
  100% { transform: rotate(360deg); }
}

/* GPS Info in Preview */
.gps-info {
  margin: 0.5rem 0;
  display: flex;
  flex-direction: column;
  gap: 0.25rem;
}

.gps-badge {
  background: #4caf50;
  color: white;
  padding: 0.25rem 0.5rem;
  border-radius: 15px;
  font-size: 0.8rem;
  font-weight: 500;
  align-self: flex-start;
}

.gps-badge.sehr_genau {
  background: #4caf50;
}

.gps-badge.genau {
  background: #ff9800;
}

.gps-badge.ungefähr {
  background: #2196f3;
}

.gps-badge.region {
  background: #9c27b0;
}

.gps-coords {
  color: #666;
  font-size: 0.7rem;
  font-family: monospace;
}

/* Unknown Locations Dialog */
.unknown-locations {
  background: #fff3e0;
  border: 2px solid #ff9800;
  border-radius: 15px;
  padding: 1.5rem;
  margin-bottom: 2rem;
}

.unknown-locations h3 {
  color: #f57c00;
  margin-bottom: 1rem;
}

.unknown-location-item {
  background: white;
  border-radius: 8px;
  padding: 1rem;
  margin-bottom: 1rem;
  border-left: 4px solid #ff9800;
}

.unknown-info {
  margin-bottom: 1rem;
}

.unknown-info strong {
  color: #333;
}

.unknown-info p {
  margin: 0.25rem 0;
  color: #666;
  font-size: 0.9rem;
}

.location-input-group {
  display: flex;
  gap: 0.5rem;
}

.unknown-location-input {
  flex: 1;
  padding: 0.5rem;
  border: 2px solid #e0e0e0;
  border-radius: 6px;
  font-size: 0.9rem;
}

.unknown-location-input:focus {
  outline: none;
  border-color: #ff9800;
}

.assign-btn {
  background: #ff9800;
  color: white;
  border: none;
  border-radius: 6px;
  padding: 0.5rem 1rem;
  cursor: pointer;
  font-size: 0.9rem;
  white-space: nowrap;
}

.assign-btn:hover {
  background: #f57c00;
}
</style>
