import React, { useState } from 'react';
import { useLegal } from '../context/LegalContext';
import { TipoHonorario, StatusFinanceiro, CarnePagamento, ParcelaCarne } from '../types/legal';
import {
  DollarSign,
  Plus,
  CheckCircle2,
  Clock,
  AlertTriangle,
  FileText,
  Building,
  User,
  ArrowUpRight,
  Printer,
  TrendingUp,
  Calendar,
  CreditCard,
  Download,
  Eye,
  Check,
  X,
  AlertCircle,
  FileDown
} from 'lucide-react';
import jsPDF from 'jspdf';

export const Financeiro: React.FC = () => {
  const {
    financeiro,
    toggleFinanceiroStatus,
    addFinanceiro,
    clientes,
    carnes,
    addCarne,
    toggleParcelaCarneStatus,
    perfil
  } = useLegal();

  // Active section tab: 'lancamentos' | 'carnes'
  const [activeTab, setActiveTab] = useState<'lancamentos' | 'carnes'>('lancamentos');

  // Chart Filters
  const [chartYear, setChartYear] = useState<string>('2026');
  const [chartPeriod, setChartPeriod] = useState<string>('todos'); // 'todos' or month number '0' to '11'

  // Add Honorario Form State
  const [showAddForm, setShowAddForm] = useState(false);
  const [clienteNome, setClienteNome] = useState('');
  const [tipo, setTipo] = useState<TipoHonorario>('contratual');
  const [descricao, setDescricao] = useState('');
  const [valor, setValor] = useState('3500');
  const [vencimento, setVencimento] = useState(new Date().toISOString().split('T')[0]);

  // Add Carne Form State
  const [showAddCarneForm, setShowAddCarneForm] = useState(false);
  const [carneClienteNome, setCarneClienteNome] = useState('');
  const [carneClienteDoc, setCarneClienteDoc] = useState('');
  const [carneBeneficio, setCarneBeneficio] = useState('Benefício BPC / LOAS');
  const [carneValorTotal, setCarneValorTotal] = useState('3600');
  const [carneQtdParcelas, setCarneQtdParcelas] = useState('12');
  const [carneDiaVencimento, setCarneDiaVencimento] = useState('10');

  // Modal for Viewing / Downloading Carnê PDF
  const [selectedCarnePDF, setSelectedCarnePDF] = useState<CarnePagamento | null>(null);

  // Check iOS device
  const isIOS = typeof window !== 'undefined' && /iPad|iPhone|iPod/.test(navigator.userAgent);

  // Metrics
  const totalPago = financeiro
    .filter(f => f.status === 'pago')
    .reduce((acc, curr) => acc + curr.valor, 0);

  const totalPendente = financeiro
    .filter(f => f.status === 'pendente')
    .reduce((acc, curr) => acc + curr.valor, 0);

  const totalGeral = totalPago + totalPendente;

  // Chart Data Calculations (Monthly Breakdown for Selected Year)
  const mesesNomes = ['Jan', 'Fev', 'Mar', 'Abr', 'Mai', 'Jun', 'Jul', 'Ago', 'Set', 'Out', 'Nov', 'Dez'];
  
  const monthlyData = mesesNomes.map((mes, idx) => {
    // Filter financeiro items for this month & year
    const itensMes = financeiro.filter(f => {
      const parts = f.vencimento.split('-');
      if (parts.length < 2) return false;
      const itemYear = parts[0];
      const itemMonth = parseInt(parts[1], 10) - 1;
      return itemYear === chartYear && itemMonth === idx;
    });

    const recebido = itensMes
      .filter(f => f.status === 'pago')
      .reduce((acc, curr) => acc + curr.valor, 0);

    const previsto = itensMes.reduce((acc, curr) => acc + curr.valor, 0);

    return { mes, idx, recebido, previsto };
  });

  // Filtered Chart Items based on Period Selection
  const chartDisplayData = chartPeriod === 'todos'
    ? monthlyData
    : monthlyData.filter(d => d.idx === parseInt(chartPeriod, 10));

  // Find best receiving month
  const maxRecebido = Math.max(...monthlyData.map(d => d.recebido), 0);
  const melhorMesData = monthlyData.find(d => d.recebido === maxRecebido && maxRecebido > 0);

  // Carnes Stats & Badges
  const getParcelaStatusColor = (status: 'pago' | 'proximo' | 'atrasado' | 'pendente', vencimento: string) => {
    if (status === 'pago') {
      return {
        badge: <span className="px-2.5 py-0.5 rounded-full bg-emerald-500/20 text-emerald-400 font-extrabold text-[10px] border border-emerald-500/30 flex items-center gap-1">🟢 Pago / Em dia</span>,
        color: 'emerald'
      };
    }

    const now = new Date().getTime();
    const vencTime = new Date(vencimento).getTime();
    const diffDays = Math.ceil((vencTime - now) / (1000 * 60 * 60 * 24));

    if (diffDays < 0 || status === 'atrasado') {
      return {
        badge: <span className="px-2.5 py-0.5 rounded-full bg-red-500/20 text-red-400 font-extrabold text-[10px] border border-red-500/30 flex items-center gap-1">🔴 Em Atraso</span>,
        color: 'red'
      };
    }

    if (diffDays <= 5 || status === 'proximo') {
      return {
        badge: <span className="px-2.5 py-0.5 rounded-full bg-amber-500/20 text-amber-400 font-extrabold text-[10px] border border-amber-500/30 flex items-center gap-1 animate-pulse">🟠 Vence em 5 dias</span>,
        color: 'amber'
      };
    }

    return {
      badge: <span className="px-2.5 py-0.5 rounded-full bg-emerald-500/10 text-emerald-400 font-bold text-[10px] border border-emerald-500/20 flex items-center gap-1">🟢 Ativo / Em dia</span>,
      color: 'emerald'
    };
  };

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!clienteNome || !descricao || !valor) return;

    addFinanceiro({
      clienteNome,
      tipo,
      descricao,
      valor: parseFloat(valor),
      vencimento,
      status: 'pendente'
    });

    setShowAddForm(false);
    setDescricao('');
  };

  const handleCarneSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!carneClienteNome || !carneValorTotal) return;

    const vTotal = parseFloat(carneValorTotal);
    const qParcelas = parseInt(carneQtdParcelas, 10);
    const vParc = Math.round((vTotal / qParcelas) * 100) / 100;

    addCarne({
      clienteNome: carneClienteNome,
      clienteDocumento: carneClienteDoc || '000.000.000-00',
      beneficioOuAcordo: carneBeneficio,
      valorTotal: vTotal,
      qtdParcelas: qParcelas,
      valorParcela: vParc,
      diaVencimentoMensal: parseInt(carneDiaVencimento, 10)
    });

    setShowAddCarneForm(false);
    setCarneClienteNome('');
    alert('✅ Carnê de pagamento gerado com sucesso!');
  };

  // PDF Carnê Generator
  const generateCarnePDF = (carne: CarnePagamento) => {
    try {
      const doc = new jsPDF({ orientation: 'portrait', unit: 'mm', format: 'a4' });
      const pageW = doc.internal.pageSize.getWidth();

      // Capa do Carnê
      doc.setFillColor(15, 23, 42); // slate-950
      doc.rect(0, 0, pageW, 297, 'F');

      doc.setDrawColor(212, 175, 55); // gold border
      doc.setLineWidth(1);
      doc.rect(10, 10, pageW - 20, 277);

      doc.setFontSize(22);
      doc.setTextColor(212, 175, 55);
      doc.setFont('helvetica', 'bold');
      doc.text('BJuris — CARNÊ DE PAGAMENTO', pageW / 2, 40, { align: 'center' });

      doc.setFontSize(11);
      doc.setTextColor(255, 255, 255);
      doc.text(`ESCRITÓRIO: ${perfil.escritorio || 'BJuris Advocacia'}`, pageW / 2, 52, { align: 'center' });
      doc.text(`ADVOGADO: ${perfil.nome} — OAB/${perfil.oabUf} ${perfil.oabNumero}`, pageW / 2, 60, { align: 'center' });

      doc.setLineWidth(0.5);
      doc.line(30, 70, pageW - 30, 70);

      // Dados do Cliente
      doc.setFontSize(12);
      doc.setTextColor(212, 175, 55);
      doc.text('DADOS DO CLIENTE / BENEFICIÁRIO:', 20, 85);

      doc.setFontSize(10);
      doc.setTextColor(255, 255, 255);
      doc.text(`NOME: ${carne.clienteNome}`, 20, 95);
      doc.text(`CPF / CNPJ: ${carne.clienteDocumento}`, 20, 103);
      doc.text(`REFERÊNCIA / BENEFÍCIO: ${carne.beneficioOuAcordo}`, 20, 111);
      doc.text(`VALOR TOTAL DO ACORDO: R$ ${carne.valorTotal.toLocaleString('pt-BR', { minimumFractionDigits: 2 })}`, 20, 119);
      doc.text(`QUANTIDADE DE PARCELAS: ${carne.qtdParcelas}x de R$ ${carne.valorParcela.toLocaleString('pt-BR', { minimumFractionDigits: 2 })}`, 20, 127);

      doc.line(30, 140, pageW - 30, 140);

      doc.setFontSize(9);
      doc.setTextColor(180, 180, 180);
      doc.text('Instruções: Mantenha este carnê em local seguro. Apresente o carnê no momento do pagamento.', pageW / 2, 160, { align: 'center' });

      // Páginas dos Talões das Parcelas
      carne.parcelas.forEach((parc, idx) => {
        if (idx % 3 === 0) {
          doc.addPage();
          doc.setFillColor(255, 255, 255);
          doc.rect(0, 0, pageW, 297, 'F');
        }

        const yPos = 15 + (idx % 3) * 90;

        // Moldura da parcela
        doc.setDrawColor(15, 23, 42);
        doc.setLineWidth(0.5);
        doc.rect(10, yPos, pageW - 20, 82);

        // Cabeçalho da Parcela
        doc.setFillColor(15, 23, 42);
        doc.rect(10, yPos, pageW - 20, 12, 'F');
        doc.setFontSize(11);
        doc.setTextColor(212, 175, 55);
        doc.setFont('helvetica', 'bold');
        doc.text(`PARCELA ${parc.numero} / ${carne.qtdParcelas} — ${carne.beneficioOuAcordo}`, 15, yPos + 8);
        doc.text(`R$ ${parc.valor.toLocaleString('pt-BR', { minimumFractionDigits: 2 })}`, pageW - 15, yPos + 8, { align: 'right' });

        // Corpo do Talão
        doc.setFontSize(9);
        doc.setTextColor(0, 0, 0);
        doc.setFont('helvetica', 'normal');
        doc.text(`CLIENTE: ${carne.clienteNome}`, 15, yPos + 22);
        doc.text(`CPF: ${carne.clienteDocumento}`, 15, yPos + 30);
        doc.text(`VENCIMENTO: ${new Date(parc.vencimento).toLocaleDateString('pt-BR')}`, 15, yPos + 38);
        doc.text(`STATUS: ${parc.status.toUpperCase()}`, 15, yPos + 46);

        // Recibo do Advogado / Canhoto
        doc.setLineWidth(0.3);
        doc.setDrawColor(200, 200, 200);
        doc.line(130, yPos + 12, 130, yPos + 82);

        doc.setFontSize(8);
        doc.text('RECIBO DE QUITAÇÃO', 135, yPos + 22);
        doc.text(`Recebido em: ____/____/________`, 135, yPos + 34);
        doc.text(`Assinatura: ___________________`, 135, yPos + 55);
      });

      if (isIOS) {
        // Open PDF print/preview window for iOS Safari
        const pdfBlob = doc.output('blob');
        const url = URL.createObjectURL(pdfBlob);
        window.open(url, '_blank');
      } else {
        // Direct download on PC / Android
        doc.save(`Carne_${carne.clienteNome.replace(/\s+/g, '_')}.pdf`);
      }
    } catch (err) {
      console.error('Erro ao gerar PDF do Carnê:', err);
      alert('Erro ao gerar PDF do Carnê. Tente novamente.');
    }
  };

  return (
    <div className="space-y-6 animate-in fade-in duration-300 w-full">
      
      {/* Header Bar */}
      <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4">
        <div>
          <h2 className="text-2xl font-black font-outfit text-slate-900 flex items-center gap-2">
            <DollarSign className="w-7 h-7 text-amber-600" />
            Gestão Financeira, Carnês & DRE
          </h2>
          <p className="text-xs text-slate-600 font-medium">Evolução gráfica 3D, controle de carnês (BPC/LOAS) e alertas de cobrança</p>
        </div>

        <div className="flex items-center gap-2 w-full sm:w-auto">
          <button
            onClick={() => setActiveTab('lancamentos')}
            className={`px-4 py-2.5 rounded-xl text-xs font-black transition-all ${
              activeTab === 'lancamentos' ? 'btn-gold-3d shadow-md' : 'bg-white text-slate-700 border border-slate-300'
            }`}
          >
            📊 Evolução & Lançamentos
          </button>

          <button
            onClick={() => setActiveTab('carnes')}
            className={`px-4 py-2.5 rounded-xl text-xs font-black transition-all ${
              activeTab === 'carnes' ? 'btn-gold-3d shadow-md' : 'bg-white text-slate-700 border border-slate-300'
            }`}
          >
            📑 Carnês (BPC / Recorrentes)
          </button>
        </div>
      </div>

      {/* Financial Metrics Summary Cards */}
      <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
        <div className="p-5 rounded-2xl glass-card bg-white border border-slate-200 shadow-sm">
          <div className="flex items-center justify-between">
            <span className="text-xs font-bold text-slate-600 uppercase">Total Recebido</span>
            <div className="p-2.5 rounded-xl bg-emerald-100 text-emerald-800">
              <CheckCircle2 className="w-5 h-5" />
            </div>
          </div>
          <p className="text-3xl font-black font-outfit text-emerald-700 mt-3">
            R$ {totalPago.toLocaleString('pt-BR', { minimumFractionDigits: 2 })}
          </p>
          <p className="text-xs text-slate-500 font-medium mt-1">Lançamentos e parcelas quitadas</p>
        </div>

        <div className="p-5 rounded-2xl glass-card bg-white border border-slate-200 shadow-sm">
          <div className="flex items-center justify-between">
            <span className="text-xs font-bold text-slate-600 uppercase">Pendente / Prestes a Vencer</span>
            <div className="p-2.5 rounded-xl bg-amber-100 text-amber-800">
              <Clock className="w-5 h-5" />
            </div>
          </div>
          <p className="text-3xl font-black font-outfit text-amber-700 mt-3">
            R$ {totalPendente.toLocaleString('pt-BR', { minimumFractionDigits: 2 })}
          </p>
          <p className="text-xs text-slate-500 font-medium mt-1">Previsão de entrada no caixa</p>
        </div>

        <div className="p-5 rounded-2xl glass-card bg-white border border-slate-200 shadow-sm">
          <div className="flex items-center justify-between">
            <span className="text-xs font-bold text-slate-600 uppercase">Melhor Mês de Arrecadação</span>
            <div className="p-2.5 rounded-xl bg-amber-500/20 text-[#b8860b] border border-amber-500/30">
              <TrendingUp className="w-5 h-5" />
            </div>
          </div>
          <p className="text-2xl font-black font-outfit text-[#b8860b] mt-3">
            {melhorMesData ? `${melhorMesData.mes}/${chartYear}` : '—'}
          </p>
          <p className="text-xs text-slate-500 font-medium mt-1">
            {melhorMesData ? `R$ ${melhorMesData.recebido.toLocaleString('pt-BR')}` : 'Sem dados registrados'}
          </p>
        </div>
      </div>

      {/* ─── TAB 1: 3D GRAPH & LANCAMENTOS ────────────────────────────────────────── */}
      {activeTab === 'lancamentos' && (
        <div className="space-y-6">
          
          {/* 3D Financial Evolution Chart Section - Styled like High-End Dark Dashboard */}
          <div className="p-6 rounded-2xl bg-slate-950 border border-amber-500/30 shadow-2xl text-white space-y-5">
            
            {/* Chart Header & Controls */}
            <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4 border-b border-slate-800 pb-4">
              <div>
                <h3 className="text-lg font-black font-outfit text-slate-100 flex items-center gap-2">
                  <TrendingUp className="w-5 h-5 text-[#d4af37]" />
                  Evolução Financeira 3D — Fluxo de Caixa
                </h3>
                <p className="text-xs text-slate-400 font-medium">
                  Análise comparativa de valores previstos vs. efetivamente recebidos
                </p>
              </div>

              {/* Month / Year Filters */}
              <div className="flex items-center gap-3 w-full sm:w-auto">
                <select
                  value={chartYear}
                  onChange={e => setChartYear(e.target.value)}
                  className="bg-slate-900 border border-slate-800 rounded-xl px-3 py-1.5 text-xs font-bold text-amber-400 focus:border-amber-500 focus:outline-none"
                >
                  <option value="2024">Ano 2024</option>
                  <option value="2025">Ano 2025</option>
                  <option value="2026">Ano 2026</option>
                </select>

                <select
                  value={chartPeriod}
                  onChange={e => setChartPeriod(e.target.value)}
                  className="bg-slate-900 border border-slate-800 rounded-xl px-3 py-1.5 text-xs font-bold text-amber-400 focus:border-amber-500 focus:outline-none"
                >
                  <option value="todos">Ano Todo (12 Meses)</option>
                  {mesesNomes.map((m, idx) => (
                    <option key={m} value={idx}>{m} / {chartYear}</option>
                  ))}
                </select>
              </div>
            </div>

            {/* SVG 3D Curved Gradient Chart */}
            <div className="relative pt-4 pb-2">
              <div className="h-64 w-full flex items-end justify-between gap-2 px-2">
                {chartDisplayData.map((item) => {
                  const maxVal = Math.max(...monthlyData.map(d => Math.max(d.previsto, d.recebido)), 1000);
                  const hPrevistoPct = Math.max((item.previsto / maxVal) * 100, 8);
                  const hRecebidoPct = Math.max((item.recebido / maxVal) * 100, 8);

                  return (
                    <div key={item.mes} className="flex-1 flex flex-col items-center gap-2 group relative">
                      
                      {/* Tooltip on Hover */}
                      <div className="absolute -top-14 hidden group-hover:flex flex-col items-center bg-slate-900 text-white text-[10px] p-2 rounded-xl border border-amber-500/50 shadow-2xl z-20 whitespace-nowrap">
                        <span className="font-black text-[#d4af37]">{item.mes}/{chartYear}</span>
                        <span>Recebido: R$ {item.recebido.toLocaleString('pt-BR')}</span>
                        <span>Previsto: R$ {item.previsto.toLocaleString('pt-BR')}</span>
                      </div>

                      {/* 3D Pillar Bars */}
                      <div className="w-full flex items-end justify-center gap-1.5 h-48">
                        {/* Previsto Pillar */}
                        <div
                          style={{ height: `${hPrevistoPct}%` }}
                          className="w-3 rounded-t-lg bg-gradient-to-t from-blue-900 via-blue-600 to-blue-400 opacity-60 group-hover:opacity-100 transition-all shadow-[0_0_12px_rgba(59,130,246,0.3)]"
                          title={`Previsto: R$ ${item.previsto}`}
                        />
                        {/* Recebido 3D Gold Pillar */}
                        <div
                          style={{ height: `${hRecebidoPct}%` }}
                          className="w-4 rounded-t-lg bg-gradient-to-t from-amber-700 via-amber-500 to-[#f59e0b] shadow-[0_0_18px_rgba(245,158,11,0.5)] group-hover:scale-105 transition-all"
                          title={`Recebido: R$ ${item.recebido}`}
                        />
                      </div>

                      <span className="text-[11px] font-extrabold text-slate-400 group-hover:text-amber-400 transition-colors">
                        {item.mes}
                      </span>
                    </div>
                  );
                })}
              </div>

              {/* Chart Legend */}
              <div className="flex items-center justify-center gap-6 pt-4 border-t border-slate-900 text-xs font-bold">
                <div className="flex items-center gap-2">
                  <div className="w-3 h-3 rounded-full bg-gradient-to-r from-amber-500 to-[#f59e0b] shadow" />
                  <span className="text-amber-400">Total Efetivamente Recebido</span>
                </div>
                <div className="flex items-center gap-2">
                  <div className="w-3 h-3 rounded-full bg-gradient-to-r from-blue-600 to-blue-400 opacity-70" />
                  <span className="text-slate-400">Total Previsto no Período</span>
                </div>
              </div>
            </div>

          </div>

          {/* Action Bar for Avulso Honorários */}
          <div className="flex justify-end">
            <button
              onClick={() => setShowAddForm(!showAddForm)}
              className="px-5 py-2.5 rounded-xl bg-amber-500 hover:bg-amber-600 text-slate-950 font-black text-xs transition-all flex items-center gap-2 shadow-md"
            >
              <Plus className="w-4 h-4" />
              + Lançar Honorário Avulso
            </button>
          </div>

          {/* Add Form */}
          {showAddForm && (
            <form onSubmit={handleSubmit} className="p-5 rounded-2xl glass-panel bg-white border border-amber-300 shadow-md space-y-4 animate-in fade-in">
              <h3 className="text-sm font-black text-slate-900">Novo Lançamento de Honorários</h3>

              <div className="grid grid-cols-1 sm:grid-cols-3 gap-3">
                <div>
                  <label className="block text-xs font-bold text-slate-700 mb-1">Cliente</label>
                  <input
                    type="text"
                    required
                    placeholder="Nome do Cliente"
                    value={clienteNome}
                    onChange={e => setClienteNome(e.target.value)}
                    className="w-full bg-slate-50 border border-slate-300 rounded-xl px-3 py-2 text-xs text-slate-900 font-medium focus:border-amber-500 focus:outline-none"
                  />
                </div>

                <div>
                  <label className="block text-xs font-bold text-slate-700 mb-1">Tipo de Honorários</label>
                  <select
                    value={tipo}
                    onChange={e => setTipo(e.target.value as TipoHonorario)}
                    className="w-full bg-slate-50 border border-slate-300 rounded-xl px-3 py-2 text-xs text-slate-900 font-bold focus:border-amber-500 focus:outline-none"
                  >
                    <option value="contratual">Honorários Contratuais</option>
                    <option value="sucumbencia">Sucumbenciais</option>
                    <option value="pro_labore">Pro Labore Mensal</option>
                    <option value="exito">Êxito</option>
                  </select>
                </div>

                <div>
                  <label className="block text-xs font-bold text-slate-700 mb-1">Valor (R$)</label>
                  <input
                    type="number"
                    required
                    value={valor}
                    onChange={e => setValor(e.target.value)}
                    className="w-full bg-slate-50 border border-slate-300 rounded-xl px-3 py-2 text-xs text-slate-900 font-bold focus:border-amber-500 focus:outline-none"
                  />
                </div>
              </div>

              <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                <div>
                  <label className="block text-xs font-bold text-slate-700 mb-1">Descrição</label>
                  <input
                    type="text"
                    required
                    placeholder="Ex: Parcela 1/3 ou Pro Labore Setembro"
                    value={descricao}
                    onChange={e => setDescricao(e.target.value)}
                    className="w-full bg-slate-50 border border-slate-300 rounded-xl px-3 py-2 text-xs text-slate-900 font-medium focus:border-amber-500 focus:outline-none"
                  />
                </div>

                <div>
                  <label className="block text-xs font-bold text-slate-700 mb-1">Vencimento</label>
                  <input
                    type="date"
                    required
                    value={vencimento}
                    onChange={e => setVencimento(e.target.value)}
                    className="w-full bg-slate-50 border border-slate-300 rounded-xl px-3 py-2 text-xs text-slate-900 font-bold focus:border-amber-500 focus:outline-none"
                  />
                </div>
              </div>

              <div className="flex justify-end gap-2 pt-2">
                <button
                  type="button"
                  onClick={() => setShowAddForm(false)}
                  className="px-4 py-2 rounded-xl bg-slate-100 text-slate-700 text-xs font-bold hover:bg-slate-200"
                >
                  Cancelar
                </button>
                <button
                  type="submit"
                  className="px-5 py-2 rounded-xl bg-amber-500 text-slate-950 font-black text-xs hover:bg-amber-600 transition-all shadow"
                >
                  Confirmar Lançamento
                </button>
              </div>
            </form>
          )}

          {/* Honorários List */}
          <div className="space-y-3">
            {financeiro.map(item => (
              <div
                key={item.id}
                className="p-4.5 rounded-2xl glass-card bg-white border border-slate-200 shadow-sm flex flex-col sm:flex-row sm:items-center justify-between gap-4"
              >
                <div className="space-y-1">
                  <div className="flex items-center gap-2">
                    <span className="text-[10px] font-black px-2.5 py-0.5 rounded bg-amber-100 text-amber-900 uppercase">
                      {item.tipo}
                    </span>
                    <span className={`text-[10px] font-black px-2.5 py-0.5 rounded uppercase ${
                      item.status === 'pago' ? 'bg-emerald-100 text-emerald-800 border border-emerald-200' : 'bg-amber-100 text-amber-800 border border-amber-200'
                    }`}>
                      {item.status}
                    </span>
                  </div>

                  <h4 className="text-base font-extrabold text-slate-900 mt-1">{item.descricao}</h4>
                  <p className="text-xs text-slate-600 font-medium">Cliente: <strong className="text-slate-900 font-bold">{item.clienteNome}</strong></p>
                </div>

                <div className="flex items-center justify-between sm:justify-end gap-4 pt-2 sm:pt-0 border-t sm:border-t-0 border-slate-100">
                  <div className="text-left sm:text-right">
                    <span className="text-lg font-black font-mono text-amber-800 block">
                      R$ {item.valor.toLocaleString('pt-BR', { minimumFractionDigits: 2 })}
                    </span>
                    <span className="text-xs text-slate-500 font-mono font-bold block">
                      Venc: {item.vencimento}
                    </span>
                  </div>

                  <button
                    onClick={() => toggleFinanceiroStatus(item.id)}
                    className={`px-4 py-2 rounded-xl text-xs font-black transition-all shadow-sm ${
                      item.status === 'pago'
                        ? 'bg-slate-100 text-slate-700 hover:bg-slate-200 border border-slate-300'
                        : 'bg-emerald-600 text-white hover:bg-emerald-700'
                    }`}
                  >
                    {item.status === 'pago' ? 'Marcar Pendente' : 'Confirmar Pago'}
                  </button>
                </div>
              </div>
            ))}
          </div>

        </div>
      )}

      {/* ─── TAB 2: CARNÊS DE PAGAMENTO & BENEFÍCIOS (BPC/LOAS) ────────────────────── */}
      {activeTab === 'carnes' && (
        <div className="space-y-6">

          {/* Header Action for New Carnê */}
          <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4">
            <div>
              <h3 className="text-lg font-black text-slate-900 flex items-center gap-2">
                <CreditCard className="w-5 h-5 text-amber-600" />
                Carnês de Pagamento & Benefícios Recorrentes (BPC / LOAS)
              </h3>
              <p className="text-xs text-slate-600 font-medium">
                Controle de carnês físicos/presenciais, parcelas, alertas por cores e emissão de talões
              </p>
            </div>

            <button
              onClick={() => setShowAddCarneForm(!showAddCarneForm)}
              className="w-full sm:w-auto px-5 py-2.5 rounded-xl bg-slate-900 text-white hover:bg-slate-800 font-black text-xs transition-all flex items-center justify-center gap-2 shadow-md"
            >
              <Plus className="w-4 h-4 text-amber-400" />
              + Gerar Novo Carnê de Cliente
            </button>
          </div>

          {/* Color Legend for Carnê Installment Status */}
          <div className="glass-panel bg-white p-4 rounded-2xl border border-slate-200 shadow-sm flex flex-wrap items-center justify-between gap-4 text-xs font-bold">
            <span className="text-slate-700 uppercase tracking-wider font-black">Legenda de Notificações de Cobrança:</span>
            
            <div className="flex flex-wrap items-center gap-4">
              <div className="flex items-center gap-1.5">
                <span className="w-3 h-3 rounded-full bg-emerald-500" />
                <span className="text-slate-800">Em dia / Pago (Verde)</span>
              </div>
              <div className="flex items-center gap-1.5">
                <span className="w-3 h-3 rounded-full bg-amber-500 animate-pulse" />
                <span className="text-slate-800">Prestes a Vencer em 5 Dias (Laranja)</span>
              </div>
              <div className="flex items-center gap-1.5">
                <span className="w-3 h-3 rounded-full bg-red-500" />
                <span className="text-slate-800">Em Atraso (Vermelho)</span>
              </div>
            </div>
          </div>

          {/* New Carnê Form */}
          {showAddCarneForm && (
            <form onSubmit={handleCarneSubmit} className="p-5 rounded-2xl glass-panel bg-white border border-amber-400 shadow-xl space-y-4 animate-in fade-in">
              <h3 className="text-sm font-black text-slate-900 flex items-center gap-2">
                <CreditCard className="w-4 h-4 text-amber-600" />
                Cadastrar Novo Carnê de Pagamento
              </h3>

              <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                <div>
                  <label className="block text-xs font-bold text-slate-700 mb-1">Nome do Cliente / Beneficiário</label>
                  <input
                    type="text"
                    required
                    placeholder="Ex: Maria das Graças Silva"
                    value={carneClienteNome}
                    onChange={e => setCarneClienteNome(e.target.value)}
                    className="w-full bg-slate-50 border border-slate-300 rounded-xl px-3 py-2 text-xs text-slate-900 font-medium focus:border-amber-500 focus:outline-none"
                  />
                </div>

                <div>
                  <label className="block text-xs font-bold text-slate-700 mb-1">CPF ou CNPJ do Cliente</label>
                  <input
                    type="text"
                    required
                    placeholder="Ex: 000.000.000-00"
                    value={carneClienteDoc}
                    onChange={e => setCarneClienteDoc(e.target.value)}
                    className="w-full bg-slate-50 border border-slate-300 rounded-xl px-3 py-2 text-xs text-slate-900 font-medium focus:border-amber-500 focus:outline-none"
                  />
                </div>
              </div>

              <div className="grid grid-cols-1 sm:grid-cols-4 gap-3">
                <div>
                  <label className="block text-xs font-bold text-slate-700 mb-1">Benefício / Referência</label>
                  <select
                    value={carneBeneficio}
                    onChange={e => setCarneBeneficio(e.target.value)}
                    className="w-full bg-slate-50 border border-slate-300 rounded-xl px-3 py-2 text-xs text-slate-900 font-bold focus:border-amber-500 focus:outline-none"
                  >
                    <option value="Benefício BPC / LOAS">Benefício BPC / LOAS</option>
                    <option value="Aposentadoria INSS">Aposentadoria INSS</option>
                    <option value="Honorário Recorrente Mensal">Honorário Recorrente Mensal</option>
                    <option value="Acordo Extrajudicial">Acordo Extrajudicial</option>
                  </select>
                </div>

                <div>
                  <label className="block text-xs font-bold text-slate-700 mb-1">Valor Total (R$)</label>
                  <input
                    type="number"
                    required
                    value={carneValorTotal}
                    onChange={e => setCarneValorTotal(e.target.value)}
                    className="w-full bg-slate-50 border border-slate-300 rounded-xl px-3 py-2 text-xs text-slate-900 font-bold focus:border-amber-500 focus:outline-none"
                  />
                </div>

                <div>
                  <label className="block text-xs font-bold text-slate-700 mb-1">Nº de Parcelas</label>
                  <input
                    type="number"
                    required
                    min="1"
                    max="60"
                    value={carneQtdParcelas}
                    onChange={e => setCarneQtdParcelas(e.target.value)}
                    className="w-full bg-slate-50 border border-slate-300 rounded-xl px-3 py-2 text-xs text-slate-900 font-bold focus:border-amber-500 focus:outline-none"
                  />
                </div>

                <div>
                  <label className="block text-xs font-bold text-slate-700 mb-1">Dia do Vencimento</label>
                  <input
                    type="number"
                    required
                    min="1"
                    max="31"
                    value={carneDiaVencimento}
                    onChange={e => setCarneDiaVencimento(e.target.value)}
                    className="w-full bg-slate-50 border border-slate-300 rounded-xl px-3 py-2 text-xs text-slate-900 font-bold focus:border-amber-500 focus:outline-none"
                  />
                </div>
              </div>

              <div className="flex justify-end gap-2 pt-2">
                <button
                  type="button"
                  onClick={() => setShowAddCarneForm(false)}
                  className="px-4 py-2 rounded-xl bg-slate-100 text-slate-700 text-xs font-bold hover:bg-slate-200"
                >
                  Cancelar
                </button>
                <button
                  type="submit"
                  className="px-6 py-2 rounded-xl bg-slate-900 text-white font-black text-xs hover:bg-slate-800 transition-all shadow"
                >
                  Gerar Carnê Completo
                </button>
              </div>
            </form>
          )}

          {/* List of Carnês */}
          <div className="space-y-4">
            {carnes.length === 0 ? (
              <div className="text-center py-12 glass-panel bg-white rounded-2xl border border-slate-200 shadow-sm space-y-2">
                <CreditCard className="w-10 h-10 text-amber-600 mx-auto" />
                <p className="text-sm font-bold text-slate-900">Nenhum carnê cadastrado ainda</p>
                <p className="text-xs text-slate-500">Cadastre o carnê de um cliente (BPC/LOAS) para acompanhar parcelas e emitir PDF.</p>
              </div>
            ) : (
              carnes.map(carne => (
                <div key={carne.id} className="p-5 rounded-2xl glass-card bg-white border border-slate-200 shadow-sm space-y-4">
                  
                  {/* Carnê Card Header */}
                  <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-3 border-b border-slate-100 pb-3">
                    <div>
                      <span className="text-[10px] font-black px-2.5 py-0.5 rounded bg-amber-100 text-amber-900 uppercase">
                        {carne.beneficioOuAcordo}
                      </span>
                      <h4 className="text-base font-extrabold text-slate-900 mt-1">{carne.clienteNome}</h4>
                      <p className="text-xs text-slate-500 font-mono font-bold">CPF/CNPJ: {carne.clienteDocumento}</p>
                    </div>

                    <div className="flex items-center gap-3 w-full sm:w-auto justify-between sm:justify-end">
                      <div className="text-left sm:text-right">
                        <span className="text-xs font-bold text-slate-500 block">Total: R$ {carne.valorTotal.toLocaleString('pt-BR')}</span>
                        <span className="text-xs font-black font-mono text-amber-800 block">
                          {carne.qtdParcelas}x de R$ {carne.valorParcela.toLocaleString('pt-BR', { minimumFractionDigits: 2 })}
                        </span>
                      </div>

                      {/* Download / Print PDF Button based on OS */}
                      <button
                        onClick={() => generateCarnePDF(carne)}
                        className="px-4 py-2 rounded-xl btn-gold-3d text-xs font-black transition-all shadow flex items-center gap-1.5 flex-shrink-0"
                      >
                        {isIOS ? <Printer className="w-4 h-4 text-slate-950" /> : <FileDown className="w-4 h-4 text-slate-950" />}
                        <span>{isIOS ? '👁️ Visualizar Carnê' : '📥 Baixar Carnê (PDF)'}</span>
                      </button>
                    </div>
                  </div>

                  {/* Installments Grid */}
                  <div className="space-y-2">
                    <h5 className="text-xs font-black text-slate-700 uppercase tracking-wider">Parcelas do Carnê:</h5>
                    
                    <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-2.5">
                      {carne.parcelas.map(parc => {
                        const statusInfo = getParcelaStatusColor(parc.status, parc.vencimento);

                        return (
                          <div
                            key={parc.id}
                            className={`p-3 rounded-xl border flex items-center justify-between gap-2 text-xs ${
                              parc.status === 'pago' ? 'bg-emerald-50/50 border-emerald-200' :
                              statusInfo.color === 'red' ? 'bg-red-50/80 border-red-300' :
                              statusInfo.color === 'amber' ? 'bg-amber-50/80 border-amber-300' : 'bg-slate-50 border-slate-200'
                            }`}
                          >
                            <div>
                              <span className="font-extrabold text-slate-900 block">Parcela {parc.numero}/{carne.qtdParcelas}</span>
                              <span className="font-mono font-bold text-amber-800 block">R$ {parc.valor.toLocaleString('pt-BR')}</span>
                              <span className="text-[10px] text-slate-500 font-mono block">Venc: {parc.vencimento}</span>
                              <div className="mt-1">{statusInfo.badge}</div>
                            </div>

                            <button
                              onClick={() => toggleParcelaCarneStatus(carne.id, parc.id)}
                              className={`p-2 rounded-xl transition-all shadow-sm ${
                                parc.status === 'pago'
                                  ? 'bg-emerald-600 text-white'
                                  : 'bg-slate-900 hover:bg-slate-800 text-white'
                              }`}
                              title={parc.status === 'pago' ? 'Marcar Pendente' : 'Baixar / Confirmar Pago'}
                            >
                              {parc.status === 'pago' ? <Check className="w-4 h-4" /> : <DollarSign className="w-4 h-4 text-amber-400" />}
                            </button>
                          </div>
                        );
                      })}
                    </div>
                  </div>

                </div>
              ))
            )}
          </div>

        </div>
      )}

    </div>
  );
};
