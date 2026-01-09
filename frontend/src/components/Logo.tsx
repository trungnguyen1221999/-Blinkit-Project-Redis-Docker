const Logo = ({ className = "" }: { className?: string }) => (
  <span className={`select-none font-extrabold tracking-tight ${className}`}>
    <span className="text-primary-200">Blink</span>
    <span className="text-green-600">it</span>
  </span>
);

export default Logo;
