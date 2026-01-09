import { Link } from "react-router-dom";
import Logo from "./Logo";
import Search from "./Search";
import Login from "./Login";
import Cart from "./Cart";
import ProductDropdown from "./ProductDropdown";

const Header = () => {
  return (
    <header className="bg-white shadow-md border-b border-slate-100 sticky top-0 z-50">
      <div className="container mx-auto px-2 md:px-6 flex items-center justify-between h-16 md:h-20">
        {/* Left: Logo */}
        <div className="flex items-center gap-2 md:gap-4 min-w-[48px]">
          <Link to="/" className="flex items-center select-none">
            <span className="hidden sm:block text-3xl md:text-4xl">
              <Logo />
            </span>
            <span className="block sm:hidden text-2xl">
              <Logo />
            </span>
          </Link>
        </div>

        {/* Center: Search bar (always visible, max width) */}
        <div className="flex-1 flex justify-center px-2">
          <div className="w-full max-w-xs sm:max-w-md md:max-w-xl">
            <Search />
          </div>
        </div>

        {/* Right: Actions & Menu */}
        <div className="flex items-center gap-2 md:gap-4">
          {/* Desktop: Mega menu */}
          <div className="hidden lg:block">
            <ProductDropdown />
          </div>
          {/* Tablet: Show menu as icon */}
          <div className="hidden sm:block lg:hidden">
            <ProductDropdown mobile />
          </div>
          {/* Mobile: Hamburger menu only */}
          <div className="block sm:hidden">
            <ProductDropdown mobile />
          </div>
          {/* User Actions */}
          <div className="flex items-center gap-1 md:gap-2 ml-2">
            <Login />
            <Cart />
          </div>
        </div>
      </div>
    </header>
  );
};

export default Header;
