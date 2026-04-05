import { useState } from 'react';
import { useForm } from 'react-hook-form';
import { z } from 'zod';
import { zodResolver } from '@hookform/resolvers/zod';
import { useNavigate } from 'react-router-dom';
import { api } from '../api/axiosConfig';
import { useAuth } from '../context/AuthContext';

const loginSchema = z.object({
  login: z.string().min(1, 'Informe o login.'),
  senha: z.string().min(1, 'Informe a senha.'),
});

type LoginFormData = z.infer<typeof loginSchema>;

interface LoginResponse {
  token: string;
}

const MOCK_LOGIN = 'admin';
const MOCK_SENHA = '123456';
const MOCK_TOKEN = 'piraozada-token-local';
const MOCK_LOGIN_ALTERNATIVO = 'piraozada';

function Login() {
  const navigate = useNavigate();
  const { login } = useAuth();
  const [authError, setAuthError] = useState('');
  const [logoUnavailable, setLogoUnavailable] = useState(false);

  const {
    register,
    handleSubmit,
    formState: { errors, isSubmitting },
  } = useForm<LoginFormData>({
    resolver: zodResolver(loginSchema),
  });

  async function onSubmit(data: LoginFormData) {
    setAuthError('');

    const loginNormalizado = data.login.trim().toLowerCase();
    const senhaNormalizada = data.senha.trim();

    // Credencial local para desenvolvimento sem backend
    const isMockAdmin = loginNormalizado === MOCK_LOGIN && senhaNormalizada === MOCK_SENHA;
    const isMockPiraozada = loginNormalizado === MOCK_LOGIN_ALTERNATIVO && senhaNormalizada === MOCK_SENHA;

    if (isMockAdmin || isMockPiraozada) {
      login(MOCK_TOKEN, loginNormalizado);
      navigate('/dashboard');
      return;
    }

    try {
      const response = await api.post<LoginResponse>('/auth/login', data);
      login(response.data.token, data.login);
      navigate('/dashboard');
    } catch {
      setAuthError('Login ou senha inválidos');
    }
  }

  return (
    <div className="flex min-h-screen items-center justify-center bg-[#3D1C02] p-4">
      <div className="w-full max-w-md rounded-2xl bg-[#FFF7E6] p-8 shadow-2xl">
        <div className="flex justify-center">
          {!logoUnavailable ? (
            <img
              src="/logo-piraozada.png"
              alt="Logo Pirãozada"
              className="h-24 w-auto object-contain"
              onError={() => setLogoUnavailable(true)}
            />
          ) : (
            <h1 className="text-center text-3xl font-black text-[#3D1C02]">
              <span className="text-[#C8860A]">Pirão</span>zada
            </h1>
          )}
        </div>
        <p className="mt-2 text-center text-sm text-[#6b3a14]">Gestao da operacao diaria</p>
        <p className="mt-1 text-center text-xs text-[#8a5421]">Teste: admin ou piraozada / 123456</p>

        <form onSubmit={handleSubmit(onSubmit)} className="mt-8 space-y-4">
          <div>
            <label htmlFor="login" className="mb-1 block text-sm font-semibold text-[#3D1C02]">
              Login
            </label>
            <input
              id="login"
              type="text"
              {...register('login')}
              className="w-full rounded-md border border-amber-300 px-3 py-2 outline-none ring-[#C8860A] focus:ring"
            />
            {errors.login ? <p className="mt-1 text-xs text-red-700">{errors.login.message}</p> : null}
          </div>

          <div>
            <label htmlFor="senha" className="mb-1 block text-sm font-semibold text-[#3D1C02]">
              Senha
            </label>
            <input
              id="senha"
              type="password"
              {...register('senha')}
              className="w-full rounded-md border border-amber-300 px-3 py-2 outline-none ring-[#C8860A] focus:ring"
            />
            {errors.senha ? <p className="mt-1 text-xs text-red-700">{errors.senha.message}</p> : null}
          </div>

          {authError ? <p className="rounded-md bg-red-100 px-3 py-2 text-sm text-red-700">{authError}</p> : null}

          <button
            type="submit"
            disabled={isSubmitting}
            className="w-full rounded-md bg-[#C8860A] py-2 font-bold text-[#3D1C02] transition hover:bg-[#F5C842] disabled:cursor-not-allowed disabled:opacity-60"
          >
            {isSubmitting ? 'Entrando...' : 'Entrar'}
          </button>
        </form>
      </div>
    </div>
  );
}

export default Login;
