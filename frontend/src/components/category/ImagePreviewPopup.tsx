import { X } from "lucide-react";

interface ImagePreviewPopupProps {
  src: string;
  onClose: () => void;
}

const ImagePreviewPopup = ({ src, onClose }: ImagePreviewPopupProps) => (
  <div
    onClick={onClose}
    className="fixed inset-0 bg-black/60 backdrop-blur-sm flex items-center justify-center z-50"
  >
    <div onClick={(e) => e.stopPropagation()} className="relative">
      <button
        onClick={onClose}
        className="absolute top-2 right-2 text-white bg-black/50 rounded-full p-1 hover:bg-black/70 z-10"
      >
        <X size={24} />
      </button>
      <img
        src={src}
        alt="Large Preview"
        className="max-h-[80vh] max-w-[80vw] rounded shadow-lg"
      />
    </div>
  </div>
);

export default ImagePreviewPopup;
