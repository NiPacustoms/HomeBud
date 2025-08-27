'use client';

import React, { useState } from 'react';
import { motion } from 'framer-motion';

interface InputStep {
  id: string;
  label: string;
  type: 'number' | 'select' | 'text' | 'range' | 'checkbox' | 'radio';
  placeholder?: string;
  helpText: string;
  exampleValue?: string | number;
  options?: { value: string; label: string; description?: string }[];
  range?: { min: number; max: number; step?: number };
  validation?: {
    required?: boolean;
    min?: number;
    max?: number;
    pattern?: string;
  };
  unit?: string;
  optimalRange?: { min: number; max: number };
}

interface GuidedInputProps {
  title: string;
  description: string;
  steps: InputStep[];
  onComplete: (values: Record<string, any>) => void;
  onCancel?: () => void;
  showProgress?: boolean;
  showHelp?: boolean;
}

export default function GuidedInput({
  title,
  description,
  steps,
  onComplete,
  onCancel,
  showProgress = true,
  showHelp = true
}: GuidedInputProps) {
  const [currentStep, setCurrentStep] = useState(0);
  const [values, setValues] = useState<Record<string, any>>({});
  const [errors, setErrors] = useState<Record<string, string>>({});

  const currentStepData = steps[currentStep];
  const progress = ((currentStep + 1) / steps.length) * 100;

  const validateStep = (stepId: string, value: any): string | null => {
    const step = steps.find(s => s.id === stepId);
    if (!step) return null;

    if (step.validation?.required && (!value || value === '')) {
      return 'Dieses Feld ist erforderlich';
    }

    if (step.validation?.min !== undefined && value < step.validation.min) {
      return `Mindestwert ist ${step.validation.min}${step.unit || ''}`;
    }

    if (step.validation?.max !== undefined && value > step.validation.max) {
      return `Maximalwert ist ${step.validation.max}${step.unit || ''}`;
    }

    if (step.validation?.pattern && !new RegExp(step.validation.pattern).test(value)) {
      return 'Ungültiges Format';
    }

    return null;
  };

  const handleInputChange = (stepId: string, value: any) => {
    const error = validateStep(stepId, value);
    
    setValues(prev => ({ ...prev, [stepId]: value }));
    setErrors(prev => ({ ...prev, [stepId]: error || '' }));
  };

  const handleNext = () => {
    const error = validateStep(currentStepData.id, values[currentStepData.id]);
    if (error) {
      setErrors(prev => ({ ...prev, [currentStepData.id]: error }));
      return;
    }

    if (currentStep < steps.length - 1) {
      setCurrentStep(currentStep + 1);
    } else {
      onComplete(values);
    }
  };

  const handleBack = () => {
    if (currentStep > 0) {
      setCurrentStep(currentStep - 1);
    }
  };

  const renderInput = (step: InputStep) => {
    const value = values[step.id] || '';
    const error = errors[step.id];

    switch (step.type) {
      case 'number':
        return (
          <div className="space-y-2">
            <input
              type="number"
              value={value}
              onChange={(e) => handleInputChange(step.id, e.target.value)}
              placeholder={step.placeholder}
              min={step.range?.min}
              max={step.range?.max}
              step={step.range?.step}
              className={`w-full px-4 py-3 border rounded-lg focus:ring-2 focus:ring-green-500 focus:border-transparent ${
                error ? 'border-red-500' : 'border-gray-300'
              }`}
              aria-label={step.label}
            />
            {step.exampleValue && (
              <div className="text-sm text-gray-500">
                Beispiel: {step.exampleValue}
              </div>
            )}
            {error && (
              <div className="text-sm text-red-600">{error}</div>
            )}
          </div>
        );

      case 'select':
        return (
          <div className="space-y-2">
            <select
              value={value}
              onChange={(e) => handleInputChange(step.id, e.target.value)}
              className={`w-full px-4 py-3 border rounded-lg focus:ring-2 focus:ring-green-500 focus:border-transparent ${
                error ? 'border-red-500' : 'border-gray-300'
              }`}
              aria-label={step.label}
            >
              <option value="">Bitte wählen...</option>
              {step.options?.map((option) => (
                <option key={option.value} value={option.value}>
                  {option.label}
                </option>
              ))}
            </select>
            {error && (
              <div className="text-sm text-red-600">{error}</div>
            )}
          </div>
        );

      case 'range':
        return (
          <div className="space-y-2">
            <input
              type="range"
              value={value}
              onChange={(e) => handleInputChange(step.id, e.target.value)}
              min={step.range?.min}
              max={step.range?.max}
              step={step.range?.step}
              className="w-full"
              aria-label={step.label}
            />
            <div className="flex justify-between text-sm text-gray-600">
              <span>{step.range?.min}{step.unit}</span>
              <span>{value}{step.unit}</span>
              <span>{step.range?.max}{step.unit}</span>
            </div>
            {error && (
              <div className="text-sm text-red-600">{error}</div>
            )}
          </div>
        );

      case 'radio':
        return (
          <div className="space-y-3">
            {step.options?.map((option) => (
              <label key={option.value} className="flex items-start p-3 border border-gray-200 rounded-lg hover:bg-gray-50 cursor-pointer">
                <input
                  type="radio"
                  name={step.id}
                  value={option.value}
                  checked={value === option.value}
                  onChange={(e) => handleInputChange(step.id, e.target.value)}
                  className="mt-1 mr-3 text-green-600 focus:ring-green-500"
                />
                <div>
                  <div className="font-medium text-gray-900">{option.label}</div>
                  {option.description && (
                    <div className="text-sm text-gray-600">{option.description}</div>
                  )}
                </div>
              </label>
            ))}
            {error && (
              <div className="text-sm text-red-600">{error}</div>
            )}
          </div>
        );

      case 'checkbox':
        return (
          <div className="space-y-3">
            {step.options?.map((option) => (
              <label key={option.value} className="flex items-start p-3 border border-gray-200 rounded-lg hover:bg-gray-50 cursor-pointer">
                <input
                  type="checkbox"
                  value={option.value}
                  checked={Array.isArray(value) ? value.includes(option.value) : false}
                  onChange={(e) => {
                    const currentValues = Array.isArray(value) ? value : [];
                    const newValues = e.target.checked
                      ? [...currentValues, option.value]
                      : currentValues.filter(v => v !== option.value);
                    handleInputChange(step.id, newValues);
                  }}
                  className="mt-1 mr-3 text-green-600 focus:ring-green-500"
                />
                <div>
                  <div className="font-medium text-gray-900">{option.label}</div>
                  {option.description && (
                    <div className="text-sm text-gray-600">{option.description}</div>
                  )}
                </div>
              </label>
            ))}
            {error && (
              <div className="text-sm text-red-600">{error}</div>
            )}
          </div>
        );

      default:
        return (
          <div className="space-y-2">
            <input
              type="text"
              value={value}
              onChange={(e) => handleInputChange(step.id, e.target.value)}
              placeholder={step.placeholder}
              className={`w-full px-4 py-3 border rounded-lg focus:ring-2 focus:ring-green-500 focus:border-transparent ${
                error ? 'border-red-500' : 'border-gray-300'
              }`}
              aria-label={step.label}
            />
            {step.exampleValue && (
              <div className="text-sm text-gray-500">
                Beispiel: {step.exampleValue}
              </div>
            )}
            {error && (
              <div className="text-sm text-red-600">{error}</div>
            )}
          </div>
        );
    }
  };

  return (
    <div className="bg-white rounded-lg shadow-lg p-6 max-w-2xl mx-auto">
      <div className="mb-6">
        <h2 className="text-2xl font-bold text-gray-900 mb-2">{title}</h2>
        <p className="text-gray-600">{description}</p>
      </div>

      {showProgress && (
        <div className="mb-6">
          <div className="flex justify-between text-sm text-gray-600 mb-2">
            <span>Schritt {currentStep + 1} von {steps.length}</span>
            <span>{Math.round(progress)}%</span>
          </div>
          <div className="w-full bg-gray-200 rounded-full h-2">
            <motion.div
              className="bg-green-600 h-2 rounded-full transition-all duration-300"
              initial={{ width: 0 }}
              animate={{ width: `${progress}%` }}
            />
          </div>
        </div>
      )}

      <div className="mb-6">
        <div className="flex items-center justify-between mb-4">
          <h3 className="text-lg font-semibold text-gray-900">
            {currentStepData.label}
          </h3>
        </div>

        {renderInput(currentStepData)}
      </div>

      <div className="flex justify-between">
        <button
          onClick={handleBack}
          disabled={currentStep === 0}
          className="px-4 py-2 text-gray-600 border border-gray-300 rounded-lg hover:bg-gray-50 disabled:opacity-50 disabled:cursor-not-allowed transition-colors"
        >
          Zurück
        </button>

        <div className="flex space-x-2">
          {onCancel && (
            <button
              onClick={onCancel}
              className="px-4 py-2 text-gray-600 border border-gray-300 rounded-lg hover:bg-gray-50 transition-colors"
            >
              Abbrechen
            </button>
          )}
          
          <button
            onClick={handleNext}
            className="px-6 py-2 bg-green-600 text-white rounded-lg hover:bg-green-700 transition-colors"
          >
            {currentStep === steps.length - 1 ? 'Abschließen' : 'Weiter'}
          </button>
        </div>
      </div>
    </div>
  );
}
