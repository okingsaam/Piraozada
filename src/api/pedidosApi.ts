import { api } from './axiosConfig';
import type { Pedido } from '../types';

function normalizePedidosResponse(payload: unknown): Pedido[] {
  if (Array.isArray(payload)) {
    return payload as Pedido[];
  }

  if (payload && typeof payload === 'object' && 'data' in payload) {
    const nestedData = (payload as { data?: unknown }).data;
    return Array.isArray(nestedData) ? (nestedData as Pedido[]) : [];
  }

  return [];
}

export async function createPedido(data: Pedido): Promise<Pedido> {
  try {
    const response = await api.post<Pedido>('/pedidos', data);
    return response.data;
  } catch {
    throw new Error('Nao foi possivel lancar o pedido. Tente novamente.');
  }
}

export async function listPedidos(startDate?: string, endDate?: string): Promise<Pedido[]> {
  if (!import.meta.env.VITE_API_URL) {
    return [];
  }

  try {
    const response = await api.get<unknown>('/pedidos', {
      params: {
        startDate,
        endDate,
      },
    });

    return normalizePedidosResponse(response.data);
  } catch {
    return [];
  }
}
