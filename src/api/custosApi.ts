import { api } from './axiosConfig';
import type { Custo } from '../types';

function normalizeCustosResponse(payload: unknown): Custo[] {
  if (Array.isArray(payload)) {
    return payload as Custo[];
  }

  if (payload && typeof payload === 'object' && 'data' in payload) {
    const nestedData = (payload as { data?: unknown }).data;
    return Array.isArray(nestedData) ? (nestedData as Custo[]) : [];
  }

  return [];
}

export async function createCusto(data: Custo): Promise<Custo> {
  try {
    const response = await api.post<Custo>('/custos', data);
    return response.data;
  } catch {
    throw new Error('Nao foi possivel lancar o custo. Tente novamente.');
  }
}

export async function listCustos(startDate?: string, endDate?: string): Promise<Custo[]> {
  if (!import.meta.env.VITE_API_URL) {
    return [];
  }

  try {
    const response = await api.get<unknown>('/custos', {
      params: {
        startDate,
        endDate,
      },
    });

    return normalizeCustosResponse(response.data);
  } catch {
    return [];
  }
}
