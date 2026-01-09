import { X } from "lucide-react";

interface DeletePopupProps {
  itemName: string;
  onCancel: () => void;
  onConfirm: () => void;
}

const DeletePopup = ({ itemName, onCancel, onConfirm }: DeletePopupProps) => {
  return (
    <div
      onClick={onCancel}
      className="fixed inset-0 bg-white/20 backdrop-blur-sm flex items-center justify-center z-50 p-4"
    >
      <div
        onClick={(e) => e.stopPropagation()}
        className="bg-white/95 backdrop-blur-xl border border-white/20 rounded-2xl shadow-2xl p-8 w-[480px] max-w-full flex flex-col relative transform transition-all duration-200 scale-100"
      >
        <button
          onClick={onCancel}
          className="absolute top-4 right-4 p-2 text-slate-400 hover:text-slate-600 hover:bg-slate-100 rounded-lg transition-colors"
        >
          <X size={18} />
        </button>
        
        <div className="mb-8">
          <div className="w-16 h-16 bg-red-100 rounded-full flex items-center justify-center mx-auto mb-4">
            <span className="text-red-500 text-2xl">⚠️</span>
          </div>
          <h3 className="text-2xl font-bold text-slate-800 mb-2 text-center">Delete Category</h3>
          <p className="text-slate-600 text-center">
            Are you sure you want to delete this category?
          </p>
        </div>
        
        <div className="bg-slate-50 rounded-xl p-4 mb-6">
          <div className="text-center">
            <p className="text-slate-500 text-sm mb-1">Category Name</p>
            <p className="font-semibold text-slate-800 text-lg">"{itemName}"</p>
          </div>
        </div>
        
        <div className="bg-amber-50 border border-amber-200 rounded-xl p-4 mb-6">
          <p className="text-amber-800 text-sm">
            <strong>Warning:</strong> This action cannot be undone. All products in this category will need to be reassigned.
          </p>
        </div>
        
        <div className="flex justify-center gap-3 pt-4 border-t border-slate-100">
          <button
            onClick={onCancel}
            className="px-6 py-2.5 rounded-xl border border-slate-300 text-slate-600 hover:bg-slate-50 hover:border-slate-400 transition-colors font-medium"
          >
            Cancel
          </button>
          <button
            onClick={onConfirm}
            className="px-6 py-2.5 rounded-xl bg-gradient-to-r from-red-500 to-red-600 text-white hover:from-red-600 hover:to-red-700 hover:shadow-lg hover:scale-105 transition-all duration-200 font-medium min-w-[100px]"
          >
            Delete
          </button>
        </div>
      </div>
    </div>
  );
};

export default DeletePopup;
