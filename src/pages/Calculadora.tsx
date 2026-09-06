import React, { useState } from 'react';
import { Calculator, Calendar, Clock, DollarSign, Percent, Info, Scale } from 'lucide-react';

export const Calculadora: React.FC = () => {
  const [activeCalc, setActiveCalc] = useState<'prazos' | 'honorarios' | 'juros'>('prazos');

  // Prazo CPC State
  const [dataIntimacao, setDataIntimacao] = useState(new Date().toISOString().split('T')[0]);
  const [diasPrazos, setDiasPrazos] = useState('15');
  const [suspendFinaisSemana, setSuspendFinaisSemana] = useState(true);

  // Honorarios State
  const [valorCausaCalc, setValorCausaCalc] = useState('100000');
  const [percentualHonorarios, setPercentualHonorarios] = useState('15');

  // Juros State
  const [valorDebito, setValorDebito] = useState('25000');
  const [mesesAtraso, setMesesAtraso] = useState('12');
  const [taxaJurosMensal, setTaxaJurosMensal] = useState('1');

  // Calc Prazo Logic (CPC 2015 - Dias uteis)
  const calcularDataFinalPrazo = () => {
    let data = new Date(dataIntimacao);
    let diasContados = 0;
    const totalDias = parseInt(diasPrazos) || 0;

    data.setDate(data.getDate() + 1);

    while (diasContados < totalDias) {
      const dayOfWeek = data.getDay();
      const isWeekend = dayOfWeek === 0 || dayOfWeek === 6;

      if (!isWeekend || !suspendFinaisSemana) {
        diasContados++;
      }

      if (diasContados < totalDias) {
        data.setDate(data.getDate() + 1);
      }
    }

    return data.toLocaleDateString('pt-BR', { weekday: 'long', day: '2-digit', month: 'long', year: 'numeric' });
  };

  const valorHonorariosCalculado = (parseFloat(valorCausaCalc) || 0) * ((parseFloat(percentualHonorarios) || 0) / 100);
  const jurosCalculados = (parseFloat(valorDebito) || 0) * ((parseFloat(taxaJurosMensal) || 0) / 100) * (parseInt(mesesAtraso) || 0);
  const totalDebitoAtualizado = (parseFloat(valorDebito) || 0) + jurosCalculados;

  return (
    <div className="space-y-6 animate-in fade-in duration-300 w-full">
      
      {/* Header */}
      <div>
        <h2 className="text-2xl font-black font-outfit text-slate-900 flex items-center gap-2">
          <Calculator className="w-7 h-7 text-amber-600" />
          Calculadora Jurídica (CPC/2015)
        </h2>
        <p className="text-xs text-slate-600 font-medium">Contagem automatizada de prazos em dias úteis, honorários e correção monetária</p>
      </div>

      {/* Tabs Switcher */}
      <div className="flex flex-wrap items-center gap-2 border-b border-slate-200 pb-3">
        <button
          onClick={() => setActiveCalc('prazos')}
          className={`px-4 py-2.5 rounded-xl text-xs font-black transition-all flex items-center gap-2 ${
            activeCalc === 'prazos'
              ? 'bg-amber-500 text-slate-950 shadow-md font-black'
              : 'bg-white text-slate-700 hover:bg-slate-100 border border-slate-200'
          }`}
        >
          <Calendar className="w-4 h-4" />
          Prazo em Dias Úteis (CPC)
        </button>

        <button
          onClick={() => setActiveCalc('honorarios')}
          className={`px-4 py-2.5 rounded-xl text-xs font-black transition-all flex items-center gap-2 ${
            activeCalc === 'honorarios'
              ? 'bg-amber-500 text-slate-950 shadow-md font-black'
              : 'bg-white text-slate-700 hover:bg-slate-100 border border-slate-200'
          }`}
        >
          <Percent className="w-4 h-4" />
          Calculadora de Honorários
        </button>

        <button
          onClick={() => setActiveCalc('juros')}
          className={`px-4 py-2.5 rounded-xl text-xs font-black transition-all flex items-center gap-2 ${
            activeCalc === 'juros'
              ? 'bg-amber-500 text-slate-950 shadow-md font-black'
              : 'bg-white text-slate-700 hover:bg-slate-100 border border-slate-200'
          }`}
        >
          <DollarSign className="w-4 h-4" />
          Juros de Mora & Correção
        </button>
      </div>

      {/* Calculator 1: Prazos CPC */}
      {activeCalc === 'prazos' && (
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
          <div className="glass-panel bg-white p-6 rounded-2xl border border-slate-200 shadow-sm space-y-4">
            <h3 className="text-sm font-black text-slate-900 flex items-center gap-2">
              <Scale className="w-5 h-5 text-amber-600" />
              Parâmetros de Contagem (Art. 219 CPC)
            </h3>

            <div>
              <label className="block text-xs font-bold text-slate-700 mb-1">Data da Publicação / Intimação no DJe</label>
              <input
                type="date"
                value={dataIntimacao}
                onChange={e => setDataIntimacao(e.target.value)}
                className="w-full bg-slate-50 border border-slate-300 rounded-xl px-3 py-2 text-xs text-slate-900 font-bold focus:border-amber-500 focus:outline-none"
              />
            </div>

            <div>
              <label className="block text-xs font-bold text-slate-700 mb-1">Qtd. de Dias do Prazo</label>
              <select
                value={diasPrazos}
                onChange={e => setDiasPrazos(e.target.value)}
                className="w-full bg-slate-50 border border-slate-300 rounded-xl px-3 py-2 text-xs text-slate-900 font-bold focus:border-amber-500 focus:outline-none"
              >
                <option value="5">5 Dias (Agravo Interno / Embargos Declaração)</option>
                <option value="10">10 Dias (Contrarrazões / Manifestação)</option>
                <option value="15">15 Dias (Contestação / Apelação / Réplica / Recurso Ordinário)</option>
                <option value="30">30 Dias (Fazenda Pública em juízo)</option>
              </select>
            </div>

            <div className="flex items-center gap-2 pt-2">
              <input
                type="checkbox"
                id="suspend"
                checked={suspendFinaisSemana}
                onChange={e => setSuspendFinaisSemana(e.target.checked)}
                className="rounded accent-amber-500 w-4 h-4"
              />
              <label htmlFor="suspend" className="text-xs font-bold text-slate-800">
                Ignorar sábados e domingos (Dias Úteis - Art. 219 CPC)
              </label>
            </div>
          </div>

          {/* Result Box */}
          <div className="p-6 rounded-2xl bg-gradient-to-br from-slate-900 to-slate-950 text-white shadow-xl flex flex-col justify-between">
            <div>
              <span className="text-[10px] font-black text-amber-400 uppercase tracking-widest">Resultado do Prazo Fatal</span>
              <h4 className="text-2xl font-black font-outfit text-white mt-2 capitalize">
                {calcularDataFinalPrazo()}
              </h4>
              <p className="text-xs text-slate-300 font-medium mt-2">
                Prazo contado a partir do primeiro dia útil subsequente à intimação, nos termos dos arts. 219 e 224 do Código de Processo Civil.
              </p>
            </div>

            <div className="p-3.5 rounded-xl bg-slate-800 border border-slate-700 text-xs text-slate-200 flex items-start gap-2 mt-4 font-medium">
              <Info className="w-4 h-4 text-amber-400 flex-shrink-0 mt-0.5" />
              <span>Dica: Lembre-se de conferir feriados municipais ou suspensão do expediente no TJMA ou fórum local.</span>
            </div>
          </div>
        </div>
      )}

      {/* Calculator 2: Honorários */}
      {activeCalc === 'honorarios' && (
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
          <div className="glass-panel bg-white p-6 rounded-2xl border border-slate-200 shadow-sm space-y-4">
            <h3 className="text-sm font-black text-slate-900">Cálculo de Honorários Advocatícios</h3>

            <div>
              <label className="block text-xs font-bold text-slate-700 mb-1">Valor da Causa / Proveito Econômico (R$)</label>
              <input
                type="number"
                value={valorCausaCalc}
                onChange={e => setValorCausaCalc(e.target.value)}
                className="w-full bg-slate-50 border border-slate-300 rounded-xl px-3 py-2 text-xs text-slate-900 font-bold focus:border-amber-500 focus:outline-none"
              />
            </div>

            <div>
              <label className="block text-xs font-bold text-slate-700 mb-1">Percentual (%)</label>
              <input
                type="number"
                value={percentualHonorarios}
                onChange={e => setPercentualHonorarios(e.target.value)}
                className="w-full bg-slate-50 border border-slate-300 rounded-xl px-3 py-2 text-xs text-slate-900 font-bold focus:border-amber-500 focus:outline-none"
              />
            </div>
          </div>

          <div className="p-6 rounded-2xl bg-gradient-to-br from-slate-900 to-slate-950 text-white shadow-xl flex flex-col justify-center">
            <span className="text-[10px] font-black text-amber-400 uppercase tracking-widest">Honorários Calculados</span>
            <p className="text-3xl font-black font-outfit text-amber-400 mt-2">
              R$ {valorHonorariosCalculado.toLocaleString('pt-BR', { minimumFractionDigits: 2 })}
            </p>
            <p className="text-xs text-slate-300 font-medium mt-1">
              Reflete {percentualHonorarios}% sobre o valor de R$ {parseFloat(valorCausaCalc || '0').toLocaleString('pt-BR')}
            </p>
          </div>
        </div>
      )}

      {/* Calculator 3: Juros */}
      {activeCalc === 'juros' && (
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
          <div className="glass-panel bg-white p-6 rounded-2xl border border-slate-200 shadow-sm space-y-4">
            <h3 className="text-sm font-black text-slate-900">Cálculo de Juros de Mora</h3>

            <div>
              <label className="block text-xs font-bold text-slate-700 mb-1">Valor Principal do Débito (R$)</label>
              <input
                type="number"
                value={valorDebito}
                onChange={e => setValorDebito(e.target.value)}
                className="w-full bg-slate-50 border border-slate-300 rounded-xl px-3 py-2 text-xs text-slate-900 font-bold focus:border-amber-500 focus:outline-none"
              />
            </div>

            <div className="grid grid-cols-2 gap-3">
              <div>
                <label className="block text-xs font-bold text-slate-700 mb-1">Meses em Atraso</label>
                <input
                  type="number"
                  value={mesesAtraso}
                  onChange={e => setMesesAtraso(e.target.value)}
                  className="w-full bg-slate-50 border border-slate-300 rounded-xl px-3 py-2 text-xs text-slate-900 font-bold focus:border-amber-500 focus:outline-none"
                />
              </div>

              <div>
                <label className="block text-xs font-bold text-slate-700 mb-1">Taxa de Juros a.m. (%)</label>
                <input
                  type="number"
                  value={taxaJurosMensal}
                  onChange={e => setTaxaJurosMensal(e.target.value)}
                  className="w-full bg-slate-50 border border-slate-300 rounded-xl px-3 py-2 text-xs text-slate-900 font-bold focus:border-amber-500 focus:outline-none"
                />
              </div>
            </div>
          </div>

          <div className="p-6 rounded-2xl bg-gradient-to-br from-slate-900 to-slate-950 text-white shadow-xl flex flex-col justify-center space-y-4">
            <div>
              <span className="text-[10px] font-black text-slate-400 uppercase">Juros de Mora Acumulados</span>
              <p className="text-2xl font-black text-red-400 font-mono">
                + R$ {jurosCalculados.toLocaleString('pt-BR', { minimumFractionDigits: 2 })}
              </p>
            </div>

            <div className="pt-2 border-t border-slate-800">
              <span className="text-[10px] font-black text-amber-400 uppercase tracking-widest">Total Atualizado com Juros</span>
              <p className="text-3xl font-black font-outfit text-amber-400 mt-1">
                R$ {totalDebitoAtualizado.toLocaleString('pt-BR', { minimumFractionDigits: 2 })}
              </p>
            </div>
          </div>
        </div>
      )}

    </div>
  );
};
