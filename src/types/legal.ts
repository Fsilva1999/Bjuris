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
  numeroCnj: string; // Ex: 0001234-56.2024.4.01.0000 (TRF1)
  tribunal: string; // Ex: TRF1, TJMA, TRT16, STJ
  vara: string; // Ex: 1ª Vara Federal da Seção Judiciária do TRF1
  classe: string; // Ex: Procedimento do Juizado Especial Cível / Previdenciário
  area: AreaProcesso;
  papelCliente: TipoParte;
  status: StatusProcesso;
  clienteId: string;
  clienteNome: string;
  parteContraria: string; // Ex: INSS - Instituto Nacional do Seguro Social
  valorCausa: number;
  dataDistribuicao: string;
  advogadoResponsavel: string;
  
  // Previdenciário & TRF1 Specific Fields
  numeroBeneficioInss?: string; // NB (10 dígitos)
  tipoCalculoRpvPrecatorio?: 'RPV (< 60 SM)' | 'Precatório Federal TRF1 (> 60 SM)';
  secaoJudiciariaTrf1?: string; // Ex: SJDF, SJMA, SJMG, SJGO, SJBA
  faseProcessualInss?: string; // Ex: Requerimento Administrativo, Perícia JEF, Concessão

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

  // Previdenciário Specific Client Details
  numeroBeneficioINSS?: string; // NB INSS
  nitPisPasep?: string; // NIT / PIS / PASEP
  derInss?: string; // Data de Entrada do Requerimento INSS
  categoriaSegurado?: 'Segurado Urbano' | 'Segurado Especial (Rural/Pescador)' | 'BPC/LOAS Idoso' | 'BPC/LOAS Deficiência' | 'Dependente / Pensão';

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

export interface ParcelaCarne {
  id: string;
  numero: number;
  valor: number;
  vencimento: string; // YYYY-MM-DD
  status: 'pago' | 'proximo' | 'atrasado' | 'pendente'; // 🟢 verde (pago/em dia), 🟠 laranja (vence em 5 dias), 🔴 vermelho (atrasado)
  dataPagamento?: string;
}

export interface CarnePagamento {
  id: string;
  clienteId?: string;
  clienteNome: string;
  clienteDocumento: string;
  beneficioOuAcordo: string; // Ex: BPC / LOAS, Honorários Recorrentes
  valorTotal: number;
  qtdParcelas: number;
  valorParcela: number;
  diaVencimentoMensal: number;
  dataCriacao: string;
  parcelas: ParcelaCarne[];
  observacoes?: string;
}
