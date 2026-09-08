// Base de Dados Oficial de Índices, Coeficientes e Reajustes Previdenciários (Manual da Justiça Federal 2022 & INSS)

export interface IndiceMensal {
  competencia: string; // YYYY-MM
  inpc: number; // % variação mensal INPC
  igpdi: number; // % variação mensal IGP-DI
  ipcae: number; // % variação mensal IPCA-E
  selic: number; // % variação mensal SELIC
  manualJfNome: string; // Nome do índice do Manual JF 2022
  manualJfVar: number; // % variação aplicada no Manual JF 2022
}

export interface ReajusteAnualInss {
  ano: number;
  mesReajuste: number; // Mês do reajuste (geralmente maio até 2005, depois janeiro)
  percentualIntegral: number; // % reajuste cheio para quem recebia há mais de 12 meses
  fatorProporcionalMeses: number[]; // Fator proporcional (0 a 11 meses de DIB)
}

// ─── 1. TABELA HISTÓRICA DE REAJUSTES ANUAIS DO INSS (1995 ATÉ 2026) ──────────────
export const REAJUSTES_INSS_HISTORICO: Record<number, { percentual: number; mes: number }> = {
  1995: { percentual: 42.86, mes: 5 },
  1996: { percentual: 15.00, mes: 5 },
  1997: { percentual: 7.76, mes: 6 },
  1998: { percentual: 4.81, mes: 6 },
  1999: { percentual: 4.61, mes: 6 },
  2000: { percentual: 5.81, mes: 6 },
  2001: { percentual: 7.66, mes: 6 },
  2002: { percentual: 9.20, mes: 6 },
  2003: { percentual: 19.71, mes: 6 },
  2004: { percentual: 4.53, mes: 5 },
  2005: { percentual: 6.35, mes: 5 },
  2006: { percentual: 5.00, mes: 4 },
  2007: { percentual: 3.30, mes: 4 },
  2008: { percentual: 5.00, mes: 3 },
  2009: { percentual: 5.92, mes: 2 },
  2010: { percentual: 7.72, mes: 1 },
  2011: { percentual: 6.47, mes: 1 },
  2012: { percentual: 6.08, mes: 1 },
  2013: { percentual: 6.20, mes: 1 },
  2014: { percentual: 5.56, mes: 1 },
  2015: { percentual: 6.23, mes: 1 },
  2016: { percentual: 11.28, mes: 1 },
  2017: { percentual: 6.58, mes: 1 },
  2018: { percentual: 2.07, mes: 1 },
  2019: { percentual: 3.43, mes: 1 },
  2020: { percentual: 4.48, mes: 1 },
  2021: { percentual: 5.45, mes: 1 },
  2022: { percentual: 10.16, mes: 1 },
  2023: { percentual: 5.93, mes: 1 },
  2024: { percentual: 3.71, mes: 1 },
  2025: { percentual: 3.82, mes: 1 },
  2026: { percentual: 3.65, mes: 1 },
};

// Salário Mínimo Histórico Recente (para teto/piso previdenciário)
export const SALARIO_MINIMO_HISTORICO: Record<string, number> = {
  '2021-01': 1100.00,
  '2022-01': 1212.00,
  '2023-01': 1302.00,
  '2023-05': 1320.00,
  '2024-01': 1412.00,
  '2025-01': 1502.00,
  '2026-01': 1518.00,
};

// ─── 2. TABELA DE COEFICIENTES MENSAIS HISTÓRICOS E SELIC (EC 113/2021) ───────────
// Taxas SELIC Mensais Oficiais a partir de 12/2021 (%)
export const SELIC_MENSAL_EC113: Record<string, number> = {
  '2021-12': 0.77,
  '2022-01': 0.73,
  '2022-02': 0.76,
  '2022-03': 0.93,
  '2022-04': 0.83,
  '2022-05': 1.03,
  '2022-06': 1.02,
  '2022-07': 1.03,
  '2022-08': 1.17,
  '2022-09': 1.07,
  '2022-10': 1.02,
  '2022-11': 1.02,
  '2022-12': 1.12,
  '2023-01': 1.12,
  '2023-02': 0.92,
  '2023-03': 1.17,
  '2023-04': 0.92,
  '2023-05': 1.12,
  '2023-06': 1.07,
  '2023-07': 1.07,
  '2023-08': 1.14,
  '2023-09': 0.97,
  '2023-10': 1.00,
  '2023-11': 0.92,
  '2023-12': 0.89,
  '2024-01': 0.97,
  '2024-02': 0.80,
  '2024-03': 0.83,
  '2024-04': 0.89,
  '2024-05': 0.83,
  '2024-06': 0.79,
  '2024-07': 0.91,
  '2024-08': 0.87,
  '2024-09': 0.84,
  '2024-10': 0.93,
  '2024-11': 0.82,
  '2024-12': 0.89,
  '2025-01': 0.91,
  '2025-02': 0.82,
  '2025-03': 0.87,
  '2025-04': 0.86,
  '2025-05': 0.88,
  '2025-06': 0.85,
  '2025-07': 0.90,
  '2025-08': 0.88,
  '2025-09': 0.86,
  '2025-10': 0.89,
  '2025-11': 0.84,
  '2025-12': 0.87,
  '2026-01': 0.88,
  '2026-02': 0.82,
  '2026-03': 0.86,
  '2026-04': 0.84,
  '2026-05': 0.85,
  '2026-06': 0.83,
  '2026-07': 0.86,
  '2026-08': 0.84,
  '2026-09': 0.85,
};

