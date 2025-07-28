# 🔧 GitHub Upload Setup - Anleitung

Diese Anleitung zeigt dir, wie du permanente Bilderspeicherung via GitHub API einrichtest.

## 📋 Voraussetzungen

1. **GitHub Account** mit einem Repository für die Fotogalerie
2. **GitHub Personal Access Token** mit Schreibrechten
3. **Netlify Build Hook** (optional, für automatische Deploys)

## 🔑 1. GitHub Personal Access Token erstellen

### Schritt 1: Token generieren
1. Gehe zu [GitHub Settings → Tokens](https://github.com/settings/tokens)
2. Klicke auf **"Generate new token (classic)"**
3. Gib dem Token einen Namen: `CR-2025 Photo Upload`
4. Wähle Ablaufzeit: **"No expiration"** (oder nach Bedarf)

### Schritt 2: Berechtigungen setzen
Aktiviere folgende Scopes:
- ✅ `repo` (Full control of private repositories)
  - ✅ `repo:status`
  - ✅ `repo_deployment` 
  - ✅ `public_repo`
  - ✅ `repo:invite`
  - ✅ `security_events`

### Schritt 3: Token kopieren
- Klicke **"Generate token"**
- ⚠️ **WICHTIG**: Kopiere den Token sofort - er wird nie wieder angezeigt!

## 🏗️ 2. Netlify Build Hook erstellen (Optional)

### Für automatische Deploys nach Bild-Upload:

1. Gehe zu [Netlify Dashboard](https://app.netlify.com/)
2. Wähle deine Site aus
3. **Settings** → **Build & deploy** → **Build hooks**
4. Klicke **"Add build hook"**
5. Name: `Photo Upload Trigger`
6. Branch: `main`
7. Kopiere die Hook URL

## ⚙️ 3. Umgebungsvariablen konfigurieren

### Lokale Entwicklung (.env)
```env
# GitHub Personal Access Token
VITE_GITHUB_TOKEN=ghp_your_token_here

# GitHub Repository (Format: username/repo-name)
VITE_GITHUB_REPO=dein-username/cr-2025

# GitHub Branch
VITE_GITHUB_BRANCH=main

# Netlify Build Hook (optional)
VITE_NETLIFY_BUILD_HOOK=https://api.netlify.com/build_hooks/your-hook-id

# Upload-Pfad im Repository
VITE_GITHUB_UPLOAD_PATH=public/uploads
```

### Netlify Deployment (Umgebungsvariablen)
1. Gehe zu **Site Settings** → **Environment variables**
2. Füge folgende Variablen hinzu:
   - `VITE_GITHUB_TOKEN` = dein GitHub Token
   - `VITE_GITHUB_REPO` = username/repository
   - `VITE_NETLIFY_BUILD_HOOK` = deine Build Hook URL

## 📁 4. Repository-Struktur

Das System erstellt automatisch folgende Ordnerstruktur:

```
public/
└── uploads/
    ├── strand/
    │   ├── 2025-01-15_strand_tamarindo_001.jpg
    │   └── 2025-01-15_strand_tamarindo_002.jpg
    ├── natur/
    │   └── 2025-01-16_natur_monteverde_001.jpg
    └── README.md
```

## 🧪 5. Upload-Test

### Test 1: Konfiguration prüfen
1. Starte die Anwendung: `npm run dev`
2. Öffne PhotoUploader
3. Schaue nach grünem ☁️ Symbol bei "Permanent" Option

### Test 2: Erstes Bild hochladen
1. Wähle "Permanent" Storage
2. Lade ein Testbild hoch
3. Prüfe GitHub Repository → `public/uploads/`
4. Verifiziere dass Netlify automatisch deployed hat

## 🔍 6. Troubleshooting

### ❌ "GitHub Token fehlt"
- Prüfe `.env` Datei existiert
- Token muss mit `ghp_` beginnen
- Restart der Entwicklungsumgebung nötig

### ❌ "403 Forbidden" Fehler
- Token-Berechtigungen prüfen (`repo` Scope nötig)
- Repository-Name korrekt? Format: `username/repo`

### ❌ "404 Not Found" Fehler  
- Repository existiert?
- Repository ist public oder Token hat private repo Rechte?
- Branch-Name korrekt? (meist `main` oder `master`)

### ❌ Netlify Deploy funktioniert nicht
- Build Hook URL korrekt kopiert?
- Build Hook aktiviert?
- Netlify Site mit GitHub Repository verbunden?

## 🚀 7. Erweiterte Konfiguration

### Custom Upload-Pfad
```env
# Bilder in anderem Ordner speichern
VITE_GITHUB_UPLOAD_PATH=assets/photos
```

### Multi-Repository Setup
```env
# Separate Repos für verschiedene Zwecke
VITE_GITHUB_REPO=username/photos-2025
```

## 📊 8. Monitoring

### Upload-Status prüfen:
- Browser Developer Tools → Console
- Suche nach `☁️ GitHub Upload` Logs
- GitHub Repository → Recent commits

### Performance optimieren:
- Bilder vor Upload komprimieren
- Batch-Uploads für viele Bilder
- CDN für bessere Ladezeiten

## 🔐 9. Sicherheit

### Best Practices:
- ✅ Token nie in Code committen
- ✅ Regelmäßig Token rotieren
- ✅ Minimale Berechtigungen verwenden
- ✅ `.env` in `.gitignore`

### Produktions-Setup:
- Environment Variables über Netlify UI setzen
- Separate Tokens für Development/Production
- Monitoring für fehlgeschlagene Uploads

---

## 📞 Support

Bei Problemen:
1. Console-Logs prüfen
2. GitHub API Rate Limits beachten (5000 Requests/Stunde)
3. Netlify Build Logs kontrollieren

**Erfolgreiches Setup erkennst du an:**
- ✅ Grünes ☁️ Symbol in Storage-Optionen
- ✅ Upload-Progress beim Hinzufügen von Bildern  
- ✅ Neue Dateien in GitHub Repository
- ✅ Automatischer Netlify Deploy
