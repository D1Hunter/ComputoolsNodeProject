'use strict';
module.exports = {
  async up(queryInterface, Sequelize) {
    await queryInterface.createTable('team-request-approvements', {
      id: {
        type: Sequelize.INTEGER,
        primaryKey: true,
        autoIncrement: true,
        allowNull: false
      },
      teamRequestId: {
        type: Sequelize.INTEGER,
        allowNull:false,
        references: {
          model: 'team-requests',
          key: 'id'
        },
        onUpdate: 'CASCADE',
        onDelete: 'CASCADE'
      },
      fromTeamId: {
        type: Sequelize.INTEGER,
        allowNull:false,
        references: {
          model: 'teams',
          key: 'id'
        },
        onUpdate: 'CASCADE',
        onDelete: 'CASCADE'
      },
      fromTeamApprove: {
        type: Sequelize.BOOLEAN,
        allowNull:false
      },
      toTeamId: {
        type: Sequelize.INTEGER,
        allowNull:false,
        references: {
          model: 'teams',
          key: 'id'
        },
        onUpdate: 'CASCADE',
        onDelete: 'CASCADE'
      },
      toTeamApprove: {
        type: Sequelize.BOOLEAN,
        allowNull:false
      }
    });
  },
  async down(queryInterface, Sequelize) {
    await queryInterface.dropTable('team-request-approvements');
  }
};