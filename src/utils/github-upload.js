import { ref, computed } from 'vue'

// GitHub API Configuration mit Environment Variables
const GITHUB_CONFIG = {
  owner: import.meta.env.VITE_GITHUB_REPO?.split('/')[0] || 'rdege',
  repo: import.meta.env.VITE_GITHUB_REPO?.split('/')[1] || 'cr-2025', 
  branch: import.meta.env.VITE_GITHUB_BRANCH || 'main',
  uploadsPath: import.meta.env.VITE_GITHUB_UPLOAD_PATH || 'public/uploads/',
  token: import.meta.env.VITE_GITHUB_TOKEN
}

// Netlify Build Hook (optional für sofortiges Rebuild)
const NETLIFY_BUILD_HOOK = import.meta.env.VITE_NETLIFY_BUILD_HOOK

// Konfigurationsprüfung
const isConfigured = computed(() => {
  return GITHUB_CONFIG.token && GITHUB_CONFIG.owner && GITHUB_CONFIG.repo
})

const configError = computed(() => {
  if (!GITHUB_CONFIG.token) return 'GitHub Token fehlt - siehe .env.example'
  if (!GITHUB_CONFIG.owner || !GITHUB_CONFIG.repo) return 'GitHub Repository nicht konfiguriert'
  return null
})

/**
 * GitHub Repository Upload Service
 * Speichert Bilder dauerhaft im Git Repository
 */
export class GitHubUploadService {
  
  /**
   * Upload eines Bildes zu GitHub Repository
   * @param {File} imageFile - Die Bilddatei
   * @param {Object} photoMetadata - Foto-Metadaten (title, location, category, etc.)
   * @returns {Promise<Object>} - Uploaded photo object mit permanenter URL
   */
  static async uploadImage(imageFile, photoMetadata) {
    // Konfigurationsprüfung
    if (!isConfigured.value) {
      throw new Error(configError.value || 'GitHub Upload nicht konfiguriert')
    }
    
    try {
      console.log('🚀 Starte GitHub Upload:', imageFile.name)
      
      // 1. Datei zu Base64 konvertieren
      const base64Content = await this.fileToBase64(imageFile)
      
      // 2. Einzigartigen Dateinamen generieren
      const fileName = this.generateFileName(imageFile, photoMetadata)
      const filePath = `${GITHUB_CONFIG.uploadsPath}${fileName}`
      
      console.log('📁 Upload Pfad:', filePath)
      
      // 3. Upload zu GitHub via API
      const uploadResponse = await this.uploadToGitHub(filePath, base64Content, photoMetadata)
      
      // 4. Netlify Rebuild triggern (optional für sofortige Verfügbarkeit)
      if (NETLIFY_BUILD_HOOK) {
        await this.triggerNetlifyBuild()
      }
      
      // 5. Photo-Objekt mit permanenter URL erstellen
      const photoUrl = this.getPhotoUrl(fileName)
      
      return {
        id: Date.now(),
        url: photoUrl,
        thumbnail: photoUrl + '?w=400', // Netlify Large Media Transform
        title: photoMetadata.title,
        description: photoMetadata.description,
        date: photoMetadata.date,
        location: photoMetadata.location,
        category: photoMetadata.category,
        fileName: fileName,
        gpsData: photoMetadata.gpsData,
        isPermanent: true, // Flag für dauerhafte Speicherung
        uploadedAt: new Date().toISOString()
      }
      
    } catch (error) {
      console.error('❌ GitHub Upload failed:', error)
      throw new Error(`Upload fehlgeschlagen: ${error.message}`)
    }
  }
  
  /**
   * Datei zu Base64 String konvertieren
   */
  static fileToBase64(file) {
    return new Promise((resolve, reject) => {
      const reader = new FileReader()
      reader.onload = () => {
        // Remove data:image/jpeg;base64, prefix
        const base64 = reader.result.split(',')[1]
        resolve(base64)
      }
      reader.onerror = reject
      reader.readAsDataURL(file)
    })
  }
  
  /**
   * Einzigartigen Dateinamen generieren
   */
  static generateFileName(file, metadata) {
    const timestamp = new Date().toISOString().replace(/[:.]/g, '-')
    const extension = file.name.split('.').pop().toLowerCase()
    const category = metadata.category || 'misc'
    const location = (metadata.location || 'unknown').replace(/[^a-zA-Z0-9]/g, '-').toLowerCase()
    
    return `${category}_${location}_${timestamp}.${extension}`
  }
  
