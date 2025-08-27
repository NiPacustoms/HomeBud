# Indoor/Outdoor-Auswahl Integration

## Übersicht

Die HomeBud App bietet jetzt eine umfassende Indoor/Outdoor-Auswahl-Funktionalität, die es Benutzern ermöglicht, zwischen verschiedenen Anbaumethoden zu wählen und die App entsprechend anzupassen.

## Implementierte Features

### 1. Grow-Type-Auswahl im Setup-Assistenten
- **Neuer Schritt**: "Anbau-Art" wurde als zweiter Schritt im Setup-Assistenten hinzugefügt
- **Drei Optionen**: Indoor, Outdoor, Gewächshaus
- **Detaillierte Informationen**: Jede Option zeigt Vor- und Nachteile
- **Empfohlene Module**: Automatische Empfehlung passender Module basierend auf der Auswahl

### 2. Komponenten

#### GrowTypeSelector
- **Datei**: `src/components/setup/GrowTypeSelector.tsx`
- **Funktion**: Vollständige Auswahl mit detaillierten Informationen
- **Props**:
  - `selectedType`: Aktueller Grow-Type
  - `onTypeChange`: Callback für Änderungen
  - `showDetails`: Zeigt/versteckt detaillierte Informationen
  - `className`: Zusätzliche CSS-Klassen

#### GrowTypeDisplay
- **Datei**: `src/components/ui/GrowTypeDisplay.tsx`
- **Funktion**: Anzeige der aktuellen Auswahl
- **Props**:
  - `growType`: Anzuzeigender Grow-Type
  - `showDetails`: Zeigt/versteckt Beschreibung
  - `className`: Zusätzliche CSS-Klassen

#### GrowTypeQuickSelector
- **Datei**: `src/components/ui/GrowTypeQuickSelector.tsx`
- **Funktion**: Kompakte Auswahl für Dashboard und andere Bereiche
- **Props**:
  - `selectedType`: Aktueller Grow-Type
  - `onTypeChange`: Callback für Änderungen
  - `className`: Zusätzliche CSS-Klassen

### 3. Redux Integration

#### Store Erweiterung
- **Datei**: `src/store/slices/growSlice.ts`
- **Neue State-Struktur**:
  ```typescript
  userPreferences: {
    growType: 'indoor' | 'outdoor' | 'greenhouse'
    experience: 'beginner' | 'intermediate' | 'expert'
    timeBudget: '5min' | '30min' | '60min+'
    budget: 'low' | 'mid' | 'premium'
  }
  ```

#### Actions
- `setGrowType(type)`: Setzt den Grow-Type
- `setUserPreferences(preferences)`: Aktualisiert mehrere Benutzereinstellungen

### 4. Hook für Grow-Type-Verwaltung
- **Datei**: `src/hooks/useGrowType.ts`
- **Funktionen**:
  - `growType`: Aktueller Grow-Type
  - `setGrowType(type)`: Grow-Type ändern
  - `updateUserPreferences(preferences)`: Mehrere Einstellungen aktualisieren

## Anbaumethoden

### Indoor (🏠)
**Vorteile:**
- Vollständige Kontrolle über alle Parameter
- Ganzjähriger Anbau möglich
- Höchste Diskretion
- Optimale Bedingungen für maximale Erträge

**Zu beachten:**
- Höhere Kosten für Equipment
- Technische Ausrüstung erforderlich
- Energieverbrauch für Beleuchtung und Klimatisierung

**Empfohlene Module:**
- Setup-Wizard
- Multi-Sensor-Monitoring
- IoT-Automatisierung
- Dünger-Management

### Outdoor (🌳)
**Vorteile:**
- Niedrige Kosten
- Natürliches Sonnenlicht
- Keine Energieversorgung nötig
- Größere Pflanzen möglich

**Zu beachten:**
- Wetterabhängig
- Saisonal begrenzt
- Schädlingsrisiko
- Sichtbarkeit für Nachbarn

**Empfohlene Module:**
- Setup-Wizard
- Legal-Check
- Foto-Tagebuch
- Ernte-Assistent

