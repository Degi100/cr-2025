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
- 🌍 **Intelligente GPS-Ortserkennung** - NEU!

## 🌍 GPS-Geotagging System

### 🎯 **Automatische Weltweite Ortserkennung**

Das System erkennt **automatisch den Aufnahmeort** deiner Handyfotos und ordnet sie der passenden Kategorie zu!

#### **🚀 So funktioniert es:**

1. **📷 Foto mit Handy machen** → GPS-Koordinaten werden automatisch gespeichert
2. **⬆️ Bild in Galerie hochladen** → System liest GPS-Daten aus
3. **🌍 Ort wird erkannt** → z.B. "Escazú, Costa Rica" oder "Times Square, New York"
4. **❓ Bestätigung** → "Ist 'Escazú' korrekt?" - Ja/Nein/Ändern
5. **📂 Automatische Kategorisierung** → Bild wird passender Kategorie zugeordnet

#### **📍 Unterstützte Regionen:**

- **🇨🇷 Costa Rica** (Vollständige Abdeckung)
  - Escazú, San José, Manuel Antonio, Tamarindo, Monteverde, Arenal, etc.
- **🌎 Weltweit erweiterbar** für alle Reiseziele

#### **🎯 Genauigkeitsstufen:**

- **✨ Sehr genau** (< 500m) - Exakte POI-Erkennung (Hotels, Restaurants, Sehenswürdigkeiten)
- **📌 Genau** (< 2km) - Stadtteil oder Strandabschnitt
- **📍 Ungefähr** (< 8km) - Stadt oder Region
- **🗺️ Land** - Bei sehr entlegenen Orten

#### **🤖 Intelligente Kategorisierung:**

Das System schlägt automatisch Kategorien vor:

```javascript
📍 Escazú, Costa Rica → 🏨 "Ankunft" (Hotel-Bereich)
📍 Manuel Antonio → 🌿 "Natur" oder 🦥 "Tierwelt"
📍 Tamarindo Beach → 🏖️ "Strand"
📍 Monteverde → 🎢 "Abenteuer" (Zip-Lines)
📍 Times Square, NYC → 🗺️ "Erkundung"
📍 Louvre, Paris → 🎭 "Kultur"
```

#### **❓ Bestätigungsdialog:**

Bei jedem Upload erscheint:

```
🌍 Ort erkannt: "Escazú, Costa Rica"
📂 Vorgeschlagene Kategorie: "🏨 Ankunft"

✅ Korrekt     ✏️ Ändern     📍 Anderen Ort wählen
```

#### **🛠️ Für unbekannte Orte:**

Wenn der Ort nicht erkannt wird:

```
❓ Unbekannter Ort erkannt
📍 Koordinaten: 9.9189, -84.1370
🗺️ Nächster bekannter Ort: San José (15 km)

✍️ Wo wurde dieses Bild aufgenommen?
[_________________] → "Escazú Zentrum"
```

### 🔧 **Setup für eigene Reiseziele:**

Du kannst einfach neue Orte hinzufügen:

```javascript
// In src/utils/geotagging.js
const myLocations = {
  paris: {
    center: { lat: 48.8566, lng: 2.3522 },
    radius: 20, // km
    name: 'Paris',
    category: 'kultur',
    pois: [
      { name: 'Eiffelturm', lat: 48.8584, lng: 2.2945, category: 'kultur' },
      { name: 'Louvre', lat: 48.8606, lng: 2.3376, category: 'kultur' }
    ]
  }
}
```

## 🚀 Live Demo

Die Galerie verwendet Beispielbilder von Unsplash und zeigt einen fiktiven Costa Rica-Urlaub.

## 🛠️ Technologie-Stack

- **Vue.js 3** mit Composition API
- **Vite** für ultraschnelle Entwicklung
- **CSS Grid & Flexbox** für responsive Layouts
- **CSS3 Animationen** für smooth Übergänge
- **EXIF.js** für GPS-Datenextraktion
- **Reverse Geocoding** für Ortsnamen
- **Vanilla JavaScript** - keine zusätzlichen Dependencies

## 📁 Projektstruktur

```
src/
├── components/
│   ├── PhotoGallery.vue    # Haupt-Galerie-Komponente
│   ├── PhotoCard.vue       # Einzelne Foto-Karte
│   ├── PhotoUploader.vue   # Upload mit GPS-Erkennung
│   └── Lightbox.vue        # Vollbild-Anzeige
├── utils/
│   └── geotagging.js       # GPS-System & Ortserkennung
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

## 📸 Bilder mit GPS-Erkennung hinzufügen

### **Methode 1: Drag & Drop (Empfohlen)**

1. **"➕ Bilder hinzufügen" klicken**
2. **Bilder direkt reinziehen** oder auswählen
3. **GPS wird automatisch analysiert** 🌍
4. **Orte bestätigen/ändern** ✅
5. **Kategorien anpassen** falls nötig
6. **"Fotos hinzufügen"** → Fertig!

### **Methode 2: Ordner-Upload**

```bash
# Ordnerstruktur erstellen
public/bilder/
├── anreise/     # 50 Flugbilder
├── tiere/       # 10 Tierbilder  
├── hotel/       # 5 Hotelbilder
├── essen/       # 10 Essensbilder
└── party/       # 30 Partybilder

# Import-Script ausführen
node import-bilder.js
```

### **Methode 3: Manuell**

Bearbeite `src/components/PhotoGallery.vue`:

```javascript
{
  id: 1,
  url: '/bilder/my-photo.jpg',
  title: 'Mein Costa Rica Foto',
  description: 'Pura Vida!',
  date: '2025-07-15',
  location: 'Escazú',
  category: 'ankunft',
  gpsData: { lat: 9.9189, lng: -84.1370 }
}
```

## � GPS-Datenschutz

- **Keine Daten werden gesendet** - Alles läuft lokal im Browser
- **GPS-Koordinaten** bleiben in deiner Galerie
- **Reverse Geocoding** verwendet öffentliche APIs (optional)
- **Du behältst die Kontrolle** über alle Ortsdaten

## 🎨 Anpassungen

- **Neue Orte hinzufügen**: `src/utils/geotagging.js` bearbeiten
- **Kategorien erweitern**: Neue Kategorie-Labels definieren
- **Farben ändern**: CSS-Variablen in `App.vue`
- **Layout anpassen**: Grid-Größen in `PhotoGallery.vue`

## 📱 Browser-Unterstützung

- ✅ Chrome 60+ (GPS-Support)
- ✅ Firefox 55+ (GPS-Support)
- ✅ Safari 11+ (GPS-Support)
- ✅ Edge 79+ (GPS-Support)

## 🗺️ Roadmap

- [ ] **Offline-Karten** für GPS-Anzeige
- [ ] **Bulk-Kategorisierung** für Foto-Serien
- [ ] **Geo-Clustering** für nahe Aufnahmeorte
- [ ] **Export** der GPS-Daten
- [ ] **Weltweite POI-Datenbank** Integration

## 🤝 Mitwirken

1. Fork das Repository
2. Erstelle einen Feature-Branch
3. Neue Orte/POIs zu `geotagging.js` hinzufügen
4. Committe deine Änderungen
5. Push zum Branch
6. Öffne einen Pull Request

---

**Jetzt kann deine Galerie Fotos aus der ganzen Welt automatisch organisieren! 🌍📸**

Erstellt mit ❤️ und Vue.js für unvergessliche Urlaubserinnerungen!
