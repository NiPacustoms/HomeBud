'use client';

import React from 'react';
import { NotesManager } from '@/components/notes/NotesManager';

export default function NotesPage() {
  return (
    <div className="min-h-screen bg-gradient-to-br from-green-50 to-emerald-100 p-4">
      <div className="max-w-7xl mx-auto">
        <div className="mb-8">
          <h1 className="text-4xl font-bold text-gray-900 mb-2">Notizen</h1>
          <p className="text-lg text-gray-600">
            Dokumentiere deine Beobachtungen, Probleme und Erfolge im Anbau
          </p>
        </div>
        
        <NotesManager />
      </div>
    </div>
  );
}
