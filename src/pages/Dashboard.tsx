import type { ReactNode } from 'react';
import { Link } from 'react-router-dom';

interface CardItem {
  to: string;
  title: string;
  description: string;
  icon: ReactNode;
}

const cards: CardItem[] = [
  {
    to: '/pedidos',
    title: 'Lancar Pedidos',
    description: 'Registre vendas e acompanhe o total do dia.',
    icon: (
      <svg viewBox="0 0 24 24" className="h-10 w-10" fill="none" stroke="currentColor" strokeWidth="1.8">
        <path d="M8 3h8M9 3v3m6-3v3M6 7h12v14H6z" />
        <path d="M9 11h6M9 15h6" />
      </svg>
    ),
  },
  {
    to: '/custos',
    title: 'Lancar Custos',
    description: 'Controle entradas de produtos e fornecedores.',
    icon: (
      <svg viewBox="0 0 24 24" className="h-10 w-10" fill="none" stroke="currentColor" strokeWidth="1.8">
        <path d="M6 4h12l-1 16H7L6 4z" />
        <path d="M9 8h6M9 12h6" />
      </svg>
    ),
  },
  {
    to: '/caixa',
    title: 'Fechamento de Caixa',
    description: 'Feche o periodo com lucro, custos e ROAS.',
    icon: (
      <svg viewBox="0 0 24 24" className="h-10 w-10" fill="none" stroke="currentColor" strokeWidth="1.8">
        <rect x="3" y="7" width="18" height="12" rx="2" />
        <path d="M3 11h18M8 15h4" />
      </svg>
    ),
  },
  {
    to: '/resumo',
    title: 'Resumo da Operacao',
    description: 'Visualize indicadores comerciais e operacionais.',
    icon: (
      <svg viewBox="0 0 24 24" className="h-10 w-10" fill="none" stroke="currentColor" strokeWidth="1.8">
        <path d="M4 19V5" />
        <path d="M8 19v-6" />
        <path d="M12 19V9" />
        <path d="M16 19v-4" />
        <path d="M20 19V7" />
      </svg>
    ),
  },
];

function Dashboard() {
  return (
    <section className="space-y-6">
      <header className="rounded-2xl bg-[#3D1C02] p-6 text-white shadow-xl">
        <h1 className="text-3xl font-black">Olá, bem-vindo ao Pirãozada!</h1>
        <p className="mt-2 text-amber-100">Gerencie pedidos, custos e indicadores da sua operacao.</p>
      </header>

      <div className="grid grid-cols-1 gap-5 md:grid-cols-2">
        {cards.map((card) => (
          <Link
            key={card.title}
            to={card.to}
            className="group rounded-2xl border border-amber-200 bg-gradient-to-br from-[#FFF4D8] to-[#FFE5A7] p-6 text-[#3D1C02] shadow-md transition hover:-translate-y-0.5 hover:shadow-xl"
          >
            <div className="text-[#C8860A] transition group-hover:text-[#A55E00]">{card.icon}</div>
            <h2 className="mt-4 text-2xl font-bold">{card.title}</h2>
            <p className="mt-2 text-sm text-[#5A2B09]">{card.description}</p>
          </Link>
        ))}
      </div>
    </section>
  );
}

export default Dashboard;
