import { GoogleGenerativeAI } from '@google/generative-ai';

// Gemini API Key aus Umgebungsvariablen
const GEMINI_API_KEY = process.env.NEXT_PUBLIC_GEMINI_API_KEY || '';

if (!GEMINI_API_KEY) {
  console.warn('Gemini API Key nicht gefunden. Bitte setzen Sie NEXT_PUBLIC_GEMINI_API_KEY in Ihrer .env.local Datei.');
}

const genAI = new GoogleGenerativeAI(GEMINI_API_KEY);

export interface GeminiAnalysisResult {
  primaryIssue: string;
  severity: 'low' | 'medium' | 'high' | 'critical';
  overallHealth: number;
  confidence: number;
  nutrientDeficiencies: Array<{
    type: string;
    severity: 'low' | 'medium' | 'high';
    confidence: number;
    symptoms: string[];
    recommendations: string[];
  }>;
  pestInfestations: Array<{
    type: string;
    severity: 'low' | 'medium' | 'high';
    confidence: number;
    symptoms: string[];
    treatment: string[];
  }>;
  diseaseInfections: Array<{
    type: string;
    severity: 'low' | 'medium' | 'high';
    confidence: number;
    symptoms: string[];
    treatment: string[];
  }>;
  environmentalIssues: Array<{
    type: string;
    severity: 'low' | 'medium' | 'high';
    confidence: number;
    symptoms: string[];
    recommendations: string[];
  }>;
  immediateActions: string[];
  shortTermActions: string[];
  longTermActions: string[];
}

export interface GeminiSymptomAnalysis {
  primaryIssue: string;
  severity: 'low' | 'medium' | 'high' | 'critical';
  confidence: number;
  possibleCauses: string[];
  immediateActions: string[];
  shortTermActions: string[];
  longTermActions: string[];
  preventionMeasures: string[];
}

export interface GeminiTreatmentPlan {
  steps: Array<{
    id: string;
    title: string;
    description: string;
    priority: 'immediate' | 'high' | 'medium' | 'low';
    estimatedDuration: string;
    materials: string[];
    successIndicators: string[];
  }>;
  totalDuration: string;
  difficulty: 'easy' | 'medium' | 'hard';
  cost: 'low' | 'medium' | 'high';
}

export class GeminiDiagnosisService {
  
  // Bild zu Base64 konvertieren
  static async convertImageToBase64(file: File): Promise<string> {
    return new Promise((resolve, reject) => {
      const reader = new FileReader();
      reader.onload = () => {
        const result = reader.result as string;
        // Entferne den "data:image/jpeg;base64," Prefix
        const base64 = result.split(',')[1];
        resolve(base64);
      };
      reader.onerror = reject;
      reader.readAsDataURL(file);
    });
  }

