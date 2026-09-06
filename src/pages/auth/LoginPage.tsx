import React, { useState } from 'react';
import { Scale, Eye, EyeOff, Mail, Phone, Lock, ArrowRight, Loader2 } from 'lucide-react';
import { useAuth } from '../../contexts/AuthContext';

interface LoginPageProps {
  onGoToRegister: () => void;
}

export const LoginPage: React.FC<LoginPageProps> = ({ onGoToRegister }) => {
  const { signIn } = useAuth();
  const [emailOrPhone, setEmailOrPhone] = useState('');
  const [password, setPassword] = useState('');
  const [showPassword, setShowPassword] = useState(false);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [showForgot, setShowForgot] = useState(false);
  const [forgotEmail, setForgotEmail] = useState('');
  const [forgotMsg, setForgotMsg] = useState<string | null>(null);
  const [forgotLoading, setForgotLoading] = useState(false);
  const { resetPassword } = useAuth();

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setError(null);
    if (!emailOrPhone.trim() || !password) {
      setError('Preencha todos os campos.');
      return;
    }
    setLoading(true);
    const { error } = await signIn(emailOrPhone, password);
    setLoading(false);
    if (error) setError(error);
  };

  const handleForgot = async (e: React.FormEvent) => {
    e.preventDefault();
    setForgotLoading(true);
    const { error } = await resetPassword(forgotEmail);
    setForgotLoading(false);
    if (error) setForgotMsg('Erro ao enviar. Verifique o e-mail digitado.');
    else setForgotMsg('✅ E-mail de recuperação enviado! Verifique sua caixa de entrada.');
  };

  const isPhone = /^[\d\s\+\-\(\)]+$/.test(emailOrPhone.trim()) && emailOrPhone.replace(/\D/g, '').length >= 10;
  const InputIcon = isPhone ? Phone : Mail;

  return (
    <div className="min-h-screen bg-white flex items-center justify-center p-4 relative overflow-hidden">
      {/* Background decoration */}
      <div className="absolute inset-0 overflow-hidden pointer-events-none">
        <div className="absolute -top-40 -left-40 w-96 h-96 rounded-full bg-[#d4af37]/5 blur-3xl" />
        <div className="absolute -bottom-40 -right-40 w-96 h-96 rounded-full bg-[#b8860b]/5 blur-3xl" />
        <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[600px] h-[600px] rounded-full border border-[#d4af37]/10" />
        <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[400px] h-[400px] rounded-full border border-[#d4af37]/10" />
      </div>

      <div className="w-full max-w-md relative z-10">
        {/* Logo / Header */}
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
            {/* 3D gold ring */}
            <div className="absolute -inset-1 rounded-[20px] border-2 border-[#d4af37]/40 pointer-events-none" />
          </div>
          <h1 className="text-3xl font-black font-outfit text-slate-950 tracking-tight">
            <span className="text-[#b8860b]">B</span>Juris
          </h1>
          <p className="text-sm text-slate-500 font-medium mt-1">Sistema de Gestão Jurídica</p>
        </div>

        {/* Card */}
        <div className="bg-white border border-slate-200 rounded-3xl shadow-xl p-8 space-y-6">
          {!showForgot ? (
            <>
              <div>
                <h2 className="text-xl font-black text-slate-900">Entrar na sua conta</h2>
                <p className="text-xs text-slate-500 font-medium mt-1">Use seu e-mail ou número de celular</p>
              </div>

              <form onSubmit={handleSubmit} className="space-y-4" id="login-form">
                {/* Email or Phone */}
                <div className="space-y-1">
                  <label htmlFor="login-email-phone" className="text-xs font-bold text-slate-700">
                    E-mail ou Celular
                  </label>
                  <div className="relative">
                    <InputIcon className="absolute left-3.5 top-1/2 -translate-y-1/2 w-4 h-4 text-slate-400" />
                    <input
                      id="login-email-phone"
                      type="text"
                      value={emailOrPhone}
                      onChange={e => setEmailOrPhone(e.target.value)}
                      placeholder="email@exemplo.com ou (98) 99999-0000"
                      autoComplete="username"
                      className="w-full pl-10 pr-4 py-3 rounded-xl border border-slate-300 bg-slate-50 text-slate-900 text-sm font-medium focus:outline-none focus:border-[#d4af37] focus:ring-2 focus:ring-[#d4af37]/20 transition-all"
                    />
                  </div>
                </div>

                {/* Password */}
                <div className="space-y-1">
                  <label htmlFor="login-password" className="text-xs font-bold text-slate-700">Senha</label>
                  <div className="relative">
                    <Lock className="absolute left-3.5 top-1/2 -translate-y-1/2 w-4 h-4 text-slate-400" />
                    <input
                      id="login-password"
                      type={showPassword ? 'text' : 'password'}
                      value={password}
                      onChange={e => setPassword(e.target.value)}
                      placeholder="••••••••"
                      autoComplete="current-password"
                      className="w-full pl-10 pr-12 py-3 rounded-xl border border-slate-300 bg-slate-50 text-slate-900 text-sm font-medium focus:outline-none focus:border-[#d4af37] focus:ring-2 focus:ring-[#d4af37]/20 transition-all"
                    />
                    <button
                      type="button"
                      onClick={() => setShowPassword(v => !v)}
                      className="absolute right-3.5 top-1/2 -translate-y-1/2 text-slate-400 hover:text-slate-700 transition-colors"
                      aria-label="Mostrar/ocultar senha"
                    >
                      {showPassword ? <EyeOff className="w-4 h-4" /> : <Eye className="w-4 h-4" />}
                    </button>
                  </div>
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
                  id="login-submit-btn"
                  disabled={loading}
                  className="w-full py-3 rounded-xl btn-gold-3d text-sm font-black flex items-center justify-center gap-2 disabled:opacity-50 disabled:cursor-not-allowed transition-all"
                >
                  {loading ? (
                    <Loader2 className="w-4 h-4 animate-spin text-slate-950" />
                  ) : (
                    <>
                      <span>Entrar</span>
                      <ArrowRight className="w-4 h-4 text-slate-950" />
                    </>
                  )}
                </button>
              </form>

              {/* Links */}
              <div className="space-y-3 pt-2 border-t border-slate-100">
                <button
                  onClick={() => setShowForgot(true)}
                  className="w-full text-xs text-slate-500 hover:text-[#b8860b] font-medium transition-colors text-center"
                >
                  Esqueci minha senha
                </button>
                <div className="flex items-center gap-2">
                  <div className="flex-1 h-px bg-slate-200" />
                  <span className="text-xs text-slate-400 font-medium">ou</span>
                  <div className="flex-1 h-px bg-slate-200" />
                </div>
                <button
                  id="go-to-register-btn"
                  onClick={onGoToRegister}
                  className="w-full py-2.5 rounded-xl border-2 border-slate-900 text-slate-900 text-xs font-black hover:bg-slate-900 hover:text-white transition-all"
                >
                  Criar nova conta
                </button>
              </div>
            </>
          ) : (
            <>
              {/* Forgot Password */}
              <div>
                <button onClick={() => { setShowForgot(false); setForgotMsg(null); }} className="text-xs text-[#b8860b] font-bold mb-3 flex items-center gap-1 hover:underline">
                  ← Voltar ao login
                </button>
                <h2 className="text-xl font-black text-slate-900">Recuperar Senha</h2>
                <p className="text-xs text-slate-500 font-medium mt-1">Digite seu e-mail para receber o link de recuperação</p>
              </div>
              <form onSubmit={handleForgot} className="space-y-4" id="forgot-form">
                <div className="space-y-1">
                  <label htmlFor="forgot-email" className="text-xs font-bold text-slate-700">E-mail cadastrado</label>
                  <div className="relative">
                    <Mail className="absolute left-3.5 top-1/2 -translate-y-1/2 w-4 h-4 text-slate-400" />
                    <input
                      id="forgot-email"
                      type="email"
                      value={forgotEmail}
                      onChange={e => setForgotEmail(e.target.value)}
                      placeholder="email@exemplo.com"
                      className="w-full pl-10 pr-4 py-3 rounded-xl border border-slate-300 bg-slate-50 text-slate-900 text-sm font-medium focus:outline-none focus:border-[#d4af37] transition-all"
                    />
                  </div>
                </div>
                {forgotMsg && (
                  <div className={`p-3 rounded-xl text-xs font-medium ${forgotMsg.startsWith('✅') ? 'bg-green-50 border border-green-200 text-green-800' : 'bg-red-50 border border-red-200 text-red-700'}`}>
                    {forgotMsg}
                  </div>
                )}
                <button
                  type="submit"
                  disabled={forgotLoading}
                  className="w-full py-3 rounded-xl btn-gold-3d text-sm font-black flex items-center justify-center gap-2 disabled:opacity-50"
                >
                  {forgotLoading ? <Loader2 className="w-4 h-4 animate-spin text-slate-950" /> : 'Enviar Link de Recuperação'}
                </button>
              </form>
            </>
          )}
        </div>

        <p className="text-center text-[10px] text-slate-400 mt-6 font-medium">
          BJuris © {new Date().getFullYear()} · Todos os direitos reservados
        </p>
      </div>
    </div>
  );
};
