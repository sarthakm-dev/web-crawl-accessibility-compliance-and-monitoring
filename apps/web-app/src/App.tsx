import { BrowserRouter, Routes, Route } from 'react-router-dom';
import './App.css';
import AuthPage from './pages/AuthPage';
import Dashboard from './pages/Dashboard';
import Profile from './pages/Profile';
import AppLayout from './components/layout/AppLayout';
function App() {
  return (
    <BrowserRouter>
      <Routes>

        <Route path="/" element={<AuthPage />} />

        <Route element={<AppLayout />}>
          <Route path="/dashboard" element={<Dashboard/>}/>
          <Route path="/profile" element={<Profile/>} />
        </Route>
      </Routes>
    </BrowserRouter>
  );
}

export default App;
