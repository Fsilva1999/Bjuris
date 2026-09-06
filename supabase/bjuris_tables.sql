-- ============================================================
-- BJuris – Criação das tabelas no Supabase
-- Projeto: rnkgiczjznonnvnwnaex (Brenda App)
-- Prefixo: bjuris_ (isolado do EmprestFácil)
-- ============================================================

-- 1. Profiles do Advogado
CREATE TABLE IF NOT EXISTS public.bjuris_profiles (
  id UUID DEFAULT gen_random_uuid() PRIMARY KEY,
  user_id UUID REFERENCES auth.users(id) ON DELETE CASCADE NOT NULL UNIQUE,
  nome TEXT NOT NULL DEFAULT '',
  oab_numero TEXT NOT NULL DEFAULT '',
  oab_uf TEXT NOT NULL DEFAULT 'MA',
  escritorio TEXT NOT NULL DEFAULT '',
  email TEXT NOT NULL DEFAULT '',
  celular TEXT NOT NULL DEFAULT '',
  cpf TEXT NOT NULL DEFAULT '',
  foto_url TEXT NOT NULL DEFAULT '',
  notificacoes_ativas BOOLEAN NOT NULL DEFAULT true,
  som_alerta BOOLEAN NOT NULL DEFAULT true,
  created_at TIMESTAMPTZ DEFAULT NOW() NOT NULL
);

ALTER TABLE public.bjuris_profiles ENABLE ROW LEVEL SECURITY;
CREATE POLICY "bjuris_profiles_own" ON public.bjuris_profiles
  FOR ALL USING (auth.uid() = user_id);

-- 2. Clientes
CREATE TABLE IF NOT EXISTS public.bjuris_clientes (
  id UUID DEFAULT gen_random_uuid() PRIMARY KEY,
  user_id UUID REFERENCES auth.users(id) ON DELETE CASCADE NOT NULL,
  nome TEXT NOT NULL,
  tipo TEXT NOT NULL DEFAULT 'PF',
  cpf_cnpj TEXT DEFAULT '',
  rg TEXT DEFAULT '',
  email TEXT DEFAULT '',
  telefone TEXT DEFAULT '',
  endereco TEXT DEFAULT '',
  cidade TEXT DEFAULT '',
  uf TEXT DEFAULT '',
  data_nascimento TEXT DEFAULT '',
  estado_civil TEXT DEFAULT '',
  profissao TEXT DEFAULT '',
  observacoes TEXT DEFAULT '',
  data_cadastro TEXT DEFAULT '',
  created_at TIMESTAMPTZ DEFAULT NOW() NOT NULL
);

ALTER TABLE public.bjuris_clientes ENABLE ROW LEVEL SECURITY;
CREATE POLICY "bjuris_clientes_own" ON public.bjuris_clientes
  FOR ALL USING (auth.uid() = user_id);

-- 3. Processos
CREATE TABLE IF NOT EXISTS public.bjuris_processos (
  id UUID DEFAULT gen_random_uuid() PRIMARY KEY,
  user_id UUID REFERENCES auth.users(id) ON DELETE CASCADE NOT NULL,
  cliente_id UUID REFERENCES public.bjuris_clientes(id) ON DELETE SET NULL,
  numero_cnj TEXT DEFAULT '',
  vara TEXT DEFAULT '',
  tribunal TEXT DEFAULT '',
  comarca TEXT DEFAULT '',
  uf TEXT DEFAULT 'MA',
  classe TEXT DEFAULT '',
  area TEXT DEFAULT '',
  status TEXT DEFAULT 'em_andamento',
  parte_contraria TEXT DEFAULT '',
  parte_contraria_advogado TEXT DEFAULT '',
  valor_causa NUMERIC DEFAULT 0,
  ultima_movimentacao_data TEXT DEFAULT '',
  ultima_movimentacao_titulo TEXT DEFAULT '',
  created_at TIMESTAMPTZ DEFAULT NOW() NOT NULL
);

ALTER TABLE public.bjuris_processos ENABLE ROW LEVEL SECURITY;
CREATE POLICY "bjuris_processos_own" ON public.bjuris_processos
  FOR ALL USING (auth.uid() = user_id);

-- 4. Movimentações dos Processos
CREATE TABLE IF NOT EXISTS public.bjuris_movimentacoes (
  id UUID DEFAULT gen_random_uuid() PRIMARY KEY,
  user_id UUID REFERENCES auth.users(id) ON DELETE CASCADE NOT NULL,
  processo_id UUID REFERENCES public.bjuris_processos(id) ON DELETE CASCADE NOT NULL,
  data TEXT NOT NULL,
  titulo TEXT NOT NULL,
  descricao TEXT DEFAULT '',
  origem TEXT DEFAULT 'Manual',
  created_at TIMESTAMPTZ DEFAULT NOW() NOT NULL
);

