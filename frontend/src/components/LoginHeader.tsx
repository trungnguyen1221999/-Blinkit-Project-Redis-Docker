import { Link } from "react-router-dom";
import Logo from "./Logo";

const LoginHeader = () => {
  return (
    <header className="bg-white shadow-lg border-b border-slate-200">
      <div className="container mx-auto flex justify-center py-6 md:py-8">
        <Link 
          to="/" 
          className="hover:scale-105 transition-transform duration-200 group"
        >
          <span className="text-3xl md:text-4xl">
            <Logo />
          </span>
        </Link>
      </div>
    </header>
  );
};

export default LoginHeader;
