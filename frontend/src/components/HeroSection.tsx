import { ShoppingCart, Clock, Star } from 'lucide-react';

const HeroSection = () => {
  return (
    <section className="container mx-auto relative bg-gradient-to-br from-slate-50 via-white to-primary-50/30 py-12 md:py-20 overflow-hidden">
      {/* Background Pattern */}
      <div className="absolute inset-0 opacity-5">
        <div className="absolute top-10 left-10 w-20 h-20 bg-primary-200 rounded-full blur-xl"></div>
        <div className="absolute top-32 right-20 w-32 h-32 bg-primary-100 rounded-full blur-2xl"></div>
        <div className="absolute bottom-20 left-1/4 w-24 h-24 bg-primary-300 rounded-full blur-xl"></div>
      </div>

      <div className="container mx-auto px-4 relative z-10">
        <div className="grid lg:grid-cols-2 gap-12 items-center">
          
          {/* Content Side */}
          <div className="space-y-8">
            {/* Badge */}
            <div className="inline-flex items-center gap-2 bg-primary-200/15 text-primary-200 px-5 py-2.5 rounded-full text-sm font-semibold backdrop-blur-sm border border-primary-200/20 shadow-sm">
              <Star size={16} className="text-primary-200 fill-current" />
              <span>Trusted by 10,000+ customers</span>
            </div>

            {/* Main Title */}
            <h1 className="text-4xl md:text-5xl lg:text-6xl font-bold leading-tight">
              <span className="text-slate-800">Fresh</span>{' '}
              <span className="text-primary-200 relative">
                Groceries
                <div className="absolute -bottom-2 left-0 right-0 h-3 bg-primary-200/20 -rotate-1 rounded-full"></div>
              </span>
              <br />
              <span className="text-slate-800">Delivered</span>{' '}
              <span className="text-primary-200">Fast</span>
            </h1>

            {/* Description */}
            <p className="text-lg md:text-xl text-slate-600 leading-relaxed max-w-xl">
              Get fresh groceries, organic produce, and daily essentials delivered to your doorstep in 
              <span className="font-semibold text-primary-200"> 30 minutes or less</span>. 
              Quality guaranteed, prices you'll love.
            </p>

       

            {/* Features Row */}
            <div className="grid grid-cols-1 sm:grid-cols-3 gap-6 pt-8">
              <div className="flex items-center gap-3">
                <div className="w-12 h-12 bg-primary-200/10 rounded-xl flex items-center justify-center">
                  <Clock size={20} className="text-primary-200" />
                </div>
                <div>
                  <p className="font-semibold text-slate-800">30 Min Delivery</p>
                  <p className="text-sm text-slate-500">Lightning fast</p>
                </div>
              </div>

              <div className="flex items-center gap-3">
                <div className="w-12 h-12 bg-primary-200/10 rounded-xl flex items-center justify-center">
                  <Star size={20} className="text-primary-200" />
                </div>
                <div>
                  <p className="font-semibold text-slate-800">Fresh Quality</p>
                  <p className="text-sm text-slate-500">Always fresh</p>
                </div>
              </div>

              <div className="flex items-center gap-3">
                <div className="w-12 h-12 bg-primary-200/10 rounded-xl flex items-center justify-center">
                  <ShoppingCart size={20} className="text-primary-200" />
                </div>
                <div>
                  <p className="font-semibold text-slate-800">Best Prices</p>
                  <p className="text-sm text-slate-500">Great deals</p>
                </div>
              </div>
            </div>
          </div>

          {/* Image Side */}
          <div className="relative flex lg:justify-end">
            {/* Hero Image Container */}
            <div className="relative aspect-square max-w-lg w-full lg:max-w-xl">
              {/* Main Image Container */}
              <div className="w-full h-full rounded-3xl overflow-hidden shadow-2xl bg-gradient-to-br from-primary-50 to-primary-100/30 p-4">
                <div className="w-full h-full rounded-2xl overflow-hidden bg-white shadow-lg">
                  <img 
                    src="/images/Groceries.jpg" 
                    alt="Fresh Groceries and Produce" 
                    className="w-full h-full object-cover hover:scale-105 transition-transform duration-700"
                  />
                </div>
              </div>

              {/* Floating Elements */}
              <div className="absolute -top-4 -right-4 w-22 h-22 bg-white/95 backdrop-blur-sm rounded-2xl shadow-xl border border-slate-200/50 flex items-center justify-center hover:scale-105 transition-transform duration-300">
                <div className="text-center">
                  <p className="text-2xl font-bold text-primary-200">30</p>
                  <p className="text-xs text-slate-500 font-semibold uppercase tracking-wide">MIN</p>
                </div>
              </div>

              <div className="absolute -bottom-4 -left-4 bg-white/95 backdrop-blur-sm rounded-2xl shadow-xl border border-slate-200/50 px-4 py-3 hover:scale-105 transition-transform duration-300">
                <div className="flex items-center gap-2">
                  <div className="flex">
                    {[...Array(5)].map((_, i) => (
                      <Star key={i} size={12} className={`${i < 5 ? 'text-yellow-400 fill-current' : 'text-slate-200'}`} />
                    ))}
                  </div>
                  <span className="text-sm font-bold text-slate-700">4.9</span>
                  <span className="text-xs text-slate-500">(2.5k)</span>
                </div>
              </div>

              {/* Enhanced Decorative Elements */}
              <div className="absolute -z-10 top-4 right-4 w-40 h-40 bg-gradient-to-br from-primary-200/15 to-primary-300/10 rounded-full blur-2xl animate-pulse"></div>
              <div className="absolute -z-10 bottom-4 left-4 w-32 h-32 bg-gradient-to-tl from-primary-100/20 to-primary-200/15 rounded-full blur-xl animate-pulse"></div>
              <div className="absolute -z-20 top-1/2 left-1/2 transform -translate-x-1/2 -translate-y-1/2 w-96 h-96 bg-gradient-radial from-primary-50/30 to-transparent rounded-full blur-3xl"></div>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
};

export default HeroSection;