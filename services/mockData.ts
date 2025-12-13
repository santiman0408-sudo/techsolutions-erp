import { Product, User, UserRole, Order, OrderStatus } from '../types';

export const INITIAL_PRODUCTS: Product[] = [
  { 
    id: '1', 
    name: 'Laptop HP ProBook', 
    price: 3500, 
    stock: 15, 
    minStock: 5, 
    category: 'Electrónica',
    image: 'https://pe-media.hptiendaenlinea.com/catalog/product/cache/314dec89b3219941707ad62ccc90e585/A/2/A24Z8LA-1_T1743543969.png'
  },
  { 
    id: '2', 
    name: 'Mouse Logitech', 
    price: 80, 
    stock: 4, 
    minStock: 10, 
    category: 'Accesorios',
    image: 'https://media.falabella.com/falabellaPE/115229143_01/w=800,h=800,fit=pad'
  }, // Low stock
  { 
    id: '3', 
    name: 'Monitor Dell 24"', 
    price: 800, 
    stock: 8, 
    minStock: 5, 
    category: 'Electrónica',
    image: 'https://m.media-amazon.com/images/I/71cFowT6PZL._AC_SL1122_.jpg'
  },
  { 
    id: '4', 
    name: 'Teclado Mecánico', 
    price: 250, 
    stock: 20, 
    minStock: 5, 
    category: 'Accesorios',
    image: 'https://co-media.hptiendaenlinea.com/magefan_blog/teclados_mecanicos_para_computadora.jpg'
  },
  { 
    id: '5', 
    name: 'Silla Ergonómica', 
    price: 600, 
    stock: 3, 
    minStock: 5, 
    category: 'Muebles',
    image: 'https://d20f60vzbd93dl.cloudfront.net/uploads/tienda_008379/tienda_008379_3b9fad072097340ca47bbf065e6dc6662184a9b6_producto_large_90.png?not-from-cache-please'
  }, // Low stock
  { 
    id: '6', 
    name: 'Escritorio Vidrio', 
    price: 400, 
    stock: 10, 
    minStock: 2, 
    category: 'Muebles',
    image: 'https://ambiant.com.mx/cdn/shop/products/esq-sq.png?v=1649713772&width=1000'
  },
  { 
    id: '7', 
    name: 'Webcam HD', 
    price: 150, 
    stock: 12, 
    minStock: 5, 
    category: 'Electrónica',
    image: 'https://pngimg.com/uploads/web_camera/web_camera_PNG101403.png'
  },
  { 
    id: '8', 
    name: 'Headset Gamer', 
    price: 300, 
    stock: 7, 
    minStock: 5, 
    category: 'Accesorios',
    image: 'https://coolboxpe.vtexassets.com/arquivos/ids/324126-300-300?v=638342791390730000&width=300&height=300&aspect=true'
  },
];

export const USERS: User[] = [
  { id: 'u1', name: 'Carlos (Gerente)', role: UserRole.MANAGER },
  { id: 'u2', name: 'Ana (Contadora)', role: UserRole.ACCOUNTANT },
  { id: 'u3', name: 'Luis (Ventas)', role: UserRole.SALES },
  { id: 'u4', name: 'Maria (Compras)', role: UserRole.BUYER },
];

export const INITIAL_ORDERS: Order[] = [
  { id: 'o1', customerName: 'Empresa ABC', total: 3580, status: OrderStatus.PROCESSED, items: [{ productId: '1', quantity: 1 }, { productId: '2', quantity: 1 }] }
];