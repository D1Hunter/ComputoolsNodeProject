'use strict';

module.exports = {
  async up (queryInterface, Sequelize) {
    await queryInterface.addColumn(
      'users', 
      'teamId', 
      { type:Sequelize.INTEGER,
        references: {
          model: 'teams',
          key: 'id'
        }
      }
    )
  },

  async down (queryInterface, Sequelize) {
    await queryInterface.removeColumn('users', 'teamId');
  }
};
