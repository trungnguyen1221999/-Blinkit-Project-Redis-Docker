import { X } from "lucide-react";

export interface Category {
  _id: string;
  name: string;
}

interface CategoryTagProps {
  category: Category;
  onRemove: (id: string) => void;
}

const CategoryTag = ({ category, onRemove }: CategoryTagProps) => (
  <div className="flex items-center gap-1 bg-blue-100 text-blue-800 px-2 py-1 rounded">
    {category.name}
    <button type="button" onClick={() => onRemove(category._id)}>
      <X size={16} />
    </button>
  </div>
);

export default CategoryTag;
