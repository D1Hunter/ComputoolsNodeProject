'use strict';
module.exports = {
  async up(queryInterface, Sequelize) {
    await queryInterface.createTable('users', {
      id: {
        type: Sequelize.INTEGER,
        primaryKey: true,
        autoIncrement: true,
        allowNull: false
      },
      email: {
        type: Sequelize.STRING,
        unique:true
      },
      login:{
        type: Sequelize.STRING,
        allowNull:false
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
      }
    });
  },
  async down(queryInterface, Sequelize) {
    await queryInterface.dropTable('users');
  }
};