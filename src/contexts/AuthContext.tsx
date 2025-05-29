'use client';

import { createContext, useState, useContext, ReactNode, useEffect } from 'react';
import { useRouter } from 'next/navigation';

interface User {
  id: string;
  name: string;
  email: string;
}

interface AuthContextType {
  user: User | null;
  isAuthenticated: boolean;
  isLoading: boolean;
  login: (email: string, password: string) => Promise<void>;
  logout: () => void;
}

const AuthContext = createContext<AuthContextType>({} as AuthContextType);

export function useAuth() {
  return useContext(AuthContext);
}

interface AuthProviderProps {
  children: ReactNode;
}

export function AuthProvider({ children }: AuthProviderProps) {
  const [user, setUser] = useState<User | null>(null);
  const [isLoading, setIsLoading] = useState(true);
  const router = useRouter();

  useEffect(() => {
    // Verificar se o usuário está autenticado ao carregar a página
    const token = localStorage.getItem('token');
    
    if (token) {
      // Aqui você pode fazer uma requisição para validar o token
      // e obter os dados do usuário
      // Por enquanto, vamos simular um usuário autenticado
      setUser({
        id: '1',
        name: 'Usuário Teste',
        email: 'usuario@teste.com'
      });
    }
    
    setIsLoading(false);
  }, []);

  const login = async (email: string, password: string) => {
    try {
      setIsLoading(true);
      // Aqui você faria a requisição para o backend para autenticar o usuário
      // Simulando uma autenticação bem-sucedida
      console.log(`Tentativa de login com email: ${email} e senha: ${password.substring(0, 1)}***`);
      
      const user = {
        id: '1',
        name: 'Usuário Teste',
        email: email
      };
      
      // Simulando um token JWT
      const token = 'jwt-token-simulado';
      
      // Salvar o token no localStorage
      localStorage.setItem('token', token);
      
      setUser(user);
      router.push('/dashboard');
    } catch (error) {
      console.error('Erro ao fazer login:', error);
      throw error;
    } finally {
      setIsLoading(false);
    }
  };

  const logout = () => {
    localStorage.removeItem('token');
    setUser(null);
    router.push('/login');
  };

  return (
    <AuthContext.Provider value={{ user, isAuthenticated: !!user, isLoading, login, logout }}>
      {children}
    </AuthContext.Provider>
  );
}