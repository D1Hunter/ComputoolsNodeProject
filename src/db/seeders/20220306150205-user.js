'use strict';
const bcrypt = require('bcryptjs');

module.exports = {
  async up (queryInterface, Sequelize) {
    await queryInterface.bulkInsert('users', [
      { email: 'vova@test.com', password: await bcrypt.hash('vova123', 6), firstName: 'Vova', secondName: 'Vova',createdAt:new Date(Date.now()),updatedAt:new Date(Date.now())},
      { email: 'valera@test.com', password: await bcrypt.hash('valera123', 6), firstName: 'Valera', secondName: 'Valera',createdAt:new Date(Date.now()),updatedAt:new Date(Date.now())},
      { email: 'danil@test.com', password: await bcrypt.hash('danil123', 6), firstName: 'Danil', secondName: 'Danil',createdAt:new Date(Date.now()),updatedAt:new Date(Date.now())},
  ]);
  },

  async down (queryInterface, Sequelize) {
    await queryInterface.bulkDelete('users', null, {});
  }
};
