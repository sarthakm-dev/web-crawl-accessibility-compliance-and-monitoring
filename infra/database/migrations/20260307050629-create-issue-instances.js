'use strict';

module.exports = {
  async up(queryInterface, Sequelize) {
    await queryInterface.createTable('issue_instances', {
      id: {
        type: Sequelize.UUID,
        defaultValue: Sequelize.UUIDV4,
        primaryKey: true,
        allowNull: false,
      },

      page_version_id: {
        type: Sequelize.UUID,
        allowNull: false,
        references: {
          model: 'page_versions',
          key: 'id',
        },
        onDelete: 'CASCADE',
      },

      issue_definition_id: {
        type: Sequelize.UUID,
        allowNull: false,
        references: {
          model: 'issue_definitions',
          key: 'id',
        },
        onDelete: 'CASCADE',
      },

      element_selector: {
        type: Sequelize.TEXT,
      },

      message: {
        type: Sequelize.TEXT,
      },

      impact: {
        type: Sequelize.STRING,
      },

      first_detected_at: {
        type: Sequelize.DATE,
      },

      current_status: {
        type: Sequelize.STRING,
        allowNull: false,
      },
    });
  },

  async down(queryInterface) {
    await queryInterface.dropTable('issue_instances');
  },
};
