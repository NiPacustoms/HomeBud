# 📊 Sensordaten-Erfassung - HomeBud

## Übersicht

Die Sensordaten-Erfassung ist ein Kern-Feature von HomeBud, das professionelle Erfassung und Analyse aller wichtigen Messwerte für optimales Pflanzenwachstum ermöglicht.

## 🚀 Features

### 1. Manuelle Eingabe aller wichtigen Messwerte
- **Temperatur** (°C) - Mit automatischer VPD-Berechnung
- **Luftfeuchtigkeit** (%) - Für optimale Klimabedingungen
- **pH-Wert** - Nährstoffaufnahme optimieren
- **EC-Wert** (mS/cm) - Leitfähigkeit der Nährlösung
- **CO₂** (ppm) - Für Indoor-Growing
- **Lichtstärke (PPFD)** (μmol/m²/s) - Photosynthetisch aktive Strahlung
- **Zusätzliche Indoor-Werte:**
  - Luftstrom (%)
  - Bodenfeuchte (%)

### 2. Automatische VPD-Berechnung
- **VPD (Vapor Pressure Deficit)** wird automatisch aus Temperatur und Luftfeuchtigkeit berechnet
- Wissenschaftlich fundierte Magnus-Formel
- Zielbereiche je nach Wachstumsphase und Grow-Type

### 3. Wachstumsphasen-spezifische Analyse
- **Keimling** (0-14 Tage nach Keimung)
- **Vegetativ** (15-60 Tage Wachstum)
- **Blüte** (61-90 Tage Blüte)
- **Späte Blüte** (91-120 Tage Reifung)
- **Spülphase** (7-14 Tage vor Ernte)

### 4. Grow-Type Anpassungen
- **Indoor** - Optimale Bedingungen für kontrollierte Umgebung
- **Outdoor** - Angepasste Bereiche für natürliche Bedingungen
- **Greenhouse** - Zwischenstufe mit teilweise kontrollierten Bedingungen

### 5. Intelligente Erinnerungen
- **Tägliche Messungen** - Temperatur, Luftfeuchtigkeit, pH, EC
- **Wöchentliche Messungen** - CO₂, Lichtstärke
- **Anpassbare Intervalle** je nach Wachstumsphase
- **Push-Benachrichtigungen** und In-App-Erinnerungen

### 6. Historie & Trends
- **Tages-, Wochen- und Monatsansicht**
- **Filterung nach Zeiträumen**
- **Status-Anzeige** mit Farbkodierung (Grün = optimal, Orange = Warnung, Rot = kritisch)
- **Vergleich mit Zielbereichen**

### 7. Export-Funktionen
- **CSV-Export** für Excel/Google Sheets
- **JSON-Export** für API-Integration
- **Deutsche Spaltenüberschriften**
- **Alle Messwerte inklusive Metadaten**

### 8. Mess-Checklisten
- **Strukturierte Messabläufe**
- **Fortschrittsverfolgung**
- **Kategorisierte Aufgaben**
- **Wiederverwendbare Templates**

## 🎯 Zielbereiche je Wachstumsphase

### Keimling (0-14 Tage)
- Temperatur: 22-26°C
- Luftfeuchtigkeit: 70-80%
- Lichtstärke: 100-300 μmol/m²/s
- pH: 6.2-6.8
- EC: 0.8-1.2 mS/cm
- CO₂: 400-600 ppm
- VPD: 0.4-0.8 kPa

### Vegetativ (15-60 Tage)
- Temperatur: 22-28°C
- Luftfeuchtigkeit: 60-70%
- Lichtstärke: 400-600 μmol/m²/s
- pH: 6.0-7.0
- EC: 1.2-1.8 mS/cm
- CO₂: 600-1000 ppm
- VPD: 0.8-1.2 kPa

### Blüte (61-90 Tage)
- Temperatur: 20-26°C
- Luftfeuchtigkeit: 45-55%
- Lichtstärke: 600-1000 μmol/m²/s
- pH: 6.0-6.8
- EC: 1.5-2.2 mS/cm
- CO₂: 800-1200 ppm
- VPD: 1.2-1.6 kPa

### Späte Blüte (91-120 Tage)
- Temperatur: 18-24°C
- Luftfeuchtigkeit: 40-50%
- Lichtstärke: 500-800 μmol/m²/s
- pH: 6.0-6.8
- EC: 1.2-1.8 mS/cm
- CO₂: 600-1000 ppm
- VPD: 1.4-1.8 kPa

### Spülphase (7-14 Tage vor Ernte)
- Temperatur: 18-24°C
- Luftfeuchtigkeit: 40-50%
- Lichtstärke: 400-600 μmol/m²/s
- pH: 6.0-7.0
- EC: 0.5-1.0 mS/cm
- CO₂: 400-600 ppm
- VPD: 1.4-1.8 kPa

