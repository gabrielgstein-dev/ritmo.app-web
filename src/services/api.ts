const API_URL = process.env.NEXT_PUBLIC_API_URL || 'http://localhost:3001';

export const timeCalculatorApi = {
  calculateExitTime: async (entryTime: string) => {
    const response = await fetch(`${API_URL}/time-calculator/exit-time`, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify({ entryTime }),
    });
    
    if (!response.ok) {
      throw new Error('Erro ao calcular horário de saída');
    }
    
    return response.json();
  },
  
  calculateLunchReturnTime: async (entryTime: string, lunchTime: string) => {
    const response = await fetch(`${API_URL}/time-calculator/lunch-return-time`, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify({ entryTime, lunchTime }),
    });
    
    if (!response.ok) {
      throw new Error('Erro ao calcular horário de retorno do almoço');
    }
    
    return response.json();
  },
  
  calculateExitTimeWithLunch: async (entryTime: string, lunchTime: string, returnTime: string) => {
    const response = await fetch(`${API_URL}/time-calculator/exit-time-with-lunch`, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify({ entryTime, lunchTime, returnTime }),
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
    finalExitTime: string
  ) => {
    const response = await fetch(`${API_URL}/time-calculator/extra-hours`, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify({
        entryTime,
        lunchTime,
        returnTime,
        exitTime,
        returnToWorkTime,
        finalExitTime
      }),
    });
    
    if (!response.ok) {
      throw new Error('Erro ao calcular horas extras');
    }
    
    return response.json();
  }
};
