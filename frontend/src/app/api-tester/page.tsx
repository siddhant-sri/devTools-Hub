'use client';

import { useApiTesterStore } from '@/store/apiTesterStore';
import { Play, Plus, Trash2 } from 'lucide-react';
import { useState } from 'react';
import Editor, { useMonaco } from '@monaco-editor/react';
import axios from 'axios';

export default function ApiTesterPage() {
  const store = useApiTesterStore();
  const [activeTab, setActiveTab] = useState<'params' | 'headers' | 'body'>('params');

  const handleSend = async () => {
    store.setLoading(true);
    try {
      // transform headers & params
      const headersObj = store.headers.reduce((acc, h) => {
        if (h.key && h.active) acc[h.key] = h.value;
        return acc;
      }, {} as any);
      
      const paramsObj = store.params.reduce((acc, p) => {
        if (p.key && p.active) acc[p.key] = p.value;
        return acc;
      }, {} as any);

      // We hit our backend proxy to avoid CORS
      const apiUrl = process.env.NEXT_PUBLIC_API_URL;
      if (!apiUrl) throw new Error('API URL is not defined in environment variables');
      const res = await axios.post(`${apiUrl}/proxy`, {
        url: store.url,
        method: store.method,
        headers: headersObj,
        params: paramsObj,
        body: store.body ? JSON.parse(store.body) : undefined
      });

      store.setResult({
        response: res.data.data,
        responseHeaders: res.data.headers,
        status: res.data.status,
        statusText: res.data.statusText,
        timeMs: res.data.timeMs
      });

    } catch (e: any) {
      store.setResult({
        response: e.response?.data || e.message,
        responseHeaders: e.response?.headers || {},
        status: e.response?.status || 500,
        statusText: e.response?.statusText || 'Error',
        timeMs: 0
      });
    }
  };

  const getStatusColor = (status: number | null) => {
    if (!status) return 'text-zinc-500';
    if (status >= 200 && status < 300) return 'text-emerald-500';
    if (status >= 300 && status < 400) return 'text-blue-500';
    if (status >= 400 && status < 500) return 'text-amber-500';
    return 'text-red-500';
  };

  return (
    <div className="flex h-full w-full bg-[#09090b] text-zinc-100 flex-col">
      <div className="p-4 border-b border-[#27272a] bg-[#18181b] flex items-center space-x-2">
        <select 
          className="bg-[#27272a] text-blue-400 font-bold px-3 py-2 rounded-md outline-none border border-transparent focus:border-blue-500"
          value={store.method}
          onChange={e => store.setMethod(e.target.value)}
        >
          {['GET', 'POST', 'PUT', 'PATCH', 'DELETE'].map(m => (
            <option key={m} value={m}>{m}</option>
          ))}
        </select>
        <input 
          type="text" 
          placeholder="Enter request URL"
          className="flex-1 bg-[#09090b] border border-[#27272a] px-4 py-2 rounded-md outline-none focus:border-blue-500 text-zinc-100"
          value={store.url}
          onChange={e => store.setUrl(e.target.value)}
          onKeyDown={e => e.key === 'Enter' && handleSend()}
        />
        <button 
          onClick={handleSend}
          disabled={store.isLoading}
          className="bg-blue-600 hover:bg-blue-500 text-white px-5 py-2 rounded-md font-medium flex items-center shadow-lg shadow-blue-500/20 transition-all disabled:opacity-50"
        >
          {store.isLoading ? (
             <span className="w-5 h-5 border-2 border-white/30 border-t-white rounded-full animate-spin mr-2" />
          ) : (
             <Play className="w-4 h-4 mr-2" fill="currentColor" />
          )}
          Send
        </button>
      </div>

      <div className="flex flex-1 overflow-hidden">
        {/* Left Side: Request */}
        <div className="w-1/2 flex flex-col border-r border-[#27272a]">
          <div className="flex border-b border-[#27272a] px-2 bg-[#18181b]">
            {(['params', 'headers', 'body'] as const).map(tab => (
              <button
                key={tab}
                onClick={() => setActiveTab(tab)}
                className={`py-2 px-4 text-sm font-medium border-b-2 transition-colors ${
                  activeTab === tab 
                    ? 'border-blue-500 text-blue-400' 
                    : 'border-transparent text-zinc-400 hover:text-zinc-200'
                }`}
              >
                {tab.charAt(0).toUpperCase() + tab.slice(1)}
              </button>
            ))}
          </div>
          
          <div className="flex-1 overflow-auto bg-[#09090b] p-4 relative">
             {activeTab === 'params' && (
                <div className="space-y-2">
                  <div className="text-xs font-semibold text-zinc-500 mb-2 uppercase tracking-wider">Query Parameters</div>
                  {store.params.map((p, i) => (
                    <div key={i} className="flex space-x-2 items-center">
                      <input type="checkbox" checked={p.active} onChange={e => {
                        const newP = [...store.params];
                        newP[i].active = e.target.checked;
                        store.setParams(newP);
                      }} />
                      <input className="flex-1 bg-[#18181b] border border-[#27272a] px-3 py-1.5 rounded text-sm text-zinc-200 outline-none focus:border-blue-500" placeholder="Key" value={p.key} onChange={e => {
                        const newP = [...store.params];
                        newP[i].key = e.target.value;
                        store.setParams(newP);
                      }} />
                      <input className="flex-1 bg-[#18181b] border border-[#27272a] px-3 py-1.5 rounded text-sm text-zinc-200 outline-none focus:border-blue-500" placeholder="Value" value={p.value} onChange={e => {
                        const newP = [...store.params];
                        newP[i].value = e.target.value;
                        store.setParams(newP);
                      }} />
                      <button onClick={() => {
                        store.setParams(store.params.filter((_, idx) => idx !== i));
                      }} className="p-1 text-zinc-500 hover:text-red-400">
                        <Trash2 className="w-4 h-4" />
                      </button>
                    </div>
                  ))}
                  <button onClick={() => store.setParams([...store.params, { key: '', value: '', active: true }])} className="text-sm flex items-center text-blue-400 hover:text-blue-300 mt-2">
                    <Plus className="w-4 h-4 mr-1" /> Add Param
                  </button>
                </div>
             )}
             {activeTab === 'headers' && (
                <div className="space-y-2">
                  <div className="text-xs font-semibold text-zinc-500 mb-2 uppercase tracking-wider">Headers</div>
                  {store.headers.map((h, i) => (
                    <div key={i} className="flex space-x-2 items-center">
                      <input type="checkbox" checked={h.active} onChange={e => {
                        const newH = [...store.headers];
                        newH[i].active = e.target.checked;
                        store.setHeaders(newH);
                      }} />
                      <input className="flex-1 bg-[#18181b] border border-[#27272a] px-3 py-1.5 rounded text-sm text-zinc-200 outline-none focus:border-blue-500" placeholder="Key" value={h.key} onChange={e => {
                        const newH = [...store.headers];
                        newH[i].key = e.target.value;
                        store.setHeaders(newH);
                      }} />
                      <input className="flex-1 bg-[#18181b] border border-[#27272a] px-3 py-1.5 rounded text-sm text-zinc-200 outline-none focus:border-blue-500" placeholder="Value" value={h.value} onChange={e => {
                        const newH = [...store.headers];
                        newH[i].value = e.target.value;
                        store.setHeaders(newH);
                      }} />
                      <button onClick={() => {
                        store.setHeaders(store.headers.filter((_, idx) => idx !== i));
                      }} className="p-1 text-zinc-500 hover:text-red-400">
                        <Trash2 className="w-4 h-4" />
                      </button>
                    </div>
                  ))}
                  <button onClick={() => store.setHeaders([...store.headers, { key: '', value: '', active: true }])} className="text-sm flex items-center text-blue-400 hover:text-blue-300 mt-2">
                    <Plus className="w-4 h-4 mr-1" /> Add Header
                  </button>
                </div>
             )}
             {activeTab === 'body' && (
                <div className="absolute inset-0 pt-2 bg-[#1e1e1e]">
                  <Editor
                    height="100%"
                    defaultLanguage="json"
                    theme="vs-dark"
                    value={store.body}
                    onChange={v => store.setBody(v || '')}
                    options={{ minimap: { enabled: false }, fontSize: 13, wordWrap: 'on' }}
                  />
                </div>
             )}
          </div>
        </div>

        {/* Right Side: Response */}
        <div className="w-1/2 flex flex-col bg-[#09090b]">
          <div className="flex border-b border-[#27272a] px-4 py-2 bg-[#18181b] justify-between items-center h-10">
            <div className="text-sm font-medium text-zinc-300">Response</div>
            {store.status && (
              <div className="flex space-x-4 text-xs font-mono">
                <div className="flex space-x-1">
                  <span className="text-zinc-500">Status:</span>
                  <span className={`${getStatusColor(store.status)} font-bold`}>{store.status} {store.statusText}</span>
                </div>
                <div className="flex space-x-1">
                  <span className="text-zinc-500">Time:</span>
                  <span className="text-emerald-400">{store.timeMs}ms</span>
                </div>
              </div>
            )}
          </div>
          <div className="flex-1 relative bg-[#1e1e1e]">
            {!store.response && !store.isLoading && (
              <div className="absolute inset-0 flex items-center justify-center text-zinc-500 bg-[#09090b]">
                Hit Send to get a response
              </div>
            )}
            {store.response && (
              <Editor
                height="100%"
                defaultLanguage="json"
                theme="vs-dark"
                value={typeof store.response === 'string' ? store.response : JSON.stringify(store.response, null, 2)}
                options={{ minimap: { enabled: false }, readOnly: true, fontSize: 13, wordWrap: 'on' }}
              />
            )}
          </div>
        </div>
      </div>
    </div>
  );
}
