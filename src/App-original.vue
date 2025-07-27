<script setup>
import PhotoGallery from './components/PhotoGallery.vue'
import { ref } from 'vue'

const galleryTitle = ref('🌴 Costa Rica Abenteuer 2025')
</script>

<template>
  <div id="app">
    <header class="app-header">
      <h1>{{ galleryTitle }}</h1>
      <p class="subtitle">Pura Vida - Eine unvergessliche Reise durch das Paradies</p>
    </header>

    <main class="main-content">
      <PhotoGallery />
    </main>

    <footer class="app-footer">
      <p>© 2025 - Erstellt mit ❤️ und Vue.js</p>
    </footer>
  </div>
</template>

<style>
* {
  margin: 0;
  padding: 0;
  box-sizing: border-box;
}

body {
  font-family: 'Inter', -apple-system, BlinkMacSystemFont, 'Segoe UI', Roboto, sans-serif;
  background: linear-gradient(135deg, #667eea 0%, #764ba2 100%);
  min-height: 100vh;
  color: #333;
}

#app {
  min-height: 100vh;
  display: flex;
  flex-direction: column;
}

.app-header {
  background: rgba(255, 255, 255, 0.95);
  backdrop-filter: blur(10px);
  padding: 2rem;
  text-align: center;
  box-shadow: 0 4px 20px rgba(0, 0, 0, 0.1);
}

.app-header h1 {
  font-size: 2.5rem;
  font-weight: 700;
  background: linear-gradient(135deg, #667eea, #764ba2);
  -webkit-background-clip: text;
  -webkit-text-fill-color: transparent;
  margin-bottom: 0.5rem;
}

.subtitle {
  font-size: 1.1rem;
  color: #666;
  font-style: italic;
}

.main-content {
  flex: 1;
  padding: 2rem;
}

.app-footer {
  background: rgba(0, 0, 0, 0.8);
  color: white;
  text-align: center;
  padding: 1rem;
  margin-top: auto;
}

@media (max-width: 768px) {
  .app-header h1 {
    font-size: 2rem;
  }
  
  .main-content {
    padding: 1rem;
  }
}
</style>
