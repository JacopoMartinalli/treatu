import { Outlet, useLocation } from 'react-router-dom';
import { Navbar } from '../components/shared/Navbar';
import { Footer } from '../components/shared/Footer';

// ============================================
// MAIN LAYOUT
// ============================================

export function MainLayout() {
  const location = useLocation();

  // Pages where we don't want to show the footer
  const hideFooterPaths = ['/booking', '/pro/register', '/chat'];
  const showFooter = !hideFooterPaths.some((path) =>
    location.pathname.startsWith(path)
  );

  return (
    <div className="flex flex-col min-h-screen">
      <Navbar />
      <main className="flex-1">
        <Outlet />
      </main>
      {showFooter && <Footer />}
    </div>
  );
}
