import { lazy, Suspense } from 'react';
import { BrowserRouter, Routes, Route } from 'react-router-dom';
import { Toaster } from 'sonner';
import './App.css';

import AppLayout from './components/layout/AppLayout';
import ProtectedRoute from './components/auth/ProtectedRoute';
import LoadingSpinner from './components/ui/spinner';

// Lazy loaded page components
const AuthPage = lazy(() => import('./pages/AuthPage'));
const Dashboard = lazy(() => import('./pages/Dashboard'));
const Profile = lazy(() => import('./pages/Profile'));
const SitesPage = lazy(() => import('./pages/SitesPage'));
const CrawlJobsPage = lazy(() => import('./pages/CrawlJobsPage'));
const SiteDetailsPage = lazy(() => import('./pages/SiteDetailsPage'));
const IssuesPage = lazy(() => import('./pages/Issues'));

function App() {
  return (
    <>
      <BrowserRouter>
        <Suspense fallback={<LoadingSpinner />}>
          <Routes>
            <Route path="/" element={<AuthPage />} />

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
            </Route>
          </Routes>
        </Suspense>
      </BrowserRouter>
      <Toaster richColors />
    </>
  );
}

export default App;