### Gewächshaus (🏡)
**Vorteile:**
- Natürliches Licht
- Wettergeschützt
- Erweiterte Anbausaison
- Kontrollierte Bedingungen

**Zu beachten:**
- Mittlere Kosten
- Platzbedarf
- Temperaturkontrolle erforderlich

**Empfohlene Module:**
- Setup-Wizard
- Multi-Sensor-Monitoring
- Foto-Tagebuch
- Dünger-Management

## Integration in bestehende Features

### Setup-Assistent
- Grow-Type-Auswahl als zweiter Schritt
- Anpassung der Equipment-Empfehlungen basierend auf der Auswahl
- Automatische Aktivierung empfohlener Module

### Dashboard
- Anzeige der aktuellen Grow-Type-Auswahl
- Schnelle Änderung der Auswahl
- Anpassung der angezeigten Informationen

### Equipment-Kalkulation
Die `calculateEquipment`-Funktion wurde erweitert, um verschiedene Empfehlungen basierend auf der Grow-Type zu geben:

```typescript
// Outdoor: Keine technische Ausrüstung
if (growType === 'outdoor') {
  return {
    tent: 'Nicht benötigt (Outdoor)',
    lighting: 'Natürliches Sonnenlicht',
    ventilation: 'Natürliche Luftzirkulation',
    nutrients: 'Bio-Dünger'
  }
}

// Gewächshaus: Gemischte Empfehlungen
if (growType === 'greenhouse') {
  return {
    tent: 'Gewächshaus vorhanden',
    lighting: area > 2 ? 'Zusätzliche LED' : 'Nur natürliches Licht',
    ventilation: 'Gewächshaus-Lüftung + optionaler Ventilator',
    nutrients: 'Standard 2-Phasen'
  }
}

// Indoor: Vollständige technische Ausrüstung
// Standard-Implementierung mit Zelt, LED, Ventilation
```

## Verwendung

### In Komponenten
```typescript
import { useGrowType } from '@/hooks/useGrowType'
import GrowTypeSelector from '@/components/setup/GrowTypeSelector'

function MyComponent() {
  const { growType, setGrowType } = useGrowType()
  
  return (
    <GrowTypeSelector
      selectedType={growType}
      onTypeChange={setGrowType}
    />
  )
}
```

### Im Setup-Assistenten
```typescript
case 'growType':
  return (
    <GrowTypeSelector
      selectedType={setupData.growType}
      onTypeChange={(type) => updateSetupData('growType', type)}
    />
  )
```

### Im Dashboard
```typescript
import GrowTypeDisplay from '@/components/ui/GrowTypeDisplay'
import GrowTypeQuickSelector from '@/components/ui/GrowTypeQuickSelector'

// Anzeige
<GrowTypeDisplay growType={growType} showDetails={true} />

// Schnelle Auswahl
<GrowTypeQuickSelector
  selectedType={growType}
  onTypeChange={setGrowType}
/>
```

## Zukünftige Erweiterungen

### Geplante Features
1. **Wetter-Integration**: Automatische Anpassung für Outdoor-Anbau
2. **Saisonale Empfehlungen**: Beste Pflanzzeiten basierend auf Standort
3. **Kostenkalkulation**: Detaillierte Kostenaufstellung pro Anbaumethode
4. **Community-Features**: Erfahrungsaustausch zwischen Indoor/Outdoor-Growern

### Technische Verbesserungen
1. **Persistierung**: Speicherung der Auswahl in lokaler Datenbank
2. **Synchronisation**: Cloud-Sync der Benutzereinstellungen
3. **Analytics**: Tracking der beliebtesten Anbaumethoden
4. **KI-Empfehlungen**: Intelligente Vorschläge basierend auf Benutzerdaten

## Fazit

Die Indoor/Outdoor-Auswahl bietet eine umfassende Lösung für verschiedene Anbaumethoden und ermöglicht es Benutzern, die App optimal an ihre individuellen Bedürfnisse anzupassen. Die modulare Implementierung erlaubt eine einfache Integration in bestehende Features und eine flexible Erweiterung für zukünftige Anforderungen.
