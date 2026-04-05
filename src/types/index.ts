export interface Pedido {
  id?: string;
  nomeCliente: string;
  dataPedido: string;
  tamanho: 'P' | 'M' | 'G';
  quantidade: number;
  sabor: 'Carne' | 'Calabresa' | 'Frango' | 'Misto';
  formaEntrega: 'Frete grátis' | 'Entrega na residência';
}

export interface Custo {
  id?: string;
  data: string;
  produto: string;
  fornecedor: string;
  valor: number;
  quantidade: number;
}

export interface FechamentoCaixa {
  faturamento: number;
  investimento: number;
  custoTotal: number;
  lucro: number;
  roas: number;
}

export interface AuthUser {
  token: string;
  login: string;
}

export const TABELA_PRECOS: Record<Pedido['tamanho'], number> = {
  P: 10,
  M: 12,
  G: 15,
};
