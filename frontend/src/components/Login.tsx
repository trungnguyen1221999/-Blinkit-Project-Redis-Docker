import { Link, useNavigate } from "react-router-dom";
import { useAuth } from "../Context/AuthContext";
import { useState, useRef } from "react";
import logoutApi from "../api/userApi/logoutApi";
import { User, ShoppingBag, Shield, LogOut, ChevronDown } from "lucide-react";

const LoginDropdown = () => {
  const { isAuthenticated, user, setIsAuthenticated, setUser } = useAuth();
  const navigate = useNavigate();
  const [isOpen, setIsOpen] = useState(false);
  const timeoutRef = useRef<number | null>(null);

  const handleMouseEnter = () => {
    if (timeoutRef.current) {
      clearTimeout(timeoutRef.current);
      timeoutRef.current = null;
    }
    setIsOpen(true);
  };

  const handleMouseLeave = () => {
    timeoutRef.current = setTimeout(() => {
      setIsOpen(false);
    }, 150); // Delay 150ms before hiding
  };

  const handleLogout = async () => {
    // Xóa cookie token nếu cần gọi API logout backend
    await logoutApi();
    setIsAuthenticated(false);
    setUser(null);
    navigate("/login");
    localStorage.removeItem("user");
  };

  if (!isAuthenticated) {
    return (
      <Link 
        to="/login" 
        className="flex items-center gap-2 px-4 py-2 bg-gradient-to-r from-primary-200 to-primary-100 text-white rounded-xl hover:shadow-lg hover:scale-105 transition-all duration-200 font-medium"
      >
        <User size={18} />
        <span className="hidden md:inline-block">Login</span>
      </Link>
    );
  }

  return (
    <div
      className="relative"
      onMouseEnter={handleMouseEnter}
      onMouseLeave={handleMouseLeave}
    >
      <div className="flex items-center gap-2 px-3 py-2 bg-slate-50 hover:bg-slate-100 rounded-xl transition-all duration-200 cursor-pointer border border-slate-200">
        <div className="w-8 h-8 md:w-10 md:h-10 rounded-full overflow-hidden bg-white border-2 border-slate-200 shadow-sm">
          <img
            src={user?.avatar || "https://static.vecteezy.com/system/resources/previews/020/911/750/non_2x/user-profile-icon-profile-avatar-user-icon-male-icon-face-icon-profile-icon-free-png.png"}
            alt="avatar"
            className="w-full h-full object-cover"
          />
        </div>

        <div className="hidden md:flex flex-col">
          <span className="text-sm font-medium text-slate-800 leading-tight">
            {user?.name || "My Account"}
          </span>
          {user?.role === "ADMIN" && (
            <span className="text-xs text-purple-600 font-medium">Administrator</span>
          )}
        </div>

        <ChevronDown size={16} className={`text-slate-400 transition-transform duration-200 ${isOpen ? 'rotate-180' : ''}`} />
      </div>

      {/* Modern Dropdown */}
      {isOpen && (
        <div className="absolute top-full right-0 mt-2 w-56 bg-white border border-slate-200 rounded-2xl shadow-xl z-50 py-2 backdrop-blur-sm">
          <div className="px-4 py-3 border-b border-slate-100">
            <p className="text-sm font-semibold text-slate-800">{user?.name}</p>
            <p className="text-xs text-slate-500">{user?.email}</p>
          </div>

          <div className="py-2">
            <Link
              to="/user/account/profile"
              className="flex items-center gap-3 px-4 py-2 hover:bg-slate-50 transition-colors text-slate-700 hover:text-slate-900"
            >
              <User size={16} className="text-slate-400" />
              <span className="text-sm font-medium">My Account</span>
            </Link>
            
            <Link
              to="/user/purchases"
              className="flex items-center gap-3 px-4 py-2 hover:bg-slate-50 transition-colors text-slate-700 hover:text-slate-900"
            >
              <ShoppingBag size={16} className="text-slate-400" />
              <span className="text-sm font-medium">My Purchases</span>
            </Link>

            {user?.role === "ADMIN" && (
              <>
                <div className="border-t border-slate-100 my-2"></div>
                <Link
                  to="/admin/dashboard"
                  className="flex items-center gap-3 px-4 py-2 hover:bg-purple-50 transition-colors text-purple-700 hover:text-purple-900"
                >
                  <Shield size={16} className="text-purple-500" />
                  <span className="text-sm font-medium">Admin Panel</span>
                </Link>
              </>
            )}
          </div>

          <div className="border-t border-slate-100 pt-2">
            <button
              onClick={handleLogout}
              className="flex items-center gap-3 px-4 py-2 w-full text-left hover:bg-red-50 transition-colors text-red-600 hover:text-red-700"
            >
              <LogOut size={16} className="text-red-500" />
              <span className="text-sm font-medium">Sign Out</span>
            </button>
          </div>
        </div>
      )}
    </div>
  );
};

export default LoginDropdown;
