'use client';

import React, { useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';

interface HelpSystemProps {
  children: React.ReactNode;
  title?: string;
  content: string | React.ReactNode;
  position?: 'top' | 'bottom' | 'left' | 'right';
  size?: 'small' | 'medium' | 'large';
  showIcon?: boolean;
}

export default function HelpSystem({ 
  children, 
  title, 
  content, 
  position = 'top',
  size = 'medium',
  showIcon = true 
}: HelpSystemProps) {
  const [isVisible, setIsVisible] = useState(false);

  const positionClasses = {
    top: 'bottom-full left-1/2 transform -translate-x-1/2 mb-2',
    bottom: 'top-full left-1/2 transform -translate-x-1/2 mt-2',
    left: 'right-full top-1/2 transform -translate-y-1/2 mr-2',
    right: 'left-full top-1/2 transform -translate-y-1/2 ml-2'
  };

  const sizeClasses = {
    small: 'max-w-xs',
    medium: 'max-w-sm',
    large: 'max-w-md'
  };

  return (
    <div className="relative inline-block">
      <div 
        className="inline-flex items-center"
        onMouseEnter={() => setIsVisible(true)}
        onMouseLeave={() => setIsVisible(false)}
        onFocus={() => setIsVisible(true)}
        onBlur={() => setIsVisible(false)}
      >
        {children}
        {showIcon && (
          <button
            type="button"
            className="ml-1 text-gray-400 hover:text-gray-600 transition-colors focus:outline-none focus:text-gray-600"
            onClick={() => setIsVisible(!isVisible)}
            aria-label="Hilfe anzeigen"
          >
            <svg className="w-4 h-4" fill="currentColor" viewBox="0 0 20 20">
              <path fillRule="evenodd" d="M18 10a8 8 0 11-16 0 8 8 0 0116 0zm-8-3a1 1 0 00-.867.5 1 1 0 11-1.731-1A3 3 0 0113 8a3.001 3.001 0 01-2 2.83V11a1 1 0 11-2 0v-1a1 1 0 011-1 1 1 0 100-2zm0 8a1 1 0 100-2 1 1 0 000 2z" clipRule="evenodd" />
            </svg>
          </button>
        )}
      </div>

      <AnimatePresence>
        {isVisible && (
          <motion.div
            initial={{ opacity: 0, scale: 0.95 }}
            animate={{ opacity: 1, scale: 1 }}
            exit={{ opacity: 0, scale: 0.95 }}
            transition={{ duration: 0.2 }}
            className={`absolute z-50 ${positionClasses[position]} ${sizeClasses[size]}`}
          >
            <div className="bg-gray-900 text-white rounded-lg shadow-xl p-3 border border-gray-700">
              {title && (
                <div className="font-semibold text-sm mb-1">{title}</div>
              )}
              <div className="text-sm leading-relaxed">
                {content}
              </div>
              {/* Arrow */}
              <div className={`absolute w-2 h-2 bg-gray-900 transform rotate-45 ${
                position === 'top' ? 'top-full left-1/2 -translate-x-1/2 -mt-1' :
                position === 'bottom' ? 'bottom-full left-1/2 -translate-x-1/2 -mb-1' :
                position === 'left' ? 'left-full top-1/2 -translate-y-1/2 -ml-1' :
                'right-full top-1/2 -translate-y-1/2 -mr-1'
              }`} />
            </div>
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  );
}

// Spezialisierte Komponenten für häufige Anwendungsfälle
export function InfoIcon({ content, title }: { content: string; title?: string }) {
  return (
    <HelpSystem content={content} {...(title && { title })} showIcon={true}>
      <span></span>
    </HelpSystem>
  );
}

export function FieldHelp({ 
  children, 
  content, 
  title,
  position = 'right' 
}: { 
  children: React.ReactNode; 
  content: string; 
  title?: string;
  position?: 'top' | 'bottom' | 'left' | 'right';
}) {
  return (
    <HelpSystem content={content} {...(title && { title })} position={position} showIcon={false}>
      {children}
    </HelpSystem>
  );
}