## 🔧 Technische Implementierung

### Komponenten
- **`/measurements`** - Hauptseite mit Tab-Navigation
- **`MeasurementEntryForm`** - Formular für neue Messungen
- **`measurementAnalysisService`** - Service für Berechnungen und Analyse
- **Integrierte UI-Komponenten** - Card, Button, Tabs, etc.

### Datenstruktur
```typescript
interface DailyDataEntry {
  id: string
  projectId: string
  date: Date
  growthPhase: GrowthPhase
  growType: GrowType
  temperature: number
  humidity: number
  lightLevel: number
  ph: number
  ec: number
  co2?: number
  airFlow?: number
  soilMoisture?: number
  vpd?: number
  analysis?: MeasurementAnalysis
  notes?: string
  createdAt: Date
  updatedAt: Date
}
```

### Services
- **VPD-Berechnung** nach wissenschaftlichen Standards
- **Zielbereichs-Analyse** je nach Phase und Grow-Type
- **Messwert-Validierung** mit Toleranzbereichen
- **Export-Funktionalität** für CSV und JSON

## 📱 Benutzeroberfläche

### Tab-Navigation
1. **📝 Neue Messung** - Formular für Dateneingabe
2. **📊 Historie** - Messverlauf und Trends
3. **⏰ Erinnerungen** - Verwaltung von Mess-Erinnerungen
4. **✅ Checklisten** - Strukturierte Messabläufe

### Responsive Design
- **Mobile-first** Ansatz
- **Touch-optimiert** für mobile Geräte
- **Dark/Light Mode** Unterstützung
- **Barrierefreiheit** mit ARIA-Labels

## 🎨 Design-System

### Farbkodierung
- **Grün** ✅ - Optimaler Bereich
- **Orange** ⚠️ - Warnung (leicht außerhalb)
- **Rot** 🚨 - Kritisch (deutlich außerhalb)

### Icons & Emojis
- **🌡️** Temperatur
- **💧** Luftfeuchtigkeit
- **☀️** Lichtstärke
- **🧪** pH-Wert
- **⚡** EC-Wert
- **🌿** CO₂
- **💨** Luftstrom
- **🌱** Bodenfeuchte

### Animationen
- **Framer Motion** für flüssige Übergänge
- **Hover-Effekte** für bessere UX
- **Loading-States** für Feedback

## 🔮 Zukünftige Erweiterungen

### Phase 2
- **Automatische Sensoren** - Bluetooth/WiFi-Integration
- **KI-gestützte Vorhersagen** - Trend-Analyse
- **Alarm-System** - Push-Benachrichtigungen bei kritischen Werten
- **Team-Features** - Mehrere Benutzer pro Projekt

### Phase 3
- **API-Integration** - Drittanbieter-Sensoren
- **Cloud-Synchronisation** - Backup und Sharing
- **Erweiterte Analysen** - Korrelations-Analyse
- **Mobile App** - Native iOS/Android-Apps

## 📚 Best Practices

### Messung
1. **Regelmäßigkeit** - Täglich zur gleichen Zeit
2. **Kalibrierung** - Sensoren regelmäßig kalibrieren
3. **Position** - Messungen in Pflanzenhöhe durchführen
4. **Dokumentation** - Notizen zu besonderen Beobachtungen

### Analyse
1. **Trends erkennen** - Über Zeiträume hinweg analysieren
2. **Korrelationen** - Zusammenhänge zwischen verschiedenen Werten
3. **Anpassungen** - Grow-Parameter basierend auf Daten optimieren
4. **Dokumentation** - Erfolgreiche Strategien festhalten

## 🆘 Support & Hilfe

### Mess-Tipps
- **Temperatur**: In Pflanzenhöhe messen, direkte Sonne vermeiden
- **Luftfeuchtigkeit**: Nach dem Gießen warten, Kalibrierung prüfen
- **pH-Wert**: Vor jeder Messung kalibrieren, 30 Sekunden warten
- **EC-Wert**: Bei Raumtemperatur messen, monatlich kalibrieren

### Häufige Probleme
- **Hohe VPD-Werte** → Luftfeuchtigkeit erhöhen
- **Niedrige VPD-Werte** → Temperatur erhöhen oder Luftfeuchtigkeit senken
- **pH-Schwankungen** → Nährlösung anpassen
- **EC-Anstieg** → Spülen mit klarem Wasser

## 🔗 Verwandte Features

- **Dashboard** - Übersicht aller Messwerte
- **Diagnose** - KI-gestützte Problem-Analyse
- **Planer** - Integration in Grow-Zyklen
- **Pflanzen** - Verknüpfung mit einzelnen Pflanzen

---

*Diese Dokumentation wird kontinuierlich aktualisiert. Für Fragen oder Anregungen wenden Sie sich an das HomeBud-Team.*
