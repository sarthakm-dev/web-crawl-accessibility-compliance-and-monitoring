'use strict';

module.exports = {
  async up(queryInterface, Sequelize) {
    await queryInterface.createTable('reports', {
      id: {
        type: Sequelize.UUID,
        primaryKey: true,
        allowNull: false,
      },

      site_id: {
        type: Sequelize.UUID,
        allowNull: false,
      },

      crawl_job_id: {
        type: Sequelize.UUID,
      },

      requested_by: {
        type: Sequelize.UUID,
      },

      report_type: {
        type: Sequelize.STRING,
      },

      status: {
        type: Sequelize.STRING,
      },

      filters: {
        type: Sequelize.JSONB,
      },

      bucket: {
        type: Sequelize.STRING,
      },

      object_key: {
        type: Sequelize.TEXT,
      },

      file_size: {
        type: Sequelize.BIGINT,
      },

      generated_at: {
        type: Sequelize.DATE,
      },

      created_at: {
        type: Sequelize.DATE,
        defaultValue: Sequelize.fn('NOW'),
      },
    });

    await queryInterface.addIndex('reports', ['site_id']);
    await queryInterface.addIndex('reports', ['crawl_job_id']);
  },

  async down(queryInterface) {
    await queryInterface.dropTable('reports');
  },
};
