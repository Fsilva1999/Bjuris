import React, { createContext, useContext, useState, useEffect } from 'react';
import { User, Session } from '@supabase/supabase-js';
import { supabase } from '../lib/supabase';

interface AuthContextType {
  user: User | null;
  session: Session | null;
  loading: boolean;
  signIn: (emailOrPhone: string, password: string) => Promise<{ error: string | null }>;
  signUp: (email: string, celular: string, password: string, nome: string) => Promise<{ error: string | null }>;
  signOut: () => Promise<void>;
  resetPassword: (email: string) => Promise<{ error: string | null }>;
}

const AuthContext = createContext<AuthContextType | undefined>(undefined);

export const AuthProvider: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  const [user, setUser] = useState<User | null>(null);
  const [session, setSession] = useState<Session | null>(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    // Get initial session
    supabase.auth.getSession().then(({ data: { session } }) => {
      setSession(session);
      setUser(session?.user ?? null);
      setLoading(false);
    });

    // Listen for auth state changes
    const { data: { subscription } } = supabase.auth.onAuthStateChange((_event, session) => {
      setSession(session);
      setUser(session?.user ?? null);
      setLoading(false);
    });

    return () => subscription.unsubscribe();
  }, []);

  const signIn = async (emailOrPhone: string, password: string): Promise<{ error: string | null }> => {
    try {
      // Check if input is a phone number (contains only digits, parens, dashes, spaces, +)
      const isPhone = /^[\d\s\+\-\(\)]+$/.test(emailOrPhone.trim()) && emailOrPhone.replace(/\D/g, '').length >= 10;

      let authResult;

      if (isPhone) {
        // Normalize phone number to E.164 format
        const digits = emailOrPhone.replace(/\D/g, '');
        const e164 = digits.startsWith('55') ? `+${digits}` : `+55${digits}`;
        authResult = await supabase.auth.signInWithPassword({ phone: e164, password });
      } else {
        authResult = await supabase.auth.signInWithPassword({ email: emailOrPhone.trim(), password });
      }

      if (authResult.error) {
        // Friendly error messages in Portuguese
        const msg = authResult.error.message;
        if (msg.includes('Invalid login credentials') || msg.includes('invalid_credentials')) {
          return { error: 'E-mail/celular ou senha incorretos. Verifique e tente novamente.' };
        }
        if (msg.includes('Email not confirmed')) {
          return { error: 'Por favor, confirme seu e-mail antes de fazer login.' };
        }
        return { error: 'Erro ao fazer login. Tente novamente.' };
      }

      return { error: null };
    } catch {
      return { error: 'Erro inesperado. Verifique sua conexão.' };
    }
  };

  const signUp = async (email: string, celular: string, password: string, nome: string): Promise<{ error: string | null }> => {
    try {
      // Normalize phone number
      const digits = celular.replace(/\D/g, '');
      const e164 = digits.startsWith('55') ? `+${digits}` : `+55${digits}`;

      const { data, error } = await supabase.auth.signUp({
        email: email.trim(),
        password,
        options: {
          data: {
            nome_completo: nome,
            celular: e164,
          },
        },
      });

      if (error) {
        if (error.message.includes('already registered') || error.message.includes('User already registered')) {
          return { error: 'Este e-mail já está cadastrado. Faça login ou recupere sua senha.' };
        }
        if (error.message.includes('Password should be at least')) {
          return { error: 'A senha deve ter pelo menos 6 caracteres.' };
        }
        return { error: 'Erro ao criar conta. Tente novamente.' };
      }

      if (data.user && !error) {
        // Create profile record
        await supabase.from('bjuris_profiles').insert({
          user_id: data.user.id,
          nome: nome,
          oab_numero: '',
          oab_uf: 'MA',
          escritorio: '',
          email: email.trim(),
          celular: e164,
          cpf: '',
          foto_url: `https://ui-avatars.com/api/?name=${encodeURIComponent(nome)}&background=b8860b&color=fff&size=128`,
          notificacoes_ativas: true,
          som_alerta: true,
        });
      }

      return { error: null };
    } catch {
      return { error: 'Erro inesperado. Verifique sua conexão.' };
    }
  };

  const signOut = async () => {
    await supabase.auth.signOut();
  };

  const resetPassword = async (email: string): Promise<{ error: string | null }> => {
    const { error } = await supabase.auth.resetPasswordForEmail(email.trim(), {
      redirectTo: `${window.location.origin}/reset-password`,
    });
    if (error) return { error: 'Erro ao enviar e-mail de recuperação.' };
    return { error: null };
  };

  return (
    <AuthContext.Provider value={{ user, session, loading, signIn, signUp, signOut, resetPassword }}>
      {children}
    </AuthContext.Provider>
  );
};

export const useAuth = () => {
  const context = useContext(AuthContext);
  if (!context) {
    throw new Error('useAuth deve ser usado dentro de um AuthProvider');
  }
  return context;
};
