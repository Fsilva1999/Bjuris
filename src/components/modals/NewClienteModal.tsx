import React, { useState } from 'react';
import { useLegal } from '../../context/LegalContext';
import { TipoCliente } from '../../types/legal';
import { X, UserPlus, User, Building } from 'lucide-react';

export const NewClienteModal: React.FC = () => {
  const { modalState, setModalState, addCliente } = useLegal();

  const [tipo, setTipo] = useState<TipoCliente>('PF');
  const [nome, setNome] = useState('');
  const [documento, setDocumento] = useState('');
  const [rgOuIe, setRgOuIe] = useState('');
  const [cnh, setCnh] = useState('');
  const [email, setEmail] = useState('');
  const [telefone, setTelefone] = useState('');
  const [whatsapp, setWhatsapp] = useState('');
  const [profissaoOuRamo, setProfissaoOuRamo] = useState('');
  const [estadoCivil, setEstadoCivil] = useState('Solteiro(a)');
  const [nacionalidade, setNacionalidade] = useState('Brasileiro(a)');
  const [endereco, setEndereco] = useState('');
  const [observacoes, setObservacoes] = useState('');

  // Previdenciário specific state
  const [numeroBeneficioINSS, setNumeroBeneficioINSS] = useState('');
  const [nitPisPasep, setNitPisPasep] = useState('');
  const [categoriaSegurado, setCategoriaSegurado] = useState<'Segurado Urbano' | 'Segurado Especial (Rural/Pescador)' | 'BPC/LOAS Idoso' | 'BPC/LOAS Deficiência' | 'Dependente / Pensão'>('Segurado Urbano');

  if (!modalState.novoCliente) return null;

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!nome || !documento) {
      alert('Por favor, informe o nome e CPF/CNPJ.');
      return;
    }

    addCliente({
      tipo,
      nome,
      documento,
      rgOuIe,
      cnh,
      email,
      telefone,
      whatsapp: whatsapp || telefone,
      profissaoOuRamo,
      estadoCivil,
      nacionalidade,
      endereco,
      observacoes,
      numeroBeneficioINSS,
      nitPisPasep,
      categoriaSegurado
    });

    setModalState(prev => ({ ...prev, novoCliente: false }));
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-slate-900/60 backdrop-blur-sm animate-in fade-in">
      <div className="w-full max-w-xl bg-white rounded-2xl border border-slate-300 shadow-2xl p-6 relative max-h-[92vh] overflow-y-auto text-slate-900">
        
        <button
          onClick={() => setModalState(prev => ({ ...prev, novoCliente: false }))}
          className="absolute top-4 right-4 text-slate-400 hover:text-slate-900 transition-colors"
        >
          <X className="w-6 h-6" />
        </button>

        <div className="flex items-center gap-3 mb-5 pb-3 border-b border-slate-100">
          <div className="p-3 rounded-xl bg-[#fef9c3] text-[#b8860b] border border-[#d4af37]/40 shadow-sm">
            <UserPlus className="w-6 h-6" />
          </div>
          <div>
            <h3 className="text-lg font-black font-outfit text-slate-900">Cadastrar Novo Cliente Advocatício</h3>
            <p className="text-xs text-slate-600 font-bold">Informe todos os dados para qualificação em ações judiciais</p>
          </div>
        </div>

        <form onSubmit={handleSubmit} className="space-y-4">
          <div className="flex items-center gap-3 p-1.5 bg-slate-100 rounded-xl border border-slate-300">
            <button
              type="button"
              onClick={() => setTipo('PF')}
              className={`flex-1 py-2.5 rounded-lg text-xs font-black flex items-center justify-center gap-2 transition-all ${
                tipo === 'PF' ? 'btn-gold-3d shadow-md' : 'text-slate-800 hover:text-slate-950 font-bold'
              }`}
            >
              <User className="w-4 h-4 text-slate-950" />
              Pessoa Física (PF)
            </button>
            <button
              type="button"
              onClick={() => setTipo('PJ')}
              className={`flex-1 py-2.5 rounded-lg text-xs font-black flex items-center justify-center gap-2 transition-all ${
                tipo === 'PJ' ? 'btn-gold-3d shadow-md' : 'text-slate-800 hover:text-slate-950 font-bold'
              }`}
            >
              <Building className="w-4 h-4 text-slate-950" />
              Pessoa Jurídica (PJ)
            </button>
          </div>

          <div>
            <label className="block text-xs font-black text-slate-900 mb-1 uppercase tracking-wide">
              {tipo === 'PF' ? 'Nome Completo (Conforme RG)' : 'Razão Social / Nome Fantasia'}
            </label>
            <input
              type="text"
              required
              placeholder={tipo === 'PF' ? 'Ex: João Carlos da Silva' : 'Ex: Brasil Soluções LTDA'}
              value={nome}
              onChange={e => setNome(e.target.value)}
              className="w-full bg-slate-50 border border-slate-300 rounded-xl px-3 py-2.5 text-xs text-slate-900 font-bold placeholder-slate-400 focus:border-[#d4af37] focus:bg-white focus:outline-none"
            />
          </div>

          <div className="grid grid-cols-2 gap-3">
            <div>
              <label className="block text-xs font-black text-slate-900 mb-1 uppercase tracking-wide">
                {tipo === 'PF' ? 'CPF' : 'CNPJ'}
              </label>
              <input
                type="text"
                required
                placeholder={tipo === 'PF' ? '000.000.000-00' : '00.000.000/0001-00'}
                value={documento}
                onChange={e => setDocumento(e.target.value)}
                className="w-full bg-slate-50 border border-slate-300 rounded-xl px-3 py-2.5 text-xs text-slate-900 font-bold placeholder-slate-400 focus:border-[#d4af37] focus:bg-white focus:outline-none"
              />
            </div>

            <div>
              <label className="block text-xs font-black text-slate-900 mb-1 uppercase tracking-wide">
                {tipo === 'PF' ? 'RG (com Órgão Expedidor)' : 'Inscrição Estadual'}
              </label>
              <input
                type="text"
                placeholder={tipo === 'PF' ? '00.000.000-0 SSP/MA' : '12.345.678-9'}
                value={rgOuIe}
                onChange={e => setRgOuIe(e.target.value)}
                className="w-full bg-slate-50 border border-slate-300 rounded-xl px-3 py-2.5 text-xs text-slate-900 font-bold placeholder-slate-400 focus:border-[#d4af37] focus:bg-white focus:outline-none"
              />
            </div>
          </div>

          {tipo === 'PF' && (
            <div className="grid grid-cols-3 gap-3">
              <div>
                <label className="block text-xs font-black text-slate-900 mb-1 uppercase tracking-wide">Nº CNH (Opcional)</label>
                <input
                  type="text"
                  placeholder="00000000000"
                  value={cnh}
                  onChange={e => setCnh(e.target.value)}
                  className="w-full bg-slate-50 border border-slate-300 rounded-xl px-3 py-2.5 text-xs text-slate-900 font-bold placeholder-slate-400 focus:border-[#d4af37] focus:bg-white focus:outline-none"
                />
              </div>

              <div>
                <label className="block text-xs font-black text-slate-900 mb-1 uppercase tracking-wide">Estado Civil</label>
                <select
                  value={estadoCivil}
                  onChange={e => setEstadoCivil(e.target.value)}
                  className="w-full bg-slate-50 border border-slate-300 rounded-xl px-3 py-2.5 text-xs text-slate-900 font-bold focus:border-[#d4af37] focus:bg-white focus:outline-none"
                >
                  <option value="Solteiro(a)" className="text-slate-900 font-bold">Solteiro(a)</option>
                  <option value="Casado(a)" className="text-slate-900 font-bold">Casado(a)</option>
                  <option value="Divorciado(a)" className="text-slate-900 font-bold">Divorciado(a)</option>
                  <option value="Viúvo(a)" className="text-slate-900 font-bold">Viúvo(a)</option>
                  <option value="União Estável" className="text-slate-900 font-bold">União Estável</option>
                </select>
              </div>

              <div>
                <label className="block text-xs font-black text-slate-900 mb-1 uppercase tracking-wide">Nacionalidade</label>
                <input
                  type="text"
                  value={nacionalidade}
                  onChange={e => setNacionalidade(e.target.value)}
                  className="w-full bg-slate-50 border border-slate-300 rounded-xl px-3 py-2.5 text-xs text-slate-900 font-bold focus:border-[#d4af37] focus:bg-white focus:outline-none"
                />
              </div>
            </div>
          )}

          <div className="grid grid-cols-2 gap-3">
            <div>
              <label className="block text-xs font-black text-slate-900 mb-1 uppercase tracking-wide">E-mail de Contato</label>
              <input
                type="email"
                placeholder="cliente@email.com"
                value={email}
                onChange={e => setEmail(e.target.value)}
                className="w-full bg-slate-50 border border-slate-300 rounded-xl px-3 py-2.5 text-xs text-slate-900 font-bold placeholder-slate-400 focus:border-[#d4af37] focus:bg-white focus:outline-none"
              />
            </div>

            <div>
              <label className="block text-xs font-black text-slate-900 mb-1 uppercase tracking-wide">WhatsApp / Celular</label>
              <input
                type="text"
                placeholder="(98) 99999-8888"
                value={whatsapp}
                onChange={e => setWhatsapp(e.target.value)}
                className="w-full bg-slate-50 border border-slate-300 rounded-xl px-3 py-2.5 text-xs text-slate-900 font-bold placeholder-slate-400 focus:border-[#d4af37] focus:bg-white focus:outline-none"
              />
            </div>
          </div>

          <div>
            <label className="block text-xs font-black text-slate-900 mb-1 uppercase tracking-wide">
              {tipo === 'PF' ? 'Profissão' : 'Ramo de Atuação'}
            </label>
            <input
              type="text"
              placeholder={tipo === 'PF' ? 'Ex: Professor, Comerciante, Autônomo' : 'Ex: Logística e Comércio'}
              value={profissaoOuRamo}
              onChange={e => setProfissaoOuRamo(e.target.value)}
              className="w-full bg-slate-50 border border-slate-300 rounded-xl px-3 py-2.5 text-xs text-slate-900 font-bold placeholder-slate-400 focus:border-[#d4af37] focus:bg-white focus:outline-none"
            />
          </div>

          <div>
            <label className="block text-xs font-black text-slate-900 mb-1 uppercase tracking-wide">Endereço Completo (para Qualificação)</label>
            <input
              type="text"
              placeholder="Rua, Número, Bairro, Cidade - UF (ex: São Luís - MA), CEP"
              value={endereco}
              onChange={e => setEndereco(e.target.value)}
              className="w-full bg-slate-50 border border-slate-300 rounded-xl px-3 py-2.5 text-xs text-slate-900 font-bold placeholder-slate-400 focus:border-[#d4af37] focus:bg-white focus:outline-none"
            />
          </div>

          {/* Previdenciário Specific Form Block */}
          {tipo === 'PF' && (
            <div className="p-4 rounded-xl bg-amber-50 border border-amber-300 space-y-3">
              <span className="text-xs font-black text-amber-900 uppercase tracking-wider block">
                🛡️ Dados Previdenciários & Benefício INSS (Opcional)
              </span>

              <div className="grid grid-cols-1 sm:grid-cols-3 gap-3">
                <div>
                  <label className="block text-xs font-bold text-slate-800 mb-1">Nº do Benefício (NB INSS)</label>
                  <input
                    type="text"
                    placeholder="000.000.000-0"
                    value={numeroBeneficioINSS}
                    onChange={e => setNumeroBeneficioINSS(e.target.value)}
                    className="w-full bg-white border border-slate-300 rounded-xl px-3 py-2 text-xs text-slate-900 font-mono font-bold focus:border-amber-500 focus:outline-none"
                  />
                </div>

                <div>
                  <label className="block text-xs font-bold text-slate-800 mb-1">NIT / PIS / PASEP</label>
                  <input
                    type="text"
                    placeholder="000.00000.00-0"
                    value={nitPisPasep}
                    onChange={e => setNitPisPasep(e.target.value)}
                    className="w-full bg-white border border-slate-300 rounded-xl px-3 py-2 text-xs text-slate-900 font-mono font-bold focus:border-amber-500 focus:outline-none"
                  />
                </div>

                <div>
                  <label className="block text-xs font-bold text-slate-800 mb-1">Categoria do Segurado</label>
                  <select
                    value={categoriaSegurado}
                    onChange={e => setCategoriaSegurado(e.target.value as any)}
                    className="w-full bg-white border border-slate-300 rounded-xl px-3 py-2 text-xs text-slate-900 font-bold focus:border-amber-500 focus:outline-none"
                  >
                    <option value="Segurado Urbano">Segurado Urbano</option>
                    <option value="Segurado Especial (Rural/Pescador)">Segurado Especial (Rural/Pescador)</option>
                    <option value="BPC/LOAS Idoso">BPC/LOAS Idoso</option>
                    <option value="BPC/LOAS Deficiência">BPC/LOAS Deficiência</option>
                    <option value="Dependente / Pensão">Dependente / Pensão</option>
                  </select>
                </div>
              </div>
            </div>
          )}

          <div className="pt-4 border-t border-slate-100 flex justify-end gap-3">
            <button
              type="button"
              onClick={() => setModalState(prev => ({ ...prev, novoCliente: false }))}
              className="px-5 py-2.5 rounded-xl bg-slate-100 hover:bg-slate-200 text-slate-800 text-xs font-black transition-colors border border-slate-300"
            >
              Cancelar
            </button>
            <button
              type="submit"
              className="px-6 py-2.5 rounded-xl btn-gold-3d text-xs font-black transition-all shadow-md"
            >
              Salvar Cliente
            </button>
          </div>
        </form>

      </div>
    </div>
  );
};
