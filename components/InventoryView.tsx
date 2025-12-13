import React from 'react';
import { Product, User, UserRole } from '../types';

interface InventoryViewProps {
  products: Product[];
  currentUser: User;
  onUpdateStock: (id: string, newStock: number) => void;
}

const InventoryView: React.FC<InventoryViewProps> = ({ products, currentUser, onUpdateStock }) => {
  return (
    <div className="bg-white p-6 rounded-lg shadow-md border border-gray-100">
      <div className="flex justify-between items-center mb-6">
        <div>
          <h2 className="text-2xl font-bold text-gray-800">Inventario en Tiempo Real</h2>
          <p className="text-sm text-gray-500">Patrón Observer (Notificaciones automáticas)</p>
        </div>
      </div>

      <div className="overflow-x-auto">
        <table className="min-w-full text-left text-sm">
          <thead className="bg-gray-50 border-b">
            <tr>
              <th className="p-3 w-16">Imagen</th>
              <th className="p-3">Producto</th>
              <th className="p-3">Categoría</th>
              <th className="p-3 text-center">Stock Mínimo</th>
              <th className="p-3 text-center">Stock Actual</th>
              <th className="p-3 text-right">Acciones</th>
            </tr>
          </thead>
          <tbody className="divide-y divide-gray-100">
            {products.map(p => (
              <tr key={p.id} className={p.stock < p.minStock ? "bg-red-50" : ""}>
                <td className="p-3">
                  {p.image ? (
                    <img src={p.image} alt={p.name} className="w-10 h-10 object-contain bg-white rounded border border-gray-200" />
                  ) : (
                    <div className="w-10 h-10 bg-gray-200 rounded flex items-center justify-center text-xs">📷</div>
                  )}
                </td>
                <td className="p-3 font-medium">{p.name}</td>
                <td className="p-3 text-gray-500">{p.category}</td>
                <td className="p-3 text-center">{p.minStock}</td>
                <td className="p-3 text-center">
                  <span className={`font-bold ${p.stock < p.minStock ? 'text-red-600' : 'text-green-600'}`}>
                    {p.stock}
                  </span>
                </td>
                <td className="p-3 text-right">
                  <div className="flex justify-end space-x-2">
                    <button 
                      onClick={() => onUpdateStock(p.id, p.stock - 1)}
                      className="w-8 h-8 bg-gray-200 rounded hover:bg-gray-300 flex items-center justify-center"
                      disabled={p.stock <= 0}
                    >
                      -
                    </button>
                    <button 
                      onClick={() => onUpdateStock(p.id, p.stock + 1)}
                      className="w-8 h-8 bg-gray-200 rounded hover:bg-gray-300 flex items-center justify-center"
                    >
                      +
                    </button>
                  </div>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>

      <div className="mt-4 p-4 bg-blue-50 text-blue-800 text-sm rounded border border-blue-100">
        <strong>Nota del Sistema:</strong> Al modificar el stock, el <em>InventorySubject</em> notifica a los observadores. 
        Si el stock cae por debajo del mínimo, se genera una notificación para usuarios con rol 
        <strong> {UserRole.MANAGER}</strong> o <strong>{UserRole.BUYER}</strong>.
      </div>
    </div>
  );
};

export default InventoryView;