import React, { useState, useRef } from 'react';
import { Order, OrderStatus } from '../types';
import { OrderCommand, OrderInvoker } from '../patterns';

// --- Commands Implementation for this View ---
// We implement commands here because they need access to the state setter of the component (closure)
// In a Redux app, these would dispatch actions. Here, we simulate it directly.

class CreateOrderCommand implements OrderCommand {
  constructor(
    private order: Order,
    private setOrders: React.Dispatch<React.SetStateAction<Order[]>>,
    private ordersRef: React.MutableRefObject<Order[]> // Reference to current state for undo
  ) {}

  execute() {
    this.setOrders(prev => [...prev, this.order]);
  }

  undo() {
    this.setOrders(prev => prev.filter(o => o.id !== this.order.id));
  }
}

class ChangeStatusCommand implements OrderCommand {
  private previousStatus: OrderStatus;

  constructor(
    private orderId: string,
    private newStatus: OrderStatus,
    private setOrders: React.Dispatch<React.SetStateAction<Order[]>>,
    private ordersRef: React.MutableRefObject<Order[]>
  ) {
    const order = ordersRef.current.find(o => o.id === orderId);
    this.previousStatus = order ? order.status : OrderStatus.PENDING;
  }

  execute() {
    this.setOrders(prev => prev.map(o => o.id === this.orderId ? { ...o, status: this.newStatus } : o));
  }

  undo() {
    this.setOrders(prev => prev.map(o => o.id === this.orderId ? { ...o, status: this.previousStatus } : o));
  }
}

interface OrderViewProps {
  orders: Order[];
  setOrders: React.Dispatch<React.SetStateAction<Order[]>>;
}

const OrderView: React.FC<OrderViewProps> = ({ orders, setOrders }) => {
  const [invoker] = useState(() => new OrderInvoker());
  // We need a ref to access the *current* orders inside command closures without stale closures issue if we were doing complex logic,
  // though for this simple structure, functional updates in setOrders cover most cases.
  const ordersRef = useRef(orders);
  ordersRef.current = orders;
  
  // Force update to re-render when invoker history changes (since invoker is not state)
  const [, setTick] = useState(0); 

  const handleCreateOrder = () => {
    const newOrder: Order = {
      id: `o${Date.now()}`,
      customerName: 'Cliente Nuevo',
      total: Math.floor(Math.random() * 1000) + 100,
      status: OrderStatus.PENDING,
      items: []
    };

    const cmd = new CreateOrderCommand(newOrder, setOrders, ordersRef);
    invoker.executeCommand(cmd);
    setTick(t => t + 1);
  };

  const handleChangeStatus = (orderId: string, status: OrderStatus) => {
    const cmd = new ChangeStatusCommand(orderId, status, setOrders, ordersRef);
    invoker.executeCommand(cmd);
    setTick(t => t + 1);
  };

  const handleUndo = () => {
    if (invoker.canUndo()) {
      invoker.undoLastCommand();
      setTick(t => t + 1);
    }
  };

  return (
    <div className="bg-white p-6 rounded-lg shadow-md border border-gray-100">
      <div className="flex justify-between items-center mb-6">
        <div>
           <h2 className="text-2xl font-bold text-gray-800">Gestión de Pedidos</h2>
           <p className="text-sm text-gray-500">Patrón Command & Memento</p>
        </div>
        
        <div className="space-x-3">
          <button 
            onClick={handleUndo}
            disabled={!invoker.canUndo()}
            className="px-4 py-2 bg-yellow-50 text-yellow-700 border border-yellow-200 rounded hover:bg-yellow-100 disabled:opacity-50 disabled:cursor-not-allowed flex items-center gap-2"
          >
            <span>↩️</span> Deshacer
          </button>
          <button 
            onClick={handleCreateOrder}
            className="px-4 py-2 bg-accent text-white rounded hover:bg-blue-600 shadow"
          >
            + Nuevo Pedido
          </button>
        </div>
      </div>

      <div className="overflow-x-auto">
        <table className="min-w-full text-left text-sm">
          <thead className="bg-gray-50 border-b">
            <tr>
              <th className="p-3 font-medium text-gray-600">ID Pedido</th>
              <th className="p-3 font-medium text-gray-600">Cliente</th>
              <th className="p-3 font-medium text-gray-600">Total</th>
              <th className="p-3 font-medium text-gray-600">Estado</th>
              <th className="p-3 font-medium text-gray-600 text-right">Acciones</th>
            </tr>
          </thead>
          <tbody className="divide-y divide-gray-100">
            {orders.map(order => (
              <tr key={order.id} className="hover:bg-gray-50">
                <td className="p-3 font-mono text-gray-500">{order.id}</td>
                <td className="p-3 font-medium">{order.customerName}</td>
                <td className="p-3">S/. {order.total.toFixed(2)}</td>
                <td className="p-3">
                  <span className={`px-2 py-1 rounded-full text-xs font-semibold
                    ${order.status === OrderStatus.PENDING ? 'bg-yellow-100 text-yellow-800' : 
                      order.status === OrderStatus.PROCESSED ? 'bg-green-100 text-green-800' : 
                      'bg-red-100 text-red-800'}`}>
                    {order.status}
                  </span>
                </td>
                <td className="p-3 text-right space-x-2">
                  {order.status === OrderStatus.PENDING && (
                    <>
                      <button 
                        onClick={() => handleChangeStatus(order.id, OrderStatus.PROCESSED)}
                        className="text-green-600 hover:text-green-800 font-medium"
                      >
                        Procesar
                      </button>
                      <button 
                        onClick={() => handleChangeStatus(order.id, OrderStatus.CANCELLED)}
                        className="text-red-500 hover:text-red-700 font-medium"
                      >
                        Cancelar
                      </button>
                    </>
                  )}
                  {order.status !== OrderStatus.PENDING && (
                      <span className="text-gray-400 italic">Archivado</span>
                  )}
                </td>
              </tr>
            ))}
            {orders.length === 0 && (
                <tr>
                    <td colSpan={5} className="p-8 text-center text-gray-400">No hay pedidos registrados</td>
                </tr>
            )}
          </tbody>
        </table>
      </div>
    </div>
  );
};

export default OrderView;