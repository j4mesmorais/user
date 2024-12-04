# Use uma imagem oficial do Node.js como base
FROM node:18-alpine

# Definir o diretório de trabalho dentro do container
WORKDIR /usr/src/app

# Copiar o package.json e o package-lock.json para o container
COPY package*.json ./

# Instalar as dependências do projeto
RUN npm install --omit=dev

# Copiar todo o código para o diretório de trabalho do container
COPY . .

# Definir as variáveis de ambiente da aplicação
ENV NODE_ENV=production

# Expor a porta que será usada pela API
EXPOSE 3022


# Comando para rodar a aplicação
CMD ["npm", "start"]
