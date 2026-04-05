import { useEffect, useMemo, useState } from 'react';
import { getFechamento } from '../api/caixaApi';

interface CaixaResumo {
  faturamento: number;
  custoTotal: number;
}

function formatDateToInput(date: Date): string {
  const year = date.getFullYear();
  const month = String(date.getMonth() + 1).padStart(2, '0');
  const day = String(date.getDate()).padStart(2, '0');
  return `${year}-${month}-${day}`;
}

function formatCurrency(value: number): string {
  return new Intl.NumberFormat('pt-BR', { style: 'currency', currency: 'BRL' }).format(value);
}

function FechamentoCaixa() {
  const [startDate, setStartDate] = useState(formatDateToInput(new Date()));
  const [endDate, setEndDate] = useState(formatDateToInput(new Date()));
  const [investimentoAnuncios, setInvestimentoAnuncios] = useState(0);
  const [resumo, setResumo] = useState<CaixaResumo>({
    faturamento: 0,
    custoTotal: 0,
  });
  const [isLoading, setIsLoading] = useState(false);
  const [errorMessage, setErrorMessage] = useState('');

  async function loadResumo() {
    setIsLoading(true);
    setErrorMessage('');

    try {
      const data = await getFechamento(startDate, endDate);
      setResumo({
        faturamento: data.faturamento,
        custoTotal: data.custoTotal,
      });
    } catch (error) {
      const message = error instanceof Error ? error.message : 'Nao foi possivel calcular o fechamento de caixa.';
      setErrorMessage(message);
    } finally {
      setIsLoading(false);
    }
  }

  useEffect(() => {
    void loadResumo();
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  function handleFilterSubmit(event: React.FormEvent<HTMLFormElement>) {
    event.preventDefault();
    void loadResumo();
  }

  const lucro = useMemo(() => resumo.faturamento - resumo.custoTotal, [resumo]);
  const roas = useMemo(() => {
    if (investimentoAnuncios <= 0) {
      return 0;
    }
    return resumo.faturamento / investimentoAnuncios;
  }, [investimentoAnuncios, resumo.faturamento]);

  return (
    <section className="space-y-6">
      <header>
        <h1 className="text-3xl font-black text-[#3D1C02]">Fechamento de Caixa</h1>
      </header>

      <form onSubmit={handleFilterSubmit} className="rounded-2xl bg-white p-4 shadow">
        <div className="grid gap-4 md:grid-cols-4">
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

          <div>
            <label htmlFor="investimento" className="mb-1 block text-sm font-semibold text-[#3D1C02]">
              Investimento em anuncios
            </label>
            <input
              id="investimento"
              type="number"
              min="0"
              step="0.01"
              value={investimentoAnuncios}
              onChange={(event) => setInvestimentoAnuncios(Number(event.target.value))}
              className="w-full rounded-md border border-amber-200 px-3 py-2"
            />
          </div>

          <div className="flex items-end">
            <button
              type="submit"
              disabled={isLoading}
              className="w-full rounded-md bg-[#C8860A] py-2 font-bold text-[#3D1C02] transition hover:bg-[#F5C842] disabled:opacity-60"
            >
              {isLoading ? 'Calculando...' : 'Atualizar'}
            </button>
          </div>
        </div>
      </form>

      {errorMessage ? <p className="rounded-md bg-red-100 px-3 py-2 text-sm text-red-700">{errorMessage}</p> : null}

      <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-4">
        <article className="rounded-2xl bg-[#fff4d8] p-5 shadow">
          <p className="text-sm text-[#6b3a14]">Total investido</p>
          <strong className="text-2xl text-[#3D1C02]">{formatCurrency(resumo.custoTotal)}</strong>
        </article>
        <article className="rounded-2xl bg-[#ffe8b0] p-5 shadow">
          <p className="text-sm text-[#6b3a14]">Faturamento total</p>
          <strong className="text-2xl text-[#3D1C02]">{formatCurrency(resumo.faturamento)}</strong>
        </article>
        <article className="rounded-2xl bg-[#ffd978] p-5 shadow">
          <p className="text-sm text-[#6b3a14]">Lucro</p>
          <strong className="text-2xl text-[#3D1C02]">{formatCurrency(lucro)}</strong>
        </article>
        <article className="rounded-2xl bg-[#C8860A] p-5 text-[#3D1C02] shadow">
          <p className="text-sm font-semibold">ROAS</p>
          <strong className="text-2xl">{roas.toFixed(2)}x</strong>
          <p className="mt-1 text-xs">Faturamento / Investimento em anuncios</p>
        </article>
      </div>

      <button
        type="button"
        onClick={() => window.alert('Exportação em Excel será implementada em breve.')}
        className="rounded-md border border-[#C8860A] bg-white px-4 py-2 font-bold text-[#3D1C02] transition hover:bg-[#fff4d8]"
      >
        Exportar Excel
      </button>
    </section>
  );
}

export default FechamentoCaixa;
