'use strict';

module.exports = {
  async up (queryInterface, Sequelize) {
    await queryInterface.addColumn(
      'users', 
      'avatar', 
      {type:Sequelize.STRING}
    )
  },

  async down (queryInterface, Sequelize) {
    await queryInterface.removeColumn('users', 'avatar');
  }
};
