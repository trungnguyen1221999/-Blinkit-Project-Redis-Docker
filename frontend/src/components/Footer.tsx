import { Github, Heart } from "lucide-react";
import Logo from "./Logo";

const Footer = () => {
  return (
    <footer className="bg-gradient-to-r from-slate-50 to-slate-100 border-t border-slate-200">
      <div className="container mx-auto px-4 py-12">
        {/* Main Footer Content */}
        <div className="grid grid-cols-1 md:grid-cols-4 gap-8 mb-8">
          {/* Company Info */}
          <div className="md:col-span-2">
            <h3 className="text-xl font-bold text-slate-800 mb-4"><Logo className="text-2xl" /></h3>
            <p className="text-slate-600 mb-4 max-w-md">
              Your one-stop shop for fresh groceries, daily essentials, and more. 
              Fast delivery, quality products, and unbeatable prices.
            </p>
            <div className="flex items-center gap-4">
              <a 
                href="https://github.com/trungnguyen1221999/-Blinkit-Clone" 
                target="_blank"
                rel="noopener noreferrer"
                className="w-10 h-10 bg-white rounded-xl flex items-center justify-center text-slate-600 hover:text-slate-800 hover:bg-slate-100 transition-all duration-200 shadow-sm border border-slate-200"
              >
                <Github size={18} />
              </a>
            </div>
          </div>

          {/* Quick Links */}
          <div>
            <h4 className="font-semibold text-slate-800 mb-4">Quick Links</h4>
            <ul className="space-y-2 text-slate-600">
              <li><a href="#" className="hover:text-primary-200 transition-colors">About Us</a></li>
              <li><a href="#" className="hover:text-primary-200 transition-colors">Categories</a></li>
              <li><a href="#" className="hover:text-primary-200 transition-colors">Contact</a></li>
              <li><a href="#" className="hover:text-primary-200 transition-colors">Help Center</a></li>
            </ul>
          </div>

          {/* Customer Service */}
          <div>
            <h4 className="font-semibold text-slate-800 mb-4">Customer Service</h4>
            <ul className="space-y-2 text-slate-600">
              <li><a href="#" className="hover:text-primary-200 transition-colors">Privacy Policy</a></li>
              <li><a href="#" className="hover:text-primary-200 transition-colors">Terms of Service</a></li>
              <li><a href="#" className="hover:text-primary-200 transition-colors">Return Policy</a></li>
              <li><a href="#" className="hover:text-primary-200 transition-colors">Track Order</a></li>
            </ul>
          </div>
        </div>

        {/* Bottom Footer */}
        <div className="border-t border-slate-200 pt-8 text-center">
          <p className="text-slate-600 flex items-center justify-center gap-2 flex-wrap">
            © 2025 All Rights Reserved - Made with 
            <Heart size={16} className="text-red-500 fill-current" /> 
            by Kai Nguyen
          </p>
        </div>
      </div>
    </footer>
  );
};

export default Footer;
