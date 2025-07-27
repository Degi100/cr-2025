<script setup>
import { ref } from 'vue'
import { extractGPSFromImage, findNearestLocation, suggestCategory } from '../utils/geotagging.js'

const emit = defineEmits(['photos-added'])

const newPhotos = ref([])
const currentCategory = ref('anreise')
const currentLocation = ref('Escazú')
const dragActive = ref(false)
const processingGPS = ref(false)
const unknownLocationPhotos = ref([])

const categories = [
  { value: 'anreise', label: '✈️ Anreise', description: 'Flugbilder, Flughafen, Transport' },
  { value: 'tierwelt', label: '🦥 Tierwelt', description: 'Faultiere, Vögel, Affen' },
  { value: 'ankunft', label: '🏨 Unterkunft', description: 'Hotel, Zimmer, Pool' },
  { value: 'kulinarik', label: '🍽️ Speisen', description: 'Gallo Pinto, lokale Küche' },
  { value: 'nachtleben', label: '🎉 Party', description: 'Salsa, Bars, Nightlife' },
  { value: 'natur', label: '🌿 Natur', description: 'Regenwald, Berge, Landschaften' },
  { value: 'strand', label: '🏖️ Strand', description: 'Pazifik, Surfen, Sonnenuntergang' },
  { value: 'abenteuer', label: '🎢 Abenteuer', description: 'Zip-Line, Wandern, Aktivitäten' }
]

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
}

const processImageWithGPS = async (file, index) => {
  return new Promise((resolve) => {
    const reader = new FileReader()
    reader.onload = async (e) => {
      // 📍 GPS-Daten extrahieren
      const gpsData = await extractGPSFromImage(file)
      let locationResult = null
      let finalLocation = currentLocation.value
      let finalCategory = currentCategory.value

      if (gpsData) {
        // 🎯 Ort finden
        locationResult = findNearestLocation(gpsData.lat, gpsData.lng)
        
        if (locationResult.found) {
          finalLocation = locationResult.location
          finalCategory = suggestCategory(locationResult, file.name, new Date())
          
          console.log(`📍 GPS erkannt: ${finalLocation} (${locationResult.accuracy})`)
        } else {
          // ❓ Unbekannter Ort - später nachfragen
          unknownLocationPhotos.value.push({
            file,
            coordinates: gpsData,
            nearestRegion: locationResult.nearestRegion
          })
        }
      }

      const photo = {
        id: Date.now() + index,
        url: e.target.result,
        thumbnail: e.target.result,
        title: file.name.replace(/\.[^/.]+$/, ""),
        description: gpsData 
          ? `📍 ${finalLocation} ${locationResult?.accuracy === 'sehr_genau' ? '(sehr genau)' : ''}` 
          : `Hinzugefügt am ${new Date().toLocaleDateString('de-DE')}`,
        date: new Date().toISOString().split('T')[0],
        location: finalLocation,
        category: finalCategory,
        fileName: file.name,
        gpsData: gpsData,
        locationResult: locationResult
      }
      
      newPhotos.value.push(photo)
      resolve()
    }
    reader.readAsDataURL(file)
  })
}

const removePhoto = (index) => {
  newPhotos.value.splice(index, 1)
}

const updatePhotoCategory = (index, category) => {
  newPhotos.value[index].category = category
}

const addPhotosToGallery = () => {
  if (newPhotos.value.length > 0) {
    emit('photos-added', [...newPhotos.value])
    newPhotos.value = []
    unknownLocationPhotos.value = []
  }
}

const handleUnknownLocation = (photo, newLocation) => {
  // Finde das Foto und aktualisiere die Location
  const photoIndex = newPhotos.value.findIndex(p => p.fileName === photo.fileName)
  if (photoIndex !== -1) {
    newPhotos.value[photoIndex].location = newLocation
    newPhotos.value[photoIndex].description = `📍 ${newLocation} (manuell zugeordnet)`
  }
  
  // Entferne aus unbekannten Locations
  unknownLocationPhotos.value = unknownLocationPhotos.value.filter(p => p.file.name !== photo.fileName)
}
</script>

