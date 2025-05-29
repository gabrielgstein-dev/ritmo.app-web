'use client';

import { useCompaniesStore } from '../stores/useCompaniesStore';

export default function CompanySelector() {
  const { 
    companies, 
    selectedCompany, 
    loading, 
    error, 
    selectCompany 
  } = useCompaniesStore();

  if (loading) {
    return <div className="text-sm text-gray-500">Carregando empresas...</div>;
  }

  if (error) {
    return <div className="text-sm text-red-500">{error}</div>;
  }

  if (companies.length === 0) {
    return <div className="text-sm text-gray-500">Nenhuma empresa encontrada</div>;
  }

  return (
    <div className="mb-4">
      <label htmlFor="company" className="block text-sm font-medium text-gray-700 mb-1">
        Empresa
      </label>
      <select
        id="company"
        className="block w-full px-3 py-2 border border-gray-300 rounded-md shadow-sm focus:outline-none focus:ring-indigo-500 focus:border-indigo-500 sm:text-sm"
        value={selectedCompany?.id || ''}
        onChange={(e) => selectCompany(Number(e.target.value))}
      >
        {companies.map((company) => (
          <option key={company.id} value={company.id}>
            {company.name}
          </option>
        ))}
      </select>
    </div>
  );
}
