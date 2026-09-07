import React, { createContext, useContext, useState, useEffect } from 'react';
import {
  Processo,
  Cliente,
  DocumentoCliente,
  PrazoAudiencia,
  HonorarioFinanceiro,
  AdvogadoPerfil,
  StatusProcesso
} from '../types/legal';
import {
  MOCK_PERFIL,
  MOCK_CLIENTES,
  MOCK_PROCESSOS,
  MOCK_PRAZOS,
  MOCK_FINANCEIRO
} from '../services/mockData';
import { sendNativeNotification, triggerDeadlineAlert } from '../utils/pwaNotifications';

const CLEAN_PERFIL: AdvogadoPerfil = {
  nome: "Advogado(a)",
  oabNumero: "",
  oabUf: "",
  email: "",
  telefone: "",
  escritorio: "",
  cpf: "",
  fotoUrl: "",
  notificacoesAtivas: true,
  somAlerta: true,
  vibracao: true,
};

interface LegalContextType {
  activeTab: string;
  setActiveTab: (tab: string) => void;
  perfil: AdvogadoPerfil;
  setPerfil: React.Dispatch<React.SetStateAction<AdvogadoPerfil>>;
  logoUrl: string;
  setLogoUrl: (url: string) => void;
  processos: Processo[];
  clientes: Cliente[];
  prazos: PrazoAudiencia[];
  financeiro: HonorarioFinanceiro[];
  
  // PWA Install State
  canInstallPwa: boolean;
  installPwa: () => void;

  // Actions
  addProcesso: (novo: Omit<Processo, 'id' | 'movimentacoes' | 'ultimaMovimentacao'>) => void;
  updateProcessoStatus: (id: string, status: StatusProcesso) => void;
  addCliente: (novo: Omit<Cliente, 'id' | 'dataCadastro' | 'processosIds' | 'documentosAnexados'>) => void;
  updateCliente: (id: string, atualizado: Partial<Cliente>) => void;
  addDocumentoCliente: (clienteId: string, doc: Omit<DocumentoCliente, 'id' | 'dataAnexo'>) => void;
  addPrazo: (novo: Omit<PrazoAudiencia, 'id' | 'concluido'>) => void;
  togglePrazoConcluido: (id: string) => void;
  addFinanceiro: (novo: Omit<HonorarioFinanceiro, 'id'>) => void;
  toggleFinanceiroStatus: (id: string) => void;
  dispararNotificacaoPrazo: (prazoId: string) => void;

  // Modals state
  modalState: {
    novoProcesso: boolean;
    novoCliente: boolean;
    novoPrazo: boolean;
    procuracao: boolean;
    clienteParaProcuracao?: Cliente | null;
  };
  setModalState: React.Dispatch<React.SetStateAction<{
    novoProcesso: boolean;
    novoCliente: boolean;
    novoPrazo: boolean;
    procuracao: boolean;
    clienteParaProcuracao?: Cliente | null;
  }>>;
}

const LegalContext = createContext<LegalContextType | undefined>(undefined);

