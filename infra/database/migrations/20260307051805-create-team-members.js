'use strict';

module.exports = {
  async up(queryInterface, Sequelize) {
    await queryInterface.createTable('team_members', {
      team_id: {
        type: Sequelize.UUID,
        allowNull: false,
        primaryKey: true,
        references: {
          model: 'teams',
          key: 'id',
        },
        onDelete: 'CASCADE',
      },

      user_id: {
        type: Sequelize.UUID,
        allowNull: false,
        primaryKey: true,
        references: {
          model: 'users',
          key: 'id',
        },
        onDelete: 'CASCADE',
      },
    });

    await queryInterface.addIndex('team_members', ['team_id']);
    await queryInterface.addIndex('team_members', ['user_id']);
  },

  async down(queryInterface) {
    await queryInterface.dropTable('team_members');
  },
};