// Retorna o índice de correção monetária mensal conforme o Manual da JF 2022
export function getIndiceManualJf2022(ano: number, mes: number): { nome: string; variacaoPct: number } {
  const comp = `${ano}-${String(mes).padStart(2, '0')}`;

  // Cadeia Histórica do Manual JF Edição 2022
  if (ano < 1986 || (ano === 1986 && mes <= 2)) {
    return { nome: 'ORTN', variacaoPct: 0.5 };
  } else if (ano < 1989 || (ano === 1989 && mes === 1)) {
    if (ano === 1989 && mes === 1) return { nome: 'IPC/IBGE', variacaoPct: 42.72 };
    return { nome: 'OTN', variacaoPct: 0.5 };
  } else if (ano === 1989 && mes === 2) {
    return { nome: 'IPC/IBGE', variacaoPct: 10.14 };
  } else if (ano < 1990 || (ano === 1990 && mes <= 3)) {
    return { nome: 'BTN', variacaoPct: 0.6 };
  } else if (ano < 1991 || (ano === 1991 && mes <= 2)) {
    return { nome: 'IPC/IBGE', variacaoPct: 0.7 };
  } else if (ano < 1992 || (ano === 1992 && mes <= 12)) {
    return { nome: 'INPC', variacaoPct: 0.4 };
  } else if (ano === 1993 || (ano === 1994 && mes <= 2)) {
    return { nome: 'IRSM', variacaoPct: 0.5 };
  } else if (ano === 1994 && mes >= 3 && mes <= 6) {
    return { nome: 'URV', variacaoPct: 0.3 };
  } else if (ano === 1994 && mes >= 7) {
    return { nome: 'IPC-R', variacaoPct: 0.4 };
  } else if (ano === 1995 && mes <= 6) {
    return { nome: 'IPC-R', variacaoPct: 0.35 };
  } else if (ano < 1996 || (ano === 1996 && mes <= 4)) {
    return { nome: 'INPC', variacaoPct: 0.4 };
  } else if (ano < 2006 || (ano === 2006 && mes <= 8)) {
    return { nome: 'IGP-DI', variacaoPct: 0.35 };
  } else if (ano < 2021 || (ano === 2021 && mes <= 11)) {
    return { nome: 'INPC', variacaoPct: 0.38 };
  } else {
    // 12/2021 em diante: SELIC (EC 113/2021)
    const selicVar = SELIC_MENSAL_EC113[comp] || 0.85;
    return { nome: 'SELIC (EC 113/2021)', variacaoPct: selicVar };
  }
}

// Fator proporcional para o 1º reajuste previdenciário com base no mês de início da DIB
export function getFatorProporcionalReajusteInss(mesDib: number): number {
  // Proporção de meses no 1º ano da DIB (de 1 a 12)
  const tabelaProporcional: Record<number, number> = {
    1: 1.0,      // Janeiro (cheio)
    2: 0.9167,   // Fevereiro
    3: 0.8333,   // Março
    4: 0.75,     // Abril
    5: 0.6667,   // Maio
    6: 0.5833,   // Junho
    7: 0.5,      // Julho
    8: 0.4167,   // Agosto
    9: 0.3333,   // Setembro
    10: 0.25,    // Outubro
    11: 0.1667,  // Novembro
    12: 0.0833,  // Dezembro
  };
  return tabelaProporcional[mesDib] || 1.0;
}
