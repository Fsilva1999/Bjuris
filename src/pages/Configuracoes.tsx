import React, { useState, useRef } from 'react';
import { useLegal } from '../context/LegalContext';
import { useAuth } from '../contexts/AuthContext';
import {
  Settings, User, Bell, Volume2, Database, Save, Upload,
  Image as ImageIcon, Download, FileDown, LogOut, Loader2,
  ShieldCheck, FileJson
} from 'lucide-react';
import { requestNotificationPermission, sendNativeNotification } from '../utils/pwaNotifications';
import jsPDF from 'jspdf';
import autoTable from 'jspdf-autotable';

export const Configuracoes: React.FC = () => {
  const { perfil, setPerfil, logoUrl, setLogoUrl, processos, clientes, prazos, financeiro } = useLegal();
  const { user, signOut } = useAuth();

  const [nome, setNome] = useState(perfil.nome);
  const [oabNumero, setOabNumero] = useState(perfil.oabNumero);
  const [oabUf, setOabUf] = useState(perfil.oabUf);
  const [escritorio, setEscritorio] = useState(perfil.escritorio);
  const [email, setEmail] = useState(perfil.email);
  const [telefone, setTelefone] = useState(perfil.telefone);
  const [cpf, setCpf] = useState(perfil.cpf);
  const [fotoUrl, setFotoUrl] = useState(perfil.fotoUrl);
  const [notificacoesAtivas, setNotificacoesAtivas] = useState(perfil.notificacoesAtivas);
  const [somAlerta, setSomAlerta] = useState(perfil.somAlerta);
  const [pdfLoading, setPdfLoading] = useState(false);
  const [jsonLoading, setJsonLoading] = useState(false);
  const [signOutLoading, setSignOutLoading] = useState(false);

  const logoFileInputRef = useRef<HTMLInputElement>(null);

  const handleSave = (e: React.FormEvent) => {
    e.preventDefault();
    setPerfil({ ...perfil, nome, oabNumero, oabUf, escritorio, email, telefone, cpf, fotoUrl, notificacoesAtivas, somAlerta });
    alert('✅ Configurações salvas com sucesso!');
  };

  const handleLogoUpload = (e: React.ChangeEvent<HTMLInputElement>) => {
    if (e.target.files && e.target.files[0]) {
      const file = e.target.files[0];
      const reader = new FileReader();
      reader.onload = (event) => {
        if (event.target?.result) {
          setLogoUrl(event.target.result as string);
          alert('✅ Logo atualizada com sucesso!');
        }
      };
      reader.readAsDataURL(file);
    }
  };

  const handleTestSound = async () => {
    await requestNotificationPermission();
    sendNativeNotification('🔔 Teste de Notificação & Som', {
      body: 'O áudio e notificação do BJuris estão operando perfeitamente!',
      playSound: true
    });
  };

  const handleSignOut = async () => {
    if (!confirm('Deseja realmente sair da sua conta?')) return;
    setSignOutLoading(true);
    await signOut();
  };

  // ─── PDF Export ───────────────────────────────────────────────────────────
  const handleExportPDF = async () => {
    setPdfLoading(true);
    try {
      const doc = new jsPDF({ orientation: 'portrait', unit: 'mm', format: 'a4' });
      const pageW = doc.internal.pageSize.getWidth();
      const today = new Date().toLocaleDateString('pt-BR');

      // ── Header ──
      doc.setFillColor(15, 15, 15); // near black
      doc.rect(0, 0, pageW, 28, 'F');
      doc.setFontSize(18);
      doc.setTextColor(212, 175, 55); // gold
      doc.setFont('helvetica', 'bold');
      doc.text('BJuris — Backup Completo de Dados', 14, 13);
      doc.setFontSize(8);
      doc.setTextColor(200, 200, 200);
      doc.text(`Advogado: ${perfil.nome}  |  OAB: ${perfil.oabNumero}/${perfil.oabUf}  |  Gerado em: ${today}`, 14, 22);

      let y = 36;

      // ── Section helper ──
      const addSection = (title: string) => {
        if (y > 250) { doc.addPage(); y = 20; }
        doc.setFontSize(11);
        doc.setFont('helvetica', 'bold');
        doc.setTextColor(15, 15, 15);
        doc.text(title, 14, y);
        doc.setDrawColor(212, 175, 55);
        doc.setLineWidth(0.5);
        doc.line(14, y + 1.5, pageW - 14, y + 1.5);
        y += 7;
      };

      // ── 1. Clientes ──
      addSection(`1. CLIENTES (${clientes.length} registros)`);
      if (clientes.length > 0) {
        autoTable(doc, {
          startY: y,
          head: [['Nome', 'Tipo', 'CPF/CNPJ', 'Telefone', 'E-mail', 'Cadastro']],
          body: clientes.map(c => [
            c.nome,
            c.tipo,
            c.documento || '—',
            c.telefone || '—',
            c.email || '—',
            c.dataCadastro || '—',
          ]),
          styles: { fontSize: 7, cellPadding: 2 },
          headStyles: { fillColor: [15, 15, 15], textColor: [212, 175, 55], fontStyle: 'bold', fontSize: 7 },
          alternateRowStyles: { fillColor: [248, 250, 252] },
          margin: { left: 14, right: 14 },
        });
        y = (doc as any).lastAutoTable.finalY + 10;
      } else {
        doc.setFontSize(8); doc.setTextColor(100, 100, 100);
        doc.text('Nenhum cliente cadastrado.', 14, y); y += 10;
      }

      // ── 2. Processos ──
      if (y > 230) { doc.addPage(); y = 20; }
      addSection(`2. PROCESSOS (${processos.length} registros)`);
      if (processos.length > 0) {
        autoTable(doc, {
          startY: y,
          head: [['Número CNJ', 'Área', 'Vara / Tribunal', 'Status', 'Última Moviment.']],
          body: processos.map(p => [
            p.numeroCnj || '—',
            p.area || '—',
            `${p.vara || '—'} / ${p.tribunal || '—'}`,
            p.status || '—',
            p.ultimaMovimentacao?.titulo || '—',
          ]),
          styles: { fontSize: 7, cellPadding: 2 },
          headStyles: { fillColor: [15, 15, 15], textColor: [212, 175, 55], fontStyle: 'bold', fontSize: 7 },
          alternateRowStyles: { fillColor: [248, 250, 252] },
          margin: { left: 14, right: 14 },
        });
        y = (doc as any).lastAutoTable.finalY + 10;
      } else {
        doc.setFontSize(8); doc.setTextColor(100, 100, 100);
        doc.text('Nenhum processo cadastrado.', 14, y); y += 10;
      }

      // ── 3. Prazos & Audiências ──
      if (y > 230) { doc.addPage(); y = 20; }
      addSection(`3. PRAZOS & AUDIÊNCIAS (${prazos.length} registros)`);
      if (prazos.length > 0) {
        autoTable(doc, {
          startY: y,
          head: [['Título', 'Tipo', 'Data', 'Prioridade', 'Processo', 'Concluído']],
          body: prazos.map(p => [
            p.titulo || '—',
            p.tipo || '—',
            p.dataHora ? new Date(p.dataHora).toLocaleDateString('pt-BR') : '—',
            p.prioridade || '—',
            p.processoNumero || '—',
            p.concluido ? 'Sim' : 'Não',
          ]),
          styles: { fontSize: 7, cellPadding: 2 },
          headStyles: { fillColor: [15, 15, 15], textColor: [212, 175, 55], fontStyle: 'bold', fontSize: 7 },
          alternateRowStyles: { fillColor: [248, 250, 252] },
          margin: { left: 14, right: 14 },
        });
        y = (doc as any).lastAutoTable.finalY + 10;
      } else {
        doc.setFontSize(8); doc.setTextColor(100, 100, 100);
        doc.text('Nenhum prazo cadastrado.', 14, y); y += 10;
      }

      // ── 4. Financeiro ──
      if (y > 230) { doc.addPage(); y = 20; }
      addSection(`4. HONORÁRIOS & FINANCEIRO (${financeiro.length} lançamentos)`);
      const totalReceber = financeiro.filter(f => f.status !== 'pago').reduce((s, f) => s + f.valor, 0);
      const totalRecebido = financeiro.filter(f => f.status === 'pago').reduce((s, f) => s + f.valor, 0);
      if (financeiro.length > 0) {
        autoTable(doc, {
          startY: y,
          head: [['Descrição', 'Cliente', 'Tipo', 'Valor (R$)', 'Vencimento', 'Status']],
          body: financeiro.map(f => [
            f.descricao || '—',
            f.clienteNome || '—',
            f.tipo || '—',
            `R$ ${f.valor?.toLocaleString('pt-BR', { minimumFractionDigits: 2 })}`,
            f.vencimento || '—',
            f.status === 'pago' ? '✓ Pago' : 'Pendente',
          ]),
          styles: { fontSize: 7, cellPadding: 2 },
          headStyles: { fillColor: [15, 15, 15], textColor: [212, 175, 55], fontStyle: 'bold', fontSize: 7 },
          alternateRowStyles: { fillColor: [248, 250, 252] },
          margin: { left: 14, right: 14 },
        });
        y = (doc as any).lastAutoTable.finalY + 6;
        doc.setFontSize(8); doc.setFont('helvetica', 'bold');
        doc.setTextColor(15, 15, 15);
        doc.text(`Total Recebido: R$ ${totalRecebido.toLocaleString('pt-BR', { minimumFractionDigits: 2 })}   |   Total a Receber: R$ ${totalReceber.toLocaleString('pt-BR', { minimumFractionDigits: 2 })}`, 14, y);
        y += 10;
      } else {
        doc.setFontSize(8); doc.setTextColor(100, 100, 100);
        doc.text('Nenhum lançamento financeiro.', 14, y); y += 10;
      }

      // ── Footer on all pages ──
      const totalPages = (doc as any).internal.getNumberOfPages();
      for (let i = 1; i <= totalPages; i++) {
        doc.setPage(i);
        doc.setFontSize(7);
        doc.setTextColor(160, 160, 160);
        doc.text(`Página ${i} de ${totalPages}  —  BJuris © ${new Date().getFullYear()}  —  Documento gerado em ${today}`, 14, doc.internal.pageSize.getHeight() - 8);
      }

      doc.save(`BJuris_Backup_${today.replace(/\//g, '-')}.pdf`);
    } catch (err) {
      console.error('Erro ao gerar PDF:', err);
      alert('Erro ao gerar PDF. Tente novamente.');
    } finally {
      setPdfLoading(false);
    }
  };

  // ─── JSON Export ──────────────────────────────────────────────────────────
  const handleExportJSON = () => {
    setJsonLoading(true);
    try {
      const data = {
        exportado_em: new Date().toISOString(),
        advogado: perfil,
        clientes,
        processos,
        prazos,
        financeiro,
      };
      const blob = new Blob([JSON.stringify(data, null, 2)], { type: 'application/json' });
      const url = URL.createObjectURL(blob);
      const a = document.createElement('a');
      a.href = url;
      a.download = `BJuris_Backup_${new Date().toLocaleDateString('pt-BR').replace(/\//g, '-')}.json`;
      a.click();
      URL.revokeObjectURL(url);
    } catch {
      alert('Erro ao exportar JSON.');
    } finally {
      setJsonLoading(false);
    }
  };

  return (
    <div className="space-y-6 animate-in fade-in duration-300 max-w-4xl w-full">

      {/* Hidden File Input */}
      <input type="file" accept="image/*,.pdf" ref={logoFileInputRef} onChange={handleLogoUpload} className="hidden" />

      {/* Header */}
      <div>
        <h2 className="text-2xl font-black font-outfit text-slate-900 flex items-center gap-2">
          <Settings className="w-7 h-7 text-[#b8860b]" />
          Configurações & Perfil OAB
        </h2>
        <p className="text-xs text-slate-600 font-medium">Gerencie seus dados, notificações e realize backup dos seus dados</p>
      </div>

      <form onSubmit={handleSave} className="space-y-6">

        {/* Profile */}
        <div className="bg-white p-6 rounded-2xl border border-slate-200 shadow-sm space-y-4">
          <h3 className="text-sm font-black text-slate-900 flex items-center gap-2">
            <User className="w-5 h-5 text-[#b8860b]" />
            Dados do Advogado (OAB)
          </h3>

          {/* Account email (read-only from Supabase) */}
          {user?.email && (
            <div className="flex items-center gap-3 p-3 rounded-xl bg-slate-50 border border-slate-200">
              <ShieldCheck className="w-4 h-4 text-green-600 flex-shrink-0" />
              <div>
                <p className="text-[10px] text-slate-500 font-medium">Conta Autenticada</p>
                <p className="text-xs font-bold text-slate-900">{user.email}</p>
              </div>
            </div>
          )}

          <div className="flex items-center gap-4 py-2 border-b border-slate-100">
            <img src={fotoUrl} alt={nome} className="w-16 h-16 rounded-2xl object-cover border-2 border-[#d4af37] shadow-sm" />
            <div className="flex-1">
              <label className="block text-xs font-bold text-slate-700 mb-1">URL da Foto de Perfil</label>
              <input type="url" value={fotoUrl} onChange={e => setFotoUrl(e.target.value)} className="w-full bg-slate-50 border border-slate-300 rounded-xl px-3 py-2 text-xs text-slate-900 font-medium focus:border-[#d4af37] focus:outline-none" />
            </div>
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
            <div>
              <label className="block text-xs font-bold text-slate-700 mb-1">Nome Completo</label>
              <input type="text" value={nome} onChange={e => setNome(e.target.value)} className="w-full bg-slate-50 border border-slate-300 rounded-xl px-3 py-2 text-xs text-slate-900 font-bold focus:border-[#d4af37] focus:outline-none" />
            </div>
            <div className="grid grid-cols-2 gap-2">
              <div>
                <label className="block text-xs font-bold text-slate-700 mb-1">Nº OAB</label>
                <input type="text" value={oabNumero} onChange={e => setOabNumero(e.target.value)} className="w-full bg-slate-50 border border-slate-300 rounded-xl px-3 py-2 text-xs text-slate-900 font-bold focus:border-[#d4af37] focus:outline-none" />
              </div>
              <div>
                <label className="block text-xs font-bold text-slate-700 mb-1">UF OAB</label>
                <input type="text" value={oabUf} onChange={e => setOabUf(e.target.value)} className="w-full bg-slate-50 border border-slate-300 rounded-xl px-3 py-2 text-xs text-slate-900 font-bold focus:border-[#d4af37] focus:outline-none" />
              </div>
            </div>
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
            <div>
              <label className="block text-xs font-bold text-slate-700 mb-1">Escritório</label>
              <input type="text" value={escritorio} onChange={e => setEscritorio(e.target.value)} className="w-full bg-slate-50 border border-slate-300 rounded-xl px-3 py-2 text-xs font-medium focus:border-[#d4af37] focus:outline-none" />
            </div>
            <div>
              <label className="block text-xs font-bold text-slate-700 mb-1">CPF</label>
              <input type="text" value={cpf} onChange={e => setCpf(e.target.value)} className="w-full bg-slate-50 border border-slate-300 rounded-xl px-3 py-2 text-xs font-medium focus:border-[#d4af37] focus:outline-none" />
            </div>
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
            <div>
              <label className="block text-xs font-bold text-slate-700 mb-1">E-mail Profissional</label>
              <input type="email" value={email} onChange={e => setEmail(e.target.value)} className="w-full bg-slate-50 border border-slate-300 rounded-xl px-3 py-2 text-xs font-medium focus:border-[#d4af37] focus:outline-none" />
            </div>
            <div>
              <label className="block text-xs font-bold text-slate-700 mb-1">Telefone / WhatsApp</label>
              <input type="text" value={telefone} onChange={e => setTelefone(e.target.value)} className="w-full bg-slate-50 border border-slate-300 rounded-xl px-3 py-2 text-xs font-medium focus:border-[#d4af37] focus:outline-none" />
            </div>
          </div>
        </div>

        {/* Notifications */}
        <div className="bg-white p-6 rounded-2xl border border-slate-200 shadow-sm space-y-4">
          <h3 className="text-sm font-black text-slate-900 flex items-center gap-2">
            <Bell className="w-5 h-5 text-[#b8860b]" />
            Notificações Push & Alerta Sonoro
          </h3>
          <div className="space-y-3">
            <div className="flex items-center justify-between p-3.5 rounded-xl bg-slate-50 border border-slate-200">
              <div>
                <h4 className="text-xs font-bold text-slate-900">Alertas Nativos de Prazos Fatais</h4>
                <p className="text-[11px] text-slate-600 font-medium">Pop-ups do sistema operacional ao expirar prazo</p>
              </div>
              <input type="checkbox" checked={notificacoesAtivas} onChange={e => setNotificacoesAtivas(e.target.checked)} className="w-4 h-4 accent-[#d4af37]" />
            </div>
            <div className="flex items-center justify-between p-3.5 rounded-xl bg-slate-50 border border-slate-200">
              <div>
                <h4 className="text-xs font-bold text-slate-900">Som de Notificação e Alerta</h4>
                <p className="text-[11px] text-slate-600 font-medium">Bipe sonoro de urgência ao receber notificação</p>
              </div>
              <input type="checkbox" checked={somAlerta} onChange={e => setSomAlerta(e.target.checked)} className="w-4 h-4 accent-[#d4af37]" />
            </div>
            <button type="button" onClick={handleTestSound} className="px-4 py-2 rounded-xl bg-slate-900 hover:bg-slate-800 text-amber-400 text-xs font-bold transition-all flex items-center gap-2">
              <Volume2 className="w-4 h-4" />
              Testar Som & Notificação Push
            </button>
          </div>
        </div>

        {/* Save button */}
        <div className="flex justify-end">
          <button type="submit" id="config-save-btn" className="px-6 py-2.5 rounded-xl btn-gold-3d text-xs font-black flex items-center gap-2 shadow-md">
            <Save className="w-4 h-4 text-slate-950" />
            Salvar Configurações
          </button>
        </div>
      </form>

      {/* ─── Backup Section ─────────────────────────────────────────────── */}
      <div className="bg-white p-6 rounded-2xl border-2 border-[#d4af37]/40 shadow-sm space-y-4">
        <div>
          <h3 className="text-sm font-black text-slate-900 flex items-center gap-2">
            <Database className="w-5 h-5 text-[#b8860b]" />
            Backup de Dados — Segurança Total
          </h3>
          <p className="text-xs text-slate-600 font-medium mt-1">
            Baixe todos os seus dados em caso de emergência. O arquivo PDF contém todos os clientes, processos, prazos e lançamentos financeiros organizados em tabelas.
          </p>
        </div>

        <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
          {/* PDF */}
          <div className="p-4 rounded-xl bg-gradient-to-br from-slate-950 to-slate-900 border border-[#d4af37]/30 space-y-3">
            <div className="flex items-center gap-2">
              <FileDown className="w-5 h-5 text-[#d4af37]" />
              <div>
                <h4 className="text-xs font-black text-white">Relatório PDF Completo</h4>
                <p className="text-[10px] text-slate-400 font-medium">Todos os dados em formato profissional</p>
              </div>
            </div>
            <div className="text-[10px] text-slate-400 font-medium space-y-0.5">
              <p>✓ {clientes.length} clientes cadastrados</p>
              <p>✓ {processos.length} processos</p>
              <p>✓ {prazos.length} prazos & audiências</p>
              <p>✓ {financeiro.length} lançamentos financeiros</p>
            </div>
            <button
              id="export-pdf-btn"
              onClick={handleExportPDF}
              disabled={pdfLoading}
              className="w-full py-2.5 rounded-xl btn-gold-3d text-xs font-black flex items-center justify-center gap-2 disabled:opacity-50"
            >
              {pdfLoading ? (
                <Loader2 className="w-4 h-4 animate-spin text-slate-950" />
              ) : (
                <>
                  <Download className="w-4 h-4 text-slate-950" />
                  Baixar PDF Completo
                </>
              )}
            </button>
          </div>

          {/* JSON */}
          <div className="p-4 rounded-xl bg-slate-50 border border-slate-200 space-y-3">
            <div className="flex items-center gap-2">
              <FileJson className="w-5 h-5 text-slate-700" />
              <div>
                <h4 className="text-xs font-black text-slate-900">Backup JSON (Raw Data)</h4>
                <p className="text-[10px] text-slate-500 font-medium">Formato técnico para restauração completa</p>
              </div>
            </div>
            <p className="text-[10px] text-slate-500 font-medium">
              Arquivo JSON contendo todos os dados brutos do sistema, útil para migração ou suporte técnico.
            </p>
            <button
              id="export-json-btn"
              onClick={handleExportJSON}
              disabled={jsonLoading}
              className="w-full py-2.5 rounded-xl bg-slate-900 hover:bg-slate-800 text-white text-xs font-black flex items-center justify-center gap-2 disabled:opacity-50 transition-all"
            >
              {jsonLoading ? (
                <Loader2 className="w-4 h-4 animate-spin" />
              ) : (
                <>
                  <Download className="w-4 h-4" />
                  Baixar JSON de Backup
                </>
              )}
            </button>
          </div>
        </div>
      </div>

      {/* ─── Sign Out ───────────────────────────────────────────────────── */}
      <div className="bg-white p-6 rounded-2xl border border-red-100 shadow-sm">
        <h3 className="text-sm font-black text-slate-900 flex items-center gap-2 mb-3">
          <LogOut className="w-5 h-5 text-red-500" />
          Sair da Conta
        </h3>
        <p className="text-xs text-slate-500 font-medium mb-4">
          Ao sair, você precisará fazer login novamente para acessar o BJuris.
        </p>
        <button
          id="sign-out-btn"
          type="button"
          onClick={handleSignOut}
          disabled={signOutLoading}
          className="px-5 py-2.5 rounded-xl bg-red-50 hover:bg-red-100 border border-red-200 text-red-700 text-xs font-black flex items-center gap-2 transition-all disabled:opacity-50"
        >
          {signOutLoading ? <Loader2 className="w-4 h-4 animate-spin" /> : <LogOut className="w-4 h-4" />}
          Sair do BJuris
        </button>
      </div>

    </div>
  );
};
