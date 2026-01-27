import { BrowserRouter, Routes, Route } from 'react-router-dom';
import { Toaster } from 'react-hot-toast';

// Layout
import { MainLayout } from './layouts/MainLayout';

// Public Pages
import { LandingPage } from './pages/LandingPage';
import { LoginPage } from './pages/auth/LoginPage';
import { RegisterPage } from './pages/auth/RegisterPage';

// Client Pages
import { SearchPage } from './pages/client/SearchPage';
import { ProfessionalProfilePage } from './pages/client/ProfessionalProfilePage';
import { BookingPage } from './pages/client/BookingPage';
import { BookingsListPage } from './pages/client/BookingsListPage';
import { BookingDetailPage } from './pages/client/BookingDetailPage';
import { ProfilePage } from './pages/client/ProfilePage';
import { SettingsPage } from './pages/client/SettingsPage';
import { FavoritesPage } from './pages/client/FavoritesPage';
import { ClientDashboardPage } from './pages/client/DashboardPage';

// Professional Pages
import { RegisterProfessionalPage } from './pages/professional/RegisterProfessionalPage';
import { DashboardPage } from './pages/professional/DashboardPage';
import { CalendarPage } from './pages/professional/CalendarPage';
import { ProfessionalProfilePage as ProProfilePage } from './pages/professional/ProfilePage';

// ============================================
// APP
// ============================================

function App() {
  return (
    <BrowserRouter>
      {/* Toast Notifications */}
      <Toaster
        position="top-center"
        toastOptions={{
          duration: 3000,
          style: {
            background: '#333',
            color: '#fff',
            borderRadius: '10px',
          },
          success: {
            iconTheme: {
              primary: '#10b981',
              secondary: '#fff',
            },
          },
          error: {
            iconTheme: {
              primary: '#ef4444',
              secondary: '#fff',
            },
          },
        }}
      />

      <Routes>
        {/* Main Layout Routes */}
        <Route element={<MainLayout />}>
          {/* Public Routes */}
          <Route path="/" element={<LandingPage />} />
          <Route path="/login" element={<LoginPage />} />
          <Route path="/register" element={<RegisterPage />} />
          <Route path="/search" element={<SearchPage />} />
          <Route path="/professional/:id" element={<ProfessionalProfilePage />} />

          {/* Client Routes */}
          <Route path="/dashboard" element={<ClientDashboardPage />} />
          <Route path="/booking" element={<BookingPage />} />
          <Route path="/bookings" element={<BookingsListPage />} />
          <Route path="/bookings/:id" element={<BookingDetailPage />} />
          <Route path="/profile" element={<ProfilePage />} />
          <Route path="/settings" element={<SettingsPage />} />
          <Route path="/favorites" element={<FavoritesPage />} />

          {/* Professional Routes */}
          <Route path="/pro/register" element={<RegisterProfessionalPage />} />
          <Route path="/pro/dashboard" element={<DashboardPage />} />
          <Route path="/pro/calendar" element={<CalendarPage />} />
          <Route path="/pro/profile" element={<ProProfilePage />} />
        </Route>
      </Routes>
    </BrowserRouter>
  );
}

export default App;
