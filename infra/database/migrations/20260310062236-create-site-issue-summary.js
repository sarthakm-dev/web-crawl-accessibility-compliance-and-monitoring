'use strict';

/** @type {import('sequelize-cli').Migration} */
module.exports = {
  async up(queryInterface, Sequelize) {
    await queryInterface.createTable('site_issue_summary', {
      id: {
        type: Sequelize.UUID,
        primaryKey: true,
      },

      site_id: {
        type: Sequelize.UUID,
        allowNull: false,
      },

      crawl_job_id: {
        type: Sequelize.UUID,
      },

      total_issues: Sequelize.INTEGER,

      critical_count: Sequelize.INTEGER,

      serious_count: Sequelize.INTEGER,

      moderate_count: Sequelize.INTEGER,

      minor_count: Sequelize.INTEGER,

      created_at: {
        type: Sequelize.DATE,
        defaultValue: Sequelize.fn('NOW'),
      },
    });
  },

  async down(queryInterface) {
    await queryInterface.dropTable('site_issue_summary');
  },
};
