import { useQuery } from '@tanstack/react-query';
import getAllSubCategoriesApi from '../api/adminApi/getAllSubCategoriesApi';
import getCategoriesApi from '../api/adminApi/getAllCategoriesApi';
import { Link } from 'react-router-dom';
import { useState } from 'react';

const AllSubCategoriesPage = () => {
  const { data: subCategoriesResponse } = useQuery({
    queryKey: ['subcategories'],
    queryFn: getAllSubCategoriesApi,
  });
  const { data: categoriesResponse } = useQuery({
    queryKey: ['categories'],
    queryFn: getCategoriesApi,
  });

  // Defensive: support array, .data, or .results for subCategoriesResponse
  let subCategories: any[] = [];
  if (Array.isArray(subCategoriesResponse)) {
    subCategories = subCategoriesResponse;
  } else if (subCategoriesResponse && Array.isArray(subCategoriesResponse.data)) {
    subCategories = subCategoriesResponse.data;
  } else if (subCategoriesResponse && Array.isArray(subCategoriesResponse.results)) {
    subCategories = subCategoriesResponse.results;
  }
  // Defensive: always ensure categories is an array
  const categories: { _id: string; name: string }[] = Array.isArray(categoriesResponse) ? categoriesResponse : [];

  // Defensive: always ensure categories is an array before using sort in other components
  // If you export categories, always export as [] if not array

  const [selectedCategory, setSelectedCategory] = useState('all');

  const filteredSubCategories =
    selectedCategory === 'all'
      ? subCategories
      : subCategories.filter((sub: any) => sub.category[0]?._id === selectedCategory);

  return (
    <div className="container mx-auto px-4 py-12">
      <div className="flex flex-col md:flex-row md:items-center md:justify-between mb-10 gap-4">
        <h1 className="text-3xl font-extrabold text-center md:text-left text-primary-200 tracking-tight drop-shadow-sm">
          Subcategories
        </h1>
        <div className="w-full md:w-1/3 flex items-center gap-2">
          <span className="text-slate-600 font-medium">Filter:</span>
          <select
            className="flex-1 border border-primary-200 rounded-lg px-4 py-2 focus:outline-none focus:ring-2 focus:ring-primary-200 bg-white text-slate-700 shadow"
            value={selectedCategory}
            onChange={e => setSelectedCategory(e.target.value)}
          >
            <option value="all">All Categories</option>
            {categories.length > 0 ? (
              (Array.isArray(categories) ? categories : []).map((cat: any) => (
                <option key={cat._id} value={cat._id}>
                  {cat.name}
                </option>
              ))
            ) : (
              <option disabled>No categories found</option>
            )}
          </select>
        </div>
      </div>
      <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-8">
        {(Array.isArray(filteredSubCategories) ? filteredSubCategories : []).map((subCategory: any) => (
          <Link
            key={subCategory._id}
            to={`/subcategory/${subCategory._id}`}
            className="group block bg-gradient-to-br from-primary-50 to-white rounded-2xl shadow-lg hover:shadow-2xl transition p-6 border border-primary-100/40 relative overflow-hidden hover:-translate-y-1 duration-300"
          >
            <div className="flex flex-col items-center justify-center h-full">
              <div className="relative w-28 h-28 mb-4 flex items-center justify-center bg-gradient-to-br from-primary-100/30 to-primary-50 rounded-xl overflow-hidden group-hover:scale-105 transition-transform duration-300 shadow">
                <img
                  src={subCategory.image?.url || '/images/placeholder-category.jpg'}
                  alt={subCategory.name}
                  className="w-full h-full object-contain group-hover:scale-110 transition-transform duration-300"
                />
                <div className="absolute inset-0 bg-primary-200/10 opacity-0 group-hover:opacity-100 transition-opacity duration-300"></div>
              </div>
              <div className="font-bold text-lg text-slate-800 group-hover:text-primary-200 text-center line-clamp-1 mb-1">
                {subCategory.name}
              </div>
              <div className="text-xs text-primary-700 text-center mb-2 font-semibold">
                {subCategory.category[0]?.name || 'Uncategorized'}
              </div>
              <span className="inline-block px-3 py-1 text-xs rounded-full bg-primary-100/60 text-primary-700 font-medium mt-auto group-hover:bg-primary-200/80 group-hover:text-white transition">
                View Products
              </span>
            </div>
          </Link>
        ))}
      </div>
      {filteredSubCategories.length === 0 && (
        <div className="text-center text-slate-400 py-20 text-lg">
          No subcategories found for this category.
        </div>
      )}
    </div>
  );
};

export default AllSubCategoriesPage;
