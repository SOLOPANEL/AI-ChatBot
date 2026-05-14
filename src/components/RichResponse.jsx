import React, { useState } from 'react';
import ReactMarkdown from 'react-markdown';
import { Prism as SyntaxHighlighter } from 'react-syntax-highlighter';
// You can choose any style. 'vsc-dark-plus' is a popular dark theme.
import { vscDarkPlus } from 'react-syntax-highlighter/dist/esm/styles/prism';
import { Check, Copy } from 'lucide-react'; // Assuming you use an icon library like lucide-react (optional)

// --- 1. Custom Code Block Component ---
const CodeBlock = ({ /**node, inline,**/ className, children, ...props }) => {
  const match = /language-(\w+)/.exec(className || '');
  const lang = match ? match[1] : 'text';
  const rawCode = String(children).replace(/\n$/, '');
  
  const [copied, setCopied] = useState(false);

  const handleCopy = () => {
    navigator.clipboard.writeText(rawCode).catch(err => {
      console.error("Could not copy text: ", err)
    });
    setCopied(true);
    setTimeout(() => setCopied(false), 2000); // Reset copied state after 2 seconds
  };

  return (
   <div className="my-6 rounded-xl overflow-hidden relative group shadow-lg border border-white/10">
      {/* Header with language label and copy button */}
      <div className="flex justify-between items-center bg-black/70 p-2 text-xs opacity-80">
        <span className="font-mono">{lang.toUpperCase()}</span>
        <button
          onClick={handleCopy}
          className="flex items-center space-x-1 p-1 rounded-md hover:bg-gray-700 transition-colors"
        >
          {copied ? (
            <Check className="w-4 h-4 text-green-400" />
          ) : (
            <Copy className="italic opacity-80" />
          )}
          <span className="text-sm">
            {copied ? 'Copied!' : 'Copy Code'}
          </span>
        </button>
      </div>

      {/* Syntax Highlighted Code */}
      <SyntaxHighlighter
        {...props}
        style={vscDarkPlus}
        language={lang}
        className="!p-4 !m-0 overflow-x-auto bg-gray-900 text-sm" // Tailwind classes for padding and background
        PreTag="div" // Render as a div instead of a <pre> tag
      >
        {rawCode}
      </SyntaxHighlighter>
    </div>
  );
};

// --- 2. Main RichResponse Component ---
const RichResponse = ({ content }) => {
  return (
    <div className="text-left max-w-3xl">
    <ReactMarkdown
      components={{
        // Override the default <code> rendering with our custom component
        code: CodeBlock,
        
        // Custom styling for standard elements using Tailwind CSS
        p: ({ node, ...props }) => (
          <p className="mb-5 leading-relaxed text-[1.05rem]" {...props} />
        ),
        h1: ({ node, ...props }) => (
          <h1 className="text-2xl font-bold mt-8 mb-4 border-b border-black/20 pb-2" {...props} />
        ),
        h2: ({ node, ...props }) => (
          <h2 className="text-xl font-semibold mt-6 mb-3" {...props} />
        ),
        ul: ({ node, ...props }) => <ul className="list-disc pl-5 mb-4 space-y-1" {...props} />,
        ol: ({ node, ...props }) => <ol className="list-decimal pl-5 mb-4 space-y-1" {...props} />,
        a: ({ node, ...props }) => ( 
          <a 
            className="text-blue-400 hover:text-blue-300 transition-colors underline" 
            target="_blank" 
            rel="noopener noreferrer" 
            {...props} 
          />
        ),
        blockquote: ({ node, ...props }) => (
          <blockquote
            className="
              border-l-4 border-blue-400
              pl-4 py-3
              my-6
              italic
              opacity-80
              bg-white/5
              rounded-r-lg
            "
            {...props}
          />
        ),
        // You can add custom components for tables, block quotes, etc. here
      }}
    >
      {content || "Hurry up I am waiting..."}
    </ReactMarkdown>
  </div>  
  );
};

export default RichResponse;