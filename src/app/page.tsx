'use client';

import { useEffect } from 'react';
import { useRouter } from 'next/navigation';
import Link from 'next/link';

export default function Home() {
  const router = useRouter();
  

  useEffect(() => {
    const token = localStorage.getItem('token');
    if (token) {
      router.push('/dashboard');
    }
  }, [router]);
  return (
    <div>
      <header className="bg-blue-600 text-white py-6">
        <div className="container mx-auto px-4">
          <h1 className="text-3xl font-bold text-center">Controle de Ponto</h1>
          <p className="text-center mt-2 text-blue-100">
            Calcule seus horários de trabalho de forma simples e rápida
          </p>
        </div>
      </header>

      <main className="container mx-auto px-4 py-8">
        <div className="max-w-3xl mx-auto">
          <div className="bg-white rounded-lg shadow-md p-6 mb-8">
            <h2 className="text-xl font-semibold mb-4">Como funciona?</h2>
            <p className="mb-3">
              Esta ferramenta ajuda você a calcular os horários de trabalho com base em uma jornada de 8 horas diárias.
            </p>
            <ul className="list-disc pl-5 space-y-2 mb-4">
              <li>Calcule o horário de saída com base no horário de entrada</li>
              <li>Determine o horário de retorno do almoço (considerando 1 hora de intervalo)</li>
              <li>Calcule o horário de saída considerando o intervalo de almoço</li>
              <li>Gerencie múltiplas empresas com configurações personalizadas</li>
              <li>Salve e visualize seus registros de ponto</li>
            </ul>
          </div>
          
          <div className="bg-white rounded-lg shadow-md p-6 text-center">
            <h2 className="text-xl font-semibold mb-4">Comece a usar agora</h2>
            <div className="space-x-4">
              <Link 
                href="/login" 
                className="inline-block px-6 py-3 bg-blue-600 text-white font-medium rounded-md hover:bg-blue-700 focus:outline-none focus:ring-2 focus:ring-blue-500"
              >
                Entrar
              </Link>
              <Link 
                href="/register" 
                className="inline-block px-6 py-3 bg-gray-200 text-gray-800 font-medium rounded-md hover:bg-gray-300 focus:outline-none focus:ring-2 focus:ring-gray-400"
              >
                Registrar
              </Link>
            </div>
          </div>
        </div>
      </main>
    </div>
  );
}
