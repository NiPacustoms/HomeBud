# Dashboard-Kernansicht - HomeBud App

## Übersicht

Die Dashboard-Kernansicht ist die zentrale Steuerzentrale für die HomeBud App, die auf dem Smartphone die wichtigsten täglich relevanten Informationen und Schnellzugriffe auf einen Blick zeigt. Sie greift auf die Sidebar-Navigation zurück und zeigt im Hauptbereich modular ein- oder ausblendbare Kacheln.

## Implementierte Features

### 1. Projektübersicht 🌱

**Aktuelles Grow-Projekt**
- **Strain-Name**: Anzeige des aktuellen Cannabis-Strains
- **Wachstumsphase**: Keimling, Wachstum, Blüte, Ernte
- **Fortschrittsbalken**: Visueller Fortschritt der aktuellen Phase in Prozent
- **Projekt-Details**: Startdatum, geschätzte Ernte, Anzahl Pflanzen

**Beispiel-Daten:**
```typescript
{
  strainName: 'Northern Lights Auto',
  phase: 'flowering',
  phaseProgress: 65,
  startDate: new Date('2024-01-15'),
  estimatedHarvest: new Date('2024-03-15'),
  plantCount: 4
}
```

### 2. Echtzeit-Monitoring-Kacheln 📊

**Überwachte Parameter:**
- **Temperatur** (🌡️): Aktueller Wert mit Zielbereich 20-28°C
- **Luftfeuchtigkeit** (💧): Relative Luftfeuchtigkeit mit Zielbereich 40-70%
- **PPFD** (💡): Photosynthetische Photonenflussdichte mit Zielbereich 400-1000 μmol/m²/s
- **VPD** (🌡️): Vapor Pressure Deficit mit Zielbereich 0.8-1.6 kPa
- **pH-Wert** (🧪): Säuregrad mit Zielbereich 5.5-6.5
- **CO₂-Konzentration** (🌬️): Kohlendioxid-Gehalt mit Zielbereich 400-1200 ppm

**Features:**
- **Aktueller Wert**: Große, gut lesbare Anzeige
- **Zielbereich**: Visueller Balken mit optimalem Bereich
- **Ampelstatus**: Farbkodierung (Grün/Gelb/Rot) für schnelle Bewertung
- **Letzte Aktualisierung**: Zeitstempel der letzten Messung
- **Hilfe-Tooltips**: Kontextabhängige Informationen zu jedem Parameter

### 3. To-Do & Erinnerungen ✅

**Anstehende Aufgaben:**
- **pH-Check**: Tägliche pH-Kontrolle der Nährlösung
- **Substratwechsel**: Geplante Substrat-Erneuerung
- **Tissue-Culture-Subkultur**: Klon-Übertragung in neue Petrischalen
- **Mykorrhiza-Dosierung**: Wöchentliche biologische Anwendungen
- **Lichtintensität**: Anpassungen der Beleuchtung

**Features:**
- **Schneller Haken**: Direktes Abhaken erledigter Aufgaben
- **Prioritätsstufen**: Kritisch, Hoch, Mittel, Niedrig
- **Fälligkeitsdatum**: Klare Zeitangaben für jede Aufgabe
- **Kategorisierung**: Monitoring, Biologisch, Tissue Culture, etc.
- **Visuelles Feedback**: Durchgestrichener Text für erledigte Aufgaben

### 4. Modul-Quicklinks 🚀

**Schnellzugriff auf häufig genutzte Module:**
- **Strain-Datenbank** (🌿): Strain-Suche und Vergleich
- **Diagnose** (🔍): Bild-Analyse & Behandlungsvorschläge
- **Planner** (📅): Grow-Kalender und Phasen-Timeline
- **Mykorrhiza & Trichoderma** (🍄): Dosierung und Monitoring
- **Tissue Culture** (🧬): In-vitro-Protokoll und Klon-Status
- **Analytics** (📊): Erweiterte Statistiken und Berichte

**Features:**
- **Icon-Buttons**: Große, touch-freundliche Buttons
- **Responsive Grid**: Anpassung an verschiedene Bildschirmgrößen
- **Hover-Effekte**: Visuelles Feedback bei Interaktion
- **Direkte Navigation**: Sofortiger Zugriff auf Module

### 5. KI-Empfehlungen 🤖

**Dynamisch generierte Hinweise:**
- **"Erhöhe PPFD um 10%"**: Konkrete Handlungsanweisungen
- **"pH leicht senken"**: Optimierungsvorschläge
- **"VPD optimieren"**: Klima-Anpassungen

**Features:**
- **Google Gemini AI**: Dynamische Generierung basierend auf aktuellen Daten
- **Prioritätsstufen**: Wichtige Empfehlungen werden hervorgehoben
- **Konkrete Aktionen**: Spezifische Handlungsanweisungen
- **Kategorisierung**: Lighting, Nutrients, Climate, etc.

### 6. Performance & Trends 📈

**Leistungsdaten:**
- **Ertragsprognose**: Vorhersage in g/Pflanze
- **Wachstumskurve**: Höhenentwicklung vs. Zeit
- **Aktuelle Höhe**: Durchschnittliche Pflanzenhöhe
- **Heatmap der Lichtverteilung**: 8x8 Grid mit Lichtintensitäts-Daten

**Features:**
- **Visuelle Darstellung**: Große Zahlen für schnelle Erfassung
- **Farbkodierung**: Grün für gute Werte, Blau für Wachstum, etc.
- **Interaktive Heatmap**: Tooltips mit genauen Werten
- **Trend-Indikatoren**: Pfeile für positive/negative Entwicklungen

### 7. Foto-Tagebuch 📸

