import { useState } from "react";
import { Link, NavLink, useNavigate } from "react-router-dom";
import { useAuth } from "../contexts/AuthContext";
import { useTheme } from "../contexts/ThemeContext";
import { toast } from "react-toastify";
import { motion, AnimatePresence } from "framer-motion";
import { Sun, Moon, LogOut, PenSquare, User, Menu, X, Search, Bookmark } from "lucide-react";

const Header = () => {
  const { user, logout, loading } = useAuth();
  const { theme, toggleTheme } = useTheme();
  const navigate = useNavigate();
  const [isMobileMenuOpen, setIsMobileMenuOpen] = useState(false);

  const handleLogout = async () => {
    try {
      await logout();
      toast.success("Logged out successfully!");
      navigate("/");
      setIsMobileMenuOpen(false);
    } catch {
      toast.error("Logout failed");
    }
  };

  const closeMobileMenu = () => setIsMobileMenuOpen(false);

  const navLinkClass = ({ isActive }: { isActive: boolean }) =>
    `text-sm font-medium transition-colors hover:text-primary ${
      isActive ? "text-primary" : "text-muted-foreground"
    }`;

  return (
    <motion.header
      initial={{ y: -20, opacity: 0 }}
      animate={{ y: 0, opacity: 1 }}
      transition={{ duration: 0.4 }}
      className="sticky top-0 z-50 border-b border-border bg-background/80 backdrop-blur-lg"
    >
      <div className="container mx-auto flex items-center justify-between px-4 py-3">
        <Link to="/" onClick={closeMobileMenu} className="flex items-center gap-2 group">
          <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round" className="h-6 w-6 text-primary transition-transform group-hover:rotate-[-8deg]"><path d="M20.24 12.24a6 6 0 0 0-8.49-8.49L5 10.5V19h8.5z"/><line x1="16" y1="8" x2="2" y2="22"/><line x1="17.5" y1="15" x2="9" y2="15"/></svg>
          <span className="text-2xl font-bold text-foreground" style={{ fontFamily: "'DM Serif Display', serif" }}>Inkwell</span>
        </Link>

        {/* Desktop Navigation */}
        <nav className="hidden md:flex items-center gap-6">
          <div className="flex items-center gap-4 mr-2">
            <NavLink to="/" end className={navLinkClass}>Home</NavLink>
            <NavLink to="/about" className={navLinkClass}>About</NavLink>
            <NavLink to="/contact" className={navLinkClass}>Contact</NavLink>
          </div>

          <div className="flex items-center gap-2">
            <Link
              to="/search"
              className="rounded-lg p-2 text-muted-foreground transition-colors hover:bg-secondary hover:text-foreground"
              aria-label="Search stories"
              title="Search"
            >
              <Search className="h-5 w-5" />
            </Link>

            <Link
              to="/bookmarks"
              className="rounded-lg p-2 text-muted-foreground transition-colors hover:bg-secondary hover:text-foreground"
              aria-label="Reading list"
              title="Reading List"
            >
              <Bookmark className="h-5 w-5" />
            </Link>

            <button
              onClick={toggleTheme}
              className="rounded-lg p-2 text-muted-foreground transition-colors hover:bg-secondary hover:text-foreground"
              aria-label="Toggle theme"
            >
              {theme === "light" ? <Moon className="h-5 w-5" /> : <Sun className="h-5 w-5" />}
            </button>

            {loading ? (
              <div className="h-8 w-20 rounded-md skeleton-shimmer" />
            ) : user ? (
              <>
                <Link
                  to="/create"
                  className="flex items-center gap-1.5 rounded-lg bg-primary px-4 py-2 text-sm font-medium text-primary-foreground transition-all hover:opacity-90 active:scale-95"
                >
                  <PenSquare className="h-4 w-4" />
                  Write
                </Link>
                <div className="flex items-center gap-1.5 rounded-lg bg-secondary px-3 py-2 text-sm text-secondary-foreground">
                  <User className="h-4 w-4" />
                  <span>{user.name}</span>
                </div>
                <button
                  onClick={handleLogout}
                  className="rounded-lg p-2 text-muted-foreground transition-colors hover:bg-destructive/10 hover:text-destructive"
                  aria-label="Logout"
                >
                  <LogOut className="h-5 w-5" />
                </button>
              </>
            ) : (
              <>
                <Link
                  to="/login"
                  className="rounded-lg px-4 py-2 text-sm font-medium text-foreground transition-colors hover:bg-secondary"
                >
                  Sign In
                </Link>
                <Link
                  to="/signup"
                  className="rounded-lg bg-primary px-4 py-2 text-sm font-medium text-primary-foreground transition-all hover:opacity-90 active:scale-95"
                >
                  Sign Up
                </Link>
              </>
            )}
          </div>
        </nav>

        {/* Mobile Menu Toggle */}
        <div className="flex items-center gap-2 md:hidden">
          <Link
            to="/search"
            onClick={closeMobileMenu}
            className="rounded-lg p-2 text-muted-foreground transition-colors hover:bg-secondary hover:text-foreground"
          >
            <Search className="h-5 w-5" />
          </Link>
          <button
            onClick={toggleTheme}
            className="rounded-lg p-2 text-muted-foreground transition-colors hover:bg-secondary hover:text-foreground"
            aria-label="Toggle theme"
          >
            {theme === "light" ? <Moon className="h-5 w-5" /> : <Sun className="h-5 w-5" />}
          </button>
          <button
            onClick={() => setIsMobileMenuOpen(!isMobileMenuOpen)}
            className="p-2 text-foreground"
          >
            {isMobileMenuOpen ? <X className="h-6 w-6" /> : <Menu className="h-6 w-6" />}
          </button>
        </div>
      </div>

      {/* Mobile Navigation */}
      <AnimatePresence>
        {isMobileMenuOpen && (
          <motion.div
            initial={{ opacity: 0, height: 0 }}
            animate={{ opacity: 1, height: "auto" }}
            exit={{ opacity: 0, height: 0 }}
            className="md:hidden border-t border-border overflow-hidden bg-background"
          >
            <div className="flex flex-col p-4 gap-4">
              <NavLink to="/" end onClick={closeMobileMenu} className={navLinkClass}>Home</NavLink>
              <NavLink to="/about" onClick={closeMobileMenu} className={navLinkClass}>About</NavLink>
              <NavLink to="/contact" onClick={closeMobileMenu} className={navLinkClass}>Contact</NavLink>
              <NavLink to="/bookmarks" onClick={closeMobileMenu} className={navLinkClass}>Reading List</NavLink>

              <div className="h-px bg-border w-full my-2" />

              {loading ? (
                <div className="h-8 w-20 rounded-md skeleton-shimmer" />
              ) : user ? (
                <>
                  <div className="flex items-center gap-2 text-sm text-muted-foreground px-2 py-1">
                    <User className="h-4 w-4" />
                    <span>{user.name}</span>
                  </div>
                  <Link
                    to="/create"
                    onClick={closeMobileMenu}
                    className="flex items-center justify-center gap-1.5 rounded-lg bg-primary px-4 py-2 text-sm font-medium text-primary-foreground"
                  >
                    <PenSquare className="h-4 w-4" />
                    Write a Story
                  </Link>
                  <button
                    onClick={handleLogout}
                    className="flex items-center justify-center gap-1.5 rounded-lg bg-secondary px-4 py-2 text-sm font-medium text-secondary-foreground"
                  >
                    <LogOut className="h-4 w-4" />
                    Logout
                  </button>
                </>
              ) : (
                <div className="flex flex-col gap-2">
                  <Link
                    to="/login"
                    onClick={closeMobileMenu}
                    className="flex justify-center rounded-lg bg-secondary px-4 py-2 text-sm font-medium text-secondary-foreground"
                  >
                    Sign In
                  </Link>
                  <Link
                    to="/signup"
                    onClick={closeMobileMenu}
                    className="flex justify-center rounded-lg bg-primary px-4 py-2 text-sm font-medium text-primary-foreground"
                  >
                    Sign Up
                  </Link>
                </div>
              )}
            </div>
          </motion.div>
        )}
      </AnimatePresence>
    </motion.header>
  );
};

export default Header;
