import { useState, useEffect } from 'react';
import { Link, useLocation, useNavigate } from 'react-router-dom';
import { motion, AnimatePresence } from 'framer-motion';
import {
  Menu,
  X,
  User,
  LogOut,
  Calendar,
  Settings,
  Heart,
  Search,
  Briefcase,
  LayoutDashboard,
  MessageCircle,
} from 'lucide-react';
import { cn } from '../../utils/cn';
import { useAuthStore } from '../../store/authStore';
import { Button } from './Button';
import { Avatar } from './Avatar';
import { NotificationDropdown } from './NotificationDropdown';

import { getUserDisplay } from '../../utils/userDisplay';

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
  const ud = getUserDisplay(user as Record<string, unknown> | null);

  // Gestione scroll per effetto navbar
  useEffect(() => {
    const handleScroll = () => {
      setScrolled(window.scrollY > 20);
    };
    window.addEventListener('scroll', handleScroll);
    handleScroll();
    return () => window.removeEventListener('scroll', handleScroll);
  }, []);

  const handleLogout = () => {
    logout();
    navigate('/');
    setIsUserMenuOpen(false);
  };

  // Colori basati sul ruolo
  const roleColors = isProfessional
    ? {
        bg: 'bg-primary-600',
        bgLight: 'bg-primary-50',
        border: 'border-primary-200',
        text: 'text-primary-700',
        textLight: 'text-primary-600',
      }
    : {
        bg: 'bg-secondary-600',
        bgLight: 'bg-secondary-50',
        border: 'border-secondary-200',
        text: 'text-secondary-700',
        textLight: 'text-secondary-600',
      };

  return (
    <nav
      className={cn(
        'sticky top-0 z-30 transition-all duration-300',
        isAuthenticated && !isLandingPage
          ? isProfessional
            ? 'bg-primary-600 shadow-md'
            : 'bg-secondary-600 shadow-md'
          : scrolled || !isLandingPage
          ? 'bg-white/95 backdrop-blur-md border-b border-gray-100 shadow-sm'
          : 'bg-transparent'
      )}
    >
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex justify-between h-16">
          {/* Logo */}
          <div className="flex items-center gap-4">
            <Link
              to={isAuthenticated ? (isProfessional ? '/pro/dashboard' : '/dashboard') : '/'}
              className="flex items-center gap-2 group"
            >
              <div
                className={cn(
                  'w-9 h-9 rounded-xl flex items-center justify-center shadow-md group-hover:shadow-lg transition-shadow',
                  isAuthenticated && !isLandingPage
                    ? 'bg-white/20'
                    : isAuthenticated
                    ? isProfessional
                      ? 'bg-gradient-to-br from-primary-600 to-primary-400'
                      : 'bg-gradient-to-br from-secondary-600 to-secondary-400'
                    : 'bg-gradient-to-br from-primary-600 to-primary-400'
                )}
              >
                <span
                  className={cn(
                    'font-bold text-sm',
                    isAuthenticated && !isLandingPage ? 'text-white' : 'text-white'
                  )}
                >
                  TU
                </span>
              </div>
              <span
                className={cn(
                  'text-xl font-bold',
                  isAuthenticated && !isLandingPage ? 'text-white' : 'text-gray-900'
                )}
              >
                Treat
                <span
                  className={cn(
                    isAuthenticated && !isLandingPage
                      ? 'text-white/80'
                      : isAuthenticated
                      ? isProfessional
                        ? 'text-primary-600'
                        : 'text-secondary-600'
                      : 'text-primary-600'
                  )}
                >
                  U
                </span>
              </span>
            </Link>

            {/* Role Indicator - Big and Clear */}
            {isAuthenticated && !isLandingPage && (
              <div className="hidden sm:flex items-center">
                <div className="h-6 w-px bg-white/30 mr-4" />
                <div className="flex items-center gap-2 text-white">
                  {isProfessional ? (
                    <>
                      <Briefcase className="w-5 h-5" />
                      <span className="font-semibold">Area Professionista</span>
                    </>
                  ) : (
                    <>
                      <User className="w-5 h-5" />
                      <span className="font-semibold">Area Cliente</span>
                    </>
                  )}
                </div>
              </div>
            )}
          </div>

          {/* Desktop Navigation */}
          <div className="hidden md:flex items-center gap-2">
            {isAuthenticated ? (
              <>
                {isProfessional ? (
                  /* === PROFESSIONAL NAVIGATION === */
                  <>
                    <NavLink
                      to="/pro/dashboard"
                      active={location.pathname === '/pro/dashboard'}
                      isColored={!isLandingPage}
                    >
                      Dashboard
                    </NavLink>
                    <NavLink
                      to="/pro/calendar"
                      active={location.pathname === '/pro/calendar'}
                      isColored={!isLandingPage}
                    >
                      Calendario
                    </NavLink>
                    <NavLink
                      to="/pro/profile"
                      active={location.pathname === '/pro/profile'}
                      isColored={!isLandingPage}
                    >
                      Profilo
                    </NavLink>
                    <NavLink
                      to="/chat"
                      active={location.pathname.startsWith('/chat')}
                      isColored={!isLandingPage}
                    >
                      Messaggi
                    </NavLink>
                  </>
                ) : (
                  /* === CLIENT NAVIGATION (semplificato) === */
                  <>
                    <NavLink
                      to="/dashboard"
                      active={location.pathname === '/dashboard'}
                      isColored={!isLandingPage}
                    >
                      Home
                    </NavLink>
                    <NavLink
                      to="/bookings"
                      active={location.pathname.startsWith('/bookings')}
                      isColored={!isLandingPage}
                    >
                      Prenotazioni
                    </NavLink>
                    <NavLink
                      to="/chat"
                      active={location.pathname.startsWith('/chat')}
                      isColored={!isLandingPage}
                    >
                      Messaggi
                    </NavLink>
                  </>
                )}

                <div
                  className={cn(
                    'w-px h-6 mx-2',
                    isLandingPage ? 'bg-gray-200' : 'bg-white/30'
                  )}
                />

                {/* Notifications */}
                <NotificationDropdown />

                {/* User Menu */}
                <div className="relative">
                  <button
                    onClick={() => setIsUserMenuOpen(!isUserMenuOpen)}
                    className={cn(
                      'flex items-center gap-2 p-1.5 rounded-xl transition-colors',
                      isLandingPage
                        ? isProfessional
                          ? 'hover:bg-primary-50'
                          : 'hover:bg-secondary-50'
                        : 'hover:bg-white/10'
                    )}
                  >
                    <Avatar
                      src={ud.avatar}
                      name={`${ud.firstName} ${ud.lastName}`}
                      size="sm"
                    />
                    <span
                      className={cn(
                        'font-medium text-sm hidden lg:block',
                        isLandingPage ? 'text-gray-700' : 'text-white'
                      )}
                    >
                      {ud.firstName}
                    </span>
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
                          className="absolute right-0 mt-2 w-64 bg-white rounded-xl shadow-lg border border-gray-100 py-2 z-20"
                        >
                          {/* User Info Header */}
                          <div
                            className={cn('px-4 py-3 mx-2 rounded-lg mb-2', roleColors.bgLight)}
                          >
                            <div className="flex items-center gap-3">
                              <Avatar
                                src={ud.avatar}
                                name={`${ud.firstName} ${ud.lastName}`}
                                size="md"
                              />
                              <div className="flex-1 min-w-0">
                                <p className="font-medium text-gray-900 truncate">
                                  {ud.firstName} {ud.lastName}
                                </p>
                                <p className="text-xs text-gray-500 truncate">{user?.email}</p>
                              </div>
                            </div>
                            <div
                              className={cn(
                                'mt-2 inline-flex items-center gap-1.5 px-2.5 py-1 rounded-full text-xs font-semibold',
                                roleColors.bg,
                                'text-white'
                              )}
                            >
                              {isProfessional ? (
                                <>
                                  <Briefcase className="w-3 h-3" />
                                  Professionista
                                </>
                              ) : (
                                <>
                                  <User className="w-3 h-3" />
                                  Cliente
                                </>
                              )}
                            </div>
                          </div>

                          <UserMenuItem
                            icon={<User className="w-4 h-4" />}
                            onClick={() => {
                              navigate(isProfessional ? '/pro/profile' : '/profile');
                              setIsUserMenuOpen(false);
                            }}
                          >
                            Il mio profilo
                          </UserMenuItem>
                          {!isProfessional && (
                            <>
                              <UserMenuItem
                                icon={<Search className="w-4 h-4" />}
                                onClick={() => {
                                  navigate('/search');
                                  setIsUserMenuOpen(false);
                                }}
                              >
                                Cerca professionisti
                              </UserMenuItem>
                              <UserMenuItem
                                icon={<Heart className="w-4 h-4" />}
                                onClick={() => {
                                  navigate('/favorites');
                                  setIsUserMenuOpen(false);
                                }}
                              >
                                I miei preferiti
                              </UserMenuItem>
                            </>
                          )}
                          <UserMenuItem
                            icon={<Calendar className="w-4 h-4" />}
                            onClick={() => {
                              navigate(isProfessional ? '/pro/calendar' : '/bookings');
                              setIsUserMenuOpen(false);
                            }}
                          >
                            {isProfessional ? 'Calendario' : 'Le mie prenotazioni'}
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
              /* === VISITOR NAVIGATION === */
              <>
                <NavLink to="/search" active={location.pathname === '/search'}>
                  Prenota un trattamento
                </NavLink>
                <NavLink to="/pro/register" active={location.pathname === '/pro/register'}>
                  Lavora con noi
                </NavLink>

                <div className="w-px h-6 bg-gray-200 mx-3" />

                <Button
                  variant="outline"
                  size="sm"
                  onClick={() => navigate('/login')}
                  className="border-gray-300"
                >
                  Accedi
                </Button>
                <Button
                  size="sm"
                  onClick={() => navigate('/register')}
                  className="bg-primary-600 hover:bg-primary-700"
                >
                  Registrati
                </Button>
              </>
            )}
          </div>

          {/* Mobile menu button */}
          <div className="md:hidden flex items-center gap-2">
            {isAuthenticated && <NotificationDropdown />}
            <button
              onClick={() => setIsMenuOpen(!isMenuOpen)}
              className={cn(
                'p-2 rounded-lg',
                isAuthenticated && !isLandingPage
                  ? 'text-white hover:bg-white/10'
                  : 'text-gray-600 hover:bg-gray-100'
              )}
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
            className={cn(
              'md:hidden border-t',
              isAuthenticated && !isLandingPage
                ? isProfessional
                  ? 'bg-primary-700 border-primary-500'
                  : 'bg-secondary-700 border-secondary-500'
                : 'bg-white border-gray-100'
            )}
          >
            <div className="px-4 py-4 space-y-2">
              {isAuthenticated ? (
                <>
                  {/* User Card with Role */}
                  <div
                    className={cn(
                      'flex items-center gap-3 p-4 rounded-xl mb-4',
                      isLandingPage ? roleColors.bgLight : 'bg-white/10'
                    )}
                  >
                    <Avatar
                      src={ud.avatar}
                      name={`${ud.firstName} ${ud.lastName}`}
                      size="lg"
                    />
                    <div className="flex-1">
                      <p
                        className={cn(
                          'font-semibold',
                          isLandingPage ? 'text-gray-900' : 'text-white'
                        )}
                      >
                        {ud.firstName} {ud.lastName}
                      </p>
                      <div
                        className={cn(
                          'mt-1 inline-flex items-center gap-1.5 px-2.5 py-1 rounded-full text-xs font-semibold',
                          isLandingPage ? roleColors.bg : 'bg-white/20',
                          'text-white'
                        )}
                      >
                        {isProfessional ? (
                          <>
                            <Briefcase className="w-3 h-3" />
                            Professionista
                          </>
                        ) : (
                          <>
                            <User className="w-3 h-3" />
                            Cliente
                          </>
                        )}
                      </div>
                    </div>
                  </div>

                  {isProfessional ? (
                    /* Professional Mobile Links */
                    <>
                      <MobileNavLink
                        to="/pro/dashboard"
                        icon={<LayoutDashboard className="w-5 h-5" />}
                        onClick={() => setIsMenuOpen(false)}
                        active={location.pathname === '/pro/dashboard'}
                        isColored={!isLandingPage}
                      >
                        Dashboard
                      </MobileNavLink>
                      <MobileNavLink
                        to="/pro/calendar"
                        icon={<Calendar className="w-5 h-5" />}
                        onClick={() => setIsMenuOpen(false)}
                        active={location.pathname === '/pro/calendar'}
                        isColored={!isLandingPage}
                      >
                        Calendario
                      </MobileNavLink>
                      <MobileNavLink
                        to="/pro/profile"
                        icon={<User className="w-5 h-5" />}
                        onClick={() => setIsMenuOpen(false)}
                        active={location.pathname === '/pro/profile'}
                        isColored={!isLandingPage}
                      >
                        Il mio Profilo
                      </MobileNavLink>
                      <MobileNavLink
                        to="/chat"
                        icon={<MessageCircle className="w-5 h-5" />}
                        onClick={() => setIsMenuOpen(false)}
                        active={location.pathname.startsWith('/chat')}
                        isColored={!isLandingPage}
                      >
                        Messaggi
                      </MobileNavLink>
                    </>
                  ) : (
                    /* Client Mobile Links */
                    <>
                      <MobileNavLink
                        to="/dashboard"
                        icon={<LayoutDashboard className="w-5 h-5" />}
                        onClick={() => setIsMenuOpen(false)}
                        active={location.pathname === '/dashboard'}
                        isColored={!isLandingPage}
                      >
                        Home
                      </MobileNavLink>
                      <MobileNavLink
                        to="/bookings"
                        icon={<Calendar className="w-5 h-5" />}
                        onClick={() => setIsMenuOpen(false)}
                        active={location.pathname.startsWith('/bookings')}
                        isColored={!isLandingPage}
                      >
                        Le mie Prenotazioni
                      </MobileNavLink>
                      <MobileNavLink
                        to="/search"
                        icon={<Search className="w-5 h-5" />}
                        onClick={() => setIsMenuOpen(false)}
                        active={location.pathname === '/search'}
                        isColored={!isLandingPage}
                      >
                        Cerca Professionista
                      </MobileNavLink>
                      <MobileNavLink
                        to="/favorites"
                        icon={<Heart className="w-5 h-5" />}
                        onClick={() => setIsMenuOpen(false)}
                        active={location.pathname === '/favorites'}
                        isColored={!isLandingPage}
                      >
                        I miei Preferiti
                      </MobileNavLink>
                      <MobileNavLink
                        to="/chat"
                        icon={<MessageCircle className="w-5 h-5" />}
                        onClick={() => setIsMenuOpen(false)}
                        active={location.pathname.startsWith('/chat')}
                        isColored={!isLandingPage}
                      >
                        Messaggi
                      </MobileNavLink>
                    </>
                  )}

                  <div
                    className={cn(
                      'pt-2 mt-2 border-t',
                      isLandingPage ? 'border-gray-100' : 'border-white/20'
                    )}
                  >
                    <MobileNavLink
                      to="/settings"
                      icon={<Settings className="w-5 h-5" />}
                      onClick={() => setIsMenuOpen(false)}
                      active={location.pathname === '/settings'}
                      isColored={!isLandingPage}
                    >
                      Impostazioni
                    </MobileNavLink>
                    <button
                      onClick={handleLogout}
                      className={cn(
                        'w-full flex items-center gap-3 px-4 py-3 rounded-lg transition-colors',
                        isLandingPage
                          ? 'text-red-600 hover:bg-red-50'
                          : 'text-red-300 hover:bg-white/10'
                      )}
                    >
                      <LogOut className="w-5 h-5" />
                      Esci
                    </button>
                  </div>
                </>
              ) : (
                /* Visitor Mobile Menu */
                <>
                  <MobileNavLink
                    to="/search"
                    icon={<Search className="w-5 h-5" />}
                    onClick={() => setIsMenuOpen(false)}
                    active={location.pathname === '/search'}
                  >
                    Prenota un trattamento
                  </MobileNavLink>
                  <MobileNavLink
                    to="/pro/register"
                    icon={<Briefcase className="w-5 h-5" />}
                    onClick={() => setIsMenuOpen(false)}
                    active={location.pathname === '/pro/register'}
                  >
                    Lavora con noi
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
                      className="w-full bg-primary-600 hover:bg-primary-700"
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
  isColored,
  children,
}: {
  to: string;
  active: boolean;
  isColored?: boolean;
  children: React.ReactNode;
}) {
  return (
    <Link
      to={to}
      className={cn(
        'px-3 py-2 rounded-lg text-sm font-medium transition-colors',
        isColored
          ? active
            ? 'bg-white/20 text-white'
            : 'text-white/80 hover:text-white hover:bg-white/10'
          : active
          ? 'bg-gray-100 text-gray-900'
          : 'text-gray-600 hover:text-gray-900 hover:bg-gray-50'
      )}
    >
      {children}
    </Link>
  );
}

function MobileNavLink({
  to,
  onClick,
  icon,
  active,
  isColored,
  children,
}: {
  to: string;
  onClick: () => void;
  icon?: React.ReactNode;
  active?: boolean;
  isColored?: boolean;
  children: React.ReactNode;
}) {
  return (
    <Link
      to={to}
      onClick={onClick}
      className={cn(
        'flex items-center gap-3 px-4 py-3 rounded-lg transition-colors',
        isColored
          ? active
            ? 'bg-white/20 text-white font-medium'
            : 'text-white/80 hover:text-white hover:bg-white/10'
          : active
          ? 'bg-gray-100 text-gray-900 font-medium'
          : 'text-gray-700 hover:bg-gray-50'
      )}
    >
      {icon}
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
        'w-full flex items-center gap-3 px-4 py-2.5 text-sm transition-colors',
        danger ? 'text-red-600 hover:bg-red-50' : 'text-gray-700 hover:bg-gray-50'
      )}
    >
      {icon}
      {children}
    </button>
  );
}
