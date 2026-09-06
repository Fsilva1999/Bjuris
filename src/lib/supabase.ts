import { createClient } from '@supabase/supabase-js';

const supabaseUrl = import.meta.env.VITE_SUPABASE_URL as string;
const supabaseAnonKey = import.meta.env.VITE_SUPABASE_ANON_KEY as string;

if (!supabaseUrl || !supabaseAnonKey) {
  console.error('⚠️ BJuris: Variáveis de ambiente do Supabase não configuradas.');
}

export const supabase = createClient(supabaseUrl, supabaseAnonKey, {
  auth: {
    autoRefreshToken: true,
    persistSession: true,
    detectSessionInUrl: true,
  },
});

export type Database = {
  public: {
    Tables: {
      bjuris_profiles: {
        Row: {
          id: string;
          user_id: string;
          nome: string;
          oab_numero: string;
          oab_uf: string;
          escritorio: string;
          email: string;
          celular: string;
          cpf: string;
          foto_url: string;
          notificacoes_ativas: boolean;
          som_alerta: boolean;
          created_at: string;
        };
        Insert: Omit<Database['public']['Tables']['bjuris_profiles']['Row'], 'id' | 'created_at'>;
        Update: Partial<Database['public']['Tables']['bjuris_profiles']['Insert']>;
      };
      bjuris_clientes: {
        Row: {
          id: string;
          user_id: string;
          nome: string;
          tipo: 'PF' | 'PJ';
          cpf_cnpj: string;
          rg: string;
          email: string;
          telefone: string;
          endereco: string;
          data_cadastro: string;
          created_at: string;
        };
        Insert: Omit<Database['public']['Tables']['bjuris_clientes']['Row'], 'created_at'>;
        Update: Partial<Database['public']['Tables']['bjuris_clientes']['Insert']>;
      };
      bjuris_processos: {
        Row: {
          id: string;
          user_id: string;
          cliente_id: string;
          numero_cnj: string;
          vara: string;
          tribunal: string;
          comarca: string;
          uf: string;
          classe: string;
          area: string;
          status: string;
          parte_contraria: string;
          ultima_movimentacao_data: string;
          ultima_movimentacao_titulo: string;
          created_at: string;
        };
        Insert: Omit<Database['public']['Tables']['bjuris_processos']['Row'], 'created_at'>;
        Update: Partial<Database['public']['Tables']['bjuris_processos']['Insert']>;
      };
      bjuris_prazos: {
        Row: {
          id: string;
          user_id: string;
          titulo: string;
          descricao: string;
          data_prazo: string;
          hora: string;
          tipo: string;
          prioridade: string;
          processo_numero: string;
          processo_id: string;
          concluido: boolean;
          notificacao_enviada: boolean;
          created_at: string;
        };
        Insert: Omit<Database['public']['Tables']['bjuris_prazos']['Row'], 'created_at'>;
        Update: Partial<Database['public']['Tables']['bjuris_prazos']['Insert']>;
      };
      bjuris_financeiro: {
        Row: {
          id: string;
          user_id: string;
          descricao: string;
          tipo: string;
          valor: number;
          status: string;
          data_vencimento: string;
          data_pagamento: string | null;
          cliente_nome: string;
          processo_numero: string;
          created_at: string;
        };
        Insert: Omit<Database['public']['Tables']['bjuris_financeiro']['Row'], 'created_at'>;
        Update: Partial<Database['public']['Tables']['bjuris_financeiro']['Insert']>;
      };
      bjuris_documentos: {
        Row: {
          id: string;
          user_id: string;
          cliente_id: string;
          processo_id: string | null;
          nome: string;
          tipo: string;
          url: string;
          tamanho_kb: number;
          data_anexo: string;
          created_at: string;
        };
        Insert: Omit<Database['public']['Tables']['bjuris_documentos']['Row'], 'created_at'>;
        Update: Partial<Database['public']['Tables']['bjuris_documentos']['Insert']>;
      };
    };
  };
};
