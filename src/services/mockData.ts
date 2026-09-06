import { Processo, Cliente, PrazoAudiencia, HonorarioFinanceiro, AdvogadoPerfil } from '../types/legal';

export const MOCK_PERFIL: AdvogadoPerfil = {
  nome: "Dr. Victor Hugo Silva",
  oabNumero: "432.890",
  oabUf: "MA",
  email: "victor.adv@bjuris.com.br",
  telefone: "(98) 98765-4321",
  escritorio: "Silva & Associados Advocacia - São Luís / MA",
  cpf: "345.678.901-22",
  fotoUrl: "https://images.unsplash.com/photo-1560250097-0b93528c311a?auto=format&fit=crop&q=80&w=256",
  notificacoesAtivas: true,
  somAlerta: true,
  vibracao: true,
};

export const LISTA_VARAS_MARANHAO = [
  "1ª Vara Cível da Comarca de São Luís - MA",
  "2ª Vara Cível da Comarca de São Luís - MA",
  "3ª Vara Cível da Comarca de São Luís - MA",
  "1ª Vara de Família de São Luís - MA",
  "1ª Vara Cível da Comarca de Imperatriz - MA",
  "2ª Vara Cível da Comarca de Imperatriz - MA",
  "Vara Única da Comarca de Caxias - MA",
  "1ª Vara do Trabalho de São Luís - MA (TRT16)",
  "2ª Vara do Trabalho de São Luís - MA (TRT16)",
  "1ª Vara Federal da Seção Judiciária do Maranhão (TRF1)",
  "2ª Vara Federal de Imperatriz - MA (TRF1)",
  "1ª Vara Cível da Comarca de Timon - MA",
  "Vara da Fazenda Pública de São Luís - MA"
];

export const MOCK_CLIENTES: Cliente[] = [
  {
    id: "cli-1",
    tipo: "PF",
    nome: "Carlos Eduardo Oliveira",
    documento: "284.910.488-15",
    rgOuIe: "42.819.301-X (SSP/MA)",
    cnh: "048.910.229-10",
    email: "carlos.eduardo@gmail.com",
    telefone: "(98) 99182-3344",
    whatsapp: "(98) 99182-3344",
    profissaoOuRamo: "Engenheiro de Software",
    estadoCivil: "Casado",
    nacionalidade: "Brasileiro",
    endereco: "Av. dos Holandeses, 100, Apto 502, Calhau - São Luís/MA",
    observacoes: "Cliente com processo em andamento no TJMA.",
    dataCadastro: "2024-01-15",
    processosIds: ["proc-1", "proc-4"],
    documentosAnexados: [
      {
        id: "doc-101",
        tipo: "RG",
        titulo: "RG - Frente e Verso (Digitalizado)",
        dataAnexo: "2024-01-15",
        origem: "camera_scan",
        tamanhoKb: 420
      },
      {
        id: "doc-102",
        tipo: "Comprovante de Residência",
        titulo: "Conta de Energia - Calhau São Luís",
        dataAnexo: "2024-01-16",
        origem: "upload",
        tamanhoKb: 850
      }
    ]
  },
  {
    id: "cli-2",
    tipo: "PJ",
    nome: "TechLog Soluções Logísticas LTDA",
    documento: "18.394.029/0001-92",
    rgOuIe: "109.840.119.112",
    email: "juridico@techlog.com.br",
    telefone: "(98) 3234-5566",
    whatsapp: "(98) 97112-9900",
    profissaoOuRamo: "Transporte e Logística Marítima",
    endereco: "Av. Colares Moreira, 400, Sala 801, Renascença - São Luís/MA",
    observacoes: "Contrato corporativo mensal no Maranhão.",
    dataCadastro: "2023-11-10",
    processosIds: ["proc-2"],
    documentosAnexados: [
      {
        id: "doc-201",
        tipo: "Certidão",
        titulo: "Contrato Social Consolidado 2024",
        dataAnexo: "2023-11-10",
        origem: "upload",
        tamanhoKb: 1200
      }
    ]
  },
  {
    id: "cli-3",
    tipo: "PF",
    nome: "Mariana Souza Santos",
    documento: "391.029.118-04",
    rgOuIe: "33.910.220-4 (SSP/MA)",
    email: "mariana.s.santos@outlook.com",
    telefone: "(99) 98123-4567",
    whatsapp: "(99) 98123-4567",
    profissaoOuRamo: "Arquiteta",
    estadoCivil: "Divorciada",
    nacionalidade: "Brasileira",
    endereco: "Rua Ceará, 303, Juçara - Imperatriz/MA",
    observacoes: "Ação de divórcio na Vara de Família de Imperatriz.",
    dataCadastro: "2024-03-02",
    processosIds: ["proc-3"],
    documentosAnexados: [
      {
        id: "doc-301",
        tipo: "CNH",
        titulo: "CNH Digitalizada",
        dataAnexo: "2024-03-02",
        origem: "camera_scan",
        tamanhoKb: 510
      }
    ]
  }
];

