import React, { useState, useEffect } from 'react';
import { useLegal } from '../../context/LegalContext';
import { X, FileText, Printer, CheckCircle, Download } from 'lucide-react';

export const ProcuracaoModal: React.FC = () => {
  const { modalState, setModalState, clientes, perfil } = useLegal();

  const [clienteId, setClienteId] = useState('');
  const [poderesGerais, setPoderesGerais] = useState(true);
  const [poderesEspeciais, setPoderesEspeciais] = useState(true);
  const [cidadeData, setCidadeData] = useState('São Paulo - SP, ' + new Date().toLocaleDateString('pt-BR'));

  const clienteSelecionado = clientes.find(c => c.id === clienteId) || modalState.clienteParaProcuracao || clientes[0];

  useEffect(() => {
    if (modalState.clienteParaProcuracao) {
      setClienteId(modalState.clienteParaProcuracao.id);
    }
  }, [modalState.clienteParaProcuracao]);

  if (!modalState.procuracao) return null;

  const handlePrint = () => {
    window.print();
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-slate-950/80 backdrop-blur-sm animate-in fade-in">
      <div className="w-full max-w-3xl glass-panel rounded-2xl border border-slate-700/80 shadow-2xl p-6 relative max-h-[92vh] overflow-y-auto print:p-0 print:bg-white print:text-black">
        
        <button
          onClick={() => setModalState(prev => ({ ...prev, procuracao: false }))}
          className="absolute top-4 right-4 text-slate-400 hover:text-slate-100 transition-colors print:hidden"
        >
          <X className="w-5 h-5" />
        </button>

        {/* Modal Header */}
        <div className="flex items-center justify-between mb-5 pb-3 border-b border-slate-800 print:hidden">
          <div className="flex items-center gap-3">
            <div className="p-2.5 rounded-xl bg-gold-500/20 text-gold-400 border border-gold-500/30">
              <FileText className="w-5 h-5" />
            </div>
            <div>
              <h3 className="text-base font-bold text-slate-100">Gerador de Procuração Ad Judicia</h3>
              <p className="text-xs text-slate-400">Documento pré-preenchido pronto para impressão ou assinatura digital</p>
            </div>
          </div>

          <div className="flex items-center gap-2">
            <select
              value={clienteSelecionado?.id || ''}
              onChange={e => setClienteId(e.target.value)}
              className="bg-slate-900 border border-slate-800 rounded-xl px-3 py-1.5 text-xs text-slate-200 focus:border-gold-500 focus:outline-none"
            >
              {clientes.map(c => (
                <option key={c.id} value={c.id}>{c.nome}</option>
              ))}
            </select>

            <button
              onClick={handlePrint}
              className="px-3 py-1.5 rounded-xl bg-gold-500 text-slate-950 font-bold text-xs hover:bg-gold-400 transition-all flex items-center gap-1.5 shadow"
            >
              <Printer className="w-3.5 h-3.5" />
              Imprimir / PDF
            </button>
          </div>
        </div>

        {/* Printable Document Box */}
        {clienteSelecionado && (
          <div className="p-8 bg-slate-900/90 rounded-xl border border-slate-800 text-slate-200 font-sans leading-relaxed text-sm space-y-5 print:bg-white print:text-slate-950 print:border-none print:shadow-none print:p-0">
            
            <div className="text-center font-bold uppercase tracking-widest border-b pb-4 border-slate-800 print:border-black">
              <h2 className="text-xl font-outfit">Procuração "Ad Judicia Et Extra"</h2>
            </div>

            <div>
              <h4 className="font-bold text-gold-400 print:text-black uppercase text-xs tracking-wider mb-1">OUTORGANTE:</h4>
              <p className="text-xs">
                <strong>{clienteSelecionado.nome}</strong>, inscrito(a) no {clienteSelecionado.tipo === 'PF' ? 'CPF sob o nº' : 'CNPJ sob o nº'} <strong>{clienteSelecionado.documento}</strong>
                {clienteSelecionado.rgOuIe && `, portador(a) do RG/IE nº ${clienteSelecionado.rgOuIe}`},
                {clienteSelecionado.profissaoOuRamo && ` ${clienteSelecionado.profissaoOuRamo}`},
                residente e domiciliado(a) em: {clienteSelecionado.endereco}.
              </p>
            </div>

            <div>
              <h4 className="font-bold text-gold-400 print:text-black uppercase text-xs tracking-wider mb-1">OUTORGADO:</h4>
              <p className="text-xs">
                <strong>{perfil.nome}</strong>, advogado(a) inscrito(a) na <strong>OAB/{perfil.oabUf} sob o nº {perfil.oabNumero}</strong> e CPF nº {perfil.cpf}, integrante do escritório <strong>{perfil.escritorio}</strong>, com endereço profissional na {perfil.escritorio}, Telefone: {perfil.telefone}, E-mail: {perfil.email}.
              </p>
            </div>

            <div>
              <h4 className="font-bold text-gold-400 print:text-black uppercase text-xs tracking-wider mb-1">PODERES:</h4>
              <p className="text-xs text-justify">
                Pelo presente instrumento particular de procuração, o(a) OUTORGANTE nomeia e constitui o(a) OUTORGADO seu bastante procurador, concedendo-lhe os amplos poderes da cláusula <strong>"ad judicia et extra"</strong>, para o foro em geral, em qualquer Juízo, Tribunal ou Repartição Pública (Federal, Estadual ou Municipal).
              </p>
              {poderesEspeciais && (
                <p className="text-xs text-justify mt-2">
                  <strong>Poderes Especiais:</strong> Especialmente para confessar, reconhecer a procedência do pedido, transigir, desistir, renunciar ao direito sobre o qual se funda a ação, firmar compromissos, receber quantias, dar quitação, substabelecer com ou sem reserva de poderes, e praticar todos os atos necessários para o fiel cumprimento deste mandato.
                </p>
              )}
            </div>

            <div className="pt-6 text-right text-xs">
              <p>{cidadeData}</p>
            </div>

            <div className="pt-12 flex justify-center">
              <div className="text-center w-72 border-t border-slate-700 print:border-black pt-2">
                <p className="font-bold text-xs">{clienteSelecionado.nome}</p>
                <p className="text-[10px] text-slate-400 print:text-slate-600">OUTORGANTE</p>
              </div>
            </div>

          </div>
        )}

      </div>
    </div>
  );
};
