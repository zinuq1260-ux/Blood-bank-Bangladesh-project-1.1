
import React, { useState, useEffect } from 'react';
import { View } from './types';
import LandingView from './views/LandingView';
import RegistrationView from './views/RegistrationView';
import RequestView from './views/RequestView';
import LoginView from './views/LoginView';
import DashboardView from './views/DashboardView';
import Navbar from './components/Navbar';
import Footer from './components/Footer';

const App: React.FC = () => {
  const [currentView, setCurrentView] = useState<View>('home');
  const [isAdmin, setIsAdmin] = useState(false);

  // Simple state-based routing
  const renderView = () => {
    switch (currentView) {
      case 'home': return <LandingView onViewChange={setCurrentView} />;
      case 'register': return <RegistrationView onComplete={() => setCurrentView('home')} />;
      case 'request': return <RequestView onComplete={() => setCurrentView('home')} />;
      case 'login': return <LoginView onLogin={(user) => { setIsAdmin(true); setCurrentView('dashboard'); }} />;
      case 'dashboard': return isAdmin ? <DashboardView onLogout={() => { setIsAdmin(false); setCurrentView('home'); }} /> : <LoginView onLogin={() => { setIsAdmin(true); setCurrentView('dashboard'); }} />;
      default: return <LandingView onViewChange={setCurrentView} />;
    }
  };

  useEffect(() => {
    window.scrollTo(0, 0);
  }, [currentView]);

  if (currentView === 'dashboard') {
    return <DashboardView onLogout={() => { setIsAdmin(false); setCurrentView('home'); }} />;
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
