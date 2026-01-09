import { useState } from 'react';
import { ShoppingCart, Plus } from 'lucide-react';

interface AddToCartProps {
  product: any;
  quantity?: number;
  setQuantity?: (q: number) => void;
  onAddToCart?: (product: any, quantity: number) => void;
  onBuyNow?: (product: any, quantity: number) => void;
}

const AddToCart = ({ product, quantity = 1, setQuantity, onAddToCart, onBuyNow }: AddToCartProps) => {
  const [internalQty, setInternalQty] = useState(quantity);
  const qty = setQuantity ? quantity : internalQty;
  const updateQty = setQuantity || setInternalQty;

  const handleAdd = () => {
    if (onAddToCart) onAddToCart(product, qty);
  };
  const handleBuyNow = () => {
    if (onBuyNow) onBuyNow(product, qty);
  };

  return (
    <div className="flex flex-col sm:flex-row items-center gap-3 w-full">
      <div className="flex items-center border border-slate-200 rounded-lg overflow-hidden bg-white">
        <button
          className="px-3 py-2 text-lg font-bold text-slate-500 hover:text-primary-600 disabled:opacity-50"
          onClick={() => updateQty(Math.max(1, qty - 1))}
          disabled={qty <= 1}
        >
          -
        </button>
        <input
          type="number"
          min={1}
          value={qty}
          onChange={e => updateQty(Math.max(1, Number(e.target.value)))}
          className="w-12 text-center font-semibold text-base outline-none border-0 bg-transparent"
        />
        <button
          className="px-3 py-2 text-lg font-bold text-slate-500 hover:text-primary-600"
          onClick={() => updateQty(qty + 1)}
        >
          +
        </button>
      </div>
      <button
        className="flex items-center gap-2 px-6 py-3 bg-primary-200 hover:bg-primary-300 text-black rounded-full font-bold text-base shadow transition-all w-full sm:w-auto justify-center"
        onClick={handleAdd}
      >
        <Plus className="w-5 h-5" /> Add to Cart
      </button>
      <button
        className="flex items-center gap-2 px-6 py-3 bg-red-500 hover:bg-red-600 text-white rounded-full font-bold text-base shadow transition-all w-full sm:w-auto justify-center"
        onClick={handleBuyNow}
      >
        <ShoppingCart className="w-5 h-5" /> Buy Now
      </button>
    </div>
  );
};

export default AddToCart;
