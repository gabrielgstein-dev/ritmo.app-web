'use client';

import { useState, useEffect, useCallback } from 'react';
import { useTimeRecordsStore } from '@/stores/useTimeRecordsStore';

/**
 * Hook personalizado para gerenciar o intervalo de datas
 * Isola a lógica de manipulação de datas e sincronização com a store
 */
export function useDateRange() {
  const { startDate: storeStartDate, endDate: storeEndDate, setDateRange } = useTimeRecordsStore();
  
  const [localStartDate, setLocalStartDate] = useState<string>('');
  const [localEndDate, setLocalEndDate] = useState<string>('');
  

  useEffect(() => {

    if (storeStartDate && storeEndDate) {
      setLocalStartDate(storeStartDate);
      setLocalEndDate(storeEndDate);
      return;
    }
    

    const now = new Date();
    const firstDay = new Date(now.getFullYear(), now.getMonth(), 1);
    const lastDay = new Date(now.getFullYear(), now.getMonth() + 1, 0);
    
    const startDateStr = firstDay.toISOString().split('T')[0];
    const endDateStr = lastDay.toISOString().split('T')[0];
    
    setLocalStartDate(startDateStr);
    setLocalEndDate(endDateStr);
    setDateRange(startDateStr, endDateStr);
  }, [storeStartDate, storeEndDate, setDateRange]);
  

  const handleStartDateChange = useCallback((newDate: string) => {
    setLocalStartDate(newDate);
    setDateRange(newDate, localEndDate);
  }, [localEndDate, setDateRange]);
  
  const handleEndDateChange = useCallback((newDate: string) => {
    setLocalEndDate(newDate);
    setDateRange(localStartDate, newDate);
  }, [localStartDate, setDateRange]);
  
  return {
    localStartDate,
    localEndDate,
    handleStartDateChange,
    handleEndDateChange
  };
}
