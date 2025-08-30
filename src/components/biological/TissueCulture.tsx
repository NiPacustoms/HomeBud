'use client'

import React, { useState } from 'react'
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/Card'
import { Button } from '@/components/ui/button'
import { Input } from '@/components/ui/input'
import { Label } from '@/components/ui/label'
import { Textarea } from '@/components/ui/textarea'
import { Badge } from '@/components/ui/badge'
// import { Progress } from '@/components/ui/progress'
import { Checkbox } from '@/components/ui/checkbox'
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs'
import { 
  Beaker as Flask, 
  Scissors, 
  Droplets, 
  CheckCircle, 
  Clock
} from 'lucide-react'

interface CloneData {
  id: string
  strainName: string
  startDate: string
  status: 'preparing' | 'in-gel' | 'rooting' | 'transplanted' | 'acclimated' | 'completed'
  notes: string
  photos: string[]
  rootLength?: number
  leafCount?: number
  lastCheck: string
}

interface ChecklistItem {
  id: string
  text: string
  completed: boolean
  category: 'preparation' | 'sterilization' | 'maintenance'
}

export default function TissueCulture() {
  const [clones, setClones] = useState<CloneData[]>([])
  // const [currentStep, setCurrentStep] = useState(1)
  const [checklist, setChecklist] = useState<ChecklistItem[]>([
    { id: '1', text: 'Hände gewaschen & desinfiziert', completed: false, category: 'preparation' },
    { id: '2', text: 'Arbeitsplatz gereinigt, Flächen mit Alkohol besprüht', completed: false, category: 'preparation' },
    { id: '3', text: 'Utensilien (Messer, Pinzette) vorab in kochendem Wasser ausgekocht', completed: false, category: 'sterilization' },
    { id: '4', text: 'Einweg-Handschuhe getragen', completed: false, category: 'sterilization' },
    { id: '5', text: 'Gläser/Becher und Deckel mit heißem Wasser vorgewärmt', completed: false, category: 'sterilization' },
    { id: '6', text: 'Klon-Gel gemäß Packungsanweisung vorbereitet', completed: false, category: 'preparation' },
    { id: '7', text: 'Stecklinge 30s in 70% Ethanol desinfiziert', completed: false, category: 'sterilization' },
    { id: '8', text: 'Stecklinge senkrecht 1-2cm tief ins Gel gedrückt', completed: false, category: 'preparation' },
    { id: '9', text: 'Gläser bei 20-24°C und indirektem Licht platziert', completed: false, category: 'maintenance' },
    { id: '10', text: 'Täglich 1x kurz lüften', completed: false, category: 'maintenance' }
  ])

  const [newClone, setNewClone] = useState({
    strainName: '',
    notes: ''
  })

  const steps = [
    { id: 1, title: 'Vorbereitung', description: 'Materialien und Arbeitsplatz vorbereiten' },
    { id: 2, title: 'Stecklinge entnehmen', description: 'Gesunde Triebe schneiden und vorbereiten' },
    { id: 3, title: 'Desinfektion', description: 'Sterile Behandlung der Stecklinge' },
    { id: 4, title: 'Einsetzen', description: 'Stecklinge ins Klon-Gel setzen' },
    { id: 5, title: 'Pflege & Monitoring', description: 'Tägliche Kontrolle und Pflege' }
  ]

  const addClone = () => {
    if (!newClone.strainName.trim()) return

    const clone: CloneData = {
      id: Date.now().toString(),
      strainName: newClone.strainName,
      startDate: new Date().toISOString().split('T')[0] || new Date().toISOString(),
      status: 'preparing',
      notes: newClone.notes,
      photos: [],
      lastCheck: new Date().toISOString().split('T')[0] || new Date().toISOString()
    }

    setClones([...clones, clone])
    setNewClone({ strainName: '', notes: '' })
  }

  const updateCloneStatus = (cloneId: string, status: CloneData['status']) => {
    setClones(clones.map(clone => 
      clone.id === cloneId 
        ? { ...clone, status, lastCheck: new Date().toISOString().split('T')[0] || new Date().toISOString() }
        : clone
    ))
  }

  const toggleChecklistItem = (itemId: string) => {
    setChecklist(checklist.map(item =>
      item.id === itemId ? { ...item, completed: !item.completed } : item
    ))
  }

  const getStatusColor = (status: CloneData['status']) => {
    switch (status) {
      case 'preparing': return 'bg-yellow-100 text-yellow-800'
      case 'in-gel': return 'bg-blue-100 text-blue-800'
      case 'rooting': return 'bg-green-100 text-green-800'
      case 'transplanted': return 'bg-purple-100 text-purple-800'
      case 'acclimated': return 'bg-indigo-100 text-indigo-800'
      case 'completed': return 'bg-gray-100 text-gray-800'
      default: return 'bg-gray-100 text-gray-800'
    }
  }

  const getStatusText = (status: CloneData['status']) => {
    switch (status) {
      case 'preparing': return 'Vorbereitung'
      case 'in-gel': return 'Im Klon-Gel'
      case 'rooting': return 'Wurzelbildung'
      case 'transplanted': return 'Umgepflanzt'
      case 'acclimated': return 'Akklimatisiert'
      case 'completed': return 'Abgeschlossen'
      default: return 'Unbekannt'
    }
  }

  return (
    <div className="container mx-auto p-6 space-y-6">
      {/* Header */}
      <div className="text-center space-y-4">
        <h1 className="text-4xl font-bold text-green-800">
          <Flask className="inline-block mr-3 h-10 w-10" />
          Tissue Culture & Wurzel-Optimierung
        </h1>
        <p className="text-lg text-gray-600 max-w-3xl mx-auto">
          Geführtes In-vitro-Stecklingsprotokoll mit haushaltsüblichen Hilfsmitteln.
          Einfache sterile Checklisten ohne Profi-Laborgerät.
        </p>
      </div>

      <Tabs defaultValue="overview" className="space-y-6">
        <TabsList className="grid w-full grid-cols-4">
          <TabsTrigger value="overview">Überblick</TabsTrigger>
          <TabsTrigger value="protocol">Protokoll</TabsTrigger>
          <TabsTrigger value="clones">Klon-Archiv</TabsTrigger>
          <TabsTrigger value="checklist">Checkliste</TabsTrigger>
        </TabsList>

        {/* Überblick */}
        <TabsContent value="overview" className="space-y-6">
          <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-6">
            <Card>
              <CardHeader>
                <CardTitle className="flex items-center gap-2">
                  <Scissors className="h-5 w-5" />
                  Hauptfunktionen
                </CardTitle>
              </CardHeader>
              <CardContent className="space-y-3">
                <div className="flex items-start gap-2">
                  <CheckCircle className="h-4 w-4 text-green-600 mt-0.5" />
                  <span>Geführtes In-vitro-Stecklingsprotokoll</span>
                </div>
                <div className="flex items-start gap-2">
                  <CheckCircle className="h-4 w-4 text-green-600 mt-0.5" />
                  <span>Einfache sterile Checklisten</span>
                </div>
                <div className="flex items-start gap-2">
                  <CheckCircle className="h-4 w-4 text-green-600 mt-0.5" />
                  <span>Digitale Klon-Akten mit Status-Tracking</span>
                </div>
                <div className="flex items-start gap-2">
                  <CheckCircle className="h-4 w-4 text-green-600 mt-0.5" />
                  <span>Monitoring und Erinnerungen</span>
                </div>
              </CardContent>
            </Card>

            <Card>
              <CardHeader>
                <CardTitle className="flex items-center gap-2">
                  <Droplets className="h-5 w-5" />
                  Benötigte Materialien
                </CardTitle>
              </CardHeader>
              <CardContent className="space-y-2">
                <div>• Reiniger, Hand-Seife, Desinfektions-Spray (70% Ethanol)</div>
                <div>• Sterile Einmalhandschuhe, Pflaster- oder Frischhaltefolie</div>
                <div>• Kleine durchsichtige Einmachgläser oder Sterilbecher</div>
                <div>• Gekauftes Klon-Gel (mit Soja-Peptonen, Zucker, Agar)</div>
                <div>• Saubere Arbeitsfläche</div>
              </CardContent>
            </Card>

            <Card>
              <CardHeader>
                <CardTitle className="flex items-center gap-2">
                  <Clock className="h-5 w-5" />
                  Zeitplan
                </CardTitle>
              </CardHeader>
              <CardContent className="space-y-2">
                <div>• <strong>Tag 1-7:</strong> Vorbereitung und Einsetzen</div>
                <div>• <strong>Tag 7-10:</strong> Erste Wurzeln sichtbar</div>
                <div>• <strong>Tag 10-15:</strong> Umpflanzen</div>
                <div>• <strong>Tag 15-22:</strong> Akklimatisierung</div>
              </CardContent>
            </Card>
          </div>
        </TabsContent>

        {/* Protokoll */}
        <TabsContent value="protocol" className="space-y-6">
          <Card>
            <CardHeader>
              <CardTitle>Schritt-für-Schritt-Anleitung</CardTitle>
              <CardDescription>
                Vereinfachte In-vitro-Vermehrung mit haushaltsüblichen Hilfsmitteln
              </CardDescription>
            </CardHeader>
            <CardContent>
              <div className="space-y-6">
                {steps.map((step) => (
                  <div key={step.id} className="border-l-4 border-green-500 pl-4">
                    <h3 className="text-lg font-semibold mb-2">
                      Schritt {step.id}: {step.title}
                    </h3>
                    <p className="text-gray-600 mb-3">{step.description}</p>
                    
                    {step.id === 1 && (
                      <div className="bg-gray-50 p-4 rounded-lg space-y-2">
                        <h4 className="font-medium">Vorbereitung:</h4>
                        <ul className="list-disc list-inside space-y-1 text-sm">
                          <li>Reiniger, Hand-Seife, Desinfektions-Spray (70% Ethanol)</li>
                          <li>Sterile Einmalhandschuhe, Pflaster- oder Frischhaltefolie</li>
                          <li>Kleine durchsichtige Einmachgläser oder Sterilbecher</li>
                          <li>Nährmedium-Alternative: gekauftes Klon-Gel</li>
                        </ul>
                      </div>
                    )}

                    {step.id === 2 && (
                      <div className="bg-gray-50 p-4 rounded-lg space-y-2">
                        <h4 className="font-medium">Entnahme von Stecklingen:</h4>
                        <ul className="list-disc list-inside space-y-1 text-sm">
                          <li>Saubere Hände, Handschuhe, Sprühdesinfektion am Arbeitsplatz</li>
                          <li>2–3 cm lange Spitze eines gesunden Triebs abschneiden</li>
                          <li>Blattreste entfernen, nur 2–3 Blätter belassen</li>
                        </ul>
                      </div>
                    )}

                    {step.id === 3 && (
                      <div className="bg-gray-50 p-4 rounded-lg space-y-2">
                        <h4 className="font-medium">Desinfektion:</h4>
                        <ul className="list-disc list-inside space-y-1 text-sm">
                          <li>Stecklinge 30 s in 70% Ethanol tauchen, dann abtropfen lassen</li>
                          <li>Mit sterilisiertem Filterpapier kurz abtupfen</li>
                        </ul>
                      </div>
                    )}

                    {step.id === 4 && (
                      <div className="bg-gray-50 p-4 rounded-lg space-y-2">
                        <h4 className="font-medium">Einsetzen in das Klon-Gel:</h4>
                        <ul className="list-disc list-inside space-y-1 text-sm">
                          <li>Stecklinge senkrecht 1–2 cm tief ins Gel drücken</li>
                          <li>Beschriften mit Datum und Sorte (etikettierbares Klebeband)</li>
                        </ul>
                      </div>
                    )}

                    {step.id === 5 && (
                      <div className="bg-gray-50 p-4 rounded-lg space-y-2">
                        <h4 className="font-medium">Keimung & Pflege:</h4>
                        <ul className="list-disc list-inside space-y-1 text-sm">
                          <li>Gläser bei Zimmertemperatur (20–24 °C) und indirektem Tageslicht platzieren</li>
                          <li>Leicht gelüftete Abdeckung, täglich 1× kurz lüften</li>
                          <li>Nach 7–10 Tagen erste Wurzeln sichtbar</li>
                        </ul>
                      </div>
                    )}
                  </div>
                ))}
              </div>
            </CardContent>
          </Card>
        </TabsContent>

        {/* Klon-Archiv */}
        <TabsContent value="clones" className="space-y-6">
          <Card>
            <CardHeader>
              <CardTitle>Neuen Klon hinzufügen</CardTitle>
            </CardHeader>
            <CardContent>
              <div className="grid md:grid-cols-2 gap-4">
                <div>
                  <Label htmlFor="strainName">Sortenname</Label>
                  <Input
                    id="strainName"
                    value={newClone.strainName}
                    onChange={(e) => setNewClone({...newClone, strainName: e.target.value})}
                    placeholder="z.B. Northern Lights"
                  />
                </div>
                <div>
                  <Label htmlFor="notes">Notizen</Label>
                  <Textarea
                    id="notes"
                    value={newClone.notes}
                    onChange={(e) => setNewClone({...newClone, notes: e.target.value})}
                    placeholder="Besonderheiten, Hinweise..."
                  />
                </div>
              </div>
              <Button onClick={addClone} className="mt-4">
                Klon hinzufügen
              </Button>
            </CardContent>
          </Card>

          <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-4">
            {clones.map((clone) => (
              <Card key={clone.id}>
                <CardHeader>
                  <div className="flex justify-between items-start">
                    <div>
                      <CardTitle className="text-lg">{clone.strainName}</CardTitle>
                      <CardDescription>Start: {clone.startDate}</CardDescription>
                    </div>
                    <Badge className={getStatusColor(clone.status)}>
                      {getStatusText(clone.status)}
                    </Badge>
                  </div>
                </CardHeader>
                <CardContent className="space-y-4">
                  {clone.notes && (
                    <p className="text-sm text-gray-600">{clone.notes}</p>
                  )}
                  
                  <div className="space-y-2">
                    <Label>Status ändern:</Label>
                    <div className="flex flex-wrap gap-1">
                      {['preparing', 'in-gel', 'rooting', 'transplanted', 'acclimated', 'completed'].map((status) => (
                        <Button
                          key={status}
                          size="sm"
                          variant={clone.status === status ? "default" : "outline"}
                          onClick={() => updateCloneStatus(clone.id, status as CloneData['status'])}
                        >
                          {getStatusText(status as CloneData['status'])}
                        </Button>
                      ))}
                    </div>
                  </div>

                  <div className="text-xs text-gray-500">
                    Letzte Kontrolle: {clone.lastCheck}
                  </div>
                </CardContent>
              </Card>
            ))}
          </div>
        </TabsContent>

        {/* Checkliste */}
        <TabsContent value="checklist" className="space-y-6">
          <Card>
            <CardHeader>
              <CardTitle>Sterile Checkliste (Homegrow-Tauglich)</CardTitle>
              <CardDescription>
                Alle Punkte müssen vor Beginn der Tissue Culture abgehakt werden
              </CardDescription>
            </CardHeader>
            <CardContent>
              <div className="space-y-4">
                {checklist.map((item) => (
                  <div key={item.id} className="flex items-center space-x-3">
                    <Checkbox
                      id={item.id}
                      checked={item.completed}
                      onChange={() => toggleChecklistItem(item.id)}
                    />
                    <Label
                      htmlFor={item.id}
                      className={`text-sm ${item.completed ? 'line-through text-gray-500' : ''}`}
                    >
                      {item.text}
                    </Label>
                  </div>
                ))}
              </div>

              <div className="mt-6 p-4 bg-blue-50 rounded-lg">
                <h4 className="font-medium text-blue-900 mb-2">Erinnerungen:</h4>
                <ul className="text-sm text-blue-800 space-y-1">
                  <li>• 7 Tage Wurzelkontrolle</li>
                  <li>• 5 Tage Akklimatisierung</li>
                  <li>• Alle 14 Tage Substrat-Feuchtigkeitscheck</li>
                </ul>
              </div>
            </CardContent>
          </Card>
        </TabsContent>
      </Tabs>

      {/* Footer */}
      <div className="text-center text-gray-500 text-sm">
        <p>&copy; 2024 HomeBud. Tissue Culture Module - Professionelle Pflanzenvermehrung mit haushaltsüblichen Hilfsmitteln.</p>
      </div>
    </div>
  )
}
