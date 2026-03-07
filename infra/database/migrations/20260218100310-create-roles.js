'use strict';

module.exports = {
  async up(queryInterface, Sequelize) {
    await queryInterface.createTable('roles', {
      id: {
        type: Sequelize.UUID,
        defaultValue: Sequelize.UUIDV4,
        primaryKey: true,
        allowNull: false,
      },

      name: {
        type: Sequelize.TEXT,
        allowNull: false,
        unique: true,
      },

      description: {
        type: Sequelize.TEXT,
      },
    });
  },

  async down(queryInterface) {
    await queryInterface.dropTable('roles');
  },
};
