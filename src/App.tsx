import { useState } from 'react';
import { AuthProvider, useAuth } from './contexts/AuthContext';
import { Layout } from './components/Layout';
import { HomePage } from './pages/HomePage';
import { TrackPage } from './pages/TrackPage';
import { AdminLoginPage } from './pages/AdminLoginPage';
import { AdminDashboard } from './pages/AdminDashboard';

type Page = 'home' | 'track' | 'admin' | 'dashboard';

function AppContent() {
  const [currentPage, setCurrentPage] = useState<Page>('home');
  const { isAuthenticated } = useAuth();

  const handleNavigate = (page: Page) => {
    if (page === 'dashboard' && !isAuthenticated) {
      setCurrentPage('admin');
    } else {
      setCurrentPage(page);
    }
  };

  const handleLoginSuccess = () => {
    setCurrentPage('dashboard');
  };

  return (
    <Layout currentPage={currentPage} onNavigate={handleNavigate}>
      {currentPage === 'home' && <HomePage onNavigate={handleNavigate} />}
      {currentPage === 'track' && <TrackPage />}
      {currentPage === 'admin' && <AdminLoginPage onLoginSuccess={handleLoginSuccess} />}
      {currentPage === 'dashboard' && isAuthenticated && <AdminDashboard />}
    </Layout>
  );
}

function App() {
  return (
    <AuthProvider>
      <AppContent />
    </AuthProvider>
  );
}

export default App;