ALTER TABLE public.bjuris_movimentacoes ENABLE ROW LEVEL SECURITY;
CREATE POLICY "bjuris_movimentacoes_own" ON public.bjuris_movimentacoes
  FOR ALL USING (auth.uid() = user_id);

-- 5. Prazos e Audiências
CREATE TABLE IF NOT EXISTS public.bjuris_prazos (
  id UUID DEFAULT gen_random_uuid() PRIMARY KEY,
  user_id UUID REFERENCES auth.users(id) ON DELETE CASCADE NOT NULL,
  titulo TEXT NOT NULL,
  descricao TEXT DEFAULT '',
  data_prazo TEXT NOT NULL,
  hora TEXT DEFAULT '',
  tipo TEXT DEFAULT 'prazo',
  prioridade TEXT DEFAULT 'normal',
  processo_numero TEXT DEFAULT '',
  processo_id UUID REFERENCES public.bjuris_processos(id) ON DELETE SET NULL,
  concluido BOOLEAN DEFAULT false,
  notificacao_enviada BOOLEAN DEFAULT false,
  created_at TIMESTAMPTZ DEFAULT NOW() NOT NULL
);

ALTER TABLE public.bjuris_prazos ENABLE ROW LEVEL SECURITY;
CREATE POLICY "bjuris_prazos_own" ON public.bjuris_prazos
  FOR ALL USING (auth.uid() = user_id);

-- 6. Financeiro / Honorários
CREATE TABLE IF NOT EXISTS public.bjuris_financeiro (
  id UUID DEFAULT gen_random_uuid() PRIMARY KEY,
  user_id UUID REFERENCES auth.users(id) ON DELETE CASCADE NOT NULL,
  descricao TEXT NOT NULL,
  tipo TEXT DEFAULT 'contratual',
  valor NUMERIC NOT NULL DEFAULT 0,
  status TEXT DEFAULT 'pendente',
  data_vencimento TEXT DEFAULT '',
  data_pagamento TEXT DEFAULT '',
  cliente_nome TEXT DEFAULT '',
  processo_numero TEXT DEFAULT '',
  processo_id UUID REFERENCES public.bjuris_processos(id) ON DELETE SET NULL,
  created_at TIMESTAMPTZ DEFAULT NOW() NOT NULL
);

ALTER TABLE public.bjuris_financeiro ENABLE ROW LEVEL SECURITY;
CREATE POLICY "bjuris_financeiro_own" ON public.bjuris_financeiro
  FOR ALL USING (auth.uid() = user_id);

-- 7. Documentos Anexados
CREATE TABLE IF NOT EXISTS public.bjuris_documentos (
  id UUID DEFAULT gen_random_uuid() PRIMARY KEY,
  user_id UUID REFERENCES auth.users(id) ON DELETE CASCADE NOT NULL,
  cliente_id UUID REFERENCES public.bjuris_clientes(id) ON DELETE CASCADE,
  processo_id UUID REFERENCES public.bjuris_processos(id) ON DELETE SET NULL,
  nome TEXT NOT NULL,
  tipo TEXT DEFAULT 'documento',
  url TEXT DEFAULT '',
  tamanho_kb NUMERIC DEFAULT 0,
  data_anexo TEXT DEFAULT '',
  created_at TIMESTAMPTZ DEFAULT NOW() NOT NULL
);

ALTER TABLE public.bjuris_documentos ENABLE ROW LEVEL SECURITY;
CREATE POLICY "bjuris_documentos_own" ON public.bjuris_documentos
  FOR ALL USING (auth.uid() = user_id);

-- ============================================================
-- Índices para performance
-- ============================================================
CREATE INDEX IF NOT EXISTS idx_bjuris_clientes_user ON public.bjuris_clientes(user_id);
CREATE INDEX IF NOT EXISTS idx_bjuris_processos_user ON public.bjuris_processos(user_id);
CREATE INDEX IF NOT EXISTS idx_bjuris_processos_cliente ON public.bjuris_processos(cliente_id);
CREATE INDEX IF NOT EXISTS idx_bjuris_prazos_user ON public.bjuris_prazos(user_id);
CREATE INDEX IF NOT EXISTS idx_bjuris_financeiro_user ON public.bjuris_financeiro(user_id);
CREATE INDEX IF NOT EXISTS idx_bjuris_documentos_cliente ON public.bjuris_documentos(cliente_id);
