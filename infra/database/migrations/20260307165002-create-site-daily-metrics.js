'use strict';

module.exports = {
  async up(queryInterface, Sequelize) {
    await queryInterface.createTable('site_daily_metrics', {
      id: {
        type: Sequelize.UUID,
        primaryKey: true,
        allowNull: false,
        defaultValue: Sequelize.UUIDV4,
      },

      site_id: {
        type: Sequelize.UUID,
        allowNull: false,
        references: {
          model: 'sites',
          key: 'id',
        },
        onDelete: 'CASCADE',
      },

      date: {
        type: Sequelize.DATEONLY,
        allowNull: false,
      },

      pages_crawled: {
        type: Sequelize.INTEGER,
        defaultValue: 0,
      },

      total_issues: {
        type: Sequelize.INTEGER,
        defaultValue: 0,
      },

      critical_issues: {
        type: Sequelize.INTEGER,
        defaultValue: 0,
      },

      serious_issues: {
        type: Sequelize.INTEGER,
        defaultValue: 0,
      },

      moderate_issues: {
        type: Sequelize.INTEGER,
        defaultValue: 0,
      },

      minor_issues: {
        type: Sequelize.INTEGER,
        defaultValue: 0,
      },

      accessibility_score: {
        type: Sequelize.FLOAT,
        defaultValue: 100,
      },

      created_at: {
        type: Sequelize.DATE,
        allowNull: false,
        defaultValue: Sequelize.NOW,
      },

      updated_at: {
        type: Sequelize.DATE,
        allowNull: false,
        defaultValue: Sequelize.NOW,
      },
    });

    await queryInterface.addIndex('site_daily_metrics', ['site_id', 'date'], {
      unique: true,
      name: 'unique_site_daily_metrics',
    });
  },

  async down(queryInterface) {
    await queryInterface.dropTable('site_daily_metrics');
  },
};
