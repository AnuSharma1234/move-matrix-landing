'use client';

import React from 'react';
import { PrimitiveTemplate } from '../lib/primitives';

interface PrimitiveCardProps {
  primitive: PrimitiveTemplate;
  onClick: (type: string) => void;
}

export default function PrimitiveCard({ primitive, onClick }: PrimitiveCardProps) {
  const categoryColorMap: Record<string, string> = {
    Lending: 'bg-blue-50 text-blue-700 border-blue-200',
    Exchange: 'bg-green-50 text-green-700 border-green-200',
    Yield: 'bg-purple-50 text-purple-700 border-purple-200',
  };

  const categoryColor = categoryColorMap[primitive.category] || 'bg-gray-50 text-gray-700 border-gray-200';
  
  const iconMap: Record<string, React.ReactNode> = {
    lendingPool: (
      <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5" fill="none" viewBox="0 0 24 24" stroke="currentColor">
        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 8c-1.657 0-3 .895-3 2s1.343 2 3 2 3 .895 3 2-1.343 2-3 2m0-8c1.11 0 2.08.402 2.599 1M12 8V7m0 1v8m0 0v1m0-1c-1.11 0-2.08-.402-2.599-1M21 12a9 9 0 11-18 0 9 9 0 0118 0z" />
      </svg>
    ),
    ammPool: (
      <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5" fill="none" viewBox="0 0 24 24" stroke="currentColor">
        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M8 7h12m0 0l-4-4m4 4l-4 4m0 6H4m0 0l4 4m-4-4l4-4" />
      </svg>
    ),
    staking: (
      <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5" fill="none" viewBox="0 0 24 24" stroke="currentColor">
        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5 3v4M3 5h4M6 17v4m-2-2h4m5-16l2.286 6.857L21 12l-5.714 2.143L13 21l-2.286-6.857L5 12l5.714-2.143L13 3z" />
      </svg>
    ),
    vault: (
      <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5" fill="none" viewBox="0 0 24 24" stroke="currentColor">
        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 15v2m-6 4h12a2 2 0 002-2v-6a2 2 0 00-2-2H6a2 2 0 00-2 2v6a2 2 0 002 2zm10-10V7a4 4 0 00-8 0v4h8z" />
      </svg>
    ),
  };

  const icon = iconMap[primitive.type] || (
    <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5" fill="none" viewBox="0 0 24 24" stroke="currentColor">
      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M13 10V3L4 14h7v7l9-11h-7z" />
    </svg>
  );

  return (
    <div 
      className="group cursor-pointer"
      onClick={() => onClick(primitive.type)}
    >
      <div className="flex items-start">
        <div className={`flex-shrink-0 h-10 w-10 rounded-lg ${categoryColor.split(' ')[0]} p-2`}>
          {icon}
        </div>
        <div className="ml-3">
          <h3 className="text-sm font-medium text-gray-900 group-hover:text-blue-600">{primitive.name}</h3>
          <p className="mt-1 text-xs text-gray-500">{primitive.description}</p>
          
          <div className="mt-2 flex flex-wrap gap-1">
            <span className={`inline-flex items-center px-2 py-0.5 rounded text-xs font-medium ${categoryColor}`}>
              {primitive.category}
            </span>
            {primitive.tags.slice(0, 2).map(tag => (
              <span 
                key={tag} 
                className="inline-flex items-center px-2 py-0.5 rounded text-xs font-medium bg-gray-100 text-gray-800"
              >
                {tag}
              </span>
            ))}
            {primitive.tags.length > 2 && (
              <span className="inline-flex items-center px-2 py-0.5 rounded text-xs font-medium bg-gray-100 text-gray-800">
                +{primitive.tags.length - 2} more
              </span>
            )}
          </div>
        </div>
      </div>
    </div>
  );
} 