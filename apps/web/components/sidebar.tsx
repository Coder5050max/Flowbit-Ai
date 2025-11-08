'use client';

import Link from 'next/link';
import { usePathname } from 'next/navigation';
import { Home, FileText, Folder, Building, Users, Settings, MessageSquare, ChevronsUpDown } from 'lucide-react';
import { cn } from '@/lib/utils';

const navigation = [
  { name: 'Dashboard', href: '/', icon: Home },
  { name: 'Chat with Data', href: '/chat', icon: MessageSquare },
  { name: 'Invoice', href: '/invoice', icon: FileText },
  { name: 'Other files', href: '/files', icon: Folder },
  { name: 'Departments', href: '/departments', icon: Building },
  { name: 'Users', href: '/users', icon: Users },
  { name: 'Settings', href: '/settings', icon: Settings },
];

export function Sidebar() {
  const pathname = usePathname();

  return (
    <div className="flex flex-col h-screen w-64 bg-white border-r border-[#E4E4E9]">
      {/* Logo and Organization Header */}
      <div className="p-4 border-b border-[#E4E4E9]">
        <div className="flex items-center gap-3 p-2 rounded-lg">
          <div className="w-10 h-10 bg-[#0050AA] rounded-lg flex items-center justify-center flex-shrink-0">
            <span className="text-white font-bold text-sm">L</span>
          </div>
          <div className="flex-1 min-w-0">
            <div className="text-sm font-semibold text-[#1C1C1C]">Buchhaltung</div>
            <div className="text-xs text-[#64748B]">12 members</div>
          </div>
          <ChevronsUpDown className="w-4 h-4 text-[#64748B] flex-shrink-0" />
        </div>
      </div>

      {/* Navigation */}
      <nav className="flex-1 p-2">
        <div className="text-xs font-medium text-[#1C1C1C] uppercase tracking-[0.16em] mb-2 px-3">
          GENERAL
        </div>
        <div className="space-y-1">
          {navigation.map((item) => {
            const isActive = (item.href === '/' && pathname === '/') || (item.href !== '/' && pathname === item.href);
            const Icon = item.icon;
            return (
              <Link
                key={item.name}
                href={item.href}
                className={cn(
                  'flex items-center gap-3 px-3 py-1.5 rounded-lg text-base transition-colors',
                  isActive
                    ? 'bg-[#E3E6F0] text-[#1B1464] font-semibold'
                    : 'text-[#64748B] font-medium hover:bg-gray-50'
                )}
              >
                <Icon className="w-5 h-5 flex-shrink-0" />
                {item.name}
              </Link>
            );
          })}
        </div>
      </nav>

      {/* Separator */}
      <div className="border-t border-[#E4E4E9]"></div>
    </div>
  );
}

