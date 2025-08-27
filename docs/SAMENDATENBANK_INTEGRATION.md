# 🌱 Samendatenbank Integration

Diese Anleitung erklärt, wie Sie Ihre 11,2 MB große XLSX-Samendatenbank in das HomeBud-Projekt integrieren.

## 📋 Voraussetzungen

- Node.js installiert
- Ihre XLSX-Datei mit der Samendatenbank
- HomeBud-Projekt lokal installiert

## 🚀 Schritt-für-Schritt Integration

### 1. Abhängigkeiten installieren

```bash
npm install
```

### 2. XLSX-Datei vorbereiten

Legen Sie Ihre XLSX-Datei im Projektroot ab:
- Dateiname: `samen-datenbank.xlsx` (oder beliebiger Name)
- Format: Excel (.xlsx)
- Größe: 11,2 MB

### 3. Spaltenstruktur anpassen (falls nötig)

Das Konvertierungsskript erwartet folgende Spaltenreihenfolge:

| Spalte | Feld | Beschreibung |
|--------|------|--------------|
| A | Name | Name der Pflanze |
| B | BotanicalName | Botanischer Name |
| C | Variety | Sorte/Varietät |
| D | Category | Kategorie |
| E | GerminationTime | Keimzeit in Tagen |
| F | GrowingTime | Wachstumszeit in Tagen |
| G | OptimalTemperature | Optimale Temperatur (z.B. "20-25") |
| H | OptimalHumidity | Optimale Luftfeuchtigkeit (z.B. "60-80") |
| I | LightRequirements | Lichtanforderungen (niedrig/mittel/hoch) |
| J | WaterRequirements | Wasseranforderungen (niedrig/mittel/hoch) |
| K | SoilType | Bodentyp |
| L | pH | pH-Wert (z.B. "6.0-7.0") |
| M | Spacing | Pflanzabstand in cm |
| N | Depth | Pflanztiefe in cm |
| O | HarvestTime | Erntezeit |
| P | Yield | Ertrag |
| Q | Notes | Notizen |
| R | ImageUrl | Bild-URL |
| S | Tags | Tags (kommagetrennt) |

### 4. Konvertierung durchführen

```bash
# Mit Standard-Dateiname
npm run convert-seeds

# Oder mit spezifischem Dateinamen
node scripts/convertXlsxToJson.js meine-samendatenbank.xlsx
```

### 5. Ausgabe überprüfen

Nach der Konvertierung wird eine JSON-Datei erstellt:
- Pfad: `public/data/seed-database.json`
- Format: Optimiertes JSON für Web-Anwendung
- Größe: Reduziert durch Komprimierung

### 6. Anwendung testen

```bash
npm run dev
```

Besuchen Sie: `http://localhost:3000/seeds/database`

## 🔧 Konfiguration anpassen

### Spaltenmapping ändern

Falls Ihre XLSX-Datei eine andere Spaltenstruktur hat, bearbeiten Sie `scripts/convertXlsxToJson.js`:

```javascript
const seed = {
  id: generateId(row[0] || `seed-${i}`), // Spalte A
  name: row[0] || '',                    // Spalte A
  botanicalName: row[1] || '',           // Spalte B
  // ... weitere Spalten anpassen
};
```

### Datenvalidierung erweitern

Fügen Sie Validierungslogik in den Parser-Funktionen hinzu:

```javascript
function parseNumber(value) {
  if (!value) return undefined;
  const num = parseFloat(value);
  return isNaN(num) ? undefined : num;
}
```

## 📊 Performance-Optimierungen

### Für große Datenbanken (11,2 MB+)

1. **Lazy Loading implementieren**:
```javascript
// In seedDatabaseService.ts
async getSeedsByPage(page: number, pageSize: number = 50): Promise<Seed[]> {
  const allSeeds = await this.getAllSeeds();
  const start = page * pageSize;
  return allSeeds.slice(start, start + pageSize);
}
```

2. **Caching hinzufügen**:
```javascript
// Redis oder localStorage für Browser-Caching
const cacheKey = 'seed-database-cache';
const cached = localStorage.getItem(cacheKey);
if (cached) {
  return JSON.parse(cached);
}
```

3. **Komprimierung aktivieren**:
```javascript
// next.config.js
const nextConfig = {
  compress: true,
  gzip: true
};
```

## 🎯 Verwendung in der Anwendung

### Komponente einbinden

```tsx
import { SeedDatabase } from '../components/seeds/SeedDatabase';

function MyPage() {
  return (
    <div>
      <SeedDatabase 
        onSeedSelect={(seed) => console.log('Ausgewählt:', seed)}
        showSearch={true}
        showCategories={true}
      />
    </div>
  );
}
```

### Service verwenden

```tsx
import { seedDatabaseService } from '../services/seedDatabaseService';

// Alle Samen laden
const seeds = await seedDatabaseService.getAllSeeds();

// Nach Kategorie filtern
const tomatoes = await seedDatabaseService.getSeedsByCategory('Tomaten');

// Suche durchführen
const results = await seedDatabaseService.searchSeeds('Basilikum');
```

## 🔍 Troubleshooting

### Häufige Probleme

1. **"Datenbank konnte nicht geladen werden"**
   - Überprüfen Sie, ob `public/data/seed-database.json` existiert
   - Führen Sie die Konvertierung erneut durch

2. **"Ungültige Spaltenstruktur"**
   - Überprüfen Sie die Spaltenreihenfolge in Ihrer XLSX-Datei
   - Passen Sie das Mapping in `convertXlsxToJson.js` an

3. **"Performance-Probleme"**
   - Implementieren Sie Pagination für große Datenbanken
   - Aktivieren Sie Caching
   - Komprimieren Sie die JSON-Datei

### Debug-Modus

```bash
# Detaillierte Ausgabe beim Konvertieren
DEBUG=true node scripts/convertXlsxToJson.js
```

## 📈 Erweiterte Funktionen

### Automatische Updates

```javascript
// Automatische Konvertierung bei Änderungen
const chokidar = require('chokidar');
chokidar.watch('samen-datenbank.xlsx').on('change', () => {
  console.log('XLSX-Datei geändert, konvertiere...');
  convertXlsxToJson();
});
```

### Datenbank-Export

```javascript
// Export zu verschiedenen Formaten
async function exportDatabase(format: 'csv' | 'json' | 'xlsx') {
  // Implementierung je nach Format
}
```

## 🎉 Erfolgreiche Integration

Nach der Integration haben Sie:

- ✅ Eine vollständig durchsuchbare Samendatenbank
- ✅ Kategorie-basierte Filterung
- ✅ Detaillierte Sameninformationen
- ✅ Responsive Benutzeroberfläche
- ✅ Optimierte Performance für große Datenbanken

Die Samendatenbank ist jetzt vollständig in Ihr HomeBud-Projekt integriert und kann über die Benutzeroberfläche durchsucht und verwaltet werden!
