'use client';

import { API_URL } from './api';

export interface TimeRecord {
  id: number;
  date: string;
  entryTime: string;
  lunchTime: string;
  returnTime: string;
  exitTime: string;
  returnToWorkTime?: string;
  finalExitTime?: string;
  companyId: number;
  userId: number;
}

export interface CreateTimeRecordData {
  date: string;
  entryTime: string;
  lunchTime: string;
  returnTime: string;
  exitTime: string;
  companyId: number;
  returnToWorkTime?: string;
  finalExitTime?: string;
}

export const timeRecordsApi = {
  getTimeRecordsByCompany: async (companyId: number, startDate: string, endDate: string, token: string): Promise<TimeRecord[]> => {
    const url = `${API_URL}/time-records?companyId=${companyId}&startDate=${startDate}&endDate=${endDate}`;
    
    const response = await fetch(url, {
      method: 'GET',
      headers: {
        'Content-Type': 'application/json',
        'Authorization': `Bearer ${token}`,
      },
    });
    
    if (!response.ok) {
      throw new Error('Erro ao obter registros de ponto da empresa');
    }
    
    return response.json();
  },
  getTimeRecords: async (token: string, companyId?: number, startDate?: string, endDate?: string): Promise<TimeRecord[]> => {
    let url = `${API_URL}/time-records`;
    const params = new URLSearchParams();
    
    if (companyId) {
      params.append('companyId', companyId.toString());
    }
    
    if (startDate) {
      params.append('startDate', startDate);
    }
    
    if (endDate) {
      params.append('endDate', endDate);
    }
    
    if (params.toString()) {
      url += `?${params.toString()}`;
    }
    
    const response = await fetch(url, {
      method: 'GET',
      headers: {
        'Content-Type': 'application/json',
        'Authorization': `Bearer ${token}`,
      },
    });
    
    if (!response.ok) {
      throw new Error('Erro ao obter registros de ponto');
    }
    
    return response.json();
  },
  
  getTimeRecord: async (id: number, token: string): Promise<TimeRecord> => {
    const response = await fetch(`${API_URL}/time-records/${id}`, {
      method: 'GET',
      headers: {
        'Content-Type': 'application/json',
        'Authorization': `Bearer ${token}`,
      },
    });
    
    if (!response.ok) {
      throw new Error('Erro ao obter registro de ponto');
    }
    
    return response.json();
  },
  
  createTimeRecord: async (data: CreateTimeRecordData, token: string): Promise<TimeRecord> => {
    const response = await fetch(`${API_URL}/time-records`, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
        'Authorization': `Bearer ${token}`,
      },
      body: JSON.stringify(data),
    });
    
    if (!response.ok) {
      throw new Error('Erro ao criar registro de ponto');
    }
    
    return response.json();
  },
  
  updateTimeRecord: async (id: number, data: Partial<CreateTimeRecordData>, token: string): Promise<TimeRecord> => {
    const response = await fetch(`${API_URL}/time-records/${id}`, {
      method: 'PATCH',
      headers: {
        'Content-Type': 'application/json',
        'Authorization': `Bearer ${token}`,
      },
      body: JSON.stringify(data),
    });
    
    if (!response.ok) {
      throw new Error('Erro ao atualizar registro de ponto');
    }
    
    return response.json();
  },
  
  deleteTimeRecord: async (id: number, token: string): Promise<void> => {
    const response = await fetch(`${API_URL}/time-records/${id}`, {
      method: 'DELETE',
      headers: {
        'Content-Type': 'application/json',
        'Authorization': `Bearer ${token}`,
      },
    });
    
    if (!response.ok) {
      throw new Error('Erro ao excluir registro de ponto');
    }
  },
  
  saveTimeRecord: async (data: CreateTimeRecordData, token: string): Promise<TimeRecord> => {
    const response = await fetch(`${API_URL}/time-calculator/save-time-record`, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
        'Authorization': `Bearer ${token}`,
      },
      body: JSON.stringify(data),
    });
    
    if (!response.ok) {
      throw new Error('Erro ao salvar registro de ponto');
    }
    
    return response.json().then(data => data.result);
  },
};
