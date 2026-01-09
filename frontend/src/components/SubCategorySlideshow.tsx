import { useState, useEffect, useRef } from 'react';
import { ChevronLeft, ChevronRight, ShoppingCart, Star } from 'lucide-react';
import { useQuery } from '@tanstack/react-query';
import getAllSubCategoriesApi from '../api/adminApi/getAllSubCategoriesApi';
import { Link } from 'react-router-dom';

interface SubCategory {
  _id: string;
  name: string;
  image: {
    url: string;
    public_id: string;
  };
  category: Array<{
    _id: string;
    name: string;
  }>;
  createdAt: string;
  updatedAt: string;
}

const SubCategorySlideshow = () => {
  const [currentSlide, setCurrentSlide] = useState(0);
  const [isAutoPlaying, setIsAutoPlaying] = useState(true);
  const [touchStart, setTouchStart] = useState(0);
  const [touchEnd, setTouchEnd] = useState(0);
  const slideIntervalRef = useRef<ReturnType<typeof setInterval> | null>(null);

  // Fetch subcategories
  const { data: subCategoriesResponse, isLoading } = useQuery({
    queryKey: ['subcategories'],
    queryFn: getAllSubCategoriesApi,
  });

  // Defensive: support both array and .data property for subCategoriesResponse
  let subCategories: SubCategory[] = [];
  if (Array.isArray(subCategoriesResponse)) {
    subCategories = subCategoriesResponse;
  } else if (subCategoriesResponse && Array.isArray((subCategoriesResponse as any).data)) {
    subCategories = (subCategoriesResponse as any).data;
  } else if (subCategoriesResponse && Array.isArray((subCategoriesResponse as any).results)) {
    subCategories = (subCategoriesResponse as any).results;
  }
  
  // Responsive slides to show
  const getSlidesToShow = () => {
    if (typeof window !== 'undefined') {
      if (window.innerWidth < 640) return 1; // mobile
      if (window.innerWidth < 768) return 2; // small tablet
      if (window.innerWidth < 1024) return 3; // tablet
      return 5; // desktop
    }
    return 5;
  };
  
  const [slidesToShow, setSlidesToShow] = useState(getSlidesToShow());
  
  // Update slides to show on window resize
  useEffect(() => {
  const handleResize = () => {
    setSlidesToShow(getSlidesToShow());
  };
  
  window.addEventListener('resize', handleResize);
  return () => window.removeEventListener('resize', handleResize);
}, []);
  const totalSlides = Math.ceil(subCategories.length / slidesToShow);
  const canSlide = subCategories.length > slidesToShow;

  // Auto-play functionality
  useEffect(() => {
    if (isAutoPlaying && canSlide && totalSlides > 0) {
      slideIntervalRef.current = setInterval(() => {
        setCurrentSlide((prev) => {
          const nextSlide = prev + 1;
          // Loop back to start when reaching end
          return nextSlide >= totalSlides ? 0 : nextSlide;
        });
      }, 3000);
    }

    return () => {
      if (slideIntervalRef.current) {
        clearInterval(slideIntervalRef.current);
      }
    };
  }, [isAutoPlaying, canSlide, totalSlides]);

  // Touch handlers for mobile swipe
  const handleTouchStart = (e: React.TouchEvent) => {
    setTouchStart(e.targetTouches[0].clientX);
  };

  const handleTouchMove = (e: React.TouchEvent) => {
    setTouchEnd(e.targetTouches[0].clientX);
  };
  const handleTouchEnd = () => {
    const distance = touchStart - touchEnd;
    const isLeftSwipe = distance > 50;
    const isRightSwipe = distance < -50;

    // Infinite scroll - no boundary checks needed
    if (isLeftSwipe) {
      nextSlide();
    }
    if (isRightSwipe) {
      prevSlide();
    }
  };

  const nextSlide = () => {
    setCurrentSlide((prev) => {
      const next = prev + 1;
      return next >= totalSlides ? 0 : next;
    });
  };

  const prevSlide = () => {
    setCurrentSlide((prev) => {
      return prev <= 0 ? totalSlides - 1 : prev - 1;
    });
  };

  // Reset auto-play when manually navigating
  const handleManualNavigation = (slideFunction: () => void) => {
    slideFunction();
    // Pause auto-play briefly after manual navigation
    setIsAutoPlaying(false);
    setTimeout(() => setIsAutoPlaying(true), 5000);
  };

  const goToSlide = (index: number) => {
    setCurrentSlide(index);
  };

  if (isLoading) {
    return (
      <div className="w-full py-12">
        <div className="container mx-auto px-4">
          <div className="text-center mb-8">
            <div className="h-8 bg-slate-200 rounded-lg w-64 mx-auto animate-pulse"></div>
            <div className="h-4 bg-slate-200 rounded w-96 mx-auto mt-4 animate-pulse"></div>
          </div>
          <div className="grid grid-cols-2 md:grid-cols-4 gap-6">
            {[...Array(4)].map((_, i) => (
              <div key={i} className="bg-white rounded-2xl p-6 shadow-lg animate-pulse">
                <div className="w-full h-32 bg-slate-200 rounded-xl mb-4"></div>
                <div className="h-4 bg-slate-200 rounded w-3/4 mb-2"></div>
                <div className="h-3 bg-slate-200 rounded w-1/2"></div>
              </div>
            ))}
          </div>
        </div>
      </div>
    );
  }

  if (!subCategories.length) {
    return (
      <div className="w-full py-12">
        <div className="container mx-auto px-4 text-center">
          <h2 className="text-2xl font-bold text-slate-800 mb-4">No Subcategories Available</h2>
          <p className="text-slate-600">Check back later for amazing product categories!</p>
        </div>
      </div>
    );
  }

  return (
    <div className="w-full py-12 bg-gradient-to-br from-primary-50 to-white">
      <div className="container mx-auto px-4">
        {/* Header */}
        <div className="text-center mb-10">
          <div className="inline-flex items-center gap-2 bg-primary-200 text-white px-4 py-2 rounded-full text-sm font-semibold mb-4 shadow-lg">
            <Star size={16} className="fill-current" />
            <span>Popular Categories</span>
          </div>
          <h2 className="text-3xl md:text-4xl font-bold text-slate-800 mb-4">
            Shop by <span className="text-primary-200">Category</span>
          </h2>
          <p className="text-slate-600 text-lg max-w-2xl mx-auto">
            Discover fresh groceries and daily essentials from our premium collection
          </p>
        </div>

        {/* Slideshow Container */}
        <div 
          className="relative overflow-hidden rounded-2xl bg-white backdrop-blur-sm border border-primary-100/20 shadow-xl"
          onMouseEnter={() => setIsAutoPlaying(false)}
          onMouseLeave={() => setIsAutoPlaying(true)}
          onTouchStart={handleTouchStart}
          onTouchMove={handleTouchMove}
          onTouchEnd={handleTouchEnd}
        >
          {/* View More Button */}
          <Link
            to="/subcategories"
            className="absolute top-0 right-4 z-20 inline-flex items-center gap-1 px-3 py-1.5 rounded-full text-xs font-semibold bg-primary-100 text-primary-700 shadow hover:bg-primary-200 hover:text-primary-900 transition-all duration-200 border border-primary-200/40"
            tabIndex={-1}
          >
            View More
          </Link>
          {/* Slides */}
          <div 
            className="flex transition-transform duration-700 ease-out"
            style={{ 
              transform: `translateX(-${currentSlide * 100}%)`,
            }}
          >
            {Array.from({ length: totalSlides }).map((_, pageIndex) => {
              const startIndex = pageIndex * slidesToShow;
              const pageItems = subCategories.slice(startIndex, startIndex + slidesToShow);
              
              return (
                <div key={pageIndex} className={`grid shrink-0 w-full gap-4 px-6 py-4 ${
                  slidesToShow === 1 ? 'grid-cols-1' :
                  slidesToShow === 2 ? 'grid-cols-2' :
                  slidesToShow === 3 ? 'grid-cols-3' :
                  'grid-cols-5'
                }`}>
                  {pageItems.map((subCategory) => (
                    <Link 
                      key={subCategory._id}
                      to={`/subcategory/${subCategory._id}`}
                      className="group block"
                    >
                      <div className="relative bg-white rounded-lg p-3 shadow-md hover:shadow-lg transition-all duration-300 transform group-hover:scale-105 border border-slate-200 overflow-hidden">
                    {/* Background Gradient */}
                    <div className="absolute inset-0 bg-primary-50/20 opacity-0 group-hover:opacity-100 transition-opacity duration-500"></div>
                    
                        {/* Image Container */}
                        <div className="relative mb-3 flex items-center justify-center overflow-hidden rounded-lg min-h-[120px]" style={{height:'140px'}}>
                          <img
                            src={subCategory.image.url || "/images/placeholder-category.jpg"}
                            alt={subCategory.name}
                            className="max-h-[120px] w-auto h-auto object-contain mx-auto group-hover:scale-105 transition-transform duration-500"
                            style={{maxHeight:'120px', width:'auto', height:'auto'}}
                            onError={(e) => {
                              const target = e.target as HTMLImageElement;
                              target.src = "https://images.unsplash.com/photo-1542838132-92c53300491e?w=400&h=400&fit=crop&crop=center";
                            }}
                          />
                          
                          {/* Hover Overlay */}
                          <div className="absolute inset-0 bg-black/10 opacity-0 group-hover:opacity-100 transition-opacity duration-300 flex items-center justify-center">
                            <div className="bg-white/90 rounded-full p-2 transform scale-0 group-hover:scale-100 transition-transform duration-300">
                              <ShoppingCart size={16} className="text-primary-200" />
                            </div>
                          </div>
                        </div>

                        {/* Content */}
                        <div className="text-center">
                          <h3 className="font-semibold text-slate-800 text-sm group-hover:text-primary-200 transition-colors duration-300 line-clamp-1">
                            {subCategory.name}
                          </h3>
                          <p className="text-slate-500 text-xs mt-1">
                            Fresh & Quality
                          </p>
                        </div>
                      </div>
                    </Link>
                  ))}
                </div>
              );
            })}
          </div>

          {/* Navigation Arrows */}
          {canSlide && (
            <>
              <button
                onClick={() => handleManualNavigation(prevSlide)}
                className="absolute left-6 top-1/2 -translate-y-1/2 bg-primary-200 hover:bg-primary-300 text-white p-3 rounded-full shadow-lg hover:shadow-xl transition-all duration-300 group z-10"
              >
                <ChevronLeft size={20} className="group-hover:scale-110 transition-transform" />
              </button>
              
              <button
                onClick={() => handleManualNavigation(nextSlide)}
                className="absolute right-6 top-1/2 -translate-y-1/2 bg-primary-200 hover:bg-primary-300 text-white p-3 rounded-full shadow-lg hover:shadow-xl transition-all duration-300 group z-10"
              >
                <ChevronRight size={20} className="group-hover:scale-110 transition-transform" />
              </button>
            </>
          )}
        </div>

        {/* Pagination Dots */}
        {canSlide && totalSlides > 1 && (
          <div className="flex justify-center mt-8 gap-3">
            {[...Array(totalSlides)].map((_, index) => (
              <button
                key={index}
                onClick={() => {
                  goToSlide(index);
                  setIsAutoPlaying(false);
                  setTimeout(() => setIsAutoPlaying(true), 5000);
                }}
                className={`h-3 rounded-full transition-all duration-300 ${
                  currentSlide === index
                    ? "bg-primary-200 w-8 shadow-md"
                    : "bg-primary-200/30 hover:bg-primary-200/50 w-3"
                }`}
              />
            ))}
          </div>
        )}

        {/* Stats */}
        <div className="mt-12 grid grid-cols-2 md:grid-cols-3 gap-6">
          <div className="text-center bg-white rounded-xl p-4 shadow-md border border-primary-100/20">
            <div className="text-3xl font-bold text-primary-200 mb-2">{subCategories.length}+</div>
            <div className="text-slate-600 font-semibold">Categories</div>
          </div>
          <div className="text-center bg-white rounded-xl p-4 shadow-md border border-primary-100/20">
            <div className="text-3xl font-bold text-primary-200 mb-2">1000+</div>
            <div className="text-slate-600 font-semibold">Products</div>
          </div>
          <div className="text-center bg-white rounded-xl p-4 shadow-md border border-primary-100/20 md:col-span-1 col-span-2">
            <div className="text-3xl font-bold text-primary-200 mb-2">24/7</div>
            <div className="text-slate-600 font-semibold">Delivery</div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default SubCategorySlideshow;