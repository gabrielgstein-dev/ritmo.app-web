'use client';

import { create } from 'zustand';
import { Company, companiesApi } from '../services/companies';
import { useAuthStore } from './useAuthStore';

interface CompaniesState {
  companies: Company[];
  selectedCompany: Company | null;
  loading: boolean;
  error: string | null;
  

  setCompanies: (companies: Company[]) => void;
  setSelectedCompany: (company: Company | null) => void;
  setLoading: (loading: boolean) => void;
  setError: (error: string | null) => void;
  

  fetchCompanies: () => Promise<void>;
  selectCompany: (companyId: number) => Promise<void>;
}

export const useCompaniesStore = create<CompaniesState>((set, get) => ({
  companies: [],
  selectedCompany: null,
  loading: false,
  error: null,
  
  setCompanies: (companies) => set({ companies }),
  setSelectedCompany: (company) => set({ selectedCompany: company }),
  setLoading: (loading) => set({ loading }),
  setError: (error) => set({ error }),
  
  fetchCompanies: async () => {
    const token = useAuthStore.getState().token;
    if (!token) {
      set({ error: 'Token não fornecido' });
      return;
    }
    
    try {
      set({ loading: true, error: null });
      const data = await companiesApi.getCompanies(token);
      set({ companies: data });
      

      if (data.length > 0 && !get().selectedCompany) {
        set({ selectedCompany: data[0] });
      }
    } catch (err) {
      set({ error: err instanceof Error ? err.message : 'Erro ao carregar empresas' });
    } finally {
      set({ loading: false });
    }
  },
  
  selectCompany: async (companyId) => {
    const token = useAuthStore.getState().token;
    if (!token) return;
    
    try {
      const { companies } = get();
      const company = companies.find(c => c.id === companyId);
      
      if (company) {
        set({ selectedCompany: company });
      } else {
        const fetchedCompany = await companiesApi.getCompany(companyId, token);
        set({ selectedCompany: fetchedCompany });
      }
    } catch (err) {
      set({ error: err instanceof Error ? err.message : 'Erro ao selecionar empresa' });
    }
  }
}));
