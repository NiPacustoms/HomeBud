# Cannabis Strain-Datenbank Integration

## Übersicht

Die HomeBud App wurde um eine umfassende Cannabis Strain-Datenbank erweitert, die es Nutzern ermöglicht, detaillierte Informationen über verschiedene Cannabis-Strains zu durchsuchen, zu filtern und personalisierte Empfehlungen zu erhalten.

## Implementierte Features

### 1. Strukturierte Strain-Profile

Jeder Strain enthält umfassende Informationen zu:

- **Genetik**: Indica/Sativa/Hybrid-Anteile, Eltern-Strains
- **Cannabinoide**: THC- und CBD-Gehalt (Min/Max/Durchschnitt)
- **Anbau**: Blütezeit, Ertrag, Höhe, Schwierigkeitsgrad
- **Umwelt**: Klima, Temperatur, Luftfeuchtigkeit, Substrat
- **Charakteristika**: Aromen, Geschmack, Effekte
- **Pflege**: Bewässerung, Training, Resistenzen
- **Metadaten**: Preis, Verfügbarkeit, Beliebtheit

### 2. Erweiterte Such- und Filterfunktionen

- **Textsuche**: Nach Namen, Breeder, Aromen, Effekten
- **Genetik-Filter**: Indica, Sativa, Hybrid
- **Cannabinoid-Bereiche**: THC- und CBD-Gehalt
- **Anbau-Parameter**: Blütezeit, Ertrag, Schwierigkeit
- **Umwelt-Filter**: Klima, Substrat, Lichtanforderungen
- **Effekt-Filter**: Gewünschte und zu vermeidende Effekte
- **Preis- und Verfügbarkeitsfilter**

### 3. KI-gestützte Empfehlungslogik

Der Empfehlungsalgorithmus berücksichtigt:

- **Klima-Kompatibilität** (25% Gewichtung)
- **Erfahrungslevel** (20% Gewichtung)
- **Gewünschte Effekte** (25% Gewichtung)
- **Höhenbeschränkungen** (15% Gewichtung)
- **Blütezeit-Beschränkungen** (15% Gewichtung)

### 4. Vergleichsfunktionen

- Direkte Gegenüberstellung von bis zu 4 Strains
- Tabellarische Darstellung aller wichtigen Eigenschaften
- Visuelle Hervorhebung von Unterschieden

## Technische Implementierung

### Datenstrukturen

```typescript
// Haupt-Strain-Interface
interface Strain {
  id: string;
  name: string;
  breeder?: string;
  genetics: GeneticsInfo;
  cannabinoids: CannabinoidInfo;
  growing: GrowingInfo;
  environment: EnvironmentInfo;
  characteristics: CharacteristicsInfo;
  care: CareInfo;
  metadata: MetadataInfo;
}

// Benutzerpräferenzen für Empfehlungen
interface UserPreferences {
  location: LocationInfo;
  experience: 'beginner' | 'intermediate' | 'advanced';
  growingSpace: 'indoor' | 'outdoor' | 'greenhouse';
  desiredEffects: string[];
  avoidEffects?: string[];
  maxHeight?: number;
  maxFloweringTime?: number;
  yieldPriority: 'low' | 'medium' | 'high';
  difficultyPreference: 'easy' | 'moderate' | 'challenging';
}
```

### Service-Architektur

```typescript
class StrainDatabaseService {
  // Grundlegende Datenbank-Operationen
  async getAllStrains(): Promise<Strain[]>
  async getStrainById(id: string): Promise<Strain | null>
  async searchStrains(query: string): Promise<Strain[]>
  async filterStrains(filter: StrainFilter): Promise<Strain[]>
  
  // KI-Empfehlungen
  async getRecommendations(preferences: UserPreferences): Promise<StrainRecommendation[]>
  
  // Vergleichsfunktionen
  async compareStrains(strainIds: string[]): Promise<Strain[]>
  
  // Statistiken und Kategorien
  async getCategories(): Promise<Categories>
  async getDatabaseStats(): Promise<DatabaseStats>
}
```

### Komponenten-Struktur

```
src/components/strains/
├── StrainDatabase.tsx          # Hauptkomponente
├── StrainCard.tsx              # Einzelne Strain-Karte
├── StrainFilterPanel.tsx       # Such- und Filter-Panel
├── StrainRecommendationWizard.tsx  # KI-Empfehlungs-Wizard
└── StrainComparison.tsx        # Vergleichskomponente
```

## Datenbank-Schema

### Strain-Datenbank (JSON)

```json
{
  "strains": [...],
  "categories": {
    "genetics": ["indica", "sativa", "hybrid"],
    "effects": [...],
    "aromas": [...],
    "climates": [...],
    "difficulties": [...]
  },
  "totalCount": 5,
  "lastUpdated": "2024-01-01T00:00:00.000Z",
  "version": "1.0.0"
}
```

