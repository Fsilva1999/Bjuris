import React, { useState } from 'react';
import { AuthProvider, useAuth } from './contexts/AuthContext';
import { LegalProvider, useLegal } from './context/LegalContext';
import { Navbar } from './components/layout/Navbar';
import { Sidebar } from './components/layout/Sidebar';
import { MobileBottomNav } from './components/layout/MobileBottomNav';
import { InstallBanner } from './components/pwa/InstallBanner';
import { NotificationModal } from './components/pwa/NotificationModal';

import { NewProcessoModal } from './components/modals/NewProcessoModal';
import { NewClienteModal } from './components/modals/NewClienteModal';
import { NewPrazoModal } from './components/modals/NewPrazoModal';
import { ProcuracaoModal } from './components/modals/ProcuracaoModal';

import { Dashboard } from './pages/Dashboard';
import { Processos } from './pages/Processos';
import { Clientes } from './pages/Clientes';
import { AgendaPrazos } from './pages/AgendaPrazos';
import { Financeiro } from './pages/Financeiro';
import { Calculadora } from './pages/Calculadora';
import { Configuracoes } from './pages/Configuracoes';
import { LoginPage } from './pages/auth/LoginPage';
import { RegisterPage } from './pages/auth/RegisterPage';

// Loading screen
const LoadingScreen: React.FC = () => (
  <div className="min-h-screen bg-white flex items-center justify-center">
    <div className="text-center space-y-4">
      <div className="w-16 h-16 rounded-2xl bg-slate-950 flex items-center justify-center mx-auto shadow-xl relative">
        <img src="/logo-bjuris.png" alt="BJuris" className="w-10 h-10 object-contain" />
        <div className="absolute -inset-1 rounded-[14px] border-2 border-[#d4af37]/40" />
      </div>
      <div className="flex items-center gap-2 justify-center">
        <div className="w-2 h-2 rounded-full bg-[#d4af37] animate-bounce" style={{ animationDelay: '0ms' }} />
        <div className="w-2 h-2 rounded-full bg-[#d4af37] animate-bounce" style={{ animationDelay: '150ms' }} />
        <div className="w-2 h-2 rounded-full bg-[#d4af37] animate-bounce" style={{ animationDelay: '300ms' }} />
      </div>
    </div>
  </div>
);

// Auth gate – shows login/register if not authenticated
const AuthGate: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  const { user, loading } = useAuth();
  const [authView, setAuthView] = useState<'login' | 'register'>('login');

  if (loading) return <LoadingScreen />;

  if (!user) {
    if (authView === 'register') {
      return <RegisterPage onGoToLogin={() => setAuthView('login')} />;
    }
    return <LoginPage onGoToRegister={() => setAuthView('register')} />;
  }

  return <>{children}</>;
};

// Main content when authenticated
const MainContent: React.FC = () => {
  const { activeTab } = useLegal();

  const renderTab = () => {
    switch (activeTab) {
      case 'dashboard':
        return <Dashboard />;
      case 'processos':
        return <Processos />;
      case 'clientes':
        return <Clientes />;
      case 'agenda':
        return <AgendaPrazos />;
      case 'financeiro':
        return <Financeiro />;
      case 'calculadora':
        return <Calculadora />;
      case 'configuracoes':
        return <Configuracoes />;
      default:
        return <Dashboard />;
    }
  };

  return (
    <div className="min-h-screen flex flex-col bg-[#f8fafc] text-slate-900 selection:bg-amber-500/20 selection:text-amber-900 font-sans antialiased">
      <InstallBanner />
      <Navbar />

      <div className="flex-1 flex w-full">
        <Sidebar />
        
        <main className="flex-1 p-4 sm:p-6 lg:p-8 pb-24 lg:pb-8 w-full max-w-full overflow-x-hidden">
          <div className="w-full max-w-[1700px] mx-auto">
            {renderTab()}
          </div>
        </main>
      </div>

      <MobileBottomNav />
      <NotificationModal />

      {/* Global Modals */}
      <NewProcessoModal />
      <NewClienteModal />
      <NewPrazoModal />
      <ProcuracaoModal />
    </div>
  );
};

export function App() {
  return (
    <AuthProvider>
      <AuthGate>
        <LegalProvider>
          <MainContent />
        </LegalProvider>
      </AuthGate>
    </AuthProvider>
  );
}

export default App;
