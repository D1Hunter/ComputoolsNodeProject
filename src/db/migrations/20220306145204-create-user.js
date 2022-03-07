'use strict';
module.exports = {
  async up(queryInterface, Sequelize) {
    await queryInterface.createTable('users', {
      id: {
        allowNull: false,
        autoIncrement: true,
        primaryKey: true,
        type: Sequelize.INTEGER
      },
      email: {
        type: Sequelize.STRING,
        unique:true
      },
      password:{
        type:Sequelize.STRING
      },
      firstName:{
        type:Sequelize.STRING
      },
      secondName:{
        type:Sequelize.STRING
      },
      isGoogleAccount:{
        type:Sequelize.BOOLEAN,
        defaultValue:false
      },
      activationLink:{
        type:Sequelize.STRING
      },
      createdAt: {
        allowNull: false,
        type: Sequelize.DATE
      },
      updatedAt: {
        allowNull: false,
        type: Sequelize.DATE
      }
    });
  },
  async down(queryInterface, Sequelize) {
    await queryInterface.dropTable('users');
  }
};