# Trichoderma-Anwendungsmodul

## Übersicht

Das Trichoderma-Anwendungsmodul erweitert die HomeBud-App um gezielte Trichoderma-Anwendungen zum Pflanzenschutz und Wachstumsförderung. Es ergänzt das Mykorrhiza-Modul um Kombi-Pakete und integriertes Monitoring.

## Hauptfunktionen

### 1. Stammauswahl
- **Datenbank geprüfter Stämme** mit detaillierten Attributen
- **Filterung nach Wirkmechanismen**: Pathogenhemmung, Wachstumsförderung, ISR-Induktion, Enzymproduktion, Nährstoffmobilisierung
- **Suche und Filterung** nach Stammnamen und Eigenschaften
- **Optimale Bedingungen**: pH-Bereich, Temperaturbereich, Dosierungsempfehlungen

### 2. Dosierungsrechner
- **Intelligente Berechnung** basierend auf:
  - Substratvolumen (Liter)
  - Substrattyp (Erdmischung, Kokosfaser, Hydroponisch)
  - Wachstumsphase (Keimung, Vegetativ, Blüte, Wartung)
  - Gewählter Stamm oder Kombi-Paket
- **Automatische Anpassung** der Dosierung je nach Bedingungen
- **Detaillierte Ausgabe** mit Anwendungsmethode und Frequenz

### 3. Kombi-Pakete Mykorrhiza + Trichoderma
- **Synergie-Pakete** aus geprüften Mykorrhiza- und Trichoderma-Kombinationen
- **Standardisierte Mischungsverhältnisse** je Topfvolumen und Pflanzenart
- **Anwendungsempfehlungen** für Zeitpunkt und Methode
- **Vorteile**: Verbesserte Nährstoffaufnahme, gesteigerte Wurzelbildung, erhöhter Schutz

### 4. Intelligente Empfehlungen
- **Personalisierte Empfehlungen** basierend auf Anbaubedingungen
- **Berücksichtigung von**:
  - Pflanzentyp
  - Substrattyp
  - Aktueller pH-Wert
  - Temperatur
  - Wachstumsphase
  - Krankheitsprobleme
- **Automatische Auswahl** der besten Stämme und Kombi-Pakete

### 5. Integriertes Monitoring
- **Anwendungsprotokollierung** mit Datum, Dosierung und Bedingungen
- **Wirksamkeitsdokumentation** durch Benutzerbewertungen
- **Automatische Auswertung**:
  - Durchschnittliche Wirksamkeit
  - Beste Stämme identifizieren
  - Empfehlungen für Verbesserungen
- **Erinnerungsfunktion** für Folgeapplikationen

## Technische Implementierung

### Datenstrukturen

#### TrichodermaStrain
```typescript
interface TrichodermaStrain {
  id: string
  name: string
  mechanisms: string[]
  application_methods: string[]
  optimal_soil_pH: [number, number]
  optimal_temperature_celsius: [number, number]
  recommended_dosage_g_per_liter: number
}
```

#### ComboPackage
```typescript
interface ComboPackage {
  id: string
  name: string
  description: string
  mycorrhiza_strain: string
  trichoderma_strain: string
  mixing_ratio: {
    mycorrhiza_percent: number
    trichoderma_percent: number
  }
  application_timing: string
  benefits: string[]
  dosage_per_liter: {
    mycorrhiza_g: number
    trichoderma_g: number
  }
}
```

#### ApplicationRecord
```typescript
interface ApplicationRecord {
  id: string
  date: Date
  strainId: string
  strainName: string
  dosage: number
  substrateVolume: number
  substrateType: string
  growthPhase: string
  applicationMethod: string
  observations: string
  effectiveness: 'excellent' | 'good' | 'fair' | 'poor'
}
```

### Service-Funktionen

#### TrichodermaService
- `getAllStrains()`: Alle Stämme abrufen
- `getStrainById(id)`: Stamm nach ID finden
- `getStrainsByMechanism(mechanism)`: Nach Wirkmechanismus filtern
- `getStrainsByPH(pH)`: Nach pH-Bereich filtern
- `getStrainsByTemperature(temp)`: Nach Temperatur filtern
- `calculateDosage(params)`: Dosierung berechnen
- `getRecommendation(params)`: Empfehlungen generieren
- `saveApplicationRecord(record)`: Anwendung protokollieren
- `getEffectivenessAnalysis()`: Wirksamkeitsanalyse

## Verwendung

