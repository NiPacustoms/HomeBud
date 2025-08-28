'use client';

import React, { useState, useEffect } from 'react';
import { HarvestAssistant } from '@/components/harvest/HarvestAssistant';

export default function HarvestPage() {
  return (
    <div className="min-h-screen bg-gradient-to-br from-green-50 to-emerald-100">
      <div className="container mx-auto px-4 py-8">
        <div className="text-center mb-8">
          <h1 className="text-4xl font-bold text-gray-800 mb-4">
            🌱 Ernte-Assistent
          </h1>
          <p className="text-lg text-gray-600 max-w-2xl mx-auto">
            Optimieren Sie Ihre Ernte mit KI-gestützter Trichom-Analyse, 
            dynamischen Ernteschätzungen und professionellen Curing-Tipps
          </p>
        </div>
        
        <HarvestAssistant />
      </div>
    </div>
  );
}
