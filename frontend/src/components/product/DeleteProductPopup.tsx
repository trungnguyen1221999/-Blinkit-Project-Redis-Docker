import { X } from "lucide-react";

interface Product {
  _id: string;
  name: string;
  images: { url: string; public_id: string }[];
  category: { _id: string; name: string }[];
  SubCategory: { _id: string; name: string }[];
  unit: string;
  stock: number;
  price: number;
  discount?: number;
  description: string;
  more_details: Record<string, any>;
  publish: boolean;
  createdAt: string;
}

interface DeleteProductPopupProps {
  isOpen: boolean;
  product: Product | null;
  onClose: () => void;
  onConfirm: () => void;
  isLoading?: boolean;
}

const DeleteProductPopup = ({ 
  isOpen, 
  product, 
  onClose, 
  onConfirm, 
  isLoading = false 
}: DeleteProductPopupProps) => {
  if (!isOpen || !product) return null;

  return (
    <div 
      className="fixed inset-0 bg-white/20 backdrop-blur-sm flex items-center justify-center p-4 z-50"
      onClick={onClose}
    >
      <div 
        className="bg-white/95 backdrop-blur-xl border border-white/20 rounded-2xl shadow-xl w-full max-w-md relative"
        onClick={(e) => e.stopPropagation()}
      >
        {/* Close Button */}
        <button
          onClick={onClose}
          className="absolute top-4 right-4 p-2 text-slate-400 hover:text-slate-600 rounded-lg hover:bg-slate-100 transition-colors"
        >
          <X size={20} />
        </button>

        <div className="p-6">
          {/* Icon */}
          <div className="w-16 h-16 bg-red-100 rounded-full flex items-center justify-center mx-auto mb-4">
            <svg 
              className="w-8 h-8 text-red-500" 
              fill="none" 
              stroke="currentColor" 
              viewBox="0 0 24 24"
            >
              <path 
                strokeLinecap="round" 
                strokeLinejoin="round" 
                strokeWidth={2} 
                d="M19 7l-.867 12.142A2 2 0 0116.138 21H7.862a2 2 0 01-1.995-1.858L5 7m5 4v6m4-6v6m1-10V4a1 1 0 00-1-1h-4a1 1 0 00-1 1v3M4 7h16" 
              />
            </svg>
          </div>

          <div className="text-center">
            <h3 className="text-xl font-semibold text-slate-800 mb-2">
              Delete Product
            </h3>
            <p className="text-slate-600 mb-6">
              Are you sure you want to delete <strong>"{product.name}"</strong>? 
              This action cannot be undone and will permanently remove the product from your catalog.
            </p>
          </div>

          {/* Actions */}
          <div className="flex gap-3">
            <button
              onClick={onClose}
              disabled={isLoading}
              className="flex-1 px-4 py-2.5 text-sm font-medium text-slate-700 bg-slate-100 hover:bg-slate-200 disabled:opacity-50 rounded-lg transition-colors"
            >
              Cancel
            </button>
            <button
              onClick={onConfirm}
              disabled={isLoading}
              className="flex-1 px-4 py-2.5 text-sm font-medium text-white bg-red-500 hover:bg-red-600 disabled:opacity-50 rounded-lg transition-colors"
            >
              {isLoading ? "Deleting..." : "Delete Product"}
            </button>
          </div>
        </div>
      </div>
    </div>
  );
};

export default DeleteProductPopup;