  // Gemini Pro Vision für Bildanalyse
  static async analyzePlantImage(
    imageBase64: string, 
    additionalContext: string = ''
  ): Promise<GeminiAnalysisResult> {
    if (!GEMINI_API_KEY) {
      throw new Error('Gemini API Key nicht konfiguriert');
    }

    const model = genAI.getGenerativeModel({ model: 'gemini-pro-vision' });
    
    const prompt = `
    Analysiere dieses Pflanzenbild als professioneller Pflanzenexperte und identifiziere alle Probleme:

    Zusätzliche Informationen: ${additionalContext}

    Führe eine umfassende Analyse durch:

    1. NÄHRSTOFFMÄNGEL:
    - Stickstoff (N): Gelbliche Blätter, langsames Wachstum
    - Phosphor (P): Dunkle Blätter, verzögertes Wachstum
    - Kalium (K): Blattrandnekrosen, schwache Stängel
    - Magnesium (Mg): Intervenöse Chlorose
    - Eisen (Fe): Junge Blätter werden gelb
    - Calcium (Ca): Verformte Blätter
    - Zink (Zn): Kleine Blätter, Zwergwuchs
    - Mangan (Mn): Intervenöse Chlorose

    2. SCHÄDLINGSBEfall:
    - Spinnmilben: Feine Netze, gelbe Punkte
    - Thripse: Silbrige Flecken, deformierte Blätter
    - Weiße Fliegen: Weiße Insekten, Honigtau
    - Blattläuse: Grüne/braune Insekten, gekräuselte Blätter
    - Schildläuse: Braune Schildchen, Honigtau

    3. KRANKHEITEN:
    - Mehltau: Weißer Belag auf Blättern
    - Botrytis: Graue Schimmel, weiche Stellen
    - Wurzelfäule: Welke Blätter, braune Wurzeln
    - Blattflecken: Braune/schwarze Flecken
    - Fusarium: Welke, gelbe Blätter

    4. UMWELTPROBLEME:
    - Überbewässerung: Welke Blätter, feuchter Boden
    - Unterbewässerung: Trockene, brüchige Blätter
    - Hitzestress: Verbrannte Blattränder
    - Kältestress: Dunkle, schlaffe Blätter
    - Lichtverbrennung: Weiße/braune Flecken

    Antworte NUR in diesem JSON-Format:
    {
      "primaryIssue": "Problem-Name",
      "severity": "leicht/mittel/stark/kritisch",
      "overallHealth": 75,
      "confidence": 85,
      "nutrientDeficiencies": [
        {
          "type": "nitrogen",
          "severity": "medium",
          "confidence": 87,
          "symptoms": ["Gelbliche Blätter", "Langsames Wachstum"],
          "recommendations": ["Stickstoffhaltigen Dünger hinzufügen"]
        }
      ],
      "pestInfestations": [],
      "diseaseInfections": [],
      "environmentalIssues": [],
      "immediateActions": ["Sofortmaßnahme 1"],
      "shortTermActions": ["Kurzfristige Maßnahme 1"],
      "longTermActions": ["Langfristige Maßnahme 1"]
    }
    `;
    
    try {
      const result = await model.generateContent([
        prompt,
        {
          inlineData: {
            mimeType: 'image/jpeg',
            data: imageBase64
          }
        }
      ]);
      
      const response = await result.response;
      const analysis = this.parseGeminiResponse(response.text());
      
      return analysis as GeminiAnalysisResult;
      
    } catch (error) {
      console.error('Gemini Bildanalyse Fehler:', error);
      throw new Error('Bildanalyse fehlgeschlagen. Bitte versuchen Sie es erneut.');
    }
  }
  
  // Gemini Pro für Symptom-Analyse
  static async analyzeSymptoms(
    symptoms: string, 
    growthStage: string, 
    environmentalData: any = {}
  ): Promise<GeminiSymptomAnalysis> {
    if (!GEMINI_API_KEY) {
      throw new Error('Gemini API Key nicht konfiguriert');
    }

    const model = genAI.getGenerativeModel({ model: 'gemini-pro' });
    
    const prompt = `
    Als erfahrener Pflanzenexperte analysiere diese Symptome:

    SYMPTOME: ${symptoms}
    WACHSTUMSPHASE: ${growthStage}
    UMWELTDATEN: ${JSON.stringify(environmentalData)}

    Identifiziere mögliche Probleme basierend auf:

    1. Nährstoffmängel-Symptome
    2. Schädlings-Symptome
    3. Krankheits-Symptome
    4. Umwelt-Stress-Symptome

    Berücksichtige die Wachstumsphase und Umweltbedingungen.

    Antworte NUR in diesem JSON-Format:
    {
      "primaryIssue": "Problem-Name",
      "severity": "leicht/mittel/stark/kritisch",
      "confidence": 85,
      "possibleCauses": ["Ursache 1", "Ursache 2"],
      "immediateActions": ["Sofortmaßnahme 1"],
      "shortTermActions": ["Kurzfristige Maßnahme 1"],
      "longTermActions": ["Langfristige Maßnahme 1"],
      "preventionMeasures": ["Präventionsmaßnahme 1"]
    }
    `;
    
    try {
      const result = await model.generateContent(prompt);
      const response = await result.response;
      const analysis = this.parseGeminiResponse(response.text());
      
      return analysis as GeminiSymptomAnalysis;
      
    } catch (error) {
      console.error('Gemini Symptom-Analyse Fehler:', error);
      throw new Error('Symptom-Analyse fehlgeschlagen. Bitte versuchen Sie es erneut.');
    }
  }
  
