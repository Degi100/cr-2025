# 📤 Netlify Image Storage Optionen

## 🎯 **Problem:** localStorage ist nur gerätespezifisch

**Aktuell:** Bilder werden nur lokal im Browser gespeichert
**Gewünscht:** Bilder sollen dauerhaft und geräteübergreifend verfügbar sein

---

## 🚀 **Lösung: Netlify Large Media + Git LFS**

### 📋 **Plan:**
1. **Git LFS** für große Bilddateien aktivieren
2. **Netlify Large Media** für optimierte Bildauslieferung
3. **Automatischer Upload** zu Git Repository
4. **CDN Caching** für schnelle Auslieferung

---

## 🛠️ **Implementation Steps:**

### **1. Git LFS Setup**
```bash
# Git LFS installieren
git lfs install

# Bildformate für LFS konfigurieren
git lfs track "*.jpg"
git lfs track "*.jpeg" 
git lfs track "*.png"
git lfs track "*.webp"

# .gitattributes committen
git add .gitattributes
git commit -m "🔧 Add Git LFS for images"
```

### **2. Netlify Large Media aktivieren**
```bash
# Netlify CLI installieren
npm install -g netlify-cli

# Large Media aktivieren
netlify lm:install
netlify lm:setup
```

### **3. Upload-Funktion erweitern**
```javascript
// Neue Upload-Pipeline:
// 1. Bild zu /public/uploads/ speichern
// 2. Git add + commit + push
// 3. Netlify rebuild triggern
// 4. URL zu localStorage für schnellen Zugriff
```

---

## 🎯 **Alternative: GitHub API Upload**

Noch eleganter - direkter Upload zu GitHub über API:

```javascript
const uploadToGitHub = async (imageFile, fileName) => {
  const base64Content = await fileToBase64(imageFile)
  
  const response = await fetch(`https://api.github.com/repos/Degi100/cr-2025/contents/public/uploads/${fileName}`, {
    method: 'PUT',
    headers: {
      'Authorization': `token ${GITHUB_TOKEN}`,
      'Content-Type': 'application/json',
    },
    body: JSON.stringify({
      message: `📸 Add new photo: ${fileName}`,
      content: base64Content
    })
  })
  
  // Trigger Netlify rebuild
  await fetch(NETLIFY_BUILD_HOOK, { method: 'POST' })
}
```

Welchen Ansatz bevorzugst du? Oder soll ich direkt mit der GitHub API Lösung starten?
