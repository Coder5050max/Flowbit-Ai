'use client';

import { MoreVertical } from 'lucide-react';
import { usePathname } from 'next/navigation';

export function Header() {
  const pathname = usePathname();
  const title = pathname === '/chat' ? 'Chat with Data' : 'Dashboard';

  return (
    <header className="h-16 border-b border-[#E4E4E9] bg-white flex items-center justify-between px-6">
      <h1 className="text-xl font-semibold text-[#1C1C1C]">{title}</h1>
      <div className="flex items-center gap-3">
        <div className="flex items-center gap-3">
          <div className="w-8 h-8 rounded-full bg-[#43B077] flex items-center justify-center overflow-hidden border border-[#43B077]">
            <div className="w-full h-full bg-[#43B077]"></div>
          </div>
          <div className="text-right">
            <div className="text-sm font-medium text-[#1C1C1C]">Amit Jadhav</div>
            <div className="text-xs text-[#64748B]">Admin</div>
          </div>
        </div>
        <button className="p-1 hover:bg-gray-50 rounded">
          <MoreVertical className="w-5 h-5 text-[#666666]" />
        </button>
      </div>
    </header>
  );
}

