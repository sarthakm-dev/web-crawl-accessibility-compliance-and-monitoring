'use strict';

module.exports = {
  async up(queryInterface, Sequelize) {
    await queryInterface.createTable('page_versions', {
      id: {
        type: Sequelize.UUID,
        defaultValue: Sequelize.UUIDV4,
        primaryKey: true,
        allowNull: false,
      },

      page_id: {
        type: Sequelize.UUID,
        allowNull: false,
        references: {
          model: 'pages',
          key: 'id',
        },
        onDelete: 'CASCADE',
      },

      crawl_job_id: {
        type: Sequelize.UUID,
        allowNull: false,
        references: {
          model: 'crawl_jobs',
          key: 'id',
        },
        onDelete: 'CASCADE',
      },

      http_status: {
        type: Sequelize.INTEGER,
      },

      content_hash: {
        type: Sequelize.TEXT,
      },

      title: {
        type: Sequelize.TEXT,
      },

      content_size: {
        type: Sequelize.INTEGER,
      },

      html_content: {
        type: Sequelize.TEXT,
        allowNull: true,
      },

      crawled_at: {
        type: Sequelize.DATE,
        defaultValue: Sequelize.NOW,
      },

      analysis_status: {
        type: Sequelize.ENUM('pending', 'completed', 'failed'),
        allowNull: false,
        defaultValue: 'pending',
      },
    });

    // Unique constraint from model
    await queryInterface.addConstraint('page_versions', {
      fields: ['page_id', 'content_hash'],
      type: 'unique',
      name: 'unique_page_content_hash',
    });

    // Helpful indexes
    await queryInterface.addIndex('page_versions', ['page_id']);
    await queryInterface.addIndex('page_versions', ['crawl_job_id']);
  },

  async down(queryInterface, Sequelize) {
    await queryInterface.dropTable('page_versions');

    // Remove ENUM type (important in Postgres)
    await queryInterface.sequelize.query(
      'DROP TYPE IF EXISTS "enum_page_versions_analysis_status";'
    );
  },
};
