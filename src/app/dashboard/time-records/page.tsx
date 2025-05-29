'use client';

import { useEffect } from 'react';
import { useRouter } from 'next/navigation';
import { useAuth } from '@/hooks/useAuth';
import { useCompaniesStore } from '@/stores/useCompaniesStore';
import CompanySelector from '@/components/CompanySelector';
import { useDateRange } from '@/hooks/useDateRange';
import { useTimeRecordsManager } from '@/hooks/useTimeRecordsManager';

export default function TimeRecordsPage() {
  const { isLoading, isAuthenticated } = useAuth();
  const router = useRouter();
  
  const { error: errorCompanies } = useCompaniesStore();
  
  const {
    timeRecords,
    loading: loadingTimeRecords,
    error: errorTimeRecords,
    selectedCompany,
    formatDate,
    calculateWorkedHours,
    handleDeleteRecord,
    fetchTimeRecords
  } = useTimeRecordsManager();
  
  const {
    localStartDate,
    localEndDate,
    handleStartDateChange,
    handleEndDateChange
  } = useDateRange();


  useEffect(() => {
    if (!isLoading && !isAuthenticated) {
      router.push('/login');
    }
  }, [isLoading, isAuthenticated, router]);
  

  useEffect(() => {
    if (selectedCompany) {
      fetchTimeRecords();
    }
  }, [selectedCompany, fetchTimeRecords]);
  

  
  if (isLoading) {
    return <div className="flex justify-center items-center min-h-screen">Carregando...</div>;
  }
  
  if (!isAuthenticated) {
    return null;
  }
  
  return (
    <div className="container mx-auto px-4 py-8">
      <h1 className="text-2xl font-bold mb-6">Registros de Ponto</h1>
      

      {(errorTimeRecords || errorCompanies) && (
        <div className="mb-4 p-3 bg-red-100 text-red-700 rounded-md">
          {errorTimeRecords || errorCompanies}
        </div>
      )}
      
      <div className="mb-6 p-4 bg-gray-50 rounded-md shadow">
        <h2 className="text-lg font-semibold mb-4">Filtros</h2>
        
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">

          <div className="col-span-1 md:col-span-2">
            <CompanySelector />
          </div>
          

          <div>
            <label htmlFor="startDate" className="block mb-1 font-medium">
              Data Inicial
            </label>
            <input
              type="date"
              id="startDate"
              value={localStartDate}
              onChange={(e) => handleStartDateChange(e.target.value)}
              className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
            />
          </div>
          

          <div>
            <label htmlFor="endDate" className="block mb-1 font-medium">
              Data Final
            </label>
            <input
              type="date"
              id="endDate"
              value={localEndDate}
              onChange={(e) => handleEndDateChange(e.target.value)}
              className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
            />
          </div>
        </div>
      </div>
      

      <div className="bg-white rounded-md shadow overflow-hidden">
        {loadingTimeRecords ? (
          <div className="p-8 text-center">Carregando registros...</div>
        ) : timeRecords.length === 0 ? (
          <div className="p-8 text-center text-gray-500">
            Nenhum registro de ponto encontrado para o período selecionado.
          </div>
        ) : (
          <div className="overflow-x-auto">
            <table className="min-w-full divide-y divide-gray-200">
              <thead className="bg-gray-50">
                <tr>
                  <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                    Data
                  </th>
                  <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                    Entrada
                  </th>
                  <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                    Almoço
                  </th>
                  <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                    Retorno
                  </th>
                  <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                    Saída
                  </th>
                  <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                    Retorno Extra
                  </th>
                  <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                    Saída Final
                  </th>
                  <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                    Horas Trabalhadas
                  </th>
                  <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                    Ações
                  </th>
                </tr>
              </thead>
              <tbody className="bg-white divide-y divide-gray-200">
                {timeRecords.map((record) => (
                  <tr key={record.id}>
                    <td className="px-6 py-4 whitespace-nowrap">
                      {formatDate(record.date)}
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap">
                      {record.entryTime}
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap">
                      {record.lunchTime}
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap">
                      {record.returnTime}
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap">
                      {record.exitTime}
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap">
                      {record.returnToWorkTime || '-'}
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap">
                      {record.finalExitTime || '-'}
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap font-medium">
                      {calculateWorkedHours(record)}
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap text-right text-sm font-medium">
                      <button
                        onClick={() => handleDeleteRecord(record.id)}
                        className="text-red-600 hover:text-red-900 ml-2"
                      >
                        Excluir
                      </button>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        )}
      </div>
    </div>
  );
}
