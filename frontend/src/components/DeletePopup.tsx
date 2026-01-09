import { Trash2 } from "lucide-react";
import { useEffect } from "react";

interface DeletePopupProps {
  count: number; // số user sẽ xóa
  onCancel: () => void;
  onConfirm: () => void;
}

const DeletePopup: React.FC<DeletePopupProps> = ({
  count,
  onCancel,
  onConfirm,
}) => {
  // Ngăn scroll khi popup mở
  useEffect(() => {
    document.body.style.overflow = "hidden";
    return () => {
      document.body.style.overflow = "auto"; // reset khi popup đóng
    };
  }, []);

  return (
    <div
      onClick={onCancel}
      className="fixed inset-0 bg-white/20 backdrop-blur-sm flex items-center justify-center z-50 p-4"
    >
      <div
        onClick={(e) => e.stopPropagation()}
        className="bg-white/95 backdrop-blur-xl border border-white/20 rounded-2xl shadow-2xl p-8 w-full max-w-md mx-auto animate-in slide-in-from-bottom-4 duration-300"
      >
        {/* Icon */}
        <div className="w-16 h-16 bg-red-100 rounded-full flex items-center justify-center mx-auto mb-6">
          <Trash2 className="text-red-600" size={28} />
        </div>

        {/* Content */}
        <div className="text-center mb-8">
          <h3 className="text-2xl font-bold text-slate-800 mb-3">
            Confirm Deletion
          </h3>
          <p className="text-slate-600 leading-relaxed">
            Are you sure you want to delete <strong>{count}</strong> user{count > 1 ? "s" : ""}? 
            This action cannot be undone and will permanently remove all associated data.
          </p>
        </div>

        {/* Actions */}
        <div className="flex gap-3">
          <button
            onClick={onCancel}
            className="flex-1 px-6 py-3 rounded-xl border-2 border-slate-200 text-slate-700 hover:bg-slate-50 hover:border-slate-300 transition-all duration-200 font-medium"
          >
            Cancel
          </button>
          <button
            onClick={onConfirm}
            className="flex-1 flex items-center justify-center gap-2 px-6 py-3 rounded-xl bg-red-600 text-white hover:bg-red-700 hover:shadow-lg transition-all duration-200 font-medium"
          >
            <Trash2 size={18} />
            Delete
          </button>
        </div>
      </div>
    </div>
  );
};

export default DeletePopup;
