import React, { useState } from "react";
import { useQuery, useMutation, useQueryClient } from "@tanstack/react-query";
import { getCartApi, removeFromCartApi, updateCartQuantityApi } from "../api/cartApi";
import { useAuth } from "../Context/AuthContext";
import { Trash2, Minus, Plus, BadgePercent, ShoppingCart } from "lucide-react";
import SaleOffGrid from "../components/SaleOffGrid";
import { useLocation, Link } from "react-router-dom";

const CartPage: React.FC = () => {
  const { user } = useAuth();
  const location = useLocation();
  const guestIdRaw = !user ? localStorage.getItem("guestId") : undefined;
  const guestId = guestIdRaw ?? undefined;
  const queryClient = useQueryClient();
  const { data: cart = [], isLoading, error } = useQuery({
    queryKey: ["cart", user?._id || guestId || "guest"],
    queryFn: () => getCartApi({ userId: user?._id, guestId }),
    enabled: !!user?._id || !!guestId,
  });

  // Checkbox state
  const [selectedIds, setSelectedIds] = useState<string[]>([]);
  const allSelected = cart.length > 0 && selectedIds.length === cart.length;

  // Auto-select buyNowId if present in location.state
  React.useEffect(() => {
    if (location.state && location.state.buyNowId && cart.length > 0) {
      const found = cart.find((item: any) => item.productId?._id === location.state.buyNowId);
      if (found) setSelectedIds([found._id]);
    }
  }, [location.state, cart]);

  // Remove item mutation
  const removeMutation = useMutation({
    mutationFn: (cartItemId: string) => removeFromCartApi(cartItemId),
    onSuccess: () => queryClient.invalidateQueries({ queryKey: ["cart", user?._id || guestId || "guest"] }),
  });

  // Multi-remove
  const handleRemoveSelected = () => {
    Array.isArray(selectedIds) && selectedIds.forEach((id) => removeMutation.mutate(id));
    setSelectedIds([]);
  };

  // Update quantity mutation
  const updateQuantityMutation = useMutation({
    mutationFn: ({ cartItemId, quantity }: { cartItemId: string; quantity: number }) => updateCartQuantityApi(cartItemId, quantity),
    onSuccess: () => queryClient.invalidateQueries({ queryKey: ["cart", user?._id || guestId || "guest"] }),
  });

  // Calculate total and save for selected items only
  let total = 0;
  let save = 0;
  Array.isArray(cart) && cart.forEach((item: any) => {
    if (!selectedIds.includes(item._id)) return;
    const price = item.productId?.price || 0;
    const discount = typeof item.productId?.discount === 'number' ? item.productId.discount : 0;
    const hasDiscount = discount > 0;
    const discountedPrice = hasDiscount ? price * (1 - discount / 100) : price;
    total += discountedPrice * item.quantity;
    if (hasDiscount) save += (price - discountedPrice) * item.quantity;
  });

  // Handle checkbox
  const handleSelect = (id: string) => {
    setSelectedIds((prev) => prev.includes(id) ? prev.filter((x) => x !== id) : [...prev, id]);
  };
  const handleSelectAll = () => {
    if (allSelected) setSelectedIds([]);
    else setSelectedIds(Array.isArray(cart) ? cart.map((item: any) => item._id) : []);
  };

  return (
    <div className="container mx-auto px-4 py-12 min-h-screen">
      <h1 className="text-3xl font-bold mb-8 text-slate-800 flex items-center gap-3">
        <ShoppingCart size={32} className="text-primary-600" />
        Your Cart
      </h1>
      <div className="bg-white rounded-xl shadow p-8">
        {isLoading ? (
          <div className="text-center text-slate-400 py-8">Loading...</div>
        ) : error ? (
          <div className="text-center text-red-500 py-8">Error loading cart</div>
        ) : cart.length === 0 ? (
          <div className="text-center text-slate-400 py-8">Your cart is empty</div>
        ) : (
          <>
            <div className="flex items-center mb-4">
              <input
                type="checkbox"
                checked={allSelected}
                onChange={handleSelectAll}
                className="w-5 h-5 accent-primary-500 mr-2"
                aria-label="Select all"
              />
              <span className="font-semibold text-slate-700">Select All</span>
              {selectedIds.length > 0 && (
                <button
                  className="ml-4 px-3 py-1 bg-red-100 text-red-700 rounded hover:bg-red-200 font-semibold flex items-center gap-1"
                  onClick={handleRemoveSelected}
                  disabled={removeMutation.status === 'pending'}
                >
                  <Trash2 size={16} /> Remove Selected
                </button>
              )}
            </div>
            <ul className="space-y-0 mb-8">
              {(Array.isArray(cart) ? cart : []).map((item: any, idx: number) => {
                const price = item.productId?.price || 0;
                const discount = typeof item.productId?.discount === 'number' ? item.productId.discount : 0;
                const hasDiscount = discount > 0;
                const discountedPrice = hasDiscount ? price * (1 - discount / 100) : price;
                const checked = selectedIds.includes(item._id);
                return (
                  <li key={item._id} className={`flex flex-col md:flex-row md:items-center gap-6 px-2 py-4 bg-white ${idx !== cart.length - 1 ? 'border-b border-slate-200' : ''}`}>
                    <input
                      type="checkbox"
                      checked={checked}
                      onChange={() => handleSelect(item._id)}
                      className="w-5 h-5 accent-primary-500 mr-2 self-start md:self-center"
                      aria-label="Select item"
                    />
                    <img
                      src={item.productId?.images?.[0]?.url || "/images/placeholder-product.jpg"}
                      alt={item.productId?.name || "Product"}
                      className="w-20 h-20 object-contain rounded bg-slate-100"
                    />
                    <div className="flex-1 min-w-0">
                      <div className="font-semibold text-slate-800 text-base truncate mb-1">{item.productId?.name || "Product"}</div>
                      <div className="flex items-center gap-2 mb-1">
                        <button
                          className="p-1 rounded-full bg-slate-100 hover:bg-primary-100 border border-slate-200"
                          onClick={() => updateQuantityMutation.mutate({ cartItemId: item._id, quantity: Math.max(1, item.quantity - 1) })}
                          disabled={item.quantity <= 1 || updateQuantityMutation.status === 'pending'}
                          aria-label="Decrease quantity"
                        >
                          <Minus size={16} />
                        </button>
                        <span className="px-2 text-base font-semibold text-slate-700">{item.quantity}</span>
                        <button
                          className="p-1 rounded-full bg-slate-100 hover:bg-primary-100 border border-slate-200"
                          onClick={() => updateQuantityMutation.mutate({ cartItemId: item._id, quantity: item.quantity + 1 })}
                          disabled={updateQuantityMutation.status === 'pending'}
                          aria-label="Increase quantity"
                        >
                          <Plus size={16} />
                        </button>
                        <button
                          className="ml-2 p-1 rounded-full bg-red-100 hover:bg-red-200 text-red-600 shadow border border-red-200 transition"
                          onClick={() => removeMutation.mutate(item._id)}
                          aria-label="Remove item"
                          disabled={removeMutation.status === 'pending'}
                        >
                          <Trash2 size={16} />
                        </button>
                      </div>
                      {hasDiscount && (
                        <div className="flex items-center gap-1 text-xs text-red-500 font-semibold">
                          <BadgePercent size={14} />
                          <span>Save {((price - discountedPrice) * item.quantity).toFixed(2)}$</span>
                        </div>
                      )}
                    </div>
                    <div className="flex flex-col items-end min-w-[90px]">
                      {hasDiscount ? (
                        <>
                          <span className="font-bold text-primary-600 text-base">{hasDiscount ? (<><span className='mr-1'>€</span>{discountedPrice.toFixed(2)}</>) : (<><span className='mr-1'>€</span>{price.toFixed(2)}</>)}
                          </span>
                          {hasDiscount && (
                            <span className="text-xs text-slate-400 line-through ml-1"><span className='mr-1'>€</span>{price.toFixed(2)}</span>
                          )}
                          <span className="text-xs text-slate-500 mt-1">Total: <span className='mr-1'>€</span>{(discountedPrice * item.quantity).toFixed(2)}</span>
                        </>
                      ) : (
                        <span className="font-bold text-primary-600 text-base"><span className='mr-1'>€</span>{price.toFixed(2)}</span>
                      )}
                    </div>
                  </li>
                );
              })}
            </ul>
            <div className="flex flex-col items-end gap-2">
              <div className="flex items-center gap-2 text-lg font-bold text-primary-700">
                <span>Total:</span>
                <span><span className='mr-1'>€</span>{total.toFixed(2)}</span>
              </div>
              {save > 0 && (
                <div className="flex items-center gap-2 text-green-600 text-sm font-semibold">
                  <BadgePercent size={16} />
                  <span>You save</span>
                  <span className="font-bold"><span className='mr-1'>€</span>{save.toFixed(2)}</span>
                </div>
              )}
              <Link
                to={total === 0 ? '#' : "/checkout"}
                state={selectedIds.length > 0 ? { selectedIds } : undefined}
                className={`mt-4 px-8 py-3 bg-primary-200 rounded-lg font-bold text-lg shadow hover:bg-primary-700 transition disabled:opacity-60 ${total === 0 ? 'cursor-not-allowed' : 'cursor-pointer'} text-center block`}
                tabIndex={total === 0 ? -1 : 0}
                aria-disabled={total === 0}
                onClick={e => { if (total === 0) e.preventDefault(); }}
              >
                Checkout
              </Link>
            </div>
          </>
        )}
      </div>
      {/* Cross-sell: Sale Off Slide */}
      <div className="mt-16">
        <SaleOffGrid />
      </div>
    </div>
  );
};

export default CartPage;
