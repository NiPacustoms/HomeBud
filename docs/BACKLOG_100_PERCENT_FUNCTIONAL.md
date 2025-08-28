# HomeBud - Backlog für 100% Funktionalität

## Übersicht
Dieses Backlog definiert alle notwendigen Aufgaben, um HomeBud vollständig produktionsreif und 100% funktional zu machen.

## Prioritäten
- **P0**: Kritisch für Produktionsreife (MVP)
- **P1**: Wichtig für Benutzererfahrung
- **P2**: Nice-to-have Features

---

## P0 - Kritische Epics

### Epic: Persistenz & Offline-First

#### Story: Einheitliche Datenpersistenz
- **Beschreibung**: Konsolidierung der lokalen Stores und klare Service-Schnittstellen
- **Akzeptanzkriterien**:
  - Alle CRUD-Pfade nutzen Service-Layer
  - Eindeutige IDs und Versionierung pro Eintrag
  - Atomare Write-Operationen mit konsistenten Rückgaben
- **Aufwand**: L
- **Bereiche**: `src/services/*`, `src/types/*`, betroffene Pages
- **Risiken**: Migration bestehender Daten, Offline-Edge-Fälle

#### Story: Service Worker finalisieren
- **Beschreibung**: Vollständige PWA-Funktionalität mit Caching
- **Akzeptanzkriterien**:
  - Precaching kritischer Routen
  - Stale-While-Revalidate für Daten
  - SW-Update Flow sichtbar
  - Offline-Fallback-Seiten
- **Aufwand**: M
- **Bereiche**: `public/sw*.js`, `public/manifest.json`
- **Risiken**: Cache-Invalidierung, Race-Conditions

### Epic: Authentifizierung & Sicherheit

#### Story: Basis-Auth (E-Mail/Passwort, Session)
- **Beschreibung**: Grundlegende Authentifizierung implementieren
- **Akzeptanzkriterien**:
  - Login/Logout/Reset Flows
  - Guarded Routen
  - Benutzerfreundliche Fehlertexte
- **Aufwand**: M
- **Bereiche**: `src/hooks/useAuth.ts`, Route Guards, UI Components
- **Risiken**: Session Handling, Redirect-Loops

#### Story: Consent-Banner + Analytics Opt-in
- **Beschreibung**: DSGVO-konforme Einwilligung
- **Akzeptanzkriterien**:
  - Opt-in vor Tracking
  - IP-Anonymisierung
  - Status in Settings änderbar
- **Aufwand**: S
- **Bereiche**: `src/app/layout.tsx`, `src/app/analytics/page.tsx`
- **Risiken**: Consent-State Hydration

### Epic: Dashboard Stabilisierung

#### Story: Widget-System Speichern/Laden
- **Beschreibung**: Persistente Dashboard-Konfiguration
- **Akzeptanzkriterien**:
  - Add/Remove/Reorder Widgets
  - Persistenz je Nutzer
  - Fallbacks ohne Daten
- **Aufwand**: M
- **Bereiche**: `src/components/dashboard/*`, `src/services/dashboardService.ts`
- **Risiken**: Drag-and-Drop/SSR, Layout-Migration

### Epic: Messungen & VPD

#### Story: Messungs-CRUD + Charts
- **Beschreibung**: Vollständige Messungsverwaltung
- **Akzeptanzkriterien**:
  - Erstellen/Bearbeiten/Löschen
  - Filter/Zeiträume
  - CSV Export
- **Aufwand**: M
- **Bereiche**: `src/app/measurements/page.tsx`, `src/services/measurementsLocalStore.ts`
- **Risiken**: Performance bei großen Datenmengen

### Epic: Diagnose & KI

#### Story: Robustes Fehlerhandling + Rate-Limit
- **Beschreibung**: Stabile Gemini-Integration
- **Akzeptanzkriterien**:
  - Timeouts und Quoten
  - Request-Caching
  - Benutzerfreundliche Fehlermeldungen
- **Aufwand**: M
- **Bereiche**: `src/services/geminiService.ts`, Diagnose-UI
- **Risiken**: API-Kontingente

---

## P1 - Wichtige Features

### Epic: Notizen Pro

#### Story: Tags, Volltextsuche, Anhänge
- **Beschreibung**: Erweiterte Notizenfunktionalität
- **Akzeptanzkriterien**:
  - Tag-Filter
  - Schnelle Volltextsuche
  - Bild-Upload (lokal/placeholder)
  - Export-Funktionalität
- **Aufwand**: M
- **Bereiche**: `src/components/notes/NotesManager.tsx`, `src/types/note.ts`
- **Risiken**: Storage-Größe, Offline-Anhänge

### Epic: Seeds/Strains Verbesserungen

