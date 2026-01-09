import { useState, useEffect, useRef } from 'react';
import { ChevronLeft, ChevronRight, Star, Package } from 'lucide-react';
import { customCategoryData } from '../data/customCategoryData';
import { useQuery } from '@tanstack/react-query';
import { getProductsByCategoryApi } from '../api/adminApi/productApi';
import { Link } from 'react-router-dom';
import ProductCard from "./ProductCard";

interface Product {
  _id: string;
  name: string;
  images: Array<{
    url: string;
    public_id: string;
  }>;
  category: Array<{
    _id: string;
    name: string;
  }>;
  SubCategory: Array<{
    _id: string;
    name: string;
  }>;
  unit: string;
  stock: number;
  price: number;
  discount?: number;
  description: string;
  publish: boolean;
  createdAt: string;
  updatedAt: string;
}

interface Category {
  _id: string;
  name: string;
  image: {
    url: string;
    public_id: string;
  };
}

interface CategorySlideshowProps {
  category: Category;
  layout?: 'image-first' | 'desc-first';
}

const CategorySlideshow = ({ category, layout = 'image-first' }: CategorySlideshowProps) => {
  const [currentSlide, setCurrentSlide] = useState(0);
  const [isAutoPlaying, setIsAutoPlaying] = useState(true);
  const [touchStart, setTouchStart] = useState(0);
  const [touchEnd, setTouchEnd] = useState(0);
  const slideIntervalRef = useRef<ReturnType<typeof setInterval> | null>(null);

  // Fetch products for this category
  const { data: products = [], isLoading } = useQuery({
    queryKey: ['products', category._id],
    queryFn: () => getProductsByCategoryApi(category._id),
    enabled: !!category._id,
  });

  // Filter only published products
  const publishedProducts: Product[] = Array.isArray(products) 
    ? products.filter((product: Product) => product.publish)
    : [];
  
  // Responsive slides to show - số sản phẩm hiển thị trên 1 slide
  const getSlidesToShow = () => {
    if (typeof window !== 'undefined') {
      if (window.innerWidth < 640) return 2; // mobile - 2 products per slide
      if (window.innerWidth < 1024) return 4; // tablet - 4 products per slide
      return 6; // desktop - 6 products per slide
    }
    return 6;
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
  
  // Calculate total pages needed
  const totalSlides = Math.ceil(publishedProducts.length / slidesToShow);
  const canSlide = publishedProducts.length > slidesToShow;

  // Auto-play functionality
  useEffect(() => {
    if (isAutoPlaying && canSlide && totalSlides > 0) {
      slideIntervalRef.current = setInterval(() => {
        setCurrentSlide((prev) => {
          const nextSlide = prev + 1;
          return nextSlide >= totalSlides ? 0 : nextSlide;
        });
      }, 4000);
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
    if (!touchStart || !touchEnd) return;
    
    const distance = touchStart - touchEnd;
    const isLeftSwipe = distance > 50;
    const isRightSwipe = distance < -50;

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

  const handleManualNavigation = (slideFunction: () => void) => {
    slideFunction();
    setIsAutoPlaying(false);
    setTimeout(() => setIsAutoPlaying(true), 5000);
  };

  const goToSlide = (index: number) => {
    setCurrentSlide(index);
  };

  if (isLoading) {
    return (
      <div className="w-full">
        <div className="animate-pulse">
          {/* Hero skeleton */}
          <div className="relative h-[60vh] bg-slate-200 rounded-t-3xl"></div>
          {/* Slideshow skeleton */}
          <div className="bg-white p-6 rounded-b-3xl -mt-20 relative z-10">
            <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
              {[...Array(4)].map((_, i) => (
                <div key={i} className="bg-slate-200 rounded-xl h-64">
                  <div className="p-4 space-y-3">
                    <div className="bg-slate-300 rounded-lg h-32"></div>
                    <div className="bg-slate-300 rounded h-4"></div>
                    <div className="bg-slate-300 rounded h-3 w-3/4"></div>
                    <div className="bg-slate-300 rounded h-5 w-1/2"></div>
                  </div>
                </div>
              ))}
            </div>
          </div>
        </div>
      </div>
    );
  }

  if (!publishedProducts.length) {
    return (
      <div className="w-full">
        {/* Hero Section - Square Flex Layout */}
        <div className="bg-white rounded-t-3xl overflow-hidden">
          <div className={`flex ${layout === 'desc-first' ? 'flex-row-reverse' : 'flex-row'} items-center min-h-[400px] gap-8 p-8`}>
            {/* Image Side */}
            <div className="flex-1 flex justify-center">
              <div className="">
                <img
                  src={category.image.url || "https://images.unsplash.com/photo-1542838132-92c53300491e?w=600&h=400&fit=crop"}
                  alt={category.name}
                  className="h-auto max-h-96 w-auto object-contain hover:scale-105 transition-transform duration-700 bg-transparent"
                />
              </div>
            </div>
            
            {/* Content Side */}
            <div className="flex-1">
              <div className="max-w-lg">

                <h1 className="text-4xl md:text-6xl font-bold text-slate-800 mb-6">{category.name}</h1>
                <p className="text-xl text-slate-600 mb-8 leading-relaxed">
                  Discover premium quality products in our {category.name.toLowerCase()} collection.
                </p>
                
                {/* Empty State */}
                <div className="bg-slate-50 rounded-xl p-6">
                  <div className="flex items-center gap-4">
                    <div className="w-12 h-12 bg-slate-100 rounded-full flex items-center justify-center">
                      <Package className="text-slate-400" size={24} />
                    </div>
                    <div>
                      <h3 className="font-semibold text-slate-700">No Products Yet</h3>
                      <p className="text-slate-500 text-sm">Products will be available soon.</p>
                    </div>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    );
  }

  // Find custom data for this category
  const custom = customCategoryData.find((c) => c._id === category._id);

  return (
    <div className="w-full">
      {/* Hero Section - Unique per category */}
      <div className={`${custom?.bgColor || 'bg-white'} rounded-t-3xl overflow-hidden`}>
        <div className={`flex flex-col items-center min-h-[500px] gap-6 md:gap-12 p-6 md:p-12 ${layout === 'desc-first' ? 'md:flex-row-reverse' : 'md:flex-row'}`}>
          {/* Image Side */}
          <div className="flex-1 flex justify-center items-center">
            <div className="">
              <img
                src={category.image.url || "https://images.unsplash.com/photo-1542838132-92c53300491e?w=600&h=400&fit=crop"}
                alt={category.name}
                className="h-auto max-h-96 w-auto object-contain hover:scale-105 transition-transform duration-700 bg-transparent"
                onError={(e) => {
                  const target = e.target as HTMLImageElement;
                  target.src = "https://images.unsplash.com/photo-1542838132-92c53300491e?w=600&h=400&fit=crop";
                }}
              />
            </div>
          </div>
          {/* Content Side */}
          <div className="flex-1 flex justify-center items-center">
            <div className="max-w-xl text-center md:text-left">
              <div className="flex items-center justify-center md:justify-start gap-3 mb-2">
                {custom?.icon && (
                  <span
                    className={`inline-flex items-center justify-center w-14 h-14 md:w-16 md:h-16 rounded-full shadow-xl ring-2 ring-primary-200/60 mb-1 ${custom.bgColor || 'bg-primary-100'}`}
                    style={{
                      background: custom.bgColor?.includes('gradient') ? undefined : undefined,
                    }}
                  >
                    {custom?.icon && (
  <span
    className={`inline-flex items-center justify-center w-14 h-14 md:w-16 md:h-16 rounded-full shadow-xl ring-2 ring-primary-200/60 mb-1 ${custom.bgColor || 'bg-primary-100'}`}
    style={{
      background: custom.bgColor?.includes('gradient') ? undefined : undefined,
    }}
  >
    <custom.icon size={38} strokeWidth={2.2} className="text-primary-600 drop-shadow-[0_2px_8px_rgba(0,0,0,0.18)]" style={{ filter: 'drop-shadow(0 0 6px rgba(0,0,0,0.10))' }} />
  </span>
)}
                  </span>
                )}
                <h1 className="text-2xl md:text-3xl font-bold text-slate-800 leading-tight">{custom?.title || category.name}</h1>
              </div>
              <p className="text-lg text-slate-600 mb-4 leading-relaxed">
                {custom?.desc || `Discover premium quality products in our ${category.name.toLowerCase()} collection. Shop with confidence!`}
              </p>
              <div className="flex flex-wrap gap-3 mb-8 justify-center md:justify-start">
                <span className="inline-flex items-center gap-2 bg-linear-to-r from-primary-100 via-primary-50 to-white text-primary-700 text-sm font-bold px-4 py-1.5 rounded-2xl shadow-lg border border-primary-200/30 backdrop-blur-sm hover:scale-105 transition-transform duration-300">
                  <Package size={18} className="text-primary-400 drop-shadow-sm" />
                  <span className="tracking-wide">{publishedProducts.length} products</span>
                </span>
                <span className="inline-flex items-center gap-2 bg-linear-to-r from-green-200 via-green-50 to-white text-green-800 text-sm font-bold px-4 py-1.5 rounded-2xl shadow-lg border border-green-200/30 backdrop-blur-sm hover:scale-105 transition-transform duration-300">
                  <Star size={18} className="text-green-500 drop-shadow-sm" />
<span className="tracking-wide">{custom?.authenticityLabel || "100% Authentic"}</span>                </span>
              </div>
            </div>
          </div>
        </div>
      </div>

      {/* Slideshow Section - Overlap on desktop/tablet only */}
      <div className="bg-white rounded-b-3xl md:-mt-16 md:relative md:z-10">
        <div className="pb-6 relative">
         <Link
  to={`/category/${slugify(category.name)}-${category._id}`}
  className="absolute top-0 right-4 z-20 inline-flex items-center gap-1 px-3 py-1.5 rounded-full text-xs font-semibold bg-primary-100 text-primary-700 shadow hover:bg-primary-200 hover:text-primary-900 transition-all duration-200 border border-primary-200/40"
  tabIndex={-1}
>
  View More
</Link>
          <div className="container mx-auto px-4">
            {/* Slideshow Container */}
            <div 
              className="relative overflow-hidden rounded-2xl bg-linear-to-br from-slate-50 to-white"
              onMouseEnter={() => setIsAutoPlaying(false)}
              onMouseLeave={() => setIsAutoPlaying(true)}
              onTouchStart={handleTouchStart}
              onTouchMove={handleTouchMove}
              onTouchEnd={handleTouchEnd}
            >
              {/* Slides */}
              <div 
                className="flex transition-transform duration-700 ease-out"
                style={{ 
                  transform: `translateX(-${currentSlide * 100}%)`,
                }}
              >
                {Array.from({ length: totalSlides }).map((_, pageIndex) => {
                  const startIndex = pageIndex * slidesToShow;
                  const pageItems = publishedProducts.slice(startIndex, startIndex + slidesToShow);
                  
                  return (
                    <div key={pageIndex} className={`grid shrink-0 w-full gap-3 px-6 py-4 ${
                      slidesToShow === 2 ? 'grid-cols-2' :
                      slidesToShow === 4 ? 'grid-cols-4 pt-5' :
                      'grid-cols-6'
                    }`}>
                   {pageItems.map((product) => {
  return (
    <ProductCard
      key={product._id}
      product={product}
      onAddToCart={() => console.log('Add to cart', product)}
    />
  );
})}
                    </div>
                  );
                })}
              </div>

              {/* Navigation Arrows */}
              {canSlide && (
                <>
                  <button
                    onClick={() => handleManualNavigation(prevSlide)}
                    className="absolute left-4 top-1/2 -translate-y-1/2 bg-primary-200 hover:bg-primary-300 text-white p-2 rounded-full shadow-lg hover:shadow-xl transition-all duration-300 group z-10"
                  >
                    <ChevronLeft size={18} className="group-hover:scale-110 transition-transform" />
                  </button>
                  
                  <button
                    onClick={() => handleManualNavigation(nextSlide)}
                    className="absolute right-4 top-1/2 -translate-y-1/2 bg-primary-200 hover:bg-primary-300 text-white p-2 rounded-full shadow-lg hover:shadow-xl transition-all duration-300 group z-10"
                  >
                    <ChevronRight size={18} className="group-hover:scale-110 transition-transform" />
                  </button>
                </>
              )}
            </div>

            {/* Pagination Dots */}
            {canSlide && totalSlides > 1 && (
              <div className="flex justify-center mt-6 gap-2">
                {[...Array(totalSlides)].map((_, index) => (
                  <button
                    key={index}
                    onClick={() => {
                      goToSlide(index);
                      setIsAutoPlaying(false);
                      setTimeout(() => setIsAutoPlaying(true), 5000);
                    }}
                    className={`h-2 rounded-full transition-all duration-300 ${ 
                      currentSlide === index
                        ? "bg-primary-200 w-6"
                        : "bg-primary-200/30 hover:bg-primary-200/50 w-2"
                    }`}
                  />
                ))}
              </div>
            )}
          </div>
        </div>
      </div>
    </div>
  );
};
function slugify(str: any) {
  return String(str || '')
    .toLowerCase()
    .normalize('NFD')
    .replace(/\p{Diacritic}/gu, '')
    .replace(/[^a-z0-9]+/g, '-')
    .replace(/(^-|-$)+/g, '');
}

export default CategorySlideshow;