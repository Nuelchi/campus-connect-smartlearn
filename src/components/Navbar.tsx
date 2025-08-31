
import { Book, Menu, X } from "lucide-react";
import { Link, useLocation } from "react-router-dom";
import { useAuth } from "@/hooks/useAuth";
import { useState } from "react";

const Navbar = () => {
  const location = useLocation();
  const { user, signOut, role, profile } = useAuth();
  const [isMobileMenuOpen, setIsMobileMenuOpen] = useState(false);

  const getDisplayName = () => {
    if (profile?.username) {
      return profile.username;
    }
    return user?.email?.split('@')[0] || "User";
  };

  const toggleMobileMenu = () => {
    setIsMobileMenuOpen(!isMobileMenuOpen);
  };

  const closeMobileMenu = () => {
    setIsMobileMenuOpen(false);
  };

  return (
    <nav className="flex items-center justify-between px-4 sm:px-8 py-4 shadow bg-background/80 sticky top-0 z-30 gap-4">
      {/* Logo */}
      <div className="flex items-center gap-2">
        <Book size={24} className="text-primary sm:hidden" />
        <Book size={30} className="text-primary hidden sm:block" />
        <span className="font-extrabold text-xl sm:text-2xl tracking-tight text-primary">SmartLearn</span>
      </div>

      {/* Desktop Navigation */}
      <div className="hidden md:flex gap-6 items-center text-[15px]">
        <Link to="/" className={`transition-colors font-medium hover:text-primary/80 ${location.pathname === "/" ? "text-primary" : "text-foreground"}`}>
          Home
        </Link>
        <a href="#features" className="transition-colors hover:text-primary/70">Features</a>
        <Link to="/faq" className={`transition-colors font-medium hover:text-primary/80 ${location.pathname === "/faq" ? "text-primary" : "text-foreground"}`}>
          FAQ
        </Link>
        <a href="#contact" className="transition-colors hover:text-primary/70">Contact</a>
        {user && (
          <Link to="/dashboard" className={`transition-colors font-medium hover:text-primary/80 ${location.pathname.startsWith("/dashboard") ? "text-primary" : "text-foreground"}`}>
            Dashboard
          </Link>
        )}
      </div>

      {/* Desktop Auth Buttons */}
      <div className="hidden md:flex gap-4 items-center">
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
        onClick={toggleMobileMenu}
        className="md:hidden p-2 rounded-md hover:bg-gray-100 transition-colors"
        aria-label="Toggle mobile menu"
      >
        {isMobileMenuOpen ? <X size={24} /> : <Menu size={24} />}
      </button>

      {/* Mobile Menu Overlay */}
      {isMobileMenuOpen && (
        <div className="fixed inset-0 bg-black/50 z-40 md:hidden" onClick={closeMobileMenu} />
      )}

      {/* Mobile Menu */}
      <div className={`fixed top-0 right-0 h-full w-80 bg-white shadow-2xl transform transition-transform duration-300 ease-in-out z-50 md:hidden ${
        isMobileMenuOpen ? 'translate-x-0' : 'translate-x-full'
      }`}>
        <div className="p-6">
          {/* Mobile Menu Header */}
          <div className="flex items-center justify-between mb-8">
            <div className="flex items-center gap-2">
              <Book size={24} className="text-primary" />
              <span className="font-extrabold text-xl tracking-tight text-primary">SmartLearn</span>
            </div>
            <button
              onClick={closeMobileMenu}
              className="p-2 rounded-md hover:bg-gray-100 transition-colors"
            >
              <X size={24} />
            </button>
          </div>

          {/* Mobile Navigation Links */}
          <div className="space-y-4 mb-8">
            <Link 
              to="/" 
              onClick={closeMobileMenu}
              className={`block py-3 px-4 rounded-lg transition-colors font-medium ${
                location.pathname === "/" ? "bg-primary/10 text-primary" : "hover:bg-gray-100"
              }`}
            >
              Home
            </Link>
            <a 
              href="#features" 
              onClick={closeMobileMenu}
              className="block py-3 px-4 rounded-lg transition-colors hover:bg-gray-100"
            >
              Features
            </a>
            <Link 
              to="/faq" 
              onClick={closeMobileMenu}
              className={`block py-3 px-4 rounded-lg transition-colors font-medium ${
                location.pathname === "/faq" ? "bg-primary/10 text-primary" : "hover:bg-gray-100"
              }`}
            >
              FAQ
            </Link>
            <a 
              href="#contact" 
              onClick={closeMobileMenu}
              className="block py-3 px-4 rounded-lg transition-colors hover:bg-gray-100"
            >
              Contact
            </a>
            {user && (
              <Link 
                to="/dashboard" 
                onClick={closeMobileMenu}
                className={`block py-3 px-4 rounded-lg transition-colors font-medium ${
                  location.pathname.startsWith("/dashboard") ? "bg-primary/10 text-primary" : "hover:bg-gray-100"
                }`}
              >
                Dashboard
              </Link>
            )}
          </div>

          {/* Mobile Auth Section */}
          <div className="border-t pt-6">
            {user ? (
              <div className="space-y-4">
                <div className="px-4 py-3 bg-gray-50 rounded-lg">
                  <div className="font-medium text-sm">{getDisplayName()}</div>
                  <div className="text-xs text-muted-foreground">
                    {role && role.charAt(0).toUpperCase() + role.slice(1)}
                  </div>
                </div>
                <button
                  onClick={() => {
                    signOut();
                    closeMobileMenu();
                  }}
                  className="w-full border border-primary px-4 py-3 rounded-lg font-semibold text-primary hover:bg-primary/5 transition-colors"
                >
                  Logout
                </button>
              </div>
            ) : (
              <div className="space-y-3">
                <Link 
                  to="/login" 
                  onClick={closeMobileMenu}
                  className="block w-full bg-primary px-4 py-3 rounded-lg text-white font-semibold text-center shadow hover:bg-primary/90 transition-colors"
                >
                  Login
                </Link>
                <Link 
                  to="/register" 
                  onClick={closeMobileMenu}
                  className="block w-full border border-primary px-4 py-3 rounded-lg font-semibold text-primary text-center hover:bg-primary/5 transition-colors"
                >
                  Register
                </Link>
              </div>
            )}
          </div>
        </div>
      </div>
    </nav>
  );
};

export default Navbar;
