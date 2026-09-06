import React, { useState } from 'react';
import { Scale, Eye, EyeOff, Mail, Phone, Lock, User, ArrowRight, Loader2, CheckCircle2 } from 'lucide-react';
import { useAuth } from '../../contexts/AuthContext';

interface RegisterPageProps {
  onGoToLogin: () => void;
}

const passwordStrength = (pw: string): { score: number; label: string; color: string } => {
  let score = 0;
  if (pw.length >= 6) score++;
  if (pw.length >= 10) score++;
  if (/[A-Z]/.test(pw)) score++;
  if (/[0-9]/.test(pw)) score++;
  if (/[^A-Za-z0-9]/.test(pw)) score++;
  const levels = [
    { label: '', color: 'bg-slate-200' },
    { label: 'Muito fraca', color: 'bg-red-500' },
    { label: 'Fraca', color: 'bg-orange-500' },
    { label: 'Razoável', color: 'bg-yellow-500' },
    { label: 'Boa', color: 'bg-blue-500' },
    { label: 'Excelente', color: 'bg-green-500' },
  ];
  return { score, ...levels[score] };
};

const formatPhone = (value: string) => {
  const digits = value.replace(/\D/g, '').slice(0, 11);
  if (digits.length <= 2) return `(${digits}`;
  if (digits.length <= 7) return `(${digits.slice(0, 2)}) ${digits.slice(2)}`;
  return `(${digits.slice(0, 2)}) ${digits.slice(2, 7)}-${digits.slice(7)}`;
};

