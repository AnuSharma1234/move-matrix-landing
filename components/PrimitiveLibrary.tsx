'use client';

import { useState } from 'react';
import { primitiveTemplates } from '../lib/primitives';
import PrimitiveCard from './PrimitiveCard';
import { PrimitiveType } from '../lib/types';

interface PrimitiveLibraryProps {
  onSelectPrimitive: (type: PrimitiveType) => void;
}

export default function PrimitiveLibrary({ onSelectPrimitive }: PrimitiveLibraryProps) {
  const [searchTerm, setSearchTerm] = useState('');
  const [selectedCategory, setSelectedCategory] = useState<string | null>(null);
  
  // Extract unique categories
  const categories = Array.from(
    new Set(Object.values(primitiveTemplates).map(primitive => primitive.category))
  );
  
  // Filter primitives based on search term and category
  const filteredPrimitives = Object.values(primitiveTemplates).filter(primitive => {
    const matchesSearch = 
      primitive.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
      primitive.description.toLowerCase().includes(searchTerm.toLowerCase()) ||
      primitive.tags.some(tag => tag.toLowerCase().includes(searchTerm.toLowerCase()));
      
    const matchesCategory = !selectedCategory || primitive.category === selectedCategory;
    
    return matchesSearch && matchesCategory;
  });
  
  return (
    <div className="bg-white">
      <div className="px-4 py-3 border-b border-gray-200">
        <div className="relative">
          <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
            <svg className="h-5 w-5 text-gray-400" xmlns="http://www.w3.org/2000/svg" viewBox="0 0 20 20" fill="currentColor" aria-hidden="true">
              <path fillRule="evenodd" d="M8 4a4 4 0 100 8 4 4 0 000-8zM2 8a6 6 0 1110.89 3.476l4.817 4.817a1 1 0 01-1.414 1.414l-4.816-4.816A6 6 0 012 8z" clipRule="evenodd" />
            </svg>
          </div>
          <input
            type="text"
            placeholder="Search primitives..."
            className="block w-full pl-10 pr-3 py-2 border border-gray-300 rounded-md leading-5 bg-white placeholder-gray-500 focus:outline-none focus:placeholder-gray-400 focus:ring-1 focus:ring-blue-500 focus:border-blue-500 sm:text-sm"
            value={searchTerm}
            onChange={e => setSearchTerm(e.target.value)}
          />
        </div>
      </div>
      
      <div className="px-4 py-3 border-b border-gray-200">
        <h3 className="text-xs font-semibold text-gray-500 uppercase tracking-wider">Categories</h3>
        <div className="mt-2 flex flex-wrap gap-2">
          <button
            className={`px-2 py-1 rounded-full text-xs font-medium ${
              !selectedCategory 
                ? 'bg-blue-100 text-blue-800' 
                : 'bg-gray-100 text-gray-800 hover:bg-gray-200'
            }`}
            onClick={() => setSelectedCategory(null)}
          >
            All
          </button>
          
          {categories.map(category => (
            <button
              key={category}
              className={`px-2 py-1 rounded-full text-xs font-medium ${
                selectedCategory === category 
                  ? 'bg-blue-100 text-blue-800' 
                  : 'bg-gray-100 text-gray-800 hover:bg-gray-200'
              }`}
              onClick={() => setSelectedCategory(category)}
            >
              {category}
            </button>
          ))}
        </div>
      </div>
      
      <div className="divide-y divide-gray-200">
        {filteredPrimitives.length > 0 ? (
          filteredPrimitives.map(primitive => (
            <div key={primitive.type} className="p-4 hover:bg-gray-50 transition-colors">
              <PrimitiveCard
                primitive={primitive}
                onClick={() => onSelectPrimitive(primitive.type as PrimitiveType)}
              />
            </div>
          ))
        ) : (
          <div className="p-6 text-center">
            <svg className="mx-auto h-12 w-12 text-gray-400" fill="none" viewBox="0 0 24 24" stroke="currentColor" aria-hidden="true">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M9.172 16.172a4 4 0 015.656 0M9 10h.01M15 10h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z" />
            </svg>
            <h3 className="mt-2 text-sm font-medium text-gray-900">No primitives found</h3>
            <p className="mt-1 text-sm text-gray-500">Try adjusting your search or filter to find what you're looking for.</p>
            <div className="mt-6">
              <button
                onClick={() => {
                  setSearchTerm('');
                  setSelectedCategory(null);
                }}
                type="button"
                className="inline-flex items-center px-4 py-2 border border-transparent text-sm font-medium rounded-md shadow-sm text-white bg-blue-600 hover:bg-blue-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-blue-500"
              >
                Clear filters
              </button>
            </div>
          </div>
        )}
      </div>
    </div>
  );
} 