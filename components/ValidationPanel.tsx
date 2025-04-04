'use client';

import { ValidationIssue, ValidationResult } from '../lib/types';

// Extend ValidationIssue with optional suggestions property
interface ExtendedValidationIssue extends ValidationIssue {
  suggestions?: string[];
}

interface ValidationPanelProps {
  validationResult: ValidationResult | null;
}

export default function ValidationPanel({ validationResult }: ValidationPanelProps) {
  if (!validationResult) {
    return (
      <div className="bg-gray-100 rounded-lg p-4 text-center">
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
            d="M9 12l2 2 4-4m6 2a9 9 0 11-18 0 9 9 0 0118 0z" 
          />
        </svg>
        <h3 className="mt-2 text-sm font-medium text-gray-900">No Validation Yet</h3>
        <p className="mt-1 text-sm text-gray-500">Click the Validate button to check your composition for issues.</p>
      </div>
    );
  }

  const { valid, issues } = validationResult;

  const severityColors = {
    error: 'bg-red-100 border-red-300 text-red-800',
    warning: 'bg-yellow-100 border-yellow-300 text-yellow-800',
    info: 'bg-blue-100 border-blue-300 text-blue-800',
  };

  const severityIcons = {
    error: (
      <svg className="h-5 w-5 text-red-500" viewBox="0 0 20 20" fill="currentColor">
        <path fillRule="evenodd" d="M10 18a8 8 0 100-16 8 8 0 000 16zM8.707 7.293a1 1 0 00-1.414-1.414L8.586 10l-1.293 1.293a1 1 0 101.414 1.414L10 11.414l1.293 1.293a1 1 0 001.414-1.414L11.414 10l1.293-1.293a1 1 0 00-1.414-1.414L10 8.586 8.707 7.293z" clipRule="evenodd" />
      </svg>
    ),
    warning: (
      <svg className="h-5 w-5 text-yellow-500" viewBox="0 0 20 20" fill="currentColor">
        <path fillRule="evenodd" d="M8.257 3.099c.765-1.36 2.722-1.36 3.486 0l5.58 9.92c.75 1.334-.213 2.98-1.742 2.98H4.42c-1.53 0-2.493-1.646-1.743-2.98l5.58-9.92zM11 13a1 1 0 11-2 0 1 1 0 012 0zm-1-8a1 1 0 00-1 1v3a1 1 0 002 0V6a1 1 0 00-1-1z" clipRule="evenodd" />
      </svg>
    ),
    info: (
      <svg className="h-5 w-5 text-blue-500" viewBox="0 0 20 20" fill="currentColor">
        <path fillRule="evenodd" d="M18 10a8 8 0 11-16 0 8 8 0 0116 0zm-7-4a1 1 0 11-2 0 1 1 0 012 0zM9 9a1 1 0 000 2v3a1 1 0 001 1h1a1 1 0 100-2v-3a1 1 0 00-1-1H9z" clipRule="evenodd" />
      </svg>
    ),
  };

  // Count issues by severity
  const issueCount = {
    error: issues.filter(issue => issue.severity === 'error').length,
    warning: issues.filter(issue => issue.severity === 'warning').length,
    info: issues.filter(issue => issue.severity === 'info').length,
  };

  return (
    <div>
      <div className={`mb-4 p-3 rounded-lg ${valid ? 'bg-green-100 text-green-800' : 'bg-red-50 text-red-800'}`}>
        {valid ? (
          <div className="flex items-center">
            <svg className="h-5 w-5 text-green-500 mr-2" viewBox="0 0 20 20" fill="currentColor">
              <path fillRule="evenodd" d="M10 18a8 8 0 100-16 8 8 0 000 16zm3.707-9.293a1 1 0 00-1.414-1.414L9 10.586 7.707 9.293a1 1 0 00-1.414 1.414l2 2a1 1 0 001.414 0l4-4z" clipRule="evenodd" />
            </svg>
            <span className="font-medium">Composition is valid!</span>
          </div>
        ) : (
          <div className="flex flex-col">
            <div className="flex items-center">
              <svg className="h-5 w-5 text-red-500 mr-2" viewBox="0 0 20 20" fill="currentColor">
                <path fillRule="evenodd" d="M10 18a8 8 0 100-16 8 8 0 000 16zM8.707 7.293a1 1 0 00-1.414 1.414L8.586 10l-1.293 1.293a1 1 0 101.414 1.414L10 11.414l1.293 1.293a1 1 0 001.414-1.414L11.414 10l1.293-1.293a1 1 0 00-1.414-1.414L10 8.586 8.707 7.293z" clipRule="evenodd" />
              </svg>
              <span className="font-medium">
                Composition has {issues.length} issue{issues.length === 1 ? '' : 's'}
              </span>
            </div>
            
            {/* Summary of issues by severity */}
            {issues.length > 0 && (
              <div className="mt-2 flex flex-wrap gap-2">
                {issueCount.error > 0 && (
                  <span className="inline-flex items-center px-2 py-0.5 rounded text-xs font-medium bg-red-100 text-red-800">
                    {issueCount.error} Error{issueCount.error === 1 ? '' : 's'}
                  </span>
                )}
                {issueCount.warning > 0 && (
                  <span className="inline-flex items-center px-2 py-0.5 rounded text-xs font-medium bg-yellow-100 text-yellow-800">
                    {issueCount.warning} Warning{issueCount.warning === 1 ? '' : 's'}
                  </span>
                )}
                {issueCount.info > 0 && (
                  <span className="inline-flex items-center px-2 py-0.5 rounded text-xs font-medium bg-blue-100 text-blue-800">
                    {issueCount.info} Info
                  </span>
                )}
              </div>
            )}
          </div>
        )}
      </div>

      {issues.length > 0 && (
        <div className="space-y-2 max-h-[300px] overflow-auto">
          {issues.map((issue, index) => {
            // Cast to extended issue type to handle the suggestions property
            const extendedIssue = issue as ExtendedValidationIssue;
            
            return (
              <div 
                key={index}
                className={`p-3 rounded-lg border ${severityColors[issue.severity]}`}
              >
                <div className="flex items-start">
                  <div className="flex-shrink-0 mt-0.5">
                    {severityIcons[issue.severity]}
                  </div>
                  <div className="ml-3">
                    <div className="font-medium flex items-center">
                      {issue.severity.charAt(0).toUpperCase() + issue.severity.slice(1)}
                    </div>
                    <p className="text-sm">{issue.message}</p>
                    {issue.location && (
                      <div className="mt-1 text-xs text-gray-700 bg-gray-50 p-2 rounded">
                        {issue.location.primitiveId && (
                          <div className="flex items-center">
                            <span className="font-medium mr-1">Primitive:</span> 
                            <code className="bg-gray-100 px-1 py-0.5 rounded">{issue.location.primitiveId}</code>
                          </div>
                        )}
                        {issue.location.connectionId && (
                          <div className="flex items-center">
                            <span className="font-medium mr-1">Connection:</span>
                            <code className="bg-gray-100 px-1 py-0.5 rounded">{issue.location.connectionId}</code>
                          </div>
                        )}
                        {issue.location.parameterId && (
                          <div className="flex items-center">
                            <span className="font-medium mr-1">Parameter:</span>
                            <code className="bg-gray-100 px-1 py-0.5 rounded">{issue.location.parameterId}</code>
                          </div>
                        )}
                      </div>
                    )}
                    {extendedIssue.suggestions && extendedIssue.suggestions.length > 0 && (
                      <div className="mt-2">
                        <p className="text-xs font-medium text-gray-700">Suggestions:</p>
                        <ul className="mt-1 text-xs text-gray-600 list-disc list-inside">
                          {extendedIssue.suggestions.map((suggestion: string, idx: number) => (
                            <li key={idx}>{suggestion}</li>
                          ))}
                        </ul>
                      </div>
                    )}
                  </div>
                </div>
              </div>
            );
          })}
        </div>
      )}

      {valid && (
        <div className="text-center mt-4 p-4 bg-green-50 rounded-lg">
          <svg 
            className="mx-auto h-10 w-10 text-green-500" 
            fill="none" 
            viewBox="0 0 24 24" 
            stroke="currentColor" 
            aria-hidden="true"
          >
            <path 
              strokeLinecap="round" 
              strokeLinejoin="round" 
              strokeWidth="2" 
              d="M5 13l4 4L19 7" 
            />
          </svg>
          <h3 className="mt-2 text-sm font-medium text-green-800">Ready to Generate Code</h3>
          <p className="mt-1 text-sm text-green-700">Your composition has passed all validation checks!</p>
        </div>
      )}
    </div>
  );
} 