const express = require('express');
const dotenv = require('dotenv');
const path = require('path'); // Importa o módulo path
const authRoutes = require('./routes/auth');
const userRoutes = require('./routes/userRoutes'); // Importe as rotas de usuário
const updateUserRoutes = require('./routes/updateUserRoutes');
const passwordRoutes = require('./routes/passwordRoutes');
const redefiniPasswordLink = require('./routes/redefiniPasswordLink');
const indexRouter = require('./routes/index'); // ajuste o caminho se necessário
const inactivateUser = require('./routes/inactivateUser'); // ajuste o caminho se necessário

const { swaggerMiddleware, swaggerSetup } = require('./swagger'); // Importa a configuração do Swagger
const { sequelize } = require('./models');
const { authenticateToken, isSuperUser } = require('./middlewares/authMiddleware'); // Atualize a importação dos middlewares

dotenv.config(); // Carregar variáveis de ambiente do .env

const app = express();
// Middleware para servir arquivos estáticos
//app.use('/public', express.static(path.join(__dirname, 'src', 'public')));
app.use('/public', express.static(path.join(__dirname, 'public')));


// Middleware para Swagger
app.use('/api/docs', swaggerMiddleware, swaggerSetup);

// Middleware para analisar JSON
app.use(express.json());
// Middleware para analisar dados de formulários HTML
app.use(express.urlencoded({ extended: true }));
// Rotas
app.use('/api/auth', authRoutes);
app.use('/api/users', authenticateToken, userRoutes); // Adicione os middlewares antes das rotas
app.use('/api/users', updateUserRoutes);
app.use('/api/users/changepassword',authenticateToken, passwordRoutes);
app.use('/api/admin/users', authenticateToken, isSuperUser, userRoutes); // Use outra rota exclusiva para admins
app.use('/api/users', authenticateToken, isSuperUser, inactivateUser); // Use outra rota exclusiva para admins
app.use('/api', redefiniPasswordLink);
app.use('/', indexRouter);
// Conectar ao banco de dados e iniciar o servidor
const PORT = process.env.PORT || 3000;
// Verifica se está em modo de produção

if (process.env.NODE_ENV === 'production') {
  console.log('\x1b[32m%s\x1b[0m','Esta rodando em modo de producao'); // Verde
  // Configurações específicas para produção
} else if (process.env.NODE_ENV === 'development') {
  console.log('\x1b[31m%s\x1b[0m', 'Esta rodando em modo de desenvolvimento'); // Vermelho
  // Configurações específicas para desenvolvimento
} else if (process.env.NODE_ENV === 'test') {
  console.log("\x1b[34m%s\x1b[0m", "Esta rodando em modo de teste");

}else{
  console.log("\x1b[34m%s\x1b[0m", "Esta rodando em modo "+process.env.NODE_ENV);
}

sequelize.sync().then(() => {
  app.listen(PORT, () => {
    console.log(`Server running on port ${PORT}`);
  });
});

module.exports = app;
