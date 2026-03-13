import { lazy, Suspense } from 'react';
import { BrowserRouter, Routes, Route, Navigate } from 'react-router-dom';
import { Toaster } from 'sonner';
import './App.css';

import AppLayout from './components/layout/AppLayout';
import ProtectedRoute from './components/auth/ProtectedRoute';
import LoadingSpinner from './components/ui/spinner';
import { useAuthStore } from './store/auth-store';

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
  const { user, isInitialized } = useAuthStore();

  return (
    <>
      <BrowserRouter>
        <Suspense fallback={<LoadingSpinner />}>
          <Routes>
            {/* Public route: if user exists, redirect to dashboard */}
            <Route
              path="/"
              element={
                !isInitialized ? (
                  <LoadingSpinner /> // wait until store is ready
                ) : user ? (
                  <Navigate to="/dashboard" replace />
                ) : (
                  <AuthPage />
                )
              }
            />

            {/* Protected routes */}
            <Route
              element={
                <ProtectedRoute>
                  <AppLayout />
                </ProtectedRoute>
              }
            >
              <Route path="/dashboard" element={<Dashboard />} />
              <Route path="/profile" element={<Profile />} />
              <Route path="/sites" element={<SitesPage />} />
              <Route path="/crawl-jobs" element={<CrawlJobsPage />} />
              <Route path="/sites/:id" element={<SiteDetailsPage />} />
              <Route path="/issues" element={<IssuesPage />} />
              <Route path="/reports" element={<ReportsPage />} />

              {/* 404 for authenticated users */}
              <Route path="*" element={<NotFoundPage />} />
            </Route>

            {/* 404 for public routes */}
            <Route path="*" element={<NotFoundPage />} />
          </Routes>
        </Suspense>
      </BrowserRouter>

      <Toaster richColors />
    </>
  );
}

export default App;
