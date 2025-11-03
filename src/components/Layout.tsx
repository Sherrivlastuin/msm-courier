import { ReactNode } from 'react';
import { Ship, LogOut } from 'lucide-react';
import { useAuth } from '../contexts/AuthContext';

interface LayoutProps {
  children: ReactNode;
  currentPage: 'home' | 'track' | 'admin' | 'dashboard';
  onNavigate: (page: 'home' | 'track' | 'admin' | 'dashboard') => void;
}

export function Layout({ children, currentPage, onNavigate }: LayoutProps) {
  const { isAuthenticated, logout } = useAuth();

  const handleLogout = () => {
    logout();
    onNavigate('home');
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-slate-50 to-slate-100">
      <nav className="bg-white shadow-md border-b border-slate-200">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex justify-between items-center h-16">
            <div
              className="flex items-center space-x-3 cursor-pointer"
              onClick={() => onNavigate('home')}
            >
              <Ship className="w-8 h-8 text-slate-700" />
              <span className="text-2xl font-bold text-slate-800">MSM COURIER</span>
            </div>

            <div className="flex items-center space-x-6">
              <button
                onClick={() => onNavigate('home')}
                className={`px-4 py-2 rounded-lg font-medium transition-all ${
                  currentPage === 'home'
                    ? 'bg-slate-700 text-white'
                    : 'text-slate-600 hover:bg-slate-100'
                }`}
              >
                Home
              </button>
              <button
                onClick={() => onNavigate('track')}
                className={`px-4 py-2 rounded-lg font-medium transition-all ${
                  currentPage === 'track'
                    ? 'bg-slate-700 text-white'
                    : 'text-slate-600 hover:bg-slate-100'
                }`}
              >
                Track Parcel
              </button>
              {!isAuthenticated ? (
                <button
                  onClick={() => onNavigate('admin')}
                  className={`px-4 py-2 rounded-lg font-medium transition-all ${
                    currentPage === 'admin'
                      ? 'bg-slate-700 text-white'
                      : 'text-slate-600 hover:bg-slate-100'
                  }`}
                >
                  Admin Only
                </button>
              ) : (
                <>
                  <button
                    onClick={() => onNavigate('dashboard')}
                    className={`px-4 py-2 rounded-lg font-medium transition-all ${
                      currentPage === 'dashboard'
                        ? 'bg-slate-700 text-white'
                        : 'text-slate-600 hover:bg-slate-100'
                    }`}
                  >
                    Dashboard
                  </button>
                  <button
                    onClick={handleLogout}
                    className="flex items-center space-x-2 px-4 py-2 rounded-lg font-medium text-red-600 hover:bg-red-50 transition-all"
                  >
                    <LogOut className="w-4 h-4" />
                    <span>Logout</span>
                  </button>
                </>
              )}
            </div>
          </div>
        </div>
      </nav>

      <main className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        {children}
      </main>
    </div>
  );
}
