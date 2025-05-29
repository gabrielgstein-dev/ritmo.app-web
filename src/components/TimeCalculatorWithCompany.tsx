'use client';

import { useState, useEffect } from 'react';
import { useCompanies } from '../hooks/useCompanies';
import { timeCalculatorApi } from '../services/api';
import CompanySelector from './CompanySelector';

interface TimeCalculatorWithCompanyProps {
  token: string;
}

export default function TimeCalculatorWithCompany({ token }: TimeCalculatorWithCompanyProps) {
  const [date, setDate] = useState<string>(new Date().toISOString().split('T')[0]);
  const [entryTime, setEntryTime] = useState<string>('');
  const [lunchTime, setLunchTime] = useState<string>('');
  const [returnTime, setReturnTime] = useState<string>('');
  const [exitTime, setExitTime] = useState<string>('');
  const [returnToWorkTime, setReturnToWorkTime] = useState<string>('');
  const [finalExitTime, setFinalExitTime] = useState<string>('');
  const [extraHours, setExtraHours] = useState<string>('');
  const [isExtraTime, setIsExtraTime] = useState<boolean>(false);
  const [loading, setLoading] = useState<boolean>(false);
  const [message, setMessage] = useState<string>('');
  const [error, setError] = useState<string>('');
  
  const { 
    companies, 
    selectedCompany, 
    loading: loadingCompanies, 
    error: errorCompanies, 
    selectCompany 
  } = useCompanies();

  const calculateExitTime = async () => {
    if (!entryTime) return;
    
    try {
      setLoading(true);
      setError('');
      const response = await timeCalculatorApi.calculateExitTime(
        entryTime, 
        { 
          companyId: selectedCompany?.id,
          standardWorkHours: selectedCompany?.workHours,
          standardLunchBreak: selectedCompany?.lunchBreak
        }, 
        token
      );
      setExitTime(response.result.formattedTime);
    } catch (err) {
      setError(err instanceof Error ? err.message : 'Erro ao calcular horário de saída');
    } finally {
      setLoading(false);
    }
  };

  const calculateLunchReturnTime = async () => {
    if (!entryTime || !lunchTime) return;
    
    try {
      setLoading(true);
      setError('');
      const response = await timeCalculatorApi.calculateLunchReturnTime(
        entryTime, 
        lunchTime, 
        { 
          companyId: selectedCompany?.id,
          standardWorkHours: selectedCompany?.workHours,
          standardLunchBreak: selectedCompany?.lunchBreak
        }, 
        token
      );
      setReturnTime(response.result.formattedTime);
    } catch (err) {
      setError(err instanceof Error ? err.message : 'Erro ao calcular horário de retorno do almoço');
    } finally {
      setLoading(false);
    }
  };

  const calculateExitTimeWithLunch = async () => {
    if (!entryTime || !lunchTime || !returnTime) return;
    
    try {
      setLoading(true);
      setError('');
      const response = await timeCalculatorApi.calculateExitTimeWithLunch(
        entryTime, 
        lunchTime, 
        returnTime, 
        { 
          companyId: selectedCompany?.id,
          standardWorkHours: selectedCompany?.workHours,
          standardLunchBreak: selectedCompany?.lunchBreak
        }, 
        token
      );
      setExitTime(response.result.formattedTime);
    } catch (err) {
      setError(err instanceof Error ? err.message : 'Erro ao calcular horário de saída com almoço');
    } finally {
      setLoading(false);
    }
  };

  const calculateExtraHours = async () => {
    if (!entryTime || !lunchTime || !returnTime || !exitTime || !returnToWorkTime || !finalExitTime) return;
    
    try {
      setLoading(true);
      setError('');
      const response = await timeCalculatorApi.calculateExtraHours(
        entryTime,
        lunchTime,
        returnTime,
        exitTime,
        returnToWorkTime,
        finalExitTime,
        { 
          companyId: selectedCompany?.id,
          standardWorkHours: selectedCompany?.workHours,
          standardLunchBreak: selectedCompany?.lunchBreak
        },
        token
      );
      setExtraHours(response.result.formattedTime);
      setIsExtraTime(response.result.isExtra);
    } catch (err) {
      setError(err instanceof Error ? err.message : 'Erro ao calcular horas extras');
    } finally {
      setLoading(false);
    }
  };

  const saveTimeRecord = async () => {
    if (!selectedCompany) {
      setError('Selecione uma empresa');
      return;
    }
    
    if (!date || !entryTime || !lunchTime || !returnTime || !exitTime) {
      setError('Preencha todos os campos obrigatórios');
      return;
    }
    
    try {
      setLoading(true);
      setError('');
      await timeCalculatorApi.saveTimeRecord(
        date,
        entryTime,
        lunchTime,
        returnTime,
        exitTime,
        selectedCompany.id,
        token,
        returnToWorkTime || undefined,
        finalExitTime || undefined
      );
      setMessage('Registro de ponto salvo com sucesso!');
      

      setEntryTime('');
      setLunchTime('');
      setReturnTime('');
      setExitTime('');
      setReturnToWorkTime('');
      setFinalExitTime('');
      setExtraHours('');
      
    } catch (err) {
      setError(err instanceof Error ? err.message : 'Erro ao salvar registro de ponto');
    } finally {
      setLoading(false);
    }
  };


  useEffect(() => {
    if (entryTime) {
      calculateExitTime();
    }
  }, [entryTime, selectedCompany]);

  useEffect(() => {
    if (entryTime && lunchTime) {
      calculateLunchReturnTime();
    }
  }, [lunchTime, selectedCompany]);

  useEffect(() => {
    if (entryTime && lunchTime && returnTime) {
      calculateExitTimeWithLunch();
    }
  }, [returnTime, selectedCompany]);

  useEffect(() => {
    if (entryTime && lunchTime && returnTime && exitTime && returnToWorkTime && finalExitTime) {
      calculateExtraHours();
    }
  }, [finalExitTime, selectedCompany]);


  useEffect(() => {
    if (message) {
      const timer = setTimeout(() => {
        setMessage('');
      }, 5000);
      return () => clearTimeout(timer);
    }
  }, [message]);

  const handleCompanyChange = (companyId: number) => {
    selectCompany(companyId);
  };

  return (
    <div className="max-w-md mx-auto p-6 bg-white rounded-lg shadow-md">
      <h2 className="text-2xl font-bold mb-6 text-center">Calculadora de Ponto</h2>
      
      {/* Seletor de Empresa */}
      <CompanySelector
        onCompanyChange={handleCompanyChange}
        selectedCompanyId={selectedCompany?.id}
        companies={companies}
        loading={loadingCompanies}
        error={errorCompanies}
      />
      
      {/* Mensagem de sucesso */}
      {message && (
        <div className="mb-4 p-2 bg-green-100 text-green-700 rounded">
          {message}
        </div>
      )}
      
      {/* Mensagem de erro */}
      {error && (
        <div className="mb-4 p-2 bg-red-100 text-red-700 rounded">
          {error}
        </div>
      )}
      
      {/* Formulário */}
      <form className="space-y-4">
        {/* Data */}
        <div>
          <label htmlFor="date" className="block mb-1 font-medium">
            Data
          </label>
          <input
            type="date"
            id="date"
            value={date}
            onChange={(e) => setDate(e.target.value)}
            className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
            required
          />
        </div>
        
        {/* Horário de Entrada */}
        <div>
          <label htmlFor="entryTime" className="block mb-1 font-medium">
            Horário de Entrada
          </label>
          <input
            type="time"
            id="entryTime"
            value={entryTime}
            onChange={(e) => setEntryTime(e.target.value)}
            className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
            required
          />
        </div>
        
        {/* Horário de Saída para Almoço */}
        <div>
          <label htmlFor="lunchTime" className="block mb-1 font-medium">
            Saída para Almoço
          </label>
          <input
            type="time"
            id="lunchTime"
            value={lunchTime}
            onChange={(e) => setLunchTime(e.target.value)}
            className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
            required
          />
        </div>
        
        {/* Horário de Retorno do Almoço */}
        <div>
          <label htmlFor="returnTime" className="block mb-1 font-medium">
            Retorno do Almoço
          </label>
          <input
            type="time"
            id="returnTime"
            value={returnTime}
            onChange={(e) => setReturnTime(e.target.value)}
            className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
            required
          />
        </div>
        
        {/* Horário de Saída */}
        <div>
          <label htmlFor="exitTime" className="block mb-1 font-medium">
            Horário de Saída
          </label>
          <input
            type="time"
            id="exitTime"
            value={exitTime}
            onChange={(e) => setExitTime(e.target.value)}
            className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
            required
          />
        </div>
        
        {/* Seção de Horas Extras (opcional) */}
        <div className="pt-4 border-t border-gray-200">
          <h3 className="text-lg font-semibold mb-4">Horas Extras (opcional)</h3>
          
          {/* Horário de Retorno ao Trabalho */}
          <div className="mb-4">
            <label htmlFor="returnToWorkTime" className="block mb-1 font-medium">
              Retorno ao Trabalho
            </label>
            <input
              type="time"
              id="returnToWorkTime"
              value={returnToWorkTime}
              onChange={(e) => setReturnToWorkTime(e.target.value)}
              className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
            />
          </div>
          
          {/* Horário Final de Saída */}
          <div className="mb-4">
            <label htmlFor="finalExitTime" className="block mb-1 font-medium">
              Saída Final
            </label>
            <input
              type="time"
              id="finalExitTime"
              value={finalExitTime}
              onChange={(e) => setFinalExitTime(e.target.value)}
              className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
            />
          </div>
          
          {/* Exibição de Horas Extras */}
          {extraHours && (
            <div className={`p-3 rounded-md ${isExtraTime ? 'bg-green-100' : 'bg-red-100'}`}>
              <p className="font-medium">
                {isExtraTime ? 'Horas extras:' : 'Horas faltantes:'} {extraHours}
              </p>
            </div>
          )}
        </div>
        
        {/* Botão Salvar */}
        <button
          type="button"
          onClick={saveTimeRecord}
          disabled={loading}
          className="w-full py-2 px-4 bg-blue-600 text-white font-semibold rounded-md hover:bg-blue-700 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:ring-offset-2 disabled:opacity-50"
        >
          {loading ? 'Salvando...' : 'Salvar Registro de Ponto'}
        </button>
      </form>
    </div>
  );
}
