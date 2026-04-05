import { useEffect, useMemo, useState } from 'react';
import { Bar, BarChart, CartesianGrid, Cell, Pie, PieChart, ResponsiveContainer, Tooltip, XAxis, YAxis } from 'recharts';
import { listCustos } from '../api/custosApi';
import { listPedidos } from '../api/pedidosApi';
import type { Custo, Pedido } from '../types';
import { TABELA_PRECOS } from '../types';

const PIE_COLORS = ['#C8860A', '#F5C842', '#A55E00', '#FFD978'];

function formatDateToInput(date: Date): string {
  const year = date.getFullYear();
  const month = String(date.getMonth() + 1).padStart(2, '0');
  const day = String(date.getDate()).padStart(2, '0');
  return `${year}-${month}-${day}`;
}

function formatCurrency(value: number): string {
  return new Intl.NumberFormat('pt-BR', { style: 'currency', currency: 'BRL' }).format(value);
}

function ResumoOperacao() {
  const [startDate, setStartDate] = useState(formatDateToInput(new Date()));
  const [endDate, setEndDate] = useState(formatDateToInput(new Date()));
  const [pedidos, setPedidos] = useState<Pedido[]>([]);
  const [custos, setCustos] = useState<Custo[]>([]);
  const [isLoading, setIsLoading] = useState(false);
  const [errorMessage, setErrorMessage] = useState('');

  async function loadData() {
    setIsLoading(true);
    setErrorMessage('');

    try {
      const [pedidosData, custosData] = await Promise.all([
        listPedidos(startDate, endDate),
        listCustos(startDate, endDate),
      ]);

      setPedidos(pedidosData);
      setCustos(custosData);
    } catch (error) {
      const message = error instanceof Error ? error.message : 'Nao foi possivel carregar o resumo da operacao.';
      setErrorMessage(message);
    } finally {
      setIsLoading(false);
    }
  }

  useEffect(() => {
    void loadData();
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  const indicadores = useMemo(() => {
    const quantidadePorTamanho: Record<'P' | 'M' | 'G', number> = { P: 0, M: 0, G: 0 };
    const quantidadePorSabor: Record<Pedido['sabor'], number> = {
      Carne: 0,
      Calabresa: 0,
      Frango: 0,
      Misto: 0,
    };
    const pedidosPorDia: Record<string, number> = {};

    let faturamentoTotal = 0;

    for (const pedido of pedidos) {
      quantidadePorTamanho[pedido.tamanho] += pedido.quantidade;
      quantidadePorSabor[pedido.sabor] += pedido.quantidade;
      pedidosPorDia[pedido.dataPedido] = (pedidosPorDia[pedido.dataPedido] ?? 0) + 1;
      faturamentoTotal += TABELA_PRECOS[pedido.tamanho] * pedido.quantidade;
    }

    const custoTotal = custos.reduce((sum, custo) => sum + custo.valor * custo.quantidade, 0);
    const lucroBruto = faturamentoTotal - custoTotal;
    const ticketMedio = pedidos.length > 0 ? faturamentoTotal / pedidos.length : 0;

    const melhorSabor = Object.entries(quantidadePorSabor).reduce(
      (best, current) => (current[1] > best[1] ? current : best),
      ['Carne', 0] as [string, number],
    );

    const melhorTamanho = Object.entries(quantidadePorTamanho).reduce(
      (best, current) => (current[1] > best[1] ? current : best),
      ['P', 0] as [string, number],
    );

    const diaMaiorVolume = Object.entries(pedidosPorDia).reduce(
      (best, current) => (current[1] > best[1] ? current : best),
      ['Sem dados', 0] as [string, number],
    );

    return {
      quantidadePorTamanho,
      quantidadePorSabor,
      faturamentoTotal,
      custoTotal,
      lucroBruto,
      ticketMedio,
      melhorSabor,
      melhorTamanho,
      diaMaiorVolume,
    };
  }, [pedidos, custos]);

  const barData = [
    { tamanho: 'P', quantidade: indicadores.quantidadePorTamanho.P },
    { tamanho: 'M', quantidade: indicadores.quantidadePorTamanho.M },
    { tamanho: 'G', quantidade: indicadores.quantidadePorTamanho.G },
  ];

  const pieData = [
    { name: 'Carne', value: indicadores.quantidadePorSabor.Carne },
    { name: 'Calabresa', value: indicadores.quantidadePorSabor.Calabresa },
    { name: 'Frango', value: indicadores.quantidadePorSabor.Frango },
    { name: 'Misto', value: indicadores.quantidadePorSabor.Misto },
  ];

  function handleFilterSubmit(event: React.FormEvent<HTMLFormElement>) {
    event.preventDefault();
    void loadData();
  }

  return (
    <section className="space-y-6">
      <header>
        <h1 className="text-3xl font-black text-[#3D1C02]">Resumo da Operacao</h1>
      </header>

      <form onSubmit={handleFilterSubmit} className="rounded-2xl bg-white p-4 shadow">
        <div className="grid gap-4 md:grid-cols-3">
          <div>
            <label htmlFor="startDate" className="mb-1 block text-sm font-semibold text-[#3D1C02]">
              Data inicial
            </label>
            <input
              id="startDate"
              type="date"
              value={startDate}
              onChange={(event) => setStartDate(event.target.value)}
              className="w-full rounded-md border border-amber-200 px-3 py-2"
            />
          </div>
          <div>
            <label htmlFor="endDate" className="mb-1 block text-sm font-semibold text-[#3D1C02]">
              Data final
            </label>
            <input
              id="endDate"
              type="date"
              value={endDate}
              onChange={(event) => setEndDate(event.target.value)}
              className="w-full rounded-md border border-amber-200 px-3 py-2"
            />
          </div>
          <div className="flex items-end">
            <button
              type="submit"
              disabled={isLoading}
              className="w-full rounded-md bg-[#C8860A] py-2 font-bold text-[#3D1C02] transition hover:bg-[#F5C842] disabled:opacity-60"
            >
              {isLoading ? 'Carregando...' : 'Aplicar filtro'}
            </button>
          </div>
        </div>
      </form>

      {errorMessage ? <p className="rounded-md bg-red-100 px-3 py-2 text-sm text-red-700">{errorMessage}</p> : null}

      <section className="space-y-3">
        <h2 className="text-xl font-bold text-[#3D1C02]">Indicadores de Vendas</h2>
        <div className="grid gap-4 md:grid-cols-4">
          <article className="rounded-2xl bg-white p-4 shadow">
            <p className="text-sm text-[#6b3a14]">Total de pedidos</p>
            <strong className="text-2xl text-[#3D1C02]">{pedidos.length}</strong>
          </article>
          <article className="rounded-2xl bg-white p-4 shadow md:col-span-3">
            <p className="mb-3 text-sm text-[#6b3a14]">Quantidade vendida por tamanho</p>
            <div className="h-56">
              <ResponsiveContainer width="100%" height="100%">
                <BarChart data={barData}>
                  <CartesianGrid strokeDasharray="3 3" />
                  <XAxis dataKey="tamanho" />
                  <YAxis allowDecimals={false} />
                  <Tooltip />
                  <Bar dataKey="quantidade" fill="#C8860A" radius={[6, 6, 0, 0]} />
                </BarChart>
              </ResponsiveContainer>
            </div>
          </article>
        </div>

        <div className="grid gap-4 md:grid-cols-2">
          <article className="rounded-2xl bg-white p-4 shadow">
            <p className="mb-3 text-sm text-[#6b3a14]">Quantidade vendida por sabor</p>
            <div className="h-72">
              <ResponsiveContainer width="100%" height="100%">
                <PieChart>
                  <Pie data={pieData} dataKey="value" nameKey="name" outerRadius={95} label>
                    {pieData.map((entry, index) => (
                      <Cell key={`cell-${entry.name}`} fill={PIE_COLORS[index % PIE_COLORS.length]} />
                    ))}
                  </Pie>
                  <Tooltip />
                </PieChart>
              </ResponsiveContainer>
            </div>
          </article>

          <article className="rounded-2xl bg-white p-4 shadow">
            <p className="text-sm text-[#6b3a14]">Faturamento total</p>
            <strong className="mt-2 block text-3xl text-[#3D1C02]">{formatCurrency(indicadores.faturamentoTotal)}</strong>
          </article>
        </div>
      </section>

      <section className="space-y-3">
        <h2 className="text-xl font-bold text-[#3D1C02]">Indicadores Financeiros</h2>
        <div className="grid gap-4 md:grid-cols-3">
          <article className="rounded-2xl bg-white p-4 shadow">
            <p className="text-sm text-[#6b3a14]">Custo total</p>
            <strong className="text-2xl text-[#3D1C02]">{formatCurrency(indicadores.custoTotal)}</strong>
          </article>
          <article className="rounded-2xl bg-white p-4 shadow">
            <p className="text-sm text-[#6b3a14]">Lucro bruto</p>
            <strong className="text-2xl text-[#3D1C02]">{formatCurrency(indicadores.lucroBruto)}</strong>
          </article>
          <article className="rounded-2xl bg-white p-4 shadow">
            <p className="text-sm text-[#6b3a14]">Ticket medio por pedido</p>
            <strong className="text-2xl text-[#3D1C02]">{formatCurrency(indicadores.ticketMedio)}</strong>
          </article>
        </div>
      </section>

      <section className="space-y-3">
        <h2 className="text-xl font-bold text-[#3D1C02]">Indicadores Operacionais</h2>
        <div className="grid gap-4 md:grid-cols-3">
          <article className="rounded-2xl border-l-8 border-[#C8860A] bg-[#fff4d8] p-4 shadow">
            <p className="text-sm text-[#6b3a14]">Sabor mais vendido</p>
            <strong className="text-2xl text-[#3D1C02]">{indicadores.melhorSabor[0]}</strong>
          </article>
          <article className="rounded-2xl border-l-8 border-[#C8860A] bg-[#fff4d8] p-4 shadow">
            <p className="text-sm text-[#6b3a14]">Tamanho mais vendido</p>
            <strong className="text-2xl text-[#3D1C02]">{indicadores.melhorTamanho[0]}</strong>
          </article>
          <article className="rounded-2xl border-l-8 border-[#C8860A] bg-[#fff4d8] p-4 shadow">
            <p className="text-sm text-[#6b3a14]">Dia com maior volume de pedidos</p>
            <strong className="text-xl text-[#3D1C02]">{indicadores.diaMaiorVolume[0]}</strong>
          </article>
        </div>
      </section>
    </section>
  );
}

export default ResumoOperacao;
