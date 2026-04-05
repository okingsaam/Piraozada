# 🍔 Pirãozada - Sistema de Gestão de Pedidos

Frontend completo para gerenciamento operacional de uma lanchonete, desenvolvido com React, TypeScript e Tailwind CSS.

## 🎯 Funcionalidades

### 📋 Páginas Principais
- **Login**: Autenticação segura com credenciais de teste
- **Dashboard**: Painel de controle com navegação para todas as operações
- **Lançar Pedidos**: Registro de novos pedidos com cálculo automático de valor
- **Lançar Custos**: Controle de despesas operacionais
- **Resumo da Operação**: Dashboard de análise com gráficos e métricas
- **Fechamento de Caixa**: Relatório de faturamento, custos e lucratividade

### ✨ Recursos
- ✅ Autenticação com proteção de rotas
- ✅ Validação de formulários com React Hook Form + Zod
- ✅ Gráficos interativos (Recharts)
- ✅ Design responsivo com Tailwind CSS
- ✅ Persistência de sessão com localStorage
- ✅ Tratamento robusto de erros
- ✅ Interface em português

## 🛠️ Stack Tecnológico

- **React 18.x** - UI Library
- **TypeScript** - Type safety
- **Vite 6.4.1** - Build tool
- **Tailwind CSS 3** - Styling
- **React Router v6** - Routing
- **React Hook Form** - Form management
- **Zod** - Schema validation
- **Axios** - HTTP client
- **Recharts** - Data visualization

## 🚀 Getting Started

### Pré-requisitos
- Node.js 18+ instalado

### Instalação

```bash
# Clonar repositório
git clone https://github.com/seu-usuario/piraozada.git
cd piraozada

# Instalar dependências
npm install

# Configurar variáveis de ambiente
# Criar arquivo .env.local (opcional)
# VITE_API_URL=http://seu-backend.com/api
```

### Desenvolvimento

```bash
# Iniciar servidor de desenvolvimento
npm run dev

# A aplicação estará disponível em http://localhost:5173
```

### Build

```bash
# Build para produção
npm run build

# Preview do build
npm run preview
```

## 🔐 Credenciais de Teste

Use as seguintes credenciais para acessar o sistema:

| Usuário | Senha |
|---------|-------|
| admin | 123456 |
| piraozada | 123456 |

**Nota**: O login é case-insensitive e tolera espaços extras.

## 📊 Estrutura do Projeto

```
src/
├── api/              # Serviços HTTP
│   ├── axiosConfig.ts
│   ├── pedidosApi.ts
│   ├── custosApi.ts
│   └── caixaApi.ts
├── components/       # Componentes reutilizáveis
│   ├── Navbar.tsx
│   ├── ErrorBoundary.tsx
│   └── ProtectedRoute.tsx
├── context/          # Context API
│   └── AuthContext.tsx
├── pages/            # Páginas principais
│   ├── Login.tsx
│   ├── Dashboard.tsx
│   ├── LancarPedidos.tsx
│   ├── LancarCustos.tsx
│   ├── ResumoOperacao.tsx
│   └── FechamentoCaixa.tsx
├── types/            # Definições de tipos
│   └── index.ts
├── App.tsx           # Roteamento principal
└── main.tsx          # Entry point
```

## 🎨 Paleta de Cores

- **Marrom Primário**: `#3D1C02`
- **Amarelo Destaque**: `#F5C842`
- **Marrom Secundário**: `#C8860A`
- **Fundo Claro**: `#FFF7E6`

## 📝 Funcionalidades Detalhadas

### Lançar Pedidos
- Registro com nome do cliente, data, tamanho (P/M/G), sabor e quantidade
- Cálculo automático do valor total
- Opções de forma de entrega (Frete grátis / Entrega na residência)
- Validação em tempo real

### Resumo da Operação
- Análise de período customizável
- Gráficos de vendas por tamanho e sabor
- Métricas: total de pedidos, faturamento, custos, lucro
- Ticket médio e item mais vendido

### Fechamento de Caixa
- Relatório por período
- Cálculo de ROAS (Retorno sobre Investimento em Anúncios)
- Exportação de dados em Excel

## 🔌 Integração com Backend

A aplicação aguarda uma API backend com os seguintes endpoints:

```
POST /auth/login
GET /pedidos?startDate=&endDate=
POST /pedidos
GET /custos?startDate=&endDate=
POST /custos
GET /caixa?startDate=&endDate=
```

Configure a URL base da API via variável de ambiente:
```
VITE_API_URL=http://seu-backend.com/api
```

## 🐛 Tratamento de Erros

- Error Boundary para captura de crashes
- Validação defensiva de respostas API
- Fallback gracioso quando backend indisponível
- Mensagens de erro em português

## 📱 Responsividade

Interface totalmente responsiva:
- ✅ Desktop
- ✅ Tablet
- ✅ Mobile (com hamburger menu)

## 📄 Licença

Este projeto está sob licença MIT.

## 👨‍💻 Desenvolvido com pelo King Sam

Pirãozada - Sistema de Gestão Operacional para Lanchonetes

