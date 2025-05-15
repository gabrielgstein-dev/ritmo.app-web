import { useState, useCallback, useEffect } from 'react';

interface TimeResult {
  hours: number;
  minutes: number;
  formattedTime: string;
}

interface CalculationResult {
  exitTime: TimeResult | null;
  lunchReturnTime: TimeResult | null;
  exitTimeWithLunch: TimeResult | null;
}

export function useTimeCalculator() {
  const [entryTime, setEntryTime] = useState('');
  const [lunchTime, setLunchTime] = useState('');
  const [returnTime, setReturnTime] = useState('');
  const [results, setResults] = useState<CalculationResult>({
    exitTime: null,
    lunchReturnTime: null,
    exitTimeWithLunch: null,
  });
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');

  const calculateExitTime = useCallback(async () => {
    if (!entryTime) return;
    
    setLoading(true);
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
    } finally {
      setLoading(false);
    }
  }, [entryTime]);

  const calculateLunchReturnTime = useCallback(async () => {
    if (!entryTime || !lunchTime) return;
    
    setLoading(true);
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
    } finally {
      setLoading(false);
    }
  }, [entryTime, lunchTime]);

  const calculateExitTimeWithLunch = useCallback(async () => {
    if (!entryTime || !lunchTime || !returnTime) return;
    
    setLoading(true);
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
    } catch (err) {
      setError('Ocorreu um erro ao calcular o horário de saída com almoço.');
      console.error(err);
    } finally {
      setLoading(false);
    }
  }, [entryTime, lunchTime, returnTime]);

  useEffect(() => {
    if (entryTime) {
      calculateExitTime();
    }
  }, [entryTime, calculateExitTime]);

  useEffect(() => {
    if (entryTime && lunchTime) {
      calculateLunchReturnTime();
    }
  }, [entryTime, lunchTime, calculateLunchReturnTime]);

  useEffect(() => {
    if (entryTime && lunchTime && returnTime) {
      calculateExitTimeWithLunch();
    }
  }, [entryTime, lunchTime, returnTime, calculateExitTimeWithLunch]);

  return {
    entryTime,
    setEntryTime,
    lunchTime,
    setLunchTime,
    returnTime,
    setReturnTime,
    results,
    loading,
    error
  };
}
