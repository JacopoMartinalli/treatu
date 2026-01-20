import { useState, useEffect } from 'react';
import { Link, useLocation, useNavigate } from 'react-router-dom';
import { motion, AnimatePresence } from 'framer-motion';
import { Menu, X, User, LogOut, Calendar, Settings, Heart } from 'lucide-react';
import { cn } from '../../utils/cn';
import { useAuthStore } from '../../store/authStore';
import { Button } from './Button';
import { Avatar } from './Avatar';
import { NotificationDropdown } from './NotificationDropdown';

// ============================================
// COMPONENT
// ============================================

export function Navbar() {
  const [isMenuOpen, setIsMenuOpen] = useState(false);
  const [isUserMenuOpen, setIsUserMenuOpen] = useState(false);
  const [scrolled, setScrolled] = useState(false);
  const location = useLocation();
  const navigate = useNavigate();
  const { user, isAuthenticated, logout } = useAuthStore();

  const isProfessional = user?.role === 'professional';
  const isLandingPage = location.pathname === '/';

  // Gestione scroll per effetto navbar
  useEffect(() => {
    const handleScroll = () => {
      setScrolled(window.scrollY > 20);
    };
    window.addEventListener('scroll', handleScroll);
    handleScroll(); // Check initial scroll position
    return () => window.removeEventListener('scroll', handleScroll);
  }, []);

  const handleLogout = () => {
    logout();
    navigate('/');
    setIsUserMenuOpen(false);
  };

  return (
    <nav className={cn(
      'sticky top-0 z-30 transition-all duration-300',
      scrolled || !isLandingPage
        ? 'bg-white/95 backdrop-blur-md border-b border-gray-100 shadow-sm'
        : 'bg-transparent'
    )}>
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex justify-between h-16">
          {/* Logo */}
          <div className="flex items-center">
            <Link to="/" className="flex items-center gap-2 group">
              <div className="w-9 h-9 bg-gradient-to-br from-primary-600 to-primary-400 rounded-xl flex items-center justify-center shadow-md group-hover:shadow-lg transition-shadow">
                <span className="text-white font-bold text-sm">TU</span>
              </div>
              <span className="text-xl font-bold text-gray-900">
                Treat<span className="text-primary-600">U</span>
              </span>
            </Link>
          </div>

          {/* Desktop Navigation */}
          <div className="hidden md:flex items-center gap-6">
            {isAuthenticated ? (
              <>
                {isProfessional ? (
                  <>
                    <NavLink to="/pro/dashboard" active={location.pathname === '/pro/dashboard'}>
                      Dashboard
                    </NavLink>
                    <NavLink to="/pro/calendar" active={location.pathname === '/pro/calendar'}>
                      Calendario
                    </NavLink>
                    <NavLink to="/pro/profile" active={location.pathname === '/pro/profile'}>
                      Profilo
                    </NavLink>
                  </>
                ) : (
                  <>
                    <NavLink to="/search" active={location.pathname === '/search'}>
                      Cerca
                    </NavLink>
                    <NavLink to="/bookings" active={location.pathname === '/bookings'}>
                      Prenotazioni
                    </NavLink>
                    <NavLink to="/favorites" active={location.pathname === '/favorites'}>
                      Preferiti
                    </NavLink>
                  </>
                )}

                {/* Notifications */}
                <NotificationDropdown />

                {/* User Menu */}
                <div className="relative">
                  <button
                    onClick={() => setIsUserMenuOpen(!isUserMenuOpen)}
                    className="flex items-center gap-2 p-1 rounded-lg hover:bg-gray-100 transition-colors"
                  >
                    <Avatar
                      src={user?.avatar}
                      name={`${user?.firstName} ${user?.lastName}`}
                      size="sm"
                    />
                  </button>

                  <AnimatePresence>
                    {isUserMenuOpen && (
                      <>
                        <div
                          className="fixed inset-0 z-10"
                          onClick={() => setIsUserMenuOpen(false)}
                        />
                        <motion.div
                          initial={{ opacity: 0, scale: 0.95, y: -10 }}
                          animate={{ opacity: 1, scale: 1, y: 0 }}
                          exit={{ opacity: 0, scale: 0.95, y: -10 }}
                          className="absolute right-0 mt-2 w-56 bg-white rounded-xl shadow-lg border border-gray-100 py-2 z-20"
                        >
                          <div className="px-4 py-2 border-b border-gray-100">
                            <p className="font-medium text-gray-900">
                              {user?.firstName} {user?.lastName}
                            </p>
                            <p className="text-sm text-gray-500">
                              {user?.email}
                            </p>
                          </div>
                          <UserMenuItem
                            icon={<User className="w-4 h-4" />}
                            onClick={() => {
                              navigate(isProfessional ? '/pro/profile' : '/profile');
                              setIsUserMenuOpen(false);
                            }}
                          >
                            Profilo
                          </UserMenuItem>
                          <UserMenuItem
                            icon={<Calendar className="w-4 h-4" />}
                            onClick={() => {
                              navigate(isProfessional ? '/pro/calendar' : '/bookings');
                              setIsUserMenuOpen(false);
                            }}
                          >
                            {isProfessional ? 'Calendario' : 'Prenotazioni'}
                          </UserMenuItem>
                          <UserMenuItem
                            icon={<Settings className="w-4 h-4" />}
                            onClick={() => {
                              navigate('/settings');
                              setIsUserMenuOpen(false);
                            }}
                          >
                            Impostazioni
                          </UserMenuItem>
                          <div className="border-t border-gray-100 mt-2 pt-2">
                            <UserMenuItem
                              icon={<LogOut className="w-4 h-4" />}
                              onClick={handleLogout}
                              danger
                            >
                              Esci
                            </UserMenuItem>
                          </div>
                        </motion.div>
                      </>
                    )}
                  </AnimatePresence>
                </div>
              </>
            ) : (
              <>
                <NavLink to="/search" active={location.pathname === '/search'}>
                  Trova Professionista
                </NavLink>
                <NavLink to="/pro/register" active={location.pathname === '/pro/register'}>
                  Diventa Professionista
                </NavLink>
                <Button
                  variant="outline"
                  size="sm"
                  onClick={() => navigate('/login')}
                >
                  Accedi
                </Button>
                <Button size="sm" onClick={() => navigate('/register')}>
                  Registrati
                </Button>
              </>
            )}
          </div>

          {/* Mobile menu button */}
          <div className="md:hidden flex items-center">
            <button
              onClick={() => setIsMenuOpen(!isMenuOpen)}
              className="p-2 rounded-lg text-gray-600 hover:bg-gray-100"
            >
              {isMenuOpen ? <X className="w-6 h-6" /> : <Menu className="w-6 h-6" />}
            </button>
          </div>
        </div>
      </div>

      {/* Mobile menu */}
      <AnimatePresence>
        {isMenuOpen && (
          <motion.div
            initial={{ opacity: 0, height: 0 }}
            animate={{ opacity: 1, height: 'auto' }}
            exit={{ opacity: 0, height: 0 }}
            className="md:hidden bg-white border-t border-gray-100"
          >
            <div className="px-4 py-4 space-y-2">
              {isAuthenticated ? (
                <>
                  <div className="flex items-center gap-3 p-3 bg-gray-50 rounded-lg mb-4">
                    <Avatar
                      src={user?.avatar}
                      name={`${user?.firstName} ${user?.lastName}`}
                      size="md"
                    />
                    <div>
                      <p className="font-medium text-gray-900">
                        {user?.firstName} {user?.lastName}
                      </p>
                      <p className="text-sm text-gray-500">{user?.email}</p>
                    </div>
                  </div>
                  {isProfessional ? (
                    <>
                      <MobileNavLink to="/pro/dashboard" onClick={() => setIsMenuOpen(false)}>
                        Dashboard
                      </MobileNavLink>
                      <MobileNavLink to="/pro/calendar" onClick={() => setIsMenuOpen(false)}>
                        Calendario
                      </MobileNavLink>
                      <MobileNavLink to="/pro/profile" onClick={() => setIsMenuOpen(false)}>
                        Profilo
                      </MobileNavLink>
                    </>
                  ) : (
                    <>
                      <MobileNavLink to="/search" onClick={() => setIsMenuOpen(false)}>
                        Cerca Professionista
                      </MobileNavLink>
                      <MobileNavLink to="/bookings" onClick={() => setIsMenuOpen(false)}>
                        Le mie Prenotazioni
                      </MobileNavLink>
                      <MobileNavLink to="/favorites" onClick={() => setIsMenuOpen(false)}>
                        I miei Preferiti
                      </MobileNavLink>
                    </>
                  )}
                  <button
                    onClick={handleLogout}
                    className="w-full text-left px-4 py-3 text-red-600 hover:bg-red-50 rounded-lg transition-colors"
                  >
                    Esci
                  </button>
                </>
              ) : (
                <>
                  <MobileNavLink to="/search" onClick={() => setIsMenuOpen(false)}>
                    Trova Professionista
                  </MobileNavLink>
                  <MobileNavLink to="/pro/register" onClick={() => setIsMenuOpen(false)}>
                    Diventa Professionista
                  </MobileNavLink>
                  <div className="pt-4 space-y-2">
                    <Button
                      variant="outline"
                      className="w-full"
                      onClick={() => {
                        navigate('/login');
                        setIsMenuOpen(false);
                      }}
                    >
                      Accedi
                    </Button>
                    <Button
                      className="w-full"
                      onClick={() => {
                        navigate('/register');
                        setIsMenuOpen(false);
                      }}
                    >
                      Registrati
                    </Button>
                  </div>
                </>
              )}
            </div>
          </motion.div>
        )}
      </AnimatePresence>
    </nav>
  );
}

