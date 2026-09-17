import React, { createContext, useContext, useState, useEffect } from 'react';
import {
  Processo,
  Cliente,
  DocumentoCliente,
  PrazoAudiencia,
  HonorarioFinanceiro,
  AdvogadoPerfil,
  StatusProcesso,
  CarnePagamento,
  ParcelaCarne,
  Movimentacao
} from '../types/legal';
import {
  MOCK_PERFIL,
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
  carnes: CarnePagamento[];
  
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
  updatePrazo: (id: string, atualizado: Partial<PrazoAudiencia>) => void;
  deletePrazo: (id: string) => void;
  addMovimentacaoProcesso: (processoIdOrNumero: string, titulo: string, descricao: string, anexoNome?: string) => void;
  togglePrazoConcluido: (id: string) => void;
  addFinanceiro: (novo: Omit<HonorarioFinanceiro, 'id'>) => void;
  toggleFinanceiroStatus: (id: string) => void;
  addCarne: (novo: Omit<CarnePagamento, 'id' | 'dataCriacao' | 'parcelas'>) => void;
  toggleParcelaCarneStatus: (carneId: string, parcelaId: string) => void;
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
    if (saved) {
      try {
        const parsed = JSON.parse(saved);
        if (Array.isArray(parsed)) return parsed;
      } catch (e) {}
    }
    return [];
  });