export const MOCK_PROCESSOS: Processo[] = [
  {
    id: "proc-1",
    numeroCnj: "0804812-39.2024.8.10.0001",
    tribunal: "TJMA",
    vara: "1ª Vara Cível da Comarca de São Luís - MA",
    classe: "Procedimento Comum Cível",
    area: "Cível",
    papelCliente: "Autor",
    status: "em_andamento",
    clienteId: "cli-1",
    clienteNome: "Carlos Eduardo Oliveira",
    parteContraria: "Banco Financiador do Maranhão S/A",
    valorCausa: 65000.00,
    dataDistribuicao: "2024-02-10",
    advogadoResponsavel: "Dr. Victor Hugo Silva",
    ultimaMovimentacao: {
      data: "2026-09-04",
      titulo: "Intimação no DJe-MA para réplica à contestação"
    },
    movimentacoes: [
      {
        id: "mov-101",
        processoId: "proc-1",
        data: "2026-09-04",
        titulo: "Intimação DJe-MA",
        descricao: "Publicado no Diário da Justiça Eletrônico do Maranhão prazo de 15 dias para réplica.",
        origem: "Intimação DJe",
        anexoNome: "contestacao_banco.pdf"
      },
      {
        id: "mov-102",
        processoId: "proc-1",
        data: "2024-02-10",
        titulo: "Petição Inicial Distribuída (PJe TJMA)",
        descricao: "Distribuição eletrônica no sistema PJe do TJMA.",
        origem: "Manual"
      }
    ]
  },
  {
    id: "proc-2",
    numeroCnj: "0010943-88.2023.5.16.0001",
    tribunal: "TRT16",
    vara: "1ª Vara do Trabalho de São Luís - MA (TRT16)",
    classe: "Reclamação Trabalhista",
    area: "Trabalhista",
    papelCliente: "Réu",
    status: "aguardando_audiencia",
    clienteId: "cli-2",
    clienteNome: "TechLog Soluções Logísticas LTDA",
    parteContraria: "JOSÉ DA SILVA MARTINS",
    valorCausa: 95000.00,
    dataDistribuicao: "2023-11-20",
    advogadoResponsavel: "Dr. Victor Hugo Silva",
    ultimaMovimentacao: {
      data: "2026-08-28",
      titulo: "Audiência de Instrução Designada para 12/09/2026"
    },
    movimentacoes: [
      {
        id: "mov-201",
        processoId: "proc-2",
        data: "2026-08-28",
        titulo: "Notificação de Audiência TRT16",
        descricao: "Audiência telepresencial no TRT 16ª Região (Maranhão).",
        origem: "Intimação DJe"
      }
    ]
  },
  {
    id: "proc-3",
    numeroCnj: "0801239-11.2024.8.10.0040",
    tribunal: "TJMA",
    vara: "1ª Vara Cível da Comarca de Imperatriz - MA",
    classe: "Divórcio Litigioso",
    area: "Família e Sucessões",
    papelCliente: "Autor",
    status: "recurso",
    clienteId: "cli-3",
    clienteNome: "Mariana Souza Santos",
    parteContraria: "Roberto Alencar Santos",
    valorCausa: 380000.00,
    dataDistribuicao: "2024-03-05",
    advogadoResponsavel: "Dr. Victor Hugo Silva",
    ultimaMovimentacao: {
      data: "2026-09-01",
      titulo: "Interposição de Apelação no TJMA"
    },
    movimentacoes: [
      {
        id: "mov-301",
        processoId: "proc-3",
        data: "2026-09-01",
        titulo: "Protocolo de Apelação TJMA",
        descricao: "Recurso direcionado às Câmaras Cíveis Isoladas do TJMA.",
        origem: "Manual"
      }
    ]
  },
  {
    id: "proc-4",
    numeroCnj: "1009182-44.2023.4.01.3700",
    tribunal: "TRF1",
    vara: "1ª Vara Federal da Seção Judiciária do Maranhão (TRF1)",
    classe: "Ação Anulatória de Débito Fiscal",
    area: "Tributário",
    papelCliente: "Autor",
    status: "ganho",
    clienteId: "cli-1",
    clienteNome: "Carlos Eduardo Oliveira",
    parteContraria: "UNIÃO FEDERAL (FAZENDA NACIONAL)",
    valorCausa: 180000.00,
    dataDistribuicao: "2023-05-12",
    advogadoResponsavel: "Dr. Victor Hugo Silva",
    ultimaMovimentacao: {
      data: "2026-07-10",
      titulo: "Trânsito em Julgado na 1ª Vara Federal - MA"
    },
    movimentacoes: [
      {
        id: "mov-401",
        processoId: "proc-4",
        data: "2026-07-10",
        titulo: "Certidão de Trânsito em Julgado",
        descricao: "Vitória definitiva na Justiça Federal do Maranhão.",
        origem: "Tribunal API"
      }
    ]
  }
];

