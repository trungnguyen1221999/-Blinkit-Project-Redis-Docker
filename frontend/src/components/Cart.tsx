import { ShoppingCart } from "lucide-react";
import { useQuery } from "@tanstack/react-query";

import { getCartApi } from "../api/cartApi";
import { useAuth } from "../Context/AuthContext";
import { useCartDrawer } from "./CartDrawerContext";

const Cart = () => {
  const { user } = useAuth();
  const { openDrawer } = useCartDrawer();
  // Use guestId if not logged in
  const guestIdRaw = !user ? localStorage.getItem("guestId") : undefined;
  const guestId = guestIdRaw ?? undefined;
  const queryKey = ["cart", user?._id || guestId || "guest"];
  const { data: cart = [], error } = useQuery({
    queryKey,
    queryFn: () => getCartApi({ userId: user?._id, guestId }),
    enabled: !!user?._id || !!guestId,
    retry: 1,
  });
  let cartItemCount = 0;
  if (Array.isArray(cart)) {
    cartItemCount = cart.reduce(
      (sum: number, item: any) => sum + (item.quantity || 1),
      0
    );
  }

  return (
    <button
      className="relative flex items-center gap-2 px-4 py-2 bg-slate-100 hover:bg-slate-200 rounded-xl border border-slate-200 transition-all duration-200 hover:shadow-md group"
      onClick={openDrawer}
    >
      <div className="relative">
        <ShoppingCart
          size={20}
          className="text-slate-600 group-hover:text-slate-800 transition-colors"
        />
        {cartItemCount > 0 && (
          <span className="absolute -top-2 -right-2 w-5 h-5 bg-red-500 text-white text-xs font-bold rounded-full flex items-center justify-center animate-pulse">
            {cartItemCount > 9 ? "9+" : cartItemCount}
          </span>
        )}
      </div>
      <span className="hidden md:inline-block text-sm font-medium text-slate-700 group-hover:text-slate-900 transition-colors">
        Cart
      </span>
      {error && (
        <span className="ml-2 text-xs text-red-500">Cart error</span>
      )}
    </button>
  );
};

export default Cart;
