# UI Design-Vorgaben - HomeBud App

## 📋 Verbindliche Design-Richtlinien

Diese Vorgaben sind **verpflichtend** für alle UI-Entwicklungen in der HomeBud App und müssen bei jeder neuen Komponente, Seite oder Funktion befolgt werden.

---

## 🎨 **1. Farbschema (VERBINDLICH)**

### Primärfarben
```css
/* MUSS verwendet werden - keine Abweichungen erlaubt */
--homebud-green: #22c55e      /* Hauptfarbe */
--homebud-emerald: #10b981    /* Sekundärfarbe */
--homebud-teal: #059669       /* Akzentfarbe */
```

### Hintergrundfarben
```css
/* MUSS verwendet werden */
.bg-homebud-gradient          /* Haupt-Hintergrund */
.bg-homebud-hero            /* Hero-Sektionen */
.bg-homebud-card            /* Card-Hintergründe */
```

### Textfarben
```css
/* MUSS verwendet werden */
.text-white                  /* Haupttext */
.text-white/80              /* Sekundärtext */
.text-white/60              /* Tertiärtext */
.text-white/40              /* Deaktivierter Text */
```

### Gradient-Text
```css
/* MUSS verwendet werden für Überschriften */
.gradient-text-homebud       /* Standard-Gradient */
.gradient-text-homebud-large /* Große Überschriften */
.gradient-text-homebud-animated /* Animierte Überschriften */
```

---

## 🧩 **2. Komponenten-Standards (VERBINDLICH)**

### Navigation
```tsx
// MUSS verwendet werden
<HomeBudNavigation isVisible={isNavVisible}>
  <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
    <div className="flex items-center justify-between h-16">
      <HomeBudLogo onClick={() => router.push('/')} />
      {/* Navigation-Links */}
      <HomeBudButton variant="primary">Aktion</HomeBudButton>
    </div>
  </div>
</HomeBudNavigation>
```

### Buttons
```tsx
// MUSS verwendet werden - keine custom Buttons erlaubt
<HomeBudButton variant="primary" size="default">Primär</HomeBudButton>
<HomeBudButton variant="secondary" size="default">Sekundär</HomeBudButton>
<HomeBudButton variant="primary" size="large">Groß</HomeBudButton>
```

### Cards
```tsx
// MUSS verwendet werden
<InteractiveCard className="text-center" onClick={handleClick}>
  {/* Card-Inhalt */}
</InteractiveCard>

// ODER für statische Cards
<div className="card-homebud p-6">
  {/* Card-Inhalt */}
</div>
```

### Hintergrund-Elemente
```tsx
// MUSS verwendet werden für alle Seiten
<MorphingBackground />
<FloatingElements count={25} />
<BackgroundBlobs />
```

---

## 📱 **3. Seiten-Struktur (VERBINDLICH)**

### Grundstruktur jeder Seite
```tsx
export default function NeueSeite() {
  const router = useRouter()
  const [isNavVisible, setIsNavVisible] = useState(true)
  
  // Navigation visibility logic
  useEffect(() => {
    const handleScroll = () => {
      setIsNavVisible(window.scrollY < 100)
    }
    window.addEventListener('scroll', handleScroll)
    return () => window.removeEventListener('scroll', handleScroll)
  }, [])

  return (
    <div className="min-h-screen bg-homebud-gradient text-white relative overflow-x-hidden">
      {/* 1. Hintergrund-Elemente (MUSS) */}
      <MorphingBackground />
      <FloatingElements count={25} />
      
      {/* 2. Navigation (MUSS) */}
      <HomeBudNavigation isVisible={isNavVisible}>
        {/* Navigation-Inhalt */}
      </HomeBudNavigation>
      
      {/* 3. Hero-Sektion (MUSS für Hauptseiten) */}
      <motion.section className="relative min-h-screen flex items-center justify-center overflow-hidden pt-16">
        <BackgroundBlobs />
        <div className="relative z-10 text-center max-w-4xl mx-auto px-4">
          <AnimatedGradientText size="hero">Titel</AnimatedGradientText>
          {/* Hero-Inhalt */}
        </div>
      </motion.section>
      
      {/* 4. Content-Sektionen */}
      <section className="py-20 relative overflow-hidden">
        <div className="absolute inset-0 bg-gradient-to-r from-green-500/5 via-transparent to-emerald-500/5"></div>
        <FloatingElements count={8} />
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 relative">
          {/* Sektions-Inhalt */}
        </div>
      </section>
      
      {/* 5. Footer (MUSS) */}
      <HomeBudFooter>
        {/* Footer-Inhalt */}
      </HomeBudFooter>
    </div>
  )
}
```

