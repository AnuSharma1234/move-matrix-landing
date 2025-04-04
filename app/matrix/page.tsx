'use client';

import { useState, useEffect } from 'react';
import { Primitive, PrimitiveType, ValidationResult } from '../../lib/types';
import { createCompositionEngine } from '../../lib/composition-engine';
import Link from 'next/link';
import PrimitiveLibrary from '../../components/PrimitiveLibrary';
import ParameterForm from '../../components/ParameterForm';
import CompositionCanvas from '../../components/CompositionCanvas';
import ValidationPanel from '../../components/ValidationPanel';
import CodeDisplay from '../../components/CodeDisplay';

export default function DemoPage() {
  // Create a composition engine
  const [compositionEngine] = useState(() => createCompositionEngine());
  
  // State for the selected primitive
  const [selectedPrimitive, setSelectedPrimitive] = useState<Primitive | null>(null);
  
  // State for validation result
  const [validationResult, setValidationResult] = useState<ValidationResult | null>(null);
  
  // State for generated code
  const [generatedCode, setGeneratedCode] = useState<string | null>(null);
  
  // Handle selecting a primitive from the library
  const handleSelectPrimitiveType = (type: PrimitiveType) => {
    const position = {
      x: Math.random() * 300 + 50,
      y: Math.random() * 300 + 50,
    };
    
    const primitive = compositionEngine.addPrimitive(type, position);
    setSelectedPrimitive(primitive);
  };
  
  // Handle selecting a primitive on the canvas
  const handleSelectPrimitive = (primitive: Primitive | null) => {
    setSelectedPrimitive(primitive);
  };
  
  // Handle updating a primitive parameter
  const handleParameterChange = (parameterId: string, value: any) => {
    if (selectedPrimitive) {
      compositionEngine.updatePrimitiveParameter(selectedPrimitive.id, parameterId, value);
      
      // Update the selected primitive with the latest data
      setSelectedPrimitive({
        ...selectedPrimitive,
        parameters: {
          ...selectedPrimitive.parameters,
          [parameterId]: {
            parameterId,
            value,
          },
        },
      });
    }
  };
  
  // Handle validating the composition
  const handleValidate = () => {
    const result = compositionEngine.validateComposition();
    setValidationResult(result);
  };
  
  // Handle generating code
  const handleGenerateCode = () => {
    const code = compositionEngine.exportCode();
    setGeneratedCode(code);
  };
  
  return (
    <div className="min-h-screen bg-gray-50">
      {/* Navigation */}
      <nav className="bg-white shadow-sm">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex justify-between h-14">
            <div className="flex items-center">
              <Link href="/" className="text-xl font-bold text-blue-600">
                MoveMatrix
              </Link>
              <div className="hidden md:ml-6 md:flex md:space-x-8">
                <span className="border-b-2 border-blue-500 text-gray-900 inline-flex items-center px-1 pt-1 text-sm font-medium">
                  Editor
                </span>
                <a href="#" className="border-transparent text-gray-500 hover:border-gray-300 hover:text-gray-700 inline-flex items-center px-1 pt-1 border-b-2 text-sm font-medium">
                  Documentation
                </a>
                <a href="#" className="border-transparent text-gray-500 hover:border-gray-300 hover:text-gray-700 inline-flex items-center px-1 pt-1 border-b-2 text-sm font-medium">
                  Examples
                </a>
              </div>
            </div>
            <div className="flex items-center">
              <button className="bg-blue-600 text-white px-4 py-2 rounded text-sm font-medium hover:bg-blue-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-blue-500">
                Save Project
              </button>
            </div>
          </div>
        </div>
      </nav>

      <main className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-6">
        <div className="mb-6">
          <h1 className="text-2xl font-bold text-gray-900">Visual DeFi Composer</h1>
          <p className="text-gray-600">Drag primitives from the library, connect them, and configure parameters to build your DeFi protocol</p>
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-12 gap-6">
          {/* Left Sidebar - Primitive Library */}
          <div className="lg:col-span-3">
            <div className="mb-4">
              <h2 className="text-lg font-medium text-gray-900 mb-2">Primitive Library</h2>
              <p className="text-sm text-gray-500">Click on a primitive to add it to your canvas</p>
            </div>
            <div className="bg-white shadow overflow-hidden rounded-lg">
              <PrimitiveLibrary onSelectPrimitive={handleSelectPrimitiveType} />
            </div>
          </div>
          
          {/* Main Canvas */}
          <div className="lg:col-span-6">
            <div className="bg-white shadow rounded-lg overflow-hidden">
              <div className="p-4 border-b border-gray-200">
                <h2 className="text-lg font-medium text-gray-900">Composition Canvas</h2>
                <p className="text-sm text-gray-500">Connect primitives by dragging from outputs to inputs</p>
              </div>
              <div className="h-[600px] bg-gray-50 border-b border-gray-200">
                <CompositionCanvas 
                  compositionEngine={compositionEngine} 
                  onSelectPrimitive={handleSelectPrimitive} 
                />
              </div>
              <div className="p-4 flex justify-end space-x-4">
                <button
                  onClick={handleValidate}
                  className="px-4 py-2 border border-transparent rounded-md shadow-sm text-sm font-medium text-white bg-blue-600 hover:bg-blue-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-blue-500"
                >
                  Validate
                </button>
                <button
                  onClick={handleGenerateCode}
                  className="px-4 py-2 border border-transparent rounded-md shadow-sm text-sm font-medium text-white bg-green-600 hover:bg-green-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-green-500"
                >
                  Generate Code
                </button>
              </div>
            </div>
          </div>
          
          {/* Right Sidebar - Parameters, Validation, Code */}
          <div className="lg:col-span-3 space-y-6">
            {/* Parameters Form */}
            <div className="bg-white shadow rounded-lg overflow-hidden">
              <div className="p-4 border-b border-gray-200">
                <h2 className="text-lg font-medium text-gray-900">Parameters</h2>
                <p className="text-sm text-gray-500">Configure the selected primitive</p>
              </div>
              <div className="p-4">
                {selectedPrimitive ? (
                  <ParameterForm 
                    primitive={selectedPrimitive} 
                    onParameterChange={handleParameterChange} 
                  />
                ) : (
                  <p className="text-gray-500 text-center py-4">Select a primitive on the canvas to configure its parameters</p>
                )}
              </div>
            </div>
            
            {/* Validation Panel */}
            <div className="bg-white shadow rounded-lg overflow-hidden">
              <div className="p-4 border-b border-gray-200">
                <h2 className="text-lg font-medium text-gray-900">Validation</h2>
                <p className="text-sm text-gray-500">Check your composition for errors</p>
              </div>
              <div className="p-4">
                <ValidationPanel validationResult={validationResult} />
              </div>
            </div>
            
            {/* Code Display */}
            <div className="bg-white shadow rounded-lg overflow-hidden">
              <div className="p-4 border-b border-gray-200">
                <h2 className="text-lg font-medium text-gray-900">Generated Code</h2>
                <p className="text-sm text-gray-500">Move code for your composition</p>
              </div>
              <div className="p-4">
                <CodeDisplay code={generatedCode} />
              </div>
            </div>
          </div>
        </div>
      </main>
    </div>
  );
} 