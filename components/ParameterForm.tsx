'use client';

import { useState, useEffect } from 'react';
import { primitiveTemplates } from '../lib/primitives';
import { Primitive, PrimitiveType } from '../lib/types';

interface ParameterFormProps {
  primitive: Primitive;
  onParameterChange: (parameterId: string, value: any) => void;
}

export default function ParameterForm({ primitive, onParameterChange }: ParameterFormProps) {
  const template = primitiveTemplates[primitive.type as PrimitiveType];
  const [errorMessages, setErrorMessages] = useState<Record<string, string>>({});
  
  // Reset errors when primitive changes
  useEffect(() => {
    setErrorMessages({});
  }, [primitive.id]);
  
  if (!template) {
    return (
      <div className="p-4 bg-red-50 text-red-600 rounded-lg">
        <p className="font-medium">Unknown primitive type: {primitive.type}</p>
        <p className="text-sm mt-2">The primitive type could not be found in the available templates.</p>
      </div>
    );
  }
  
  const validateAndUpdateParameter = (parameterId: string, value: any) => {
    const parameterTemplate = template.parameters.find(p => p.id === parameterId);
    
    // Clear any existing error for this parameter
    setErrorMessages(prev => ({ ...prev, [parameterId]: '' }));
    
    if (parameterTemplate) {
      const constraints = parameterTemplate.constraints || {};
      
      // Validate the value
      if (constraints.required && (value === '' || value === null || value === undefined)) {
        setErrorMessages(prev => ({ 
          ...prev, 
          [parameterId]: 'This field is required' 
        }));
        return;
      }
      
      if (parameterTemplate.type === 'number') {
        const numVal = Number(value);
        if (isNaN(numVal)) {
          setErrorMessages(prev => ({ 
            ...prev, 
            [parameterId]: 'Value must be a number' 
          }));
          return;
        }
        
        if (constraints.minimum !== undefined && numVal < constraints.minimum) {
          setErrorMessages(prev => ({ 
            ...prev, 
            [parameterId]: `Value must be at least ${constraints.minimum}` 
          }));
          return;
        }
        
        if (constraints.maximum !== undefined && numVal > constraints.maximum) {
          setErrorMessages(prev => ({ 
            ...prev, 
            [parameterId]: `Value must be at most ${constraints.maximum}` 
          }));
          return;
        }
      }
    }
    
    // If validation passes, update the parameter
    onParameterChange(parameterId, value);
  };
  
  return (
    <div className="space-y-4">
      <div className="flex items-center justify-between mb-4">
        <h2 className="text-lg font-medium text-gray-900">{primitive.label || template.name}</h2>
        <span className="inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium bg-blue-100 text-blue-800">
          {template.type}
        </span>
      </div>
      
      <div className="text-sm text-gray-500 mb-4">{template.description}</div>
      
      <div className="space-y-4">
        {template.parameters.map(param => {
          const paramValue = primitive.parameters[param.id]?.value ?? param.defaultValue;
          const hasError = !!errorMessages[param.id];
          
          return (
            <div key={param.id} className="space-y-1">
              <label 
                className={`block text-sm font-medium ${hasError ? 'text-red-600' : 'text-gray-700'}`}
                htmlFor={`param-${param.id}`}
              >
                {param.name}
                {param.constraints?.required && <span className="ml-1 text-red-500">*</span>}
              </label>
              
              <div className="text-xs text-gray-500 mb-1">{param.description}</div>
              
              {param.type === 'number' && (
                <div className="flex items-center">
                  <input
                    id={`param-${param.id}`}
                    type="number"
                    value={paramValue}
                    min={param.constraints?.minimum}
                    max={param.constraints?.maximum}
                    step="any"
                    onChange={e => validateAndUpdateParameter(param.id, parseFloat(e.target.value))}
                    className={`w-full rounded shadow-sm sm:text-sm ${
                      hasError 
                        ? 'border-red-300 text-red-900 placeholder-red-300 focus:outline-none focus:ring-red-500 focus:border-red-500' 
                        : 'border-gray-300 focus:ring-blue-500 focus:border-blue-500'
                    }`}
                  />
                  
                  <div className="ml-2 flex items-center space-x-2">
                    <button 
                      type="button"
                      className="p-1 rounded bg-gray-200 hover:bg-gray-300"
                      onClick={() => validateAndUpdateParameter(
                        param.id, 
                        Math.max((paramValue || 0) - 1, param.constraints?.minimum || 0)
                      )}
                    >
                      -
                    </button>
                    <button 
                      type="button"
                      className="p-1 rounded bg-gray-200 hover:bg-gray-300"
                      onClick={() => validateAndUpdateParameter(
                        param.id, 
                        Math.min((paramValue || 0) + 1, param.constraints?.maximum || Infinity)
                      )}
                    >
                      +
                    </button>
                  </div>
                </div>
              )}
              
              {param.type === 'string' && (
                <input
                  id={`param-${param.id}`}
                  type="text"
                  value={paramValue}
                  onChange={e => validateAndUpdateParameter(param.id, e.target.value)}
                  className={`w-full rounded shadow-sm sm:text-sm ${
                    hasError 
                      ? 'border-red-300 text-red-900 placeholder-red-300 focus:outline-none focus:ring-red-500 focus:border-red-500' 
                      : 'border-gray-300 focus:ring-blue-500 focus:border-blue-500'
                  }`}
                />
              )}
              
              {param.type === 'boolean' && (
                <div className="flex items-center">
                  <input
                    id={`param-${param.id}`}
                    type="checkbox"
                    checked={paramValue}
                    onChange={e => validateAndUpdateParameter(param.id, e.target.checked)}
                    className={`h-4 w-4 rounded ${
                      hasError 
                        ? 'border-red-300 text-red-600 focus:ring-red-500' 
                        : 'border-gray-300 text-blue-500 focus:ring-blue-500'
                    }`}
                  />
                  <span className="ml-2 text-sm text-gray-600">Enabled</span>
                </div>
              )}
              
              {param.type === 'enum' && param.constraints?.enum && (
                <select
                  id={`param-${param.id}`}
                  value={paramValue}
                  onChange={e => validateAndUpdateParameter(param.id, e.target.value)}
                  className={`w-full rounded shadow-sm sm:text-sm ${
                    hasError 
                      ? 'border-red-300 text-red-900 focus:outline-none focus:ring-red-500 focus:border-red-500' 
                      : 'border-gray-300 focus:ring-blue-500 focus:border-blue-500'
                  }`}
                >
                  {param.constraints.enum.map(option => (
                    <option key={option} value={option}>
                      {option}
                    </option>
                  ))}
                </select>
              )}
              
              {param.type === 'asset' && (
                <select
                  id={`param-${param.id}`}
                  value={paramValue}
                  onChange={e => validateAndUpdateParameter(param.id, e.target.value)}
                  className={`w-full rounded shadow-sm sm:text-sm ${
                    hasError 
                      ? 'border-red-300 text-red-900 focus:outline-none focus:ring-red-500 focus:border-red-500' 
                      : 'border-gray-300 focus:ring-blue-500 focus:border-blue-500'
                  }`}
                >
                  {['USDC', 'USDT', 'APT', 'BTC', 'ETH', 'SOL'].map(asset => (
                    <option key={asset} value={asset}>
                      {asset}
                    </option>
                  ))}
                </select>
              )}
              
              {hasError && (
                <div className="text-xs text-red-600 mt-1">{errorMessages[param.id]}</div>
              )}
            </div>
          );
        })}
      </div>
      
      <div className="pt-4 border-t border-gray-200 mt-6">
        <div className="flex flex-wrap gap-2">
          {template.tags.map(tag => (
            <span 
              key={tag}
              className="inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium bg-gray-100 text-gray-800"
            >
              {tag}
            </span>
          ))}
        </div>
      </div>
    </div>
  );
} 