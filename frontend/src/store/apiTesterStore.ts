import { create } from 'zustand';

export interface Header {
  key: string;
  value: string;
  active: boolean;
}

export interface QueryParam {
  key: string;
  value: string;
  active: boolean;
}

interface ApiTesterState {
  url: string;
  method: string;
  headers: Header[];
  params: QueryParam[];
  body: string;
  response: any;
  responseHeaders: any;
  status: number | null;
  statusText: string | null;
  timeMs: number | null;
  isLoading: boolean;
  
  setUrl: (url: string) => void;
  setMethod: (method: string) => void;
  setHeaders: (headers: Header[]) => void;
  setParams: (params: QueryParam[]) => void;
  setBody: (body: string) => void;
  setLoading: (isLoading: boolean) => void;
  setResult: (result: { response: any, responseHeaders: any, status: number, statusText: string, timeMs: number }) => void;
}

export const useApiTesterStore = create<ApiTesterState>((set) => ({
  url: 'https://jsonplaceholder.typicode.com/todos/1',
  method: 'GET',
  headers: [{ key: 'Content-Type', value: 'application/json', active: true }],
  params: [{ key: '', value: '', active: false }],
  body: '{\n  \n}',
  response: null,
  responseHeaders: null,
  status: null,
  statusText: null,
  timeMs: null,
  isLoading: false,

  setUrl: (url) => set({ url }),
  setMethod: (method) => set({ method }),
  setHeaders: (headers) => set({ headers }),
  setParams: (params) => set({ params }),
  setBody: (body) => set({ body }),
  setLoading: (isLoading) => set({ isLoading }),
  setResult: (result) => set({ ...result, isLoading: false })
}));
