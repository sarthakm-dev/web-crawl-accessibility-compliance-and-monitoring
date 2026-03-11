'use strict';

module.exports = {
  async up(queryInterface, Sequelize) {
    await queryInterface.createTable('page_issue_summary', {
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

      total_issues: {
        type: Sequelize.INTEGER,
        defaultValue: 0,
      },

      critical_count: {
        type: Sequelize.INTEGER,
        defaultValue: 0,
      },

      serious_count: {
        type: Sequelize.INTEGER,
        defaultValue: 0,
      },

      moderate_count: {
        type: Sequelize.INTEGER,
        defaultValue: 0,
      },

      minor_count: {
        type: Sequelize.INTEGER,
        defaultValue: 0,
      },

      created_at: {
        type: Sequelize.DATE,
        defaultValue: Sequelize.fn('NOW'),
      },

      updated_at: {
        type: Sequelize.DATE,
        defaultValue: Sequelize.fn('NOW'),
      },
    });

    // Unique constraint for UPSERT operations
    await queryInterface.addConstraint('page_issue_summary', {
      fields: ['site_id', 'page_id', 'crawl_job_id'],
      type: 'unique',
      name: 'unique_page_issue_summary',
    });

    // Indexes for reporting queries
    await queryInterface.addIndex('page_issue_summary', ['site_id']);
    await queryInterface.addIndex('page_issue_summary', ['crawl_job_id']);
    await queryInterface.addIndex('page_issue_summary', ['page_id']);
  },

  async down(queryInterface) {
    await queryInterface.dropTable('page_issue_summary');
  },
};
