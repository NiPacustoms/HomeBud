const XLSX = require('xlsx');
const fs = require('fs');
const path = require('path');

// Konfiguration
const INPUT_FILE = process.argv[2] || 'samen-datenbank.xlsx';
const OUTPUT_DIR = path.join(__dirname, '../public/data');
const OUTPUT_FILE = path.join(OUTPUT_DIR, 'seed-database.json');

// Stelle sicher, dass der Ausgabeordner existiert
if (!fs.existsSync(OUTPUT_DIR)) {
  fs.mkdirSync(OUTPUT_DIR, { recursive: true });
}

function convertXlsxToJson() {
  try {
    console.log(`📖 Lade XLSX-Datei: ${INPUT_FILE}`);
    
    // Lade die XLSX-Datei
    const workbook = XLSX.readFile(INPUT_FILE);
    const sheetName = workbook.SheetNames[0]; // Erste Tabelle
    const worksheet = workbook.Sheets[sheetName];
    
    // Konvertiere zu JSON
    const rawData = XLSX.utils.sheet_to_json(worksheet, { header: 1 });
    
    console.log(`📊 Gefundene Zeilen: ${rawData.length}`);
    
    // Extrahiere Header (erste Zeile)
    const headers = rawData[0];
    console.log('📋 Spalten:', headers);
    
    // Verarbeite Daten
    const seeds = [];
    const categories = new Set();
    
    for (let i = 1; i < rawData.length; i++) {
      const row = rawData[i];
      if (!row || row.length === 0) continue;
      
      const seed = {
        id: generateId(row[0] || `seed-${i}`), // Name als Basis für ID
        name: row[0] || '',
        botanicalName: 'Cannabis', // Standard für Cannabis
        variety: row[1] || '', // Breeder als Varietät
        category: 'Cannabis',
        germinationTime: undefined,
        growingTime: parseNumber(row[3]), // flowering_time
        optimalTemperature: { min: 20, max: 28 }, // Standard Cannabis-Temperatur
        optimalHumidity: { min: 40, max: 70 }, // Standard Cannabis-Luftfeuchtigkeit
        lightRequirements: 'high', // Cannabis benötigt viel Licht
        waterRequirements: 'medium',
        soilType: 'Nährstoffreich',
        pH: { min: 6.0, max: 7.0 }, // Optimaler pH für Cannabis
        spacing: 60, // Standard Pflanzabstand
        depth: 1, // Standard Pflanztiefe
        harvestTime: row[3] ? `${row[3]} Wochen` : '',
        yield: 'Variabel',
        notes: row[8] || row[9] || '', // description_basic oder description_extended
        imageUrl: row[2] || '', // url als Bild-URL
        tags: parseCannabisTags(row[4], row[5], row[6], row[7]), // heritage, feminized, thc, cbd
        createdAt: new Date().toISOString(),
        updatedAt: new Date().toISOString()
      };
      
      if (seed.category) {
        categories.add(seed.category);
      }
      
      seeds.push(seed);
    }
    
    // Erstelle die finale Datenbankstruktur
    const database = {
      seeds,
      categories: Array.from(categories).sort(),
      totalCount: seeds.length,
      lastUpdated: new Date().toISOString()
    };
    
    // Speichere als JSON
    fs.writeFileSync(OUTPUT_FILE, JSON.stringify(database, null, 2));
    
    console.log(`✅ Konvertierung abgeschlossen!`);
    console.log(`📁 Ausgabedatei: ${OUTPUT_FILE}`);
    console.log(`🌱 Samen: ${seeds.length}`);
    console.log(`📂 Kategorien: ${categories.size}`);
    
  } catch (error) {
    console.error('❌ Fehler bei der Konvertierung:', error.message);
    process.exit(1);
  }
}

// Hilfsfunktionen
function generateId(name) {
  if (!name) return `seed-${Date.now()}-${Math.random().toString(36).substr(2, 9)}`;
  return String(name)
    .toLowerCase()
    .replace(/[^a-z0-9]/g, '-')
    .replace(/-+/g, '-')
    .replace(/^-|-$/g, '');
}

function parseNumber(value) {
  if (!value) return undefined;
  const num = parseFloat(value);
  return isNaN(num) ? undefined : num;
}

function parseTemperature(value) {
  if (!value) return undefined;
  const str = String(value).toLowerCase();
  const match = str.match(/(\d+)[^\d]*(\d+)/);
  if (match) {
    return {
      min: parseInt(match[1]),
      max: parseInt(match[2])
    };
  }
  return undefined;
}

function parseHumidity(value) {
  if (!value) return undefined;
  const str = String(value).toLowerCase();
  const match = str.match(/(\d+)[^\d]*(\d+)/);
  if (match) {
    return {
      min: parseInt(match[1]),
      max: parseInt(match[2])
    };
  }
  return undefined;
}

function parseLightRequirements(value) {
  if (!value) return undefined;
  const str = String(value).toLowerCase();
  if (str.includes('niedrig') || str.includes('low')) return 'low';
  if (str.includes('mittel') || str.includes('medium')) return 'medium';
  if (str.includes('hoch') || str.includes('high')) return 'high';
  return undefined;
}

function parseWaterRequirements(value) {
  if (!value) return undefined;
  const str = String(value).toLowerCase();
  if (str.includes('niedrig') || str.includes('low')) return 'low';
  if (str.includes('mittel') || str.includes('medium')) return 'medium';
  if (str.includes('hoch') || str.includes('high')) return 'high';
  return undefined;
}

function parsePH(value) {
  if (!value) return undefined;
  const str = String(value).toLowerCase();
  const match = str.match(/(\d+\.?\d*)[^\d]*(\d+\.?\d*)/);
  if (match) {
    return {
      min: parseFloat(match[1]),
      max: parseFloat(match[2])
    };
  }
  return undefined;
}

function parseTags(value) {
  if (!value) return [];
  return String(value).split(',').map(tag => tag.trim()).filter(tag => tag);
}

function parseCannabisTags(heritage, feminized, thc, cbd) {
  const tags = [];
  
  if (heritage) {
    tags.push(`Heritage: ${heritage}`);
  }
  
  if (feminized) {
    tags.push(feminized === 'Yes' ? 'Feminisiert' : 'Regulär');
  }
  
  if (thc) {
    tags.push(`THC: ${thc}%`);
  }
  
  if (cbd) {
    tags.push(`CBD: ${cbd}%`);
  }
  
  return tags;
}

// Führe die Konvertierung aus
convertXlsxToJson();