export const RegisterPage: React.FC<RegisterPageProps> = ({ onGoToLogin }) => {
  const { signUp } = useAuth();
  const [nome, setNome] = useState('');
  const [email, setEmail] = useState('');
  const [celular, setCelular] = useState('');
  const [password, setPassword] = useState('');
  const [confirmPassword, setConfirmPassword] = useState('');
  const [showPw, setShowPw] = useState(false);
  const [showCPw, setShowCPw] = useState(false);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [success, setSuccess] = useState(false);

  const pwStrength = passwordStrength(password);

  const handleCelularChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    setCelular(formatPhone(e.target.value));
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setError(null);

    // Validation
    if (!nome.trim() || nome.trim().length < 3) {
      setError('Digite seu nome completo (mínimo 3 caracteres).');
      return;
    }
    if (!email.trim() || !/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(email)) {
      setError('Digite um e-mail válido.');
      return;
    }
    const phoneDigits = celular.replace(/\D/g, '');
    if (phoneDigits.length < 10) {
      setError('Digite um número de celular válido com DDD.');
      return;
    }
    if (password.length < 6) {
      setError('A senha deve ter pelo menos 6 caracteres.');
      return;
    }
    if (password !== confirmPassword) {
      setError('As senhas não coincidem. Verifique e tente novamente.');
      return;
    }

    setLoading(true);
    const { error } = await signUp(email, celular, password, nome.trim());
    setLoading(false);

    if (error) {
      setError(error);
    } else {
      setSuccess(true);
    }
  };

  if (success) {
    return (
      <div className="min-h-screen bg-white flex items-center justify-center p-4">
        <div className="w-full max-w-md text-center space-y-6">
          <div className="inline-flex items-center justify-center w-20 h-20 rounded-full bg-green-100 mx-auto">
            <CheckCircle2 className="w-10 h-10 text-green-600" />
          </div>
          <h2 className="text-2xl font-black text-slate-900">Conta criada com sucesso!</h2>
          <p className="text-sm text-slate-600 font-medium">
            Um e-mail de confirmação foi enviado para <strong>{email}</strong>.<br />
            Confirme seu e-mail e faça o login.
          </p>
          <button
            onClick={onGoToLogin}
            className="w-full py-3 rounded-xl btn-gold-3d text-sm font-black flex items-center justify-center gap-2"
          >
            Ir para o Login
            <ArrowRight className="w-4 h-4 text-slate-950" />
          </button>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-white flex items-center justify-center p-4 relative overflow-hidden">
      {/* Background decoration */}
      <div className="absolute inset-0 overflow-hidden pointer-events-none">
        <div className="absolute -top-40 -right-40 w-96 h-96 rounded-full bg-[#d4af37]/5 blur-3xl" />
        <div className="absolute -bottom-40 -left-40 w-96 h-96 rounded-full bg-[#b8860b]/5 blur-3xl" />
      </div>

      <div className="w-full max-w-md relative z-10">
        {/* Logo */}
        <div className="text-center mb-8">
          <div className="inline-flex items-center justify-center w-20 h-20 rounded-3xl bg-slate-950 shadow-2xl mb-4 relative">
            <img
              src="/logo-bjuris.png"
              alt="BJuris"
              className="w-14 h-14 object-contain"
              onError={(e) => {
                const target = e.target as HTMLImageElement;
                target.style.display = 'none';
                target.nextElementSibling?.removeAttribute('hidden');
              }}
            />
            <Scale className="w-10 h-10 text-[#d4af37] hidden" aria-hidden="true" />
            <div className="absolute -inset-1 rounded-[20px] border-2 border-[#d4af37]/40 pointer-events-none" />
          </div>
          <h1 className="text-3xl font-black font-outfit text-slate-950 tracking-tight">
            <span className="text-[#b8860b]">B</span>Juris
          </h1>
          <p className="text-sm text-slate-500 font-medium mt-1">Criar nova conta de advogado</p>
        </div>

        {/* Card */}
        <div className="bg-white border border-slate-200 rounded-3xl shadow-xl p-8 space-y-5">
          <div>
            <h2 className="text-xl font-black text-slate-900">Cadastro</h2>
            <p className="text-xs text-slate-500 font-medium mt-1">Preencha seus dados para criar sua conta</p>
          </div>

          <form onSubmit={handleSubmit} className="space-y-4" id="register-form">
            {/* Nome */}
            <div className="space-y-1">
              <label htmlFor="register-nome" className="text-xs font-bold text-slate-700">Nome Completo</label>
              <div className="relative">
                <User className="absolute left-3.5 top-1/2 -translate-y-1/2 w-4 h-4 text-slate-400" />
                <input
                  id="register-nome"
                  type="text"
                  value={nome}
                  onChange={e => setNome(e.target.value)}
                  placeholder="Dr(a). Seu Nome Completo"
                  autoComplete="name"
                  className="w-full pl-10 pr-4 py-3 rounded-xl border border-slate-300 bg-slate-50 text-slate-900 text-sm font-medium focus:outline-none focus:border-[#d4af37] focus:ring-2 focus:ring-[#d4af37]/20 transition-all"
                />
              </div>
            </div>

            {/* Email */}
            <div className="space-y-1">
              <label htmlFor="register-email" className="text-xs font-bold text-slate-700">E-mail</label>
              <div className="relative">
                <Mail className="absolute left-3.5 top-1/2 -translate-y-1/2 w-4 h-4 text-slate-400" />
                <input
                  id="register-email"
                  type="email"
                  value={email}
                  onChange={e => setEmail(e.target.value)}
                  placeholder="seu@email.com"
                  autoComplete="email"
                  className="w-full pl-10 pr-4 py-3 rounded-xl border border-slate-300 bg-slate-50 text-slate-900 text-sm font-medium focus:outline-none focus:border-[#d4af37] focus:ring-2 focus:ring-[#d4af37]/20 transition-all"
                />
              </div>
            </div>

            {/* Celular */}
            <div className="space-y-1">
              <label htmlFor="register-celular" className="text-xs font-bold text-slate-700">Número de Celular (com DDD)</label>
              <div className="relative">
                <Phone className="absolute left-3.5 top-1/2 -translate-y-1/2 w-4 h-4 text-slate-400" />
                <input
                  id="register-celular"
                  type="tel"
                  value={celular}
                  onChange={handleCelularChange}
                  placeholder="(98) 99999-0000"
                  autoComplete="tel"
                  className="w-full pl-10 pr-4 py-3 rounded-xl border border-slate-300 bg-slate-50 text-slate-900 text-sm font-medium focus:outline-none focus:border-[#d4af37] focus:ring-2 focus:ring-[#d4af37]/20 transition-all"
                />
              </div>
            </div>

            {/* Password */}
            <div className="space-y-1">
              <label htmlFor="register-password" className="text-xs font-bold text-slate-700">Senha</label>
              <div className="relative">
                <Lock className="absolute left-3.5 top-1/2 -translate-y-1/2 w-4 h-4 text-slate-400" />
                <input
                  id="register-password"
                  type={showPw ? 'text' : 'password'}
                  value={password}
                  onChange={e => setPassword(e.target.value)}
                  placeholder="Mínimo 6 caracteres"
                  autoComplete="new-password"
                  className="w-full pl-10 pr-12 py-3 rounded-xl border border-slate-300 bg-slate-50 text-slate-900 text-sm font-medium focus:outline-none focus:border-[#d4af37] focus:ring-2 focus:ring-[#d4af37]/20 transition-all"
                />
                <button
                  type="button"
                  onClick={() => setShowPw(v => !v)}
                  className="absolute right-3.5 top-1/2 -translate-y-1/2 text-slate-400 hover:text-slate-700 transition-colors"
                >
                  {showPw ? <EyeOff className="w-4 h-4" /> : <Eye className="w-4 h-4" />}
                </button>
              </div>
              {/* Password strength bar */}
              {password.length > 0 && (
                <div className="space-y-1 pt-1">
                  <div className="flex gap-1">
                    {[1, 2, 3, 4, 5].map(i => (
                      <div
                        key={i}
                        className={`h-1 flex-1 rounded-full transition-colors duration-300 ${i <= pwStrength.score ? pwStrength.color : 'bg-slate-200'}`}
                      />
                    ))}
                  </div>
                  {pwStrength.label && <p className="text-[10px] text-slate-500 font-medium">Força: {pwStrength.label}</p>}
                </div>
              )}
            </div>

            {/* Confirm Password */}
            <div className="space-y-1">
              <label htmlFor="register-confirm-password" className="text-xs font-bold text-slate-700">Confirmar Senha</label>
              <div className="relative">
                <Lock className="absolute left-3.5 top-1/2 -translate-y-1/2 w-4 h-4 text-slate-400" />
                <input
                  id="register-confirm-password"
                  type={showCPw ? 'text' : 'password'}
                  value={confirmPassword}
                  onChange={e => setConfirmPassword(e.target.value)}
                  placeholder="Repita a senha"
                  autoComplete="new-password"
                  className={`w-full pl-10 pr-12 py-3 rounded-xl border bg-slate-50 text-slate-900 text-sm font-medium focus:outline-none focus:ring-2 transition-all ${
                    confirmPassword && password !== confirmPassword
                      ? 'border-red-400 focus:border-red-400 focus:ring-red-200'
                      : confirmPassword && password === confirmPassword
                      ? 'border-green-400 focus:border-green-400 focus:ring-green-200'
                      : 'border-slate-300 focus:border-[#d4af37] focus:ring-[#d4af37]/20'
                  }`}
                />
                <button
                  type="button"
                  onClick={() => setShowCPw(v => !v)}
                  className="absolute right-3.5 top-1/2 -translate-y-1/2 text-slate-400 hover:text-slate-700 transition-colors"
                >
                  {showCPw ? <EyeOff className="w-4 h-4" /> : <Eye className="w-4 h-4" />}
                </button>
              </div>
              {confirmPassword && password !== confirmPassword && (
                <p className="text-[10px] text-red-500 font-medium">As senhas não coincidem</p>
              )}
              {confirmPassword && password === confirmPassword && (
                <p className="text-[10px] text-green-600 font-medium flex items-center gap-1">
                  <CheckCircle2 className="w-3 h-3" /> Senhas coincidem
                </p>
              )}
            </div>

            {/* Error */}
            {error && (
              <div className="p-3 rounded-xl bg-red-50 border border-red-200">
                <p className="text-xs text-red-700 font-medium">{error}</p>
              </div>
            )}

            {/* Submit */}
            <button
              type="submit"
              id="register-submit-btn"
              disabled={loading}
              className="w-full py-3 rounded-xl btn-gold-3d text-sm font-black flex items-center justify-center gap-2 disabled:opacity-50 disabled:cursor-not-allowed transition-all"
            >
              {loading ? (
                <Loader2 className="w-4 h-4 animate-spin text-slate-950" />
              ) : (
                <>
                  <span>Criar Conta</span>
                  <ArrowRight className="w-4 h-4 text-slate-950" />
                </>
              )}
            </button>
          </form>

          {/* Go to login */}
          <div className="pt-2 border-t border-slate-100">
            <button
              id="go-to-login-btn"
              onClick={onGoToLogin}
              className="w-full text-xs text-slate-600 hover:text-[#b8860b] font-medium transition-colors text-center"
            >
              Já tenho uma conta → <span className="font-bold text-[#b8860b]">Entrar</span>
            </button>
          </div>
        </div>

        <p className="text-center text-[10px] text-slate-400 mt-6 font-medium">
          BJuris © {new Date().getFullYear()} · Todos os direitos reservados
        </p>
      </div>
    </div>
  );
};
