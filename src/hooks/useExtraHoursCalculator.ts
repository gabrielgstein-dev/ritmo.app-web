import { useState, useCallback, useEffect } from 'react';
import { timeCalculatorApi } from '../services/api';

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
      const data = await timeCalculatorApi.calculateExtraHours(
        entryTime,
        lunchTime,
        returnTime,
        exitTime,
        returnToWorkTime,
        finalExitTime
      );
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
