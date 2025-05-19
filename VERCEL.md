# Implantação do Frontend na Vercel

Este documento descreve como implantar o frontend do aplicativo de controle de ponto na Vercel.

## Pré-requisitos

- Conta na Vercel (https://vercel.com)
- Git instalado em sua máquina
- Repositório do projeto configurado no GitHub, GitLab ou Bitbucket

## Configuração de Variáveis de Ambiente

Antes de implantar o aplicativo, é necessário configurar a variável de ambiente para a URL da API:

1. Na dashboard da Vercel, após criar o projeto, vá para "Settings" > "Environment Variables"
2. Adicione a seguinte variável:
   - Nome: `NEXT_PUBLIC_API_URL`
   - Valor: URL completa do seu backend (ex: `https://seu-backend.vercel.app` ou outro endereço onde o backend esteja hospedado)

## Implantação

### Opção 1: Implantação Direta via Dashboard da Vercel

1. Faça login na [Vercel](https://vercel.com)
2. Clique em "Add New" > "Project"
3. Importe o repositório do GitHub, GitLab ou Bitbucket onde o projeto está hospedado
4. Configure o projeto:
   - Framework Preset: Next.js
   - Root Directory: `frontend` (se o repositório contiver tanto o frontend quanto o backend)
   - Build Command: `next build` (já configurado no package.json)
   - Output Directory: `.next` (já configurado no vercel.json)
5. Adicione a variável de ambiente `NEXT_PUBLIC_API_URL` conforme mencionado acima
6. Clique em "Deploy"

### Opção 2: Implantação via CLI da Vercel

1. Instale a CLI da Vercel:
   ```bash
   npm i -g vercel
   ```

2. Faça login na sua conta Vercel:
   ```bash
   vercel login
   ```

3. Navegue até a pasta do frontend e execute:
   ```bash
   vercel
   ```

4. Siga as instruções na tela para configurar o projeto
5. Para definir a variável de ambiente, use:
   ```bash
   vercel env add NEXT_PUBLIC_API_URL
   ```

6. Para fazer uma nova implantação com as variáveis de ambiente:
   ```bash
   vercel --prod
   ```

## Verificação

Após a implantação, verifique se:

1. O frontend está acessível na URL fornecida pela Vercel
2. As chamadas de API estão funcionando corretamente
3. Não há erros no console do navegador relacionados a CORS ou conexões com o backend

## Solução de Problemas

### Erro de CORS

Se ocorrerem erros de CORS, verifique se o backend está configurado para aceitar requisições do domínio da Vercel. Adicione o domínio do frontend à lista de origens permitidas no backend.

### Erro de Conexão com a API

Verifique se a variável de ambiente `NEXT_PUBLIC_API_URL` está configurada corretamente e se o backend está acessível.

### Problemas com Rotas

O arquivo `vercel.json` já está configurado para redirecionar todas as rotas para o ponto de entrada principal. Se houver problemas com navegação, verifique se este arquivo está presente e configurado corretamente.
