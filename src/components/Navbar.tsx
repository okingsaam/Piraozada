import { useState } from 'react';
import { Link, NavLink, useNavigate } from 'react-router-dom';
import { useAuth } from '../context/AuthContext';

const links = [
  { to: '/dashboard', label: 'Dashboard' },
  { to: '/pedidos', label: 'Pedidos' },
  { to: '/custos', label: 'Custos' },
  { to: '/resumo', label: 'Resumo' },
  { to: '/caixa', label: 'Caixa' },
];

function navClassName(isActive: boolean) {
  return isActive
    ? 'text-amber-300 underline underline-offset-4'
    : 'text-amber-100 transition hover:text-yellow-300';
}

export function Navbar() {
  const [isMenuOpen, setIsMenuOpen] = useState(false);
  const [logoUnavailable, setLogoUnavailable] = useState(false);
  const { logout } = useAuth();
  const navigate = useNavigate();

  function handleLogout() {
    logout();
    navigate('/login');
  }

  return (
    <header className="border-b border-amber-700 bg-[#3D1C02] shadow-lg">
      <div className="mx-auto flex max-w-7xl items-center justify-between px-4 py-3 sm:px-6 lg:px-8">
        <Link to="/dashboard" className="flex items-center">
          {!logoUnavailable ? (
            <img
              src="/logo-piraozada.png"
              alt="Logo Pirãozada"
              className="h-12 w-auto rounded-sm object-contain"
              onError={() => setLogoUnavailable(true)}
            />
          ) : (
            <span className="text-2xl font-black tracking-wide text-white">
              <span className="text-[#F5C842]">Pirão</span>zada
            </span>
          )}
        </Link>

        <button
          type="button"
          onClick={() => setIsMenuOpen((prev) => !prev)}
          className="rounded-md border border-amber-500 px-2 py-2 text-amber-100 md:hidden"
          aria-label="Abrir menu"
        >
          <span className="flex flex-col gap-1">
            <span className="h-0.5 w-5 bg-amber-100" />
            <span className="h-0.5 w-5 bg-amber-100" />
            <span className="h-0.5 w-5 bg-amber-100" />
          </span>
        </button>

        <nav className="hidden items-center gap-6 md:flex">
          {links.map((link) => (
            <NavLink key={link.to} to={link.to} className={({ isActive }) => navClassName(isActive)}>
              {link.label}
            </NavLink>
          ))}
          <button
            type="button"
            onClick={handleLogout}
            className="rounded-md bg-[#C8860A] px-4 py-2 font-semibold text-[#3D1C02] transition hover:bg-[#F5C842]"
          >
            Sair
          </button>
        </nav>
      </div>

      {isMenuOpen ? (
        <div className="border-t border-amber-700 px-4 py-3 md:hidden">
          <div className="flex flex-col gap-3">
            {links.map((link) => (
              <NavLink
                key={link.to}
                to={link.to}
                onClick={() => setIsMenuOpen(false)}
                className={({ isActive }) => navClassName(isActive)}
              >
                {link.label}
              </NavLink>
            ))}
            <button
              type="button"
              onClick={handleLogout}
              className="rounded-md bg-[#C8860A] px-4 py-2 font-semibold text-[#3D1C02]"
            >
              Sair
            </button>
          </div>
        </div>
      ) : null}
    </header>
  );
}
