# 🌱 HomeBud - Cannabis Growing App

Eine umfassende, wissenschaftlich fundierte Cannabis-Anbau-App mit KI-gestützten Funktionen und moderner Benutzeroberfläche.

## 🚀 Features

### 📊 Dashboard-Kernansicht
- **Projektübersicht**: Strain-Name, Wachstumsphase, Fortschrittsbalken
- **Echtzeit-Monitoring**: Temperatur, Luftfeuchtigkeit, PPFD, VPD, pH-Wert, CO₂
- **To-Do & Erinnerungen**: Aufgabenverwaltung mit Prioritäten
- **Modul-Quicklinks**: Schnellzugriff auf wichtige Funktionen
- **KI-Empfehlungen**: Dynamische Handlungsvorschläge
- **Performance & Trends**: Ertragsprognose, Wachstumskurven
- **Foto-Tagebuch**: Bilddokumentation mit Notizen

### 🧬 Strain-Datenbank
- **Umfassende Strain-Profile**: Genetik, Cannabinoide, Anbaubedingungen
- **KI-gestützte Empfehlungen**: Personalisierte Strain-Auswahl
- **Filter & Suche**: Nach allen wichtigen Merkmalen
- **Vergleichsfunktion**: Side-by-Side Strain-Vergleiche

### 🔍 KI-Diagnose
- **Bild-Analyse**: Automatische Problemerkennung
- **Behandlungsvorschläge**: Konkrete Handlungsanweisungen
- **Google Gemini Integration**: Moderne KI-Technologie

### 📅 Planner & Kalender
- **Grow-Kalender**: Phasen-Timeline und Aufgabenplanung
- **Phasen-Planung**: Detaillierte Wachstumsphasen
- **Erinnerungen**: Automatische Benachrichtigungen

### 🍄 Biologische Innovationen
- **Mykorrhiza-Integration**: Optimierte Wurzelentwicklung
- **Trichoderma-Anwendung**: Natürlicher Pflanzenschutz
- **Tissue Culture**: In-vitro-Klonierung

### 💧 Bewässerungs-Rechner
- **Wissenschaftlich fundiert**: Basierend auf Cannabis-spezifischen Daten
- **Automatische Berechnung**: Substrat, Pflanzengröße, Umgebung
- **Personalisiert**: Anpassung an individuelle Bedingungen

### 📈 Analytics & Monitoring
- **Echtzeit-Daten**: Kontinuierliche Überwachung
- **Trend-Analyse**: Wachstumsentwicklung
- **Performance-Metriken**: Ertragsoptimierung

## 🛠️ Technologie-Stack

- **Frontend**: Next.js 14, React 18, TypeScript
- **Styling**: Tailwind CSS, Framer Motion
- **State Management**: Redux Toolkit
- **KI-Integration**: Google Gemini API
- **UI-Komponenten**: Custom Design System
- **PWA**: Progressive Web App Features

## 📱 Mobile Optimierung

- **Responsive Design**: Optimiert für alle Bildschirmgrößen
- **Touch-freundlich**: Große Touch-Targets (44px+)
- **Offline-Funktionalität**: PWA mit Service Worker
- **Performance**: Optimierte Ladezeiten

## 🚀 Installation & Setup

### Voraussetzungen
- Node.js 18+ 
- npm oder yarn

### Installation
```bash
# Repository klonen
git clone https://github.com/NiPacustoms/HomeBud.git
cd HomeBud

# Dependencies installieren
npm install

# Entwicklungsserver starten
npm run dev
```

### Umgebungsvariablen
Erstellen Sie eine `.env.local` Datei:
```env
# Google Gemini API
GEMINI_API_KEY=your_gemini_api_key_here

# Weitere Konfigurationen
NEXT_PUBLIC_APP_URL=http://localhost:3000
```

## 📁 Projektstruktur

```
HomeBud/
├── src/
│   ├── app/                    # Next.js App Router
│   ├── components/             # React Komponenten
│   │   ├── dashboard/          # Dashboard-Komponenten
│   │   ├── strains/            # Strain-Datenbank
│   │   ├── diagnosis/          # KI-Diagnose
│   │   ├── planner/            # Kalender & Planung
│   │   ├── biological/         # Biologische Module
│   │   └── ui/                 # UI-Komponenten
│   ├── services/               # API-Services
│   ├── store/                  # Redux Store
│   ├── types/                  # TypeScript Typen
│   └── hooks/                  # Custom Hooks
├── public/                     # Statische Assets
├── docs/                       # Dokumentation
└── scripts/                    # Build-Scripts
```

## 🎨 Design System

### Farbpalette
- **Primary**: Grün (#10B981) - Cannabis/Wachstum
- **Secondary**: Blau (#3B82F6) - Wasser/Technologie
- **Accent**: Lila (#8B5CF6) - Innovation
- **Neutral**: Grau (#6B7280) - UI-Elemente

### Typografie
- **Headings**: Inter (Bold)
- **Body**: Inter (Regular)
- **Code**: JetBrains Mono

### Komponenten
- **Buttons**: Verschiedene Varianten (Primary, Secondary, Ghost)
- **Cards**: Glassmorphism-Effekt
- **Forms**: Validierte Eingabefelder
- **Charts**: Interaktive Visualisierungen

## 🔧 Entwicklung

### Scripts
```bash
# Entwicklung
npm run dev          # Entwicklungsserver
npm run build        # Production Build
npm run start        # Production Server
npm run lint         # ESLint
npm run type-check   # TypeScript Check
```

### Code-Standards
- **TypeScript**: Strikte Typisierung
- **ESLint**: Code-Qualität
- **Prettier**: Code-Formatierung
- **Husky**: Pre-commit Hooks

## 📚 Dokumentation

Umfassende Dokumentation finden Sie im `docs/` Verzeichnis:

- [Dashboard-Kernansicht](docs/DASHBOARD_KERNANSICHT.md)
- [Strain-Datenbank Integration](docs/STRAIN_DATENBANK_INTEGRATION.md)
- [KI-Diagnose Implementierung](docs/KI_DIAGNOSE_IMPLEMENTIERUNG.md)
- [Design System](docs/DESIGN_SYSTEM.md)
- [Modulare Architektur](docs/MODULAR_ARCHITECTURE.md)

## 🤝 Beitragen

1. Fork das Repository
2. Erstellen Sie einen Feature-Branch (`git checkout -b feature/AmazingFeature`)
3. Committen Sie Ihre Änderungen (`git commit -m 'Add some AmazingFeature'`)
4. Pushen Sie zum Branch (`git push origin feature/AmazingFeature`)
5. Öffnen Sie einen Pull Request

## 📄 Lizenz

Dieses Projekt ist unter der MIT-Lizenz lizenziert - siehe [LICENSE](LICENSE) Datei für Details.

## 🙏 Danksagungen

- **Google Gemini**: KI-Integration
- **Next.js Team**: Framework
- **Tailwind CSS**: Styling
- **Framer Motion**: Animationen
- **Cannabis Community**: Wissenschaftliche Erkenntnisse

## 📞 Support

Bei Fragen oder Problemen:
- **Issues**: [GitHub Issues](https://github.com/NiPacustoms/HomeBud/issues)
- **Discussions**: [GitHub Discussions](https://github.com/NiPacustoms/HomeBud/discussions)

---

**HomeBud** - Wissenschaftlich fundierter Cannabis-Anbau mit modernster Technologie 🌱✨
