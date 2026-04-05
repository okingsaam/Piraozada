import { useState } from 'react';
import { useForm } from 'react-hook-form';
import { z } from 'zod';
import { zodResolver } from '@hookform/resolvers/zod';
import { createCusto } from '../api/custosApi';

const custoSchema = z.object({
  data: z.string().min(1),
  produto: z.string().min(1),
  fornecedor: z.string().min(1),
  valor: z.coerce.number().min(0.01),
  quantidade: z.coerce.number().min(1),
});

type CustoFormData = z.infer<typeof custoSchema>;

function formatDateToInput(date: Date): string {
  const year = date.getFullYear();
  const month = String(date.getMonth() + 1).padStart(2, '0');
  const day = String(date.getDate()).padStart(2, '0');
  return `${year}-${month}-${day}`;
}

function LancarCustos() {
  const [submitError, setSubmitError] = useState('');

  const {
    register,
    handleSubmit,
    reset,
    formState: { errors, isSubmitting },
  } = useForm<CustoFormData>({
    resolver: zodResolver(custoSchema),
    defaultValues: {
      data: formatDateToInput(new Date()),
      valor: 0,
      quantidade: 1,
    },
  });

  async function onSubmit(data: CustoFormData) {
    setSubmitError('');

    try {
      await createCusto(data);
      window.alert('Custo lançado com sucesso');
      reset({
        data: formatDateToInput(new Date()),
        produto: '',
        fornecedor: '',
        valor: 0,
        quantidade: 1,
      });
    } catch (error) {
      const message = error instanceof Error ? error.message : 'Erro ao lancar custo.';
      setSubmitError(message);
    }
  }

  const hasValidationError = Object.keys(errors).length > 0;

  return (
    <section className="mx-auto max-w-2xl rounded-2xl bg-white p-6 shadow-lg">
      <h1 className="text-2xl font-black text-[#3D1C02]">Lancar Custos</h1>
      <p className="mt-1 text-sm text-[#6b3a14]">Registre despesas de fornecedores e insumos.</p>

      <form onSubmit={handleSubmit(onSubmit)} className="mt-6 space-y-4">
        <div>
          <label htmlFor="data" className="mb-1 block text-sm font-semibold text-[#3D1C02]">
            Data
          </label>
          <input id="data" type="date" {...register('data')} className="w-full rounded-md border border-amber-200 px-3 py-2" />
        </div>

        <div>
          <label htmlFor="produto" className="mb-1 block text-sm font-semibold text-[#3D1C02]">
            Produto
          </label>
          <input
            id="produto"
            type="text"
            {...register('produto')}
            className="w-full rounded-md border border-amber-200 px-3 py-2"
          />
        </div>

        <div>
          <label htmlFor="fornecedor" className="mb-1 block text-sm font-semibold text-[#3D1C02]">
            Fornecedor
          </label>
          <input
            id="fornecedor"
            type="text"
            {...register('fornecedor')}
            className="w-full rounded-md border border-amber-200 px-3 py-2"
          />
        </div>

        <div>
          <label htmlFor="valor" className="mb-1 block text-sm font-semibold text-[#3D1C02]">
            Valor (R$)
          </label>
          <input
            id="valor"
            type="number"
            step="0.01"
            min="0.01"
            {...register('valor', { valueAsNumber: true })}
            className="w-full rounded-md border border-amber-200 px-3 py-2"
          />
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
          {isSubmitting ? 'Lancando...' : 'Lancar custo'}
        </button>
      </form>
    </section>
  );
}

export default LancarCustos;
