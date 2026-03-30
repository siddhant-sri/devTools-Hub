'use client';

import Link from 'next/link';
import { usePathname } from 'next/navigation';
import { Activity, Braces, TerminalSquare, Settings } from 'lucide-react';

const navItems = [
  { name: 'API Tester', href: '/api-tester', icon: Activity },
  { name: 'JSON Tool', href: '/json-tool', icon: Braces },
  { name: 'Log Viewer', href: '/log-viewer', icon: TerminalSquare },
];

export function Sidebar() {
  const pathname = usePathname();

  return (
    <div className="w-16 md:w-56 flex-shrink-0 bg-[#18181b] border-r border-[#27272a] h-screen flex flex-col justify-between transition-all duration-300">
      <div>
        <div className="h-14 flex items-center justify-center md:justify-start md:px-5 border-b border-[#27272a]">
          <span className="text-lg font-bold bg-gradient-to-r from-blue-400 to-indigo-500 bg-clip-text text-transparent hidden md:block tracking-tight">
            DevTools Hub
          </span>
          <span className="text-xl font-black text-blue-500 md:hidden">DH</span>
        </div>
        <nav className="p-2 md:p-3 space-y-1 flex flex-col items-center md:items-stretch mt-2">
          {navItems.map((item) => {
            const isActive = pathname.startsWith(item.href);
            const Icon = item.icon;
            return (
              <Link
                key={item.href}
                href={item.href}
                className={`flex items-center space-x-3 px-3 py-2.5 rounded-lg transition-colors ${
                  isActive
                    ? 'bg-[#27272a] text-blue-400 font-medium'
                    : 'text-zinc-400 hover:text-zinc-100 hover:bg-[#27272a]/50'
                }`}
                title={item.name}
              >
                <Icon className="w-5 h-5 flex-shrink-0" />
                <span className="hidden md:block text-sm">{item.name}</span>
              </Link>
            );
          })}
        </nav>
      </div>
      <div className="p-3 border-t border-[#27272a] flex justify-center md:justify-start">
        <button className="text-zinc-400 hover:text-zinc-100 p-2 rounded-lg hover:bg-[#27272a]/50 transition-colors w-full flex items-center justify-center md:justify-start space-x-3" title="Settings">
          <Settings className="w-5 h-5 flex-shrink-0" />
          <span className="hidden md:block text-sm">Settings</span>
        </button>
      </div>
    </div>
  );
}
