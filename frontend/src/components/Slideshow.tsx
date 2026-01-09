import React from 'react';

interface Product {
  _id: string;
  name: string;
  images: Array<{ url: string; public_id: string }>;
  price: number;
  unit: string;
}

interface SlideshowProps {
  products: Product[];
  onProductClick?: (product: Product) => void;
}

const Slideshow: React.FC<SlideshowProps> = ({ products, onProductClick }) => {
  return (
    <div className="w-full max-w-4xl mx-auto mt-12">
      <h3 className="text-2xl font-extrabold mb-4 text-slate-900">Related Products</h3>
      <div className="flex gap-6 overflow-x-auto pb-2 scrollbar-thin scrollbar-thumb-primary-200">
        {products.map((product) => (
          <div
            key={product._id}
            className="min-w-[200px] max-w-[220px] bg-white rounded-xl shadow hover:shadow-lg transition flex flex-col items-center p-4 cursor-pointer border border-slate-100 hover:border-primary-200"
            onClick={() => onProductClick?.(product)}
          >
            <div className="w-full aspect-square flex items-center justify-center mb-2">
              <img
                src={product.images?.[0]?.url || '/images/placeholder-product.jpg'}
                alt={product.name}
                className="object-contain w-full h-full rounded"
              />
            </div>
            <div className="w-full flex flex-col items-center">
              <span className="font-bold text-base text-slate-900 text-center line-clamp-2 mb-1">{product.name}</span>
              <span className="text-primary-600 font-extrabold text-lg">${product.price.toFixed(2)}<span className="text-xs font-normal text-slate-700">/{product.unit}</span></span>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
};

export default Slideshow;
