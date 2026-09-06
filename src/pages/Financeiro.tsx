import React, { useState } from 'react';
import { useLegal } from '../context/LegalContext';
import { TipoHonorario, StatusFinanceiro } from '../types/legal';
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
  Printer
} from 'lucide-react';

export const Financeiro: React.FC = () => {
  const { financeiro, toggleFinanceiroStatus, addFinanceiro, clientes, processos } = useLegal();

  const [showAddForm, setShowAddForm] = useState(false);
  const [clienteNome, setClienteNome] = useState('');
  const [tipo, setTipo] = useState<TipoHonorario>('contratual');
  const [descricao, setDescricao] = useState('');
  const [valor, setValor] = useState('3500');
  const [vencimento, setVencimento] = useState(new Date().toISOString().split('T')[0]);

  // Metrics
  const totalPago = financeiro
    .filter(f => f.status === 'pago')
    .reduce((acc, curr) => acc + curr.valor, 0);

  const totalPendente = financeiro
    .filter(f => f.status === 'pendente')
    .reduce((acc, curr) => acc + curr.valor, 0);

  const totalGeral = totalPago + totalPendente;

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

  const getTipoBadge = (t: TipoHonorario) => {
    switch (t) {
      case 'sucumbencia':
        return <span className="px-2.5 py-0.5 rounded bg-purple-100 text-purple-900 font-extrabold text-[10px]">Sucumbencial</span>;
      case 'pro_labore':
        return <span className="px-2.5 py-0.5 rounded bg-blue-100 text-blue-900 font-extrabold text-[10px]">Pro Labore Mensal</span>;
      case 'exito':
        return <span className="px-2.5 py-0.5 rounded bg-amber-100 text-amber-900 font-extrabold text-[10px]">Cláusula de Êxito</span>;
      default:
        return <span className="px-2.5 py-0.5 rounded bg-amber-100 text-amber-900 font-extrabold text-[10px]">Contratual</span>;
    }
  };

  return (
    <div className="space-y-6 animate-in fade-in duration-300 w-full">
      
      {/* Header */}
      <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4">
        <div>
          <h2 className="text-2xl font-black font-outfit text-slate-900 flex items-center gap-2">
            <DollarSign className="w-7 h-7 text-amber-600" />
            Financeiro & Honorários Advocatícios
          </h2>
          <p className="text-xs text-slate-600 font-medium">Controle de honorários contratuais, sucumbenciais e fluxo de caixa do escritório</p>
        </div>

        <button
          onClick={() => setShowAddForm(!showAddForm)}
          className="w-full sm:w-auto px-5 py-2.5 rounded-xl bg-amber-500 hover:bg-amber-600 text-slate-950 font-black text-xs transition-all flex items-center justify-center gap-2 shadow-md"
        >
          <Plus className="w-4 h-4" />
          Lançar Honorários
        </button>
      </div>

      {/* Financial Metrics Cards */}
      <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
        <div className="p-5 rounded-2xl glass-card bg-white border border-slate-200 shadow-sm">
          <div className="flex items-center justify-between">
            <span className="text-xs font-bold text-slate-600 uppercase">Total Recebido (Pago)</span>
            <div className="p-2.5 rounded-xl bg-emerald-100 text-emerald-800">
              <CheckCircle2 className="w-5 h-5" />
            </div>
          </div>
          <p className="text-3xl font-black font-outfit text-emerald-700 mt-3">
            R$ {totalPago.toLocaleString('pt-BR', { minimumFractionDigits: 2 })}
          </p>
          <p className="text-xs text-slate-500 font-medium mt-1">Lançamentos quitados</p>
        </div>

        <div className="p-5 rounded-2xl glass-card bg-white border border-slate-200 shadow-sm">
          <div className="flex items-center justify-between">
            <span className="text-xs font-bold text-slate-600 uppercase">Pendente de Recebimento</span>
            <div className="p-2.5 rounded-xl bg-amber-100 text-amber-800">
              <Clock className="w-5 h-5" />
            </div>
          </div>
          <p className="text-3xl font-black font-outfit text-amber-700 mt-3">
            R$ {totalPendente.toLocaleString('pt-BR', { minimumFractionDigits: 2 })}
          </p>
          <p className="text-xs text-slate-500 font-medium mt-1">Previsão no fluxo de caixa</p>
        </div>

        <div className="p-5 rounded-2xl glass-card bg-white border border-slate-200 shadow-sm">
          <div className="flex items-center justify-between">
            <span className="text-xs font-bold text-slate-600 uppercase">Faturamento Bruto Total</span>
            <div className="p-2.5 rounded-xl bg-slate-900 text-white">
              <ArrowUpRight className="w-5 h-5" />
            </div>
          </div>
          <p className="text-3xl font-black font-outfit text-slate-900 mt-3">
            R$ {totalGeral.toLocaleString('pt-BR', { minimumFractionDigits: 2 })}
          </p>
          <p className="text-xs text-slate-500 font-medium mt-1">Soma contratada</p>
        </div>
      </div>

      {/* Add Honorários Form */}
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

      {/* Financial Table / List */}
      <div className="space-y-3">
        {financeiro.map(item => (
          <div
            key={item.id}
            className="p-4.5 rounded-2xl glass-card bg-white border border-slate-200 shadow-sm flex flex-col sm:flex-row sm:items-center justify-between gap-4"
          >
            <div className="space-y-1">
              <div className="flex items-center gap-2">
                {getTipoBadge(item.tipo)}
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
  );
};