const SAMPLE_DOC_FALLBACK = `data:image/svg+xml;utf8,<svg xmlns="http://www.w3.org/2000/svg" width="600" height="400" viewBox="0 0 600 400"><rect width="600" height="400" fill="%23f8fafc" rx="20"/><rect x="20" y="20" width="560" height="360" fill="%23f1f5f9" stroke="%23cbd5e1" stroke-width="4" rx="16"/><rect x="40" y="40" width="520" height="60" fill="%23b8860b" rx="10"/><text x="60" y="78" font-family="sans-serif" font-size="22" font-weight="bold" fill="white">DOCUMENTO DIGITALIZADO - BJURIS</text><rect x="60" y="130" width="130" height="170" fill="%23e2e8f0" stroke="%2394a3b8" stroke-width="2" rx="10"/><circle cx="125" cy="180" r="35" fill="%23cbd5e1"/><path d="M75 270 Q125 225 175 270" fill="%23cbd5e1"/><text x="210" y="150" font-family="sans-serif" font-size="16" font-weight="bold" fill="%230f172a">COMPROVANTE DE IDENTIFICAÇÃO</text><text x="210" y="180" font-family="sans-serif" font-size="14" fill="%23334155">DOCUMENTO: RG / CNH / RESIDÊNCIA</text><text x="210" y="210" font-family="sans-serif" font-size="14" fill="%23334155">DIGITALIZAÇÃO: CÂMERAMOBILE / SCAN</text><text x="210" y="240" font-family="sans-serif" font-size="14" fill="%23334155">STATUS: DOCUMENTO VÁLIDO E VERIFICADO</text><rect x="60" y="320" width="470" height="35" fill="%230f172a" rx="6"/><text x="75" y="343" font-family="monospace" font-size="14" fill="%23fef9c3">SISTEMA BJURIS - ARQUIVO DIGITAL SALVO</text></svg>`;

  const [clientes, setClientes] = useState<Cliente[]>(() => {
    const saved = localStorage.getItem('bjuris_clientes');
    if (saved) {
      try {
        const parsed = JSON.parse(saved);
        if (Array.isArray(parsed)) {
          return parsed.map((c: Cliente) => ({
            ...c,
            documentosAnexados: (c.documentosAnexados || []).map((d: any) => ({
              ...d,
              arquivoUrl: d.arquivoUrl || SAMPLE_DOC_FALLBACK
            }))
          }));
        }
      } catch (e) {}
    }
    return [];
  });

  const [prazos, setPrazos] = useState<PrazoAudiencia[]>(() => {
    const saved = localStorage.getItem('bjuris_prazos');
    if (saved) {
      try {
        const parsed = JSON.parse(saved);
        if (Array.isArray(parsed)) return parsed;
      } catch (e) {}
    }
    return [];
  });

  const [financeiro, setFinanceiro] = useState<HonorarioFinanceiro[]>(() => {
    const saved = localStorage.getItem('bjuris_financeiro');
    if (saved) {
      try {
        const parsed = JSON.parse(saved);
        if (Array.isArray(parsed)) return parsed;
      } catch (e) {}
    }
    return [];
  });

  const [carnes, setCarnes] = useState<CarnePagamento[]>(() => {
    const saved = localStorage.getItem('bjuris_carnes');
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

  // One-time migration: clear stale mock/demo data from localStorage
  // so users start fresh instead of seeing fake test records
  useEffect(() => {
    const migrated = localStorage.getItem('bjuris_v2_migrated');
    if (!migrated) {
      const savedProcessos = localStorage.getItem('bjuris_processos');
      const savedClientes = localStorage.getItem('bjuris_clientes');
      if (savedProcessos && savedProcessos.includes('"proc-1"')) {
        localStorage.removeItem('bjuris_processos');
        setProcessos([]);
      }
      if (savedClientes && savedClientes.includes('"cli-1"')) {
        localStorage.removeItem('bjuris_clientes');
        localStorage.removeItem('bjuris_prazos');
        localStorage.removeItem('bjuris_financeiro');
        setClientes([]);
        setPrazos([]);
        setFinanceiro([]);
      }
      localStorage.setItem('bjuris_v2_migrated', 'true');
    }
  // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

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

  useEffect(() => {
    localStorage.setItem('bjuris_carnes', JSON.stringify(carnes));
  }, [carnes]);

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

  const updatePrazo = (id: string, atualizado: Partial<PrazoAudiencia>) => {
    setPrazos(prev => prev.map(p => p.id === id ? { ...p, ...atualizado } : p));
  };

  const deletePrazo = (id: string) => {
    setPrazos(prev => prev.filter(p => p.id !== id));
  };

  const addMovimentacaoProcesso = (processoIdOrNumero: string, titulo: string, descricao: string, anexoNome?: string) => {
    setProcessos(prev => prev.map(p => {
      if (p.id === processoIdOrNumero || p.numeroCnj === processoIdOrNumero) {
        const novaMov: Movimentacao = {
          id: `mov-${Date.now()}`,
          processoId: p.id,
          data: new Date().toISOString().split('T')[0],
          titulo,
          descricao,
          origem: 'Manual',
          anexoNome
        };
        return {
          ...p,
          ultimaMovimentacao: { data: novaMov.data, titulo },
          movimentacoes: [novaMov, ...p.movimentacoes]
        };
      }
      return p;
    }));
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

  const addCarne = (novo: Omit<CarnePagamento, 'id' | 'dataCriacao' | 'parcelas'>) => {
    const carneId = `carne-${Date.now()}`;
    const dataHoje = new Date();
    const parcelas: ParcelaCarne[] = [];

    for (let i = 1; i <= novo.qtdParcelas; i++) {
      const dataVenc = new Date(dataHoje.getFullYear(), dataHoje.getMonth() + (i - 1), novo.diaVencimentoMensal);
      const vencStr = dataVenc.toISOString().split('T')[0];
      
      const now = new Date().getTime();
      const vencTime = dataVenc.getTime();
      const diffDays = Math.ceil((vencTime - now) / (1000 * 60 * 60 * 24));

      let status: 'pago' | 'proximo' | 'atrasado' | 'pendente' = 'pendente';
      if (diffDays < 0) status = 'atrasado';
      else if (diffDays <= 5) status = 'proximo';
      else status = 'pendente';

      parcelas.push({
        id: `parc-${carneId}-${i}`,
        numero: i,
        valor: novo.valorParcela,
        vencimento: vencStr,
        status
      });
    }

    const novoCarne: CarnePagamento = {
      ...novo,
      id: carneId,
      dataCriacao: new Date().toISOString().split('T')[0],
      parcelas
    };

    setCarnes(prev => [novoCarne, ...prev]);
  };

  const toggleParcelaCarneStatus = (carneId: string, parcelaId: string) => {
    setCarnes(prev => prev.map(c => {
      if (c.id === carneId) {
        return {
          ...c,
          parcelas: c.parcelas.map(p => {
            if (p.id === parcelaId) {
              const isPago = p.status === 'pago';
              return {
                ...p,
                status: isPago ? 'pendente' : 'pago',
                dataPagamento: isPago ? undefined : new Date().toISOString().split('T')[0]
              };
            }
            return p;
          })
        };
      }
      return c;
    }));
  };

  const dispararNotificacaoPrazo = (prazoId: string) => {
    const p = prazos.find(x => x.id === prazoId);
    if (p) {
      triggerDeadlineAlert(p.titulo, p.processoNumero);
      setPrazos(prev => prev.map(x => x.id === prazoId ? { ...x, notificacaoEnviada: true } : x));
    }
  };

  // Verificação automática periódica de prazos a vencer (Notificações Push & Alerta Sonoro)
  useEffect(() => {
    if (!perfil.notificacoesAtivas) return;

    const checkDeadlines = () => {
      const now = new Date().getTime();
      const next24h = now + 24 * 60 * 60 * 1000;

      prazos.forEach(p => {
        if (p.concluido || p.notificacaoEnviada) return;
        const prazoTime = new Date(p.dataHora).getTime();
        if (!isNaN(prazoTime) && prazoTime <= next24h) {
          dispararNotificacaoPrazo(p.id);
        }
      });
    };

    checkDeadlines();
    const interval = setInterval(checkDeadlines, 30000);
    return () => clearInterval(interval);
  }, [prazos, perfil.notificacoesAtivas]);

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
      carnes,
      canInstallPwa,
      installPwa,
      addProcesso,
      updateProcessoStatus,
      addCliente,
      updateCliente,
      addDocumentoCliente,
      addPrazo,
      updatePrazo,
      deletePrazo,
      addMovimentacaoProcesso,
      togglePrazoConcluido,
      addFinanceiro,
      toggleFinanceiroStatus,
      addCarne,
      toggleParcelaCarneStatus,
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
