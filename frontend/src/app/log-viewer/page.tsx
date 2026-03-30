'use client';

import { useEffect, useState } from 'react';
import { useLogStore } from '@/store/logStore';
import { io, Socket } from 'socket.io-client';
import { format } from 'date-fns';
import { Filter, Pause, Play, Trash2 } from 'lucide-react';
import axios from 'axios';

let socket: Socket | null = null;
 
export default function LogViewerPage() {
  const store = useLogStore();
  const [isPaused, setIsPaused] = useState(false);
  const [filterLevel, setFilterLevel] = useState('all');
  const [search, setSearch] = useState('');

  useEffect(() => {
    const apiUrl = process.env.NEXT_PUBLIC_API_URL;
    if (!apiUrl) {
      console.error("API URL is not defined in environment variables");
      return;
    }

    // Initial fetch of logs
    axios.get(`${apiUrl}/logs`).then(res => {
      store.setLogs(res.data);
    }).catch(() => console.error("Initial logs fetch failed"));

    // Socket setup
    socket = io(apiUrl);

    socket.on('connect', () => {
      store.setConnected(true);
    });

    socket.on('disconnect', () => {
      store.setConnected(false);
    });

    return () => {
      socket?.disconnect();
    };
  }, []);

  useEffect(() => {
    if (!socket) return;
    
    const handleNewLog = (log: any) => {
      if (!isPaused) {
        store.addLog(log);
      }
    };

    socket.on('new_log', handleNewLog);

    return () => {
      socket?.off('new_log', handleNewLog);
    };
  }, [isPaused, store]);

  const filteredLogs = store.logs.filter(log => {
    if (filterLevel !== 'all' && log.level !== filterLevel) return false;
    if (search && !log.message.toLowerCase().includes(search.toLowerCase()) && !log.serviceName.toLowerCase().includes(search.toLowerCase())) return false;
    return true;
  });

  const getLevelColor = (level: string) => {
    switch (level) {
      case 'info': return 'text-blue-400 bg-blue-400/10 border border-blue-400/20';
      case 'warning': return 'text-amber-400 bg-amber-400/10 border border-amber-400/20';
      case 'error': return 'text-red-400 bg-red-400/10 border border-red-400/20';
      default: return 'text-zinc-400 bg-zinc-400/10 border border-zinc-400/20';
    }
  };

  const getRowHeaderColor = (level: string) => {
    switch (level) {
      case 'error': return 'bg-red-500/10 border-l-[3px] border-l-red-500';
      case 'warning': return 'bg-amber-500/5 border-l-[3px] border-l-amber-500';
      default: return 'border-l-[3px] border-l-transparent hover:bg-[#27272a]/20';
    }
  };

  return (
    <div className="flex flex-col h-full w-full bg-[#09090b] text-zinc-100">
       <div className="p-4 border-b border-[#27272a] bg-[#18181b] flex items-center justify-between">
          <div className="flex space-x-3 items-center">
            <div className="relative">
              <input 
                type="text" 
                placeholder="Search logs..." 
                value={search}
                onChange={e => setSearch(e.target.value)}
                className="pl-9 pr-4 py-1.5 bg-[#09090b] border border-[#27272a] rounded-md text-sm outline-none focus:border-blue-500 w-64 text-zinc-200"
              />
              <Filter className="w-4 h-4 text-zinc-500 absolute left-3 top-2" />
            </div>

            <select 
              value={filterLevel} 
              onChange={e => setFilterLevel(e.target.value)}
              className="bg-[#09090b] border border-[#27272a] px-3 py-1.5 rounded-md text-sm text-zinc-200 outline-none focus:border-blue-500 cursor-pointer"
            >
              <option value="all">All Levels</option>
              <option value="info">Info</option>
              <option value="warning">Warning</option>
              <option value="error">Error</option>
            </select>
          </div>

          <div className="flex space-x-3 items-center">
            <div className="flex items-center space-x-2 mr-4">
              <div className={`w-2 h-2 rounded-full ${store.isConnected ? 'bg-emerald-500 shadow-[0_0_8px_rgba(16,185,129,0.8)]' : 'bg-red-500'} transition-colors`} />
              <span className="text-sm text-zinc-500 font-medium tracking-wide uppercase">{store.isConnected ? 'Connected' : 'Disconnected'}</span>
            </div>

            <button 
              onClick={() => setIsPaused(!isPaused)}
              className={`flex items-center space-x-1.5 px-3 py-1.5 rounded-md text-sm font-medium transition-colors ${
                isPaused ? 'bg-amber-500/20 text-amber-500 hover:bg-amber-500/30' : 'bg-[#27272a] text-zinc-300 hover:bg-[#3f3f46]'
              }`}
            >
              {isPaused ? <Play className="w-4 h-4" /> : <Pause className="w-4 h-4" />}
              <span>{isPaused ? 'Resume' : 'Pause'}</span>
            </button>
            <button 
              onClick={store.clearLogs}
              className="flex items-center space-x-1.5 px-3 py-1.5 rounded-md text-sm font-medium bg-[#27272a] text-zinc-300 hover:bg-red-500/20 hover:text-red-400 transition-colors"
            >
              <Trash2 className="w-4 h-4" />
              <span>Clear</span>
            </button>
          </div>
       </div>

       <div className="flex-1 overflow-auto bg-[#09090b]">
         <table className="w-full text-left text-sm whitespace-nowrap">
           <thead className="bg-[#141417] sticky top-0 z-10 border-b border-[#27272a] text-zinc-500 shadow-sm">
             <tr>
               <th className="px-4 py-3 font-semibold text-xs uppercase tracking-wider w-48">Timestamp</th>
               <th className="px-4 py-3 font-semibold text-xs uppercase tracking-wider w-24">Level</th>
               <th className="px-4 py-3 font-semibold text-xs uppercase tracking-wider w-40 truncate">Service</th>
               <th className="px-4 py-3 font-semibold text-xs uppercase tracking-wider">Message</th>
             </tr>
           </thead>
           <tbody className="divide-y divide-[#27272a]/50 text-zinc-300 font-mono text-[13px]">
              {filteredLogs.length === 0 ? (
                <tr>
                  <td colSpan={4} className="px-4 py-16 text-center text-zinc-600 font-sans flex flex-col items-center">
                    <div className="w-16 h-16 border-4 border-[#27272a] border-t-zinc-600 rounded-full animate-spin mb-4" />
                    <div>Waiting for logs...</div>
                  </td>
                </tr>
              ) : (
                filteredLogs.map(log => (
                  <tr key={log._id || Math.random().toString()} className={`transition-colors ${getRowHeaderColor(log.level)}`}>
                    <td className="px-4 py-2.5 text-zinc-500">
                      {log.createdAt ? format(new Date(log.createdAt), 'MMM dd, HH:mm:ss.SSS') : ''}
                    </td>
                    <td className="px-4 py-2.5">
                       <span className={`px-2 py-0.5 rounded-md text-[11px] font-bold uppercase tracking-wider ${getLevelColor(log.level)}`}>
                         {log.level}
                       </span>
                    </td>
                    <td className="px-4 py-2.5 truncate text-indigo-400/80 font-medium">{log.serviceName}</td>
                    <td className="px-4 py-2.5 whitespace-pre-wrap break-all text-zinc-300 leading-relaxed">
                      {log.message}
                    </td>
                  </tr>
                ))
              )}
           </tbody>
         </table>
       </div>
    </div>
  );
}
