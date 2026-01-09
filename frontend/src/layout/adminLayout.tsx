import React, { useState } from "react";
import { Link, useLocation, useNavigate } from "react-router-dom";
import {
  LayoutDashboard,
  Users,
  Package,
  ListOrdered,
  ShoppingBag,
  UserCircle,
  ChartColumnStacked,
  Settings,
  LogOut,
  Home,
} from "lucide-react";
import { useAuth } from "../Context/AuthContext";
import logoutApi from "../api/userApi/logoutApi";

interface AdminLayoutProps {
  children: React.ReactNode;
}

const AdminLayout: React.FC<AdminLayoutProps> = ({ children }) => {
  const location = useLocation();
  const navigate = useNavigate();
  const { user, setIsAuthenticated, setUser } = useAuth();
  const [sidebarOpen, setSidebarOpen] = useState(false);

  const handleLogout = async () => {
    try {
      await logoutApi();
      setIsAuthenticated(false);
      setUser(null);
      localStorage.removeItem("user");
      navigate("/");
    } catch (error) {
      console.error("Logout error:", error);
      // Force logout even if API call fails
      setIsAuthenticated(false);
      setUser(null);
      localStorage.removeItem("user");
      navigate("/");
    }
  };

  const menuItems = [
    {
      name: "Dashboard",
      path: "/admin/dashboard",
      icon: <LayoutDashboard size={18} />,
    },
    { name: "Users", path: "/admin/users", icon: <Users size={18} /> },
    { name: "Products", path: "/admin/products", icon: <Package size={18} /> },
    {
      name: "Categories",
      path: "/admin/categories",
      icon: <ListOrdered size={18} />,
    },
    {
      name: "SubCategories",
      path: "/admin/sub-categories",
      icon: <ChartColumnStacked size={18} />,
    },
    { name: "Orders", path: "/admin/orders", icon: <ShoppingBag size={18} /> },
    {
      name: "Customers",
      path: "/admin/customers",
      icon: <UserCircle size={18} />,
    },
  ];

  return (
    <div className="h-screen max-h-screen bg-gradient-to-br from-slate-50 to-slate-100 flex overflow-hidden">
      {/* Sidebar: hidden on mobile, slide-in */}
      <aside
        className={`
          fixed inset-0 z-40 md:static md:z-auto md:flex w-72 bg-white shadow-xl border-r border-slate-200 flex-col overflow-hidden transition-transform duration-300
          ${sidebarOpen ? "translate-x-0" : "-translate-x-full"}
          md:translate-x-0
        `}
        style={{ display: sidebarOpen || window.innerWidth >= 768 ? "flex" : "none" }}
      >
        {/* Header with logo */}
        <div className="p-6 border-b border-slate-200 bg-gradient-to-r from-primary-200 to-primary-100">
          <div className="flex items-center gap-3">
            <div className="w-10 h-10 bg-white rounded-xl flex items-center justify-center shadow-sm">
              <LayoutDashboard className="text-primary-200" size={20} />
            </div>
            <div>
              <h1 className="text-white font-bold text-lg">Admin Panel</h1>
              <p className="text-white/80 text-xs">Blinkit Management</p>
            </div>
          </div>
        </div>

        {/* Admin Profile Card */}
        <div className="p-6 border-b border-slate-200">
          <div className="bg-gradient-to-r from-slate-50 to-slate-100 rounded-2xl p-4">
            <div className="flex items-center gap-3">
              <div className="relative">
                <div className="w-12 h-12 rounded-full overflow-hidden border-2 border-white shadow-sm">
                  <img
                    src={
                      user?.avatar ||
                      "https://static.vecteezy.com/system/resources/previews/020/911/750/non_2x/user-profile-icon-profile-avatar-user-icon-male-icon-face-icon-free-png.png"
                    }
                    alt="admin avatar"
                    className="w-full h-full object-cover"
                  />
                </div>
                <div className="absolute -bottom-1 -right-1 w-4 h-4 bg-green-400 rounded-full border-2 border-white"></div>
              </div>
              <div className="flex-1 min-w-0">
                <h3 className="font-semibold text-slate-800 text-sm truncate">
                  {user?.name || "Admin Name"}
                </h3>
                <p className="text-xs text-slate-500">Administrator</p>
              </div>
            </div>
            <Link
              to="/user/account/profile"
              className="inline-flex items-center gap-1 mt-3 px-3 py-1.5 text-xs font-medium text-primary-200 bg-white rounded-lg hover:bg-slate-50 transition-colors border border-slate-200"
            >
              <Settings size={12} />
              Edit Profile
            </Link>
          </div>
        </div>

        {/* Navigation Menu */}
        <nav className="flex-1 p-4 space-y-2 overflow-y-auto">
          <h4 className="text-xs font-semibold text-slate-400 uppercase tracking-wider mb-4 px-3">
            Main Menu
          </h4>
          {(Array.isArray(menuItems) ? menuItems : []).map((item) => {
            const isActive = location.pathname.startsWith(item.path);
            return (
              <Link
                key={item.name}
                to={item.path}
                className={`group flex items-center gap-3 px-3 py-3 rounded-xl transition-all duration-200 relative ${
                  isActive
                    ? "bg-gradient-to-r from-primary-200/10 to-primary-100/10 text-primary-200 shadow-sm"
                    : "text-slate-600 hover:bg-slate-50 hover:text-slate-800"
                }`}
              >
                {isActive && (
                  <div className="absolute left-0 top-0 bottom-0 w-1 bg-gradient-to-b from-primary-200 to-primary-100 rounded-r-full"></div>
                )}
                <div className={`p-2 rounded-lg ${
                  isActive 
                    ? "bg-primary-200/10 text-primary-200" 
                    : "bg-slate-100 group-hover:bg-slate-200 text-slate-500"
                }`}>
                  {React.cloneElement(item.icon, { size: 16 })}
                </div>
                <span className="font-medium text-sm">{item.name}</span>
                {isActive && (
                  <div className="ml-auto w-2 h-2 bg-primary-200 rounded-full animate-pulse"></div>
                )}
              </Link>
            );
          })}
        </nav>

        {/* Bottom Actions */}
        <div className="p-4 border-t border-slate-200 space-y-2">
          <Link to="/" className="w-full flex items-center gap-3 px-3 py-3 text-red-600 hover:bg-red-50 rounded-xl transition-colors group">
            <div className="p-2 rounded-lg bg-red-100 group-hover:bg-red-200">
              <Home size={16} />
            </div>
            <span className="font-medium text-sm">Home</span>
          </Link>
          <button 
            onClick={handleLogout}
            className="w-full flex items-center gap-3 px-3 py-3 text-red-600 hover:bg-red-50 rounded-xl transition-colors group"
          >
            <div className="p-2 rounded-lg bg-red-100 group-hover:bg-red-200">
              <LogOut size={16} />
            </div>
            <span className="font-medium text-sm">Sign Out</span>
          </button>
        </div>
      </aside>

      {/* Main Content Area */}
      <main className="flex-1 flex flex-col max-h-screen overflow-hidden md:ml-0">
        {/* Top Header Bar */}
        <header className="bg-white shadow-sm border-b border-slate-200 px-4 py-4 md:px-8">
          <div className="flex items-center justify-between">
            <div className="flex items-center gap-4">
              {/* Hamburger for mobile */}
              <button
                className="md:hidden p-2 rounded-lg bg-slate-100 hover:bg-slate-200"
                onClick={() => setSidebarOpen((open) => !open)}
                aria-label="Open sidebar"
              >
                <svg width="24" height="24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><line x1="3" y1="12" x2="21" y2="12"/><line x1="3" y1="6" x2="21" y2="6"/><line x1="3" y1="18" x2="21" y2="18"/></svg>
              </button>
              <div className="w-px h-6 bg-slate-200 hidden md:block"></div>
              <div className="text-sm text-slate-500">
                {new Date().toLocaleDateString('en-US', { 
                  weekday: 'long', 
                  year: 'numeric', 
                  month: 'long', 
                  day: 'numeric' 
                })}
              </div>
            </div>
            <div className="flex items-center gap-4">
              {/* Profile Dropdown */}
              <div className="flex items-center gap-2 p-2 hover:bg-slate-50 rounded-lg transition-colors cursor-pointer">
                <div className="w-8 h-8 rounded-full overflow-hidden">
                  <img
                    src={user?.avatar || "https://static.vecteezy.com/system/resources/previews/020/911/750/non_2x/user-profile-icon-profile-avatar-user-icon-male-icon-face-icon-free-png.png"}
                    alt="profile"
                    className="w-full h-full object-cover"
                  />
                </div>
                <span className="text-sm font-medium text-slate-700">{user?.name}</span>
              </div>
            </div>
          </div>
        </header>

        {/* Overlay for sidebar on mobile */}
        {sidebarOpen && (
          <div
            className="fixed inset-0 z-30 bg-black/30 md:hidden"
            onClick={() => setSidebarOpen(false)}
            aria-label="Close sidebar overlay"
          />
        )}

        {/* Content */}
        <div className="flex-1 p-2 md:p-8 bg-gradient-to-br from-slate-50/50 to-white overflow-y-auto">
          <div className="max-w-7xl mx-auto h-full">
            {children}
          </div>
        </div>
      </main>
    </div>
  );
};

export default AdminLayout;
