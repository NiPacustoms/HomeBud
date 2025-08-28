# HomeBud - Cannabis Growing Assistant

Eine umfassende Next.js-Anwendung für Cannabis-Anbauer mit Firebase-Integration.

## 🚀 Features

- **Dashboard**: Übersicht über alle Pflanzen und Messungen
- **Pflanzenverwaltung**: Detaillierte Aufzeichnung von Pflanzenwachstum
- **Messungen**: Temperatur, Luftfeuchtigkeit, pH-Wert, EC-Wert
- **Notizen**: Dokumentation von Beobachtungen und Maßnahmen
- **Strain-Datenbank**: Vergleich verschiedener Cannabis-Sorten
- **KI-Diagnose**: Automatische Problemerkennung
- **Firebase-Integration**: Authentifizierung und Datenpersistierung

## 🔧 Firebase Setup

### 1. Firebase-Projekt erstellen

1. Gehe zu [Firebase Console](https://console.firebase.google.com/)
2. Erstelle ein neues Projekt oder verwende ein bestehendes
3. Aktiviere Authentication (Email/Password, Google)
4. Erstelle eine Firestore-Datenbank
5. Aktiviere Storage (optional)

### 2. Umgebungsvariablen konfigurieren

Kopiere `env.example` zu `.env.local` und fülle die Firebase-Konfiguration aus:

```bash
cp env.example .env.local
```

```env
NEXT_PUBLIC_FIREBASE_API_KEY=your_api_key_here
NEXT_PUBLIC_FIREBASE_AUTH_DOMAIN=your_project_id.firebaseapp.com
NEXT_PUBLIC_FIREBASE_PROJECT_ID=your_project_id
NEXT_PUBLIC_FIREBASE_STORAGE_BUCKET=your_project_id.appspot.com
NEXT_PUBLIC_FIREBASE_MESSAGING_SENDER_ID=your_sender_id
NEXT_PUBLIC_FIREBASE_APP_ID=your_app_id
NEXT_PUBLIC_FIREBASE_MEASUREMENT_ID=your_measurement_id
```

### 3. Firestore Security Rules

```javascript
rules_version = '2';
service cloud.firestore {
  match /databases/{database}/documents {
    // Benutzer können nur ihre eigenen Daten lesen/schreiben
    match /{document=**} {
      allow read, write: if request.auth != null && request.auth.uid == resource.data.userId;
    }
  }
}
```

## 📦 Installation

```bash
# Dependencies installieren
npm install

# Entwicklungsserver starten
npm run dev

# Build für Produktion
npm run build

# Produktionsserver starten
npm start
```

## 🏗️ Projektstruktur

```
src/
├── app/                 # Next.js App Router
├── components/          # React-Komponenten
│   ├── ui/             # UI-Komponenten
│   ├── dashboard/      # Dashboard-Komponenten
│   └── ...
├── services/           # Service-Layer
│   ├── firebase/       # Firebase-Services
│   └── ...
├── hooks/              # Custom Hooks
├── store/              # Redux Store
├── types/              # TypeScript-Typen
└── lib/                # Utilities
    └── firebase.ts     # Firebase-Konfiguration
```

## 🔐 Authentifizierung

Die Anwendung verwendet Firebase Authentication mit:

- **Email/Password**: Standard-Registrierung und Login
- **Google OAuth**: Ein-Klick-Login mit Google
- **Passwort-Reset**: Automatische E-Mail-Versendung

### Verwendung in Komponenten

```typescript
import { useFirebase } from '@/hooks/useFirebase';

const MyComponent = () => {
  const { user, login, logout, loading } = useFirebase();

  if (loading) return <div>Laden...</div>;
  
  if (!user) {
    return <button onClick={() => login('email', 'password')}>Login</button>;
  }

  return (
    <div>
      <p>Willkommen, {user.displayName}!</p>
      <button onClick={logout}>Logout</button>
    </div>
  );
};
```

## 📊 Datenpersistierung

Firestore wird für folgende Daten verwendet:

- **Pflanzen**: Alle Pflanzeninformationen
- **Messungen**: Sensor- und Messdaten
- **Notizen**: Benutzer-Notizen
- **Dashboard**: Dashboard-Konfiguration

### Verwendung

```typescript
import { useFirebase } from '@/hooks/useFirebase';

const DataComponent = () => {
  const { createDocument, getUserDocuments } = useFirebase();

  // Dokument erstellen
  const createPlant = async () => {
    const plantId = await createDocument('plants', {
      name: 'Cannabis Plant',
      strain: 'OG Kush',
      // ... weitere Daten
    });
  };

  // Dokumente abrufen
  const loadPlants = async () => {
    const plants = await getUserDocuments('plants');
    console.log(plants);
  };
};
```

## 🛠️ Entwicklung

### Firebase Emulator (Entwicklung)

```bash
# Firebase CLI installieren
npm install -g firebase-tools

# Emulator starten
firebase emulators:start
```

### TypeScript

Die Anwendung ist vollständig in TypeScript geschrieben mit:

- Strikte Typisierung
- Interface-Definitionen für alle Datenstrukturen
- Type-Safe Firebase-Integration

### Linting

```bash
# ESLint ausführen
npm run lint

# TypeScript-Prüfung
npm run type-check
```

## 🚀 Deployment

### Vercel (Empfohlen)

1. Verbinde dein GitHub-Repository mit Vercel
2. Konfiguriere die Umgebungsvariablen in Vercel
3. Deploy automatisch bei jedem Push

### Andere Plattformen

Die Anwendung kann auf jeder Node.js-Plattform deployed werden:

- Netlify
- Railway
- Heroku
- AWS Amplify

## 📝 Lizenz

Dieses Projekt ist für Bildungszwecke bestimmt. Bitte beachte die lokalen Gesetze bezüglich Cannabis-Anbau.

## 🤝 Beitragen

1. Fork das Repository
2. Erstelle einen Feature-Branch
3. Committe deine Änderungen
4. Push zum Branch
5. Erstelle einen Pull Request

## 📞 Support

Bei Fragen oder Problemen:

- Erstelle ein Issue im GitHub-Repository
- Kontaktiere das Entwicklungsteam
- Konsultiere die Firebase-Dokumentation
