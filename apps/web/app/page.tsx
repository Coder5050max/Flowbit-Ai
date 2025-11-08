'use client';

import { Sidebar } from '@/components/sidebar';
import { Header } from '@/components/header';
import { Dashboard } from '@/components/dashboard';

export default function Home() {
  return (
    <div className="flex h-screen bg-white">
      <Sidebar />
      <div className="flex-1 flex flex-col overflow-hidden">
        <Header />
        <main className="flex-1 overflow-y-auto bg-white">
          <div className="p-6">
            <Dashboard />
          </div>
        </main>
      </div>
    </div>
  );
}

