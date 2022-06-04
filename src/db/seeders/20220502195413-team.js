'use strict';

module.exports = {
  async up (queryInterface, Sequelize) {
    await queryInterface.bulkInsert('teams', [
      { teamName: 'DreamTeam'},
      { teamName: 'ShadowTeam'},
      { teamName: 'IntelegentTeam'},
    ]);
  },

  async down (queryInterface, Sequelize) {
    await queryInterface.bulkDelete('teams', null, {});
  }
};
