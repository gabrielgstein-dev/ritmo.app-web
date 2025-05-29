'use client';

import { useCallback } from 'react';
import { useTimeRecordsStore } from '@/stores/useTimeRecordsStore';
import { useCompaniesStore } from '@/stores/useCompaniesStore';
import { TimeRecord } from '@/services/time-records';

/**
 * Hook personalizado para gerenciar os registros de tempo
 * Isola a lógica de manipulação dos registros e cálculos
 */
export function useTimeRecordsManager() {
  const { 
    timeRecords,
    loading,
    error,
    fetchTimeRecords,
    deleteTimeRecord
  } = useTimeRecordsStore();
  
  const { selectedCompany } = useCompaniesStore();
  

  const formatDate = useCallback((dateString: string) => {
    const date = new Date(dateString);
    return date.toLocaleDateString('pt-BR');
  }, []);
  

  const calculateWorkedHours = useCallback((record: TimeRecord) => {
    const calculateMinutes = (time1: string, time2: string) => {
      const [h1, m1] = time1.split(':').map(Number);
      const [h2, m2] = time2.split(':').map(Number);
      return (h2 * 60 + m2) - (h1 * 60 + m1);
    };
    

    const morningMinutes = calculateMinutes(record.entryTime, record.lunchTime);
    

    const afternoonMinutes = calculateMinutes(record.returnTime, record.exitTime);
    

    let extraMinutes = 0;
    if (record.returnToWorkTime && record.finalExitTime) {
      extraMinutes = calculateMinutes(record.returnToWorkTime, record.finalExitTime);
    }
    

    const totalMinutes = morningMinutes + afternoonMinutes + extraMinutes;
    

    const hours = Math.floor(totalMinutes / 60);
    const minutes = totalMinutes % 60;
    
    return `${String(hours).padStart(2, '0')}:${String(minutes).padStart(2, '0')}`;
  }, []);
  

  const handleDeleteRecord = useCallback(async (id: number) => {
    if (!window.confirm('Tem certeza que deseja excluir este registro?')) return;
    await deleteTimeRecord(id);
  }, [deleteTimeRecord]);
  
  return {
    timeRecords,
    loading,
    error,
    selectedCompany,
    formatDate,
    calculateWorkedHours,
    handleDeleteRecord,
    fetchTimeRecords
  };
}