### 1. Stammauswahl
1. Öffnen Sie das Trichoderma-Modul
2. Wählen Sie den Tab "Stammauswahl"
3. Nutzen Sie die Suchfunktion oder Filter
4. Wählen Sie einen passenden Stamm aus

### 2. Dosierung berechnen
1. Wechseln Sie zum Tab "Dosierungsrechner"
2. Geben Sie Substratvolumen ein
3. Wählen Sie Substrattyp und Wachstumsphase
4. Wählen Sie Stamm oder Kombi-Paket
5. Klicken Sie auf "Berechnen"

### 3. Empfehlungen erhalten
1. Öffnen Sie den Tab "Empfehlungen"
2. Geben Sie Ihre Anbaubedingungen ein
3. Klicken Sie auf "Empfehlungen generieren"
4. Folgen Sie den vorgeschlagenen Stämmen

### 4. Anwendungen protokollieren
1. Gehen Sie zum Tab "Monitoring"
2. Klicken Sie auf "Neue Anwendung"
3. Füllen Sie das Formular aus
4. Bewerten Sie die Wirksamkeit
5. Speichern Sie die Anwendung

## Datenbank

### Trichoderma-Stämme
Die Datenbank enthält 10 spezialisierte Trichoderma-Stämme:

1. **T. harzianum T22** - Antagonismus gegen Pathogene, Wachstumsförderung
2. **T. viride G-41** - Enzymproduktion, ISR-Induktion
3. **T. atroviride P1** - Starke ISR, Pathogenhemmung
4. **T. asperellum T34** - Stressresistenz, Nährstoffmobilisierung
5. **T. virens G-2** - Enzymproduktion, Mykotoxinabbau
6. **T. longibrachiatum** - Wachstumsförderung, ISR
7. **T. koningii** - Pathogenhemmung, Wurzelwachstum
8. **T. gamsii** - ISR-Induktion, Enzymproduktion
9. **T. viridescens** - Nährstoffmobilisierung, Pathogenabwehr
10. **T. polysporum** - Pathogenkontrolle, ISR

### Kombi-Pakete
Drei optimierte Kombinationen:

1. **Rhizophagus irregularis + T. harzianum T22**
   - Optimale Kombination für Wurzelgesundheit
   - 70% Mykorrhiza, 30% Trichoderma

2. **Glomus intraradices + T. viride G-41**
   - Enzymproduktion und ISR-Induktion
   - 60% Mykorrhiza, 40% Trichoderma

3. **Funneliformis mosseae + T. atroviride P1**
   - Maximale Stressresistenz
   - 65% Mykorrhiza, 35% Trichoderma

## Anwendungsrichtlinien

### Substrattypen
- **Erdmischung**: Standard-Dosierung (1.0x Multiplikator)
- **Kokosfaser**: Höhere Dosierung (1.2x Multiplikator)
- **Hydroponisch**: Reduzierte Dosierung (0.8x Multiplikator)

### Wachstumsphasen
- **Keimung**: 1.5x Multiplikator, einmalige Anwendung
- **Vegetativ**: 1.0x Multiplikator, alle 2-3 Wochen
- **Blüte**: 0.8x Multiplikator, wöchentlich
- **Wartung**: 0.5x Multiplikator, alle 4-6 Wochen

## Monitoring und Analyse

### Wirksamkeitsbewertung
- **Ausgezeichnet (4 Punkte)**: Sehr gute Ergebnisse
- **Gut (3 Punkte)**: Positive Ergebnisse
- **Mittel (2 Punkte)**: Durchschnittliche Ergebnisse
- **Schlecht (1 Punkt)**: Unbefriedigende Ergebnisse

### Automatische Empfehlungen
- Dosierung anpassen bei niedriger Wirksamkeit
- Stammwechsel bei anhaltenden Problemen
- Mehr Daten sammeln für bessere Analyse

## Integration

Das Trichoderma-Modul ist nahtlos in die bestehende HomeBud-App integriert:

- **Navigation**: Zugriff über das Hauptmenü
- **Design**: Konsistentes HomeBud-Design-System
- **Daten**: Lokale Speicherung mit localStorage
- **Kompatibilität**: Funktioniert mit allen anderen Modulen

## Zukünftige Erweiterungen

- **KI-gestützte Pilzerkennung** mit Foto-Upload
- **Erweiterte Datenbank** mit mehr Stämmen
- **Cloud-Synchronisation** der Anwendungsdaten
- **Automatische Erinnerungen** für Folgeapplikationen
- **Integration mit Sensoren** für automatische Bedingungserkennung
