import { create } from 'zustand';

export interface LogEntry {
  _id?: string;
  level: string;
  message: string;
  serviceName: string;
  context?: any;
  createdAt?: string;
}

interface LogState {
  logs: LogEntry[];
  addLog: (log: LogEntry) => void;
  setLogs: (logs: LogEntry[]) => void;
  clearLogs: () => void;
  isConnected: boolean;
  setConnected: (status: boolean) => void;
}

export const useLogStore = create<LogState>((set) => ({
  logs: [],
  isConnected: false,
  addLog: (log) => set((state) => ({ logs: [log, ...state.logs].slice(0, 500) })), // Keep last 500
  setLogs: (logs) => set({ logs }),
  clearLogs: () => set({ logs: [] }),
  setConnected: (status) => set({ isConnected: status }),
}));
