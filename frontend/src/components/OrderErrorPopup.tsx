import React from "react";

interface OrderErrorPopupProps {
  error: string;
  onClose: () => void;
}

const OrderErrorPopup: React.FC<OrderErrorPopupProps> = ({ error, onClose }) => (
  <div className="fixed inset-0 bg-black bg-opacity-40 flex items-center justify-center z-50">
    <div className="bg-white rounded-2xl p-8 shadow-2xl max-w-md w-full border-t-8 border-red-500 flex flex-col items-center">
      <div className="bg-red-100 rounded-full p-3 mb-4">
        {/* Lucide XCircle icon */}
        <svg xmlns="http://www.w3.org/2000/svg" className="h-10 w-10 text-red-500" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}>
          <circle cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="2" fill="none" />
          <path stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" d="M15 9l-6 6m0-6l6 6" />
        </svg>
      </div>
      <h2 className="text-2xl font-bold text-red-600 mb-2 flex items-center gap-2">
        <svg xmlns="http://www.w3.org/2000/svg" className="h-8 w-8 text-red-500" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}>
          <circle cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="2" fill="none" />
          <path stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" d="M15 9l-6 6m0-6l6 6" />
        </svg>
        Payment Failed
      </h2>
      <div className="mb-4 text-base text-slate-700 text-center font-medium">{error}</div>
      <div className="mb-4 text-sm text-slate-600 text-left bg-red-50 rounded-lg p-4">
        <ul className="space-y-2">
          <li>• Please check your card details (number, expiry date, CVV).</li>
          <li>• Try again in a few minutes.</li>
          <li>• Use a different card if the problem persists.</li>
          <li>• Contact your bank for assistance if you continue to experience issues.</li>
        </ul>
      </div>
      <button className="mt-2 px-6 py-2 rounded-lg bg-primary-200 font-bold shadow-lg transition w-full hover:opacity-90" onClick={onClose}>
        Try Again
      </button>
    </div>
  </div>
);

export default OrderErrorPopup;
