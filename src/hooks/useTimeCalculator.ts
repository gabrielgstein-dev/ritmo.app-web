import { useState, useCallback, useEffect } from 'react';
import { timeCalculatorApi } from '../services/api';
import { useCompaniesStore } from '../stores/useCompaniesStore';

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
  const { selectedCompany } = useCompaniesStore();
  
  const [entryTime, setEntryTime] = useState('');
  const [lunchTime, setLunchTime] = useState('');
  const [returnTime, setReturnTime] = useState('');

  const [returnToWorkTime, setReturnToWorkTime] = useState('');
  const [finalExitTime, setFinalExitTime] = useState('');
  const [extraHours, setExtraHours] = useState<{ extraHours: number; extraMinutes: number; formattedTime: string; isExtra: boolean } | null>(null);
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

      const options = selectedCompany ? { companyId: selectedCompany.id } : undefined;
      const data = await timeCalculatorApi.calculateExitTime(entryTime, options);
      setResults(prev => ({ ...prev, exitTime: data.result }));
    } catch (err) {
      setError('Ocorreu um erro ao calcular o horário de saída.');
      console.error(err);
    } finally {
      setLoading(false);
    }
  }, [entryTime, selectedCompany]);

  const calculateLunchReturnTime = useCallback(async () => {
    if (!entryTime || !lunchTime) return;
    
    setLoading(true);
    setError('');

    try {

      const options = selectedCompany ? { companyId: selectedCompany.id } : undefined;
      const data = await timeCalculatorApi.calculateLunchReturnTime(entryTime, lunchTime, options);
      setResults(prev => ({ ...prev, lunchReturnTime: data.result }));
    } catch (err) {
      setError('Ocorreu um erro ao calcular o horário de retorno do almoço.');
      console.error(err);
    } finally {
      setLoading(false);
    }
  }, [entryTime, lunchTime, selectedCompany]);

  const calculateExitTimeWithLunch = useCallback(async () => {
    if (!entryTime || !lunchTime || !returnTime) return;
    
    setLoading(true);
    setError('');

    try {

      const options = selectedCompany ? { companyId: selectedCompany.id } : undefined;
      const data = await timeCalculatorApi.calculateExitTimeWithLunch(entryTime, lunchTime, returnTime, options);
      setResults(prev => ({ ...prev, exitTimeWithLunch: data.result }));
    } catch (err) {
      setError('Ocorreu um erro ao calcular o horário de saída com almoço.');
      console.error(err);
    } finally {
      setLoading(false);
    }
  }, [entryTime, lunchTime, returnTime, selectedCompany]);

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


  const calculateExtraHours = useCallback(async () => {
    if (!entryTime || !lunchTime || !returnTime || !results.exitTimeWithLunch?.formattedTime || !returnToWorkTime || !finalExitTime) return;
    
    setLoading(true);
    setError('');

    try {

      const options = selectedCompany ? { companyId: selectedCompany.id } : undefined;
      const data = await timeCalculatorApi.calculateExtraHours(
        entryTime,
        lunchTime,
        returnTime,
        results.exitTimeWithLunch.formattedTime,
        returnToWorkTime,
        finalExitTime,
        options
      );
      setExtraHours(data.result);
    } catch (err) {
      setError('Ocorreu um erro ao calcular as horas extras.');
      console.error(err);
    } finally {
      setLoading(false);
    }
  }, [entryTime, lunchTime, returnTime, results.exitTimeWithLunch, returnToWorkTime, finalExitTime, selectedCompany]);


  useEffect(() => {
    if (entryTime && lunchTime && returnTime && results.exitTimeWithLunch?.formattedTime && returnToWorkTime && finalExitTime) {
      calculateExtraHours();
    }
  }, [entryTime, lunchTime, returnTime, results.exitTimeWithLunch, returnToWorkTime, finalExitTime, calculateExtraHours]);

  return {
    entryTime,
    setEntryTime,
    lunchTime,
    setLunchTime,
    returnTime,
    setReturnTime,
    returnToWorkTime,
    setReturnToWorkTime,
    finalExitTime,
    setFinalExitTime,
    results,
    extraHours,
    loading,
    error,
    selectedCompany
  };
}
