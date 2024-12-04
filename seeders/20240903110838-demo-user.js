'use strict';
require('dotenv').config();
//const bcrypt = require('bcrypt');
const { encrypt } = require('../src/utils/encryption'); // Ajuste o caminho conforme necessário
/** @type {import('sequelize-cli').Seeder} */
module.exports = {
  async up (queryInterface) {
    //console.log(encrypt(process.env.ROOT_PASSWORD));
    const hashedPassword = encrypt(process.env.ROOT_PASSWORD);//await bcrypt.hash(process.env.ROOT_PASSWORD, 10);

    await queryInterface.bulkInsert('Users', [{
      email: process.env.ROOT_USER,
      name: 'Root User',
      password: hashedPassword,
      isSuperUser: true,
      ativo: true,
      createdAt: new Date(),
      updatedAt: new Date()
    }]);
  },

  async down (queryInterface) {
    await queryInterface.bulkDelete('Users', { email: process.env.ROOT_USER });
  }
};
