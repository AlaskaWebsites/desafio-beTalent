# BeTalent Mobile Test

## Sobre o Projeto

Este projeto é um aplicativo mobile desenvolvido em React Native para visualização de dados de colaboradores.

## Pré-requisitos

- Node.js
- Yarn ou npm
- json-server

## Instruções para Rodar a Aplicação

1. Clone o repositório:

```bash
git clone <URL_DO_REPOSITORIO>
cd BeTalent
```

2. Instale as dependências:

```bash
npm install
```

3. Instale o json-server globalmente (se ainda não tiver):

```bash
npm install -g json-server
```

4. Inicie o json-server:

```bash
json-server --watch db.json
```

5. Crie um arquivo `.env` na raiz do projeto com o seguinte conteúdo:

```plaintext
API_URL=http://localhost:3000/employees
```

6. Inicie o aplicativo:

```bash
npx expo start
```

## Uso

- A aplicação permite visualizar uma lista de colaboradores, pesquisar por nome, cargo ou telefone, e marcar colaboradores como favoritos.
- Clique em um colaborador para ver mais detalhes em um modal.

## Testes

Para rodar os testes, use o comando:

```bash
npm test
```