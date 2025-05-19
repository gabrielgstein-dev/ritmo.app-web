'use client';

import { useState, useEffect, useCallback } from 'react';
import { timeCalculatorApi } from '../services/api';

interface TimeResult {
  hours: number;
  minutes: number;
  formattedTime: string;
}

export default function QuickCalculator() {
  const [entryTime, setEntryTime] = useState('');
  const [exitTime, setExitTime] = useState<TimeResult | null>(null);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');

  const calculateExitTime = useCallback(async () => {
    if (!entryTime) return;
    
    setLoading(true);
    setError('');

    try {
      const data = await timeCalculatorApi.calculateExitTime(entryTime);
      setExitTime(data.result);
    } catch (err) {
      setError('Ocorreu um erro ao calcular o horário de saída.');
      console.error(err);
    } finally {
      setLoading(false);
    }
  }, [entryTime]);

  useEffect(() => {
    if (entryTime) {
      calculateExitTime();
    }
  }, [calculateExitTime, entryTime]);

  return (
    <div className="bg-white rounded-lg shadow-md p-6">
      <h2 className="text-2xl font-bold mb-6 text-center text-blue-700">Calculadora Rápida</h2>
      <p className="text-gray-600 mb-6 text-center">
        Calcule rapidamente seu horário de saída com base no horário de entrada.
      </p>

      <div className="max-w-sm mx-auto">
        <div className="mb-6">
          <label htmlFor="entryTime" className="block mb-2 font-medium text-gray-700">
            Horário de Entrada
          </label>
          <input
            type="time"
            id="entryTime"
            value={entryTime}
            onChange={(e) => setEntryTime(e.target.value)}
            className="w-full px-4 py-3 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500 text-lg"
          />
        </div>

        {loading ? (
          <div className="text-center py-4">
            <div className="inline-block animate-spin rounded-full h-8 w-8 border-t-2 border-b-2 border-blue-500"></div>
            <p className="mt-2 text-gray-600">Calculando...</p>
          </div>
        ) : exitTime ? (
          <div className="bg-blue-50 p-6 rounded-lg text-center">
            <p className="text-gray-700 mb-2">Horário de saída previsto:</p>
            <p className="text-3xl font-bold text-blue-700">{exitTime.formattedTime}</p>
            <p className="text-sm text-gray-500 mt-2">Para completar 8h de trabalho</p>
          </div>
        ) : null}

        {error && (
          <div className="mt-4 p-3 bg-red-100 text-red-700 rounded-md">
            {error}
          </div>
        )}
      </div>
    </div>
  );
}