export const LegalProvider: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  const [activeTab, setActiveTab] = useState<string>('dashboard');
  
  const [logoUrl, setLogoUrl] = useState<string>(() => {
    return localStorage.getItem('bjuris_custom_logo') || '/logo-bjuris.png';
  });

  const [perfil, setPerfil] = useState<AdvogadoPerfil>(() => {
    const saved = localStorage.getItem('bjuris_perfil');
    return saved ? JSON.parse(saved) : CLEAN_PERFIL;
  });

  const [processos, setProcessos] = useState<Processo[]>(() => {
    const saved = localStorage.getItem('bjuris_processos');
    return saved ? JSON.parse(saved) : [];
  });

  const [clientes, setClientes] = useState<Cliente[]>(() => {
    const saved = localStorage.getItem('bjuris_clientes');
    return saved ? JSON.parse(saved) : [];
  });

  const [prazos, setPrazos] = useState<PrazoAudiencia[]>(() => {
    const saved = localStorage.getItem('bjuris_prazos');
    return saved ? JSON.parse(saved) : [];
  });

  const [financeiro, setFinanceiro] = useState<HonorarioFinanceiro[]>(() => {
    const saved = localStorage.getItem('bjuris_financeiro');
    return saved ? JSON.parse(saved) : [];
  });

  // PWA Install state
  const [deferredPrompt, setDeferredPrompt] = useState<any>(null);
  const [canInstallPwa, setCanInstallPwa] = useState<boolean>(false);

  // Modals
  const [modalState, setModalState] = useState<{
    novoProcesso: boolean;
    novoCliente: boolean;
    novoPrazo: boolean;
    procuracao: boolean;
    clienteParaProcuracao?: Cliente | null;
  }>({
    novoProcesso: false,
    novoCliente: false,
    novoPrazo: false,
    procuracao: false,
    clienteParaProcuracao: null
  });

  // LocalStorage persistence
  useEffect(() => {
    localStorage.setItem('bjuris_custom_logo', logoUrl);
  }, [logoUrl]);

  useEffect(() => {
    localStorage.setItem('bjuris_perfil', JSON.stringify(perfil));
  }, [perfil]);

  useEffect(() => {
    localStorage.setItem('bjuris_processos', JSON.stringify(processos));
  }, [processos]);

  useEffect(() => {
    localStorage.setItem('bjuris_clientes', JSON.stringify(clientes));
  }, [clientes]);

  useEffect(() => {
    localStorage.setItem('bjuris_prazos', JSON.stringify(prazos));
  }, [prazos]);

  useEffect(() => {
    localStorage.setItem('bjuris_financeiro', JSON.stringify(financeiro));
  }, [financeiro]);

  // PWA Install Prompt Listener
  useEffect(() => {
    const handleBeforeInstall = (e: any) => {
      e.preventDefault();
      setDeferredPrompt(e);
      setCanInstallPwa(true);
    };

    window.addEventListener('beforeinstallprompt', handleBeforeInstall);
    return () => window.removeEventListener('beforeinstallprompt', handleBeforeInstall);
  }, []);

  const installPwa = () => {
    if (deferredPrompt) {
      deferredPrompt.prompt();
      deferredPrompt.userChoice.then((choiceResult: any) => {
        if (choiceResult.outcome === 'accepted') {
          setCanInstallPwa(false);
          setDeferredPrompt(null);
        }
      });
    }
  };

  // Actions
  const addProcesso = (novo: Omit<Processo, 'id' | 'movimentacoes' | 'ultimaMovimentacao'>) => {
    const id = `proc-${Date.now()}`;
    const novoProcesso: Processo = {
      ...novo,
      id,
      ultimaMovimentacao: {
        data: new Date().toISOString().split('T')[0],
        titulo: 'Processo cadastrado no sistema BJuris'
      },
      movimentacoes: [
        {
          id: `mov-${Date.now()}`,
          processoId: id,
          data: new Date().toISOString().split('T')[0],
          titulo: 'Petição Inicial Protocolada',
          descricao: 'Cadastro e inclusão do processo no painel de acompanhamento.',
          origem: 'Manual'
        }
      ]
    };
    setProcessos(prev => [novoProcesso, ...prev]);

    // Link to client
    setClientes(prev => prev.map(c => {
      if (c.id === novo.clienteId) {
        return { ...c, processosIds: [...c.processosIds, id] };
      }
      return c;
    }));
  };

  const updateProcessoStatus = (id: string, status: StatusProcesso) => {
    setProcessos(prev => prev.map(p => p.id === id ? { ...p, status } : p));
  };

  const addCliente = (novo: Omit<Cliente, 'id' | 'dataCadastro' | 'processosIds' | 'documentosAnexados'>) => {
    const novoCliente: Cliente = {
      ...novo,
      id: `cli-${Date.now()}`,
      dataCadastro: new Date().toISOString().split('T')[0],
      processosIds: [],
      documentosAnexados: []
    };
    setClientes(prev => [novoCliente, ...prev]);
  };

  const updateCliente = (id: string, atualizado: Partial<Cliente>) => {
    setClientes(prev => prev.map(c => c.id === id ? { ...c, ...atualizado } : c));
  };

  const addDocumentoCliente = (clienteId: string, doc: Omit<DocumentoCliente, 'id' | 'dataAnexo'>) => {
    const novoDoc: DocumentoCliente = {
      ...doc,
      id: `doc-${Date.now()}`,
      dataAnexo: new Date().toISOString().split('T')[0]
    };

    setClientes(prev => prev.map(c => {
      if (c.id === clienteId) {
        return {
          ...c,
          documentosAnexados: [novoDoc, ...(c.documentosAnexados || [])]
        };
      }
      return c;
    }));
  };

  const addPrazo = (novo: Omit<PrazoAudiencia, 'id' | 'concluido'>) => {
    const novoPrazo: PrazoAudiencia = {
      ...novo,
      id: `prazo-${Date.now()}`,
      concluido: false
    };
    setPrazos(prev => [novoPrazo, ...prev]);

    if (novo.prioridade === 'urgente' && perfil.notificacoesAtivas) {
      triggerDeadlineAlert(novo.titulo, novo.processoNumero);
    }
  };

  const togglePrazoConcluido = (id: string) => {
    setPrazos(prev => prev.map(p => p.id === id ? { ...p, concluido: !p.concluido } : p));
  };

  const addFinanceiro = (novo: Omit<HonorarioFinanceiro, 'id'>) => {
    const novoFin: HonorarioFinanceiro = {
      ...novo,
      id: `fin-${Date.now()}`
    };
    setFinanceiro(prev => [novoFin, ...prev]);
  };

  const toggleFinanceiroStatus = (id: string) => {
    setFinanceiro(prev => prev.map(f => {
      if (f.id === id) {
        const isPago = f.status === 'pago';
        return {
          ...f,
          status: isPago ? 'pendente' : 'pago',
          dataPagamento: isPago ? undefined : new Date().toISOString().split('T')[0]
        };
      }
      return f;
    }));
  };

  const dispararNotificacaoPrazo = (prazoId: string) => {
    const p = prazos.find(x => x.id === prazoId);
    if (p) {
      triggerDeadlineAlert(p.titulo, p.processoNumero);
      setPrazos(prev => prev.map(x => x.id === prazoId ? { ...x, notificacaoEnviada: true } : x));
    }
  };

  return (
    <LegalContext.Provider value={{
      activeTab,
      setActiveTab,
      perfil,
      setPerfil,
      logoUrl,
      setLogoUrl,
      processos,
      clientes,
      prazos,
      financeiro,
      canInstallPwa,
      installPwa,
      addProcesso,
      updateProcessoStatus,
      addCliente,
      updateCliente,
      addDocumentoCliente,
      addPrazo,
      togglePrazoConcluido,
      addFinanceiro,
      toggleFinanceiroStatus,
      dispararNotificacaoPrazo,
      modalState,
      setModalState
    }}>
      {children}
    </LegalContext.Provider>
  );
};

export const useLegal = () => {
  const context = useContext(LegalContext);
  if (!context) {
    throw new Error('useLegal deve ser usado dentro de um LegalProvider');
  }
  return context;
};
