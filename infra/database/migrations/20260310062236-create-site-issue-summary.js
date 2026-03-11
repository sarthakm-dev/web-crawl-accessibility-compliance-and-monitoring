'use strict';

/** @type {import('sequelize-cli').Migration} */
module.exports = {
  async up(queryInterface, Sequelize) {
    await queryInterface.createTable('site_issue_summary', {
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

    // Unique constraint for UPSERT logic
    await queryInterface.addConstraint('site_issue_summary', {
      fields: ['site_id', 'crawl_job_id'],
      type: 'unique',
      name: 'unique_site_issue_summary',
    });

    // Indexes for reporting queries
    await queryInterface.addIndex('site_issue_summary', ['site_id']);
    await queryInterface.addIndex('site_issue_summary', ['crawl_job_id']);
  },

  async down(queryInterface) {
    await queryInterface.dropTable('site_issue_summary');
  },
};
