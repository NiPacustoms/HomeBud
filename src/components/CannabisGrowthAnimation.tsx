"use client";

import React, { useEffect, useState } from 'react';

type GrowthStage = 'seed' | 'seedling' | 'vegetative' | 'flower' | 'mature';

const stages: { id: GrowthStage; label: string; emoji: string; bg: string }[] = [
  { id: 'seed', label: 'Samen', emoji: '🌰', bg: 'bg-amber-100' },
  { id: 'seedling', label: 'Keimling', emoji: '🌱', bg: 'bg-green-100' },
  { id: 'vegetative', label: 'Vegetativ', emoji: '🍃', bg: 'bg-emerald-100' },
  { id: 'flower', label: 'Blüte', emoji: '🌸', bg: 'bg-pink-100' },
  { id: 'mature', label: 'Reife Pflanze', emoji: '🌳', bg: 'bg-lime-100' },
];

export default function CannabisGrowthAnimation(): JSX.Element {
  const [index, setIndex] = useState<number>(0);

  useEffect(() => {
    const id = setInterval(() => {
      setIndex((prev) => (prev + 1) % stages.length);
    }, 2000);
    return () => clearInterval(id);
  }, []);

  const current = stages[index];

  if (!current) {
    return <div>Loading...</div>;
  }

  return (
    <div className="w-full h-72 flex items-center justify-center">
      <div className={`w-full h-full flex flex-col items-center justify-center transition-colors duration-500 ${current.bg}`}>
        <div className="text-7xl mb-4 animate-bounce">{current.emoji}</div>
        <div className="text-xl font-semibold text-neutral-800">{current.label}</div>
        <div className="mt-2 text-neutral-600">
          {stages.map((s, i) => (
            <span key={s.id} className={`inline-block mx-1 text-lg ${i === index ? 'opacity-100' : 'opacity-40'}`}>
              {s.emoji}
            </span>
          ))}
        </div>
      </div>
    </div>
  );
}


