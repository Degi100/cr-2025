<script setup>
import { ref, computed } from 'vue'
import { extractGPSFromImage, findNearestLocation, suggestCategory } from '../utils/geotagging.js'
import { useGitHubUpload } from '../utils/github-upload.js'

const emit = defineEmits(['photos-added'])

// GitHub Upload Integration
const { uploadImage, isUploading, uploadProgress, uploadError, isConfigured, configError } = useGitHubUpload()

const newPhotos = ref([])
const currentCategory = ref('strand')
const currentLocation = ref('Tamarindo')
const dragActive = ref(false)
const processingGPS = ref(false)
const unknownLocationPhotos = ref([])
const showAdvanced = ref(false)
const uploadMode = ref('auto') // 'auto', 'manual', 'bulk'
const permanentStorage = ref(true) // Neue Option für GitHub Upload

// Kamera-Integration
const showCamera = ref(false)
const videoStream = ref(null)
const videoRef = ref(null)
const canvasRef = ref(null)
const isCameraActive = ref(false)
const cameraError = ref(null)
const facingMode = ref('environment') // 'user' für Frontkamera, 'environment' für Hauptkamera

const categories = [
  { value: 'strand', label: '🏖️ Strand', color: '#FF6B6B', count: 0 },
  { value: 'tierwelt', label: '🦥 Tierwelt', color: '#4ECDC4', count: 0 },
  { value: 'natur', label: '🌿 Natur', color: '#45B7D1', count: 0 },
  { value: 'abenteuer', label: '🎢 Abenteuer', color: '#96CEB4', count: 0 },
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
  updateCategoryCounts()
}

