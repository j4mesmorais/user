# Use uma imagem oficial do Node.js como base
FROM node:18-alpine

# Definir o diretório de trabalho dentro do container
WORKDIR /usr/src/app

# Copiar os arquivos necessários para o container
COPY package*.json ./
COPY config ./config

# Instalar as dependências do projeto
RUN npm install

# Copiar todo o código para o diretório de trabalho do container
COPY . .

# Definir variáveis de ambiente para a aplicação
ENV NODE_ENV=production



# Expor a porta que será usada pela API
EXPOSE 3022

# Comando para rodar a aplicação
CMD ["npm", "start"]
