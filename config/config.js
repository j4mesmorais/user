require('dotenv').config();

module.exports = {
  development: {
    dialect: 'sqlite',
    storage: process.env.DB_STORAGE
  },
  test:{
    dialect: 'postgres',
    host: 'localhost',
    port: '5432',
    database: 'userDB',
    username: 'postgres',
    password: 'postgres',
    protocol: 'postgres',    
  },
  production: {
    dialect: process.env.DB_DIALECT,
    host: process.env.DB_HOST,
    port: process.env.DB_PORT,
    database: process.env.DB_DATABASE,
    username: process.env.DB_USERNAME,
    password: process.env.DB_PASSWORD    
  }
};
