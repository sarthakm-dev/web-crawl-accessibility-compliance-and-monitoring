'use strict';

module.exports = {
  async up(queryInterface, Sequelize) {
    await queryInterface.createTable('issue_status_history', {
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

      previous_status: {
        type: Sequelize.STRING,
      },

      new_status: {
        type: Sequelize.STRING,
      },

      changed_by: {
        type: Sequelize.UUID,
        references: {
          model: 'users',
          key: 'id',
        },
        allowNull: true,
      },

      changed_at: {
        type: Sequelize.DATE,
      },

      note: {
        type: Sequelize.TEXT,
      },
    });

    await queryInterface.addIndex('issue_status_history', [
      'issue_instance_id',
    ]);
  },

  async down(queryInterface) {
    await queryInterface.dropTable('issue_status_history');
  },
};