#### Story: Erweiterte Filter/Sortierung/Compare
- **Beschreibung**: Verbesserte Datenbankfunktionen
- **Akzeptanzkriterien**:
  - Blütezeit, Ertrag, Terpene Filter
  - Vergleich speichern
  - Erweiterte Sortierung
- **Aufwand**: M
- **Bereiche**: `src/app/seeds/*`, `src/app/strains/page.tsx`
- **Risiken**: Datenqualität, Performance

### Epic: Ernte & Planung

#### Story: Ernte-Workflow inkl. Erinnerungen/ICS
- **Beschreibung**: Vollständiger Ernteprozess
- **Akzeptanzkriterien**:
  - Timeline und Reifeindikatoren
  - ICS-Export
  - Erinnerungen
- **Aufwand**: M
- **Bereiche**: `src/app/harvest/page.tsx`, `src/components/harvest/HarvestAssistant.tsx`
- **Risiken**: Datum/Zeitzonen

---

## P2 - Nice-to-Have

### Epic: PWA Push/Background Sync

#### Story: Benachrichtigungen (Mess-Reminder)
- **Beschreibung**: Push-Notifications für wichtige Events
- **Akzeptanzkriterien**:
  - Opt-in für Benachrichtigungen
  - Test-Push
  - Planbare Reminder
- **Aufwand**: M
- **Bereiche**: Service Worker, Settings
- **Risiken**: Browser-Berechtigungen

### Epic: Qualität & Monitoring

#### Story: Tests, Lint, Monitoring
- **Beschreibung**: Qualitätssicherung
- **Akzeptanzkriterien**:
  - Unit/Integrations-Tests für kritische Flows
  - Sentry/Logging
  - CI/CD Pipeline
- **Aufwand**: M
- **Bereiche**: Testsuite, CI-Konfiguration
- **Risiken**: Buildzeiten

---

## Sprint-Plan

### Sprint 1 (2 Wochen) - Fokus P0
1. **Einheitliche Datenpersistenz** (Teil 1: Schnittstellen + Pflanzen/Notizen)
2. **Service Worker final** (Caching-Strategie + Update Flow)
3. **Auth Basis + Route Guards**
4. **Dashboard: Persistenz Layout**

### Sprint 2 (2 Wochen) - Fokus P0
1. **Messungs-CRUD + Charts + CSV Export**
2. **Diagnose Fehlerhandling + Rate-Limit/Caching**
3. **Consent-Banner + Analytics Opt-in**
4. **Cleanup/Tests für alle P0-Stories**

---

## Konkrete Tasks (Beispiele)

### P0: Konsolidierter Service-Layer für Notizen
- **Kriterien**:
  - `getNotes`, `createNote`, `updateNote`, `deleteNote` mit expliziten Typen
  - Strukturierte Fehlerobjekte
  - UI nutzt ausschließlich Service
- **Aufwand**: S-M
- **Bereiche**: `src/services/*`, `src/components/notes/NotesManager.tsx`

### P0: SW Update Flow
- **Kriterien**:
  - Snackbar "Update verfügbar – Neu laden"
  - Offline-Fallback-Seite für Kernrouten
- **Aufwand**: S-M
- **Bereiche**: `public/sw.js`, `src/app/layout.tsx`

### P0: Diagnose Rate-Limit
- **Kriterien**:
  - max N Requests/Minute pro Nutzer
  - UI zeigt verbleibende Kontingente
  - Timeouts + Retry mit Backoff
- **Aufwand**: S-M
- **Bereiche**: `src/services/geminiService.ts`, Diagnose-UI

---

## Technische Anforderungen

### Sicherheit & Compliance
- Rollen/Scopes (nur User/Admin, kein SuperAdmin)
- DSGVO (Consent, Export/Löschung)
- Logging minimiert
- Rate-Limiting bei KI-Features

### Code-Qualität
- Typsicherheit (keine unnötigen `any`)
- Klare Pfadangaben
- Nutzung bestehender Muster
- Lint/TypeCheck "grün"

### Performance
- Code-Splitting
- Bundle-Analyse
- Image-Optimierung
- SWR/React-Query Policies

---

## Abnahme-Kriterien

### Definition of Done
- [ ] Funktionalität implementiert
- [ ] Tests geschrieben und bestanden
- [ ] Code Review abgeschlossen
- [ ] Dokumentation aktualisiert
- [ ] Lint/TypeCheck bestanden
- [ ] Performance-Kriterien erfüllt
- [ ] Accessibility geprüft
- [ ] Mobile Responsiveness getestet

### Definition of Ready
- [ ] Story beschrieben mit Akzeptanzkriterien
- [ ] Aufwand geschätzt
- [ ] Abhängigkeiten identifiziert
- [ ] Test-Szenarien definiert
- [ ] UI/UX Mockups vorhanden (falls relevant)
