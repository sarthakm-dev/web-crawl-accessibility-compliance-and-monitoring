'use strict';

module.exports = {
  async up(queryInterface, Sequelize) {
    await queryInterface.createTable('crawl_jobs', {
      id: {
        type: Sequelize.UUID,
        defaultValue: Sequelize.UUIDV4,
        primaryKey: true,
      },

      site_id: {
        type: Sequelize.UUID,
        allowNull: false,
      },

      status: {
        type: Sequelize.STRING,
        defaultValue: 'pending',
      },

      trigger_type: {
        type: Sequelize.STRING,
      },

      requested_by: {
        type: Sequelize.UUID,
      },

      started_at: {
        type: Sequelize.DATE,
      },

      completed_at: {
        type: Sequelize.DATE,
      },

      created_at: {
        type: Sequelize.DATE,
        allowNull: false,
        defaultValue: Sequelize.NOW,
      },
    });
  },

  async down(queryInterface) {
    await queryInterface.dropTable('crawl_jobs');
  },
};
