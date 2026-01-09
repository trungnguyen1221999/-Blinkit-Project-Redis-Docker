import { useAuth } from "../Context/AuthContext";
import { Link, useLocation } from "react-router-dom";
import { useState, useEffect } from "react";
import { User, Settings, Lock, ShoppingBag, Shield, Edit3 } from "lucide-react";
import CartDrawer from "../components/CartDrawer";
import { useCartDrawer } from "../components/CartDrawerContext";

interface UserLayoutProps {
  children: React.ReactNode;
}

const UserLayout = ({ children }: UserLayoutProps) => {
  const { user } = useAuth();
  const location = useLocation();
  const { open, closeDrawer } = useCartDrawer();
  const [activeMenu, setActiveMenu] = useState<string>("");

  useEffect(() => {
    if (location.pathname.includes("/profile")) setActiveMenu("profile");
    else if (location.pathname.includes("/change-password"))
      setActiveMenu("change-password");
    else if (location.pathname.includes("/purchases"))
      setActiveMenu("purchases");
    else setActiveMenu("");
  }, [location.pathname]);

  const getMenuClass = (menuKey: string) =>
    `group flex items-center gap-3 px-4 py-3 rounded-xl transition-all duration-200 relative ${
      activeMenu === menuKey
        ? "bg-gradient-to-r from-primary-200/10 to-primary-100/10 text-primary-200 shadow-sm font-medium"
        : "text-slate-600 hover:bg-slate-50 hover:text-slate-800"
    }`;

  return (
    <div className="min-h-screen bg-gradient-to-br from-slate-50 to-slate-100 flex flex-col md:flex-row">
      {/* Modern Sidebar */}
      <aside className="w-full md:w-80 bg-white shadow-xl border-r border-slate-200 flex flex-col relative">
        {/* Header with branding */}
        <div className="p-6 border-b border-slate-200 bg-gradient-to-r from-primary-200 to-primary-100">
          <div className="flex items-center gap-3">
            <div className="w-10 h-10 bg-white rounded-xl flex items-center justify-center shadow-sm">
              <User className="text-primary-200" size={20} />
            </div>
            <div>
              <h1 className="text-white font-bold text-lg">My Account</h1>
              <p className="text-white/80 text-xs">Personal Dashboard</p>
            </div>
          </div>
        </div>

        {/* User Profile Card */}
        <div className="p-6 border-b border-slate-200">
          <div className="bg-gradient-to-r from-slate-50 to-slate-100 rounded-2xl p-6">
            <div className="flex flex-col items-center text-center">
              <div className="relative mb-4">
                <div className="w-20 h-20 rounded-full overflow-hidden border-4 border-white shadow-lg">
                  <img
                    src={
                      user?.avatar ||
                      "https://static.vecteezy.com/system/resources/previews/020/911/750/non_2x/user-profile-icon-profile-avatar-user-icon-male-icon-face-icon-profile-icon-free-png.png"
                    }
                    alt="user avatar"
                    className="w-full h-full object-cover"
                  />
                </div>
                <div className="absolute -bottom-1 -right-1 w-6 h-6 bg-green-400 rounded-full border-3 border-white"></div>
              </div>
              <div className="mb-4">
                <h3 className="font-bold text-slate-800 text-lg mb-1">
                  {user?.name || "User Name"}
                </h3>
                <p className="text-sm text-slate-500">{user?.email || "user@example.com"}</p>
                {user?.role === "ADMIN" && (
                  <span className="inline-flex items-center gap-1 px-2 py-1 rounded-full text-xs font-medium bg-purple-100 text-purple-800 border border-purple-200 mt-2">
                    <Shield size={12} />
                    Administrator
                  </span>
                )}
              </div>
              <Link
                to="/user/account/profile"
                className="inline-flex items-center gap-2 px-4 py-2 text-xs font-medium text-primary-200 bg-white rounded-lg hover:bg-slate-50 transition-colors border border-slate-200 shadow-sm"
              >
                <Edit3 size={12} />
                Edit Profile
              </Link>
            </div>
          </div>
        </div>

        {/* Navigation Menu */}
        <nav className="flex-1 p-4 space-y-2">
          <h4 className="text-xs font-semibold text-slate-400 uppercase tracking-wider mb-4 px-3">
            Account Menu
          </h4>
          
          {/* Hidden "My Account" on mobile - keep for desktop */}
          <div className="hidden md:block mb-6">
            <Link
              to="/user/account/profile"
              className="flex items-center gap-3 px-4 py-3 text-slate-500 text-sm font-medium"
            >
              <Settings size={16} />
              Account Settings
            </Link>
          </div>

          <div className="space-y-2">
            <Link
              to="/user/account/profile"
              onClick={() => setActiveMenu("profile")}
              className={getMenuClass("profile")}
            >
              {activeMenu === "profile" && (
                <div className="absolute left-0 top-0 bottom-0 w-1 bg-gradient-to-b from-primary-200 to-primary-100 rounded-r-full"></div>
              )}
              <div className={`p-2 rounded-lg ${
                activeMenu === "profile" 
                  ? "bg-primary-200/10 text-primary-200" 
                  : "bg-slate-100 group-hover:bg-slate-200 text-slate-500"
              }`}>
                <User size={16} />
              </div>
              <span className="font-medium text-sm">Profile</span>
              {activeMenu === "profile" && (
                <div className="ml-auto w-2 h-2 bg-primary-200 rounded-full animate-pulse"></div>
              )}
            </Link>

            <Link
              to="/user/account/change-password"
              onClick={() => setActiveMenu("change-password")}
              className={getMenuClass("change-password")}
            >
              {activeMenu === "change-password" && (
                <div className="absolute left-0 top-0 bottom-0 w-1 bg-gradient-to-b from-primary-200 to-primary-100 rounded-r-full"></div>
              )}
              <div className={`p-2 rounded-lg ${
                activeMenu === "change-password" 
                  ? "bg-primary-200/10 text-primary-200" 
                  : "bg-slate-100 group-hover:bg-slate-200 text-slate-500"
              }`}>
                <Lock size={16} />
              </div>
              <span className="font-medium text-sm">Change Password</span>
              {activeMenu === "change-password" && (
                <div className="ml-auto w-2 h-2 bg-primary-200 rounded-full animate-pulse"></div>
              )}
            </Link>

            <Link
              to="/user/purchases"
              onClick={() => setActiveMenu("purchases")}
              className={getMenuClass("purchases")}
            >
              {activeMenu === "purchases" && (
                <div className="absolute left-0 top-0 bottom-0 w-1 bg-gradient-to-b from-primary-200 to-primary-100 rounded-r-full"></div>
              )}
              <div className={`p-2 rounded-lg ${
                activeMenu === "purchases" 
                  ? "bg-primary-200/10 text-primary-200" 
                  : "bg-slate-100 group-hover:bg-slate-200 text-slate-500"
              }`}>
                <ShoppingBag size={16} />
              </div>
              <span className="font-medium text-sm">My Purchases</span>
              {activeMenu === "purchases" && (
                <div className="ml-auto w-2 h-2 bg-primary-200 rounded-full animate-pulse"></div>
              )}
            </Link>

            {user?.role === "ADMIN" && (
              <Link 
                to="/admin/dashboard"
                className="group flex items-center gap-3 px-4 py-3 rounded-xl transition-all duration-200 text-slate-600 hover:bg-purple-50 hover:text-purple-600 border border-purple-200 mt-4"
              >
                <div className="p-2 rounded-lg bg-purple-100 group-hover:bg-purple-200 text-purple-600">
                  <Shield size={16} />
                </div>
                <span className="font-medium text-sm">Admin Panel</span>
                <div className="ml-auto">
                  <div className="w-2 h-2 bg-purple-400 rounded-full"></div>
                </div>
              </Link>
            )}
          </div>
        </nav>
      </aside>

      {/* Main Content Area */}
      <main className="flex-1 flex flex-col">
        <CartDrawer open={open} onClose={closeDrawer} />
        {/* Content */}
        <div className="flex-1 p-4 md:p-8 bg-gradient-to-br from-slate-50/50 to-white">
          <div className="max-w-4xl mx-auto">
            {children}
          </div>
        </div>
      </main>
    </div>
  );
};

export default UserLayout;
