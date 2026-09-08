import React, { useState, useRef } from 'react';
import { useLegal } from '../../context/LegalContext';
import { PrazoAudiencia, TipoPrazo, PrioridadePrazo } from '../../types/legal';
import {
  X,
  Calendar,
  Clock,
  CheckCircle2,
  FileText,
  Upload,
  Camera,
  Archive,
  Trash2,
  Edit3,
  Video,
  MapPin,
  AlertTriangle,
  FileCheck,
  Building,
  User,
  Check,
  ChevronRight
} from 'lucide-react';

interface DetalhesPrazoModalProps {
  prazo: PrazoAudiencia | null;
  onClose: () => void;
}

export const DetalhesPrazoModal: React.FC<DetalhesPrazoModalProps> = ({ prazo, onClose }) => {
  const {
    updatePrazo,
    deletePrazo,
    togglePrazoConcluido,
    updateProcessoStatus,
    addMovimentacaoProcesso,
    processos
  } = useLegal();

  const [activeTab, setActiveTab] = useState<'editar' | 'anexar' | 'acoes'>('editar');

  // Form states initialized with current prazo values
  const [titulo, setTitulo] = useState(prazo?.titulo || '');
  const [dataHora, setDataHora] = useState(() => {
    if (!prazo?.dataHora) return '';
    try {
      const d = new Date(prazo.dataHora);
      return d.toISOString().slice(0, 16);
    } catch {
      return '';
    }
  });
  const [tipo, setTipo] = useState<TipoPrazo>(prazo?.tipo || 'prazo_fatal');
  const [prioridade, setPrioridade] = useState<PrioridadePrazo>(prazo?.prioridade || 'normal');
  const [linkOnline, setLinkOnline] = useState(prazo?.linkOnline || '');
  const [local, setLocal] = useState(prazo?.local || '');
  const [observacao, setObservacao] = useState(prazo?.observacao || '');
  const [responsavel, setResponsavel] = useState(prazo?.responsavel || 'Dr. Victor Hugo Silva');

  // Attachment states
  const [anexoTitulo, setAnexoTitulo] = useState('');
  const [anexoDescricao, setAnexoDescricao] = useState('');
  const [anexoSucesso, setAnexoSucesso] = useState(false);

  const fileInputRef = useRef<HTMLInputElement>(null);
  const cameraInputRef = useRef<HTMLInputElement>(null);

  if (!prazo) return null;

  const processoVinculado = processos.find(
    p => p.id === prazo.processoId || p.numeroCnj === prazo.processoNumero
  );

  // Quick date add helper
  const addDaysToDate = (days: number) => {
    const current = dataHora ? new Date(dataHora) : new Date();
    current.setDate(current.getDate() + days);
    setDataHora(current.toISOString().slice(0, 16));
  };

  const handleSalvarEdicao = (e: React.FormEvent) => {
    e.preventDefault();
    updatePrazo(prazo.id, {
      titulo,
      dataHora: dataHora ? new Date(dataHora).toISOString() : prazo.dataHora,
      tipo,
      prioridade,
      linkOnline: linkOnline || undefined,
      local: local || undefined,
      observacao: observacao || undefined,
      responsavel
    });
    alert('Prazo / Remarcação salva com sucesso!');
    onClose();
  };

  const handleAnexarArquivo = (origem: 'upload' | 'camera_scan', file?: File) => {
    const nomeArquivo = file ? file.name : 'documento_anexo.pdf';
    const tituloFinal = anexoTitulo || `Anexo - ${nomeArquivo}`;
    const descFinal = anexoDescricao || `Documento anexado referente ao prazo "${prazo.titulo}".`;

    addMovimentacaoProcesso(
      prazo.processoNumero || prazo.processoId,
      tituloFinal,
      descFinal,
      nomeArquivo
    );

    setAnexoSucesso(true);
    setAnexoTitulo('');
    setAnexoDescricao('');
    setTimeout(() => setAnexoSucesso(false), 4000);
  };

  const handleArquivarProcesso = () => {
    if (processoVinculado) {
      if (confirm(`Deseja realmente arquivar o processo ${processoVinculado.numeroCnj}?`)) {
        updateProcessoStatus(processoVinculado.id, 'arquivado');
        alert('Processo arquivado com sucesso!');
      }
    } else {
      alert('Processo não encontrado no cadastro.');
    }
  };

  const handleExcluirPrazo = () => {
    if (confirm('Tem certeza que deseja excluir este prazo/audiência?')) {
      deletePrazo(prazo.id);
      onClose();
    }
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-slate-900/70 backdrop-blur-sm animate-in fade-in">
      {/* Hidden input elements */}
      <input
        type="file"
        accept="image/*,.pdf,.doc,.docx"
        ref={fileInputRef}
        onChange={e => {
          if (e.target.files && e.target.files[0]) {
            handleAnexarArquivo('upload', e.target.files[0]);
          }
        }}
        className="hidden"
      />
      <input
        type="file"
        accept="image/*"
        capture="environment"
        ref={cameraInputRef}
        onChange={e => {
          if (e.target.files && e.target.files[0]) {
            handleAnexarArquivo('camera_scan', e.target.files[0]);
          }
        }}
        className="hidden"
      />

      <div className="w-full max-w-2xl bg-white rounded-3xl border border-slate-200 shadow-2xl overflow-hidden flex flex-col max-h-[92vh] animate-in zoom-in-95">
        
        {/* Header */}
        <div className="p-5 bg-gradient-to-r from-slate-900 via-slate-800 to-slate-950 text-white flex items-start justify-between gap-4 border-b border-amber-500/30 relative">
          <div>
            <div className="flex items-center gap-2 mb-1">
              <span className={`text-[10px] px-2.5 py-0.5 rounded font-black uppercase tracking-wider ${
                prazo.tipo === 'prazo_fatal' ? 'bg-red-500/20 text-red-300 border border-red-500/40' :
                prazo.tipo === 'audiencia_online' ? 'bg-blue-500/20 text-blue-300 border border-blue-500/40' :
                'bg-emerald-500/20 text-emerald-300 border border-emerald-500/40'
              }`}>
                {prazo.tipo.replace('_', ' ')}
              </span>
              {prazo.concluido && (
                <span className="text-[10px] px-2.5 py-0.5 rounded bg-emerald-500 text-slate-950 font-black uppercase">
                  Concluído
                </span>
              )}
            </div>
            <h2 className="text-lg font-black font-outfit text-white leading-tight">
              {prazo.titulo}
            </h2>
            <p className="text-xs text-amber-400 font-medium mt-1 font-mono">
              Proc: <strong>{prazo.processoNumero}</strong> • Cliente: {prazo.clienteNome}
            </p>
          </div>

          <button
            onClick={onClose}
            className="p-2 rounded-xl bg-white/10 hover:bg-white/20 text-slate-300 hover:text-white transition-colors"
          >
            <X className="w-5 h-5" />
          </button>
        </div>

        {/* Tab Navigation */}
        <div className="flex items-center border-b border-slate-200 bg-slate-50 px-5 pt-3 gap-2">
          <button
            onClick={() => setActiveTab('editar')}
            className={`px-4 py-2.5 rounded-t-xl text-xs font-black transition-all flex items-center gap-2 border-b-2 ${
              activeTab === 'editar'
                ? 'border-amber-500 text-amber-900 bg-white shadow-sm'
                : 'border-transparent text-slate-600 hover:text-slate-900'
            }`}
          >
            <Edit3 className="w-4 h-4 text-amber-600" />
            Editar / Remarcar Prazo
          </button>

          <button
            onClick={() => setActiveTab('anexar')}
            className={`px-4 py-2.5 rounded-t-xl text-xs font-black transition-all flex items-center gap-2 border-b-2 ${
              activeTab === 'anexar'
                ? 'border-amber-500 text-amber-900 bg-white shadow-sm'
                : 'border-transparent text-slate-600 hover:text-slate-900'
            }`}
          >
            <Upload className="w-4 h-4 text-blue-600" />
            Anexar Peça / Doc
          </button>

          <button
            onClick={() => setActiveTab('acoes')}
            className={`px-4 py-2.5 rounded-t-xl text-xs font-black transition-all flex items-center gap-2 border-b-2 ${
              activeTab === 'acoes'
                ? 'border-amber-500 text-amber-900 bg-white shadow-sm'
                : 'border-transparent text-slate-600 hover:text-slate-900'
            }`}
          >
            <Archive className="w-4 h-4 text-purple-600" />
            Status & Arquivar
          </button>
        </div>

        {/* Modal Content */}
        <div className="p-6 overflow-y-auto flex-1 text-slate-900">
          
          {/* TAB 1: EDITAR / REMARCAR */}
          {activeTab === 'editar' && (
            <form onSubmit={handleSalvarEdicao} className="space-y-4">
              <div>
                <label className="block text-xs font-black text-slate-700 uppercase tracking-wider mb-1">
                  Título do Prazo / Compromisso
                </label>
                <input
                  type="text"
                  required
                  value={titulo}
                  onChange={e => setTitulo(e.target.value)}
                  className="w-full bg-slate-50 border border-slate-300 rounded-xl px-3 py-2 text-xs text-slate-900 font-bold focus:border-amber-500 focus:bg-white focus:outline-none"
                />
              </div>

              {/* Data & Hora com Remarcação Rápida */}
              <div>
                <div className="flex items-center justify-between mb-1">
                  <label className="block text-xs font-black text-slate-700 uppercase tracking-wider">
                    Data e Hora do Vencimento / Audiência
                  </label>
                  <span className="text-[10px] text-amber-700 font-bold">Remarcação Rápida:</span>
                </div>
                
                <input
                  type="datetime-local"
                  required
                  value={dataHora}
                  onChange={e => setDataHora(e.target.value)}
                  className="w-full bg-slate-50 border border-slate-300 rounded-xl px-3 py-2 text-xs text-slate-900 font-mono font-bold focus:border-amber-500 focus:bg-white focus:outline-none mb-2"
                />

                <div className="flex flex-wrap items-center gap-1.5">
                  <button
                    type="button"
                    onClick={() => addDaysToDate(1)}
                    className="px-2.5 py-1 rounded-lg bg-slate-100 hover:bg-slate-200 text-slate-800 text-[11px] font-bold border border-slate-300 transition-colors"
                  >
                    +1 Dia (Amanhã)
                  </button>
                  <button
                    type="button"
                    onClick={() => addDaysToDate(5)}
                    className="px-2.5 py-1 rounded-lg bg-amber-100 hover:bg-amber-200 text-amber-900 text-[11px] font-bold border border-amber-300 transition-colors"
                  >
                    +5 Dias Úteis
                  </button>
                  <button
                    type="button"
                    onClick={() => addDaysToDate(15)}
                    className="px-2.5 py-1 rounded-lg bg-blue-100 hover:bg-blue-200 text-blue-900 text-[11px] font-bold border border-blue-300 transition-colors"
                  >
                    +15 Dias (Réplica/Recurso)
                  </button>
                </div>
              </div>

              <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                <div>
                  <label className="block text-xs font-black text-slate-700 uppercase tracking-wider mb-1">
                    Tipo de Compromisso
                  </label>
                  <select
                    value={tipo}
                    onChange={e => setTipo(e.target.value as TipoPrazo)}
                    className="w-full bg-slate-50 border border-slate-300 rounded-xl px-3 py-2 text-xs text-slate-900 font-bold focus:border-amber-500 focus:outline-none"
                  >
                    <option value="prazo_fatal">Prazo Fatal em Atenção</option>
                    <option value="audiencia_online">Audiência Telepresencial (Zoom/Teams)</option>
                    <option value="audiencia_presencial">Audiência Presencial no Fórum</option>
                    <option value="reuniao">Reunião / Atendimento</option>
                  </select>
                </div>

                <div>
                  <label className="block text-xs font-black text-slate-700 uppercase tracking-wider mb-1">
                    Prioridade
                  </label>
                  <select
                    value={prioridade}
                    onChange={e => setPrioridade(e.target.value as PrioridadePrazo)}
                    className="w-full bg-slate-50 border border-slate-300 rounded-xl px-3 py-2 text-xs text-slate-900 font-bold focus:border-amber-500 focus:outline-none"
                  >
                    <option value="urgente">🚨 URGENTE</option>
                    <option value="alta">⚡ Prioridade Alta</option>
                    <option value="normal">Normal</option>
                  </select>
                </div>
              </div>

              {tipo === 'audiencia_online' && (
                <div>
                  <label className="block text-xs font-black text-blue-800 uppercase tracking-wider mb-1 flex items-center gap-1">
                    <Video className="w-3.5 h-3.5 text-blue-600" />
                    Link da Sala Telepresencial (Zoom / Teams / PJe-JT)
                  </label>
                  <input
                    type="url"
                    placeholder="https://zoom.us/j/... ou https://teams.microsoft.com/..."
                    value={linkOnline}
                    onChange={e => setLinkOnline(e.target.value)}
                    className="w-full bg-blue-50/50 border border-blue-200 rounded-xl px-3 py-2 text-xs text-slate-900 font-mono font-bold focus:border-blue-500 focus:outline-none"
                  />
                </div>
              )}

              {tipo === 'audiencia_presencial' && (
                <div>
                  <label className="block text-xs font-black text-slate-700 uppercase tracking-wider mb-1 flex items-center gap-1">
                    <MapPin className="w-3.5 h-3.5 text-red-600" />
                    Local / Endereço do Fórum ou Vara
                  </label>
                  <input
                    type="text"
                    placeholder="Ex: 1ª Vara Cível de São Luís - Fórum Des. Sarney Costa"
                    value={local}
                    onChange={e => setLocal(e.target.value)}
                    className="w-full bg-slate-50 border border-slate-300 rounded-xl px-3 py-2 text-xs text-slate-900 font-bold focus:border-amber-500 focus:outline-none"
                  />
                </div>
              )}

              <div>
                <label className="block text-xs font-black text-slate-700 uppercase tracking-wider mb-1">
                  Observações / Instruções
                </label>
                <textarea
                  rows={2}
                  value={observacao}
                  onChange={e => setObservacao(e.target.value)}
                  placeholder="Instruções para o dia do prazo ou detalhes da perícia..."
                  className="w-full bg-slate-50 border border-slate-300 rounded-xl px-3 py-2 text-xs text-slate-900 font-medium focus:border-amber-500 focus:outline-none"
                />
              </div>

              <div className="pt-2 flex justify-end gap-2">
                <button
                  type="button"
                  onClick={onClose}
                  className="px-4 py-2 rounded-xl bg-slate-100 text-slate-700 text-xs font-bold hover:bg-slate-200"
                >
                  Cancelar
                </button>
                <button
                  type="submit"
                  className="px-5 py-2 rounded-xl btn-gold-3d text-xs font-black shadow-md flex items-center gap-1.5"
                >
                  <Check className="w-4 h-4 text-slate-950" />
                  Salvar Alterações
                </button>
              </div>
            </form>
          )}

          {/* TAB 2: ANEXAR PEÇA / DOC */}
          {activeTab === 'anexar' && (
            <div className="space-y-4">
              <div className="p-4 rounded-2xl bg-blue-50 border border-blue-200 space-y-1">
                <h4 className="text-xs font-black text-blue-900 uppercase tracking-wider flex items-center gap-1.5">
                  <FileText className="w-4 h-4 text-blue-600" />
                  Anexar Documento aos Autos Digitais
                </h4>
                <p className="text-xs text-slate-600 font-medium">
                  Anexe réplica, petição, laudo de perícia, comprovante ou foto escaneada. O anexo será vinculado automaticamente ao processo <strong className="font-mono text-slate-900">{prazo.processoNumero}</strong>.
                </p>
              </div>

              {anexoSucesso && (
                <div className="p-3 rounded-xl bg-emerald-100 border border-emerald-300 text-emerald-900 text-xs font-bold flex items-center gap-2 animate-in fade-in">
                  <CheckCircle2 className="w-5 h-5 text-emerald-600" />
                  Documento anexado com sucesso aos autos do processo!
                </div>
              )}

              <div>
                <label className="block text-xs font-black text-slate-700 uppercase tracking-wider mb-1">
                  Título ou Nome da Peça
                </label>
                <input
                  type="text"
                  placeholder="Ex: Réplica à Contestação, Protocolo PJe, Laudo Médico"
                  value={anexoTitulo}
                  onChange={e => setAnexoTitulo(e.target.value)}
                  className="w-full bg-slate-50 border border-slate-300 rounded-xl px-3 py-2 text-xs text-slate-900 font-bold focus:border-amber-500 focus:outline-none"
                />
              </div>

              <div>
                <label className="block text-xs font-black text-slate-700 uppercase tracking-wider mb-1">
                  Resumo / Observações do Anexo
                </label>
                <input
                  type="text"
                  placeholder="Ex: Impugnação apresentada no prazo legal..."
                  value={anexoDescricao}
                  onChange={e => setAnexoDescricao(e.target.value)}
                  className="w-full bg-slate-50 border border-slate-300 rounded-xl px-3 py-2 text-xs text-slate-900 font-medium focus:border-amber-500 focus:outline-none"
                />
              </div>

              <div className="pt-2 grid grid-cols-1 sm:grid-cols-2 gap-3">
                <button
                  type="button"
                  onClick={() => cameraInputRef.current?.click()}
                  className="p-4 rounded-2xl bg-amber-500 hover:bg-amber-600 text-slate-950 font-black text-xs flex items-center justify-center gap-2 shadow-md transition-all"
                >
                  <Camera className="w-5 h-5" />
                  📷 Escanear Peça (Câmera)
                </button>

                <button
                  type="button"
                  onClick={() => fileInputRef.current?.click()}
                  className="p-4 rounded-2xl bg-slate-900 hover:bg-slate-800 text-white font-bold text-xs flex items-center justify-center gap-2 shadow-md transition-all"
                >
                  <Upload className="w-5 h-5 text-amber-400" />
                  📁 Upload de Arquivo / PDF
                </button>
              </div>

              {processoVinculado && (
                <div className="mt-4 pt-4 border-t border-slate-200">
                  <span className="text-[11px] font-black text-slate-500 uppercase tracking-wider block mb-2">
                    Movimentações Recentes dos Autos:
                  </span>
                  <div className="space-y-2 max-h-36 overflow-y-auto pr-1">
                    {processoVinculado.movimentacoes.slice(0, 3).map(m => (
                      <div key={m.id} className="p-2.5 rounded-xl bg-slate-50 border border-slate-200 text-xs">
                        <div className="flex items-center justify-between">
                          <strong className="text-slate-900 font-bold">{m.titulo}</strong>
                          <span className="text-[10px] text-amber-800 font-mono font-bold">{m.data}</span>
                        </div>
                        {m.anexoNome && (
                          <span className="text-[10px] text-amber-700 font-bold block mt-0.5">📎 {m.anexoNome}</span>
                        )}
                      </div>
                    ))}
                  </div>
                </div>
              )}
            </div>
          )}

          {/* TAB 3: ACOES, STATUS & ARQUIVAMENTO */}
          {activeTab === 'acoes' && (
            <div className="space-y-4">
              
              {/* Concluir Prazo */}
              <div className="p-4 rounded-2xl bg-slate-50 border border-slate-200 flex items-center justify-between gap-4">
                <div>
                  <h4 className="text-xs font-black text-slate-900 uppercase tracking-wider">
                    Status do Prazo / Compromisso
                  </h4>
                  <p className="text-xs text-slate-600 font-medium mt-0.5">
                    {prazo.concluido
                      ? 'Este prazo está marcado como CUMPRIDO / CONCLUÍDO.'
                      : 'Este prazo ainda consta como PENDENTE no sistema.'}
                  </p>
                </div>

                <button
                  type="button"
                  onClick={() => {
                    togglePrazoConcluido(prazo.id);
                    onClose();
                  }}
                  className={`px-4 py-2 rounded-xl text-xs font-black transition-all shadow-sm ${
                    prazo.concluido
                      ? 'bg-amber-100 text-amber-900 hover:bg-amber-200 border border-amber-300'
                      : 'bg-emerald-600 hover:bg-emerald-700 text-white'
                  }`}
                >
                  {prazo.concluido ? 'Reabrir Prazo' : '✓ Concluir / Cumprir Prazo'}
                </button>
              </div>

              {/* Arquivar Processo */}
              <div className="p-4 rounded-2xl bg-purple-50 border border-purple-200 flex items-center justify-between gap-4">
                <div>
                  <h4 className="text-xs font-black text-purple-900 uppercase tracking-wider flex items-center gap-1.5">
                    <Archive className="w-4 h-4 text-purple-700" />
                    Arquivar Processo Vinculado
                  </h4>
                  <p className="text-xs text-slate-600 font-medium mt-0.5">
                    Processo CNJ: <strong className="font-mono text-slate-900">{prazo.processoNumero}</strong>
                  </p>
                </div>

                <button
                  type="button"
                  onClick={handleArquivarProcesso}
                  className="px-4 py-2 rounded-xl bg-purple-700 hover:bg-purple-800 text-white text-xs font-black transition-all shadow-sm flex items-center gap-1.5"
                >
                  <Archive className="w-4 h-4" />
                  Arquivar Processo
                </button>
              </div>

              {/* Excluir Prazo */}
              <div className="p-4 rounded-2xl bg-red-50 border border-red-200 flex items-center justify-between gap-4">
                <div>
                  <h4 className="text-xs font-black text-red-900 uppercase tracking-wider flex items-center gap-1.5">
                    <Trash2 className="w-4 h-4 text-red-600" />
                    Excluir Este Prazo
                  </h4>
                  <p className="text-xs text-slate-600 font-medium mt-0.5">
                    Remove o registro deste prazo do seu painel e da agenda.
                  </p>
                </div>

                <button
                  type="button"
                  onClick={handleExcluirPrazo}
                  className="px-4 py-2 rounded-xl bg-red-600 hover:bg-red-700 text-white text-xs font-black transition-all shadow-sm flex items-center gap-1.5"
                >
                  <Trash2 className="w-4 h-4" />
                  Excluir
                </button>
              </div>

            </div>
          )}

        </div>

      </div>
    </div>
  );
};
