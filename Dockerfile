FROM node:20-alpine

WORKDIR /app

# Copiar apenas os arquivos de dependências primeiro
COPY package*.json ./

# Instalar dependências
RUN npm install

# Criar um .dockerignore para ignorar node_modules
RUN echo "node_modules\n.next\n" > .dockerignore

# Copiar o restante dos arquivos do projeto
COPY . .

EXPOSE 3000

CMD ["npm", "run", "dev"]
