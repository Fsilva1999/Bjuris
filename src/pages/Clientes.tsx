import React, { useState, useRef } from 'react';
import { useLegal } from '../context/LegalContext';
import { Cliente, DocumentoCliente } from '../types/legal';
import {
  Users,
  User,
  Building,
  Search,
  Plus,
  Phone,
  Mail,
  MapPin,
  FileText,
  Briefcase,
  Camera,
  Upload,
  CheckCircle2,
  X,
  FileCheck,
  Shield,
  MessageCircle,
  Paperclip,
  Eye,
  FolderOpen,
  Edit3
} from 'lucide-react';

export const Clientes: React.FC = () => {
  const { clientes, processos, setModalState, addDocumentoCliente, updateCliente } = useLegal();

  const [searchTerm, setSearchTerm] = useState('');
  const [filterTipo, setFilterTipo] = useState<'todos' | 'PF' | 'PJ'>('todos');
  const [selectedCliente, setSelectedCliente] = useState<Cliente | null>(null);
  const [editingCliente, setEditingCliente] = useState<Cliente | null>(null);

  // File Upload & Camera Scan State for Selected Client
  const cameraInputRef = useRef<HTMLInputElement>(null);
  const fileInputRef = useRef<HTMLInputElement>(null);

  const [targetClienteForScan, setTargetClienteForScan] = useState<Cliente | null>(null);
  const [docTipoSelect, setDocTipoSelect] = useState<'RG' | 'CPF' | 'CNH' | 'Comprovante de Residência' | 'Certidão' | 'Procuração Assinada' | 'Outros'>('RG');
  const [docTitulo, setDocTitulo] = useState('');

  const filteredClientes = clientes.filter(c => {
    const matchesSearch =
      c.nome.toLowerCase().includes(searchTerm.toLowerCase()) ||
      c.documento.toLowerCase().includes(searchTerm.toLowerCase()) ||
      (c.rgOuIe && c.rgOuIe.toLowerCase().includes(searchTerm.toLowerCase())) ||
      c.email.toLowerCase().includes(searchTerm.toLowerCase());

    const matchesTipo = filterTipo === 'todos' || c.tipo === filterTipo;

    return matchesSearch && matchesTipo;
  });

  const getClienteProcessos = (clienteId: string) => {
    return processos.filter(p => p.clienteId === clienteId);
  };

  const handleGerarProcuracao = (cliente: Cliente) => {
    setModalState(prev => ({
      ...prev,
      procuracao: true,
      clienteParaProcuracao: cliente
    }));
  };

  const handleAddDocumentoDirect = (cliente: Cliente, origem: 'upload' | 'camera_scan', file?: File) => {
    const tituloDoc = docTitulo || `${docTipoSelect} - ${file ? file.name : 'Digitalizado via Câmera'}`;

    addDocumentoCliente(cliente.id, {
      tipo: docTipoSelect,
      titulo: tituloDoc,
      origem,
      tamanhoKb: file ? Math.round(file.size / 1024) : 450
    });

    setDocTitulo('');
    alert(`Documento "${docTipoSelect}" anexado ao cliente ${cliente.nome} com sucesso!`);
    setSelectedCliente(cliente);
  };

  return (
    <div className="space-y-6 animate-in fade-in duration-300 w-full">
      
      {/* Hidden File / Camera Inputs for direct action */}
      <input
        type="file"
        accept="image/*"
        capture="environment"
        ref={cameraInputRef}
        onChange={e => {
          if (e.target.files && e.target.files[0] && targetClienteForScan) {
            handleAddDocumentoDirect(targetClienteForScan, 'camera_scan', e.target.files[0]);
          }
        }}
        className="hidden"
      />

      <input
        type="file"
        accept="image/*,.pdf,.doc,.docx"
        ref={fileInputRef}
        onChange={e => {
          if (e.target.files && e.target.files[0] && targetClienteForScan) {
            handleAddDocumentoDirect(targetClienteForScan, 'upload', e.target.files[0]);
          }
        }}
        className="hidden"
      />

      {/* Header */}
      <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4">
        <div>
          <h2 className="text-2xl font-black font-outfit text-slate-900 flex items-center gap-2">
            <Users className="w-7 h-7 text-amber-600" />
            CRM de Clientes & Documentos Anexados
          </h2>
          <p className="text-xs text-slate-600 font-medium">
            Qualificação jurídica completa, escaneamento por câmera (RG/CNH/CPF) e visualização de documentos
          </p>
        </div>

        <div className="flex items-center gap-2 w-full sm:w-auto">
          <button
            onClick={() => setModalState(prev => ({ ...prev, novoCliente: true }))}
            className="flex-1 sm:flex-initial px-5 py-2.5 rounded-xl bg-slate-900 text-white font-extrabold text-xs hover:bg-slate-800 transition-all flex items-center justify-center gap-2 shadow-md"
          >
            <Plus className="w-4 h-4 text-amber-400" />
            + Novo Cliente
          </button>
        </div>
      </div>

      {/* Filter & Search Bar */}
      <div className="glass-panel bg-white p-4 rounded-2xl border border-slate-200 shadow-sm flex flex-col sm:flex-row items-center gap-3">
        <div className="relative flex-1 w-full">
          <Search className="w-4 h-4 text-amber-600 absolute left-3 top-3" />
          <input
            type="text"
            placeholder="Buscar por Nome, CPF/CNPJ, RG ou E-mail do cliente..."
            value={searchTerm}
            onChange={e => setSearchTerm(e.target.value)}
            className="w-full bg-slate-50 border border-slate-300 rounded-xl pl-9 pr-4 py-2 text-xs text-slate-900 font-medium focus:border-amber-500 focus:bg-white focus:outline-none"
          />
        </div>

        <div className="flex items-center gap-2 w-full sm:w-auto">
          <button
            onClick={() => setFilterTipo('todos')}
            className={`px-3.5 py-2 rounded-xl text-xs font-bold transition-all ${
              filterTipo === 'todos' ? 'bg-amber-500 text-slate-950 shadow-sm font-black' : 'bg-slate-100 text-slate-700'
            }`}
          >
            Todos ({clientes.length})
          </button>
          <button
            onClick={() => setFilterTipo('PF')}
            className={`px-3.5 py-2 rounded-xl text-xs font-bold transition-all ${
              filterTipo === 'PF' ? 'bg-amber-500 text-slate-950 shadow-sm font-black' : 'bg-slate-100 text-slate-700'
            }`}
          >
            Pessoa Física (PF)
          </button>
          <button
            onClick={() => setFilterTipo('PJ')}
            className={`px-3.5 py-2 rounded-xl text-xs font-bold transition-all ${
              filterTipo === 'PJ' ? 'bg-amber-500 text-slate-950 shadow-sm font-black' : 'bg-slate-100 text-slate-700'
            }`}
          >
            Pessoa Jurídica (PJ)
          </button>
        </div>
      </div>

      {/* Clients Cards Grid */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-5">
        {filteredClientes.map(c => {
          const procs = getClienteProcessos(c.id);
          const cleanWhatsapp = c.whatsapp.replace(/\D/g, '');
          const qtdDocs = (c.documentosAnexados || []).length;

          return (
            <div
              key={c.id}
              className="p-5 rounded-2xl glass-card bg-white border border-slate-200 flex flex-col justify-between space-y-4 shadow-sm"
            >
              <div>
                <div className="flex items-center justify-between">
                  <span className={`text-[10px] font-black px-2.5 py-0.5 rounded uppercase flex items-center gap-1 ${
                    c.tipo === 'PF' ? 'bg-emerald-100 text-emerald-800 border border-emerald-300' : 'bg-blue-100 text-blue-800 border border-blue-300'
                  }`}>
                    {c.tipo === 'PF' ? <User className="w-3 h-3" /> : <Building className="w-3 h-3" />}
                    {c.tipo}
                  </span>

                  <span className="text-[11px] text-slate-500 font-mono font-semibold">
                    Cadastrado {c.dataCadastro}
                  </span>
                </div>

                <h3 className="text-base font-extrabold text-slate-900 mt-2.5">{c.nome}</h3>
                <p className="text-xs text-amber-700 font-mono font-bold mt-0.5">CPF/CNPJ: {c.documento}</p>

                <div className="mt-3 space-y-1.5 text-xs text-slate-700 font-medium">
                  {c.rgOuIe && (
                    <p className="text-slate-800">RG/IE: <strong className="text-slate-900">{c.rgOuIe}</strong></p>
                  )}
                  {c.email && (
                    <div className="flex items-center gap-2">
                      <Mail className="w-3.5 h-3.5 text-amber-600" />
                      <span className="truncate">{c.email}</span>
                    </div>
                  )}
                  {c.whatsapp && (
                    <div className="flex items-center gap-2">
                      <Phone className="w-3.5 h-3.5 text-emerald-600" />
                      <span>{c.whatsapp}</span>
                    </div>
                  )}
                  {c.endereco && (
                    <div className="flex items-center gap-2">
                      <MapPin className="w-3.5 h-3.5 text-red-600 flex-shrink-0" />
                      <span className="truncate">{c.endereco}</span>
                    </div>
                  )}
                </div>

                {/* Highlighted Document Box on Card */}
                <div className="mt-4 p-3 rounded-xl bg-amber-500/10 border border-amber-500/30 flex items-center justify-between">
                  <div className="flex items-center gap-2">
                    <Paperclip className="w-4 h-4 text-amber-700" />
                    <span className="text-xs font-bold text-slate-900">
                      {qtdDocs} documento(s) salvo(s)
                    </span>
                  </div>
                  <button
                    onClick={() => setSelectedCliente(c)}
                    className="text-xs font-black text-amber-800 hover:underline flex items-center gap-1"
                  >
                    <Eye className="w-3.5 h-3.5" />
                    Ver Todos
                  </button>
                </div>
              </div>

              {/* Direct Action Scanner & Buttons Bar on Card */}
              <div className="pt-3 border-t border-slate-100 space-y-2">
                <div className="grid grid-cols-2 gap-2">
                  <button
                    onClick={() => {
                      setTargetClienteForScan(c);
                      cameraInputRef.current?.click();
                    }}
                    className="px-2.5 py-2 rounded-xl bg-amber-500 hover:bg-amber-600 text-slate-950 font-black text-xs transition-all flex items-center justify-center gap-1 shadow-sm"
                    title="Fotografar documento pela câmera do celular/PC"
                  >
                    <Camera className="w-3.5 h-3.5" />
                    📷 Escanear
                  </button>

                  <button
                    onClick={() => {
                      setTargetClienteForScan(c);
                      fileInputRef.current?.click();
                    }}
                    className="px-2.5 py-2 rounded-xl bg-slate-900 hover:bg-slate-800 text-white font-bold text-xs transition-all flex items-center justify-center gap-1 shadow-sm"
                    title="Anexar arquivo PDF ou Foto"
                  >
                    <Upload className="w-3.5 h-3.5 text-amber-400" />
                    📁 Anexar Doc
                  </button>
                </div>

                <div className="grid grid-cols-3 gap-1.5">
                  <a
                    href={`https://wa.me/55${cleanWhatsapp}`}
                    target="_blank"
                    rel="noreferrer"
                    className="px-2 py-1.5 rounded-xl bg-emerald-100 hover:bg-emerald-200 text-emerald-900 text-xs font-bold transition-colors flex items-center justify-center gap-1"
                  >
                    <MessageCircle className="w-3.5 h-3.5 text-emerald-700" />
                    WhatsApp
                  </a>

                  <button
                    onClick={() => setEditingCliente(c)}
                    className="px-2 py-1.5 rounded-xl bg-amber-100 hover:bg-amber-200 text-amber-950 font-bold text-xs transition-all flex items-center justify-center gap-1 border border-amber-300"
                  >
                    <Edit3 className="w-3.5 h-3.5 text-amber-700" />
                    Editar
                  </button>

                  <button
                    onClick={() => handleGerarProcuracao(c)}
                    className="px-2 py-1.5 rounded-xl bg-slate-100 hover:bg-slate-200 text-slate-900 font-bold text-xs transition-all flex items-center justify-center gap-1 border border-slate-300"
                  >
                    <FileText className="w-3.5 h-3.5 text-amber-600" />
                    Procuração
                  </button>
                </div>
              </div>

            </div>
          );
        })}
      </div>

      {/* Document Scanner & Viewing Modal */}
      {selectedCliente && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-slate-900/60 backdrop-blur-sm animate-in fade-in">
          <div className="w-full max-w-3xl bg-white rounded-2xl border border-slate-200 shadow-2xl p-6 relative max-h-[92vh] overflow-y-auto">
            
            <button
              onClick={() => setSelectedCliente(null)}
              className="absolute top-4 right-4 text-slate-400 hover:text-slate-900 transition-colors"
            >
              <X className="w-6 h-6" />
            </button>

            <div className="flex items-center gap-3 mb-5 pb-3 border-b border-slate-100">
              <div className="p-3 rounded-xl bg-amber-100 text-amber-800 border border-amber-300">
                <FolderOpen className="w-6 h-6" />
              </div>
              <div>
                <h3 className="text-lg font-extrabold text-slate-900">Documentos de {selectedCliente.nome}</h3>
                <p className="text-xs text-slate-600 font-medium">CPF/CNPJ: {selectedCliente.documento} • Documentos anexados e digitalizados</p>
              </div>
            </div>

            {/* Quick Add Form in Modal */}
            <div className="p-4 rounded-xl bg-slate-50 border border-slate-200 mb-6 space-y-3">
              <h4 className="text-xs font-bold text-slate-900 uppercase tracking-wider flex items-center gap-1.5">
                <Camera className="w-4 h-4 text-amber-600" />
                Digitalizar Novo Documento
              </h4>

              <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                <div>
                  <label className="block text-xs font-bold text-slate-700 mb-1">Tipo de Documento</label>
                  <select
                    value={docTipoSelect}
                    onChange={e => setDocTipoSelect(e.target.value as any)}
                    className="w-full bg-white border border-slate-300 rounded-xl px-3 py-2 text-xs text-slate-900 font-medium focus:border-amber-500 focus:outline-none"
                  >
                    <option value="RG">RG (Carteira de Identidade)</option>
                    <option value="CPF">CPF</option>
                    <option value="CNH">CNH (Carteira de Habilitação)</option>
                    <option value="Comprovante de Residência">Comprovante de Residência</option>
                    <option value="Certidão">Certidão de Casamento/Nascimento</option>
                    <option value="Procuração Assinada">Procuração Assinada</option>
                    <option value="Outros">Outros Documentos</option>
                  </select>
                </div>

                <div>
                  <label className="block text-xs font-bold text-slate-700 mb-1">Título Personalizado (Opcional)</label>
                  <input
                    type="text"
                    placeholder="Ex: CNH de Carlos 2024"
                    value={docTitulo}
                    onChange={e => setDocTitulo(e.target.value)}
                    className="w-full bg-white border border-slate-300 rounded-xl px-3 py-2 text-xs text-slate-900 font-medium focus:border-amber-500 focus:outline-none"
                  />
                </div>
              </div>

              <div className="flex flex-wrap items-center gap-3 pt-2">
                <button
                  type="button"
                  onClick={() => {
                    setTargetClienteForScan(selectedCliente);
                    cameraInputRef.current?.click();
                  }}
                  className="flex-1 sm:flex-initial px-4 py-2.5 rounded-xl bg-amber-500 text-slate-950 font-black text-xs hover:bg-amber-600 transition-all flex items-center justify-center gap-2 shadow-sm"
                >
                  <Camera className="w-4 h-4" />
                  📷 Escanear pela Câmera
                </button>

                <button
                  type="button"
                  onClick={() => {
                    setTargetClienteForScan(selectedCliente);
                    fileInputRef.current?.click();
                  }}
                  className="flex-1 sm:flex-initial px-4 py-2.5 rounded-xl bg-slate-900 hover:bg-slate-800 text-white font-bold text-xs transition-all flex items-center justify-center gap-2 shadow-sm"
                >
                  <Upload className="w-4 h-4 text-amber-400" />
                  📁 Anexar Arquivo / PDF
                </button>
              </div>
            </div>

            {/* List of Attached Documents */}
            <div className="space-y-3">
              <h4 className="text-xs font-bold text-slate-900 uppercase tracking-wider">Documentos Digitais Salvos no Perfil</h4>

              {(selectedCliente.documentosAnexados || []).length === 0 ? (
                <div className="text-center py-8 bg-slate-50 rounded-xl border border-slate-200 text-xs text-slate-500 font-medium">
                  Nenhum documento anexado ainda para este cliente. Use a câmera ou o botão de anexo acima.
                </div>
              ) : (
                selectedCliente.documentosAnexados.map(d => (
                  <div key={d.id} className="p-3.5 rounded-xl bg-white border border-slate-200 flex items-center justify-between gap-3 shadow-sm">
                    <div className="flex items-center gap-3">
                      <div className="p-2 rounded-lg bg-amber-100 text-amber-800 border border-amber-300">
                        <FileCheck className="w-4 h-4" />
                      </div>
                      <div>
                        <span className="text-xs font-bold text-slate-900 block">{d.titulo}</span>
                        <span className="text-[11px] text-slate-500 font-mono font-medium">
                          {d.tipo} • Anexado em {d.dataAnexo} ({d.tamanhoKb} KB)
                        </span>
                      </div>
                    </div>

                    <span className="text-[10px] font-bold px-2 py-0.5 rounded bg-amber-100 text-amber-900 border border-amber-300 uppercase">
                      {d.origem === 'camera_scan' ? '📷 Escaneado' : '📁 Upload'}
                    </span>
                  </div>
                ))
              )}
            </div>

            <div className="mt-6 pt-4 border-t border-slate-100 flex justify-end">
              <button
                onClick={() => setSelectedCliente(null)}
                className="px-5 py-2 rounded-xl bg-slate-900 text-white font-bold text-xs hover:bg-slate-800 transition-colors"
              >
                Concluir
              </button>
            </div>

          </div>
        </div>
      )}

      {/* Modal de Edição de Cliente */}
      {editingCliente && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-slate-900/60 backdrop-blur-sm animate-in fade-in">
          <div className="w-full max-w-2xl bg-white rounded-2xl border border-slate-200 shadow-2xl p-6 relative max-h-[92vh] overflow-y-auto">
            
            <button
              onClick={() => setEditingCliente(null)}
              className="absolute top-4 right-4 text-slate-400 hover:text-slate-900 transition-colors"
            >
              <X className="w-6 h-6" />
            </button>

            <div className="flex items-center gap-3 mb-5 pb-3 border-b border-slate-100">
              <div className="p-3 rounded-xl bg-amber-100 text-amber-800 border border-amber-300">
                <Edit3 className="w-6 h-6" />
              </div>
              <div>
                <h3 className="text-lg font-extrabold text-slate-900">Editar Cadastro do Cliente</h3>
                <p className="text-xs text-slate-600 font-medium">Atualize os dados cadastrais de {editingCliente.nome}</p>
              </div>
            </div>

            <form
              onSubmit={e => {
                e.preventDefault();
                const form = e.target as HTMLFormElement;
                const formData = new FormData(form);
                updateCliente(editingCliente.id, {
                  nome: formData.get('nome') as string,
                  tipo: formData.get('tipo') as 'PF' | 'PJ',
                  documento: formData.get('documento') as string,
                  rgOuIe: formData.get('rgOuIe') as string,
                  cnh: formData.get('cnh') as string,
                  email: formData.get('email') as string,
                  telefone: formData.get('telefone') as string,
                  whatsapp: formData.get('whatsapp') as string,
                  profissaoOuRamo: formData.get('profissaoOuRamo') as string,
                  estadoCivil: formData.get('estadoCivil') as string,
                  nacionalidade: formData.get('nacionalidade') as string,
                  endereco: formData.get('endereco') as string,
                  observacoes: formData.get('observacoes') as string,
                });
                setEditingCliente(null);
                alert('✅ Cadastro do cliente atualizado com sucesso!');
              }}
              className="space-y-4 text-xs"
            >
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                <div>
                  <label className="block font-bold text-slate-700 mb-1">Tipo de Cliente</label>
                  <select
                    name="tipo"
                    defaultValue={editingCliente.tipo}
                    className="w-full bg-slate-50 border border-slate-300 rounded-xl px-3 py-2 text-slate-900 font-bold focus:border-amber-500 focus:outline-none"
                  >
                    <option value="PF">Pessoa Física (PF)</option>
                    <option value="PJ">Pessoa Jurídica (PJ)</option>
                  </select>
                </div>

                <div>
                  <label className="block font-bold text-slate-700 mb-1">Nome Completo / Razão Social</label>
                  <input
                    type="text"
                    name="nome"
                    defaultValue={editingCliente.nome}
                    required
                    className="w-full bg-slate-50 border border-slate-300 rounded-xl px-3 py-2 text-slate-900 font-medium focus:border-amber-500 focus:outline-none"
                  />
                </div>
              </div>

              <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
                <div>
                  <label className="block font-bold text-slate-700 mb-1">CPF ou CNPJ</label>
                  <input
                    type="text"
                    name="documento"
                    defaultValue={editingCliente.documento}
                    required
                    className="w-full bg-slate-50 border border-slate-300 rounded-xl px-3 py-2 text-slate-900 font-medium focus:border-amber-500 focus:outline-none"
                  />
                </div>

                <div>
                  <label className="block font-bold text-slate-700 mb-1">RG ou Inscrição Estadual</label>
                  <input
                    type="text"
                    name="rgOuIe"
                    defaultValue={editingCliente.rgOuIe || ''}
                    className="w-full bg-slate-50 border border-slate-300 rounded-xl px-3 py-2 text-slate-900 font-medium focus:border-amber-500 focus:outline-none"
                  />
                </div>

                <div>
                  <label className="block font-bold text-slate-700 mb-1">CNH (Se houver)</label>
                  <input
                    type="text"
                    name="cnh"
                    defaultValue={editingCliente.cnh || ''}
                    className="w-full bg-slate-50 border border-slate-300 rounded-xl px-3 py-2 text-slate-900 font-medium focus:border-amber-500 focus:outline-none"
                  />
                </div>
              </div>

              <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
                <div>
                  <label className="block font-bold text-slate-700 mb-1">E-mail</label>
                  <input
                    type="email"
                    name="email"
                    defaultValue={editingCliente.email}
                    className="w-full bg-slate-50 border border-slate-300 rounded-xl px-3 py-2 text-slate-900 font-medium focus:border-amber-500 focus:outline-none"
                  />
                </div>

                <div>
                  <label className="block font-bold text-slate-700 mb-1">Telefone</label>
                  <input
                    type="text"
                    name="telefone"
                    defaultValue={editingCliente.telefone}
                    className="w-full bg-slate-50 border border-slate-300 rounded-xl px-3 py-2 text-slate-900 font-medium focus:border-amber-500 focus:outline-none"
                  />
                </div>

                <div>
                  <label className="block font-bold text-slate-700 mb-1">WhatsApp</label>
                  <input
                    type="text"
                    name="whatsapp"
                    defaultValue={editingCliente.whatsapp}
                    className="w-full bg-slate-50 border border-slate-300 rounded-xl px-3 py-2 text-slate-900 font-medium focus:border-amber-500 focus:outline-none"
                  />
                </div>
              </div>

              <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
                <div>
                  <label className="block font-bold text-slate-700 mb-1">Profissão / Ramo</label>
                  <input
                    type="text"
                    name="profissaoOuRamo"
                    defaultValue={editingCliente.profissaoOuRamo || ''}
                    className="w-full bg-slate-50 border border-slate-300 rounded-xl px-3 py-2 text-slate-900 font-medium focus:border-amber-500 focus:outline-none"
                  />
                </div>

                <div>
                  <label className="block font-bold text-slate-700 mb-1">Estado Civil</label>
                  <input
                    type="text"
                    name="estadoCivil"
                    defaultValue={editingCliente.estadoCivil || ''}
                    className="w-full bg-slate-50 border border-slate-300 rounded-xl px-3 py-2 text-slate-900 font-medium focus:border-amber-500 focus:outline-none"
                  />
                </div>

                <div>
                  <label className="block font-bold text-slate-700 mb-1">Nacionalidade</label>
                  <input
                    type="text"
                    name="nacionalidade"
                    defaultValue={editingCliente.nacionalidade || 'Brasileiro(a)'}
                    className="w-full bg-slate-50 border border-slate-300 rounded-xl px-3 py-2 text-slate-900 font-medium focus:border-amber-500 focus:outline-none"
                  />
                </div>
              </div>

              <div>
                <label className="block font-bold text-slate-700 mb-1">Endereço Completo</label>
                <input
                  type="text"
                  name="endereco"
                  defaultValue={editingCliente.endereco}
                  className="w-full bg-slate-50 border border-slate-300 rounded-xl px-3 py-2 text-slate-900 font-medium focus:border-amber-500 focus:outline-none"
                />
              </div>

              <div>
                <label className="block font-bold text-slate-700 mb-1">Observações do Cliente</label>
                <textarea
                  name="observacoes"
                  rows={3}
                  defaultValue={editingCliente.observacoes || ''}
                  className="w-full bg-slate-50 border border-slate-300 rounded-xl px-3 py-2 text-slate-900 font-medium focus:border-amber-500 focus:outline-none"
                />
              </div>

              <div className="pt-4 border-t border-slate-100 flex items-center justify-end gap-2">
                <button
                  type="button"
                  onClick={() => setEditingCliente(null)}
                  className="px-5 py-2.5 rounded-xl bg-slate-100 text-slate-700 font-bold text-xs hover:bg-slate-200 transition-colors"
                >
                  Cancelar
                </button>
                <button
                  type="submit"
                  className="px-6 py-2.5 rounded-xl btn-gold-3d text-slate-950 font-black text-xs shadow-md transition-all"
                >
                  Salvar Alterações
                </button>
              </div>
            </form>

          </div>
        </div>
      )}

    </div>
  );
};
