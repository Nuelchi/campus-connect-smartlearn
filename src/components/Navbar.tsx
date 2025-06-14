
import { Book, User, MessageSquare } from "lucide-react";
import { Link, useLocation } from "react-router-dom";

const Navbar = () => {
  const location = useLocation();
  return (
    <nav className="flex items-center justify-between px-8 py-4 shadow bg-background/80 sticky top-0 z-30 gap-4">
      <div className="flex items-center gap-2">
        <Book size={30} className="text-primary" />
        <span className="font-extrabold text-2xl tracking-tight text-primary">SmartLearn</span>
      </div>
      <div className="flex gap-6 items-center text-[15px]">
        <Link to="/" className={`transition-colors font-medium hover:text-primary/80 ${location.pathname === "/" ? "text-primary" : "text-foreground"}`}>
          Home
        </Link>
        <a href="#features" className="transition-colors hover:text-primary/70">Features</a>
        <a href="#contact" className="transition-colors hover:text-primary/70">Contact</a>
      </div>
      <div className="flex gap-4 items-center">
        <Link to="/login" className="bg-primary px-4 py-2 rounded-md text-white font-semibold shadow hover:scale-105 hover:bg-primary/90 transition-transform">Login</Link>
        <Link to="/register" className="border border-primary px-4 py-2 rounded-md font-semibold text-primary hover:bg-primary/5 transition-colors">Register</Link>
        <Link to="/admin-login" className="ml-2 text-muted-foreground text-sm underline decoration-dotted hover:text-primary/70" title="Admin panel login (restricted)">Admin</Link>
      </div>
    </nav>
  );
};
export default Navbar;
