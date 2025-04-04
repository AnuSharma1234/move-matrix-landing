'use client';

import { useState } from 'react';

interface CodeDisplayProps {
  code: string | null;
}

export default function CodeDisplay({ code }: CodeDisplayProps) {
  const [copied, setCopied] = useState(false);
  
  if (!code) {
    return (
      <div className="bg-gray-100 rounded-lg p-6 text-center">
        <svg 
          className="mx-auto h-12 w-12 text-gray-400" 
          fill="none" 
          viewBox="0 0 24 24" 
          stroke="currentColor" 
          aria-hidden="true"
        >
          <path 
            strokeLinecap="round" 
            strokeLinejoin="round" 
            strokeWidth="2" 
            d="M10 20l4-16m4 4l4 4-4 4M6 16l-4-4 4-4" 
          />
        </svg>
        <h3 className="mt-2 text-sm font-medium text-gray-900">No Code Generated</h3>
        <p className="mt-1 text-sm text-gray-500">Click the Generate Code button to create Move smart contract code from your composition.</p>
      </div>
    );
  }

  // Function to copy code to clipboard
  const copyToClipboard = () => {
    navigator.clipboard.writeText(code);
    setCopied(true);
    
    // Reset copied state after 2 seconds
    setTimeout(() => {
      setCopied(false);
    }, 2000);
  };
  
  // A simple syntax highlighter for Move code
  const highlightMoveCode = (code: string) => {
    return code
      .replace(
        /(module|struct|fun|public|entry|const|use|has|copy|drop|key|store|vector)/g, 
        '<span class="text-purple-600 font-medium">$1</span>'
      )
      .replace(
        /(if|else|for|while|let|return|abort|assert|acquires|resource|as|friend)/g, 
        '<span class="text-blue-600 font-medium">$1</span>'
      )
      .replace(
        /(u8|u16|u32|u64|u128|u256|bool|address|signer|&|signer|mut|vector)/g, 
        '<span class="text-yellow-600">$1</span>'
      )
      .replace(
        /\/\/.*$/gm, 
        '<span class="text-gray-500">$&</span>'
      )
      .replace(
        /"(?:\\.|[^"\\])*"/g, 
        '<span class="text-green-600">$&</span>'
      )
      .replace(
        /\b(\d+)\b/g, 
        '<span class="text-blue-500">$1</span>'
      )
      .replace(
        /(0x[a-fA-F0-9]+)/g, 
        '<span class="text-blue-500">$1</span>'
      );
  };

  return (
    <div className="space-y-4">
      <div className="flex justify-between items-center mb-4">
        <h2 className="text-lg font-medium text-gray-900">Generated Move Code</h2>
        <button
          onClick={copyToClipboard}
          className={`px-3 py-1 rounded text-sm flex items-center ${
            copied ? 'bg-green-500 text-white' : 'bg-gray-200 hover:bg-gray-300 text-gray-800'
          }`}
        >
          {copied ? (
            <>
              <svg className="w-4 h-4 mr-1" fill="currentColor" viewBox="0 0 20 20">
                <path fillRule="evenodd" d="M16.707 5.293a1 1 0 010 1.414l-8 8a1 1 0 01-1.414 0l-4-4a1 1 0 011.414-1.414L8 12.586l7.293-7.293a1 1 0 011.414 0z" clipRule="evenodd" />
              </svg>
              Copied!
            </>
          ) : (
            <>
              <svg className="w-4 h-4 mr-1" fill="currentColor" viewBox="0 0 20 20">
                <path d="M8 3a1 1 0 011-1h2a1 1 0 110 2H9a1 1 0 01-1-1z" />
                <path d="M6 3a2 2 0 00-2 2v11a2 2 0 002 2h8a2 2 0 002-2V5a2 2 0 00-2-2 3 3 0 01-3 3H9a3 3 0 01-3-3z" />
              </svg>
              Copy Code
            </>
          )}
        </button>
      </div>

      <div className="relative">
        <div className="absolute top-0 right-0 p-2 flex space-x-2">
          {/* Future possible download button */}
        </div>
        
        <div className="bg-gray-900 text-gray-100 p-4 rounded-lg overflow-auto max-h-[500px] text-sm font-mono whitespace-pre">
          <div dangerouslySetInnerHTML={{ __html: highlightMoveCode(code) }} />
        </div>
      </div>

      <div className="mt-4 p-4 bg-blue-50 border border-blue-200 text-blue-800 rounded-lg text-sm">
        <h3 className="font-medium mb-2 flex items-center">
          <svg className="w-5 h-5 mr-1" fill="currentColor" viewBox="0 0 20 20">
            <path fillRule="evenodd" d="M18 10a8 8 0 11-16 0 8 8 0 0116 0zm-7-4a1 1 0 11-2 0 1 1 0 012 0zM9 9a1 1 0 000 2v3a1 1 0 001 1h1a1 1 0 100-2v-3a1 1 0 00-1-1H9z" clipRule="evenodd" />
          </svg>
          How to use this code:
        </h3>
        <ol className="list-decimal pl-5 space-y-1">
          <li>Copy the generated Move module</li>
          <li>Create a new Move file in your Aptos project</li>
          <li>Paste the code and adjust as needed</li>
          <li>Deploy to the Aptos blockchain using the Aptos CLI or SDK</li>
        </ol>
      </div>
    </div>
  );
} 