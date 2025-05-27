import { useState, useCallback, useEffect } from 'react';

interface ExtraHoursResult {
  extraHours: number;
  extraMinutes: number;
  formattedTime: string;
  isExtra: boolean;
}

interface CalculationResult {
  extraHours: ExtraHoursResult | null;
}

export function useExtraHoursCalculator() {
  const [entryTime, setEntryTime] = useState('');
  const [lunchTime, setLunchTime] = useState('');
  const [returnTime, setReturnTime] = useState('');
  const [exitTime, setExitTime] = useState('');
  const [returnToWorkTime, setReturnToWorkTime] = useState('');
  const [finalExitTime, setFinalExitTime] = useState('');
  const [showExtraFields, setShowExtraFields] = useState(false);
  
  const [results, setResults] = useState<CalculationResult>({
    extraHours: null
  });
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');

  const calculateExtraHours = useCallback(async () => {
    if (!entryTime || !lunchTime || !returnTime || !exitTime || !returnToWorkTime || !finalExitTime) return;
    
    setLoading(true);
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
      setResults({ extraHours: data.result });
    } catch (err) {
      setError('Ocorreu um erro ao calcular as horas extras.');
      console.error(err);
    } finally {
      setLoading(false);
    }
  }, [entryTime, lunchTime, returnTime, exitTime, returnToWorkTime, finalExitTime]);

  useEffect(() => {
    if (showExtraFields && entryTime && lunchTime && returnTime && exitTime && returnToWorkTime && finalExitTime) {
      calculateExtraHours();
    }
  }, [showExtraFields, entryTime, lunchTime, returnTime, exitTime, returnToWorkTime, finalExitTime, calculateExtraHours]);

  return {
    entryTime,
    setEntryTime,
    lunchTime,
    setLunchTime,
    returnTime,
    setReturnTime,
    exitTime,
    setExitTime,
    returnToWorkTime,
    setReturnToWorkTime,
    finalExitTime,
    setFinalExitTime,
    showExtraFields,
    setShowExtraFields,
    results,
    loading,
    error
  };
}
