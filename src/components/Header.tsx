import React, { useState, useEffect } from 'react';
import { Link, useLocation } from 'react-router-dom';
import { Menu, X, Heart, Clock, ChevronDown, Globe } from 'lucide-react';
import { motion, AnimatePresence } from 'framer-motion';
import { cn } from '../lib/utils';
import { useAuth } from '../context/AuthContext';

const Header: React.FC = () => {
  const [isOpen, setIsOpen] = useState(false);
  const [isScrolled, setIsScrolled] = useState(false);
  const location = useLocation();
  const { isAdmin } = useAuth();

  useEffect(() => {
    const handleScroll = () => {
      setIsScrolled(window.scrollY > 50);
    };
    window.addEventListener('scroll', handleScroll);
    return () => window.removeEventListener('scroll', handleScroll);
  }, []);

  const navLinks = [
    { name: 'Accueil', path: '/' },
    { name: 'Islam', path: '/islam' },
    { name: 'Multimédia', path: '/multimedia' },
    { name: 'À propos', path: '/about' },
    { name: 'Contact', path: '/contact' },
  ];

  return (
    <header
      className={cn(
        'fixed top-0 left-0 right-0 z-50 transition-all duration-300',
        isScrolled ? 'bg-white shadow-md py-2' : 'bg-transparent py-4'
      )}
    >
      <div className="container mx-auto px-4 flex items-center justify-between">
        {/* Logo */}
        <Link to="/" className="flex items-center gap-3">
          <div className="w-12 h-12 bg-islamic-green rounded-full flex items-center justify-center text-white">
            <svg viewBox="0 0 24 24" className="w-8 h-8 fill-current">
              <path d="M12,2L4.5,20.29L5.21,21L12,18L18.79,21L19.5,20.29L12,2Z" />
            </svg>
          </div>
          <div className={cn("hidden sm:block", isScrolled ? "text-soft-black" : "text-white")}>
            <h1 className="font-serif font-bold text-lg leading-tight">MOSQUÉE AT-TAWHEED</h1>
            <p className="text-[10px] tracking-widest uppercase opacity-80">Pétion-Ville, Haïti</p>
          </div>
        </Link>

        {/* Desktop Nav */}
        <nav className="hidden lg:flex items-center gap-8">
          {navLinks.map((link) => (
            <Link
              key={link.path}
              to={link.path}
              className={cn(
                "font-medium transition-colors hover:text-islamic-gold",
                location.pathname === link.path 
                  ? "text-islamic-gold" 
                  : isScrolled ? "text-soft-black" : "text-white"
              )}
            >
              {link.name}
            </Link>
          ))}
          {isAdmin && (
            <Link 
              to="/admin" 
              className={cn(
                "font-medium transition-colors hover:text-islamic-gold",
                isScrolled ? "text-soft-black" : "text-white"
              )}
            >
              Admin
            </Link>
          )}
        </nav>

        {/* Actions */}
        <div className="flex items-center gap-4">
          <div className={cn("hidden md:flex flex-col items-end", isScrolled ? "text-soft-black" : "text-white")}>
            <div className="flex items-center gap-1 text-xs font-medium">
              <Clock className="w-3 h-3" />
              <span>Prochaine prière: Dhuhr à 12:30</span>
            </div>
          </div>
          
          <Link
            to="/donation"
            className="bg-islamic-gold hover:bg-opacity-90 text-white px-6 py-2 rounded-full font-bold flex items-center gap-2 transition-all shadow-lg hover:scale-105"
          >
            <Heart className="w-4 h-4 fill-current" />
            <span className="hidden sm:inline">Faire un Don</span>
          </Link>

          <button
            onClick={() => setIsOpen(!isOpen)}
            className={cn("lg:hidden p-2", isScrolled ? "text-soft-black" : "text-white")}
          >
            {isOpen ? <X className="w-6 h-6" /> : <Menu className="w-6 h-6" />}
          </button>
        </div>
      </div>

      {/* Mobile Nav */}
      <AnimatePresence>
        {isOpen && (
          <motion.div
            initial={{ opacity: 0, height: 0 }}
            animate={{ opacity: 1, height: 'auto' }}
            exit={{ opacity: 0, height: 0 }}
            className="lg:hidden bg-white border-t overflow-hidden"
          >
            <div className="container mx-auto px-4 py-6 flex flex-col gap-4">
              {navLinks.map((link) => (
                <Link
                  key={link.path}
                  to={link.path}
                  onClick={() => setIsOpen(false)}
                  className={cn(
                    "text-lg font-medium py-2 border-b border-gray-100",
                    location.pathname === link.path ? "text-islamic-green" : "text-soft-black"
                  )}
                >
                  {link.name}
                </Link>
              ))}
              {isAdmin && (
                <Link 
                  to="/admin" 
                  onClick={() => setIsOpen(false)}
                  className="text-lg font-medium py-2 border-b border-gray-100 text-soft-black"
                >
                  Admin
                </Link>
              )}
              <Link
                to="/donation"
                onClick={() => setIsOpen(false)}
                className="bg-islamic-green text-white px-6 py-3 rounded-xl font-bold text-center mt-4"
              >
                Faire un Don
              </Link>
            </div>
          </motion.div>
        )}
      </AnimatePresence>
    </header>
  );
};

export default Header;
