const swaggerUi = require('swagger-ui-express');
const swaggerJsDoc = require('swagger-jsdoc');

const swaggerOptions = {
  definition: {
    openapi: '3.0.0',
    info: {
      title: 'User Adjunto',
      version: '1.0.0',
      description: 'Documentação da API'
    },
    components: {
      securitySchemes: {
        BearerAuth: {
          type: 'http',
          scheme: 'bearer',
          bearerFormat: 'JWT'
        }
      }
    },
    security: [
      {
        BearerAuth: []
      }
    ]
  },
  apis: ['./src/routes/*.js'] // Caminho para os arquivos de rotas
};

const swaggerSpec = swaggerJsDoc(swaggerOptions);

const swaggerMiddleware = swaggerUi.serve;
const swaggerSetup = swaggerUi.setup(swaggerSpec);

module.exports = { swaggerMiddleware, swaggerSetup };
