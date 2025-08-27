'use client';

import React, { useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';

interface GlossaryItem {
  term: string;
  definition: string;
  category: string;
  examples?: string[];
  relatedTerms?: string[];
}

interface FAQItem {
  question: string;
  answer: string;
  category: string;
  tags?: string[];
}

interface GlossaryFAQProps {
  glossary?: GlossaryItem[];
  faq?: FAQItem[];
  showSearch?: boolean;
  showCategories?: boolean;
}

const defaultGlossary: GlossaryItem[] = [
  {
    term: 'PPFD',
    definition: 'Photosynthetic Photon Flux Density - misst die Anzahl der Photosynthese-aktiven Photonen, die pro Sekunde auf eine Fläche von einem Quadratmeter fallen.',
    category: 'Licht',
    examples: ['200-400 μmol/m²/s für Sämlinge', '400-600 μmol/m²/s für vegetative Phase', '600-1000 μmol/m²/s für Blütephase'],
    relatedTerms: ['PAR', 'Lux', 'Lumen']
  },
  {
    term: 'VPD',
    definition: 'Vapor Pressure Deficit - beschreibt den Unterschied zwischen dem maximalen Wasserdampfgehalt der Luft und dem tatsächlichen Wasserdampfgehalt.',
    category: 'Klima',
    examples: ['0.8-1.2 kPa für vegetative Phase', '1.2-1.6 kPa für Blütephase'],
    relatedTerms: ['Luftfeuchtigkeit', 'Temperatur', 'Taupunkt']
  },
  {
    term: 'pH-Wert',
    definition: 'Misst den Säure- oder Basengehalt einer Lösung auf einer Skala von 0 (sehr sauer) bis 14 (sehr basisch).',
    category: 'Nährstoffe',
    examples: ['5.5-6.5 für Cannabis in Erde', '5.8-6.2 für Hydrokultur'],
    relatedTerms: ['EC', 'PPM', 'Nährstoffaufnahme']
  },
  {
    term: 'EC',
    definition: 'Electrical Conductivity - misst die elektrische Leitfähigkeit einer Lösung und damit die Konzentration gelöster Salze.',
    category: 'Nährstoffe',
    examples: ['0.5-1.0 mS/cm für Sämlinge', '1.0-1.5 mS/cm für vegetative Phase', '1.5-2.0 mS/cm für Blütephase'],
    relatedTerms: ['PPM', 'TDS', 'Nährstoffkonzentration']
  },
  {
    term: 'CO2',
    definition: 'Kohlenstoffdioxid - ein essentielles Gas für die Photosynthese. Pflanzen benötigen CO2, um Zucker und andere organische Verbindungen zu produzieren.',
    category: 'Klima',
    examples: ['400-800 ppm für normale Bedingungen', '800-1200 ppm für optimale Photosynthese'],
    relatedTerms: ['Photosynthese', 'Luftqualität', 'Belüftung']
  },
  {
    term: 'PAR',
    definition: 'Photosynthetically Active Radiation - der Teil des Lichtspektrums, der für die Photosynthese nutzbar ist (400-700 nm).',
    category: 'Licht',
    examples: ['Sonnenlicht enthält etwa 45% PAR', 'LED-Lampen können 90%+ PAR liefern'],
    relatedTerms: ['PPFD', 'Lichtspektrum', 'Photosynthese']
  },
  {
    term: 'DWC',
    definition: 'Deep Water Culture - eine Hydrokultur-Methode, bei der Pflanzenwurzeln in einer nährstoffreichen Lösung schwimmen.',
    category: 'Anbaumethoden',
    examples: ['Bubble Buckets', 'Recirculating DWC'],
    relatedTerms: ['Hydrokultur', 'NFT', 'Aeroponik']
  },
  {
    term: 'LST',
    definition: 'Low Stress Training - eine Technik zur Formung von Pflanzen durch sanftes Biegen und Binden von Ästen.',
    category: 'Training',
    examples: ['Biegen von Haupttrieben', 'Binden an Gitter'],
    relatedTerms: ['Topping', 'Fimming', 'SCROG']
  },
  {
    term: 'SCROG',
    definition: 'Screen of Green - eine Anbaumethode, bei der Pflanzen durch ein Netz geleitet werden, um eine gleichmäßige Kronenverteilung zu erreichen.',
    category: 'Training',
    examples: ['Netz in 30-50cm Höhe', 'Gleichmäßige Verteilung der Triebe'],
    relatedTerms: ['LST', 'Sog', 'Kronenmanagement']
  }
];

const defaultFAQ: FAQItem[] = [
  {
    question: 'Wie oft sollte ich meine Pflanzen messen?',
    answer: 'Für optimale Ergebnisse sollten Sie pH und EC täglich messen. Temperatur und Luftfeuchtigkeit können kontinuierlich überwacht werden. CO2 und Lichtintensität sollten wöchentlich überprüft werden.',
    category: 'Messung',
    tags: ['Häufigkeit', 'pH', 'EC', 'Temperatur']
  },
  {
    question: 'Was ist der ideale pH-Wert für Cannabis?',
    answer: 'Der ideale pH-Wert liegt zwischen 5.5 und 6.5. In Erde bevorzugen Cannabis-Pflanzen 6.0-6.5, in Hydrokultur 5.8-6.2. Außerhalb dieses Bereichs können Nährstoffmängel auftreten.',
    category: 'Nährstoffe',
    tags: ['pH', 'Nährstoffaufnahme', 'Mängel']
  },
  {
    question: 'Wie erkenne ich Nährstoffmängel?',
    answer: 'Nährstoffmängel zeigen sich durch Verfärbungen der Blätter. Stickstoffmangel: gelbe untere Blätter. Phosphormangel: dunkle, violette Blätter. Kaliummangel: braune Blattränder. Magnesiummangel: gelbe Blattadern.',
    category: 'Pflanzenpflege',
    tags: ['Mängel', 'Blattverfärbungen', 'Diagnose']
  },
  {
    question: 'Wann sollte ich die Beleuchtung umstellen?',
    answer: 'Für die vegetative Phase: 18-24 Stunden Licht pro Tag. Für die Blütephase: 12 Stunden Licht, 12 Stunden Dunkelheit. Die Umstellung sollte abrupt erfolgen.',
    category: 'Licht',
    tags: ['Beleuchtungsdauer', 'Vegetative Phase', 'Blütephase']
  },
  {
    question: 'Wie wichtig ist die Luftfeuchtigkeit?',
    answer: 'Sehr wichtig! In der vegetativen Phase: 60-70%. In der Blütephase: 40-50%. Zu hohe Luftfeuchtigkeit fördert Schimmel, zu niedrige verlangsamt das Wachstum.',
    category: 'Klima',
    tags: ['Luftfeuchtigkeit', 'Schimmel', 'Wachstum']
  },
  {
    question: 'Was ist der beste Weg, Schädlinge zu bekämpfen?',
    answer: 'Prävention ist am besten: Saubere Umgebung, regelmäßige Kontrollen, gute Belüftung. Bei Befall: Natürliche Mittel wie Neemöl oder Nützlinge. Chemische Mittel nur als letzte Option.',
    category: 'Pflanzenschutz',
    tags: ['Schädlinge', 'Prävention', 'Bekämpfung']
  }
];

export default function GlossaryFAQ({ 
  glossary = defaultGlossary, 
  faq = defaultFAQ,
  showSearch = true,
  showCategories = true 
}: GlossaryFAQProps) {
  const [activeTab, setActiveTab] = useState<'glossary' | 'faq'>('glossary');
  const [searchTerm, setSearchTerm] = useState('');
  const [selectedCategory, setSelectedCategory] = useState<string>('Alle');
  const [expandedItems, setExpandedItems] = useState<Set<string>>(new Set());

  const categories = ['Alle', ...Array.from(new Set([...glossary.map(g => g.category), ...faq.map(f => f.category)]))];

  const filteredGlossary = glossary.filter(item => {
    const matchesSearch = item.term.toLowerCase().includes(searchTerm.toLowerCase()) ||
                         item.definition.toLowerCase().includes(searchTerm.toLowerCase());
    const matchesCategory = selectedCategory === 'Alle' || item.category === selectedCategory;
    return matchesSearch && matchesCategory;
  });

  const filteredFAQ = faq.filter(item => {
    const matchesSearch = item.question.toLowerCase().includes(searchTerm.toLowerCase()) ||
                         item.answer.toLowerCase().includes(searchTerm.toLowerCase());
    const matchesCategory = selectedCategory === 'Alle' || item.category === selectedCategory;
    return matchesSearch && matchesCategory;
  });

  const toggleExpanded = (id: string) => {
    const newExpanded = new Set(expandedItems);
    if (newExpanded.has(id)) {
      newExpanded.delete(id);
    } else {
      newExpanded.add(id);
    }
    setExpandedItems(newExpanded);
  };

  return (
    <div className="bg-white rounded-lg shadow-lg p-6">
      <div className="flex items-center justify-between mb-6">
        <h2 className="text-2xl font-bold text-gray-900">Glossar & FAQ</h2>
        <div className="flex space-x-2">
          <button
            onClick={() => setActiveTab('glossary')}
            className={`px-4 py-2 rounded-lg font-medium transition-colors ${
              activeTab === 'glossary'
                ? 'bg-green-600 text-white'
                : 'bg-gray-100 text-gray-700 hover:bg-gray-200'
            }`}
          >
            Glossar
          </button>
          <button
            onClick={() => setActiveTab('faq')}
            className={`px-4 py-2 rounded-lg font-medium transition-colors ${
              activeTab === 'faq'
                ? 'bg-green-600 text-white'
                : 'bg-gray-100 text-gray-700 hover:bg-gray-200'
            }`}
          >
            FAQ
          </button>
        </div>
      </div>

      {showSearch && (
        <div className="mb-6">
          <input
            type="text"
            placeholder={`Suche in ${activeTab === 'glossary' ? 'Glossar' : 'FAQ'}...`}
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
            className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-green-500 focus:border-transparent"
          />
        </div>
      )}

      {showCategories && (
        <div className="mb-6">
          <div className="flex flex-wrap gap-2">
            {categories.map((category) => (
              <button
                key={category}
                onClick={() => setSelectedCategory(category)}
                className={`px-3 py-1 rounded-full text-sm font-medium transition-colors ${
                  selectedCategory === category
                    ? 'bg-green-600 text-white'
                    : 'bg-gray-100 text-gray-700 hover:bg-gray-200'
                }`}
              >
                {category}
              </button>
            ))}
          </div>
        </div>
      )}

      <AnimatePresence mode="wait">
        {activeTab === 'glossary' ? (
          <motion.div
            key="glossary"
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: -20 }}
            transition={{ duration: 0.2 }}
            className="space-y-4"
          >
            {filteredGlossary.length === 0 ? (
              <div className="text-center py-8">
                <p className="text-gray-600">Keine Begriffe gefunden.</p>
              </div>
            ) : (
              filteredGlossary.map((item) => (
                <motion.div
                  key={item.term}
                  initial={{ opacity: 0 }}
                  animate={{ opacity: 1 }}
                  className="border border-gray-200 rounded-lg p-4 hover:shadow-md transition-shadow"
                >
                  <div className="flex items-start justify-between">
                    <div className="flex-1">
                      <div className="flex items-center space-x-2 mb-2">
                        <h3 className="text-lg font-semibold text-gray-900">{item.term}</h3>
                        <span className="px-2 py-1 bg-blue-100 text-blue-800 rounded-full text-xs font-medium">
                          {item.category}
                        </span>
                      </div>
                      <p className="text-gray-700 mb-3">{item.definition}</p>
                      
                      <AnimatePresence>
                        {expandedItems.has(item.term) && (
                          <motion.div
                            initial={{ opacity: 0, height: 0 }}
                            animate={{ opacity: 1, height: 'auto' }}
                            exit={{ opacity: 0, height: 0 }}
                            transition={{ duration: 0.2 }}
                            className="space-y-3"
                          >
                            {item.examples && (
                              <div>
                                <h4 className="font-medium text-gray-900 mb-1">Beispiele:</h4>
                                <ul className="list-disc list-inside text-sm text-gray-600 space-y-1">
                                  {item.examples.map((example, index) => (
                                    <li key={index}>{example}</li>
                                  ))}
                                </ul>
                              </div>
                            )}
                            
                            {item.relatedTerms && (
                              <div>
                                <h4 className="font-medium text-gray-900 mb-1">Verwandte Begriffe:</h4>
                                <div className="flex flex-wrap gap-1">
                                  {item.relatedTerms.map((term) => (
                                    <span key={term} className="px-2 py-1 bg-gray-100 text-gray-700 rounded text-xs">
                                      {term}
                                    </span>
                                  ))}
                                </div>
                              </div>
                            )}
                          </motion.div>
                        )}
                      </AnimatePresence>
                    </div>
                    
                    <button
                      onClick={() => toggleExpanded(item.term)}
                      className="ml-4 text-gray-400 hover:text-gray-600 transition-colors"
                      aria-label="Details anzeigen/verstecken"
                      title="Details anzeigen/verstecken"
                    >
                      <svg className="w-5 h-5" fill="currentColor" viewBox="0 0 20 20">
                        <path fillRule="evenodd" d="M5.293 7.293a1 1 0 011.414 0L10 10.586l3.293-3.293a1 1 0 111.414 1.414l-4 4a1 1 0 01-1.414 0l-4-4a1 1 0 010-1.414z" clipRule="evenodd" />
                      </svg>
                    </button>
                  </div>
                </motion.div>
              ))
            )}
          </motion.div>
        ) : (
          <motion.div
            key="faq"
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: -20 }}
            transition={{ duration: 0.2 }}
            className="space-y-4"
          >
            {filteredFAQ.length === 0 ? (
              <div className="text-center py-8">
                <p className="text-gray-600">Keine FAQ gefunden.</p>
              </div>
            ) : (
              filteredFAQ.map((item) => (
                <motion.div
                  key={item.question}
                  initial={{ opacity: 0 }}
                  animate={{ opacity: 1 }}
                  className="border border-gray-200 rounded-lg p-4 hover:shadow-md transition-shadow"
                >
                  <div className="flex items-start justify-between">
                    <div className="flex-1">
                      <div className="flex items-center space-x-2 mb-2">
                        <h3 className="text-lg font-semibold text-gray-900">{item.question}</h3>
                        <span className="px-2 py-1 bg-green-100 text-green-800 rounded-full text-xs font-medium">
                          {item.category}
                        </span>
                      </div>
                      
                      <AnimatePresence>
                        {expandedItems.has(item.question) && (
                          <motion.div
                            initial={{ opacity: 0, height: 0 }}
                            animate={{ opacity: 1, height: 'auto' }}
                            exit={{ opacity: 0, height: 0 }}
                            transition={{ duration: 0.2 }}
                          >
                            <p className="text-gray-700 mb-3">{item.answer}</p>
                            
                            {item.tags && (
                              <div className="flex flex-wrap gap-1">
                                {item.tags.map((tag) => (
                                  <span key={tag} className="px-2 py-1 bg-gray-100 text-gray-700 rounded text-xs">
                                    #{tag}
                                  </span>
                                ))}
                              </div>
                            )}
                          </motion.div>
                        )}
                      </AnimatePresence>
                    </div>
                    
                    <button
                      onClick={() => toggleExpanded(item.question)}
                      className="ml-4 text-gray-400 hover:text-gray-600 transition-colors"
                      aria-label="Antwort anzeigen/verstecken"
                      title="Antwort anzeigen/verstecken"
                    >
                      <svg className="w-5 h-5" fill="currentColor" viewBox="0 0 20 20">
                        <path fillRule="evenodd" d="M5.293 7.293a1 1 0 011.414 0L10 10.586l3.293-3.293a1 1 0 111.414 1.414l-4 4a1 1 0 01-1.414 0l-4-4a1 1 0 010-1.414z" clipRule="evenodd" />
                      </svg>
                    </button>
                  </div>
                </motion.div>
              ))
            )}
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  );
}
