import { useParams } from 'react-router-dom';
import { useQuery } from '@tanstack/react-query';
import { getProductByIdApi, getProductsByCategoryApi } from '../api/adminApi/productApi';
import { BadgePercent, Globe, Barcode, Info, Layers, ChevronDown, ChevronUp, BookOpen, List } from 'lucide-react';
import { useState, useEffect } from 'react';
import AddToCart from '../components/AddToCart';
import ProductCard from '../components/ProductCard';
import { useAuth } from "../Context/AuthContext";
import { addToCartApi } from "../api/cartApi";
import { useQueryClient } from "@tanstack/react-query";
import { useCartDrawer } from "../components/CartDrawerContext";
import { useNavigate } from "react-router-dom";

interface Product {
  _id: string;
  name: string;
  images: Array<{ url: string; public_id: string }>;
  category: (string | { _id: string; name: string })[];
  SubCategory: string[];
  unit: string;
  stock: number;
  price: number;
  discount?: number;
  description: string;
  more_details?: Record<string, string>;
  publish: boolean;
  createdAt: string;
  updatedAt: string;
}

// --- Helper: slugify ---
function slugify(str: any = '') {
  if (typeof str !== 'string') return '';
  return str
    .toLowerCase()
    .normalize('NFD')
    .replace(/\p{Diacritic}/gu, '')
    .replace(/[^a-z0-9]+/g, '-')
    .replace(/^-+|-+$/g, '');
}

// Helper to extract productId from slug (robust: always get last 24 hex chars)
function extractProductId(slug: string): string | null {
  if (!slug) return null;
  // Always get last 24 hex chars (MongoDB ObjectId)
  const match = slug.match(/([a-fA-F0-9]{24})$/);
  return match ? match[1] : null;
}

