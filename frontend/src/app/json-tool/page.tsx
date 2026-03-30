'use client';

import { useState } from 'react';
import Editor, { DiffEditor } from '@monaco-editor/react';

export default function JsonToolPage() {
  const [activeTab, setActiveTab] = useState<'formatter' | 'diff'>('formatter');
  const [jsonInput, setJsonInput] = useState('{\n  "name": "DevTools Hub",\n  "version": "1.0.0"\n}');
  const [diffOriginal, setDiffOriginal] = useState('{\n  "version": 1,\n  "stable": true\n}');
  const [diffModified, setDiffModified] = useState('{\n  "version": 2,\n  "stable": false,\n  "newFeature": true\n}');

  const formatJson = () => {
    try {
      const parsed = JSON.parse(jsonInput);
      setJsonInput(JSON.stringify(parsed, null, 2));
    } catch (e: any) {
      alert('Invalid JSON: ' + e.message); 
    }
  };

  return (
    <div className="flex h-full w-full bg-[#09090b] text-zinc-100 flex-col">
      <div className="p-4 border-b border-[#27272a] bg-[#18181b] flex items-center justify-between">
        <div className="flex space-x-1 border border-[#27272a] rounded-lg p-1 bg-[#09090b]">
          <button 
            className={`px-4 py-1.5 rounded-md text-sm font-medium transition-colors ${activeTab === 'formatter' ? 'bg-[#27272a] text-blue-400' : 'text-zinc-400 hover:text-zinc-200'}`}
            onClick={() => setActiveTab('formatter')}
          >
            Formatter / Validator
          </button>
          <button 
            className={`px-4 py-1.5 rounded-md text-sm font-medium transition-colors ${activeTab === 'diff' ? 'bg-[#27272a] text-blue-400' : 'text-zinc-400 hover:text-zinc-200'}`}
            onClick={() => setActiveTab('diff')}
          >
            JSON Diff
          </button>
        </div>
        
        {activeTab === 'formatter' ? (
          <button 
            onClick={formatJson}
            className="bg-[#27272a] hover:bg-[#3f3f46] text-zinc-100 px-4 py-1.5 rounded-md text-sm font-medium transition-colors"
          >
            Format JSON
          </button>
        ) : (
          <div className="text-zinc-500 text-sm">Use standard JSON below to compare Original (Left) vs Modified (Right)</div>
        )}
      </div>

      <div className="flex-1 relative bg-[#1e1e1e]">
        {activeTab === 'formatter' ? (
          <Editor
            height="100%"
            defaultLanguage="json"
            theme="vs-dark"
            value={jsonInput}
            onChange={v => setJsonInput(v || '')}
            options={{ 
              minimap: { enabled: false }, 
              fontSize: 14,
              formatOnPaste: true,
            }}
          />
        ) : (
          <DiffEditor
            height="100%"
            language="json"
            theme="vs-dark"
            original={diffOriginal}
            modified={diffModified}
            onMount={(editor) => {
              editor.getOriginalEditor().onDidChangeModelContent(() => {
                 setDiffOriginal(editor.getOriginalEditor().getValue());
              });
              editor.getModifiedEditor().onDidChangeModelContent(() => {
                 setDiffModified(editor.getModifiedEditor().getValue());
              });
            }}
            options={{
              minimap: { enabled: false },
              fontSize: 14,
              renderSideBySide: true,
            }}
          />
        )}
      </div>
    </div>
  );
}
