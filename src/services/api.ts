export const API_URL = process.env.NEXT_PUBLIC_API_URL || 'http://localhost:3001';

interface TimeCalculationOptions {
  standardWorkHours?: number;
  standardLunchBreak?: number;
  companyId?: number;
}

const getAuthHeader = (token?: string): Record<string, string> => {
  return token ? { 'Authorization': `Bearer ${token}`, 'Content-Type': 'application/json' } : { 'Content-Type': 'application/json' };
};

export const timeCalculatorApi = {
  calculateExitTime: async (entryTime: string, options?: TimeCalculationOptions, token?: string) => {
    const response = await fetch(`${API_URL}/time-calculator/exit-time`, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
        ...getAuthHeader(token)
      },
      body: JSON.stringify({ entryTime, options }),
    });
    
    if (!response.ok) {
      throw new Error('Erro ao calcular horário de saída');
    }
    
    return response.json();
  },
  
  calculateLunchReturnTime: async (entryTime: string, lunchTime: string, options?: TimeCalculationOptions, token?: string) => {
    const response = await fetch(`${API_URL}/time-calculator/lunch-return-time`, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
        ...getAuthHeader(token)
      },
      body: JSON.stringify({ entryTime, lunchTime, options }),
    });
    
    if (!response.ok) {
      throw new Error('Erro ao calcular horário de retorno do almoço');
    }
    
    return response.json();
  },
  
  calculateExitTimeWithLunch: async (entryTime: string, lunchTime: string, returnTime: string, options?: TimeCalculationOptions, token?: string) => {
    const response = await fetch(`${API_URL}/time-calculator/exit-time-with-lunch`, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
        ...getAuthHeader(token)
      },
      body: JSON.stringify({ entryTime, lunchTime, returnTime, options }),
    });
    
    if (!response.ok) {
      throw new Error('Erro ao calcular horário de saída com almoço');
    }
    
    return response.json();
  },
  
  calculateExtraHours: async (
    entryTime: string,
    lunchTime: string,
    returnTime: string,
    exitTime: string,
    returnToWorkTime: string,
    finalExitTime: string,
    options?: TimeCalculationOptions,
    token?: string
  ) => {
    const response = await fetch(`${API_URL}/time-calculator/extra-hours`, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
        ...getAuthHeader(token)
      },
      body: JSON.stringify({
        entryTime,
        lunchTime,
        returnTime,
        exitTime,
        returnToWorkTime,
        finalExitTime,
        options
      }),
    });
    
    if (!response.ok) {
      throw new Error('Erro ao calcular horas extras');
    }
    
    return response.json();
  },

  saveTimeRecord: async (
    date: string,
    entryTime: string,
    lunchTime: string,
    returnTime: string,
    exitTime: string,
    companyId: number,
    token: string,
    returnToWorkTime?: string,
    finalExitTime?: string
  ) => {
    const response = await fetch(`${API_URL}/time-calculator/save-time-record`, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
        ...getAuthHeader(token)
      },
      body: JSON.stringify({
        date,
        entryTime,
        lunchTime,
        returnTime,
        exitTime,
        companyId,
        returnToWorkTime,
        finalExitTime
      }),
    });
    
    if (!response.ok) {
      throw new Error('Erro ao salvar registro de ponto');
    }
    
    return response.json();
  }
};
