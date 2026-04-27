import React, { useState, useEffect } from 'react';
import { Link, useLocation } from 'react-router-dom';
import { Menu, X, Heart, Clock, ChevronDown, Globe } from 'lucide-react';
import { motion, AnimatePresence } from 'framer-motion';
import { cn } from '../lib/utils';

const Header: React.FC = () => {
  const [isOpen, setIsOpen] = useState(false);
  const [isScrolled, setIsScrolled] = useState(false);
  const location = useLocation();

  useEffect(() => {
    const handleScroll = () => {
      setIsScrolled(window.scrollY > 50);
    };
    window.addEventListener('scroll', handleScroll);
    return () => window.removeEventListener('scroll', handleScroll);
  }, []);

  // Close mobile nav on route change
  useEffect(() => {
    setIsOpen(false);
  }, [location.pathname]);

  // Prevent body scroll when mobile nav is open
  useEffect(() => {
    if (isOpen) {
      document.body.style.overflow = 'hidden';
    } else {
      document.body.style.overflow = '';
    }
    return () => { document.body.style.overflow = ''; };
  }, [isOpen]);

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
        isScrolled ? 'bg-white shadow-md py-1' : 'bg-white/95 backdrop-blur-sm py-2'
      )}
    >
      <div className="container mx-auto px-4 flex items-center justify-between">
        {/* Logo */}
        <Link to="/" className="flex items-center gap-2 shrink-0">
          <img
            src="/images/logo.jpg"
            alt="Mosquée At-Tawheed"
            className="w-10 h-10 sm:w-12 sm:h-12 rounded-full object-cover"
          />
          <div className="hidden xs:block">
            <h1 className="font-serif font-bold text-sm sm:text-lg leading-tight text-soft-black">
              MOSQUÉE AT-TAWHEED
            </h1>
            <p className="text-[9px] sm:text-[10px] tracking-widest uppercase text-gray-500">
              Bois-Verna, Haïti
            </p>
          </div>
        </Link>

        {/* Desktop Nav */}
        <nav className="hidden lg:flex items-center gap-6 xl:gap-8">
          {navLinks.map((link) => (
            <Link
              key={link.path}
              to={link.path}
              className={cn(
                "font-medium transition-colors hover:text-islamic-gold text-sm xl:text-base",
                location.pathname === link.path 
                  ? "text-islamic-gold" 
                  : "text-soft-black"
              )}
            >
              {link.name}
            </Link>
          ))}
        </nav>

        {/* Actions */}
        <div className="flex items-center gap-2 sm:gap-4">
          <div className="hidden md:flex flex-col items-end text-soft-black">
            <div className="flex items-center gap-1 text-xs font-medium">
              <Clock className="w-3 h-3" />
              <span>Prochaine prière: Dhuhr</span>
            </div>
          </div>
          
          <Link
            to="/donation"
            className="bg-islamic-gold hover:bg-opacity-90 text-white px-4 sm:px-6 py-2 rounded-full font-bold flex items-center gap-2 transition-all shadow-lg hover:scale-105 text-sm"
          >
            <Heart className="w-4 h-4 fill-current" />
            <span className="hidden sm:inline">Faire un Don</span>
          </Link>

          <button
            onClick={() => setIsOpen(!isOpen)}
            className="lg:hidden p-2 text-soft-black"
            aria-label="Menu"
          >
            {isOpen ? <X className="w-6 h-6" /> : <Menu className="w-6 h-6" />}
          </button>
        </div>
      </div>

      {/* Mobile Nav - Full screen overlay */}
      <AnimatePresence>
        {isOpen && (
          <motion.div
            initial={{ opacity: 0, y: -10 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: -10 }}
            transition={{ duration: 0.2 }}
            className="lg:hidden absolute top-full left-0 right-0 bg-white shadow-xl border-t border-gray-100 overflow-y-auto"
            style={{ maxHeight: 'calc(100vh - 60px)' }}
          >
            <div className="container mx-auto px-6 py-8 flex flex-col gap-2">
              {navLinks.map((link, idx) => (
                <motion.div
                  key={link.path}
                  initial={{ opacity: 0, x: -20 }}
                  animate={{ opacity: 1, x: 0 }}
                  transition={{ delay: idx * 0.05 }}
                >
                  <Link
                    to={link.path}
                    onClick={() => setIsOpen(false)}
                    className={cn(
                      "flex items-center gap-4 text-xl font-medium py-4 border-b border-gray-100 transition-colors",
                      location.pathname === link.path 
                        ? "text-islamic-green" 
                        : "text-soft-black hover:text-islamic-green"
                    )}
                  >
                    {link.name}
                  </Link>
                </motion.div>
              ))}

              <motion.div
                initial={{ opacity: 0, y: 10 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: 0.3 }}
                className="mt-6"
              >
                <Link
                  to="/donation"
                  onClick={() => setIsOpen(false)}
                  className="bg-islamic-green text-white px-6 py-4 rounded-2xl font-bold text-center block text-lg shadow-lg"
                >
                  <Heart className="w-5 h-5 fill-current inline mr-2" />
                  Faire un Don
                </Link>
              </motion.div>

              {/* Prayer times in mobile menu */}
              <div className="mt-8 p-4 bg-gray-50 rounded-2xl">
                <div className="flex items-center gap-2 text-sm font-medium text-gray-600">
                  <Clock className="w-4 h-4 text-islamic-green" />
                  <span>Prochaine prière: Dhuhr à 12:30</span>
                </div>
              </div>
            </div>
          </motion.div>
        )}
      </AnimatePresence>
    </header>
  );
};

export default Header;
