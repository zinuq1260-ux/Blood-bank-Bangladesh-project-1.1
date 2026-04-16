
import React, { useState, useEffect } from 'react';
import { View } from './types';
import LandingView from './views/LandingView';
import RegistrationView from './views/RegistrationView';
import RequestView from './views/RequestView';
import LoginView from './views/LoginView';
import DashboardView from './views/DashboardView';
import DonorSearchView from './views/DonorSearchView';
import Navbar from './components/Navbar';
import Footer from './components/Footer';
import { dataService } from './services/dataService';

const App: React.FC = () => {
  const [currentView, setCurrentView] = useState<View>(() => {
    const saved = localStorage.getItem('bbbd_currentView');
    return (saved as View) || 'home';
  });
  const [isAdmin, setIsAdmin] = useState(() => {
    return localStorage.getItem('bbbd_isAdmin') === 'true';
  });
  const [initialSearch, setInitialSearch] = useState<{ bloodGroup?: string, location?: string }>({});

  useEffect(() => {
    const recordVisit = async () => {
      const hasVisited = sessionStorage.getItem('bbbd_has_visited_session');
      if (!hasVisited) {
        await dataService.recordVisit();
        sessionStorage.setItem('bbbd_has_visited_session', 'true');
      }
    };
    recordVisit();
  }, []);

  useEffect(() => {
    localStorage.setItem('bbbd_currentView', currentView);
    window.scrollTo(0, 0);
  }, [currentView]);

  useEffect(() => {
    localStorage.setItem('bbbd_isAdmin', String(isAdmin));
  }, [isAdmin]);

  // Handle view switching
  const renderView = () => {
    switch (currentView) {
      case 'home': return <LandingView onViewChange={setCurrentView} onSearch={(bg, loc) => { setInitialSearch({ bloodGroup: bg, location: loc }); setCurrentView('search'); }} />;
      case 'register': return <RegistrationView onComplete={() => setCurrentView('home')} />;
      case 'request': return <RequestView onComplete={() => setCurrentView('home')} />;
      case 'login': return <LoginView onLogin={(user) => { setIsAdmin(true); setCurrentView('dashboard'); }} />;
      case 'search': return <DonorSearchView onBack={() => { setInitialSearch({}); setCurrentView('home'); }} initialBloodGroup={initialSearch.bloodGroup} initialLocation={initialSearch.location} />;
      case 'dashboard': return isAdmin ? <DashboardView onLogout={() => { setIsAdmin(false); setCurrentView('home'); }} /> : <LoginView onLogin={() => { setIsAdmin(true); setCurrentView('dashboard'); }} />;
      default: return <LandingView onViewChange={setCurrentView} onSearch={(bg, loc) => { setInitialSearch({ bloodGroup: bg, location: loc }); setCurrentView('search'); }} />;
    }
  };

  if (currentView === 'dashboard') {
    return isAdmin ? <DashboardView onLogout={() => { setIsAdmin(false); setCurrentView('home'); }} /> : <LoginView onLogin={() => { setIsAdmin(true); setCurrentView('dashboard'); }} />;
  }

  return (
    <div className="flex flex-col min-h-screen">
      <Navbar currentView={currentView} onViewChange={setCurrentView} />
      <main className="flex-grow">
        {renderView()}
      </main>
      <Footer onViewChange={setCurrentView} />
    </div>
  );
};

export default App;
