<script setup>
import { ref, computed, onMounted, onUnmounted } from 'vue'

const props = defineProps({
  photo: {
    type: Object,
    required: true
  },
  photos: {
    type: Array,
    required: true
  }
})

const emit = defineEmits(['close', 'navigate'])

const isLoading = ref(true)

// Finde aktuellen Index
const currentIndex = computed(() => {
  return props.photos.findIndex(p => p.id === props.photo.id)
})

const hasPrevious = computed(() => currentIndex.value > 0)
const hasNext = computed(() => currentIndex.value < props.photos.length - 1)

// Navigation
const goToPrevious = () => {
  if (hasPrevious.value) {
    isLoading.value = true
    emit('navigate', props.photos[currentIndex.value - 1])
  }
}

const goToNext = () => {
  if (hasNext.value) {
    isLoading.value = true
    emit('navigate', props.photos[currentIndex.value + 1])
  }
}

// Keyboard Navigation
const handleKeyDown = (event) => {
  switch (event.key) {
    case 'Escape':
      emit('close')
      break
    case 'ArrowLeft':
      goToPrevious()
      break
    case 'ArrowRight':
      goToNext()
      break
  }
}

// Image Loading
const handleImageLoad = () => {
  isLoading.value = false
}

// Date Formatting
const formatDate = (dateString) => {
  return new Date(dateString).toLocaleDateString('de-DE', {
    weekday: 'long',
    year: 'numeric',
    month: 'long',
    day: 'numeric'
  })
}

// Lifecycle
onMounted(() => {
  document.addEventListener('keydown', handleKeyDown)
  document.body.style.overflow = 'hidden'
})

onUnmounted(() => {
  document.removeEventListener('keydown', handleKeyDown)
  document.body.style.overflow = 'auto'
})
</script>

<template>
  <div class="lightbox-overlay" @click="emit('close')">
    <div class="lightbox-container" @click.stop>
      <!-- Close Button -->
      <button class="close-button" @click="emit('close')" aria-label="Schließen">
        ✕
      </button>

      <!-- Navigation Buttons -->
      <button
        v-if="hasPrevious"
        class="nav-button nav-previous"
        @click="goToPrevious"
        aria-label="Vorheriges Bild"
      >
        ←
      </button>

      <button
        v-if="hasNext"
        class="nav-button nav-next"
        @click="goToNext"
        aria-label="Nächstes Bild"
      >
        →
      </button>

      <!-- Main Content -->
      <div class="lightbox-content">
        <!-- Image Section -->
        <div class="image-section">
          <!-- Loading Spinner -->
          <div v-if="isLoading" class="loading-overlay">
            <div class="loading-spinner"></div>
          </div>

          <!-- Main Image -->
          <img
            :src="photo.url"
            :alt="photo.title"
            @load="handleImageLoad"
            class="lightbox-image"
            :class="{ 'loaded': !isLoading }"
          />
        </div>

        <!-- Info Section -->
        <div class="info-section">
          <h2 class="photo-title">{{ photo.title }}</h2>
          <p class="photo-description">{{ photo.description }}</p>
          
          <div class="photo-meta">
            <div class="meta-item">
              <span class="meta-icon">📅</span>
              <span class="meta-text">{{ formatDate(photo.date) }}</span>
            </div>
            <div class="meta-item">
              <span class="meta-icon">📍</span>
              <span class="meta-text">{{ photo.location }}</span>
            </div>
            <div class="meta-item">
              <span class="meta-icon">📸</span>
              <span class="meta-text">{{ currentIndex + 1 }} von {{ photos.length }}</span>
            </div>
          </div>

          <!-- Navigation Dots -->
          <div class="navigation-dots">
            <button
              v-for="(dotPhoto, index) in photos"
              :key="dotPhoto.id"
              class="nav-dot"
              :class="{ 'active': index === currentIndex }"
              @click="emit('navigate', dotPhoto)"
              :aria-label="`Gehe zu Bild ${index + 1}`"
            ></button>
          </div>
        </div>
      </div>
    </div>
  </div>
</template>

<style scoped>
.lightbox-overlay {
  position: fixed;
  top: 0;
  left: 0;
  right: 0;
  bottom: 0;
  background: rgba(0, 0, 0, 0.95);
  display: flex;
  align-items: center;
  justify-content: center;
  z-index: 1000;
  animation: fadeIn 0.3s ease;
}

@keyframes fadeIn {
  from { opacity: 0; }
  to { opacity: 1; }
}

