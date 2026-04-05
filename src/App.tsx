import type { ReactNode } from 'react';
import { Navigate, Route, Routes } from 'react-router-dom';
import { Navbar } from './components/Navbar';
import { ProtectedRoute } from './components/ProtectedRoute';
import { ErrorBoundary } from './components/ErrorBoundary';
import Login from './pages/Login';
import Dashboard from './pages/Dashboard';
import LancarPedidos from './pages/LancarPedidos';
import LancarCustos from './pages/LancarCustos';
import ResumoOperacao from './pages/ResumoOperacao';
import FechamentoCaixa from './pages/FechamentoCaixa';

function PrivatePageLayout({ children }: { children: ReactNode }) {
  return (
    <ProtectedRoute>
      <div className="min-h-screen bg-amber-50">
        <Navbar />
        <main className="mx-auto max-w-7xl px-4 py-6 sm:px-6 lg:px-8">{children}</main>
      </div>
    </ProtectedRoute>
  );
}

function App() {
  return (
    <Routes>
      <Route path="/" element={<Navigate to="/login" replace />} />
      <Route
        path="/login"
        element={
          <ErrorBoundary>
            <Login />
          </ErrorBoundary>
        }
      />
      <Route
        path="/dashboard"
        element={
          <ErrorBoundary>
            <PrivatePageLayout>
              <Dashboard />
            </PrivatePageLayout>
          </ErrorBoundary>
        }
      />
      <Route
        path="/pedidos"
        element={
          <ErrorBoundary>
            <PrivatePageLayout>
              <LancarPedidos />
            </PrivatePageLayout>
          </ErrorBoundary>
        }
      />
      <Route
        path="/custos"
        element={
          <ErrorBoundary>
            <PrivatePageLayout>
              <LancarCustos />
            </PrivatePageLayout>
          </ErrorBoundary>
        }
      />
      <Route
        path="/resumo"
        element={
          <ErrorBoundary>
            <PrivatePageLayout>
              <ResumoOperacao />
            </PrivatePageLayout>
          </ErrorBoundary>
        }
      />
      <Route
        path="/caixa"
        element={
          <ErrorBoundary>
            <PrivatePageLayout>
              <FechamentoCaixa />
            </PrivatePageLayout>
          </ErrorBoundary>
        }
      />
      <Route path="*" element={<Navigate to="/login" replace />} />
    </Routes>
  );
}

export default App;