  // Gemini für Behandlungsplan-Generierung
  static async generateTreatmentPlan(
    diagnosis: any, 
    plantType: string, 
    growMethod: string
  ): Promise<GeminiTreatmentPlan> {
    if (!GEMINI_API_KEY) {
      throw new Error('Gemini API Key nicht konfiguriert');
    }

    const model = genAI.getGenerativeModel({ model: 'gemini-pro' });
    
    const prompt = `
    Erstelle einen detaillierten Behandlungsplan für diese Pflanzen-Diagnose:

    DIAGNOSE: ${JSON.stringify(diagnosis)}
    PFLANZENTYP: ${plantType}
    ANBAUMETHODE: ${growMethod}

    Erstelle einen strukturierten Behandlungsplan mit:

    1. Sofortmaßnahmen (Priorität: Sofort, Dauer: 1-2 Stunden)
    2. Kurzfristige Maßnahmen (Priorität: Hoch, Dauer: 1-2 Tage)
    3. Mittelfristige Maßnahmen (Priorität: Mittel, Dauer: 1 Woche)
    4. Langfristige Maßnahmen (Priorität: Niedrig, Dauer: 1 Monat)

    Für jeden Schritt:
    - Titel
    - Beschreibung
    - Benötigte Materialien
    - Zeitaufwand
    - Erfolgsindikatoren

    Antworte NUR in diesem JSON-Format:
    {
      "steps": [
        {
          "id": "step-1",
          "title": "Schritt-Titel",
          "description": "Detaillierte Beschreibung",
          "priority": "sofort/hoch/mittel/niedrig",
          "estimatedDuration": "30 Minuten",
          "materials": ["Material 1", "Material 2"],
          "successIndicators": ["Indikator 1", "Indikator 2"]
        }
      ],
      "totalDuration": "2 Wochen",
      "difficulty": "einfach/mittel/schwer",
      "cost": "niedrig/mittel/hoch"
    }
    `;
    
    try {
      const result = await model.generateContent(prompt);
      const response = await result.response;
      const plan = this.parseGeminiResponse(response.text());
      
      return plan as GeminiTreatmentPlan;
      
    } catch (error) {
      console.error('Gemini Behandlungsplan-Generierung Fehler:', error);
      throw new Error('Behandlungsplan-Generierung fehlgeschlagen.');
    }
  }
  
  // Gemini für Follow-up Analyse
  static async analyzeProgress(
    beforeImageBase64: string, 
    afterImageBase64: string, 
    treatmentPlan: any
  ): Promise<any> {
    if (!GEMINI_API_KEY) {
      throw new Error('Gemini API Key nicht konfiguriert');
    }

    const model = genAI.getGenerativeModel({ model: 'gemini-pro-vision' });
    
    const prompt = `
    Vergleiche diese beiden Pflanzenbilder (vor und nach der Behandlung):

    BEHANDLUNGSPLAN: ${JSON.stringify(treatmentPlan)}

    Analysiere:
    1. Verbesserungen (sichtbare positive Veränderungen)
    2. Verbleibende Probleme
    3. Neue Probleme
    4. Behandlungsempfehlungen
    5. Erfolgsrate (0-100%)

    Antworte NUR in diesem JSON-Format:
    {
      "improvements": ["Verbesserung 1"],
      "remainingIssues": ["Problem 1"],
      "newIssues": ["Neues Problem 1"],
      "recommendations": ["Empfehlung 1"],
      "successRate": 75
    }
    `;
    
    try {
      const result = await model.generateContent([
        prompt,
        {
          inlineData: {
            mimeType: 'image/jpeg',
            data: beforeImageBase64
          }
        },
        {
          inlineData: {
            mimeType: 'image/jpeg',
            data: afterImageBase64
          }
        }
      ]);
      
      const response = await result.response;
      const analysis = this.parseGeminiResponse(response.text());
      
      return analysis;
      
    } catch (error) {
      console.error('Gemini Fortschritts-Analyse Fehler:', error);
      throw new Error('Fortschritts-Analyse fehlgeschlagen.');
    }
  }
  
  // Intelligente Follow-up Fragen
  static async generateFollowUpQuestions(diagnosis: any): Promise<string[]> {
    if (!GEMINI_API_KEY) {
      throw new Error('Gemini API Key nicht konfiguriert');
    }

    const model = genAI.getGenerativeModel({ model: 'gemini-pro' });
    
    const prompt = `
    Basierend auf dieser Diagnose: ${JSON.stringify(diagnosis)}
    
    Generiere 3-5 spezifische Follow-up Fragen, um die Diagnose zu verfeinern:
    - Fragen zu spezifischen Symptomen
    - Umweltbedingungen
    - Behandlungsverlauf
    - Präventionsmaßnahmen
    
    Antworte NUR in diesem JSON-Format: { "questions": ["Frage 1", "Frage 2"] }
    `;
    
    try {
      const result = await model.generateContent(prompt);
      const response = await result.response;
      const parsed = this.parseGeminiResponse(response.text());
      
      return parsed.questions || [];
      
    } catch (error) {
      console.error('Gemini Follow-up Fragen Fehler:', error);
      return [];
    }
  }
  
