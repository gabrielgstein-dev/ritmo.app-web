'use client';

import { create } from 'zustand';
import { TimeRecord, timeRecordsApi, CreateTimeRecordData } from '../services/time-records';
import { useAuthStore } from './useAuthStore';
import { useCompaniesStore } from './useCompaniesStore';

interface TimeRecordsState {
  timeRecords: TimeRecord[];
  loading: boolean;
  error: string | null;
  startDate: string;
  endDate: string;
  

  setTimeRecords: (timeRecords: TimeRecord[]) => void;
  setLoading: (loading: boolean) => void;
  setError: (error: string | null) => void;
  setDateRange: (startDate: string, endDate: string) => void;
  

  fetchTimeRecords: () => Promise<void>;
  saveTimeRecord: (timeRecord: Partial<TimeRecord>) => Promise<TimeRecord | null>;
  deleteTimeRecord: (id: number) => Promise<boolean>;
}

export const useTimeRecordsStore = create<TimeRecordsState>((set, get) => ({
  timeRecords: [],
  loading: false,
  error: null,
  startDate: '',
  endDate: '',
  
  setTimeRecords: (timeRecords: TimeRecord[]) => set({ timeRecords }),
  setLoading: (loading: boolean) => set({ loading }),
  setError: (error: string | null) => set({ error }),
  setDateRange: (startDate: string, endDate: string) => set({ startDate, endDate }),
  
  fetchTimeRecords: async () => {
    const token = useAuthStore.getState().token;
    const selectedCompany = useCompaniesStore.getState().selectedCompany;
    const { startDate, endDate } = get();
    
    if (!token) {
      set({ error: 'Token não fornecido' });
      return;
    }
    
    if (!selectedCompany) {
      set({ error: 'Nenhuma empresa selecionada' });
      return;
    }
    
    if (!startDate || !endDate) {
      set({ error: 'Período não definido' });
      return;
    }
    
    try {
      set({ loading: true, error: null });
      const data = await timeRecordsApi.getTimeRecordsByCompany(
        selectedCompany.id,
        startDate,
        endDate,
        token
      );
      set({ timeRecords: data });
    } catch (err) {
      set({ error: err instanceof Error ? err.message : 'Erro ao carregar registros de ponto' });
    } finally {
      set({ loading: false });
    }
  },
  
  saveTimeRecord: async (timeRecord: Partial<TimeRecord>) => {
    const token = useAuthStore.getState().token;
    const selectedCompany = useCompaniesStore.getState().selectedCompany;
    const { startDate, endDate } = get();
    
    if (!token) {
      set({ error: 'Token não fornecido' });
      return null;
    }
    
    if (!selectedCompany) {
      set({ error: 'Nenhuma empresa selecionada' });
      return null;
    }
    
    if (!startDate || !endDate) {
      set({ error: 'Período não definido' });
      return null;
    }
    
    try {
      set({ loading: true, error: null });
      let result;
      
      if (timeRecord.id) {

        result = await timeRecordsApi.updateTimeRecord(
          timeRecord.id,
          { ...timeRecord, companyId: selectedCompany.id },
          token
        );
      } else {

        result = await timeRecordsApi.createTimeRecord(
          { ...timeRecord, companyId: selectedCompany.id } as CreateTimeRecordData,
          token
        );
      }
      

      const { fetchTimeRecords } = get();
      await fetchTimeRecords();
      
      return result;
    } catch (err) {
      set({ error: err instanceof Error ? err.message : 'Erro ao salvar registro de ponto' });
      return null;
    } finally {
      set({ loading: false });
    }
  },
  
  deleteTimeRecord: async (id: number) => {
    const token = useAuthStore.getState().token;
    
    if (!token) return false;
    
    try {
      set({ loading: true, error: null });
      await timeRecordsApi.deleteTimeRecord(id, token);
      

      const currentRecords = get().timeRecords;
      set({ timeRecords: currentRecords.filter(r => r.id !== id) });
      
      return true;
    } catch (err) {
      set({ error: err instanceof Error ? err.message : 'Erro ao excluir registro de ponto' });
      return false;
    } finally {
      set({ loading: false });
    }
  }
}));
