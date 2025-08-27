# HomeBud Design System

Das HomeBud Design System implementiert den modernen, professionellen Designstil der Landing Page in der gesamten App-Anwendung.

## 🎨 Design-Prinzipien

### Farbschema
- **Primär**: Grün-zu-Smaragd-Gradienten (#22c55e, #10b981, #059669)
- **Hintergrund**: Dunkler Gradient (neutral-900 bis neutral-800)
- **Akzente**: Weiß mit Transparenz für Glasmorphismus-Effekte
- **Text**: Weiß mit verschiedenen Transparenzstufen

### Stilmerkmale
- **Glasmorphismus**: `backdrop-blur-sm` mit `bg-white/5` bis `bg-white/20`
- **Gradient-Text**: Animierte Gradient-Text-Effekte
- **Smooth Animationen**: Framer Motion mit `ease: "easeInOut"`
- **Hover-Effekte**: Scale, translate und Farbübergänge
- **Floating Elements**: Dynamische Hintergrund-Animationen

## 🧩 CSS-Klassen

### Hintergrund
```css
.bg-homebud-gradient          /* Haupt-Hintergrund-Gradient */
.bg-homebud-hero            /* Hero-Sektion-Hintergrund */
.bg-homebud-card            /* Card-Hintergrund */
.bg-homebud-card-hover      /* Card-Hover-Hintergrund */
```

### Buttons
```css
.btn-homebud-primary         /* Primärer Button */
.btn-homebud-secondary       /* Sekundärer Button */
.btn-homebud-large          /* Großer Button */
```

### Cards
```css
.card-homebud               /* Standard-Card */
.card-homebud-interactive   /* Interaktive Card mit 3D-Effekt */
```

### Text
```css
.gradient-text-homebud       /* Gradient-Text */
.gradient-text-homebud-large /* Großer Gradient-Text */
.gradient-text-homebud-animated /* Animierter Gradient-Text */
```

### Navigation
```css
.nav-homebud                /* Navigation mit Glasmorphismus */
.hero-homebud               /* Hero-Sektion */
.bg-blob-homebud           /* Hintergrund-Blobs */
.floating-element           /* Floating Elements */
```

## 🚀 Komponenten

### MorphingBackground
Interaktiver Hintergrund mit Maus-Tracking für dynamische Gradient-Effekte.

### FloatingElements
Animierte Hintergrund-Elemente für mehr Dynamik.

### BackgroundBlobs
Große, animierte Hintergrund-Blobs mit Rotation und Skalierung.

### AnimatedGradientText
Text mit animiertem Gradient-Hintergrund.

### InteractiveCard
3D-interaktive Cards mit Maus-Tracking und Hover-Effekten.

### HomeBudButton
Verschiedene Button-Varianten im HomeBud-Stil.

### HomeBudNavigation
Navigation mit Glasmorphismus und Animationen.

### HomeBudLogo
Logo-Komponente mit verschiedenen Größen.

### HomeBudFooter
Footer im HomeBud-Stil.

## 📱 Implementierte Seiten

### 1. Landing Page (`/`)
- Ursprünglicher Designstil
- Alle Designelemente sind hier definiert

### 2. Plants Page (`/plants`)
- Vollständig im HomeBud-Stil implementiert
- Verwendet alle neuen CSS-Klassen
- Gleiche Animationen und Effekte

### 3. Diagnose Page (`/diagnose`)
- Komplett neu gestaltet im HomeBud-Stil
- Verwendet alle Design-System-Komponenten
- Moderne UI mit Glasmorphismus

### 4. Planner Page (`/planner`)
- Vollständig im HomeBud-Stil implementiert
- Konsistente Designsprache
- Gleiche Animationen und Effekte

### 5. Dashboard Page (`/dashboard`)
- Neue Seite zur Demonstration des Design-Systems
- Zeigt alle Designelemente in Aktion
- Statistik-Cards und Aktivitäts-Feeds

## 🎯 Verwendung

### Neue Seite erstellen
```tsx
import { 
  MorphingBackground, 
  FloatingElements, 
  BackgroundBlobs, 
  AnimatedGradientText, 
  InteractiveCard, 
  HomeBudButton, 
  HomeBudNavigation, 
  HomeBudLogo, 
  HomeBudFooter 
} from '@/components/ui/HomeBudDesign'

export default function NeueSeite() {
  return (
    <div className="min-h-screen bg-homebud-gradient text-white relative overflow-x-hidden">
      <MorphingBackground />
      <FloatingElements count={25} />
      
      <HomeBudNavigation>
        {/* Navigation-Inhalt */}
      </HomeBudNavigation>
      
      {/* Seiten-Inhalt */}
      
      <HomeBudFooter>
        {/* Footer-Inhalt */}
      </HomeBudFooter>
    </div>
  )
}
```

### Neue Komponente erstellen
```tsx
// Verwende die vordefinierten CSS-Klassen
<div className="card-homebud p-6">
  <h3 className="gradient-text-homebud">Titel</h3>
  <p className="text-white/60">Beschreibung</p>
  <HomeBudButton variant="primary">Aktion</HomeBudButton>
</div>
```

## 🔧 Anpassungen

### Neue Farben hinzufügen
```css
/* In globals.css */
.bg-homebud-custom {
  @apply bg-gradient-to-r from-custom-500 to-custom-600;
}
```

### Neue Animationen
```css
/* In globals.css */
@keyframes custom-animation {
  0%, 100% { transform: scale(1); }
  50% { transform: scale(1.1); }
}

.animate-custom {
  animation: custom-animation 2s ease-in-out infinite;
}
```

## 📱 Responsive Design

Alle Komponenten sind vollständig responsive und verwenden:
- Mobile-first Ansatz
- Flexible Grids
- Anpassbare Schriftgrößen
- Touch-optimierte Interaktionen

## 🎨 Konsistenz

Das Design-System stellt sicher, dass:
- Alle Seiten den gleichen visuellen Stil haben
- Animationen und Übergänge konsistent sind
- Farben und Typografie einheitlich sind
- Benutzererfahrung durch alle Bereiche der App konsistent ist

## 🚀 Performance

- Alle Animationen sind mit `useCallback` und `useMemo` optimiert
- Komponenten verwenden `React.memo` für bessere Performance
- Lazy Loading für nicht-kritische Animationen
- Optimierte Framer Motion-Animationen
