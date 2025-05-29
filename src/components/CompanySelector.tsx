'use client';

import { Company } from '../services/companies';

interface CompanySelectorProps {
  companies: Company[];
  selectedCompanyId?: number;
  loading: boolean;
  error: string | null;
  onCompanyChange: (companyId: number) => void;
}

export default function CompanySelector({
  companies,
  selectedCompanyId,
  loading,
  error,
  onCompanyChange
}: CompanySelectorProps) {

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
        value={selectedCompanyId || ''}
        onChange={(e) => onCompanyChange(Number(e.target.value))}
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
