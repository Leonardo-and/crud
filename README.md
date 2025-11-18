# CRUD

## Pré-requisitos

- Node.js >= 18.11.0
- MySQL
- npm ou pnpm

## Instalação

1. Clone o repositório:
```bash
  git clone
  cd crud
```

2. Configure as variáveis de ambiente
```bash
  cp .env.example .env
```

2.1. Edite o arquivo `.env` e insira as credenciais do banco de dados:
```env
  PORT=3333
  DB_NAME=crud
  DB_USER=root
  DB_HOST=localhost
  DB_PASSWORD=123
```

3. Instale as dependências
```bash
  npm install
```

4. Popule o banco de dados

```bash
  npm run db:seed
```

5. Inicie a aplicação
```bash
  npm start
```
