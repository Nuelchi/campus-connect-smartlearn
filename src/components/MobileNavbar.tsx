
import { useState } from "react";
import { Book, Menu, X } from "lucide-react";
import { Link, useLocation } from "react-router-dom";
import { useAuth } from "@/hooks/useAuth";

const MobileNavbar = () => {
  const [isMenuOpen, setIsMenuOpen] = useState(false);
  const location = useLocation();
  const { user, signOut, role, profile } = useAuth();

  const getDisplayName = () => {
    if (profile?.username) {
      return profile.username;
    }
    return user?.email?.split('@')[0] || "User";
  };

  const toggleMenu = () => setIsMenuOpen(!isMenuOpen);

  const closeMenu = () => setIsMenuOpen(false);

  return (
    <nav className="flex items-center justify-between px-4 sm:px-8 py-4 shadow bg-background/80 sticky top-0 z-50">
      {/* Logo */}
      <div className="flex items-center gap-2">
        <Book size={30} className="text-primary" />
        <span className="font-extrabold text-xl sm:text-2xl tracking-tight text-primary">SmartLearn</span>
      </div>

      {/* Desktop Navigation */}
      <div className="hidden lg:flex gap-6 items-center text-[15px]">
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

      {/* Desktop Auth Section */}
      <div className="hidden lg:flex gap-4 items-center">
        {user ? (
          <>
            <span className="text-sm text-muted-foreground">
              {getDisplayName()} • {role && role.charAt(0).toUpperCase() + role.slice(1)}
            </span>
            <button
              onClick={signOut}
              className="border border-primary px-4 py-2 rounded-md font-semibold text-primary hover:bg-primary/5 transition-colors"
            >
              Logout
            </button>
          </>
        ) : (
          <>
            <Link to="/login" className="bg-primary px-4 py-2 rounded-md text-white font-semibold shadow hover:scale-105 hover:bg-primary/90 transition-transform">Login</Link>
            <Link to="/register" className="border border-primary px-4 py-2 rounded-md font-semibold text-primary hover:bg-primary/5 transition-colors">Register</Link>
          </>
        )}
      </div>

      {/* Mobile Menu Button */}
      <button
        onClick={toggleMenu}
        className="lg:hidden p-2 rounded-md hover:bg-primary/10 transition-colors"
        aria-label="Toggle menu"
      >
        {isMenuOpen ? <X size={24} /> : <Menu size={24} />}
      </button>

      {/* Mobile Menu Overlay */}
      {isMenuOpen && (
        <>
          <div 
            className="fixed inset-0 bg-black/50 z-40 lg:hidden" 
            onClick={closeMenu}
          />
          
          {/* Mobile Menu */}
          <div className="fixed top-0 right-0 h-full w-80 bg-background shadow-2xl z-50 lg:hidden transform transition-transform duration-300 ease-in-out">
            <div className="flex flex-col h-full">
              {/* Mobile Menu Header */}
              <div className="flex items-center justify-between p-4 border-b">
                <div className="flex items-center gap-2">
                  <Book size={24} className="text-primary" />
                  <span className="font-bold text-lg text-primary">SmartLearn</span>
                </div>
                <button
                  onClick={closeMenu}
                  className="p-2 rounded-md hover:bg-primary/10 transition-colors"
                  aria-label="Close menu"
                >
                  <X size={20} />
                </button>
              </div>

              {/* Mobile Navigation Links */}
              <div className="flex flex-col p-4 space-y-4">
                <Link 
                  to="/" 
                  onClick={closeMenu}
                  className={`text-lg font-medium py-2 px-3 rounded-md transition-colors ${location.pathname === "/" ? "text-primary bg-primary/10" : "text-foreground hover:bg-primary/5"}`}
                >
                  Home
                </Link>
                <a 
                  href="#features" 
                  onClick={closeMenu}
                  className="text-lg py-2 px-3 rounded-md hover:bg-primary/5 transition-colors"
                >
                  Features
                </a>
                <a 
                  href="#contact" 
                  onClick={closeMenu}
                  className="text-lg py-2 px-3 rounded-md hover:bg-primary/5 transition-colors"
                >
                  Contact
                </a>
                {user && (
                  <Link 
                    to="/dashboard" 
                    onClick={closeMenu}
                    className={`text-lg font-medium py-2 px-3 rounded-md transition-colors ${location.pathname.startsWith("/dashboard") ? "text-primary bg-primary/10" : "text-foreground hover:bg-primary/5"}`}
                  >
                    Dashboard
                  </Link>
                )}
              </div>

              {/* Mobile Auth Section */}
              <div className="mt-auto p-4 border-t">
                {user ? (
                  <div className="space-y-4">
                    <div className="text-sm text-muted-foreground p-3 bg-muted rounded-md">
                      <div className="font-medium">{getDisplayName()}</div>
                      <div>{role && role.charAt(0).toUpperCase() + role.slice(1)}</div>
                    </div>
                    <button
                      onClick={() => {
                        signOut();
                        closeMenu();
                      }}
                      className="w-full border border-primary px-4 py-3 rounded-md font-semibold text-primary hover:bg-primary/5 transition-colors"
                    >
                      Logout
                    </button>
                  </div>
                ) : (
                  <div className="space-y-3">
                    <Link 
                      to="/login" 
                      onClick={closeMenu}
                      className="block w-full bg-primary px-4 py-3 rounded-md text-white font-semibold text-center shadow hover:bg-primary/90 transition-colors"
                    >
                      Login
                    </Link>
                    <Link 
                      to="/register" 
                      onClick={closeMenu}
                      className="block w-full border border-primary px-4 py-3 rounded-md font-semibold text-primary text-center hover:bg-primary/5 transition-colors"
                    >
                      Register
                    </Link>
                  </div>
                )}
              </div>
            </div>
          </div>
        </>
      )}
    </nav>
  );
};

export default MobileNavbar;