const ProductDetailPage = () => {
  // Get params: category, subcategory, slug
  const { slug } = useParams<{ slug: string }>();
  // Extract productId from slug (robust)
  const productId = slug ? extractProductId(slug) : null;

  const { data: product, isLoading, error } = useQuery<Product | undefined>({
    queryKey: ['product', productId],
    queryFn: () => productId ? getProductByIdApi(productId) : Promise.resolve(undefined),
    enabled: !!productId,
  });
  const [showMoreDetails, setShowMoreDetails] = useState(false);
  const [mainImgIdx, setMainImgIdx] = useState(0);
  const [relatedProducts, setRelatedProducts] = useState<Product[]>([]);
  const { user } = useAuth();
  const queryClient = useQueryClient();
  const { openDrawer } = useCartDrawer();
  const navigate = useNavigate();

  // Fetch related products by category
  useEffect(() => {
    const fetchRelated = async () => {
      if (product && product.category && product.category.length > 0) {
        const cat = product.category[0];
        const catId = typeof cat === 'string' ? cat : (cat && 'object' === typeof cat ? cat._id : '');
        if (!catId) return;
        try {
          const products = await getProductsByCategoryApi(catId);
          setRelatedProducts(products.filter((p: Product) => p._id !== product._id));
        } catch (e) {
          setRelatedProducts([]);
        }
      }
    };
    fetchRelated();
  }, [product]);

  if (isLoading) return <div className="text-center py-12 text-lg">Loading product...</div>;
  if (error || !product) return <div className="text-center py-12 text-lg text-red-500">Product not found.</div>;

  const discount = typeof product.discount === 'number' ? product.discount : 0;
  const discountedPrice = product.price * (1 - discount / 100);
  const origin = product.more_details?.['Country of origin/country of manufacture'] || 'Unknown';
  const ean = product.more_details?.['EAN code'] || 'N/A';

  // Prepare more details, including Origin and EAN
  const moreDetails: Record<string, string> = {
    ...(product.more_details || {}),
    'Country of origin/country of manufacture': origin,
    'EAN code': ean,
  };

  return (
    <>
      <section className="w-full min-h-screen bg-white pb-16">
        {/* --- Breadcrumbs --- */}
        <div className="container mx-auto px-4 pt-8 pb-2">
          <nav
            className="text-xs md:text-sm text-slate-500 flex items-center gap-2 mb-4 overflow-x-hidden whitespace-nowrap max-w-full md:max-w-none"
            aria-label="Breadcrumb"
            style={{ WebkitOverflowScrolling: 'touch' }}
            tabIndex={0}
          >
            {Array.isArray(product.category) && product.category.length > 0 && (
              <>
                {(Array.isArray(product.category) ? product.category : []).map((cat: any, idx: number) => (
                  <span key={typeof cat === 'object' ? cat._id : cat} className="flex items-center">
                    {idx > 0 && <span className="mx-1">&gt;</span>}
                    <a
                      href={`/category/${typeof cat === 'object' ? slugify(cat.name) + '-' + cat._id : cat}`}
                      className="text-primary-700 hover:underline font-semibold"
                    >
                      {typeof cat === 'object' ? cat.name : cat}
                    </a>
                  </span>
                ))}
                <span className="mx-1">&gt;</span>
              </>
            )}
            {Array.isArray(product.SubCategory) && product.SubCategory.length > 0 && (
              <>
                {(Array.isArray(product.SubCategory) ? product.SubCategory : []).map((subCat: any, idx: number) => (
                  <span key={typeof subCat === 'object' ? subCat._id : subCat} className="flex items-center">
                    {idx > 0 && <span className="mx-1">&gt;</span>}
                    <a
                      href={`/subcategory/${typeof subCat === 'object' ? slugify(subCat.name) + '-' + subCat._id : slugify(subCat)}`}
                      className="text-primary-700 hover:underline font-semibold"
                    >
                      {typeof subCat === 'object' ? subCat.name : subCat}
                    </a>
                  </span>
                ))}
              </>
            )}
          </nav>
        </div>
        <div className="container mx-auto px-4 py-12 flex flex-col md:flex-row gap-16 items-start">
          {/* Image */}
          <div className="flex-1 flex flex-col items-center md:items-start">
            <div className="w-full max-w-lg aspect-square bg-white rounded-2xl flex items-center justify-center overflow-hidden mb-4 p-8">
              <img
                src={product.images?.[mainImgIdx]?.url || '/images/placeholder-product.jpg'}
                alt={product.name}
                className="object-contain w-full h-full"
              />
            </div>
            {product.images && product.images.length > 1 && (
              <div className="w-full max-w-lg flex gap-2 mt-2">
                {(Array.isArray(product.images) ? product.images : []).map((img, idx) => (
                  <img
                    key={img.public_id || idx}
                    src={img.url}
                    alt={product.name + ' ' + (idx + 1)}
                    className={`w-16 h-16 object-contain rounded ${mainImgIdx === idx ? 'border-2 border-primary-200 ' : 'border border-slate-200 hover:border-primary-200'} bg-white cursor-pointer transition`}
                    onMouseEnter={() => setMainImgIdx(idx)}
                    onClick={() => setMainImgIdx(idx)}
                  />
                ))}
              </div>
            )}
          </div>
          {/* Details (name, price, add to cart) */}
          <div className="flex-1 flex flex-col gap-8 bg-white rounded-2xl p-10">
            <div className="flex flex-col gap-3 md:gap-5">
              <div className="flex flex-col gap-1 md:gap-2">
                <h1 className="text-4xl font-extrabold text-slate-900 mb-1">
                  {product.name}
                </h1>
                {product.stock < 20 && (
                  <span className="flex gap-2 w-fit items-center gap-1 bg-red-50 text-red-700 px-4 py-1 rounded-full text-base font-bold animate-pulse">
                    <Info className="w-5 h-5 text-red-500" /> Low Stock
                  </span>
                )}
              </div>
              <div className="flex items-center gap-5 mb-2">
                {discount > 0 ? (
                  <>
                    <span className="text-4xl font-extrabold text-primary-600 flex items-center gap-2">
                      <BadgePercent className="w-7 h-7 text-red-500" />
                      <span className="text-5xl font-extrabold"><span className="mr-1">€</span>{discountedPrice.toFixed(2)}</span>
                      <span className="text-lg font-normal text-slate-700">/{product.unit}</span>
                    </span>
                    <span className="text-xl text-slate-400 line-through font-normal"><span className="mr-1">€</span>{product.price.toFixed(2)}/<span className='text-base'>{product.unit}</span></span>
                    <span className="ml-2 text-xl text-red-500 font-extrabold">-{discount}%</span>
                  </>
                ) : (
                  <span className="text-4xl font-extrabold text-primary-600">
                    <span className="text-5xl font-extrabold"><span className="mr-1">€</span>{product.price.toFixed(2)}</span>
                    <span className="text-lg font-normal text-slate-700">/{product.unit}</span>
                  </span>
                )}
              </div>
            </div>
            <AddToCart
              product={product}
              onAddToCart={async (product, quantity) => {
                let guestId = localStorage.getItem('guestId');
                if (!guestId) {
                  guestId = Math.random().toString(36).substring(2) + Date.now().toString(36);
                  localStorage.setItem('guestId', guestId);
                }
                try {
                  if (user && user._id) {
                    await addToCartApi({ productId: product._id, quantity, userId: user._id });
                  } else {
                    await addToCartApi({ productId: product._id, quantity, guestId });
                  }
                  queryClient.invalidateQueries({ queryKey: ["cart"] });
                  openDrawer();
                } catch (err) {
                  console.error('Add to cart failed', err);
                }
              }}
              onBuyNow={async (product, quantity) => {
                let guestId = localStorage.getItem('guestId');
                if (!guestId) {
                  guestId = Math.random().toString(36).substring(2) + Date.now().toString(36);
                  localStorage.setItem('guestId', guestId);
                }
                try {
                  if (user && user._id) {
                    await addToCartApi({ productId: product._id, quantity, userId: user._id });
                  } else {
                    await addToCartApi({ productId: product._id, quantity, guestId });
                  }
                  queryClient.invalidateQueries({ queryKey: ["cart"] });
                  // Chuyển sang CartPage và truyền state để chọn sẵn sản phẩm này
                  navigate("/cart", { state: { buyNowId: product._id } });
                } catch (err) {
                  console.error('Buy now failed', err);
                }
              }}
            />
          </div>
        </div>
        {/* Description + More Details full width, but inside container */}
        <div className="container mx-auto px-4 mt-8">
          <div className="w-full">
            <div className="border-t border-slate-100 pt-6">
              <h2 className="text-xl font-extrabold mb-2 flex items-center gap-2 text-primary-700">
                <Info className="w-6 h-6" /> Description
              </h2>
              <p className="text-slate-800 text-lg font-normal whitespace-pre-line mb-2 leading-relaxed">{product.description}</p>
            </div>
            <div className="border-t border-slate-100 pt-6">
              <button
                className="flex items-center gap-2 text-xl font-extrabold mb-2 text-primary-700 focus:outline-none select-none"
                onClick={() => setShowMoreDetails((v) => !v)}
                aria-expanded={showMoreDetails}
                aria-controls="more-details-section"
              >
                <Layers className="w-6 h-6" /> More Details
                {showMoreDetails ? <ChevronUp className="w-5 h-5" /> : <ChevronDown className="w-5 h-5" />}
              </button>
              {showMoreDetails && (
                <ul id="more-details-section" className="flex flex-col gap-3 mt-2">
                  {(Object.entries(moreDetails) ? Object.entries(moreDetails) : []).map(([key, value]) => {
                    let icon = <Layers className="w-5 h-5 text-primary-400" />;
                    if (/ean/i.test(key)) icon = <Barcode className="w-5 h-5 text-primary-400" />;
                    else if (/origin|country/i.test(key)) icon = <Globe className="w-5 h-5 text-primary-400" />;
                    else if (/instruction|use|usage/i.test(key)) icon = <BookOpen className="w-5 h-5 text-primary-400" />;
                    else if (/ingredient/i.test(key)) icon = <List className="w-5 h-5 text-primary-400" />;
                    return (
                      <li key={key} className="flex gap-2 text-base text-slate-800 font-normal items-center">
                        {icon}
                        <span className="font-semibold text-slate-500">{key}:</span>
                        <span className="font-normal text-slate-800">{String(value)}</span>
                      </li>
                    );
                  })}
                </ul>
              )}
            </div>
          </div>
        </div>
      </section>
      {/* Related Products List */}
      {relatedProducts.length > 0 && (
        <div className="w-full  mt-12 ml-3">

          <div className='container mx-auto'>
            <h3 className="text-2xl font-extrabold mb-4 text-slate-900 text-left">Related Products</h3>
            <div className="flex gap-6 overflow-x-auto pb-2 scrollbar-thin scrollbar-thumb-primary-200 text-left justify-start items-stretch">
              {(Array.isArray(relatedProducts) ? relatedProducts : []).map((product) => (
                <div key={product._id} className="min-w-[200px] max-w-[220px] flex items-stretch">
                  <ProductCard product={product} />
                </div>
              ))}
            </div>
          </div>
        </div>
      )}
    </>
  );
};

export default ProductDetailPage;