const processImageWithGPS = async (file, index) => {
  return new Promise(async (resolve) => {
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
        isGpsDetected: !!gpsData,
        permanent: false,
        githubUrl: null,
        uploading: false
      }
      
      // GitHub Upload wenn permanent storage aktiviert
      if (permanentStorage.value) {
        try {
          photo.uploading = true
          console.log(`☁️ Lade ${photo.title} zu GitHub hoch...`)
          
          const githubUrl = await uploadImage(file, finalCategory, finalLocation)
          if (githubUrl) {
            photo.githubUrl = githubUrl
            photo.permanent = true
            photo.url = githubUrl // GitHub URL als primary URL verwenden
            console.log(`✅ GitHub Upload erfolgreich: ${githubUrl}`)
          }
        } catch (error) {
          console.warn(`⚠️ GitHub Upload fehlgeschlagen für ${photo.title}:`, error)
          photo.permanent = false
        } finally {
          photo.uploading = false
        }
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
    console.log(`📤 Sende ${newPhotos.value.length} Fotos zur Galerie...`)
    console.log('🔍 Fotos-Details:', newPhotos.value.map(p => ({ 
      title: p.title, 
      category: p.category, 
      location: p.location,
      permanent: p.permanent,
      url: p.url,
      githubUrl: p.githubUrl 
    })))
    
    // Sicherstellen, dass für permanente Bilder die korrekte URL verwendet wird
    const photosToAdd = newPhotos.value.map(photo => {
      // Wenn das Bild permanent ist (GitHub), verwenden wir immer die GitHub URL
      if (photo.permanent && photo.githubUrl) {
        return {
          ...photo,
          url: photo.githubUrl,
          thumbnail: photo.githubUrl // Thumbnail ebenfalls aktualisieren
        }
      }
      return photo
    })
    
    emit('photos-added', photosToAdd)
    
    newPhotos.value = []
    unknownLocationPhotos.value = []
    updateCategoryCounts()
    
    console.log('✅ Fotos gesendet und PhotoUploader zurückgesetzt')
  } else {
    console.log('⚠️ Keine Fotos zum Hinzufügen vorhanden')
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

// Kamera-Funktionen
const startCamera = async () => {
  try {
    cameraError.value = null
    console.log('📷 Starte Kamera...')
    
    const constraints = {
      video: {
        facingMode: facingMode.value,
        width: { ideal: 1920 },
        height: { ideal: 1080 }
      }
    }
    
    videoStream.value = await navigator.mediaDevices.getUserMedia(constraints)
    
    if (videoRef.value) {
      videoRef.value.srcObject = videoStream.value
      await videoRef.value.play()
      isCameraActive.value = true
      showCamera.value = true
      console.log('✅ Kamera aktiv')
    }
  } catch (error) {
    console.error('❌ Kamera-Fehler:', error)
    cameraError.value = 'Kamera-Zugriff fehlgeschlagen. Bitte Berechtigung erteilen.'
  }
}

const stopCamera = () => {
  if (videoStream.value) {
    videoStream.value.getTracks().forEach(track => track.stop())
    videoStream.value = null
  }
  isCameraActive.value = false
  showCamera.value = false
  console.log('📷 Kamera gestoppt')
}

const switchCamera = async () => {
  facingMode.value = facingMode.value === 'user' ? 'environment' : 'user'
  if (isCameraActive.value) {
    stopCamera()
    await startCamera()
  }
}

const capturePhoto = async () => {
  if (!videoRef.value || !canvasRef.value) return
  
  try {
    console.log('📸 Mache Foto...')
    
    const video = videoRef.value
    const canvas = canvasRef.value
    const ctx = canvas.getContext('2d')
    
    // Canvas an Video-Dimensionen anpassen
    canvas.width = video.videoWidth
    canvas.height = video.videoHeight
    
    // Video-Frame zu Canvas kopieren
    ctx.drawImage(video, 0, 0, canvas.width, canvas.height)
    
    // Canvas zu Blob konvertieren
    const blob = await new Promise(resolve => {
      canvas.toBlob(resolve, 'image/jpeg', 0.9)
    })
    
    // Datei-Objekt erstellen
    const timestamp = new Date().toISOString().replace(/[:.-]/g, '')
    const fileName = `camera_${timestamp}.jpg`
    const file = new File([blob], fileName, { type: 'image/jpeg' })
    
    // GPS-Daten von Gerät abrufen (falls verfügbar)
    if (navigator.geolocation) {
      navigator.geolocation.getCurrentPosition(
        async (position) => {
          console.log('📍 GPS-Position erhalten:', position.coords)
          await processImageWithGPS(file, newPhotos.value.length)
        },
        async () => {
          console.log('📍 Kein GPS verfügbar, verarbeite ohne Position')
          await processImageWithGPS(file, newPhotos.value.length)
        }
      )
    } else {
      await processImageWithGPS(file, newPhotos.value.length)
    }
    
    console.log('✅ Foto aufgenommen:', fileName)
    
  } catch (error) {
    console.error('❌ Foto-Aufnahme fehlgeschlagen:', error)
    cameraError.value = 'Foto-Aufnahme fehlgeschlagen'
  }
}
</script>

<template>
  <div class="photo-uploader">
    <!-- Kompakter Header mit Modi -->
    <div class="uploader-header">
      <div class="header-main">
        <h2>📤 Bilder hinzufügen</h2>
        <div class="header-actions">
          <div class="quick-stats" v-if="hasPhotos">
            <span class="photo-count">{{ totalPhotos }} Foto{{ totalPhotos !== 1 ? 's' : '' }}</span>
            <button @click="addPhotosToGallery" class="quick-add-btn">
              ✅ Hinzufügen
            </button>
          </div>
          
          <!-- Kamera-Button -->
          <button 
            @click="showCamera ? stopCamera() : startCamera()" 
            class="camera-btn"
            :class="{ active: isCameraActive }"
          >
            <span class="camera-icon">{{ isCameraActive ? '📷' : '📸' }}</span>
            <span class="camera-label">{{ isCameraActive ? 'Kamera stoppen' : 'Kamera' }}</span>
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

    <!-- GitHub Upload Optionen -->
    <div v-if="uploadMode !== 'auto' || showAdvanced" class="storage-options">
      <div class="storage-header">
        <h3>💾 Speicher-Optionen</h3>
        <span class="storage-info">Wähle wie deine Bilder gespeichert werden</span>
      </div>
      
      <div class="storage-modes">
        <label class="storage-option" :class="{ active: !permanentStorage }">
          <input 
            type="radio" 
            :value="false" 
            v-model="permanentStorage"
            name="storage-mode"
          >
          <div class="option-content">
            <span class="option-icon">💨</span>
            <div class="option-info">
              <div class="option-title">Lokal (Schnell)</div>
              <div class="option-desc">Nur in diesem Browser</div>
            </div>
          </div>
        </label>
        
        <label class="storage-option" :class="{ active: permanentStorage, disabled: !isConfigured }">
          <input 
            type="radio" 
            :value="true" 
            v-model="permanentStorage"
            name="storage-mode"
            :disabled="!isConfigured"
          >
          <div class="option-content">
            <span class="option-icon">☁️</span>
            <div class="option-info">
              <div class="option-title">Permanent</div>
              <div class="option-desc">
                {{ isConfigured ? 'Über alle Geräte' : 'GitHub nicht konfiguriert' }}
              </div>
            </div>
          </div>
          <div v-if="isUploading" class="upload-progress">
            <div class="progress-bar">
              <div class="progress-fill" :style="{ width: uploadProgress + '%' }"></div>
            </div>
            <span class="progress-text">{{ uploadProgress }}%</span>
          </div>
        </label>
      </div>
      
      <div v-if="uploadError || !isConfigured" class="upload-error">
        <span v-if="!isConfigured">⚙️ {{ configError }}</span>
        <span v-else>⚠️ Upload Fehler: {{ uploadError }}</span>
        <div v-if="!isConfigured" class="config-hint">
          Siehe <code>.env.example</code> für GitHub Token Setup
        </div>
      </div>
    </div>

    <!-- Kamera Interface -->
    <transition name="slide-down">
      <div v-if="showCamera" class="camera-interface">
        <div class="camera-header">
          <h3>📷 Live Kamera</h3>
          <div class="camera-controls">
            <button @click="switchCamera" class="switch-camera-btn">
              🔄 {{ facingMode === 'user' ? 'Hauptkamera' : 'Frontkamera' }}
            </button>
            <button @click="stopCamera" class="close-camera-btn">
              ❌ Schließen
            </button>
          </div>
        </div>
        
        <div class="camera-container">
          <video 
            ref="videoRef" 
            class="camera-video"
            autoplay 
            playsinline 
            muted
          ></video>
          
          <canvas 
            ref="canvasRef" 
            class="camera-canvas"
            style="display: none;"
          ></canvas>
          
          <div class="camera-overlay">
            <div class="capture-controls">
              <button @click="capturePhoto" class="capture-btn">
                <span class="capture-ring"></span>
                <span class="capture-icon">📸</span>
              </button>
            </div>
            
            <div class="camera-info">
              <span class="current-mode">{{ getCategoryLabel(currentCategory) }}</span>
              <span class="current-location">📍 {{ currentLocation }}</span>
            </div>
          </div>
        </div>
        
        <div v-if="cameraError" class="camera-error">
          ⚠️ {{ cameraError }}
        </div>
      </div>
    </transition>

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
            <span class="summary-icon">📸</span>
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
            <button @click="clearAll" class="clear-btn">🗑️ Alle löschen</button>
            <button @click="addPhotosToGallery" class="confirm-btn">
              ✅ {{ totalPhotos }} zur Galerie hinzufügen
            </button>
          </div>
        </div>

        <div class="preview-grid">
          <div v-for="(photo, index) in newPhotos" :key="photo.id" class="preview-card">
            <img :src="photo.thumbnail" :alt="photo.title" class="preview-image">
            
            <!-- Upload Status Overlay -->
            <div v-if="photo.uploading" class="upload-overlay">
              <div class="upload-spinner"></div>
              <span class="upload-status">☁️ Hochladen...</span>
            </div>
            
            <!-- Storage Status Badge -->
            <div class="storage-badge" :class="{ permanent: photo.permanent, local: !photo.permanent }">
              <span v-if="photo.permanent">☁️</span>
              <span v-else>💨</span>
            </div>
            
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
                  <span v-if="photo.permanent" class="storage-tag permanent">☁️ Permanent</span>
                  <span v-else class="storage-tag local">💨 Lokal</span>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </transition>
  </div>
</template>

<style scoped>
.photo-uploader {
  background: rgba(255, 255, 255, 0.95);
  backdrop-filter: blur(15px);
  border-radius: 20px;
  padding: 1.5rem;
  margin-bottom: 1.5rem;
  box-shadow: 0 10px 30px rgba(0, 0, 0, 0.1);
  border: 1px solid rgba(255, 255, 255, 0.2);
}

/* Kompakter Header */
.uploader-header {
  margin-bottom: 1.5rem;
}

.header-main {
  display: flex;
  justify-content: space-between;
  align-items: center;
  margin-bottom: 1rem;
  flex-wrap: wrap;
  gap: 1rem;
}

.header-actions {
  display: flex;
  align-items: center;
  gap: 1rem;
  flex-wrap: wrap;
}

.header-main h2 {
  margin: 0;
  color: #333;
  font-size: 1.3rem;
}

.quick-stats {
  display: flex;
  align-items: center;
  gap: 1rem;
}

.photo-count {
  background: linear-gradient(135deg, #667eea, #764ba2);
  color: white;
  padding: 0.5rem 1rem;
  border-radius: 15px;
  font-size: 0.9rem;
  font-weight: 600;
}

.quick-add-btn {
  background: linear-gradient(135deg, #4CAF50, #45a049);
  color: white;
  border: none;
  border-radius: 15px;
  padding: 0.6rem 1.2rem;
  font-size: 0.9rem;
  font-weight: 600;
  cursor: pointer;
  transition: all 0.3s ease;
  box-shadow: 0 4px 12px rgba(76, 175, 80, 0.3);
}

.quick-add-btn:hover {
  transform: translateY(-2px);
  box-shadow: 0 6px 20px rgba(76, 175, 80, 0.4);
}

/* Kamera-Button */
.camera-btn {
  display: flex;
  align-items: center;
  gap: 0.5rem;
  padding: 0.6rem 1rem;
  background: linear-gradient(135deg, #FF6B6B, #FF8E8E);
  color: white;
  border: none;
  border-radius: 10px;
  font-weight: 600;
  font-size: 0.85rem;
  cursor: pointer;
  transition: all 0.3s ease;
  box-shadow: 0 2px 8px rgba(255, 107, 107, 0.2);
}

.camera-btn:hover {
  background: linear-gradient(135deg, #F44336, #FF6B6B);
  transform: translateY(-1px);
  box-shadow: 0 4px 12px rgba(255, 107, 107, 0.3);
}

.camera-btn.active {
  background: linear-gradient(135deg, #4CAF50, #66BB6A);
  animation: pulse 2s infinite;
}

@keyframes pulse {
  0%, 100% { opacity: 1; }
  50% { opacity: 0.8; }
}

.camera-icon {
  font-size: 1.2rem;
}

.camera-label {
  font-size: 0.8rem;
}

/* Upload Modi */
.upload-modes {
  display: flex;
  gap: 0.5rem;
  flex-wrap: wrap;
}

.mode-btn {
  display: flex;
  align-items: center;
  gap: 0.75rem;
  padding: 0.75rem 1rem;
  border: 2px solid #e1e5e9;
  border-radius: 12px;
  background: white;
  cursor: pointer;
  transition: all 0.3s ease;
  flex: 1;
  min-width: 200px;
}

.mode-btn:hover {
  border-color: #667eea;
  background: #f8f9ff;
  transform: translateY(-1px);
}

.mode-btn.active {
  border-color: #667eea;
  background: linear-gradient(135deg, #667eea, #764ba2);
  color: white;
  transform: translateY(-1px);
  box-shadow: 0 6px 20px rgba(102, 126, 234, 0.3);
}

.mode-icon {
  font-size: 1.5rem;
}

.mode-info {
  text-align: left;
}

.mode-label {
  font-weight: 600;
  font-size: 0.9rem;
  margin-bottom: 0.2rem;
}

.mode-desc {
  font-size: 0.75rem;
  opacity: 0.8;
}

/* Smart Drop Zone */
.smart-drop-zone {
  border: 3px dashed #ddd;
  border-radius: 15px;
  padding: 2rem;
  text-align: center;
  cursor: pointer;
  transition: all 0.4s ease;
  margin-bottom: 1.5rem;
  background: linear-gradient(135deg, #f8f9ff, #fff);
  position: relative;
  overflow: hidden;
}

.smart-drop-zone::before {
  content: '';
  position: absolute;
  top: 0;
  left: -100%;
  width: 100%;
  height: 100%;
  background: linear-gradient(90deg, transparent, rgba(102, 126, 234, 0.1), transparent);
  transition: left 0.8s ease;
}

.smart-drop-zone.active {
  border-color: #667eea;
  background: linear-gradient(135deg, #667eea, #764ba2);
  color: white;
  transform: scale(1.02);
}

.smart-drop-zone.active::before {
  left: 100%;
}

.smart-drop-zone.processing {
  border-color: #4CAF50;
  background: linear-gradient(135deg, #e8f5e8, #f1f8f1);
}

.smart-drop-zone.has-photos {
  padding: 1.5rem;
  border-style: solid;
  border-color: #4CAF50;
  background: linear-gradient(135deg, #e8f5e8, #f1f8f1);
}

.drop-content h3 {
  margin: 0.5rem 0;
  font-size: 1.2rem;
}

.drop-content p {
  margin: 0;
  opacity: 0.8;
  font-size: 0.9rem;
}

.drop-icon {
  font-size: 3rem;
  margin-bottom: 0.5rem;
}

.upload-hint {
  margin-top: 1rem;
  padding: 0.5rem 1rem;
  background: rgba(102, 126, 234, 0.1);
  border-radius: 20px;
  display: inline-block;
  font-size: 0.85rem;
  font-weight: 500;
}

/* Processing State */
.processing-state {
  display: flex;
  flex-direction: column;
  align-items: center;
  gap: 1rem;
}

.spinner {
  width: 40px;
  height: 40px;
  border: 4px solid #e3f2fd;
  border-top: 4px solid #4CAF50;
  border-radius: 50%;
  animation: spin 1s linear infinite;
}

@keyframes spin {
  0% { transform: rotate(0deg); }
  100% { transform: rotate(360deg); }
}

/* Kamera Interface */
.camera-interface {
  background: linear-gradient(135deg, rgba(0, 0, 0, 0.95), rgba(30, 30, 30, 0.95));
  border-radius: 15px;
  margin-bottom: 1.5rem;
  overflow: hidden;
  backdrop-filter: blur(10px);
  border: 2px solid rgba(255, 255, 255, 0.1);
}

.camera-header {
  display: flex;
  justify-content: space-between;
  align-items: center;
  padding: 1rem 1.2rem;
  background: rgba(0, 0, 0, 0.3);
  border-bottom: 1px solid rgba(255, 255, 255, 0.1);
}

.camera-header h3 {
  margin: 0;
  color: white;
  font-size: 1.1rem;
  font-weight: 600;
}

.camera-controls {
  display: flex;
  gap: 0.5rem;
}

.switch-camera-btn,
.close-camera-btn {
  padding: 0.4rem 0.8rem;
  border: 1px solid rgba(255, 255, 255, 0.3);
  border-radius: 8px;
  background: rgba(255, 255, 255, 0.1);
  color: white;
  font-size: 0.8rem;
  cursor: pointer;
  transition: all 0.3s ease;
}

.switch-camera-btn:hover,
.close-camera-btn:hover {
  background: rgba(255, 255, 255, 0.2);
  transform: translateY(-1px);
}

.camera-container {
  position: relative;
  width: 100%;
  height: 400px;
  background: #000;
  display: flex;
  align-items: center;
  justify-content: center;
}

.camera-video {
  width: 100%;
  height: 100%;
  object-fit: cover;
  border-radius: 0;
}

.camera-overlay {
  position: absolute;
  top: 0;
  left: 0;
  right: 0;
  bottom: 0;
  display: flex;
  flex-direction: column;
  justify-content: space-between;
  padding: 1rem;
  pointer-events: none;
}

.capture-controls {
  display: flex;
  justify-content: center;
  align-items: center;
  flex: 1;
  pointer-events: all;
}

.capture-btn {
  position: relative;
  width: 80px;
  height: 80px;
  border: none;
  border-radius: 50%;
  background: rgba(255, 255, 255, 0.2);
  backdrop-filter: blur(10px);
  cursor: pointer;
  transition: all 0.3s ease;
  display: flex;
  align-items: center;
  justify-content: center;
}

.capture-btn:hover {
  transform: scale(1.1);
  background: rgba(255, 255, 255, 0.3);
}

.capture-btn:active {
  transform: scale(0.95);
}

.capture-ring {
  position: absolute;
  width: 70px;
  height: 70px;
  border: 4px solid white;
  border-radius: 50%;
  background: rgba(255, 107, 107, 0.8);
}

.capture-icon {
  font-size: 1.8rem;
  z-index: 1;
}

.camera-info {
  display: flex;
  justify-content: space-between;
  align-items: flex-end;
  color: white;
  font-size: 0.9rem;
  text-shadow: 0 2px 4px rgba(0, 0, 0, 0.5);
  pointer-events: none;
}

.current-mode,
.current-location {
  background: rgba(0, 0, 0, 0.5);
  padding: 0.4rem 0.8rem;
  border-radius: 20px;
  backdrop-filter: blur(10px);
}

.camera-error {
  padding: 1rem 1.2rem;
  background: rgba(244, 67, 54, 0.1);
  border-top: 1px solid rgba(244, 67, 54, 0.3);
  color: #f44336;
  font-size: 0.9rem;
}

/* Preview State */
.preview-state {
  display: flex;
  justify-content: center;
  align-items: center;
  gap: 1rem;
}

.preview-summary {
  display: flex;
  align-items: center;
  gap: 1rem;
  background: rgba(76, 175, 80, 0.1);
  padding: 1rem 2rem;
  border-radius: 15px;
  border: 2px solid #4CAF50;
}

.summary-icon {
  font-size: 2rem;
}

.summary-text strong {
  display: block;
  color: #2E7D32;
  font-size: 1.1rem;
}

.summary-text p {
  margin: 0.25rem 0 0 0;
  color: #4CAF50;
  font-size: 0.85rem;
}

/* Schnell-Kategorien */
.quick-categories {
  background: rgba(255, 255, 255, 0.8);
  padding: 1rem;
  border-radius: 12px;
  margin-bottom: 1rem;
  border: 1px solid #e9ecef;
}

.category-header {
  display: flex;
  justify-content: space-between;
  align-items: center;
  margin-bottom: 0.75rem;
  font-weight: 600;
  color: #555;
}

.settings-btn {
  background: none;
  border: 2px solid #e1e5e9;
  border-radius: 20px;
  padding: 0.4rem 0.8rem;
  font-size: 0.8rem;
  cursor: pointer;
  transition: all 0.3s ease;
}

.settings-btn:hover,
.settings-btn.active {
  border-color: #667eea;
  background: #f8f9ff;
  color: #667eea;
}

.category-pills {
  display: flex;
  flex-wrap: wrap;
  gap: 0.5rem;
}

.category-pill {
  --category-color: #667eea;
  display: flex;
  align-items: center;
  gap: 0.5rem;
  padding: 0.5rem 1rem;
  border: 2px solid transparent;
  border-radius: 20px;
  background: rgba(255, 255, 255, 0.9);
  color: #666;
  font-size: 0.85rem;
  font-weight: 500;
  cursor: pointer;
  transition: all 0.3s ease;
  position: relative;
  overflow: hidden;
}

.category-pill::before {
  content: '';
  position: absolute;
  left: 0;
  top: 0;
  width: 4px;
  height: 100%;
  background: var(--category-color);
  transform: scaleY(0);
  transition: transform 0.3s ease;
}

.category-pill:hover {
  background: var(--category-color);
  color: white;
  transform: translateY(-1px);
}

.category-pill:hover::before {
  transform: scaleY(1);
}

.category-pill.active {
  background: var(--category-color);
  color: white;
  border-color: var(--category-color);
  transform: translateY(-1px);
  box-shadow: 0 4px 12px rgba(0, 0, 0, 0.2);
}

.category-pill.active::before {
  transform: scaleY(1);
}

.pill-count {
  background: rgba(255, 255, 255, 0.3);
  padding: 0.2rem 0.5rem;
  border-radius: 10px;
  font-size: 0.75rem;
  font-weight: 600;
}

/* Erweiterte Einstellungen */
.advanced-settings {
  background: rgba(248, 249, 255, 0.8);
  border: 1px solid #e1e5e9;
  border-radius: 10px;
  padding: 1rem;
  margin-bottom: 1rem;
}

.setting-group {
  display: flex;
  flex-direction: column;
  gap: 0.5rem;
}

.setting-group label {
  font-weight: 600;
  color: #555;
  font-size: 0.9rem;
}

/* Storage Optionen */
.storage-options {
  background: linear-gradient(135deg, rgba(138, 43, 226, 0.05), rgba(30, 144, 255, 0.05));
  border: 2px solid rgba(138, 43, 226, 0.1);
  border-radius: 12px;
  padding: 1.2rem;
  margin-bottom: 1rem;
}

.storage-header {
  display: flex;
  flex-direction: column;
  gap: 0.3rem;
  margin-bottom: 1rem;
}

.storage-header h3 {
  margin: 0;
  color: #6a1b9a;
  font-size: 1rem;
  font-weight: 600;
}

.storage-info {
  color: #666;
  font-size: 0.85rem;
}

.storage-modes {
  display: grid;
  grid-template-columns: 1fr 1fr;
  gap: 0.8rem;
}

.storage-option {
  position: relative;
  background: white;
  border: 2px solid #e1e5e9;
  border-radius: 10px;
  padding: 1rem;
  cursor: pointer;
  transition: all 0.3s ease;
  display: flex;
  flex-direction: column;
  gap: 0.5rem;
}

.storage-option:hover {
  border-color: #8a2be2;
  transform: translateY(-2px);
  box-shadow: 0 6px 20px rgba(138, 43, 226, 0.1);
}

.storage-option.active {
  border-color: #8a2be2;
  background: linear-gradient(135deg, rgba(138, 43, 226, 0.08), rgba(30, 144, 255, 0.05));
  transform: translateY(-2px);
  box-shadow: 0 6px 20px rgba(138, 43, 226, 0.15);
}

.storage-option.disabled {
  opacity: 0.5;
  cursor: not-allowed;
  pointer-events: none;
}

.storage-option.disabled .option-desc {
  color: #999;
  font-style: italic;
}

.storage-option input[type="radio"] {
  position: absolute;
  opacity: 0;
  pointer-events: none;
}

.option-content {
  display: flex;
  align-items: center;
  gap: 0.8rem;
}

.option-icon {
  font-size: 1.5rem;
  display: flex;
  align-items: center;
  justify-content: center;
  width: 40px;
  height: 40px;
  background: rgba(138, 43, 226, 0.1);
  border-radius: 8px;
}

.storage-option.active .option-icon {
  background: rgba(138, 43, 226, 0.2);
  transform: scale(1.1);
}

.option-info {
  flex: 1;
}

.option-title {
  font-weight: 600;
  color: #333;
  font-size: 0.9rem;
  margin-bottom: 0.2rem;
}

.option-desc {
  color: #666;
  font-size: 0.8rem;
}

.upload-progress {
  margin-top: 0.5rem;
  display: flex;
  align-items: center;
  gap: 0.5rem;
}

.progress-bar {
  flex: 1;
  height: 6px;
  background: rgba(138, 43, 226, 0.1);
  border-radius: 3px;
  overflow: hidden;
}

.progress-fill {
  height: 100%;
  background: linear-gradient(90deg, #8a2be2, #1e90ff);
  border-radius: 3px;
  transition: width 0.3s ease;
}

.progress-text {
  font-size: 0.75rem;
  font-weight: 600;
  color: #8a2be2;
  min-width: 35px;
}

.upload-error {
  background: rgba(244, 67, 54, 0.1);
  border: 1px solid rgba(244, 67, 54, 0.3);
  color: #d32f2f;
  padding: 0.8rem;
  border-radius: 8px;
  font-size: 0.85rem;
  margin-top: 0.8rem;
}

.config-hint {
  margin-top: 0.4rem;
  font-size: 0.75rem;
  color: #666;
}

.config-hint code {
  background: rgba(0, 0, 0, 0.1);
  padding: 0.2rem 0.4rem;
  border-radius: 4px;
  font-family: monospace;
}

.location-input {
  padding: 0.6rem;
  border: 2px solid #e1e5e9;
  border-radius: 8px;
  font-size: 0.9rem;
  transition: border-color 0.3s ease;
}

.location-input:focus {
  outline: none;
  border-color: #667eea;
}

/* Kompakte Vorschau */
.compact-preview {
  background: rgba(255, 255, 255, 0.9);
  border-radius: 15px;
  padding: 1.5rem;
  border: 1px solid #e9ecef;
}

.preview-header {
  display: flex;
  justify-content: space-between;
  align-items: center;
  margin-bottom: 1rem;
  flex-wrap: wrap;
  gap: 1rem;
}

.preview-header h3 {
  margin: 0;
  color: #333;
  font-size: 1.1rem;
}

.preview-actions {
  display: flex;
  gap: 0.75rem;
}

.clear-btn {
  background: #dc3545;
  color: white;
  border: none;
  border-radius: 10px;
  padding: 0.5rem 1rem;
  font-size: 0.8rem;
  cursor: pointer;
  transition: all 0.3s ease;
}

.clear-btn:hover {
  background: #c82333;
  transform: translateY(-1px);
}

.confirm-btn {
  background: linear-gradient(135deg, #4CAF50, #45a049);
  color: white;
  border: none;
  border-radius: 10px;
  padding: 0.5rem 1rem;
  font-size: 0.8rem;
  font-weight: 600;
  cursor: pointer;
  transition: all 0.3s ease;
  box-shadow: 0 4px 12px rgba(76, 175, 80, 0.3);
}

.confirm-btn:hover {
  transform: translateY(-2px);
  box-shadow: 0 6px 20px rgba(76, 175, 80, 0.4);
}

.preview-grid {
  display: grid;
  grid-template-columns: repeat(auto-fill, minmax(150px, 1fr));
  gap: 1rem;
}

.preview-card {
  position: relative;
  border-radius: 10px;
  overflow: hidden;
  background: white;
  box-shadow: 0 4px 12px rgba(0, 0, 0, 0.1);
  transition: all 0.3s ease;
}

.preview-card:hover {
  transform: translateY(-2px);
  box-shadow: 0 8px 25px rgba(0, 0, 0, 0.15);
}

.preview-image {
  width: 100%;
  height: 120px;
  object-fit: cover;
}

.card-overlay {
  position: absolute;
  bottom: 0;
  left: 0;
  right: 0;
  background: linear-gradient(transparent, rgba(0, 0, 0, 0.8));
  color: white;
  padding: 0.75rem 0.5rem 0.5rem;
  transform: translateY(100%);
  transition: transform 0.3s ease;
}

.preview-card:hover .card-overlay {
  transform: translateY(0);
}

.remove-btn {
  position: absolute;
  top: 0.5rem;
  right: 0.5rem;
  background: rgba(220, 53, 69, 0.9);
  color: white;
  border: none;
  border-radius: 50%;
  width: 28px;
  height: 28px;
  font-size: 0.7rem;
  cursor: pointer;
  display: flex;
  align-items: center;
  justify-content: center;
  transition: all 0.3s ease;
}

.remove-btn:hover {
  background: #dc3545;
  transform: scale(1.1);
}

.photo-info {
  margin-top: 0.5rem;
}

.photo-title {
  font-size: 0.8rem;
  font-weight: 600;
  margin-bottom: 0.5rem;
  line-height: 1.2;
}

.photo-meta {
  display: flex;
  flex-direction: column;
  gap: 0.25rem;
}

.location-tag,
.category-tag,
.gps-tag {
  font-size: 0.7rem;
  padding: 0.2rem 0.4rem;
  border-radius: 8px;
  display: inline-block;
}

.location-tag {
  background: rgba(102, 126, 234, 0.2);
  color: #667eea;
}

.category-tag {
  color: white;
  font-weight: 500;
}

.gps-tag {
  background: rgba(76, 175, 80, 0.2);
  color: #4CAF50;
  font-weight: 600;
}

.storage-tag {
  font-size: 0.7rem;
  padding: 0.2rem 0.4rem;
  border-radius: 8px;
  display: inline-block;
  font-weight: 500;
}

.storage-tag.permanent {
  background: rgba(138, 43, 226, 0.2);
  color: #8a2be2;
}

.storage-tag.local {
  background: rgba(255, 152, 0, 0.2);
  color: #ff9800;
}

/* Upload Status */
.upload-overlay {
  position: absolute;
  top: 0;
  left: 0;
  right: 0;
  bottom: 0;
  background: rgba(0, 0, 0, 0.8);
  display: flex;
  flex-direction: column;
  align-items: center;
  justify-content: center;
  color: white;
  border-radius: 10px;
  z-index: 10;
}

.upload-spinner {
  width: 30px;
  height: 30px;
  border: 3px solid rgba(255, 255, 255, 0.3);
  border-top: 3px solid #8a2be2;
  border-radius: 50%;
  animation: spin 1s linear infinite;
  margin-bottom: 0.5rem;
}

.upload-status {
  font-size: 0.8rem;
  font-weight: 600;
}

.storage-badge {
  position: absolute;
  top: 8px;
  right: 8px;
  width: 24px;
  height: 24px;
  border-radius: 50%;
  display: flex;
  align-items: center;
  justify-content: center;
  font-size: 0.8rem;
  z-index: 5;
  backdrop-filter: blur(10px);
  border: 2px solid rgba(255, 255, 255, 0.3);
}

.storage-badge.permanent {
  background: rgba(138, 43, 226, 0.9);
  color: white;
}

.storage-badge.local {
  background: rgba(255, 152, 0, 0.9);
  color: white;
}

@keyframes spin {
  0% { transform: rotate(0deg); }
  100% { transform: rotate(360deg); }
}

/* Animationen */
.slide-down-enter-active,
.slide-down-leave-active {
  transition: all 0.3s ease;
  max-height: 200px;
  opacity: 1;
}

.slide-down-enter-from,
.slide-down-leave-to {
  max-height: 0;
  opacity: 0;
  transform: translateY(-10px);
}

.fade-in-enter-active,
.fade-in-leave-active {
  transition: all 0.4s ease;
}

.fade-in-enter-from,
.fade-in-leave-to {
  opacity: 0;
  transform: translateY(20px);
}

/* Responsive Design */
@media (max-width: 768px) {
  .photo-uploader {
    padding: 1rem;
  }

  .header-main {
    flex-direction: column;
    align-items: stretch;
    text-align: center;
  }

  .upload-modes {
    flex-direction: column;
  }

  .mode-btn {
    min-width: auto;
  }

  .smart-drop-zone {
    padding: 1.5rem 1rem;
  }

  .drop-icon {
    font-size: 2.5rem;
  }

  .category-pills {
    justify-content: center;
  }

  .preview-grid {
    grid-template-columns: repeat(auto-fill, minmax(120px, 1fr));
    gap: 0.75rem;
  }

  .preview-header {
    flex-direction: column;
    align-items: stretch;
    text-align: center;
  }

  .preview-actions {
    justify-content: center;
  }
}
</style>
