import { useState, useEffect } from 'react';
import { Link } from 'react-scroll';
import { Link as RouterLink, useNavigate } from 'react-router-dom';
import { motion, AnimatePresence } from 'framer-motion';
import { HiMenu, HiX } from 'react-icons/hi';
import { FiUser, FiLogOut } from 'react-icons/fi';
import { useAuth } from '../context/AuthContext';
import logo from '../images/logo.webp';

const NAV_LINKS = [
  { label: 'About', to: 'about' },
  { label: 'Services', to: 'services' },
  { label: 'FAQ', to: 'faq' },
  { label: 'Contact', to: 'contact' },
];

function Navbar() {
  const { user, signOut } = useAuth();
  const navigate = useNavigate();
  const [scrolled, setScrolled] = useState(false);
  const [menuOpen, setMenuOpen] = useState(false);

  useEffect(() => {
    const handleScroll = () => setScrolled(window.scrollY >= 80);
    window.addEventListener('scroll', handleScroll, { passive: true });
    return () => window.removeEventListener('scroll', handleScroll);
  }, []);

  const closeMenu = () => setMenuOpen(false);

  async function handleSignOut() {
    await signOut();
    navigate('/');
  }

  return (
    <header
      className={`fixed top-0 left-0 right-0 z-50 transition-all duration-300 ${
        scrolled ? 'bg-navy shadow-lg' : 'bg-transparent'
      }`}
    >
      <nav
        className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 flex items-center justify-between h-16"
        aria-label="Main navigation"
      >
        {/* Logo */}
        <RouterLink to="/" className="flex items-center gap-2">
          <img src={logo} alt="Uthan Senior Care" className="h-10 w-auto object-contain" />
        </RouterLink>

        {/* Desktop nav */}
        <ul className="hidden md:flex items-center gap-6" role="list">
          {NAV_LINKS.map(({ label, to }) => (
            <li key={to}>
              <Link
                to={to}
                smooth offset={-80} duration={500}
                className="font-sans text-sm text-white/90 hover:text-gold transition-colors duration-200 cursor-pointer focus:outline-none focus-visible:ring-2 focus-visible:ring-gold rounded"
                tabIndex={0}
              >
                {label}
              </Link>
            </li>
          ))}
          {user && (
            <li>
              <RouterLink
                to="/checkin"
                className="font-sans text-sm text-white/90 hover:text-gold transition-colors duration-200"
              >
                Check In
              </RouterLink>
            </li>
          )}
          {user?.role === 'admin' && (
            <li>
              <RouterLink
                to="/admin"
                className="font-sans text-sm text-white/90 hover:text-gold transition-colors duration-200"
              >
                Admin
              </RouterLink>
            </li>
          )}
          <li>
            {user ? (
              <button
                onClick={handleSignOut}
                className="flex items-center gap-1.5 font-sans text-sm text-white/90 hover:text-gold transition-colors duration-200 focus:outline-none focus-visible:ring-2 focus-visible:ring-gold rounded"
              >
                <FiLogOut size={15} />
                Sign Out
              </button>
            ) : (
              <RouterLink
                to="/signin"
                className="flex items-center gap-1.5 font-sans text-sm text-white/90 hover:text-gold transition-colors duration-200 focus:outline-none focus-visible:ring-2 focus-visible:ring-gold rounded"
              >
                <FiUser size={15} />
                Sign In
              </RouterLink>
            )}
          </li>
          <li>
            <Link
              to="contact"
              smooth offset={-80} duration={500}
              className="cursor-pointer inline-block px-5 py-2 bg-gold text-white font-sans text-sm font-semibold rounded-full hover:bg-green-dark transition-colors duration-200 focus:outline-none focus-visible:ring-2 focus-visible:ring-white"
              tabIndex={0}
            >
              Get Started
            </Link>
          </li>
        </ul>

        {/* Hamburger */}
        <button
          className="md:hidden text-white p-2 rounded focus:outline-none focus-visible:ring-2 focus-visible:ring-gold"
          onClick={() => setMenuOpen((prev) => !prev)}
          aria-label={menuOpen ? 'Close menu' : 'Open menu'}
          aria-expanded={menuOpen}
          aria-controls="mobile-menu"
        >
          {menuOpen ? <HiX size={24} /> : <HiMenu size={24} />}
        </button>
      </nav>

      {/* Mobile menu */}
      <AnimatePresence>
        {menuOpen && (
          <motion.div
            id="mobile-menu"
            key="mobile-menu"
            initial={{ opacity: 0, y: -8 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: -8 }}
            transition={{ duration: 0.2 }}
            className="md:hidden bg-navy border-t border-white/10"
          >
            <ul className="flex flex-col px-4 py-4 gap-4" role="list">
              {NAV_LINKS.map(({ label, to }) => (
                <li key={to}>
                  <Link
                    to={to} smooth offset={-80} duration={500} onClick={closeMenu}
                    className="block font-sans text-base text-white/90 hover:text-gold transition-colors duration-200 cursor-pointer focus:outline-none focus-visible:ring-2 focus-visible:ring-gold rounded py-1"
                    tabIndex={0}
                  >
                    {label}
                  </Link>
                </li>
              ))}
              {user && (
                <li>
                  <RouterLink
                    to="/checkin"
                    onClick={closeMenu}
                    className="block font-sans text-base text-white/90 hover:text-gold transition-colors duration-200 py-1"
                  >
                    Check In
                  </RouterLink>
                </li>
              )}
              {user?.role === 'admin' && (
                <li>
                  <RouterLink
                    to="/admin"
                    onClick={closeMenu}
                    className="block font-sans text-base text-white/90 hover:text-gold transition-colors duration-200 py-1"
                  >
                    Admin
                  </RouterLink>
                </li>
              )}
              <li>
                {user ? (
                  <button
                    onClick={() => {
                      handleSignOut();
                      closeMenu();
                    }}
                    className="w-full text-left font-sans text-base text-white/90 hover:text-gold transition-colors duration-200 py-1"
                  >
                    Sign Out
                  </button>
                ) : (
                  <RouterLink
                    to="/signin"
                    onClick={closeMenu}
                    className="block font-sans text-base text-white/90 hover:text-gold transition-colors duration-200 py-1"
                  >
                    Sign In
                  </RouterLink>
                )}
              </li>
              <li>
                <Link
                  to="contact" smooth offset={-80} duration={500} onClick={closeMenu}
                  className="cursor-pointer inline-block w-full text-center px-5 py-2 bg-gold text-white font-sans text-sm font-semibold rounded-full hover:bg-green-dark transition-colors duration-200"
                  tabIndex={0}
                >
                  Get Started
                </Link>
              </li>
            </ul>
          </motion.div>
        )}
      </AnimatePresence>
    </header>
  );
}

export default Navbar;