**Bilddokumentation:**
- **Letzte 3 Bilder**: Chronologische Anzeige der neuesten Fotos
- **Datum und Notizen**: Kontext zu jedem Bild
- **Schnell-Button**: Neues Foto hochladen und Notiz hinzufügen

**Features:**
- **Thumbnail-Anzeige**: Vorschau der letzten Fotos
- **Datum-Stempel**: Automatische Zeitangabe
- **Notizen**: Benutzerdefinierte Beschreibungen
- **Upload-Funktion**: Direkte Integration der Kamera

## Technische Implementierung

### Komponenten-Struktur

```
src/components/dashboard/
├── DashboardCore.tsx           # Hauptkomponente der Kernansicht
└── DashboardTiles.tsx          # Modulare Kacheln (wiederverwendet)
```

### Datenstrukturen

```typescript
interface GrowProject {
  id: string;
  strainName: string;
  phase: 'seedling' | 'vegetative' | 'flowering' | 'harvest';
  phaseProgress: number;
  startDate: Date;
  estimatedHarvest: Date;
  plantCount: number;
}

interface MonitoringValue {
  id: string;
  label: string;
  value: number;
  unit: string;
  target: { min: number; max: number; optimal?: { min: number; max: number } };
  status: 'good' | 'warning' | 'error' | 'neutral';
  icon: string;
  lastUpdated: Date;
}

interface TodoItem {
  id: string;
  title: string;
  description: string;
  dueDate: Date;
  priority: 'low' | 'medium' | 'high' | 'critical';
  category: string;
  completed: boolean;
}

interface KIRecommendation {
  id: string;
  message: string;
  action: string;
  priority: 'low' | 'medium' | 'high';
  category: string;
}

interface PerformanceData {
  yieldForecast: number;
  growthRate: number;
  height: number;
  lightDistribution: number[][];
}

interface PhotoEntry {
  id: string;
  url: string;
  date: Date;
  note?: string;
}
```

### Integration

**Dashboard-Seite:**
- Neue Tab "Kernansicht" als Standard-Ansicht
- Integration in bestehende Dashboard-Navigation
- Mock-Daten für Demonstration

**Demo-Seite:**
- Separate Seite unter `/dashboard-core`
- Vollständige Demonstration aller Features
- Umfangreiche Mock-Daten

## Mobile Optimierung

### Responsive Design
- **Einspaltiges Layout**: Optimiert für Smartphone-Bildschirme
- **Touch-Targets**: Mindestens 44px für alle interaktiven Elemente
- **Scroll-Optimierung**: Vertikales Scrolling für lange Inhalte
- **Backdrop-Blur**: Moderne visuelle Effekte

### Performance
- **Lazy Loading**: Komponenten werden bei Bedarf geladen
- **Optimierte Animationen**: Framer Motion für flüssige Übergänge
- **Efficient Rendering**: Nur sichtbare Elemente werden gerendert
- **Caching**: Lokale Speicherung von Benutzereinstellungen

## Benutzerfreundlichkeit

### Für Einsteiger
- **Klare Hierarchie**: Wichtige Informationen sind prominent platziert
- **Intuitive Navigation**: Logische Gruppierung von Funktionen
- **Visuelle Hilfe**: Icons und Farben für bessere Orientierung
- **Kontext-Hilfe**: Tooltips und Erklärungen bei Bedarf

### Für Fortgeschrittene
- **Schneller Zugriff**: Direkte Navigation zu allen wichtigen Modulen
- **Detaillierte Daten**: Umfassende Informationen auf einen Blick
- **Anpassbarkeit**: Individuelle Konfiguration der Anzeige
- **Erweiterte Features**: Zugriff auf komplexe Funktionen

## Vorteile

### 1. Zentrale Übersicht
- **Alle wichtigen Informationen auf einen Blick**
- **Keine Navigation zwischen verschiedenen Seiten nötig**
- **Schnelle Entscheidungsfindung**

### 2. Mobile Optimierung
- **Perfekt für Smartphone-Nutzung**
- **Touch-freundliche Bedienung**
- **Responsive Design für alle Bildschirmgrößen**

### 3. Intelligente Integration
- **KI-gestützte Empfehlungen**
- **Automatische Datenanalyse**
- **Proaktive Handlungsvorschläge**

### 4. Benutzerfreundlichkeit
- **Intuitive Bedienung**
- **Klare visuelle Hierarchie**
- **Kontextabhängige Hilfe**

## Erweiterungsmöglichkeiten

### 1. Echtzeit-Updates
- **WebSocket-Integration** für Live-Daten
- **Push-Benachrichtigungen** bei kritischen Werten
- **Automatische Synchronisation** mit Sensoren

### 2. Erweiterte KI-Features
- **Predictive Analytics** für Ernteprognosen
- **Automatische Problemerkennung** basierend auf Bildern
- **Personalisierte Empfehlungen** basierend auf Nutzerverhalten

### 3. Community-Features
- **Vergleich mit anderen Growern**
- **Best-Practice-Sharing**
- **Experten-Chat für Fragen**

### 4. Automatisierung
- **Automatische Anpassungen** basierend auf KI-Empfehlungen
- **Smart Home Integration** für automatische Steuerung
- **Scheduling-System** für wiederkehrende Aufgaben

## Fazit

Die Dashboard-Kernansicht bietet eine umfassende, mobile-optimierte Lösung für die tägliche Cannabis-Anbau-Verwaltung. Durch die Kombination aus Echtzeit-Monitoring, intelligenten Empfehlungen und schnellem Zugriff auf alle wichtigen Funktionen wird sie zur zentralen Steuerzentrale für jeden HomeBud-Nutzer.

Die modulare Architektur ermöglicht eine einfache Erweiterung und Anpassung, während die Fokus auf Benutzerfreundlichkeit und mobile Optimierung eine breite Nutzerbasis anspricht.
