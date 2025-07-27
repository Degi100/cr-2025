<script setup>
import { ref } from 'vue'

const props = defineProps({
  photo: {
    type: Object,
    required: true
  }
})

const emit = defineEmits(['click'])

const isLoading = ref(true)
const imageError = ref(false)

const formatDate = (dateString) => {
  return new Date(dateString).toLocaleDateString('de-DE', {
    day: '2-digit',
    month: '2-digit',
    year: 'numeric'
  })
}

const handleImageLoad = () => {
  isLoading.value = false
}

const handleImageError = () => {
  isLoading.value = false
  imageError.value = true
}

const handleClick = () => {
  emit('click')
}
</script>

<template>
  <div class="photo-card" @click="handleClick">
    <!-- Loading Placeholder -->
    <div v-if="isLoading" class="loading-placeholder">
      <div class="loading-spinner"></div>
    </div>

    <!-- Error Placeholder -->
    <div v-if="imageError" class="error-placeholder">
      <span>📷</span>
      <p>Bild konnte nicht geladen werden</p>
    </div>

    <!-- Main Image -->
    <div v-if="!imageError" class="image-container">
      <img
        :src="photo.thumbnail"
        :alt="photo.title"
        @load="handleImageLoad"
        @error="handleImageError"
        class="photo-image"
        :class="{ 'loaded': !isLoading }"
      />
      
      <!-- Overlay für Hover-Effekt -->
      <div class="photo-overlay">
        <div class="overlay-content">
          <span class="zoom-icon">🔍</span>
          <p class="overlay-text">Klicken zum Vergrößern</p>
        </div>
      </div>
    </div>

    <!-- Photo Info -->
    <div class="photo-info">
      <h3 class="photo-title">{{ photo.title }}</h3>
      <p class="photo-description">{{ photo.description }}</p>
      
      <div class="photo-meta">
        <span class="photo-date">📅 {{ formatDate(photo.date) }}</span>
        <span class="photo-location">📍 {{ photo.location }}</span>
      </div>
    </div>
  </div>
</template>

<style scoped>
.photo-card {
  background: white;
  border-radius: 15px;
  overflow: hidden;
  box-shadow: 0 8px 25px rgba(0, 0, 0, 0.1);
  transition: all 0.3s ease;
  cursor: pointer;
  transform: translateY(0);
}

.photo-card:hover {
  transform: translateY(-8px);
  box-shadow: 0 15px 35px rgba(0, 0, 0, 0.15);
}

.loading-placeholder,
.error-placeholder {
  height: 250px;
  display: flex;
  flex-direction: column;
  align-items: center;
  justify-content: center;
  background: #f8f9fa;
  color: #666;
}

.loading-spinner {
  width: 40px;
  height: 40px;
  border: 3px solid #e1e5e9;
  border-top: 3px solid #667eea;
  border-radius: 50%;
  animation: spin 1s linear infinite;
}

@keyframes spin {
  0% { transform: rotate(0deg); }
  100% { transform: rotate(360deg); }
}

.error-placeholder span {
  font-size: 3rem;
  margin-bottom: 1rem;
}

.image-container {
  position: relative;
  height: 250px;
  overflow: hidden;
}

.photo-image {
  width: 100%;
  height: 100%;
  object-fit: cover;
  transition: all 0.3s ease;
  opacity: 0;
}

.photo-image.loaded {
  opacity: 1;
}

.photo-overlay {
  position: absolute;
  top: 0;
  left: 0;
  right: 0;
  bottom: 0;
  background: rgba(0, 0, 0, 0.7);
  display: flex;
  align-items: center;
  justify-content: center;
  opacity: 0;
  transition: opacity 0.3s ease;
}

.photo-card:hover .photo-overlay {
  opacity: 1;
}

.photo-card:hover .photo-image {
  transform: scale(1.05);
}

.overlay-content {
  text-align: center;
  color: white;
}

.zoom-icon {
  font-size: 2rem;
  display: block;
  margin-bottom: 0.5rem;
}

.overlay-text {
  font-size: 0.9rem;
  font-weight: 500;
}

.photo-info {
  padding: 1.5rem;
}

.photo-title {
  font-size: 1.2rem;
  font-weight: 700;
  color: #333;
  margin-bottom: 0.5rem;
  line-height: 1.3;
}

.photo-description {
  color: #666;
  font-size: 0.9rem;
  line-height: 1.5;
  margin-bottom: 1rem;
}

.photo-meta {
  display: flex;
  flex-wrap: wrap;
  gap: 1rem;
  font-size: 0.8rem;
  color: #888;
}

.photo-date,
.photo-location {
  display: flex;
  align-items: center;
  gap: 0.3rem;
}

/* Mobile Responsive */
@media (max-width: 768px) {
  .photo-card {
    margin-bottom: 1rem;
  }

  .image-container {
    height: 200px;
  }

  .photo-info {
    padding: 1rem;
  }

  .photo-title {
    font-size: 1.1rem;
  }

  .photo-meta {
    flex-direction: column;
    gap: 0.5rem;
  }
}
</style>
