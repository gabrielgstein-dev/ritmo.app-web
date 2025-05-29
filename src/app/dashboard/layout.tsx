'use client';

import { ReactNode } from 'react';
import DashboardNavbar from '@/components/DashboardNavbar';
import { AuthProvider } from '@/contexts/AuthContext';

interface DashboardLayoutProps {
  children: ReactNode;
}

export default function DashboardLayout({ children }: DashboardLayoutProps) {
  return (
    <AuthProvider>
      <div className="min-h-screen flex flex-col bg-gray-50">
        <DashboardNavbar />
        <main className="flex-grow py-6">
          {children}
        </main>
        <footer className="bg-white shadow-inner py-4">
          <div className="container mx-auto px-4 text-center text-gray-600 text-sm">
            &copy; {new Date().getFullYear()} Sistema de Controle de Ponto - Todos os direitos reservados
          </div>
        </footer>
      </div>
    </AuthProvider>
  );
}
