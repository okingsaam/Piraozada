import { useMemo, useState } from 'react';
import { useForm } from 'react-hook-form';
import { z } from 'zod';
import { zodResolver } from '@hookform/resolvers/zod';
import { createPedido } from '../api/pedidosApi';
import { TABELA_PRECOS } from '../types';

const pedidoSchema = z.object({
  nomeCliente: z.string().min(1),
  dataPedido: z.string().min(1),
  tamanho: z.enum(['P', 'M', 'G']),
  quantidade: z.coerce.number().min(1),
  sabor: z.enum(['Carne', 'Calabresa', 'Frango', 'Misto']),
  formaEntrega: z.enum(['Frete grátis', 'Entrega na residência']),
});

type PedidoFormData = z.infer<typeof pedidoSchema>;

function formatDateToInput(date: Date): string {
  const year = date.getFullYear();
  const month = String(date.getMonth() + 1).padStart(2, '0');
  const day = String(date.getDate()).padStart(2, '0');
  return `${year}-${month}-${day}`;
}

function LancarPedidos() {
  const [submitError, setSubmitError] = useState('');

  const {
    register,
    handleSubmit,
    watch,
    reset,
    formState: { errors, isSubmitting },
  } = useForm<PedidoFormData>({
    resolver: zodResolver(pedidoSchema),
    defaultValues: {
      dataPedido: formatDateToInput(new Date()),
      tamanho: 'P',
      quantidade: 1,
      sabor: 'Carne',
      formaEntrega: 'Frete grátis',
    },
  });

  const quantidade = watch('quantidade') ?? 0;
  const tamanho = watch('tamanho') ?? 'P';

  const total = useMemo(() => {
    const preco = TABELA_PRECOS[tamanho];
    return quantidade * preco;
  }, [quantidade, tamanho]);

  async function onSubmit(data: PedidoFormData) {
    setSubmitError('');

    try {
      await createPedido(data);
      window.alert('Pedido lançado com sucesso');
      reset({
        nomeCliente: '',
        dataPedido: formatDateToInput(new Date()),
        tamanho: 'P',
        quantidade: 1,
        sabor: 'Carne',
        formaEntrega: 'Frete grátis',
      });
    } catch (error) {
      const message = error instanceof Error ? error.message : 'Erro ao lancar pedido.';
      setSubmitError(message);
    }
  }

  const hasValidationError = Object.keys(errors).length > 0;

  return (
    <section className="mx-auto max-w-2xl rounded-2xl bg-white p-6 shadow-lg">
      <h1 className="text-2xl font-black text-[#3D1C02]">Lancar Pedidos</h1>
      <p className="mt-1 text-sm text-[#6b3a14]">Registre novos pedidos com total automatico.</p>

      <form onSubmit={handleSubmit(onSubmit)} className="mt-6 space-y-4">
        <div>
          <label htmlFor="nomeCliente" className="mb-1 block text-sm font-semibold text-[#3D1C02]">
            Nome do cliente
          </label>
          <input
            id="nomeCliente"
            type="text"
            {...register('nomeCliente')}
            className="w-full rounded-md border border-amber-200 px-3 py-2"
          />
        </div>

        <div>
          <label htmlFor="dataPedido" className="mb-1 block text-sm font-semibold text-[#3D1C02]">
            Data do pedido
          </label>
          <input
            id="dataPedido"
            type="date"
            {...register('dataPedido')}
            className="w-full rounded-md border border-amber-200 px-3 py-2"
          />
        </div>

        <div>
          <label htmlFor="tamanho" className="mb-1 block text-sm font-semibold text-[#3D1C02]">
            Tamanho
          </label>
          <select id="tamanho" {...register('tamanho')} className="w-full rounded-md border border-amber-200 px-3 py-2">
            <option value="P">P - R$10</option>
            <option value="M">M - R$12</option>
            <option value="G">G - R$15</option>
          </select>
        </div>

        <div>
          <label htmlFor="quantidade" className="mb-1 block text-sm font-semibold text-[#3D1C02]">
            Quantidade
          </label>
          <input
            id="quantidade"
            type="number"
            min={1}
            {...register('quantidade', { valueAsNumber: true })}
            className="w-full rounded-md border border-amber-200 px-3 py-2"
          />
        </div>

        <div>
          <label htmlFor="sabor" className="mb-1 block text-sm font-semibold text-[#3D1C02]">
            Sabor
          </label>
          <select id="sabor" {...register('sabor')} className="w-full rounded-md border border-amber-200 px-3 py-2">
            <option value="Carne">Carne</option>
            <option value="Calabresa">Calabresa</option>
            <option value="Frango">Frango</option>
            <option value="Misto">Misto</option>
          </select>
        </div>

        <div>
          <label htmlFor="formaEntrega" className="mb-1 block text-sm font-semibold text-[#3D1C02]">
            Forma de entrega
          </label>
          <select id="formaEntrega" {...register('formaEntrega')} className="w-full rounded-md border border-amber-200 px-3 py-2">
            <option value="Frete grátis">Frete grátis</option>
            <option value="Entrega na residência">Entrega na residência</option>
          </select>
        </div>

        <div className="rounded-xl border border-amber-300 bg-amber-50 p-4 text-lg font-bold text-[#3D1C02]">
          Total do pedido: R${total.toFixed(2)}
        </div>

        {hasValidationError ? (
          <p className="rounded-md bg-red-100 px-3 py-2 text-sm text-red-700">
            Existem informações obrigatórias que não foram preenchidas.
          </p>
        ) : null}

        {submitError ? <p className="rounded-md bg-red-100 px-3 py-2 text-sm text-red-700">{submitError}</p> : null}

        <button
          type="submit"
          disabled={isSubmitting}
          className="w-full rounded-md bg-[#C8860A] py-2 font-bold text-[#3D1C02] transition hover:bg-[#F5C842] disabled:opacity-60"
        >
          {isSubmitting ? 'Lancando...' : 'Lancar pedido'}
        </button>
      </form>
    </section>
  );
}

export default LancarPedidos;
