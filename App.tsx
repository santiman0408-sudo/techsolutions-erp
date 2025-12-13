import React, { useState, useEffect, useMemo } from 'react';
import { User, UserRole, Product, Order, PaymentGatewayType, PricingStrategyType, Notification } from './types';
import { USERS, INITIAL_PRODUCTS, INITIAL_ORDERS } from './services/mockData';
import Sidebar from './components/Sidebar';
import CatalogView from './components/CatalogView';
import OrderView from './components/OrderView';
import SettingsView from './components/SettingsView';
import ReportView from './components/ReportView';
import InventoryView from './components/InventoryView';
import { InventorySubject } from './patterns';

function App() {
  // Global State
  const [currentUser, setCurrentUser] = useState<User>(USERS[0]);
  const [currentView, setCurrentView] = useState('dashboard');
  
  // Data State
  const [products, setProducts] = useState<Product[]>(INITIAL_PRODUCTS);
  const [orders, setOrders] = useState<Order[]>(INITIAL_ORDERS);
  const [notifications, setNotifications] = useState<Notification[]>([]);
  
  // Configuration State (Adapter & Strategy)
  const [activeGateway, setActiveGateway] = useState<PaymentGatewayType>(PaymentGatewayType.PAYPAL);
  const [pricingStrategy, setPricingStrategy] = useState<PricingStrategyType>(PricingStrategyType.STANDARD);

  // Pattern Implementation: Observer Initialization
  // We use useMemo to ensure the Subject singleton persistence across renders
  const inventorySubject = useMemo(() => new InventorySubject(), []);

  useEffect(() => {
    // Define the observer function
    const handleNotification = (note: Notification) => {
      // Logic: Only Manager and Buyer receive stock alerts (RF5)
      if (currentUser.role === UserRole.MANAGER || currentUser.role === UserRole.BUYER) {
        setNotifications(prev => [note, ...prev]);
        
        // Auto-dismiss after 5 seconds
        setTimeout(() => {
           setNotifications(prev => prev.filter(n => n.id !== note.id));
        }, 5000);
      }
    };

    // Subscribe
    inventorySubject.subscribe(handleNotification);

    // Cleanup
    return () => inventorySubject.unsubscribe(handleNotification);
  }, [currentUser, inventorySubject]);

  // Handle Stock Updates
  const updateStock = (productId: string, newStock: number) => {
    const updatedProducts = products.map(p => {
      if (p.id === productId) {
        const updated = { ...p, stock: newStock };
        // Trigger Observer
        inventorySubject.notify(updated); 
        return updated;
      }
      return p;
    });
    setProducts(updatedProducts);
  };

  const handleUserChange = (userId: string) => {
    const user = USERS.find(u => u.id === userId);
    if (user) setCurrentUser(user);
    setNotifications([]); // Clear notifications on user switch
  };

  return (
    <div className="flex bg-gray-100 min-h-screen font-sans">
      <Sidebar 
        currentUser={currentUser} 
        currentView={currentView} 
        onNavigate={setCurrentView}
        onLogout={() => alert('Sesión cerrada')}
        users={USERS}
        onChangeUser={handleUserChange}
      />

      <main className="ml-64 flex-1 p-8">
        {/* Header with Notifications */}
        <header className="flex justify-between items-center mb-8">
          <div>
            <h1 className="text-3xl font-bold text-gray-800">Panel de Control</h1>
            <p className="text-gray-500">Bienvenido, {currentUser.name}</p>
          </div>
          
          <div className="relative">
             <div className="p-2 bg-white rounded-full shadow cursor-pointer relative">
               🔔
               {notifications.length > 0 && (
                 <span className="absolute -top-1 -right-1 bg-red-500 text-white text-xs w-5 h-5 flex items-center justify-center rounded-full animate-bounce">
                   {notifications.length}
                 </span>
               )}
             </div>
             
             {/* Notification Toast Area */}
             <div className="absolute right-0 top-12 w-80 z-50 space-y-2">
                {notifications.map(note => (
                  <div key={note.id} className="bg-yellow-50 border-l-4 border-yellow-400 p-4 shadow-lg rounded animate-fade-in-down">
                    <div className="flex">
                      <div className="ml-3">
                        <p className="text-sm text-yellow-700">{note.message}</p>
                        <p className="text-xs text-yellow-500 mt-1">{note.timestamp.toLocaleTimeString()}</p>
                      </div>
                    </div>
                  </div>
                ))}
             </div>
          </div>
        </header>

        {/* Content Router */}
        {currentView === 'dashboard' && (
          <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
            <div className="bg-white p-6 rounded-lg shadow border-l-4 border-blue-500">
               <h3 className="text-gray-500 text-sm font-bold uppercase">Total Productos</h3>
               <p className="text-3xl font-bold text-gray-800">{products.length}</p>
            </div>
            <div className="bg-white p-6 rounded-lg shadow border-l-4 border-green-500">
               <h3 className="text-gray-500 text-sm font-bold uppercase">Pedidos Activos</h3>
               <p className="text-3xl font-bold text-gray-800">{orders.length}</p>
            </div>
            <div className="bg-white p-6 rounded-lg shadow border-l-4 border-purple-500">
               <h3 className="text-gray-500 text-sm font-bold uppercase">Estrategia Precio</h3>
               <p className="text-lg font-bold text-gray-800">{pricingStrategy}</p>
            </div>
            <div className="col-span-1 md:col-span-3 bg-white p-8 rounded-lg shadow mt-6">
              <h2 className="text-xl font-bold mb-4">Arquitectura del Sistema</h2>
              <p className="text-gray-600 mb-4">
                Esta aplicación demuestra la implementación de patrones de diseño estructurales y de comportamiento para resolver problemas reales de Pymes.
              </p>
              <div className="grid grid-cols-2 gap-4 text-sm">
                <div className="p-3 bg-gray-50 rounded border">
                  <strong>Adapter:</strong> Integración de pasarelas de pago (Configuración).
                </div>
                <div className="p-3 bg-gray-50 rounded border">
                  <strong>Proxy:</strong> Control de acceso a reportes (Reportes).
                </div>
                <div className="p-3 bg-gray-50 rounded border">
                  <strong>Observer:</strong> Notificaciones de stock bajo (Inventario).
                </div>
                <div className="p-3 bg-gray-50 rounded border">
                  <strong>Command/Memento:</strong> Gestión y deshacer acciones de pedidos (Pedidos).
                </div>
                <div className="p-3 bg-gray-50 rounded border">
                  <strong>Strategy:</strong> Cálculo dinámico de precios (Catálogo).
                </div>
                <div className="p-3 bg-gray-50 rounded border">
                  <strong>Iterator:</strong> Navegación eficiente del catálogo (Catálogo).
                </div>
              </div>
            </div>
          </div>
        )}

        {currentView === 'catalog' && (
          <CatalogView products={products} currentStrategyType={pricingStrategy} />
        )}

        {currentView === 'orders' && (
          <OrderView orders={orders} setOrders={setOrders} />
        )}

        {currentView === 'inventory' && (
          <InventoryView products={products} currentUser={currentUser} onUpdateStock={updateStock} />
        )}

        {currentView === 'reports' && (
          <ReportView currentUser={currentUser} />
        )}

        {currentView === 'settings' && (
          <SettingsView 
            currentGateway={activeGateway} 
            setGateway={setActiveGateway}
            currentStrategy={pricingStrategy}
            setStrategy={setPricingStrategy}
          />
        )}

      </main>
    </div>
  );
}

export default App;