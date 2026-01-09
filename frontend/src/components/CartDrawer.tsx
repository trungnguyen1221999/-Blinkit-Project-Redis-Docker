import React from "react";
import { ShoppingCart, X, Trash2, Minus, Plus, BadgePercent } from "lucide-react";
import { useQuery, useMutation, useQueryClient } from "@tanstack/react-query";
import { getCartApi, removeFromCartApi, updateCartQuantityApi } from "../api/cartApi";
import { useAuth } from "../Context/AuthContext";
import { Link } from "react-router-dom";

interface CartDrawerProps {
  open: boolean;
  onClose: () => void;
}

const CartDrawer: React.FC<CartDrawerProps> = ({ open, onClose }) => {
  const { user } = useAuth();
  const guestIdRaw = !user ? localStorage.getItem("guestId") : undefined;
  const guestId = guestIdRaw ?? undefined;
  const queryClient = useQueryClient();
  const { data: cart = [], isLoading, error } = useQuery({
    queryKey: ["cart", user?._id || guestId || "guest"],
    queryFn: () => getCartApi({ userId: user?._id, guestId }),
    enabled: !!user?._id || !!guestId,
  });

  // Remove item mutation
  const removeMutation = useMutation({
    mutationFn: (cartItemId: string) => removeFromCartApi(cartItemId),
    onSuccess: () => queryClient.invalidateQueries({ queryKey: ["cart", user?._id || guestId || "guest"] }),
  });

  // Update quantity mutation
  const updateQuantityMutation = useMutation({
    mutationFn: ({ cartItemId, quantity }: { cartItemId: string; quantity: number }) => updateCartQuantityApi(cartItemId, quantity),
    onSuccess: () => queryClient.invalidateQueries({ queryKey: ["cart", user?._id || guestId || "guest"] }),
  });

  // Calculate total and save amount
  let total = 0;
  let save = 0;
  Array.isArray(cart) && cart.forEach((item: any) => {
    const price = item.productId?.price || 0;
    const discount = typeof item.productId?.discount === 'number' ? item.productId.discount : 0;
    const hasDiscount = discount > 0;
    const discountedPrice = hasDiscount ? price * (1 - discount / 100) : price;
    total += discountedPrice * item.quantity;
    if (hasDiscount) save += (price - discountedPrice) * item.quantity;
  });

  console.log("CartDrawer open:", open);

  return (
    <>
      {/* Overlay for closing by clicking outside */}
      <div
        className={`fixed inset-0 bg-black/30 z-9998 transition-opacity duration-300 ${open ? "opacity-100" : "opacity-0 pointer-events-none"}`}
        onClick={onClose}
        aria-label="Close cart drawer"
      />
      {/* Drawer */}
      <div
        className={`fixed top-0 right-0 h-full w-full max-w-md bg-white shadow-2xl z-9999 transition-transform duration-300 ease-in-out flex flex-col border-l border-slate-200
        ${open ? "translate-x-0" : "translate-x-full"}`}
        style={{ willChange: "transform" }}
        role="dialog"
        aria-modal="true"
      >
        {/* Header */}
        <div className="flex items-center justify-between p-5 bg-primary-100">
          <div className="flex items-center gap-2">
            <ShoppingCart size={24} className="text-primary-600" />
            <span className="font-bold text-xl text-slate-800">Your Cart</span>
          </div>
          <button onClick={onClose} className="text-slate-400 hover:text-red-500 p-2 rounded-full transition" aria-label="Close cart">
            <X size={24} />
          </button>
        </div>
        {/* Body */}
        <div className="flex-1 overflow-y-auto p-6 bg-linear-to-b from-white via-slate-50 to-white">
          {isLoading ? (
            <div className="text-center text-slate-400 py-12 animate-pulse">Loading...</div>
          ) : error ? (
            <div className="text-center text-red-500 py-12">Error loading cart</div>
          ) : cart.length === 0 ? (
            <div className="text-center text-slate-500 py-12 text-lg font-semibold">
              Your cart is empty.<br />
              Start shopping now and discover great deals!
              <br />
             
            </div>
          ) : (
            <ul className="space-y-5">
              {(Array.isArray(cart) ? cart : []).map((item: any) => {
                const price = item.productId?.price || 0;
                const discount = typeof item.productId?.discount === 'number' ? item.productId.discount : 0;
                const hasDiscount = discount > 0;
                const discountedPrice = hasDiscount ? price * (1 - discount / 100) : price;
                return (
                  <li key={item._id} className="flex items-center gap-4 bg-white rounded-xl shadow p-3 group">
                    <img src={item.productId?.images?.[0]?.url || "/images/placeholder-product.jpg"} alt={item.productId?.name || "Product"} className="w-16 h-16 object-contain rounded-lg bg-slate-100" />
                    <div className="flex-1 min-w-0">
                      <div className="font-semibold text-slate-800 text-sm truncate">{item.productId?.name || "Product"}</div>
                      <div className="flex items-center gap-2 mt-1">
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
                        <div className="flex items-center gap-1 mt-1 text-xs text-red-500 font-semibold">
                          <BadgePercent size={14} />
                          <span>Save <span className='mr-1'>€</span>{((price - discountedPrice) * item.quantity).toFixed(2)}</span>
                        </div>
                      )}
                    </div>
                    <div className="flex flex-col items-end min-w-[70px]">
                      {hasDiscount ? (
                        <>
                          <span className="font-bold text-primary-600 text-base"><span className='mr-1'>€</span>{discountedPrice.toFixed(2)}</span>
                          <span className="text-xs text-slate-400 line-through"><span className='mr-1'>€</span>{price.toFixed(2)}</span>
                        </>
                      ) : (
                        <span className="font-bold text-primary-600 text-base"><span className='mr-1'>€</span>{price.toFixed(2)}</span>
                      )}
                    </div>
                  </li>
                );
              })}
            </ul>
          )}
        </div>
        {/* Footer */}
        {cart.length > 0 ? (
          <div className="p-5 border-t border-slate-100 bg-white/90 flex flex-col gap-4">
            <div className="flex items-center justify-between mb-1">
              <span className="text-lg font-semibold text-slate-700">Total</span>
              <span className="text-2xl font-extrabold text-primary-700 tracking-wide"><span className='mr-1'>€</span>{total.toFixed(2)}</span>
            </div>
            {save > 0 && (
              <div className="flex flex-col items-center my-2">
                <div className="w-full flex items-center gap-2 justify-center">
                  <span className="flex-1 h-px bg-linear-to-r from-transparent via-green-200 to-transparent" />
                  <BadgePercent size={22} className="text-green-600" />
                  <span className="flex-1 h-px bg-linear-to-l from-transparent via-green-200 to-transparent" />
                </div>
                <div className="mt-2 text-green-700 text-lg font-bold tracking-wide text-center">
                  You save <span className="inline-block px-2 py-0.5 bg-green-50 rounded font-extrabold text-green-800 text-xl  decoration-2 decoration-green-400"><span className='mr-1'>€</span>{save.toFixed(2)}</span> on this order
                </div>
              </div>
            )}
            <Link
              to="/cart"
              className="w-full py-2 bg-primary-50 text-primary-700 rounded-lg font-semibold hover:bg-primary-100 transition text-center border border-primary-100"
              onClick={onClose}
            >
              Go to Cart Page
            </Link>
            <Link
              to="/checkout"
              className="w-full py-2 bg-primary-200 rounded-lg font-semibold hover:bg-primary-700 transition shadow text-center block mt-2"
              onClick={onClose}
            >
              Checkout
            </Link>
          </div>
        ) : (
          <div></div>
        )}
      </div>
    </>
  );
};

export default CartDrawer;
