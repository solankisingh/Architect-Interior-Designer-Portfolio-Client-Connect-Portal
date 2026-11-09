import React, { useEffect } from 'react';
import { BrowserRouter, Routes, Route, useLocation } from 'react-router-dom';
import { AuthProvider } from './context/AuthContext';
import Navbar from './components/Navbar';
import Footer from './components/Footer';
import DemoSwitcherPill from './components/DemoSwitcherPill';

// Pages
import Home from './pages/Home';
import DesignersDirectory from './pages/DesignersDirectory';
import DesignerDetail from './pages/DesignerDetail';
import InquiryDetail from './pages/InquiryDetail';
import AuthPage from './pages/AuthPage';
import ClientDashboard from './pages/ClientDashboard';
import DesignerDashboard from './pages/DesignerDashboard';
import AdminDashboard from './pages/AdminDashboard';

// Helper to scroll to top on route navigation
function ScrollToTop() {
  const { pathname } = useLocation();
  useEffect(() => {
    window.scrollTo(0, 0);
  }, [pathname]);
  return null;
}

export default function App() {
  return (
    <AuthProvider>
      <BrowserRouter>
        <ScrollToTop />
        <div className="flex flex-col min-h-screen">
          <Navbar />
          <main className="flex-1">
            <Routes>
              <Route path="/" element={<Home />} />
              <Route path="/designers" element={<DesignersDirectory />} />
              <Route path="/designers/:id" element={<DesignerDetail />} />
              <Route path="/inquiries/:id" element={<InquiryDetail />} />
              <Route path="/login" element={<AuthPage defaultMode="login" />} />
              <Route path="/register" element={<AuthPage defaultMode="register" />} />
              <Route path="/client/dashboard" element={<ClientDashboard />} />
              <Route path="/designer/dashboard" element={<DesignerDashboard />} />
              <Route path="/admin" element={<AdminDashboard />} />
            </Routes>
          </main>
          <Footer />
          <DemoSwitcherPill />
        </div>
      </BrowserRouter>
    </AuthProvider>
  );
}
