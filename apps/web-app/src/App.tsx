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
import IssuesPage from './pages/Issues';

function App() {
  return (
    <>
      <BrowserRouter>
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
      </BrowserRouter>

      <Toaster richColors />
    </>
  );
}

export default App;
