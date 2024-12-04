const { Sequelize, DataTypes } = require('sequelize');
const path = require('path');
const dotenv = require('dotenv');
const conf = require('../../config/config.js');
dotenv.config(); // Carregar variáveis de ambiente do .env

const env = process.env.NODE_ENV || 'development';
const config = conf[env];
/*
const config = {
  development: {
    dialect: process.env.DB_DIALECT,
    storage: process.env.DB_STORAGE
  },
  production: {
    dialect: process.env.DB_DIALECT,
    host: process.env.DB_HOST,
    port: process.env.DB_PORT,
    database: process.env.DB_DATABASE,
    username: process.env.DB_USERNAME,
    password: process.env.DB_PASSWORD
  }
}[env];
*/
const sequelize = new Sequelize(config);

const db = {
  sequelize,
  Sequelize,
  User: require('./user')(sequelize, DataTypes)
};

module.exports = db;
