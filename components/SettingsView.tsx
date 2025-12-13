import React, { useState } from 'react';
import { PaymentGatewayType, PricingStrategyType } from '../types';
import { PaymentAdapter } from '../patterns';

interface SettingsViewProps {
  currentGateway: PaymentGatewayType;
  setGateway: (g: PaymentGatewayType) => void;
  currentStrategy: PricingStrategyType;
  setStrategy: (s: PricingStrategyType) => void;
}

const SettingsView: React.FC<SettingsViewProps> = ({ currentGateway, setGateway, currentStrategy, setStrategy }) => {
  const [testAmount, setTestAmount] = useState(100);
  const [paymentResult, setPaymentResult] = useState('');

  const handleTestPayment = () => {
    // Uses the Adapter Pattern
    try {
      const adapter = new PaymentAdapter(currentGateway);
      const result = adapter.processPayment(testAmount);
      setPaymentResult(result);
    } catch (e: any) {
      setPaymentResult("Error: " + e.message);
    }
  };

  return (
    <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
      
      {/* Adapter Configuration */}
      <div className="bg-white p-6 rounded-lg shadow-md border border-gray-100">
        <h3 className="text-xl font-bold text-gray-800 mb-4 border-b pb-2">Pasarelas de Pago (Adapter)</h3>
        <p className="text-sm text-gray-500 mb-4">
            Selecciona la pasarela activa. El sistema utiliza un adaptador único para comunicarse con cualquiera de ellas.
        </p>

        <div className="space-y-3 mb-6">
          {Object.values(PaymentGatewayType).map(gw => (
            <label key={gw} className="flex items-center space-x-3 p-3 border rounded cursor-pointer hover:bg-gray-50">
              <input 
                type="radio" 
                name="gateway" 
                checked={currentGateway === gw} 
                onChange={() => { setGateway(gw); setPaymentResult(''); }}
                className="text-accent focus:ring-accent"
              />
              <span className="font-medium text-gray-700">{gw}</span>
            </label>
          ))}
        </div>

        <div className="bg-gray-50 p-4 rounded border border-gray-200">
          <p className="text-xs font-bold text-gray-400 uppercase mb-2">Prueba de Integración</p>
          <div className="flex space-x-2 mb-2">
            <input 
               type="number" 
               value={testAmount} 
               onChange={(e) => setTestAmount(Number(e.target.value))}
               className="border p-2 rounded w-24 text-center"
            />
            <button 
              onClick={handleTestPayment}
              className="flex-1 bg-accent text-white rounded hover:bg-blue-600"
            >
              Procesar Pago
            </button>
          </div>
          {paymentResult && (
             <div className="text-sm text-green-600 font-mono mt-2 bg-white p-2 border rounded">
               {'>'} {paymentResult}
             </div>
          )}
        </div>
      </div>

      {/* Strategy Configuration */}
      <div className="bg-white p-6 rounded-lg shadow-md border border-gray-100">
        <h3 className="text-xl font-bold text-gray-800 mb-4 border-b pb-2">Política de Precios (Strategy)</h3>
        <p className="text-sm text-gray-500 mb-4">
           Define el algoritmo utilizado para calcular los precios finales en el catálogo.
        </p>

        <div className="space-y-3">
          {Object.values(PricingStrategyType).map(st => (
            <label key={st} className="flex items-center space-x-3 p-3 border rounded cursor-pointer hover:bg-gray-50">
               <input 
                type="radio" 
                name="strategy" 
                checked={currentStrategy === st} 
                onChange={() => setStrategy(st)}
                className="text-accent focus:ring-accent"
              />
              <div>
                <span className="font-medium text-gray-700 block">{st}</span>
                <span className="text-xs text-gray-500">
                  {st === PricingStrategyType.STANDARD && 'Precio base sin cambios.'}
                  {st === PricingStrategyType.DISCOUNT && 'Aplica 15% de descuento global.'}
                  {st === PricingStrategyType.DYNAMIC && 'Incrementa 15% por alta demanda.'}
                </span>
              </div>
            </label>
          ))}
        </div>
      </div>

    </div>
  );
};

export default SettingsView;