---

## 🎭 **4. Animationen (VERBINDLICH)**

### Scroll-Animationen
```tsx
// MUSS verwendet werden für Hero-Sektionen
const { scrollY } = useScroll()
const heroY = useTransform(scrollY, [0, 500], [0, -100])
const heroOpacity = useTransform(scrollY, [0, 300], [1, 0.8])
const heroScale = useTransform(scrollY, [0, 300], [1, 0.95])

// Anwendung
<motion.section 
  style={{ y: heroY, opacity: heroOpacity, scale: heroScale }}
  className="relative min-h-screen flex items-center justify-center overflow-hidden pt-16"
>
```

### In-View-Animationen
```tsx
// MUSS verwendet werden für alle Sektionen
const sectionRef = useRef<HTMLDivElement>(null)
const sectionInView = useInView(sectionRef, { once: true, amount: 0.3 })

<motion.div
  ref={sectionRef}
  initial={{ y: 50, opacity: 0 }}
  animate={sectionInView ? { y: 0, opacity: 1 } : {}}
  transition={{ duration: 0.8, ease: "easeOut" }}
>
```

### Hover-Animationen
```tsx
// MUSS verwendet werden für interaktive Elemente
<motion.div
  whileHover={{ scale: 1.05, y: -2 }}
  whileTap={{ scale: 0.95 }}
  className="card-homebud-interactive"
>
```

---

## 📐 **5. Layout-Standards (VERBINDLICH)**

### Container
```css
/* MUSS verwendet werden */
.max-w-7xl mx-auto px-4 sm:px-6 lg:px-8
```

### Grid-System
```tsx
// MUSS verwendet werden
<div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
  {/* Grid-Items */}
</div>

// Für 4 Spalten
<div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
```

### Spacing
```css
/* MUSS verwendet werden */
.mb-6, .mb-8, .mb-12, .mb-16    /* Vertikale Abstände */
.py-20                           /* Sektions-Padding */
.p-6, .p-8                       /* Card-Padding */
.gap-4, .gap-6, .gap-8          /* Grid-Gaps */
```

---

## 🔤 **6. Typografie (VERBINDLICH)**

### Überschriften
```tsx
// MUSS verwendet werden
<AnimatedGradientText size="hero">Haupttitel</AnimatedGradientText>
<AnimatedGradientText size="large">Sektions-Titel</AnimatedGradientText>
<h2 className="text-5xl md:text-6xl font-bold text-white mb-6">
  Titel mit <span className="gradient-text-homebud">Gradient</span>
</h2>
```

### Text-Größen
```css
/* MUSS verwendet werden */
.text-6xl md:text-8xl          /* Hero-Titel */
.text-5xl md:text-6xl          /* Sektions-Titel */
.text-4xl md:text-5xl          /* Untertitel */
.text-2xl md:text-3xl          /* Beschreibung */
.text-xl md:text-2xl            /* Standard-Text */
.text-lg                         /* Kleinere Texte */
```

### Text-Farben
```css
/* MUSS verwendet werden */
.text-white                      /* Haupttext */
.text-white/80                  /* Wichtiger Text */
.text-white/60                  /* Beschreibungstext */
.text-white/40                  /* Deaktivierter Text */
.gradient-text-homebud          /* Gradient-Text */
```

---

## 🎯 **7. Interaktive Elemente (VERBINDLICH)**

### Hover-Effekte
```css
/* MUSS verwendet werden */
.hover-homebud                  /* Standard-Hover */
.group-hover:opacity-100       /* Group-Hover */
.hover:scale-105               /* Scale-Hover */
.hover:-translate-y-2          /* Lift-Hover */
```

### Focus-States
```css
/* MUSS verwendet werden */
.focus:border-green-400         /* Focus-Border */
.focus:ring-2                  /* Focus-Ring */
.focus:ring-green-400/20       /* Focus-Ring-Farbe */
```

