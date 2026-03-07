'use strict';

module.exports = {
  async up(queryInterface, Sequelize) {
    await queryInterface.createTable('issue_notes', {
      id: {
        type: Sequelize.UUID,
        defaultValue: Sequelize.UUIDV4,
        primaryKey: true,
        allowNull: false,
      },

      issue_instance_id: {
        type: Sequelize.UUID,
        allowNull: false,
        references: {
          model: 'issue_instances',
          key: 'id',
        },
        onDelete: 'CASCADE',
      },

      user_id: {
        type: Sequelize.UUID,
        allowNull: false,
        references: {
          model: 'users',
          key: 'id',
        },
        onDelete: 'CASCADE',
      },

      note: {
        type: Sequelize.TEXT,
        allowNull: false,
      },

      created_at: {
        type: Sequelize.DATE,
        defaultValue: Sequelize.NOW,
      },
    });

    // Recommended index
    await queryInterface.addIndex('issue_notes', ['issue_instance_id']);
  },

  async down(queryInterface) {
    await queryInterface.dropTable('issue_notes');
  },
};
