import { Order, OrderStatus, PaymentGatewayType, PricingStrategyType, Product, User, UserRole, Notification } from './types';

// ==========================================
// 1. STRATEGY PATTERN (Pricing)
// ==========================================
export interface PricingStrategy {
  calculate(price: number): number;
  getName(): string;
}

export class StandardPricingStrategy implements PricingStrategy {
  calculate(price: number): number {
    return price;
  }
  getName() { return "Precio Estándar"; }
}

export class DiscountPricingStrategy implements PricingStrategy {
  constructor(private discountPercent: number = 10) {}
  calculate(price: number): number {
    return price * (1 - this.discountPercent / 100);
  }
  getName() { return `Descuento ${this.discountPercent}%`; }
}

export class DynamicPricingStrategy implements PricingStrategy {
  calculate(price: number): number {
    // Simulate high demand increase
    return price * 1.15;
  }
  getName() { return "Dinámico (Temporada Alta)"; }
}

export class PriceContext {
  private strategy: PricingStrategy;

  constructor(strategy: PricingStrategy) {
    this.strategy = strategy;
  }

  setStrategy(strategy: PricingStrategy) {
    this.strategy = strategy;
  }

  getPrice(price: number): number {
    return this.strategy.calculate(price);
  }
}

// ==========================================
// 2. ADAPTER PATTERN (Payments)
// ==========================================
export interface PaymentProcessor {
  processPayment(amount: number): string;
}

// Adaptees (The incompatible classes)
class PayPalService {
  sendPayment(amt: number) { return `Pagado $${amt} via PayPal API.`; }
}
class YapeService {
  yapear(monto: number) { return `Yapeo de S/.${monto} realizado.`; }
}
class PlinService {
  transferir(cantidad: number) { return `Plin enviado: S/.${cantidad}.`; }
}

// The Adapter
export class PaymentAdapter implements PaymentProcessor {
  private type: PaymentGatewayType;
  private paypal: PayPalService = new PayPalService();
  private yape: YapeService = new YapeService();
  private plin: PlinService = new PlinService();

  constructor(type: PaymentGatewayType) {
    this.type = type;
  }

  processPayment(amount: number): string {
    switch (this.type) {
      case PaymentGatewayType.PAYPAL:
        return this.paypal.sendPayment(amount);
      case PaymentGatewayType.YAPE:
        return this.yape.yapear(amount);
      case PaymentGatewayType.PLIN:
        return this.plin.transferir(amount);
      default:
        throw new Error("Pasarela no soportada");
    }
  }
}

// ==========================================
// 3. PROXY PATTERN (Reports)
// ==========================================
export interface IReportService {
  getFinancialReport(user: User): string;
}

class RealReportService implements IReportService {
  getFinancialReport(user: User): string {
    return "REPORTE FINANCIERO CONFIDENCIAL: Ingresos Totales: $50,000 | Margen Neto: 22%";
  }
}

export class ReportProxy implements IReportService {
  private realService: RealReportService;

  constructor() {
    this.realService = new RealReportService();
  }

  getFinancialReport(user: User): string {
    if (user.role === UserRole.MANAGER || user.role === UserRole.ACCOUNTANT) {
      return this.realService.getFinancialReport(user);
    } else {
      throw new Error(`ACCESO DENEGADO: El rol '${user.role}' no tiene permisos para ver reportes financieros.`);
    }
  }
}

// ==========================================
// 4. OBSERVER PATTERN (Inventory)
// ==========================================
export type ObserverCallback = (notification: Notification) => void;

export class InventorySubject {
  private observers: ObserverCallback[] = [];
  
  subscribe(observer: ObserverCallback) {
    this.observers.push(observer);
  }

  unsubscribe(observer: ObserverCallback) {
    this.observers = this.observers.filter(obs => obs !== observer);
  }

  notify(product: Product) {
    if (product.stock < product.minStock) {
      const notification: Notification = {
        id: Date.now().toString(),
        message: `ALERTA DE STOCK: El producto '${product.name}' tiene bajo stock (${product.stock} un.). Mínimo requerido: ${product.minStock}.`,
        type: 'warning',
        timestamp: new Date()
      };
      this.observers.forEach(obs => obs(notification));
    }
  }
}

// ==========================================
// 5. COMMAND & MEMENTO PATTERN (Orders)
// ==========================================

// Memento: Represents the state of an order
export class OrderMemento {
  constructor(public readonly state: string) {}
}

// Command Interface
export interface OrderCommand {
  execute(): void;
  undo(): void;
}

// Invoker
export class OrderInvoker {
  private history: OrderCommand[] = [];

  executeCommand(command: OrderCommand) {
    command.execute();
    this.history.push(command);
  }

  undoLastCommand() {
    const command = this.history.pop();
    if (command) {
      command.undo();
    }
  }
  
  canUndo(): boolean {
    return this.history.length > 0;
  }
}

// ==========================================
// 6. ITERATOR PATTERN (Catalog)
// ==========================================
export class ProductCollection {
  constructor(private products: Product[]) {}

  getIterator() {
    return new ProductIterator(this.products);
  }
}

export class ProductIterator {
  private position: number = 0;

  constructor(private collection: Product[]) {}

  next(): Product {
    const product = this.collection[this.position];
    this.position += 1;
    return product;
  }

  hasNext(): boolean {
    return this.position < this.collection.length;
  }

  reset(): void {
    this.position = 0;
  }

  // Extended for pagination logic required by RF11
  getPaged(page: number, pageSize: number, filter: (p: Product) => boolean): { data: Product[], total: number } {
    const filtered = this.collection.filter(filter);
    const start = (page - 1) * pageSize;
    const end = start + pageSize;
    return {
      data: filtered.slice(start, end),
      total: filtered.length
    };
  }
}