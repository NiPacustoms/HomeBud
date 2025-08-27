# 3D Cannabis Modelle

Dieser Ordner sollte die folgenden GLTF-Modelle enthalten:

- `seed.gltf` - Samen-Modell
- `seedling.gltf` - Keimling-Modell  
- `vegetative.gltf` - Vegetative Phase-Modell
- `flowering.gltf` - Blüte-Modell
- `mature.gltf` - Reife Pflanze-Modell

## Hinweis

Falls die Modelle nicht verfügbar sind, verwendet die Cannabis3DGrowth-Komponente automatisch Fallback-Geometrien mit einfachen Three.js-Formen.

## Empfohlene Modell-Eigenschaften

- **Format**: GLTF/GLB
- **Skalierung**: Einheitlich (1.0 = 1 Meter)
- **Texturen**: Eingebettet oder separate Dateien
- **Animationen**: Optional für zusätzliche Effekte
- **Polygonanzahl**: Optimiert für Web-Performance (< 10k Polygone pro Modell)
