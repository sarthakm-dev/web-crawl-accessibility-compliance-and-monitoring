'use strict';

module.exports = {
  async up(queryInterface, Sequelize) {
    await queryInterface.createTable('crawl_queue', {
      id: {
        type: Sequelize.UUID,
        defaultValue: Sequelize.UUIDV4,
        primaryKey: true,
        allowNull: false,
      },

      crawl_job_id: {
        type: Sequelize.UUID,
        allowNull: false,
      },

      url: {
        type: Sequelize.TEXT,
        allowNull: false,
      },

      status: {
        type: Sequelize.STRING,
        defaultValue: 'pending',
      },

      discovered_from: {
        type: Sequelize.TEXT,
        allowNull: true,
      },

      retry_count: {
        type: Sequelize.INTEGER,
        defaultValue: 0,
      },

      created_at: {
        type: Sequelize.DATE,
        allowNull: false,
        defaultValue: Sequelize.NOW,
      },
    });
  },

  async down(queryInterface) {
    await queryInterface.dropTable('crawl_queue');
  },
};
