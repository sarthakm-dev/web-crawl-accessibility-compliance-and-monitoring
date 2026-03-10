'use strict';
module.exports = {
  async up(queryInterface, Sequelize) {
    await queryInterface.createTable('issue_analytics', {
      id: {
        type: Sequelize.UUID,
        primaryKey: true,
        allowNull: false,
      },

      site_id: {
        type: Sequelize.UUID,
        allowNull: false,
      },

      page_id: {
        type: Sequelize.UUID,
        allowNull: false,
      },

      page_url: {
        type: Sequelize.TEXT,
        allowNull: false,
      },

      crawl_job_id: {
        type: Sequelize.UUID,
      },

      page_version_id: {
        type: Sequelize.UUID,
        allowNull: false,
      },

      issue_instance_id: {
        type: Sequelize.UUID,
        allowNull: false,
      },

      issue_definition_id: {
        type: Sequelize.UUID,
        allowNull: false,
      },

      rule_id: Sequelize.TEXT,
      rule_description: Sequelize.TEXT,
      wcag_rule: Sequelize.TEXT,

      severity: Sequelize.TEXT,

      selector: Sequelize.TEXT,
      message: Sequelize.TEXT,

      status: Sequelize.TEXT,

      detected_at: Sequelize.DATE,

      created_at: {
        type: Sequelize.DATE,
        defaultValue: Sequelize.fn('NOW'),
      },
    });

    await queryInterface.addIndex('issue_analytics', ['site_id']);
    await queryInterface.addIndex('issue_analytics', ['crawl_job_id']);
    await queryInterface.addIndex('issue_analytics', ['severity']);
  },

  async down(queryInterface) {
    await queryInterface.dropTable('issue_analytics');
  },
};
