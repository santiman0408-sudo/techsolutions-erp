import React from 'react';
import { User } from '../types';

interface SidebarProps {
  currentUser: User;
  currentView: string;
  onNavigate: (view: string) => void;
  onLogout: () => void;
  users: User[];
  onChangeUser: (userId: string) => void;
}

const Sidebar: React.FC<SidebarProps> = ({ currentUser, currentView, onNavigate, onLogout, users, onChangeUser }) => {
  const menuItems = [
    { id: 'dashboard', label: 'Dashboard', icon: '📊' },
    { id: 'catalog', label: 'Catálogo (Iterator)', icon: '📦' },
    { id: 'orders', label: 'Pedidos (Command)', icon: '📝' },
    { id: 'inventory', label: 'Inventario (Observer)', icon: '⚠️' },
    { id: 'reports', label: 'Reportes (Proxy)', icon: '🔒' },
    { id: 'settings', label: 'Configuración', icon: '⚙️' },
  ];

  return (
    <div className="w-64 bg-gray-900 text-white h-screen flex flex-col fixed left-0 top-0 overflow-y-auto">
      <div className="p-6 border-b border-gray-700">
        <h1 className="text-xl font-bold text-accent">TechSolutions</h1>
        <p className="text-xs text-gray-400 mt-1">ERP para Pymes</p>
      </div>

      {/* User Switcher for Demo Purposes */}
      <div className="p-4 bg-gray-800">
        <label className="text-xs text-gray-400 block mb-2">Simular Usuario:</label>
        <select 
          className="w-full bg-gray-700 text-sm p-2 rounded border border-gray-600 focus:outline-none focus:border-accent"
          value={currentUser.id}
          onChange={(e) => onChangeUser(e.target.value)}
        >
          {users.map(u => (
            <option key={u.id} value={u.id}>{u.name}</option>
          ))}
        </select>
        <div className="mt-2 text-xs text-blue-300">Rol: {currentUser.role}</div>
      </div>

      <nav className="flex-1 p-4 space-y-2">
        {menuItems.map(item => (
          <button
            key={item.id}
            onClick={() => onNavigate(item.id)}
            className={`w-full flex items-center space-x-3 p-3 rounded transition-colors ${
              currentView === item.id 
                ? 'bg-accent text-white shadow-lg' 
                : 'text-gray-300 hover:bg-gray-800'
            }`}
          >
            <span>{item.icon}</span>
            <span>{item.label}</span>
          </button>
        ))}
      </nav>

      <div className="p-4 border-t border-gray-800">
        <button onClick={onLogout} className="text-sm text-red-400 hover:text-red-300 flex items-center space-x-2">
           <span>🚪</span> <span>Cerrar Sesión</span>
        </button>
      </div>
    </div>
  );
};

export default Sidebar;