export const MOCK_PRAZOS: PrazoAudiencia[] = [
  {
    id: "prazo-1",
    processoId: "proc-1",
    processoNumero: "0804812-39.2024.8.10.0001",
    clienteNome: "Carlos Eduardo Oliveira",
    titulo: "Réplica à Contestação - 1ª Vara Cível de São Luís",
    tipo: "prazo_fatal",
    dataHora: new Date(Date.now() + 2 * 24 * 60 * 60 * 1000).toISOString(),
    prioridade: "urgente",
    responsavel: "Dr. Victor Hugo Silva",
    concluido: false,
    observacao: "Reiterar tese de cobrança indevida no TJMA."
  },
  {
    id: "prazo-2",
    processoId: "proc-2",
    processoNumero: "0010943-88.2023.5.16.0001",
    clienteNome: "TechLog Soluções Logísticas LTDA",
    titulo: "Audiência de Instrução - TRT 16ª Região (Maranhão)",
    tipo: "audiencia_online",
    dataHora: new Date(Date.now() + 5 * 24 * 60 * 60 * 1000).toISOString(),
    prioridade: "alta",
    responsavel: "Dr. Victor Hugo Silva",
    linkOnline: "https://zoom.us/j/9876543210?pwd=legal",
    concluido: false,
    observacao: "Audiência telepresencial via PJe-JT TRT16."
  }
];

export const MOCK_FINANCEIRO: HonorarioFinanceiro[] = [
  {
    id: "fin-1",
    processoId: "proc-1",
    processoNumero: "0804812-39.2024.8.10.0001",
    clienteNome: "Carlos Eduardo Oliveira",
    tipo: "contratual",
    descricao: "Honorários Pro Labore - Ação TJMA",
    valor: 4500.00,
    vencimento: "2026-09-10",
    status: "pendente"
  },
  {
    id: "fin-2",
    processoId: "proc-2",
    processoNumero: "0010943-88.2023.5.16.0001",
    clienteNome: "TechLog Soluções Logísticas LTDA",
    tipo: "pro_labore",
    descricao: "Assessoria Jurídica Maranhão - Setembro/2026",
    valor: 6500.00,
    vencimento: "2026-09-05",
    status: "pago",
    dataPagamento: "2026-09-04"
  }
];
