'use strict';

module.exports = {
  async up (queryInterface, Sequelize) {
    await queryInterface.addColumn(
      'users', 
      'roleId', 
      { type:Sequelize.INTEGER,
        defaultValue:1,
        allowNull:false,
        references: {
          model: 'roles',
          key: 'id'
        }
      }
    )
  },

  async down (queryInterface, Sequelize) {
    await queryInterface.removeColumn('users', 'roleId');
  }
};
