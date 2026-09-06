export type StatusProcesso = 'em_andamento' | 'aguardando_audiencia' | 'recurso' | 'suspenso' | 'ganho' | 'arquivado';
export type AreaProcesso = 'Cível' | 'Trabalhista' | 'Família e Sucessões' | 'Penal' | 'Tributário' | 'Empresarial' | 'Previdenciário';
export type TipoParte = 'Autor' | 'Réu' | 'Terceiro Interessado';
export type TipoCliente = 'PF' | 'PJ';
export type TipoPrazo = 'prazo_fatal' | 'audiencia_presencial' | 'audiencia_online' | 'reuniao';
export type PrioridadePrazo = 'urgente' | 'alta' | 'normal';
export type TipoHonorario = 'sucumbencia' | 'contratual' | 'pro_labore' | 'exito';
export type StatusFinanceiro = 'pago' | 'pendente' | 'atrasado';

export interface DocumentoCliente {
  id: string;
  tipo: 'RG' | 'CPF' | 'CNH' | 'Comprovante de Residência' | 'Certidão' | 'Procuração Assinada' | 'Outros';
  titulo: string;
  dataAnexo: string;
  origem: 'upload' | 'camera_scan';
  arquivoUrl?: string;
  tamanhoKb?: number;
}

export interface Processo {
  id: string;
  numeroCnj: string; // Ex: 0001234-56.2024.8.10.0001 (TJMA)
  tribunal: string; // Ex: TJMA, TJSP, TRT16, TRF1, STJ
  vara: string; // Ex: 1ª Vara Cível de São Luís - MA
  classe: string; // Ex: Procedimento Comum Cível
  area: AreaProcesso;
  papelCliente: TipoParte;
  status: StatusProcesso;
  clienteId: string;
  clienteNome: string;
  parteContraria: string;
  valorCausa: number;
  dataDistribuicao: string;
  advogadoResponsavel: string;
  ultimaMovimentacao: {
    data: string;
    titulo: string;
  };
  movimentacoes: Movimentacao[];
}

export interface Movimentacao {
  id: string;
  processoId: string;
  data: string;
  titulo: string;
  descricao: string;
  origem: 'Intimação DJe' | 'Manual' | 'Tribunal API';
  anexoNome?: string;
}

export interface Cliente {
  id: string;
  tipo: TipoCliente;
  nome: string;
  documento: string; // CPF ou CNPJ
  rgOuIe?: string;
  cnh?: string;
  email: string;
  telefone: string;
  whatsapp: string;
  profissaoOuRamo?: string;
  estadoCivil?: string;
  nacionalidade?: string;
  endereco: string;
  observacoes?: string;
  dataCadastro: string;
  processosIds: string[];
  documentosAnexados: DocumentoCliente[];
}

export interface PrazoAudiencia {
  id: string;
  processoId: string;
  processoNumero: string;
  clienteNome: string;
  titulo: string;
  tipo: TipoPrazo;
  dataHora: string; // ISO string
  prioridade: PrioridadePrazo;
  responsavel: string;
  linkOnline?: string; // Link Teams/Zoom
  local?: string;
  concluido: boolean;
  observacao?: string;
  notificacaoEnviada?: boolean;
}

export interface HonorarioFinanceiro {
  id: string;
  processoId?: string;
  processoNumero?: string;
  clienteNome: string;
  tipo: TipoHonorario;
  descricao: string;
  valor: number;
  vencimento: string; // YYYY-MM-DD
  status: StatusFinanceiro;
  parcela?: string; // Ex: 1/5
  dataPagamento?: string;
}

export interface AdvogadoPerfil {
  nome: string;
  oabNumero: string;
  oabUf: string;
  email: string;
  telefone: string;
  escritorio: string;
  cpf: string;
  fotoUrl: string;
  notificacoesAtivas: boolean;
  somAlerta: boolean;
  vibracao: boolean;
}