  /**
   * Upload zu GitHub Repository
   */
  static async uploadToGitHub(filePath, base64Content, metadata) {
    const url = `https://api.github.com/repos/${GITHUB_CONFIG.owner}/${GITHUB_CONFIG.repo}/contents/${filePath}`
    
    const commitMessage = `📸 Add photo: ${metadata.title || 'New photo'}\n\n` +
                          `📍 Location: ${metadata.location || 'Unknown'}\n` +
                          `🏷️ Category: ${metadata.category || 'misc'}\n` +
                          `📅 Date: ${metadata.date || new Date().toISOString().split('T')[0]}`
    
    const response = await fetch(url, {
      method: 'PUT',
      headers: {
        'Authorization': `token ${GITHUB_CONFIG.token}`,
        'Content-Type': 'application/json',
        'Accept': 'application/vnd.github.v3+json'
      },
      body: JSON.stringify({
        message: commitMessage,
        content: base64Content,
        branch: GITHUB_CONFIG.branch
      })
    })
    
    if (!response.ok) {
      const error = await response.json()
      throw new Error(`GitHub API Error: ${error.message}`)
    }
    
    return await response.json()
  }
  
  /**
   * Netlify Build triggern für sofortige Verfügbarkeit
   */
  static async triggerNetlifyBuild() {
    try {
      if (NETLIFY_BUILD_HOOK) {
        await fetch(NETLIFY_BUILD_HOOK, { 
          method: 'POST',
          headers: {
            'Content-Type': 'application/json'
          }
        })
        console.log('🚀 Netlify rebuild triggered')
      }
    } catch (error) {
      console.warn('⚠️ Netlify rebuild failed (non-critical):', error)
    }
  }
  
  /**
   * Permanente URL für hochgeladenes Bild generieren
   */
  static getPhotoUrl(fileName) {
    // Absolute URL für GitHub-gehostete Bilder verwenden
    // Dies sorgt dafür, dass Bilder nach dem Aktualisieren bestehen bleiben
    const baseUrl = window.location.origin
    return `${baseUrl}/uploads/${fileName}`
  }
  
  /**
   * Alle verfügbaren Bilder aus dem Repository laden
   */
  static async loadAvailablePhotos() {
    try {
      const url = `https://api.github.com/repos/${GITHUB_CONFIG.owner}/${GITHUB_CONFIG.repo}/contents/${GITHUB_CONFIG.uploadsPath}`
      
      const response = await fetch(url, {
        headers: {
          'Accept': 'application/vnd.github.v3+json'
        }
      })
      
      if (!response.ok) {
        throw new Error('Failed to load photos from repository')
      }
      
      const files = await response.json()
      return files.filter(file => 
        file.type === 'file' && 
        /\.(jpg|jpeg|png|webp)$/i.test(file.name)
      ).map(file => ({
        fileName: file.name,
        url: this.getPhotoUrl(file.name),
        downloadUrl: file.download_url,
        size: file.size,
        lastModified: file.sha
      }))
      
    } catch (error) {
      console.error('❌ Failed to load photos:', error)
      return []
    }
  }
}

/**
 * Hook für Vue Komponenten
 */
export function useGitHubUpload() {
  const isUploading = ref(false)
  const uploadProgress = ref(0)
  const uploadError = ref(null)
  
  const uploadImage = async (imageFile, category, location) => {
    // Prüfe Konfiguration vor Upload
    if (!isConfigured.value) {
      uploadError.value = configError.value
      throw new Error(configError.value)
    }

    isUploading.value = true
    uploadError.value = null
    uploadProgress.value = 0

    try {
      // Simuliere Progress für UX
      const progressInterval = setInterval(() => {
        if (uploadProgress.value < 90) {
          uploadProgress.value += 10
        }
      }, 200)

      // Foto-Metadaten für GitHub Upload vorbereiten
      const photoMetadata = {
        title: imageFile.name.replace(/\.[^/.]+$/, ""),
        category,
        location,
        date: new Date().toISOString().split('T')[0]
      }

      const result = await GitHubUploadService.uploadImage(imageFile, photoMetadata)

      clearInterval(progressInterval)
      uploadProgress.value = 100

      // Die generierte URL zurückgeben
      // Wir verwenden das Ergebnis des Uploads direkt
      return result.url

    } catch (error) {
      console.error('GitHub Upload Error:', error)
      uploadError.value = error.message
      throw error
    } finally {
      isUploading.value = false
      setTimeout(() => {
        uploadProgress.value = 0
      }, 1000)
    }
  }
  
  return {
    uploadImage,
    isUploading,
    uploadProgress,
    uploadError,
    isConfigured,
    configError
  }
}
