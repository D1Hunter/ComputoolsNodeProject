'use strict';
module.exports = {
  async up(queryInterface, Sequelize) {
    await queryInterface.createTable('users', {
      id: {
        type: Sequelize.INTEGER,
        primaryKey: true,
        autoIncrement: true
      },
      email: {
        type: Sequelize.STRING,
        unique:true
      },
      login:{
        type: Sequelize.STRING,
        allowNull:false
      },
      avatar:{
        type: Sequelize.STRING
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
      roleId:{
        type:Sequelize.INTEGER,
        defaultValue:1,
        references: {
          model: 'roles',
          key: 'id'
        },
        allowNull:false
      },
      teamId:{
        type:Sequelize.INTEGER,
        references: {
          model: 'teams',
          key: 'id'
        },
      }
    });
  },
  async down(queryInterface, Sequelize) {
    await queryInterface.dropTable('users');
  }
};