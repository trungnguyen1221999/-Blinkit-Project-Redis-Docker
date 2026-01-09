import React from "react";
import { X, CheckCircle } from "lucide-react";

interface OrderSuccessPopupProps {
  orderDetail: any;
  total: number;
  totalSave: number;
  products: Array<{ name: string; image?: string; quantity: number; price: number }>;
  onClose: () => void;
}

const OrderSuccessPopup: React.FC<OrderSuccessPopupProps> = ({
  orderDetail,
  total,
  totalSave,
  products,
  onClose
}) => (
  <div className="fixed inset-0 z-10 flex items-center justify-center animate-fadeIn">
    
    {/* Overlay — click to close */}
    <div
      className="fixed inset-0 bg-opacity-40 backdrop-blur-[8px] cursor-pointer z-40"
      onClick={onClose}
    />

    {/* Popup wrapper */}
    <div
      className="relative z-50 max-h-[90vh] overflow-y-auto flex justify-center w-full"
      onClick={(e) => e.stopPropagation()}  // ⛔ Ngăn click vào popup bị đóng
    >
      <div
        className="bg-white bg-opacity-70 h-full backdrop-blur-2xl rounded-3xl p-10 shadow-[0_8px_32px_0_rgba(31,38,135,0.37)] max-w-xl md:max-w-2xl w-full border-4 border-transparent flex flex-col items-center relative"
        
      >
        {/* Close button */}
        <button
          className="absolute top-4 right-4 p-2 rounded-full bg-white/70 hover:bg-red-100 text-green-500 hover:text-red-500 shadow transition z-50 border border-green-200"
          aria-label="Close"
          onClick={onClose}
        >
          <X size={24} />
        </button>

        <div className="bg-gradient-to-br from-green-400 to-emerald-400 rounded-full p-4 mb-4 shadow-lg">
          <CheckCircle size={44} className="text-white drop-shadow" />
        </div>


        <h2 className="text-3xl font-extrabold text-green-600 mb-6 tracking-tight w-full text-center mt-5">Payment Successful!</h2>
        <div className="w-full mb-6">
          <div className="bg-slate-50 bg-opacity-80 border border-slate-200 rounded-xl p-5 flex flex-col gap-3 shadow-sm">
            <div className="flex justify-between items-center">
              <span className="font-medium text-slate-700">Order ID:</span>
              <span className="text-green-700 font-bold">{orderDetail.orderId}</span>
            </div>
            <div className="flex justify-between items-center">
              <span className="font-medium text-slate-700">Invoice:</span>
              <span className="text-green-700 font-semibold">{orderDetail.invoice_receipt || "N/A"}</span>
            </div>
            <div className="flex justify-between items-center">
              <span className="font-medium text-slate-700">Payment Status:</span>
              <span className="font-bold text-green-600">Success</span>
            </div>
            <div className="flex justify-between items-center">
              <span className="font-medium text-slate-700">Payment Date:</span>
              <span className="text-slate-700">{new Date().toLocaleString()}</span>
            </div>
            <div className="flex justify-between items-center">
              <span className="font-medium text-slate-700">Total:</span>
              <span className="text-2xl font-extrabold text-green-700">€{total.toFixed(2)}</span>
            </div>
            {totalSave > 0 && (
              <div className="flex justify-between items-center">
                <span className="font-medium text-green-600">You saved</span>
                <span className="font-bold text-green-600">€{totalSave.toFixed(2)}</span>
              </div>
            )}
          </div>
        </div>

        <div className="w-full mt-6">
          <h3 className="text-xl font-bold text-slate-700 mb-3">Order Details</h3>
          <ul className="divide-y divide-slate-100">
            {(Array.isArray(products) ? products : []).map((item, idx) => (
              <li key={idx} className="flex items-center gap-4 py-4">
                <img
                  src={item.image || "/images/placeholder-product.jpg"}
                  alt={item.name}
                  className="w-16 h-16 object-contain rounded-xl bg-slate-100 shadow"
                />
                <div className="flex-1 min-w-0">
                  <div className="font-semibold text-slate-800 text-lg line-clamp-1">
                    {item.name}
                  </div>
                  <div className="text-sm text-slate-500">Qty: {item.quantity}</div>
                </div>
                <div className="font-bold text-green-700 text-lg">
                  €{item.price.toFixed(2)}
                </div>
              </li>
            ))}
          </ul>
        </div>

        <div className="w-full mt-8 text-center">
          <div className="text-2xl font-bold text-green-700 mb-2">
            Thank you for your order!
          </div>
          <div className="text-base text-slate-700">
            Your order will arrive in about 30 minutes.
            <br />
            If you have any questions, please contact our support.
          </div>
        </div>

        <button
          className="mt-8 px-8 py-3 rounded-xl bg-gradient-to-r from-green-500 via-emerald-400 to-green-600 text-white font-extrabold shadow-xl transition-all duration-200 hover:scale-105 hover:shadow-2xl w-full"
          onClick={() => {
            onClose();
            window.location.href = "/";
          }}
        >
          Back to Home
        </button>
      </div>
    </div>
  </div>
);

export default OrderSuccessPopup;