.lightbox-container {
  position: relative;
  max-width: 95vw;
  max-height: 95vh;
  width: 100%;
  background: white;
  border-radius: 15px;
  overflow: hidden;
  box-shadow: 0 25px 50px rgba(0, 0, 0, 0.3);
  animation: slideIn 0.3s ease;
}

@keyframes slideIn {
  from {
    transform: scale(0.9);
    opacity: 0;
  }
  to {
    transform: scale(1);
    opacity: 1;
  }
}

.close-button {
  position: absolute;
  top: 1rem;
  right: 1rem;
  width: 40px;
  height: 40px;
  border: none;
  background: rgba(0, 0, 0, 0.7);
  color: white;
  border-radius: 50%;
  font-size: 1.2rem;
  cursor: pointer;
  z-index: 10;
  transition: all 0.3s ease;
}

.close-button:hover {
  background: rgba(0, 0, 0, 0.9);
  transform: scale(1.1);
}

.nav-button {
  position: absolute;
  top: 50%;
  transform: translateY(-50%);
  width: 50px;
  height: 50px;
  border: none;
  background: rgba(0, 0, 0, 0.7);
  color: white;
  border-radius: 50%;
  font-size: 1.5rem;
  cursor: pointer;
  z-index: 10;
  transition: all 0.3s ease;
}

.nav-button:hover {
  background: rgba(0, 0, 0, 0.9);
  transform: translateY(-50%) scale(1.1);
}

.nav-previous {
  left: 1rem;
}

.nav-next {
  right: 1rem;
}

.lightbox-content {
  display: flex;
  height: 100%;
  max-height: 95vh;
}

.image-section {
  flex: 2;
  position: relative;
  display: flex;
  align-items: center;
  justify-content: center;
  background: #f8f9fa;
  min-height: 400px;
}

.loading-overlay {
  position: absolute;
  top: 0;
  left: 0;
  right: 0;
  bottom: 0;
  display: flex;
  align-items: center;
  justify-content: center;
  background: #f8f9fa;
  z-index: 5;
}

.loading-spinner {
  width: 50px;
  height: 50px;
  border: 4px solid #e1e5e9;
  border-top: 4px solid #667eea;
  border-radius: 50%;
  animation: spin 1s linear infinite;
}

@keyframes spin {
  0% { transform: rotate(0deg); }
  100% { transform: rotate(360deg); }
}

.lightbox-image {
  max-width: 100%;
  max-height: 100%;
  object-fit: contain;
  opacity: 0;
  transition: opacity 0.3s ease;
}

.lightbox-image.loaded {
  opacity: 1;
}

.info-section {
  flex: 1;
  padding: 2rem;
  display: flex;
  flex-direction: column;
  min-width: 300px;
  max-width: 400px;
}

.photo-title {
  font-size: 1.5rem;
  font-weight: 700;
  color: #333;
  margin-bottom: 1rem;
  line-height: 1.3;
}

.photo-description {
  color: #666;
  line-height: 1.6;
  margin-bottom: 2rem;
  flex-grow: 1;
}

.photo-meta {
  margin-bottom: 2rem;
}

.meta-item {
  display: flex;
  align-items: center;
  margin-bottom: 0.75rem;
  font-size: 0.9rem;
}

.meta-icon {
  margin-right: 0.75rem;
  font-size: 1rem;
}

.meta-text {
  color: #555;
}

.navigation-dots {
  display: flex;
  flex-wrap: wrap;
  gap: 0.5rem;
  justify-content: center;
}

.nav-dot {
  width: 12px;
  height: 12px;
  border: none;
  border-radius: 50%;
  background: #ddd;
  cursor: pointer;
  transition: all 0.3s ease;
}

.nav-dot:hover {
  background: #999;
  transform: scale(1.2);
}

.nav-dot.active {
  background: #667eea;
  transform: scale(1.3);
}

/* Mobile Responsive */
@media (max-width: 768px) {
  .lightbox-container {
    max-width: 100vw;
    max-height: 100vh;
    border-radius: 0;
  }

  .lightbox-content {
    flex-direction: column;
  }

  .image-section {
    flex: 1;
    min-height: 250px;
  }

  .info-section {
    flex: none;
    min-width: unset;
    max-width: unset;
    padding: 1rem;
  }

  .nav-button {
    width: 40px;
    height: 40px;
    font-size: 1.2rem;
  }

  .nav-previous {
    left: 0.5rem;
  }

  .nav-next {
    right: 0.5rem;
  }

  .close-button {
    top: 0.5rem;
    right: 0.5rem;
    width: 35px;
    height: 35px;
  }
}
</style>