// ============================================
// HELPER COMPONENTS
// ============================================

function NavLink({
  to,
  active,
  children,
}: {
  to: string;
  active: boolean;
  children: React.ReactNode;
}) {
  return (
    <Link
      to={to}
      className={cn(
        'text-sm font-medium transition-colors',
        active ? 'text-primary-600' : 'text-gray-600 hover:text-gray-900'
      )}
    >
      {children}
    </Link>
  );
}

function MobileNavLink({
  to,
  onClick,
  children,
}: {
  to: string;
  onClick: () => void;
  children: React.ReactNode;
}) {
  return (
    <Link
      to={to}
      onClick={onClick}
      className="block px-4 py-3 text-gray-700 hover:bg-gray-50 rounded-lg transition-colors"
    >
      {children}
    </Link>
  );
}

function UserMenuItem({
  icon,
  onClick,
  danger,
  children,
}: {
  icon: React.ReactNode;
  onClick: () => void;
  danger?: boolean;
  children: React.ReactNode;
}) {
  return (
    <button
      onClick={onClick}
      className={cn(
        'w-full flex items-center gap-3 px-4 py-2 text-sm transition-colors',
        danger
          ? 'text-red-600 hover:bg-red-50'
          : 'text-gray-700 hover:bg-gray-50'
      )}
    >
      {icon}
      {children}
    </button>
  );
}
