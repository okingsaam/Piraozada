import { api } from './axiosConfig';
import type { FechamentoCaixa } from '../types';

const EMPTY_FECHAMENTO: FechamentoCaixa = {
  faturamento: 0,
  investimento: 0,
  custoTotal: 0,
  lucro: 0,
  roas: 0,
};

function normalizeFechamentoResponse(payload: unknown): FechamentoCaixa {
  if (payload && typeof payload === 'object' && !Array.isArray(payload)) {
    const candidate = payload as Partial<FechamentoCaixa>;

    return {
      faturamento: Number(candidate.faturamento ?? 0),
      investimento: Number(candidate.investimento ?? 0),
      custoTotal: Number(candidate.custoTotal ?? 0),
      lucro: Number(candidate.lucro ?? 0),
      roas: Number(candidate.roas ?? 0),
    };
  }

  return EMPTY_FECHAMENTO;
}

export async function getFechamento(startDate: string, endDate: string): Promise<FechamentoCaixa> {
  if (!import.meta.env.VITE_API_URL) {
    return EMPTY_FECHAMENTO;
  }

  try {
    const response = await api.get<unknown>('/caixa/fechamento', {
      params: {
        startDate,
        endDate,
      },
    });

    return normalizeFechamentoResponse(response.data);
  } catch {
    return EMPTY_FECHAMENTO;
  }
}
