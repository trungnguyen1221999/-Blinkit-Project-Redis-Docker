import { useEffect, useState } from "react";
import { useAuth } from "../Context/AuthContext";
import { getOrdersApi } from "../api/orderApi";
import { Link } from "react-router-dom";

const Purchase = () => {
  const { user } = useAuth();
  type ProductDetail = {
    name?: string;
    image?: string[];
    quantity?: number;
    price?: number;
  };
  type Order = {
    _id: string;
    orderId: string;
    invoice_receipt?: string;
    createdAt: string;
    payment_status?: string;
    totalAmt?: number;
    product_detail?: ProductDetail[];
  };
  const [orders, setOrders] = useState<Order[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const guestId = !user ? localStorage.getItem("guestId") : undefined;

  useEffect(() => {
    const fetchOrders = async () => {
      setLoading(true);
      try {
        const params = user?._id ? { userId: user._id } : guestId ? { guestId } : {};
        const data = await getOrdersApi(params);
        // Sort orders by newest to oldest
        if (Array.isArray(data)) {
          setOrders(data.sort((a, b) => new Date(b.createdAt).getTime() - new Date(a.createdAt).getTime()));
        } else {
          setOrders([]);
        }
      } catch (err) {
        setError("Failed to load orders");
      } finally {
        setLoading(false);
      }
    };
    fetchOrders();
  }, [user, guestId]);

  return (
    <div className="space-y-8">
      {/* HEADER SECTION */}
      <div className="bg-linear-to-r from-white to-slate-50 rounded-2xl shadow-sm border border-slate-200 p-8 mb-4">
        <h1 className="text-base font-semibold text-slate-800 mb-2">Purchase History</h1>
        <p className="text-slate-500 text-sm">View all your past orders and invoices</p>
      </div>

      {/* ORDER LIST */}
      <div className="space-y-6">
        {loading ? (
          <div className="text-center text-slate-400 py-12 animate-pulse">Loading...</div>
        ) : error ? (
          <div className="text-center text-red-500 py-12">{error}</div>
        ) : orders.length === 0 ? (
          <div className="text-center text-slate-500 py-12 text-lg font-semibold">
            You have no orders yet.<br />
            <Link to="/" className="inline-block mt-4 px-6 py-2 rounded-lg bg-primary-200 text-black font-bold shadow hover:bg-primary-300 transition">
              Start Shopping
            </Link>
          </div>
        ) : (
          (Array.isArray(orders) ? orders : []).map((order: any) => (
            <div key={order._id} className="bg-white rounded-2xl shadow-sm border border-slate-200 p-6">
              <div className="flex flex-col md:flex-row md:items-center md:justify-between gap-4 mb-4">
                <div className="space-y-1">
                  <div className="font-bold text-[14px] text-primary-700">Order ID: {order.orderId}</div>
                  <div className="text-slate-600 text-[14px]">Invoice: <span className="font-semibold">{order.invoice_receipt || "N/A"}</span></div>
                  <div className="text-slate-600 text-[14px]">Date: <span className="font-semibold">{new Date(order.createdAt).toLocaleString()}</span></div>
                  <div className="text-slate-600 text-[14px]">Status: <span className={`font-semibold ${order.payment_status === 'Completed' ? 'text-green-600' : order.payment_status === 'Abandon Checkout' ? 'text-yellow-600' : 'text-yellow-600'}`}>{order.payment_status === 'Completed' ? 'Success' : order.payment_status === 'Abandon Checkout' ? 'Abandon Checkout' : order.payment_status || 'Pending'}</span></div>
                </div>
                <div className="text-[14px] font-semibold text-primary-700">Total: €{order.totalAmt?.toFixed(2) || "0.00"}</div>
                {order.payment_status === 'Abandon Checkout' && (
                  <Link to={`/checkout?orderId=${order.orderId}`} className="ml-4 px-4 py-2 rounded-lg bg-yellow-100 text-yellow-800 font-bold shadow hover:bg-yellow-200 transition">
                    Continue Checkout
                  </Link>
                )}
              </div>
              <div className="border-t border-slate-100 pt-4 mt-2">
                <h3 className="text-[14px] font-bold text-slate-700 mb-2">Products</h3>
                {Array.isArray(order.product_detail) && order.product_detail.length > 0 ? (
                  <ul className="divide-y divide-slate-100">
                    {(Array.isArray(order.product_detail) ? order.product_detail : []).map((product: ProductDetail, idx: number) => (
                      <li key={idx} className="flex items-center gap-4 py-3">
                        <img src={product.image?.[0] || "/images/placeholder-product.jpg"} alt={product.name || "Product"} className="w-12 h-12 object-contain rounded-lg bg-slate-100" />
                        <div className="flex-1 min-w-0">
                          <div className="font-medium text-slate-800 text-sm line-clamp-1">{product.name || "Product"}</div>
                          {product.quantity && (
                            <div className="text-slate-600 text-sm">Qty: {product.quantity}</div>
                          )}
                          {product.price && (
                            <div className="text-slate-600 text-sm">Price: €{product.price.toFixed(2)}</div>
                          )}
                        </div>
                      </li>
                    ))}
                  </ul>
                ) : (
                  <div className="text-slate-400">No products</div>
                )}
              </div>
            </div>
          ))
        )}
      </div>
    </div>
  );
};

export default Purchase;
