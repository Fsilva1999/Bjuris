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
import { PrevidenciarioTRF1 } from './pages/PrevidenciarioTRF1';
import { Processos } from './pages/Processos';
import { Clientes } from './pages/Clientes';
import { AgendaPrazos } from './pages/AgendaPrazos';
import { Financeiro } from './pages/Financeiro';
import { Calculadora } from './pages/Calculadora';
import { Configuracoes } from './pages/Configuracoes';
import { LoginPage } from './pages/auth/LoginPage';
import { RegisterPage } from './pages/auth/RegisterPage';

// Loading screen (Dark theme matching index.html bg-slate-950)
const LoadingScreen: React.FC = () => (
  <div className="min-h-screen bg-slate-950 text-slate-100 flex flex-col items-center justify-center p-4">
    <div className="text-center space-y-5">
      <div className="w-20 h-20 rounded-2xl bg-slate-900 border border-amber-500/40 flex items-center justify-center mx-auto shadow-2xl relative">
        <span className="text-3xl font-black text-[#d4af37]">⚖️</span>
        <div className="absolute -inset-1 rounded-[18px] border border-[#d4af37]/30 animate-pulse" />
      </div>

      <div>
        <h2 className="text-lg font-black font-outfit text-slate-100 tracking-wider">BJuris</h2>
        <p className="text-xs text-amber-500/90 font-medium mt-0.5">Gestão Advocatícia & Processual</p>
      </div>

      <div className="flex items-center gap-2 justify-center pt-2">
        <div className="w-2.5 h-2.5 rounded-full bg-[#d4af37] animate-bounce" style={{ animationDelay: '0ms' }} />
        <div className="w-2.5 h-2.5 rounded-full bg-[#d4af37] animate-bounce" style={{ animationDelay: '150ms' }} />
        <div className="w-2.5 h-2.5 rounded-full bg-[#d4af37] animate-bounce" style={{ animationDelay: '300ms' }} />
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
      case 'previdenciario':
        return <PrevidenciarioTRF1 />;
      case 'processos':
        return <Processos />;
      case 'clientes':
        return <Clientes />;
      case 'agenda':
        return <AgendaPrazos />;
      case 'financeiro':
        return <Financeiro defaultTab="lancamentos" />;
      case 'carnes':
        return <Financeiro defaultTab="carnes" />;
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

class ErrorBoundary extends React.Component<{ children: React.ReactNode }, { hasError: boolean; error: Error | null }> {
  constructor(props: { children: React.ReactNode }) {
    super(props);
    this.state = { hasError: false, error: null };
  }

  static getDerivedStateFromError(error: Error) {
    return { hasError: true, error };
  }

  componentDidCatch(error: Error, errorInfo: React.ErrorInfo) {
    console.error('React ErrorBoundary caught error:', error, errorInfo);
  }

  render() {
    if (this.state.hasError) {
      return (
        <div className="min-h-screen bg-slate-950 text-slate-100 flex items-center justify-center p-4">
          <div className="max-w-md w-full bg-slate-900 border border-amber-500/30 rounded-2xl p-6 text-center shadow-2xl space-y-4">
            <div className="w-12 h-12 rounded-full bg-amber-500/10 text-[#d4af37] flex items-center justify-center mx-auto text-xl font-bold border border-amber-500/30">
              ⚖️
            </div>
            <h2 className="text-xl font-bold text-slate-100">BJuris - Gestão Advocatícia</h2>
            <p className="text-sm text-slate-400">
              Ocorreu uma oscilação na inicialização. Por favor, recarregue a página para acessar o painel.
            </p>
            <button
              onClick={() => window.location.reload()}
              className="w-full py-3 px-4 bg-gradient-to-r from-amber-500 to-amber-600 hover:from-amber-600 hover:to-amber-700 text-slate-950 font-bold rounded-xl shadow-lg transition-all"
            >
              Recarregar Aplicativo
            </button>
          </div>
        </div>
      );
    }
    return this.props.children;
  }
}

export function App() {
  return (
    <ErrorBoundary>
      <AuthProvider>
        <AuthGate>
          <LegalProvider>
            <MainContent />
          </LegalProvider>
        </AuthGate>
      </AuthProvider>
    </ErrorBoundary>
  );
}

export default App;
