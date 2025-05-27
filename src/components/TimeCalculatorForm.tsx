'use client';

import { useState, useEffect, useCallback } from 'react';

interface TimeResult {
  hours: number;
  minutes: number;
  formattedTime: string;
}

interface ExtraHoursResult {
  extraHours: number;
  extraMinutes: number;
  formattedTime: string;
  isExtra: boolean;
}

interface CalculationResult {
  exitTime: TimeResult | null;
  lunchReturnTime: TimeResult | null;
  exitTimeWithLunch: TimeResult | null;
  extraHours: ExtraHoursResult | null;
}

export default function TimeCalculatorForm() {
  const [entryTime, setEntryTime] = useState('');
  const [lunchTime, setLunchTime] = useState('');
  const [returnTime, setReturnTime] = useState('');
  const [exitTime, setExitTime] = useState('');
  const [returnToWorkTime, setReturnToWorkTime] = useState('');
  const [finalExitTime, setFinalExitTime] = useState('');
  const [showExtraFields, setShowExtraFields] = useState(false);
  
  const [results, setResults] = useState<CalculationResult>({
    exitTime: null,
    lunchReturnTime: null,
    exitTimeWithLunch: null,
    extraHours: null
  });
  const [error, setError] = useState('');

  const calculateExitTime = useCallback(async () => {
    if (!entryTime) return;
    

    setError('');

    try {
      const response = await fetch('http://localhost:3001/time-calculator/exit-time', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({ entryTime }),
      });

      if (!response.ok) {
        throw new Error('Erro ao calcular horário de saída');
      }

      const data = await response.json();
      setResults(prev => ({ ...prev, exitTime: data.result }));
    } catch (err) {
      setError('Ocorreu um erro ao calcular o horário de saída.');
      console.error(err);
    }
  }, [entryTime]);

  const calculateLunchReturnTime = useCallback(async () => {
    if (!entryTime || !lunchTime) return;
    

    setError('');

    try {
      const response = await fetch('http://localhost:3001/time-calculator/lunch-return-time', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({ entryTime, lunchTime }),
      });

      if (!response.ok) {
        throw new Error('Erro ao calcular horário de retorno do almoço');
      }

      const data = await response.json();
      setResults(prev => ({ ...prev, lunchReturnTime: data.result }));
    } catch (err) {
      setError('Ocorreu um erro ao calcular o horário de retorno do almoço.');
      console.error(err);
    }
  }, [entryTime, lunchTime]);

  const calculateExitTimeWithLunch = useCallback(async () => {
    if (!entryTime || !lunchTime || !returnTime) return;
    

    setError('');

    try {
      const response = await fetch('http://localhost:3001/time-calculator/exit-time-with-lunch', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({ entryTime, lunchTime, returnTime }),
      });

      if (!response.ok) {
        throw new Error('Erro ao calcular horário de saída com almoço');
      }

      const data = await response.json();
      setResults(prev => ({ ...prev, exitTimeWithLunch: data.result }));
      
      // Definir automaticamente o horário de saída calculado
      if (data.result) {
        setExitTime(data.result.formattedTime);
      }
    } catch (err) {
      setError('Ocorreu um erro ao calcular o horário de saída considerando o almoço.');
      console.error(err);
    }
  }, [entryTime, lunchTime, returnTime]);
  
  const calculateExtraHours = useCallback(async () => {
    if (!entryTime || !lunchTime || !returnTime || !exitTime || !returnToWorkTime || !finalExitTime) return;
    

    setError('');

    try {
      const response = await fetch('http://localhost:3001/time-calculator/extra-hours', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({ 
          entryTime, 
          lunchTime, 
          returnTime, 
          exitTime, 
          returnToWorkTime, 
          finalExitTime 
        }),
      });

      if (!response.ok) {
        throw new Error('Erro ao calcular horas extras');
      }

      const data = await response.json();
      setResults(prev => ({ ...prev, extraHours: data.result }));
    } catch (err) {
      setError('Ocorreu um erro ao calcular as horas extras.');
      console.error(err);
    }
  }, [entryTime, lunchTime, returnTime, exitTime, returnToWorkTime, finalExitTime]);
  
  // Calcular horário de saída quando o horário de entrada for preenchido
  useEffect(() => {
    if (entryTime) {
      calculateExitTime();
    }
  }, [calculateExitTime, entryTime]);

  // Calcular horário de retorno do almoço quando o horário de saída para almoço for preenchido
  useEffect(() => {
    if (entryTime && lunchTime) {
      calculateLunchReturnTime();
    }
  }, [calculateLunchReturnTime, entryTime, lunchTime]);

  // Calcular horário de saída com almoço quando o horário de retorno do almoço for preenchido
  useEffect(() => {
    if (entryTime && lunchTime && returnTime) {
      calculateExitTimeWithLunch();
    }
  }, [calculateExitTimeWithLunch, entryTime, lunchTime, returnTime]);
  
  // Calcular horas extras quando todos os campos necessários estiverem preenchidos
  useEffect(() => {
    if (entryTime && lunchTime && returnTime && exitTime && returnToWorkTime && finalExitTime) {
      calculateExtraHours();
    }
  }, [calculateExtraHours, entryTime, lunchTime, returnTime, exitTime, returnToWorkTime, finalExitTime]);

  return (
    <div className="w-full max-w-md mx-auto bg-white p-6 rounded-lg shadow-md">
      <div className="mb-6">
        <h2 className="text-xl font-semibold mb-4">Registre seus horários</h2>
        <p className="text-gray-600 text-sm mb-4">
          Preencha os campos abaixo e os cálculos serão feitos automaticamente.
        </p>
      </div>

      <div className="space-y-4">
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
          />
        </div>

        {results.exitTime && (
          <div className="p-3 bg-blue-50 rounded-md">
            <p className="font-medium">Horário de saída previsto:</p>
            <p className="text-xl font-bold text-blue-700">{results.exitTime.formattedTime}</p>
            <p className="text-xs text-gray-500">Para completar 8h de trabalho</p>
          </div>
        )}

        <div>
          <label htmlFor="lunchTime" className="block mb-1 font-medium">
            Horário de Saída para Almoço
          </label>
          <input
            type="time"
            id="lunchTime"
            value={lunchTime}
            onChange={(e) => setLunchTime(e.target.value)}
            className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
          />
        </div>

        {results.lunchReturnTime && (
          <div className="p-3 bg-blue-50 rounded-md">
            <p className="font-medium">Horário de retorno do almoço:</p>
            <p className="text-xl font-bold text-blue-700">{results.lunchReturnTime.formattedTime}</p>
            <p className="text-xs text-gray-500">Considerando 1h de intervalo</p>
          </div>
        )}

        <div>
          <label htmlFor="returnTime" className="block mb-1 font-medium">
            Horário de Retorno do Almoço
          </label>
          <input
            type="time"
            id="returnTime"
            value={returnTime}
            onChange={(e) => setReturnTime(e.target.value)}
            className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
          />
        </div>

        {results.exitTimeWithLunch && (
          <div className="p-3 bg-green-50 rounded-md">
            <p className="font-medium">Horário de saída final:</p>
            <p className="text-xl font-bold text-green-700">{results.exitTimeWithLunch.formattedTime}</p>
            <p className="text-xs text-gray-500">Para completar 8h de trabalho com intervalo de almoço</p>
          </div>
        )}
        
        <div className="mt-8 border-t pt-6">
          <div className="flex items-center mb-4">
            <button 
              type="button" 
              onClick={() => setShowExtraFields(!showExtraFields)}
              className="text-blue-600 hover:text-blue-800 font-medium flex items-center"
            >
              {showExtraFields ? (
                <>
                  <span className="mr-1">&#9660;</span> Ocultar campos de retorno ao trabalho
                </>
              ) : (
                <>
                  <span className="mr-1">&#9654;</span> Preciso registrar retorno ao trabalho
                </>
              )}
            </button>
          </div>
          
          {showExtraFields && (
            <div className="space-y-4 bg-gray-50 p-4 rounded-md">
              <p className="text-sm text-gray-600 mb-2">
                Preencha estes campos se você precisou retornar ao trabalho após o expediente normal.
              </p>
              
              <div>
                <label htmlFor="exitTime" className="block mb-1 font-medium">
                  Horário de Saída (expediente normal)
                </label>
                <input
                  type="time"
                  id="exitTime"
                  value={exitTime}
                  onChange={(e) => setExitTime(e.target.value)}
                  className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
                />
              </div>
              
              <div>
                <label htmlFor="returnToWorkTime" className="block mb-1 font-medium">
                  Horário de Retorno ao Trabalho
                </label>
                <input
                  type="time"
                  id="returnToWorkTime"
                  value={returnToWorkTime}
                  onChange={(e) => setReturnToWorkTime(e.target.value)}
                  className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
                />
              </div>
              
              <div>
                <label htmlFor="finalExitTime" className="block mb-1 font-medium">
                  Horário de Saída Final
                </label>
                <input
                  type="time"
                  id="finalExitTime"
                  value={finalExitTime}
                  onChange={(e) => setFinalExitTime(e.target.value)}
                  className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
                />
              </div>
              
              {results.extraHours && (
                <div className={`p-3 rounded-md ${results.extraHours.isExtra ? 'bg-purple-50' : 'bg-yellow-50'}`}>
                  <p className="font-medium">
                    {results.extraHours.isExtra ? 'Horas extras realizadas:' : 'Horas faltantes:'}
                  </p>
                  <p className={`text-xl font-bold ${results.extraHours.isExtra ? 'text-purple-700' : 'text-yellow-700'}`}>
                    {results.extraHours.formattedTime}
                  </p>
                  <p className="text-xs text-gray-500">
                    {results.extraHours.isExtra 
                      ? 'Tempo trabalhado além das 8h diárias' 
                      : 'Tempo faltante para completar 8h diárias'}
                  </p>
                </div>
              )}
            </div>
          )}
        </div>
      </div>

      {error && (
        <div className="mt-4 p-3 bg-red-100 text-red-700 rounded-md">
          {error}
        </div>
      )}
    </div>
  );
}
