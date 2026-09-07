import React, { useState, useRef } from 'react';
import { useLegal } from '../context/LegalContext';
import { StatusProcesso, AreaProcesso, Processo, Movimentacao } from '../types/legal';
import { LISTA_VARAS_MARANHAO } from '../services/mockData';
import {
  Briefcase,
  Search,
  Filter,
  Plus,
  Scale,
  FileText,
  Clock,
  ChevronRight,
  User,
  Building,
  DollarSign,
  AlertCircle,
  ExternalLink,
  MapPin,
  BookOpen,
  Printer,
  Upload,
  Camera,
  CheckCircle2,
  Share2,
  X,
  FileCheck,
  Shield,
  MessageCircle
} from 'lucide-react';

export const Processos: React.FC = () => {
  const { processos, setModalState, updateProcessoStatus } = useLegal();

  const [searchTerm, setSearchTerm] = useState('');
  const [selectedTribunal, setSelectedTribunal] = useState<string>('todos');
  const [selectedStatus, setSelectedStatus] = useState<string>('todos');
  const [selectedArea, setSelectedArea] = useState<string>('todos');
  
  // Full Process Modal (Autos Digitais por Inteiro)
  const [activeProcessoDetail, setActiveProcessoDetail] = useState<Processo | null>(null);
  const [novaPecaTitulo, setNovaPecaTitulo] = useState('');
  const [novaPecaDescricao, setNovaPecaDescricao] = useState('');

  const processCameraInputRef = useRef<HTMLInputElement>(null);
  const processFileInputRef = useRef<HTMLInputElement>(null);

  const filteredProcessos = processos.filter(p => {
    const matchesSearch =
      p.numeroCnj.toLowerCase().includes(searchTerm.toLowerCase()) ||
      p.clienteNome.toLowerCase().includes(searchTerm.toLowerCase()) ||
      p.vara.toLowerCase().includes(searchTerm.toLowerCase()) ||
      p.parteContraria.toLowerCase().includes(searchTerm.toLowerCase());

    const matchesTribunal = selectedTribunal === 'todos' || p.tribunal === selectedTribunal;
    const matchesStatus = selectedStatus === 'todos' || p.status === selectedStatus;
    const matchesArea = selectedArea === 'todos' || p.area === selectedArea;

    return matchesSearch && matchesTribunal && matchesStatus && matchesArea;
  });

  const getStatusBadge = (status: StatusProcesso) => {
    switch (status) {
      case 'em_andamento':
        return <span className="px-2.5 py-0.5 rounded-full bg-blue-100 text-blue-800 font-extrabold text-[10px] border border-blue-300">Em Andamento</span>;
      case 'aguardando_audiencia':
        return <span className="px-2.5 py-0.5 rounded-full bg-amber-100 text-amber-800 font-extrabold text-[10px] border border-amber-300">Aguardando Audiência</span>;
      case 'recurso':
        return <span className="px-2.5 py-0.5 rounded-full bg-purple-100 text-purple-800 font-extrabold text-[10px] border border-purple-300">Em Grau de Recurso</span>;
      case 'ganho':
        return <span className="px-2.5 py-0.5 rounded-full bg-emerald-100 text-emerald-800 font-extrabold text-[10px] border border-emerald-300">Procedente (Ganho)</span>;
      case 'arquivado':
        return <span className="px-2.5 py-0.5 rounded-full bg-slate-200 text-slate-700 font-bold text-[10px]">Arquivado</span>;
      default:
        return <span className="px-2.5 py-0.5 rounded-full bg-slate-200 text-slate-700 font-bold text-[10px]">Suspenso</span>;
    }
  };

  const handleAnexarPecaProcesso = (origem: 'upload' | 'camera_scan', file?: File) => {
    if (!activeProcessoDetail) return;

    const tituloPeca = novaPecaTitulo || `Anexo - ${file ? file.name : 'Peça Digitalizada'}`;
    const novaMov: Movimentacao = {
      id: `mov-${Date.now()}`,
      processoId: activeProcessoDetail.id,
      data: new Date().toISOString().split('T')[0],
      titulo: tituloPeca,
      descricao: novaPecaDescricao || 'Peça / documento anexado aos autos do processo.',
      origem: origem === 'camera_scan' ? 'Manual' : 'Intimação DJe',
      anexoNome: file ? file.name : 'documento_escaneado.pdf'
    };

    activeProcessoDetail.movimentacoes = [novaMov, ...activeProcessoDetail.movimentacoes];
    setNovaPecaTitulo('');
    setNovaPecaDescricao('');
    alert(`Peça "${tituloPeca}" anexada aos autos com sucesso!`);
  };

  return (
    <div className="space-y-6 animate-in fade-in duration-300 w-full">
      
      {/* Hidden File / Camera Inputs for Process Attachment */}
      <input
        type="file"
        accept="image/*"
        capture="environment"
        ref={processCameraInputRef}
        onChange={e => {
          if (e.target.files && e.target.files[0]) {
            handleAnexarPecaProcesso('camera_scan', e.target.files[0]);
          }
        }}
        className="hidden"
      />

      <input
        type="file"
        accept="image/*,.pdf,.doc,.docx"
        ref={processFileInputRef}
        onChange={e => {
          if (e.target.files && e.target.files[0]) {
            handleAnexarPecaProcesso('upload', e.target.files[0]);
          }
        }}
        className="hidden"
      />

      {/* Header Bar */}
      <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4">
        <div>
          <h2 className="text-2xl font-black font-outfit text-slate-900 flex items-center gap-2">
            <Briefcase className="w-7 h-7 text-amber-600" />
            Gestão de Processos CNJ & Varas
          </h2>
          <p className="text-xs text-slate-600 font-medium">
            Visualização de capa e inteiro teor dos autos digitais (TJ, TRT, TRF e tribunais nacionais)
          </p>
        </div>

        <button
          onClick={() => setModalState(prev => ({ ...prev, novoProcesso: true }))}
          className="w-full sm:w-auto px-5 py-2.5 rounded-xl bg-slate-900 text-white font-extrabold text-xs hover:bg-slate-800 transition-all flex items-center justify-center gap-2 shadow-md"
        >
          <Plus className="w-4 h-4 text-amber-400" />
          + Cadastrar Processo CNJ
        </button>
      </div>

      {/* Filter & Search Controls */}
      <div className="glass-panel bg-white p-4 rounded-2xl border border-slate-200 shadow-sm flex flex-col md:flex-row items-center gap-3">
        <div className="relative flex-1 w-full">
          <Search className="w-4 h-4 text-amber-600 absolute left-3 top-3" />
          <input
            type="text"
            placeholder="Buscar por nº CNJ, cliente, parte contrária ou Vara..."
            value={searchTerm}
            onChange={e => setSearchTerm(e.target.value)}
            className="w-full bg-slate-50 border border-slate-300 rounded-xl pl-9 pr-4 py-2 text-xs text-slate-900 font-medium focus:border-amber-500 focus:bg-white focus:outline-none"
          />
        </div>

        <div className="flex items-center gap-2 w-full md:w-auto">
          <select
            value={selectedTribunal}
            onChange={e => setSelectedTribunal(e.target.value)}
            className="flex-1 md:flex-initial bg-slate-50 border border-slate-300 rounded-xl px-3 py-2 text-xs text-slate-900 font-bold focus:border-amber-500 focus:outline-none"
          >
            <option value="todos">Todos os Tribunais</option>
            <option value="TJMA">TJMA (Estadual)</option>
            <option value="TRT16">TRT16 (Trabalhista)</option>
            <option value="TRF1">TRF (Federal)</option>
            <option value="TJSP">TJSP</option>
            <option value="TJRJ">TJRJ</option>
          </select>

          <select
            value={selectedStatus}
            onChange={e => setSelectedStatus(e.target.value)}
            className="flex-1 md:flex-initial bg-slate-50 border border-slate-300 rounded-xl px-3 py-2 text-xs text-slate-900 font-bold focus:border-amber-500 focus:outline-none"
          >
            <option value="todos">Todos os Status</option>
            <option value="em_andamento">Em Andamento</option>
            <option value="aguardando_audiencia">Aguardando Audiência</option>
            <option value="recurso">Em Recurso</option>
            <option value="ganho">Procedente (Ganho)</option>
            <option value="arquivado">Arquivado</option>
          </select>

          <select
            value={selectedArea}
            onChange={e => setSelectedArea(e.target.value)}
            className="flex-1 md:flex-initial bg-slate-50 border border-slate-300 rounded-xl px-3 py-2 text-xs text-slate-900 font-bold focus:border-amber-500 focus:outline-none"
          >
            <option value="todos">Todas as Áreas</option>
            <option value="Cível">Cível</option>
            <option value="Trabalhista">Trabalhista</option>
            <option value="Família e Sucessões">Família</option>
            <option value="Penal">Penal</option>
            <option value="Tributário">Tributário</option>
          </select>
        </div>
      </div>

      {/* Process Cards List */}
      <div className="space-y-4">
        {filteredProcessos.length === 0 ? (
          <div className="text-center py-12 glass-panel bg-white rounded-2xl border border-slate-200 shadow-sm">
            <AlertCircle className="w-10 h-10 text-slate-400 mx-auto mb-2" />
            <p className="text-sm font-bold text-slate-900">Nenhum processo encontrado</p>
            <p className="text-xs text-slate-500 mt-1">Tente ajustar a busca por Vara ou cadastrar um novo processo.</p>
          </div>
        ) : (
          filteredProcessos.map(proc => (
            <div
              key={proc.id}
              className="p-5 rounded-2xl glass-card bg-white border border-slate-200 shadow-sm flex flex-col md:flex-row md:items-center justify-between gap-4"
            >
              <div className="space-y-1.5 flex-1">
                <div className="flex flex-wrap items-center gap-2">
                  <span className="text-xs font-mono font-black text-amber-900 bg-amber-100 px-3 py-0.5 rounded border border-amber-300">
                    {proc.numeroCnj}
                  </span>
                  <span className="text-[10px] font-black px-2 py-0.5 rounded bg-slate-900 text-white uppercase">
                    {proc.tribunal}
                  </span>
                  <span className="text-[10px] font-bold px-2 py-0.5 rounded bg-slate-100 text-slate-800 border border-slate-300">
                    {proc.area}
                  </span>
                  {getStatusBadge(proc.status)}
                </div>

                <h3 className="text-base font-extrabold text-slate-900 pt-1">
                  {proc.papelCliente}: <span className="text-amber-700">{proc.clienteNome}</span> x {proc.parteContraria}
                </h3>

                <p className="text-xs text-slate-700 font-medium flex items-center gap-1">
                  <MapPin className="w-3.5 h-3.5 text-amber-600 flex-shrink-0" />
                  {proc.vara} • {proc.classe}
                </p>

                <div className="flex flex-wrap items-center gap-4 text-xs text-slate-600 font-medium pt-1">
                  <span>Valor Causa: <strong className="text-slate-900 font-mono font-black">R$ {proc.valorCausa.toLocaleString('pt-BR')}</strong></span>
                  <span>Distribuído em: <strong className="text-slate-900">{proc.dataDistribuicao}</strong></span>
                </div>
              </div>

              {/* Actions & Drawer Trigger */}
              <div className="flex flex-col sm:flex-row items-stretch sm:items-center gap-2 pt-2 md:pt-0 border-t md:border-t-0 border-slate-100 justify-between md:justify-end">
                <select
                  value={proc.status}
                  onChange={e => updateProcessoStatus(proc.id, e.target.value as StatusProcesso)}
                  className="bg-slate-100 border border-slate-300 rounded-xl px-2.5 py-2 text-xs text-slate-900 font-bold focus:outline-none"
                >
                  <option value="em_andamento">Em Andamento</option>
                  <option value="aguardando_audiencia">Aguardando Audiência</option>
                  <option value="recurso">Em Recurso</option>
                  <option value="ganho">Ganho (Procedente)</option>
                  <option value="arquivado">Arquivado</option>
                </select>

                <button
                  onClick={() => setActiveProcessoDetail(proc)}
                  className="px-4 py-2 rounded-xl bg-amber-500 hover:bg-amber-600 text-slate-950 font-black text-xs transition-all flex items-center justify-center gap-1.5 shadow-sm"
                >
                  <BookOpen className="w-4 h-4" />
                  📖 Ver Processo por Inteiro
                </button>
              </div>

            </div>
          ))
        )}
      </div>

      {/* Full Lawsuit Jacket Modal (Ver Processo por Inteiro / Autos Digitais) */}
      {activeProcessoDetail && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-slate-900/70 backdrop-blur-sm animate-in fade-in">
          <div className="w-full max-w-4xl bg-white rounded-2xl border border-slate-200 shadow-2xl p-6 relative max-h-[92vh] overflow-y-auto text-slate-900">
            
            <button
              onClick={() => setActiveProcessoDetail(null)}
              className="absolute top-4 right-4 text-slate-400 hover:text-slate-900 transition-colors"
            >
              <X className="w-6 h-6" />
            </button>

            {/* Capa do Processo Header */}
            <div className="border-b border-slate-200 pb-4 mb-5">
              <div className="flex flex-wrap items-center justify-between gap-2">
                <div className="flex items-center gap-2">
                  <span className="text-sm font-mono font-black text-amber-900 bg-amber-100 px-3 py-1 rounded border border-amber-300">
                    Nº CNJ: {activeProcessoDetail.numeroCnj}
                  </span>
                  {getStatusBadge(activeProcessoDetail.status)}
                </div>

                <div className="flex items-center gap-2">
                  <button
                    onClick={() => window.print()}
                    className="px-3 py-1.5 rounded-xl bg-slate-100 hover:bg-slate-200 text-slate-800 font-bold text-xs flex items-center gap-1 border border-slate-300"
                  >
                    <Printer className="w-3.5 h-3.5" /> Imprensa / PDF
                  </button>
                </div>
              </div>

              <h2 className="text-xl font-black font-outfit text-slate-900 mt-3">
                {activeProcessoDetail.clienteNome} x {activeProcessoDetail.parteContraria}
              </h2>
              <p className="text-xs text-slate-600 font-bold mt-1 flex items-center gap-1">
                <MapPin className="w-3.5 h-3.5 text-amber-600" />
                {activeProcessoDetail.vara} • {activeProcessoDetail.tribunal} • {activeProcessoDetail.area}
              </p>
            </div>

            {/* Ficha da Capa do Processo */}
            <div className="grid grid-cols-2 sm:grid-cols-4 gap-3 p-4 rounded-xl bg-slate-50 border border-slate-200 mb-6 text-xs">
              <div>
                <span className="text-slate-500 font-semibold block text-[10px] uppercase">Classe Processual</span>
                <strong className="text-slate-900 font-bold">{activeProcessoDetail.classe}</strong>
              </div>
              <div>
                <span className="text-slate-500 font-semibold block text-[10px] uppercase">Valor da Causa</span>
                <strong className="text-amber-800 font-mono font-black">R$ {activeProcessoDetail.valorCausa.toLocaleString('pt-BR')}</strong>
              </div>
              <div>
                <span className="text-slate-500 font-semibold block text-[10px] uppercase">Data Distribuição</span>
                <strong className="text-slate-900 font-bold">{activeProcessoDetail.dataDistribuicao}</strong>
              </div>
              <div>
                <span className="text-slate-500 font-semibold block text-[10px] uppercase">Advogado Responsável</span>
                <strong className="text-slate-900 font-bold">{activeProcessoDetail.advogadoResponsavel}</strong>
              </div>
            </div>

            {/* Form to attach new piece directly to lawsuit */}
            <div className="p-4 rounded-xl bg-amber-500/10 border border-amber-500/30 mb-6 space-y-3">
              <h4 className="text-xs font-black text-amber-900 uppercase tracking-wider flex items-center gap-1.5">
                <Upload className="w-4 h-4 text-amber-700" />
                Anexar ou Protocolar Nova Peça aos Autos Digitais
              </h4>

              <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                <input
                  type="text"
                  placeholder="Título da Peça (ex: Réplica à Contestação, Guia de Custas)"
                  value={novaPecaTitulo}
                  onChange={e => setNovaPecaTitulo(e.target.value)}
                  className="bg-white border border-slate-300 rounded-xl px-3 py-2 text-xs text-slate-900 font-medium focus:border-amber-500 focus:outline-none"
                />

                <input
                  type="text"
                  placeholder="Resumo ou observação da intimação..."
                  value={novaPecaDescricao}
                  onChange={e => setNovaPecaDescricao(e.target.value)}
                  className="bg-white border border-slate-300 rounded-xl px-3 py-2 text-xs text-slate-900 font-medium focus:border-amber-500 focus:outline-none"
                />
              </div>

              <div className="flex items-center gap-2 pt-1">
                <button
                  onClick={() => processCameraInputRef.current?.click()}
                  className="px-3.5 py-2 rounded-xl bg-amber-500 hover:bg-amber-600 text-slate-950 font-black text-xs flex items-center gap-1.5 shadow-sm"
                >
                  <Camera className="w-4 h-4" /> 📷 Escanear Peça (Câmera)
                </button>

                <button
                  onClick={() => processFileInputRef.current?.click()}
                  className="px-3.5 py-2 rounded-xl bg-slate-900 hover:bg-slate-800 text-white font-bold text-xs flex items-center gap-1.5 shadow-sm"
                >
                  <Upload className="w-4 h-4 text-amber-400" /> 📁 Anexar Arquivo/PDF
                </button>
              </div>
            </div>

            {/* Autos Digitais Timeline (Inteiro Teor do Processo) */}
            <div className="space-y-4">
              <h3 className="text-sm font-black text-slate-900 uppercase tracking-wider flex items-center gap-2">
                <BookOpen className="w-4 h-4 text-amber-600" />
                Inteiro Teor dos Autos Digitais (Linha do Tempo Cronológica)
              </h3>

              <div className="space-y-3">
                {activeProcessoDetail.movimentacoes.map(m => (
                  <div key={m.id} className="p-4 rounded-xl bg-slate-50 border border-slate-200 space-y-2">
                    <div className="flex items-center justify-between border-b border-slate-200 pb-2">
                      <span className="text-xs font-extrabold text-slate-900 flex items-center gap-2">
                        <FileCheck className="w-4 h-4 text-amber-700" />
                        {m.titulo}
                      </span>
                      <span className="text-[11px] text-slate-500 font-mono font-bold">{m.data}</span>
                    </div>

                    <p className="text-xs text-slate-700 font-medium leading-relaxed">{m.descricao}</p>

                    <div className="flex items-center justify-between pt-1 text-[11px]">
                      <span className="text-slate-500 font-semibold">Origem: <strong className="text-slate-900">{m.origem}</strong></span>
                      {m.anexoNome && (
                        <span className="font-bold text-amber-800 flex items-center gap-1">
                          <FileText className="w-3.5 h-3.5" /> Anexo: {m.anexoNome}
                        </span>
                      )}
                    </div>
                  </div>
                ))}
              </div>
            </div>

            <div className="mt-6 pt-4 border-t border-slate-100 flex justify-end">
              <button
                onClick={() => setActiveProcessoDetail(null)}
                className="px-6 py-2.5 rounded-xl bg-slate-900 text-white font-bold text-xs hover:bg-slate-800 transition-colors"
              >
                Concluir Visualização
              </button>
            </div>

          </div>
        </div>
      )}

    </div>
  );
};
