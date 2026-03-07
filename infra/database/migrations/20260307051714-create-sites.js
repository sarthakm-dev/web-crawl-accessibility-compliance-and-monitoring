'use strict';

module.exports = {
  async up(queryInterface, Sequelize) {
    await queryInterface.createTable('sites', {
      id: {
        type: Sequelize.UUID,
        defaultValue: Sequelize.UUIDV4,
        primaryKey: true,
        allowNull: false,
      },

      team_id: {
        type: Sequelize.UUID,
        allowNull: false,
        references: {
          model: 'teams',
          key: 'id',
        },
        onDelete: 'CASCADE',
      },

      name: {
        type: Sequelize.STRING,
        allowNull: false,
      },

      base_url: {
        type: Sequelize.TEXT,
        allowNull: false,
      },

      is_active: {
        type: Sequelize.BOOLEAN,
        defaultValue: true,
      },

      created_at: {
        type: Sequelize.DATE,
        allowNull: false,
        defaultValue: Sequelize.NOW,
      },
    });

    // Helpful index
    await queryInterface.addIndex('sites', ['team_id']);
  },

  async down(queryInterface) {
    await queryInterface.dropTable('sites');
  },
};
