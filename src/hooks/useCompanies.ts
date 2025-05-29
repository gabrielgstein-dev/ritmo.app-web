'use client';

import { useEffect } from 'react';
import { useCompaniesStore } from '../stores/useCompaniesStore';
import { useAuthStore } from '../stores/useAuthStore';

export function useCompanies() {
  const { 
    companies, 
    selectedCompany, 
    loading, 
    error, 
    fetchCompanies, 
    selectCompany 
  } = useCompaniesStore();
  

  useEffect(() => {
    const token = useAuthStore.getState().token;
    if (token) {
      fetchCompanies();
    }
  }, [fetchCompanies]);
  
  return {
    companies,
    selectedCompany,
    loading,
    error,
    fetchCompanies,
    selectCompany
  };
}
