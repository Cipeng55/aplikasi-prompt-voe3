
import React, { useState } from 'react';
import CopyIcon from './icons/CopyIcon';

interface PromptDisplayProps {
  promptText: string;
  title: string;
  isEditable?: boolean;
  onEdit?: (newText: string) => void;
  idSuffix: string; // For unique copy state
}

const PromptDisplay: React.FC<PromptDisplayProps> = ({ 
  promptText, 
  title, 
  isEditable = false, 
  onEdit,
  idSuffix
}) => {
  const [copied, setCopied] = useState(false);

  const handleCopy = async () => {
    if (!promptText) return;
    try {
      await navigator.clipboard.writeText(promptText);
      setCopied(true);
      setTimeout(() => setCopied(false), 2000);
    } catch (err) { // Added braces to correctly scope the catch block
      console.error('Failed to copy text: ', err);
      alert('Failed to copy text. Please try again or copy manually.');
    }
  };

  if (!promptText && !isEditable) { // Don't render if not editable and no prompt text
    return null;
  }

  return (
    <div className="mt-8 p-6 bg-slate-800 rounded-lg shadow-md">
      <div className="flex justify-between items-center mb-3">
        <h3 className="text-lg font-semibold text-purple-400">{title}</h3>
        <button
          onClick={handleCopy}
          disabled={!promptText}
          className={`px-4 py-2 text-sm font-medium rounded-md flex items-center transition-colors duration-150 ease-in-out
            ${copied 
              ? 'bg-green-600 text-white hover:bg-green-700' 
              : 'bg-purple-600 text-white hover:bg-purple-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-offset-slate-800 focus:ring-purple-500'
            }
            disabled:bg-gray-600 disabled:cursor-not-allowed`}
        >
          {copied ? (
            <>
              <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" strokeWidth={1.5} stroke="currentColor" className="w-5 h-5 mr-2">
                <path strokeLinecap="round" strokeLinejoin="round" d="M9 12.75L11.25 15 15 9.75M21 12a9 9 0 11-18 0 9 9 0 0118 0z" />
              </svg>
              Tersalin!
            </>
          ) : (
            <>
              <CopyIcon className="w-5 h-5 mr-2" />
              Salin Prompt
            </>
          )}
        </button>
      </div>
      {isEditable ? (
        <textarea
          value={promptText}
          onChange={(e) => onEdit && onEdit(e.target.value)}
          rows={6}
          className="w-full bg-slate-700 border border-slate-600 rounded-md p-3 text-gray-200 text-sm leading-relaxed focus:ring-purple-500 focus:border-purple-500 placeholder-gray-500"
          placeholder="Prompt akan muncul di sini..."
        />
      ) : (
        <pre className="whitespace-pre-wrap bg-slate-700 p-4 rounded-md text-gray-200 text-sm leading-relaxed overflow-x-auto">
          {promptText || "Prompt akan muncul di sini..."}
        </pre>
      )}
    </div>
  );
};

export default PromptDisplay;
// This component is effectively replaced by inline JSX in App.tsx for better state management of two prompts.
// Keeping it for reference or potential future modularization if needed.