## Empfehlungsalgorithmus

### Scoring-System

1. **Klima-Kompatibilität** (25%)
   - Perfekte Übereinstimmung: 1.0
   - Kompatible Klimas: 0.7
   - Inkompatible Klimas: 0.3

2. **Erfahrungslevel** (20%)
   - Strain-Schwierigkeit ≤ Nutzer-Erfahrung: 1.0
   - Strain-Schwierigkeit = Nutzer-Erfahrung + 1: 0.7
   - Sonst: 0.3

3. **Effekt-Matching** (25%)
   - Positive Effekte: +1 Punkt pro Übereinstimmung
   - Negative Effekte: -0.5 Punkte pro Übereinstimmung
   - Normalisiert durch Anzahl gewünschter Effekte

4. **Höhenbeschränkung** (15%)
   - Keine Beschränkung: 1.0
   - Strain-Höhe ≤ Max-Höhe: 1.0
   - Strain-Höhe ≤ 1.2 × Max-Höhe: 0.7
   - Sonst: 0.3

5. **Blütezeit-Beschränkung** (15%)
   - Keine Beschränkung: 1.0
   - Strain-Blütezeit ≤ Max-Blütezeit: 1.0
   - Strain-Blütezeit ≤ 1.3 × Max-Blütezeit: 0.7
   - Sonst: 0.3

## Benutzeroberfläche

### Hauptansichten

1. **Durchsuchen**: Grid-Ansicht aller Strains mit Filter-Panel
2. **KI-Empfehlungen**: 5-Schritt-Wizard für personalisierte Empfehlungen
3. **Vergleichen**: Tabellarische Gegenüberstellung ausgewählter Strains

### Responsive Design

- Mobile-optimierte Karten-Ansicht
- Kollabierbare Filter-Panels
- Touch-freundliche Interaktionen
- Adaptive Tabellen für Vergleichsansicht

## Vorteile der eigenen Datenbank

### 1. Volle Kontrolle
- Qualität und Genauigkeit der Daten
- Keine Abhängigkeit von externen APIs
- Anpassbare Datenstrukturen

### 2. Lokale Optimierung
- Anpassung an deutsche/regionale Anbaubedingungen
- Berücksichtigung lokaler Klimazonen
- Spezifische Pflegetipps für lokale Bedingungen

### 3. Erweiterbarkeit
- Einfache Integration neuer Strains
- Anpassbare Empfehlungsalgorithmen
- Erweiterbare Metadaten

### 4. Performance
- Schnelle lokale Suche
- Keine API-Latenz
- Offline-Funktionalität

## Erweiterungsmöglichkeiten

### 1. Community-Features
- Nutzer-Bewertungen und Reviews
- Erfahrungsberichte
- Foto-Uploads

### 2. Erweiterte KI-Features
- Machine Learning für bessere Empfehlungen
- Nutzerverhalten-basierte Anpassungen
- Saisonale Empfehlungen

### 3. Integration mit anderen Modulen
- Automatische Pflegepläne basierend auf Strain-Daten
- VPD-Chart-Integration für spezifische Klima-Anforderungen
- Bewässerungsrechner mit Strain-spezifischen Parametern

### 4. Datenbank-Erweiterungen
- Mehr Strain-Daten
- Detailliertere Pflegeanleitungen
- Video-Tutorials pro Strain

## Technische Anforderungen

### Abhängigkeiten
- React 18+
- TypeScript
- Tailwind CSS
- Framer Motion (für Animationen)

### Browser-Kompatibilität
- Moderne Browser (Chrome, Firefox, Safari, Edge)
- Mobile Browser (iOS Safari, Chrome Mobile)
- Progressive Web App (PWA) Support

### Performance
- Lazy Loading für Strain-Karten
- Virtuelle Scrolling für große Datenmengen
- Caching der Datenbank-Datei
- Optimierte Suchalgorithmen

## Wartung und Updates

### Datenbank-Updates
- Regelmäßige Aktualisierung der Strain-Daten
- Hinzufügung neuer Strains
- Korrektur von Fehlern in bestehenden Daten

### Algorithmus-Verbesserungen
- Optimierung der Empfehlungslogik
- Anpassung der Gewichtungen
- Integration neuer Faktoren

### UI/UX-Verbesserungen
- Feedback-basierte Optimierungen
- Neue Filter-Optionen
- Verbesserte Mobile-Erfahrung

## Fazit

Die implementierte Strain-Datenbank bietet eine umfassende, benutzerfreundliche Lösung für Cannabis-Anbauer. Sie kombiniert detaillierte technische Informationen mit intelligenter Empfehlungslogik und bietet eine solide Grundlage für weitere Erweiterungen.

Die modulare Architektur ermöglicht einfache Wartung und Erweiterungen, während die lokale Datenbank volle Kontrolle über Qualität und Performance bietet.
