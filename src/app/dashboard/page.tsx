'use client';

import { useState, useEffect, useCallback } from 'react';
import { useRouter } from 'next/navigation';
import Link from 'next/link';
import { useAuth } from '@/hooks/useAuth';
import { useCompanies } from '@/hooks/useCompanies';
import { timeRecordsApi } from '@/services/time-records';

interface TimeRecord {
  id: number;
  date: string;
  entryTime: string;
  lunchTime: string;
  returnTime: string;
  exitTime: string;
  companyId: number;
}

export default function DashboardPage() {
  const { user, token, isLoading, isAuthenticated } = useAuth();
  const router = useRouter();
  
  const { 
    companies, 
    loading: loadingCompanies, 
    error: errorCompanies 
  } = useCompanies();
  
  const [recentRecords, setRecentRecords] = useState<TimeRecord[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  

  useEffect(() => {
    if (!isLoading && !isAuthenticated) {
      router.push('/login');
    }
  }, [isLoading, isAuthenticated, router]);
  

  const fetchRecentRecords = useCallback(async () => {
    if (!token) return;
    
    try {
      setLoading(true);
      setError(null);
      

      const today = new Date();
      const lastWeek = new Date();
      lastWeek.setDate(today.getDate() - 7);
      
      const startDate = lastWeek.toISOString().split('T')[0];
      const endDate = today.toISOString().split('T')[0];
      
      const data = await timeRecordsApi.getTimeRecords(token, undefined, startDate, endDate);
      setRecentRecords(data.slice(0, 5));
    } catch (err) {
      setError(err instanceof Error ? err.message : 'Erro ao carregar registros recentes');
    } finally {
      setLoading(false);
    }
  }, [token]);
  
  useEffect(() => {
    if (token) {
      fetchRecentRecords();
    }
  }, [token, fetchRecentRecords]);
  

  const formatDate = (dateString: string) => {
    const date = new Date(dateString);
    return date.toLocaleDateString('pt-BR');
  };
  
  if (isLoading) {
    return <div className="flex justify-center items-center min-h-screen">Carregando...</div>;
  }
  
  if (!isAuthenticated) {
    return null;
  }
  
  return (
    <div className="container mx-auto px-4 py-8">
      <h1 className="text-2xl font-bold mb-6">Painel de Controle</h1>
      
      {/* Mensagem de boas-vindas */}
      <div className="bg-white p-6 rounded-lg shadow-md mb-6">
        <h2 className="text-xl font-semibold mb-2">Bem-vindo, {user?.name}!</h2>
        <p className="text-gray-600">
          Este é o seu painel de controle para gerenciar seus registros de ponto e empresas.
        </p>
      </div>
      
      {/* Mensagem de erro */}
      {(error || errorCompanies) && (
        <div className="mb-6 p-3 bg-red-100 text-red-700 rounded-md">
          {error || errorCompanies}
        </div>
      )}
      
      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
        {/* Resumo de empresas */}
        <div className="bg-white p-6 rounded-lg shadow-md">
          <div className="flex justify-between items-center mb-4">
            <h2 className="text-lg font-semibold">Suas Empresas</h2>
            <Link 
              href="/dashboard/companies" 
              className="text-blue-600 hover:text-blue-800 text-sm font-medium"
            >
              Ver todas
            </Link>
          </div>
          
          {loadingCompanies ? (
            <p>Carregando empresas...</p>
          ) : companies.length === 0 ? (
            <div>
              <p className="text-gray-600 mb-4">Você ainda não tem empresas cadastradas.</p>
              <Link
                href="/dashboard/companies"
                className="inline-block px-4 py-2 bg-blue-600 text-white rounded-md hover:bg-blue-700"
              >
                Adicionar Empresa
              </Link>
            </div>
          ) : (
            <div className="space-y-3">
              {companies.slice(0, 3).map((company) => (
                <div key={company.id} className="p-3 border rounded-md hover:bg-gray-50">
                  <h3 className="font-medium">{company.name}</h3>
                  <p className="text-sm text-gray-600">
                    Jornada: {company.workHours}h • Almoço: {company.lunchBreak}h
                  </p>
                </div>
              ))}
              
              {companies.length > 3 && (
                <p className="text-sm text-gray-600">
                  + {companies.length - 3} outras empresas
                </p>
              )}
            </div>
          )}
        </div>
        
        {/* Registros recentes */}
        <div className="bg-white p-6 rounded-lg shadow-md">
          <div className="flex justify-between items-center mb-4">
            <h2 className="text-lg font-semibold">Registros Recentes</h2>
            <Link 
              href="/dashboard/time-records" 
              className="text-blue-600 hover:text-blue-800 text-sm font-medium"
            >
              Ver todos
            </Link>
          </div>
          
          {loading ? (
            <p>Carregando registros...</p>
          ) : recentRecords.length === 0 ? (
            <div>
              <p className="text-gray-600 mb-4">Você ainda não tem registros de ponto.</p>
              <Link
                href="/dashboard/time-calculator"
                className="inline-block px-4 py-2 bg-blue-600 text-white rounded-md hover:bg-blue-700"
              >
                Registrar Ponto
              </Link>
            </div>
          ) : (
            <div className="space-y-3">
              {recentRecords.map((record) => {
                const company = companies.find(c => c.id === record.companyId);
                
                return (
                  <div key={record.id} className="p-3 border rounded-md hover:bg-gray-50">
                    <div className="flex justify-between">
                      <span className="font-medium">{formatDate(record.date)}</span>
                      <span className="text-sm text-gray-600">{company?.name || 'Empresa não encontrada'}</span>
                    </div>
                    <p className="text-sm text-gray-600">
                      Entrada: {record.entryTime} • Saída: {record.exitTime}
                    </p>
                  </div>
                );
              })}
            </div>
          )}
        </div>
      </div>
      
      {/* Ações rápidas */}
      <div className="mt-8">
        <h2 className="text-lg font-semibold mb-4">Ações Rápidas</h2>
        <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 gap-4">
          <Link
            href="/dashboard/time-calculator"
            className="bg-blue-600 text-white p-4 rounded-lg shadow-md hover:bg-blue-700 text-center"
          >
            Registrar Ponto
          </Link>
          <Link
            href="/dashboard/time-records"
            className="bg-green-600 text-white p-4 rounded-lg shadow-md hover:bg-green-700 text-center"
          >
            Ver Registros
          </Link>
          <Link
            href="/dashboard/companies"
            className="bg-purple-600 text-white p-4 rounded-lg shadow-md hover:bg-purple-700 text-center"
          >
            Gerenciar Empresas
          </Link>
        </div>
      </div>
    </div>
  );
}
