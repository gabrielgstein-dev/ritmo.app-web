'use client';

import { API_URL } from './api';

export interface Company {
  id: number;
  name: string;
  cnpj?: string;
  workHours: number;
  lunchBreak: number;
}

export interface CreateCompanyData {
  name: string;
  cnpj?: string;
  workHours?: number;
  lunchBreak?: number;
}

export const companiesApi = {
  getCompanies: async (token: string): Promise<Company[]> => {
    const response = await fetch(`${API_URL}/companies`, {
      method: 'GET',
      headers: {
        'Content-Type': 'application/json',
        'Authorization': `Bearer ${token}`,
      },
    });
    
    if (!response.ok) {
      throw new Error('Erro ao obter empresas');
    }
    
    return response.json();
  },
  
  getCompany: async (id: number, token: string): Promise<Company> => {
    const response = await fetch(`${API_URL}/companies/${id}`, {
      method: 'GET',
      headers: {
        'Content-Type': 'application/json',
        'Authorization': `Bearer ${token}`,
      },
    });
    
    if (!response.ok) {
      throw new Error('Erro ao obter empresa');
    }
    
    return response.json();
  },
  
  createCompany: async (data: CreateCompanyData, token: string): Promise<Company> => {
    const response = await fetch(`${API_URL}/companies`, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
        'Authorization': `Bearer ${token}`,
      },
      body: JSON.stringify(data),
    });
    
    if (!response.ok) {
      throw new Error('Erro ao criar empresa');
    }
    
    return response.json();
  },
  
  updateCompany: async (id: number, data: Partial<CreateCompanyData>, token: string): Promise<Company> => {
    const response = await fetch(`${API_URL}/companies/${id}`, {
      method: 'PATCH',
      headers: {
        'Content-Type': 'application/json',
        'Authorization': `Bearer ${token}`,
      },
      body: JSON.stringify(data),
    });
    
    if (!response.ok) {
      throw new Error('Erro ao atualizar empresa');
    }
    
    return response.json();
  },
  
  deleteCompany: async (id: number, token: string): Promise<void> => {
    const response = await fetch(`${API_URL}/companies/${id}`, {
      method: 'DELETE',
      headers: {
        'Content-Type': 'application/json',
        'Authorization': `Bearer ${token}`,
      },
    });
    
    if (!response.ok) {
      throw new Error('Erro ao excluir empresa');
    }
  },
};
