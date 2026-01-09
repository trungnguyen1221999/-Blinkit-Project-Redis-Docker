import { useQuery } from '@tanstack/react-query';
import { getAllProductsApi } from '../api/adminApi/productApi';
import { Link } from 'react-router-dom';
import { Package, Grid3X3 } from 'lucide-react';

const ProductsPage = () => {
  // Fetch all products
  const { data: products = [], isLoading } = useQuery({
    queryKey: ['products'],
    queryFn: getAllProductsApi,
  });

  if (isLoading) {
    return (
      <div className="container mx-auto px-4 py-8">
        <div className="flex items-center justify-center min-h-[400px]">
          <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-primary-600"></div>
        </div>
      </div>
    );
  }

  return (
    <div className="container mx-auto px-4 py-8">
      <div className="text-center mb-8">
        <div className="flex items-center justify-center mb-4">
          <Grid3X3 size={32} className="text-primary-600 mr-3" />
          <h1 className="text-4xl font-bold text-slate-800">
            All Products
          </h1>
        </div>
        <p className="text-slate-600 text-lg mb-8">
          Browse our complete product catalog
        </p>
      </div>

      {products.length > 0 ? (
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6">
          {(Array.isArray(products) ? products : []).map((product: any) => (
            <div key={product._id} className="bg-white border border-slate-200 rounded-xl p-6 hover:shadow-lg transition-shadow">
              <div className="text-center">
                <Package size={24} className="mx-auto text-slate-400 mb-3" />
                <h3 className="font-semibold text-slate-800 mb-2">{product.name}</h3>
                <p className="text-sm text-slate-500 mb-3">
                  Stock: {product.stock || 0}
                </p>
                {product.price && (
                  <p className="text-lg font-bold text-primary-600">
                    ${(product.price || 0).toFixed(2)}
                  </p>
                )}
              </div>
            </div>
          ))}
        </div>
      ) : (
        <div className="text-center">
          <div className="bg-slate-50 rounded-xl p-8 max-w-md mx-auto">
            <Package size={48} className="mx-auto text-slate-400 mb-4" />
            <h3 className="font-semibold text-slate-700 mb-2">No Products Found</h3>
            <p className="text-sm text-slate-500">
              There are no products available at the moment.
            </p>
          </div>
        </div>
      )}

      {/* Back to Home */}
      <div className="text-center mt-8">
        <Link
          to="/"
          className="inline-flex items-center space-x-2 px-6 py-3 bg-slate-600 text-white rounded-lg hover:bg-slate-700 transition-colors"
        >
          <span>Back to Home</span>
        </Link>
      </div>
    </div>
  );
};

export default ProductsPage;