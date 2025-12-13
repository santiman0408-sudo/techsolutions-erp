// Domain Entities

export enum UserRole {
  ADMIN = 'Administrador',
  MANAGER = 'Gerente',
  ACCOUNTANT = 'Contador',
  BUYER = 'Compras',
  SALES = 'Ventas'
}

export interface User {
  id: string;
  name: string;
  role: UserRole;
}

export interface Product {
  id: string;
  name: string;
  price: number;
  stock: number;
  minStock: number;
  category: string;
  image?: string;
}

export enum OrderStatus {
  PENDING = 'Pendiente',
  PROCESSED = 'Procesado',
  CANCELLED = 'Cancelado'
}

export interface Order {
  id: string;
  customerName: string;
  total: number;
  status: OrderStatus;
  items: { productId: string; quantity: number }[];
}

export interface Notification {
  id: string;
  message: string;
  type: 'info' | 'warning' | 'error';
  timestamp: Date;
}

// Pattern Specific Types

// Strategy
export enum PricingStrategyType {
  STANDARD = 'ESTÁNDAR',
  DISCOUNT = 'DESCUENTO',
  DYNAMIC = 'DINÁMICO'
}

// Adapter
export enum PaymentGatewayType {
  PAYPAL = 'PayPal',
  YAPE = 'Yape',
  PLIN = 'Plin'
}

// Iterator
export interface FilterCriteria {
  search: string;
  category?: string;
}