  // Personalisierte Empfehlungen
  static async generatePersonalizedRecommendations(
    diagnosis: any, 
    userProfile: any
  ): Promise<any> {
    if (!GEMINI_API_KEY) {
      throw new Error('Gemini API Key nicht konfiguriert');
    }

    const model = genAI.getGenerativeModel({ model: 'gemini-pro' });
    
    const prompt = `
    Erstelle personalisierte Empfehlungen für:
    
    DIAGNOSE: ${JSON.stringify(diagnosis)}
    BENUTZER-PROFIL: ${JSON.stringify(userProfile)}
    
    Berücksichtige:
    - Erfahrungslevel
    - Verfügbare Zeit
    - Budget
    - Anbaumethode
    - Verfügbare Materialien
    
    Antworte NUR in diesem JSON-Format:
    {
      "personalizedActions": ["Aktion 1"],
      "timeOptimized": ["Optimierung 1"],
      "budgetFriendly": ["Budget-Option 1"],
      "beginnerFriendly": ["Anfänger-Tipp 1"]
    }
    `;
    
    try {
      const result = await model.generateContent(prompt);
      const response = await result.response;
      const recommendations = this.parseGeminiResponse(response.text());
      
      return recommendations;
      
    } catch (error) {
      console.error('Gemini personalisierte Empfehlungen Fehler:', error);
      throw new Error('Personalisierte Empfehlungen fehlgeschlagen.');
    }
  }
  
  // Response Parser
  static parseGeminiResponse(response: string): any {
    try {
      // Versuche JSON zu parsen
      const jsonMatch = response.match(/\{[\s\S]*\}/);
      if (jsonMatch) {
        return JSON.parse(jsonMatch[0]);
      }
      
      // Fallback: Strukturierte Text-Analyse
      return this.parseStructuredText(response);
      
    } catch (error) {
      console.error('Gemini Response Parsing Fehler:', error);
      return this.parseStructuredText(response);
    }
  }
  
  static parseStructuredText(text: string): any {
    // Fallback-Parser für strukturierten Text
    const result = {
      primaryIssue: 'Unbekanntes Problem',
      severity: 'medium' as const,
      overallHealth: 75,
      confidence: 60,
      symptoms: [],
      immediateActions: ['Konsultieren Sie einen Pflanzenexperten'],
      shortTermActions: ['Überwachen Sie die Pflanze'],
      longTermActions: ['Verbessern Sie die Pflege-Routine']
    };
    
    // Einfache Text-Parsing-Logik
    const lowerText = text.toLowerCase();
    
    if (lowerText.includes('stickstoff') || lowerText.includes('nitrogen')) {
      result.primaryIssue = 'Stickstoffmangel';
      result.immediateActions = ['Stickstoffhaltigen Dünger hinzufügen'];
    }
    
    if (lowerText.includes('spinnmilben') || lowerText.includes('spider mite')) {
      result.primaryIssue = 'Spinnmilben-Befall';
      result.immediateActions = ['Betroffene Blätter entfernen', 'Neemöl anwenden'];
    }
    
    if (lowerText.includes('mehltau') || lowerText.includes('powdery mildew')) {
      result.primaryIssue = 'Mehltau';
      result.immediateActions = ['Luftzirkulation verbessern', 'Fungizid anwenden'];
    }
    
    if (lowerText.includes('überbewässerung') || lowerText.includes('overwatering')) {
      result.primaryIssue = 'Überbewässerung';
      result.immediateActions = ['Bewässerung reduzieren', 'Drainage verbessern'];
    }
    
    return result;
  }
  
  // API Key Validierung
  static async validateApiKey(): Promise<boolean> {
    if (!GEMINI_API_KEY) {
      return false;
    }
    
    try {
      const model = genAI.getGenerativeModel({ model: 'gemini-pro' });
      const result = await model.generateContent('Test');
      await result.response;
      return true;
    } catch (error) {
      console.error('Gemini API Key Validierung fehlgeschlagen:', error);
      return false;
    }
  }
}