<template>
  <div class="photo-uploader">
    <h2>📤 Bilder zur Galerie hinzufügen</h2>
    
    <!-- GPS Processing Status -->
    <div v-if="processingGPS" class="gps-processing">
      <div class="processing-spinner"></div>
      <p>🌍 Analysiere GPS-Daten und erkenne Orte...</p>
    </div>
    
    <!-- Kategorie-Auswahl -->
    <div class="category-selection">
      <h3>📂 Standard-Kategorie für neue Bilder:</h3>
      <div class="category-grid">
        <label 
          v-for="cat in categories" 
          :key="cat.value"
          class="category-option"
          :class="{ active: currentCategory === cat.value }"
        >
          <input 
            type="radio" 
            :value="cat.value" 
            v-model="currentCategory"
            style="display: none;"
          >
          <div class="category-card">
            <div class="category-header">{{ cat.label }}</div>
            <div class="category-desc">{{ cat.description }}</div>
          </div>
        </label>
      </div>
    </div>

    <!-- Ort eingeben -->
    <div class="location-input">
      <label for="location">📍 Ort:</label>
      <input 
        id="location"
        v-model="currentLocation" 
        type="text" 
        placeholder="z.B. Escazú, Tamarindo, Manuel Antonio"
        class="location-field"
      >
    </div>

    <!-- Drag & Drop Bereich -->
    <div 
      class="drop-zone"
      :class="{ active: dragActive }"
      @drop="handleDrop"
      @dragover.prevent="dragActive = true"
      @dragleave="dragActive = false"
      @click="$refs.fileInput.click()"
    >
      <div class="drop-content">
        <div class="drop-icon">📷</div>
        <h3>Bilder hier hinziehen oder klicken</h3>
        <p>Unterstützt: JPG, PNG, GIF</p>
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

    <!-- Vorschau der ausgewählten Bilder -->
    <div v-if="newPhotos.length > 0" class="preview-section">
      <h3>🖼️ Vorschau ({{ newPhotos.length }} Bilder)</h3>
      <div class="preview-grid">
        <div v-for="(photo, index) in newPhotos" :key="photo.id" class="preview-item">
          <img :src="photo.thumbnail" :alt="photo.title" class="preview-image">
          <div class="preview-info">
            <input 
              v-model="photo.title" 
              class="photo-title-input"
              placeholder="Bildtitel"
            >
            
            <!-- GPS Info Display -->
            <div v-if="photo.gpsData" class="gps-info">
              <span class="gps-badge" :class="photo.locationResult?.accuracy">
                📍 {{ photo.location }}
                <span v-if="photo.locationResult?.accuracy === 'sehr_genau'">✨</span>
                <span v-else-if="photo.locationResult?.accuracy === 'genau'">📌</span>
                <span v-else>📍</span>
              </span>
              <small class="gps-coords">
                {{ photo.gpsData.lat.toFixed(4) }}, {{ photo.gpsData.lng.toFixed(4) }}
              </small>
            </div>
            
            <select 
              :value="photo.category"
              @change="updatePhotoCategory(index, $event.target.value)"
              class="category-select"
            >
              <option v-for="cat in categories" :key="cat.value" :value="cat.value">
                {{ cat.label }}
              </option>
            </select>
            <button @click="removePhoto(index)" class="remove-btn">🗑️</button>
          </div>
        </div>
      </div>
      
      <button @click="addPhotosToGallery" class="add-photos-btn">
        ✅ {{ newPhotos.length }} Fotos zur Galerie hinzufügen
      </button>
    </div>

    <!-- Unbekannte Orte Dialog -->
    <div v-if="unknownLocationPhotos.length > 0" class="unknown-locations">
      <h3>❓ Unbekannte Orte zuordnen</h3>
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
