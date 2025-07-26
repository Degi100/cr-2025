# 🏖️ Urlaubsreise Bildergalerie 2025

Eine moderne, responsive Bildergalerie erstellt mit Vue.js 3 und Vite. Perfekt um Urlaubserinnerungen im Blog-Stil festzuhalten.

## ✨ Features

- 📸 **Responsive Bildergalerie** mit modernem Grid-Layout
- 🔍 **Lightbox-Funktion** für Vollbildansicht
- 🎯 **Filterung** nach Orten und Sortierung nach Datum/Titel
- 📱 **Mobile-First Design** - funktioniert auf allen Geräten
- ⌨️ **Keyboard Navigation** (Pfeiltasten, ESC)
- 🎨 **Moderne UI** mit Glasmorphism-Effekten
- 📍 **Geo-Tagging** für Ortsangaben
- 📅 **Chronologische Darstellung** der Urlaubsmomente

## 🚀 Live Demo

Die Galerie verwendet Beispielbilder von Unsplash und zeigt einen fiktiven Malediven-Urlaub.

## 🛠️ Technologie-Stack

- **Vue.js 3** mit Composition API
- **Vite** für ultraschnelle Entwicklung
- **CSS Grid & Flexbox** für responsive Layouts
- **CSS3 Animationen** für smooth Übergänge
- **Vanilla JavaScript** - keine zusätzlichen Dependencies

## 📁 Projektstruktur

```
src/
├── components/
│   ├── PhotoGallery.vue    # Haupt-Galerie-Komponente
│   ├── PhotoCard.vue       # Einzelne Foto-Karte
│   └── Lightbox.vue        # Vollbild-Anzeige
├── App.vue                 # Root-Komponente
└── main.js                 # App-Einstiegspunkt
```

## 🚀 Installation & Start

```bash
# Dependencies installieren
npm install

# Entwicklungsserver starten
npm run dev

# Für Produktion bauen
npm run build

# Vorschau der Production-Version
npm run preview
```

## 📸 Eigene Bilder hinzufügen

1. Bearbeite `src/components/PhotoGallery.vue`
2. Aktualisiere das `photos` Array mit deinen Bildern:

```javascript
{
  id: 1,
  url: 'pfad/zum/großen/bild.jpg',
  thumbnail: 'pfad/zum/thumbnail.jpg',
  title: 'Dein Bildtitel',
  description: 'Beschreibung des Moments',
  date: '2025-07-15',
  location: 'Ort der Aufnahme'
}
```

## 🎨 Anpassungen

- **Farben**: Bearbeite die CSS-Variablen in `App.vue`
- **Layout**: Grid-Größen in `PhotoGallery.vue` anpassen
- **Animationen**: Transition-Zeiten in den jeweiligen Komponenten

## 📱 Browser-Unterstützung

- ✅ Chrome 60+
- ✅ Firefox 55+
- ✅ Safari 11+
- ✅ Edge 79+

## 🤝 Mitwirken

1. Fork das Repository
2. Erstelle einen Feature-Branch
3. Committe deine Änderungen
4. Push zum Branch
5. Öffne einen Pull Request

---

Erstellt mit ❤️ und Vue.js für unvergessliche Urlaubserinnerungen!
