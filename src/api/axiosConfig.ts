import axios, { AxiosError } from 'axios';

const api = axios.create({
  baseURL: import.meta.env.VITE_API_URL,
});

api.interceptors.request.use((config) => {
  const rawUser = localStorage.getItem('piraozada:user');

  if (rawUser) {
    try {
      const parsedUser = JSON.parse(rawUser) as { token?: string };
      if (parsedUser.token) {
        config.headers.Authorization = `Bearer ${parsedUser.token}`;
      }
    } catch {
      localStorage.removeItem('piraozada:user');
    }
  }

  return config;
});

api.interceptors.response.use(
  (response) => response,
  (error: AxiosError) => {
    if (error.response?.status === 401) {
      localStorage.removeItem('piraozada:user');
      window.location.href = '/login';
    }

    return Promise.reject(error);
  },
);

export { api };
