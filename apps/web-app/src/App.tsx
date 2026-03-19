import { lazy, Suspense } from 'react';
import { BrowserRouter, Routes, Route } from 'react-router-dom';
import { Toaster } from 'sonner';
import './App.css';

import AppLayout from './layout/AppLayout';
import LoadingSpinner from './components/ui/spinner';
import AuthInitializer from './components/auth/AuthInitializer';
import { ProtectedRoute } from './components/auth/ProtectedRoute';
import { PublicRoute } from './components/auth/PublicRoute';

// Lazy loaded page components
const AuthPage = lazy(() => import('./pages/AuthPage'));
const Dashboard = lazy(() => import('./pages/Dashboard'));
const Profile = lazy(() => import('./pages/Profile'));
const SitesPage = lazy(() => import('./pages/SitesPage'));
const CrawlJobsPage = lazy(() => import('./pages/CrawlJobsPage'));
const SiteDetailsPage = lazy(() => import('./pages/SiteDetailsPage'));
const IssuesPage = lazy(() => import('./pages/Issues'));
const ReportsPage = lazy(() => import('./pages/ReportsPage'));
const NotFoundPage = lazy(() => import('./pages/NotFoundPage'));

function App() {
  return (
    <>
      <AuthInitializer>
        <BrowserRouter>
          <Suspense fallback={<LoadingSpinner />}>
            <Routes>
              {/* Public Routes */}
              <Route element={<PublicRoute />}>
                <Route path="/" element={<AuthPage />} />
              </Route>

              {/* Protected Routes*/}
              <Route element={<ProtectedRoute />}>
                <Route element={<AppLayout />}>
                  <Route path="/dashboard" element={<Dashboard />} />
                  <Route path="/profile" element={<Profile />} />
                  <Route path="/sites" element={<SitesPage />} />
                  <Route path="/crawl-jobs" element={<CrawlJobsPage />} />
                  <Route path="/sites/:id" element={<SiteDetailsPage />} />
                  <Route path="/issues" element={<IssuesPage />} />
                  <Route path="/reports" element={<ReportsPage />} />
                </Route>
              </Route>

              {/* Global Routes*/}
              <Route path="*" element={<NotFoundPage />} />
            </Routes>
          </Suspense>
        </BrowserRouter>
      </AuthInitializer>

      <Toaster richColors />
    </>
  );
}

export default App;
