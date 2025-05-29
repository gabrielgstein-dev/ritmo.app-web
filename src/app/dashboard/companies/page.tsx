'use client';

import { useState, useEffect, useCallback } from 'react';
import { useRouter } from 'next/navigation';
import { Company, CreateCompanyData, companiesApi } from '@/services/companies';
import { useAuth } from '@/hooks/useAuth';

export default function CompaniesPage() {
  const { token, isLoading, isAuthenticated } = useAuth();
  const router = useRouter();
  
  const [companies, setCompanies] = useState<Company[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [isFormOpen, setIsFormOpen] = useState(false);
  const [editingCompany, setEditingCompany] = useState<Company | null>(null);
  

  const [formData, setFormData] = useState<CreateCompanyData>({
    name: '',
    cnpj: '',
    workHours: 8,
    lunchBreak: 1
  });
  

  useEffect(() => {
    if (!isLoading && !isAuthenticated) {
      router.push('/login');
    }
  }, [isLoading, isAuthenticated, router]);
  

  const fetchCompanies = useCallback(async () => {
    if (!token) return;
    
    try {
      setLoading(true);
      setError(null);
      const data = await companiesApi.getCompanies(token);
      setCompanies(data);
    } catch (err) {
      setError(err instanceof Error ? err.message : 'Erro ao carregar empresas');
    } finally {
      setLoading(false);
    }
  }, [token]);
  
  useEffect(() => {
    if (token) {
      fetchCompanies();
    }
  }, [token, fetchCompanies]);
  

  const handleInputChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const { name, value } = e.target;
    setFormData(prev => ({
      ...prev,
      [name]: name === 'workHours' || name === 'lunchBreak' ? Number(value) : value
    }));
  };
  
  const resetForm = () => {
    setFormData({
      name: '',
      cnpj: '',
      workHours: 8,
      lunchBreak: 1
    });
    setEditingCompany(null);
    setIsFormOpen(false);
  };
  
  const handleEditCompany = (company: Company) => {
    setEditingCompany(company);
    setFormData({
      name: company.name,
      cnpj: company.cnpj || '',
      workHours: company.workHours,
      lunchBreak: company.lunchBreak
    });
    setIsFormOpen(true);
  };
  
  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!token) return;
    
    try {
      setLoading(true);
      setError(null);
      
      if (editingCompany) {
        await companiesApi.updateCompany(editingCompany.id, formData, token);
      } else {
        await companiesApi.createCompany(formData, token);
      }
      
      resetForm();
      fetchCompanies();
    } catch (err) {
      setError(err instanceof Error ? err.message : 'Erro ao salvar empresa');
    } finally {
      setLoading(false);
    }
  };
  
  const handleDeleteCompany = async (id: number) => {
    if (!token || !window.confirm('Tem certeza que deseja excluir esta empresa?')) return;
    
    try {
      setLoading(true);
      setError(null);
      await companiesApi.deleteCompany(id, token);
      fetchCompanies();
    } catch (err) {
      setError(err instanceof Error ? err.message : 'Erro ao excluir empresa');
    } finally {
      setLoading(false);
    }
  };
  
  if (isLoading) {
    return <div className="flex justify-center items-center min-h-screen">Carregando...</div>;
  }
  
  if (!isAuthenticated) {
    return null;
  }
  
  return (
    <div className="container mx-auto px-4 py-8">
      <h1 className="text-2xl font-bold mb-6">Gerenciar Empresas</h1>
      
      {/* Mensagem de erro */}
      {error && (
        <div className="mb-4 p-3 bg-red-100 text-red-700 rounded-md">
          {error}
        </div>
      )}
      
      {/* Botão para adicionar nova empresa */}
      {!isFormOpen && (
        <button
          onClick={() => setIsFormOpen(true)}
          className="mb-6 px-4 py-2 bg-blue-600 text-white rounded-md hover:bg-blue-700 focus:outline-none focus:ring-2 focus:ring-blue-500"
        >
          Adicionar Nova Empresa
        </button>
      )}
      
      {/* Formulário */}
      {isFormOpen && (
        <div className="mb-8 p-4 bg-gray-50 rounded-md shadow">
          <h2 className="text-xl font-semibold mb-4">
            {editingCompany ? 'Editar Empresa' : 'Nova Empresa'}
          </h2>
          
          <form onSubmit={handleSubmit} className="space-y-4">
            <div>
              <label htmlFor="name" className="block mb-1 font-medium">
                Nome da Empresa *
              </label>
              <input
                type="text"
                id="name"
                name="name"
                value={formData.name}
                onChange={handleInputChange}
                className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
                required
              />
            </div>
            
            <div>
              <label htmlFor="cnpj" className="block mb-1 font-medium">
                CNPJ
              </label>
              <input
                type="text"
                id="cnpj"
                name="cnpj"
                value={formData.cnpj}
                onChange={handleInputChange}
                className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
              />
            </div>
            
            <div>
              <label htmlFor="workHours" className="block mb-1 font-medium">
                Horas de Trabalho *
              </label>
              <input
                type="number"
                id="workHours"
                name="workHours"
                value={formData.workHours}
                onChange={handleInputChange}
                min="1"
                max="24"
                className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
                required
              />
            </div>
            
            <div>
              <label htmlFor="lunchBreak" className="block mb-1 font-medium">
                Intervalo de Almoço (horas) *
              </label>
              <input
                type="number"
                id="lunchBreak"
                name="lunchBreak"
                value={formData.lunchBreak}
                onChange={handleInputChange}
                min="0"
                max="4"
                step="0.5"
                className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
                required
              />
            </div>
            
            <div className="flex space-x-4">
              <button
                type="submit"
                disabled={loading}
                className="px-4 py-2 bg-blue-600 text-white rounded-md hover:bg-blue-700 focus:outline-none focus:ring-2 focus:ring-blue-500 disabled:opacity-50"
              >
                {loading ? 'Salvando...' : 'Salvar'}
              </button>
              
              <button
                type="button"
                onClick={resetForm}
                className="px-4 py-2 bg-gray-300 text-gray-800 rounded-md hover:bg-gray-400 focus:outline-none focus:ring-2 focus:ring-gray-500"
              >
                Cancelar
              </button>
            </div>
          </form>
        </div>
      )}
      
      {/* Lista de empresas */}
      {loading && !isFormOpen ? (
        <div>Carregando empresas...</div>
      ) : companies.length === 0 ? (
        <div>Nenhuma empresa encontrada. Adicione uma empresa para começar.</div>
      ) : (
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
          {companies.map((company) => (
            <div key={company.id} className="p-4 border rounded-md shadow-sm bg-white">
              <h3 className="text-lg font-semibold mb-2">{company.name}</h3>
              {company.cnpj && <p className="text-gray-600 mb-2">CNPJ: {company.cnpj}</p>}
              <p className="mb-1">Jornada: {company.workHours} horas</p>
              <p className="mb-3">Almoço: {company.lunchBreak} hora(s)</p>
              
              <div className="flex space-x-2 mt-2">
                <button
                  onClick={() => handleEditCompany(company)}
                  className="px-3 py-1 bg-blue-100 text-blue-700 rounded-md hover:bg-blue-200 focus:outline-none focus:ring-2 focus:ring-blue-500"
                >
                  Editar
                </button>
                <button
                  onClick={() => handleDeleteCompany(company.id)}
                  className="px-3 py-1 bg-red-100 text-red-700 rounded-md hover:bg-red-200 focus:outline-none focus:ring-2 focus:ring-red-500"
                >
                  Excluir
                </button>
              </div>
            </div>
          ))}
        </div>
      )}
    </div>
  );
}
