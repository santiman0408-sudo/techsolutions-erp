import React, { useState, useMemo } from 'react';
import { Product, PricingStrategyType } from '../types';
import { ProductCollection, PriceContext, StandardPricingStrategy, DiscountPricingStrategy, DynamicPricingStrategy } from '../patterns';

interface CatalogViewProps {
  products: Product[];
  currentStrategyType: PricingStrategyType;
}

const CatalogView: React.FC<CatalogViewProps> = ({ products, currentStrategyType }) => {
  const [page, setPage] = useState(1);
  const [search, setSearch] = useState('');
  const pageSize = 4;

  // Pattern Implementation: Strategy
  const pricingContext = useMemo(() => {
    const ctx = new PriceContext(new StandardPricingStrategy());
    switch (currentStrategyType) {
      case PricingStrategyType.DISCOUNT:
        ctx.setStrategy(new DiscountPricingStrategy(15)); // 15% discount
        break;
      case PricingStrategyType.DYNAMIC:
        ctx.setStrategy(new DynamicPricingStrategy());
        break;
      default:
        ctx.setStrategy(new StandardPricingStrategy());
    }
    return ctx;
  }, [currentStrategyType]);

  // Pattern Implementation: Iterator
  const { pagedProducts, totalProducts } = useMemo(() => {
    const collection = new ProductCollection(products);
    const iterator = collection.getIterator();
    
    const filter = (p: Product) => p.name.toLowerCase().includes(search.toLowerCase());
    const result = iterator.getPaged(page, pageSize, filter);
    
    return { pagedProducts: result.data, totalProducts: result.total };
  }, [products, page, search, pageSize]);

  const totalPages = Math.ceil(totalProducts / pageSize);

  return (
    <div className="space-y-6">
      <div className="bg-white p-6 rounded-lg shadow-md border border-gray-100">
        <div className="flex justify-between items-center mb-6">
          <h2 className="text-2xl font-bold text-gray-800">Catálogo de Productos</h2>
          <div className="text-sm px-3 py-1 bg-blue-100 text-blue-800 rounded-full">
            Estrategia de Precio: <strong>{currentStrategyType}</strong>
          </div>
        </div>

        {/* Search / Filter */}
        <div className="mb-6">
           <input 
             type="text" 
             placeholder="Buscar producto..." 
             className="w-full md:w-1/3 p-2 border rounded-md focus:ring-2 focus:ring-accent outline-none"
             value={search}
             onChange={(e) => { setSearch(e.target.value); setPage(1); }}
           />
        </div>

        {/* Product Grid */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
          {pagedProducts.map(product => {
             const finalPrice = pricingContext.getPrice(product.price);
             return (
              <div key={product.id} className="border rounded-lg p-4 hover:shadow-lg transition-shadow bg-gray-50 flex flex-col group">
                <div className="h-56 bg-white rounded mb-4 flex items-center justify-center relative overflow-hidden p-4">
                  {product.image ? (
                    <img 
                      src={product.image} 
                      alt={product.name} 
                      className="w-full h-full object-contain group-hover:scale-105 transition-transform duration-300"
                    />
                  ) : (
                    <span className="text-4xl text-gray-300">📷</span>
                  )}
                  {product.stock < product.minStock && (
                     <div className="absolute top-2 right-2 bg-red-500 text-white text-xs px-2 py-1 rounded shadow">
                        Bajo Stock
                     </div>
                  )}
                </div>
                <h3 className="font-semibold text-lg text-gray-800 mb-1 leading-tight">{product.name}</h3>
                <p className="text-sm text-gray-500 mb-3">{product.category}</p>
                
                <div className="mt-auto pt-2 border-t border-gray-100">
                   <div className="flex justify-between items-end">
                      <div>
                        {currentStrategyType !== PricingStrategyType.STANDARD && (
                           <span className="text-xs text-red-400 line-through mr-2 block">S/. {product.price.toFixed(2)}</span>
                        )}
                        <span className="text-xl font-bold text-green-600">S/. {finalPrice.toFixed(2)}</span>
                      </div>
                      <div className={`text-xs px-2 py-1 rounded ${product.stock < product.minStock ? 'bg-red-100 text-red-600' : 'bg-green-100 text-green-600'}`}>
                        {product.stock} un.
                      </div>
                   </div>
                </div>
              </div>
             );
          })}
        </div>
        
        {/* Pagination Controls */}
        <div className="mt-8 flex justify-center items-center space-x-4">
          <button 
            disabled={page === 1}
            onClick={() => setPage(p => p - 1)}
            className="px-4 py-2 bg-white border border-gray-300 rounded hover:bg-gray-50 disabled:opacity-50"
          >
            Anterior
          </button>
          <span className="text-gray-600">Página {page} de {totalPages || 1}</span>
          <button 
             disabled={page >= totalPages}
             onClick={() => setPage(p => p + 1)}
             className="px-4 py-2 bg-white border border-gray-300 rounded hover:bg-gray-50 disabled:opacity-50"
          >
            Siguiente
          </button>
        </div>
      </div>
    </div>
  );
};

export default CatalogView;