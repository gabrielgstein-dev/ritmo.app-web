import QuickCalculator from '@/components/QuickCalculator';

export default function QuickCalculatorPage() {
  return (
    <div className="container mx-auto px-4 py-8">
      <div className="max-w-3xl mx-auto">
        <div className="mb-8">
          <h1 className="text-3xl font-bold mb-4 text-center">Calculadora Rápida de Ponto</h1>
          <p className="text-gray-600 text-center">
            Calcule rapidamente seu horário de saída com base no horário de entrada.
          </p>
        </div>
        
        <QuickCalculator />
      </div>
    </div>
  );
}
