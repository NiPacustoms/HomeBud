'use client';

import React, { useState, useMemo } from 'react';
import { 
  Search, 
  Filter, 
  Calendar, 
  Tag, 
  Sprout, 
  Trash2, 
  Save,
  X,
  Mic,
  MicOff
} from 'lucide-react';

export interface Note {
  id: string;
  title: string;
  content: string;
  category: 'beobachtung' | 'problem' | 'erfolg';
  timestamp: Date;
  plantId?: string;
  plantName?: string;
  strainId?: string;
  strainName?: string;
  tags: string[];
  isVoiceNote?: boolean;
}

export const NotesManager: React.FC = () => {
  const [notes, setNotes] = useState<Note[]>([]);
  const [isRecording, setIsRecording] = useState(false);
  const [searchTerm, setSearchTerm] = useState('');
  const [selectedCategory, setSelectedCategory] = useState<string>('alle');
  const [selectedPlant, setSelectedPlant] = useState<string>('alle');
  const [showFilters, setShowFilters] = useState(false);
  
  const [newNote, setNewNote] = useState<{
    title: string;
    content: string;
    category: Note['category'];
    tags: string[];
    plantId?: string;
    plantName?: string;
    strainId?: string;
    strainName?: string;
  }>({
    title: '',
    content: '',
    category: 'beobachtung',
    tags: []
  });

  const plants = [
    { id: '1', name: 'Pflanze 1', strain: 'OG Kush' },
    { id: '2', name: 'Pflanze 2', strain: 'White Widow' },
    { id: '3', name: 'Pflanze 3', strain: 'Blue Dream' }
  ];

  const strains = [
    { id: '1', name: 'OG Kush' },
    { id: '2', name: 'White Widow' },
    { id: '3', name: 'Blue Dream' },
    { id: '4', name: 'Northern Lights' }
  ];

  const categories = [
    { id: 'beobachtung', name: 'Beobachtungen', color: 'bg-blue-100 text-blue-800' },
    { id: 'problem', name: 'Probleme', color: 'bg-red-100 text-red-800' },
    { id: 'erfolg', name: 'Erfolge', color: 'bg-green-100 text-green-800' }
  ];

  const filteredNotes = useMemo(() => {
    return notes.filter(note => {
      const matchesSearch = note.title.toLowerCase().includes(searchTerm.toLowerCase()) ||
                           note.content.toLowerCase().includes(searchTerm.toLowerCase()) ||
                           note.tags.some(tag => tag.toLowerCase().includes(searchTerm.toLowerCase()));
      
      const matchesCategory = selectedCategory === 'alle' || note.category === selectedCategory;
      const matchesPlant = selectedPlant === 'alle' || note.plantId === selectedPlant;
      
      return matchesSearch && matchesCategory && matchesPlant;
    });
  }, [notes, searchTerm, selectedCategory, selectedPlant]);

  const addNote = () => {
    if (!newNote.title || !newNote.content) return;
    
    const note: Note = {
      id: Date.now().toString(),
      title: newNote.title,
      content: newNote.content,
      category: newNote.category as Note['category'],
      timestamp: new Date(),
      tags: newNote.tags || [],
      isVoiceNote: isRecording,
      ...(newNote.plantId && { plantId: newNote.plantId }),
      ...(newNote.plantName && { plantName: newNote.plantName }),
      ...(newNote.strainId && { strainId: newNote.strainId }),
      ...(newNote.strainName && { strainName: newNote.strainName })
    };
    
    setNotes(prev => [note, ...prev]);
    setNewNote({
      title: '',
      content: '',
      category: 'beobachtung',
      tags: [],
      plantId: '',
      plantName: '',
      strainId: '',
      strainName: ''
    });
    setIsRecording(false);
  };

  const deleteNote = (id: string) => {
    setNotes(prev => prev.filter(note => note.id !== id));
  };

  const addTag = (tag: string) => {
    if (tag && !newNote.tags?.includes(tag)) {
      setNewNote(prev => ({
        ...prev,
        tags: [...(prev.tags || []), tag]
      }));
    }
  };

  const removeTag = (tagToRemove: string) => {
    setNewNote(prev => ({
      ...prev,
      tags: prev.tags?.filter(tag => tag !== tagToRemove) || []
    }));
  };

  const toggleRecording = () => {
    setIsRecording(!isRecording);
  };

  const selectPlant = (plantId: string) => {
    const plant = plants.find(p => p.id === plantId);
    setNewNote(prev => ({
      ...prev,
      plantId: plantId,
      plantName: plant?.name || '',
      strainName: plant?.strain || ''
    }));
  };

  const selectStrain = (strainId: string) => {
    const strain = strains.find(s => s.id === strainId);
    setNewNote(prev => ({
      ...prev,
      strainId: strainId,
      strainName: strain?.name || ''
    }));
  };

  return (
    <div className="space-y-6">
      {/* Neue Notiz erstellen */}
      <div className="bg-white rounded-lg shadow-lg p-6">
        <h2 className="text-xl font-semibold mb-4">Neue Notiz erstellen</h2>
        
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-4 mb-4">
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-2">
              Titel
            </label>
            <input
              type="text"
              value={newNote.title}
              onChange={(e) => setNewNote(prev => ({ ...prev, title: e.target.value }))}
              className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-green-500"
              placeholder="Titel der Notiz..."
            />
          </div>
          
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-2">
              Kategorie
            </label>
            <select
              value={newNote.category}
              onChange={(e) => setNewNote(prev => ({ ...prev, category: e.target.value as Note['category'] }))}
              className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-green-500"
              aria-label="Kategorie auswählen"
            >
              {categories.map(cat => (
                <option key={cat.id} value={cat.id}>{cat.name}</option>
              ))}
            </select>
          </div>
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-2 gap-4 mb-4">
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-2">
              Pflanze verknüpfen
            </label>
            <select
              value={newNote.plantId}
              onChange={(e) => selectPlant(e.target.value)}
              className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-green-500"
              aria-label="Pflanze auswählen"
            >
              <option value="">Keine Pflanze verknüpfen</option>
              {plants.map(plant => (
                <option key={plant.id} value={plant.id}>
                  {plant.name} ({plant.strain})
                </option>
              ))}
            </select>
          </div>
          
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-2">
              Strain verknüpfen
            </label>
            <select
              value={newNote.strainId}
              onChange={(e) => selectStrain(e.target.value)}
              className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-green-500"
              aria-label="Strain für Notiz auswählen"
            >
              <option value="">Keinen Strain verknüpfen</option>
              {strains.map(strain => (
                <option key={strain.id} value={strain.id}>{strain.name}</option>
              ))}
            </select>
          </div>
        </div>

        <div className="mb-4">
          <label className="block text-sm font-medium text-gray-700 mb-2">
            Inhalt
          </label>
          <div className="relative">
            <textarea
              value={newNote.content}
              onChange={(e) => setNewNote(prev => ({ ...prev, content: e.target.value }))}
              rows={4}
              className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-green-500 pr-12"
              placeholder="Beschreibe deine Beobachtung, Problem oder Erfolg..."
            />
            <button
              onClick={toggleRecording}
              className={`absolute right-2 top-2 p-2 rounded-full transition-colors ${
                isRecording 
                  ? 'bg-red-500 text-white hover:bg-red-600' 
                  : 'bg-gray-200 text-gray-600 hover:bg-gray-300'
              }`}
              title={isRecording ? 'Aufnahme stoppen' : 'Sprachaufnahme starten'}
            >
              {isRecording ? <MicOff size={16} /> : <Mic size={16} />}
            </button>
          </div>
        </div>

        <div className="mb-4">
          <label className="block text-sm font-medium text-gray-700 mb-2">
            Tags
          </label>
          <div className="flex flex-wrap gap-2 mb-2">
            {newNote.tags?.map(tag => (
              <span
                key={tag}
                className="inline-flex items-center px-2 py-1 rounded-full text-xs font-medium bg-green-100 text-green-800"
              >
                {tag}
                <button
                  onClick={() => removeTag(tag)}
                  className="ml-1 text-green-600 hover:text-green-800"
                  aria-label={`Tag "${tag}" entfernen`}
                >
                  <X size={12} />
                </button>
              </span>
            ))}
          </div>
          <div className="flex gap-2">
            <input
              type="text"
              placeholder="Tag hinzufügen..."
              className="flex-1 px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-green-500"
              onKeyPress={(e) => {
                if (e.key === 'Enter') {
                  const target = e.target as HTMLInputElement;
                  addTag(target.value);
                  target.value = '';
                }
              }}
            />
            <button
              onClick={() => {
                const input = document.querySelector('input[placeholder="Tag hinzufügen..."]') as HTMLInputElement;
                if (input?.value) {
                  addTag(input.value);
                  input.value = '';
                }
              }}
              className="px-4 py-2 bg-green-500 text-white rounded-md hover:bg-green-600 transition-colors"
            >
              Hinzufügen
            </button>
          </div>
        </div>

        <button
          onClick={addNote}
          disabled={!newNote.title || !newNote.content}
          className="w-full px-6 py-3 bg-green-500 text-white rounded-lg hover:bg-green-600 disabled:bg-gray-300 disabled:cursor-not-allowed transition-colors flex items-center justify-center gap-2"
        >
          <Save size={20} />
          Notiz speichern
        </button>
      </div>

      {/* Suchleiste und Filter */}
      <div className="bg-white rounded-lg shadow-lg p-6">
        <div className="flex flex-col lg:flex-row gap-4 items-center justify-between">
          <div className="relative flex-1 max-w-md">
            <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400" size={20} />
            <input
              type="text"
              placeholder="Notizen durchsuchen..."
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
              className="w-full pl-10 pr-4 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-green-500"
            />
          </div>
          
          <button
            onClick={() => setShowFilters(!showFilters)}
            className="flex items-center gap-2 px-4 py-2 bg-gray-100 text-gray-700 rounded-md hover:bg-gray-200 transition-colors"
          >
            <Filter size={20} />
            Filter
          </button>
        </div>

        {showFilters && (
          <div className="mt-4 pt-4 border-t border-gray-200">
            <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">Kategorie</label>
                <select
                  value={selectedCategory}
                  onChange={(e) => setSelectedCategory(e.target.value)}
                  className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-green-500"
                  aria-label="Notiz-Kategorie auswählen"
                  title="Kategorie für die Notiz-Filterung auswählen"
                >
                  <option value="alle">Alle Kategorien</option>
                  {categories.map(cat => (
                    <option key={cat.id} value={cat.id}>{cat.name}</option>
                  ))}
                </select>
              </div>
              
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">Pflanze</label>
                <select
                  value={selectedPlant}
                  onChange={(e) => setSelectedPlant(e.target.value)}
                  className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-green-500"
                  aria-label="Pflanze für Notiz-Filterung auswählen"
                  title="Pflanze für die Notiz-Filterung auswählen"
                >
                  <option value="alle">Alle Pflanzen</option>
                  {plants.map(plant => (
                    <option key={plant.id} value={plant.id}>{plant.name}</option>
                  ))}
                </select>
              </div>
              
              <div className="flex items-end">
                <button
                  onClick={() => {
                    setSearchTerm('');
                    setSelectedCategory('alle');
                    setSelectedPlant('alle');
                  }}
                  className="w-full px-4 py-2 bg-gray-500 text-white rounded-md hover:bg-gray-600 transition-colors"
                >
                  Filter zurücksetzen
                </button>
              </div>
            </div>
          </div>
        )}
      </div>

      {/* Notizen anzeigen */}
      <div className="space-y-4">
        {filteredNotes.length === 0 ? (
          <div className="text-center py-12 text-gray-500">
            {searchTerm || selectedCategory !== 'alle' || selectedPlant !== 'alle' 
              ? 'Keine Notizen gefunden, die den Filtern entsprechen.'
              : 'Noch keine Notizen erstellt. Erstelle deine erste Notiz oben!'}
          </div>
        ) : (
          filteredNotes.map(note => (
            <div key={note.id} className="bg-white rounded-lg shadow-lg p-6">
              <div className="flex items-start justify-between mb-4">
                <div className="flex-1">
                  <div className="flex items-center gap-3 mb-2">
                    <span className={`px-3 py-1 rounded-full text-sm font-medium ${categories.find(c => c.id === note.category)?.color}`}>
                      {categories.find(c => c.id === note.category)?.name}
                    </span>
                    {note.isVoiceNote && (
                      <span className="px-2 py-1 bg-purple-100 text-purple-800 rounded-full text-xs font-medium">
                        Sprachnotiz
                      </span>
                    )}
                    <span className="text-sm text-gray-500 flex items-center gap-1">
                      <Calendar size={14} />
                      {note.timestamp.toLocaleDateString('de-DE')} {note.timestamp.toLocaleTimeString('de-DE', { hour: '2-digit', minute: '2-digit' })}
                    </span>
                  </div>
                  
                  <h3 className="text-xl font-semibold text-gray-900 mb-2">{note.title}</h3>
                  
                  <div className="text-gray-700 mb-3 whitespace-pre-wrap">{note.content}</div>
                  
                  {(note.plantName || note.strainName) && (
                    <div className="flex items-center gap-4 mb-3 text-sm text-gray-600">
                      {note.plantName && (
                        <span className="flex items-center gap-1">
                          <Sprout size={16} />
                          {note.plantName}
                        </span>
                      )}
                      {note.strainName && (
                        <span className="flex items-center gap-1">
                          <Tag size={16} />
                          {note.strainName}
                        </span>
                      )}
                    </div>
                  )}
                  
                  {note.tags.length > 0 && (
                    <div className="flex flex-wrap gap-2">
                      {note.tags.map(tag => (
                        <span
                          key={tag}
                          className="px-2 py-1 bg-gray-100 text-gray-700 rounded-full text-xs font-medium"
                        >
                          {tag}
                        </span>
                      ))}
                    </div>
                  )}
                </div>
                
                <div className="flex gap-2 ml-4">
                  <button
                    onClick={() => deleteNote(note.id)}
                    className="p-2 text-gray-600 hover:text-red-600 hover:bg-red-50 rounded-md transition-colors"
                    title="Löschen"
                  >
                    <Trash2 size={16} />
                  </button>
                </div>
              </div>
            </div>
          ))
        )}
      </div>
    </div>
  );
};
