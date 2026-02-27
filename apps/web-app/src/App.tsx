import { BrowserRouter, Routes, Route } from 'react-router-dom';
import './App.css';
import AuthPage from './pages/AuthPage';
import Dashboard from './pages/Dashboard';
import Profile from './pages/Profile';
import AppLayout from './components/layout/AppLayout';
import ProtectedRoute from './components/auth/ProtectedRoute';
import { Toaster } from 'sonner';
import SitesPage from './pages/SitesPage';
import CrawlJobsPage from './pages/CrawlJobsPage';
import SiteDetailsPage from './pages/SiteDetailsPage';
function App() {
  return (
    <>
      <BrowserRouter>
        <Routes>
          <Route path="/" element={<AuthPage />} />

          <Route element={<AppLayout />}>
            <Route
              path="/dashboard"
              element={
                <ProtectedRoute>
                  <Dashboard />
                </ProtectedRoute>
              }
            />
            <Route
              path="/profile"
              element={
                <ProtectedRoute>
                  <Profile />
                </ProtectedRoute>
              }
            />
            <Route
              path="/sites"
              element={
                <ProtectedRoute>
                  <SitesPage />
                </ProtectedRoute>
              }
            />
            <Route
              path="/crawl-jobs"
              element={
                <ProtectedRoute>
                  <CrawlJobsPage />
                </ProtectedRoute>
              }
            />
            <Route
              path="/sites/:id"
              element={
                <ProtectedRoute>
                  <SiteDetailsPage />
                </ProtectedRoute>
              }
            />
          </Route>
        </Routes>
      </BrowserRouter>
      <Toaster richColors/>
    </>
  );
}

export default App;
