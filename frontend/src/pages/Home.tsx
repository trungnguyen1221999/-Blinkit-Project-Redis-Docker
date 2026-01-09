
import HeroSection from '../components/HeroSection';
import SaleOffGrid from '../components/SaleOffGrid';
import SubCategorySlideshow from '../components/SubCategorySlideshow';
import CategorySlideshow from '../components/CategorySlideshow';
import { useQuery } from '@tanstack/react-query';
import { getCategoriesApi } from '../api/categoryApi/categoryApi';

const Home = () => {
  // Fetch categories for showcasing
  const { data: categories = [], isLoading: categoriesLoading } = useQuery({
    queryKey: ['categories'],
    queryFn: getCategoriesApi,
  });

  return (
    <div className="min-h-screen">
      <HeroSection />
      {/* Sale Off Grid */}
      <SaleOffGrid />
      {/* SubCategory Slideshow */}
      <SubCategorySlideshow />
      
      {/* Featured Categories Sections */}
      {!categoriesLoading && categories.length > 0 && (
        <section className="py-16 bg-gradient-to-br from-slate-50 to-white">
          <div className="container mx-auto px-4">
            <div className="text-center mb-12">
              <h2 className="text-3xl md:text-4xl font-bold text-slate-800 mb-4">
                Explore by <span className="text-primary-200">Categories</span>
              </h2>
              <p className="text-slate-600 text-lg max-w-2xl mx-auto">
                Discover our premium collections with curated subcategories for each category
              </p>
            </div>
            
            {/* Display all categories with alternating layouts */}
            <div className="space-y-16">
              {(Array.isArray(categories) ? categories : []).map((category: any, index: number) => (
                <div key={category._id} className="bg-white rounded-3xl shadow-lg overflow-hidden">
                  <CategorySlideshow 
                    category={category} 
                    layout={index % 2 === 0 ? 'image-first' : 'desc-first'}
                  />
                </div>
              ))}
            </div>
            
            {/* View All Categories Button - Hidden since we show all categories */}
            {false && (
              <div className="text-center mt-12">
                <button className="inline-flex items-center gap-2 bg-gradient-to-r from-primary-200 to-primary-100 text-white px-8 py-4 rounded-xl hover:shadow-lg hover:scale-105 transition-all duration-300 font-semibold">
                  <span>View All Categories</span>
                  <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M17 8l4 4m0 0l-4 4m4-4H3" />
                  </svg>
                </button>
              </div>
            )}
          </div>
        </section>
      )}
      
     
    </div>
  );
};

export default Home;
