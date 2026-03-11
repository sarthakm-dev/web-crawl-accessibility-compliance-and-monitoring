'use strict';

module.exports = {
  async up(queryInterface, Sequelize) {
    await queryInterface.createTable('issue_analytics', {
      id: {
        type: Sequelize.UUID,
        primaryKey: true,
        allowNull: false,
        defaultValue: Sequelize.literal('gen_random_uuid()'),
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
        allowNull: false,
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

      severity: {
        type: Sequelize.TEXT,
        allowNull: false,
      },

      selector: Sequelize.TEXT,

      message: Sequelize.TEXT,

      status: {
        type: Sequelize.TEXT,
        allowNull: false,
      },

      detected_at: Sequelize.DATE,

      created_at: {
        type: Sequelize.DATE,
        defaultValue: Sequelize.fn('NOW'),
      },
    });

    // Indexes for reporting queries
    await queryInterface.addIndex('issue_analytics', ['site_id']);
    await queryInterface.addIndex('issue_analytics', ['crawl_job_id']);
    await queryInterface.addIndex('issue_analytics', ['page_id']);
    await queryInterface.addIndex('issue_analytics', ['page_version_id']);
    await queryInterface.addIndex('issue_analytics', ['severity']);

    // Prevent duplicate issue ingestion
    await queryInterface.addConstraint('issue_analytics', {
      fields: ['issue_instance_id'],
      type: 'unique',
      name: 'unique_issue_instance',
    });
  },

  async down(queryInterface) {
    await queryInterface.dropTable('issue_analytics');
  },
};