### Loading-States
```tsx
// MUSS verwendet werden
<motion.div
  animate={{ rotate: 360 }}
  transition={{ duration: 1, repeat: Infinity, ease: "linear" }}
  className="w-6 h-6 border-2 border-white/20 border-t-white rounded-full"
/>
```

---

## 📱 **8. Responsive Design (VERBINDLICH)**

### Breakpoints
```css
/* MUSS verwendet werden */
sm: 640px    /* Mobile */
md: 768px    /* Tablet */
lg: 1024px   /* Desktop */
xl: 1280px   /* Large Desktop */
```

### Mobile-First
```tsx
// MUSS verwendet werden
<div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4 sm:gap-6 lg:gap-8">
<div className="text-2xl md:text-3xl lg:text-4xl">
<div className="px-4 sm:px-6 lg:px-8">
```

### Touch-Optimierung
```css
/* MUSS verwendet werden */
.min-h-[44px]                  /* Touch-Target-Minimum */
.cursor-pointer                 /* Touch-Indikator */
```

---

## 🚫 **9. Verbotene Praktiken (NICHT ERLAUBT)**

### Farben
- ❌ Keine anderen Grün-Töne als die definierten
- ❌ Keine anderen Hintergrundfarben als die definierten
- ❌ Keine anderen Textfarben als die definierten

### Komponenten
- ❌ Keine custom Buttons ohne HomeBudButton
- ❌ Keine custom Cards ohne InteractiveCard
- ❌ Keine custom Navigation ohne HomeBudNavigation

### Layout
- ❌ Keine anderen Container-Breiten als max-w-7xl
- ❌ Keine anderen Grid-Systeme als die definierten
- ❌ Keine anderen Spacing-Werte als die definierten

### Animationen
- ❌ Keine anderen Animationen als Framer Motion
- ❌ Keine anderen Hover-Effekte als die definierten
- ❌ Keine anderen Transition-Zeiten als die definierten

---

## ✅ **10. Qualitätskontrolle (VERBINDLICH)**

### Vor dem Commit prüfen:
1. ✅ Alle Farben entsprechen dem Farbschema
2. ✅ Alle Komponenten verwenden HomeBud-Design-System
3. ✅ Alle Animationen verwenden Framer Motion
4. ✅ Responsive Design ist implementiert
5. ✅ Hover- und Focus-States sind vorhanden
6. ✅ Spacing folgt den definierten Standards
7. ✅ Typografie folgt den definierten Standards

### Code-Review-Checkliste:
- [ ] Farbschema eingehalten
- [ ] Komponenten-Standards eingehalten
- [ ] Animationen-Standards eingehalten
- [ ] Layout-Standards eingehalten
- [ ] Typografie-Standards eingehalten
- [ ] Responsive Design implementiert
- [ ] Accessibility berücksichtigt
- [ ] Performance optimiert

---

## 🔧 **11. Implementierung neuer Features**

### Schritt-für-Schritt:
1. **Design-System importieren**
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
   ```

2. **Seiten-Struktur folgen**
   - Hintergrund-Elemente
   - Navigation
   - Hero-Sektion (falls Hauptseite)
   - Content-Sektionen
   - Footer

3. **CSS-Klassen verwenden**
   - Nur die definierten HomeBud-Klassen
   - Keine custom CSS-Klassen

4. **Animationen implementieren**
   - Scroll-Animationen für Hero
   - In-View-Animationen für Sektionen
   - Hover-Animationen für Interaktionen

5. **Responsive Design**
   - Mobile-first Ansatz
   - Breakpoint-spezifische Anpassungen
   - Touch-optimierte Interaktionen

---

## 📞 **12. Support und Fragen**

Bei Fragen oder Unklarheiten bezüglich der Design-Vorgaben:
1. Dokumentation prüfen (`DESIGN_SYSTEM.md`)
2. Bestehende Seiten als Referenz verwenden
3. Code-Review mit dem Team durchführen
4. Bei Bedarf Design-System erweitern (nur nach Absprache)

---

**Diese Vorgaben sind verbindlich und müssen bei jeder UI-Entwicklung befolgt werden. Abweichungen sind nur nach vorheriger Genehmigung erlaubt.**
