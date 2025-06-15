
import { Book } from "lucide-react";
import { Link, useLocation } from "react-router-dom";
import { useAuth } from "@/hooks/useAuth";

const Navbar = () => {
  const location = useLocation();
  const { user, signOut, role, profile } = useAuth();

  const getDisplayName = () => {
    if (profile?.username) {
      return profile.username;
    }
    return user?.email?.split('@')[0] || "User";
  };

  return (
    <nav className="flex items-center justify-between px-4 sm:px-8 py-4 shadow bg-background/80 sticky top-0 z-30 gap-4">
      <div className="flex items-center gap-2">
        <Book size={30} className="text-primary" />
        <span className="font-extrabold text-xl sm:text-2xl tracking-tight text-primary">SmartLearn</span>
      </div>
      
      {/* Desktop Navigation - Hidden on mobile */}
      <div className="hidden md:flex gap-4 lg:gap-6 items-center text-sm lg:text-[15px]">
        <Link to="/" className={`transition-colors font-medium hover:text-primary/80 ${location.pathname === "/" ? "text-primary" : "text-foreground"}`}>
          Home
        </Link>
        <a href="#features" className="transition-colors hover:text-primary/70">Features</a>
        <a href="#contact" className="transition-colors hover:text-primary/70">Contact</a>
        {user && (
          <Link to="/dashboard" className={`transition-colors font-medium hover:text-primary/80 ${location.pathname.startsWith("/dashboard") ? "text-primary" : "text-foreground"}`}>
            Dashboard
          </Link>
        )}
      </div>
      
      {/* Desktop Auth - Hidden on mobile */}
      <div className="hidden md:flex gap-2 lg:gap-4 items-center">
        {user ? (
          <>
            <span className="text-xs lg:text-sm text-muted-foreground hidden lg:block">
              {getDisplayName()} • {role && role.charAt(0).toUpperCase() + role.slice(1)}
            </span>
            <button
              onClick={signOut}
              className="border border-primary px-3 lg:px-4 py-2 rounded-md font-semibold text-sm text-primary hover:bg-primary/5 transition-colors"
            >
              Logout
            </button>
          </>
        ) : (
          <>
            <Link to="/login" className="bg-primary px-3 lg:px-4 py-2 rounded-md text-white font-semibold text-sm shadow hover:scale-105 hover:bg-primary/90 transition-transform">Login</Link>
            <Link to="/register" className="border border-primary px-3 lg:px-4 py-2 rounded-md font-semibold text-sm text-primary hover:bg-primary/5 transition-colors">Register</Link>
          </>
        )}
      </div>

      {/* Mobile Auth - Visible on mobile only */}
      <div className="flex md:hidden gap-2 items-center">
        {user ? (
          <button
            onClick={signOut}
            className="border border-primary px-3 py-2 rounded-md font-semibold text-xs text-primary hover:bg-primary/5 transition-colors"
          >
            Logout
          </button>
        ) : (
          <Link to="/login" className="bg-primary px-3 py-2 rounded-md text-white font-semibold text-xs shadow hover:bg-primary/90 transition-colors">Login</Link>
        )}
      </div>
    </nav>
  );
};

export default Navbar;
