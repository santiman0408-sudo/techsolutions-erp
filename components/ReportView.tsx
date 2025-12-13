import React, { useState } from 'react';
import { User } from '../types';
import { ReportProxy } from '../patterns';

interface ReportViewProps {
  currentUser: User;
}

const ReportView: React.FC<ReportViewProps> = ({ currentUser }) => {
  const [reportData, setReportData] = useState<string | null>(null);
  const [error, setError] = useState<string | null>(null);

  const handleAccessReport = () => {
    setError(null);
    setReportData(null);
    
    const proxy = new ReportProxy();
    try {
      // The Proxy controls access based on the User passed
      const data = proxy.getFinancialReport(currentUser);
      setReportData(data);
    } catch (err: any) {
      setError(err.message);
    }
  };

  return (
    <div className="max-w-2xl mx-auto bg-white p-8 rounded-lg shadow-md border border-gray-100 mt-10">
      <div className="text-center mb-8">
        <div className="w-16 h-16 bg-blue-100 text-blue-600 rounded-full flex items-center justify-center mx-auto mb-4 text-3xl">
          🔒
        </div>
        <h2 className="text-2xl font-bold text-gray-800">Reportes Financieros</h2>
        <p className="text-gray-500 mt-2">Acceso protegido por Proxy</p>
      </div>

      <div className="bg-gray-50 p-4 rounded-md mb-6 border border-gray-200">
        <p className="text-sm text-gray-600 mb-2">Usuario Actual:</p>
        <div className="flex items-center space-x-3">
          <div className="w-8 h-8 bg-gray-300 rounded-full flex items-center justify-center text-white font-bold">
            {currentUser.name.charAt(0)}
          </div>
          <div>
            <p className="font-semibold text-gray-800">{currentUser.name}</p>
            <p className="text-xs text-blue-600 font-mono">{currentUser.role}</p>
          </div>
        </div>
      </div>

      <button 
        onClick={handleAccessReport}
        className="w-full py-3 bg-gray-900 text-white rounded-lg hover:bg-black transition-colors font-medium shadow-lg"
      >
        Solicitar Acceso al Reporte
      </button>

      {error && (
        <div className="mt-6 p-4 bg-red-50 border-l-4 border-red-500 text-red-700 animate-pulse">
          <p className="font-bold">Acceso Denegado</p>
          <p>{error}</p>
        </div>
      )}

      {reportData && (
        <div className="mt-6 p-6 bg-green-50 border border-green-200 rounded-lg shadow-inner">
          <p className="font-bold text-green-800 mb-2">✅ Acceso Concedido</p>
          <p className="font-mono text-green-700">{reportData}</p>
        </div>
      )}
    </div>
  );
};

export default ReportView;