'use strict';
const bcrypt = require('bcryptjs');

module.exports = {
  async up (queryInterface, Sequelize) {
    await queryInterface.bulkInsert('users', [
      { email: 'vova@test.com',login:"vova", password: await bcrypt.hash('vova123', 6), firstName: 'Vova', secondName: 'Vova', roleId:3},
      { email: 'valera@test.com',login:"valera", password: await bcrypt.hash('valera123', 6), firstName: 'Valera', secondName: 'Valera', roleId:1},
      { email: 'danil@test.com', login:"danil", password: await bcrypt.hash('danil123', 6), firstName: 'Danil', secondName: 'Danil', roleId:1},
    ]);
  },

  async down (queryInterface, Sequelize) {
    await queryInterface.bulkDelete('users', null, {});
  }
};