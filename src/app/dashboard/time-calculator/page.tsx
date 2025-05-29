'use client';

import { useEffect } from 'react';
import { useRouter } from 'next/navigation';
import { useAuth } from '@/hooks/useAuth';
import TimeCalculatorWithCompany from '@/components/TimeCalculatorWithCompany';

export default function TimeCalculatorPage() {
  const { token, isLoading, isAuthenticated } = useAuth();
  const router = useRouter();


  useEffect(() => {
    if (!isLoading && !isAuthenticated) {
      router.push('/login');
    }
  }, [isLoading, isAuthenticated, router]);

  if (isLoading) {
    return <div className="flex justify-center items-center min-h-screen">Carregando...</div>;
  }

  if (!isAuthenticated) {
    return null;
  }

  return (
    <div className="container mx-auto px-4 py-8">
      <h1 className="text-2xl font-bold mb-6 text-center">Calculadora de Ponto</h1>
      
      {token && <TimeCalculatorWithCompany token={token} />}
      
      <div className="mt-8 text-center">
        <button
          onClick={() => router.push('/dashboard/time-records')}
          className="px-4 py-2 bg-blue-600 text-white rounded-md hover:bg-blue-700 focus:outline-none focus:ring-2 focus:ring-blue-500"
        >
          Ver Registros de Ponto
        </button>
      </div>
    </div>
  );
}
