'use strict';

module.exports = {
  async up(queryInterface, Sequelize) {
    await queryInterface.createTable('pages', {
      id: {
        type: Sequelize.UUID,
        defaultValue: Sequelize.UUIDV4,
        primaryKey: true,
        allowNull: false,
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

      url: {
        type: Sequelize.TEXT,
        allowNull: false,
      },

      first_discovered_at: {
        type: Sequelize.DATE,
      },

      last_seen_at: {
        type: Sequelize.DATE,
      },

      status: {
        type: Sequelize.STRING,
      },
    });

    // Unique constraint from model
    await queryInterface.addConstraint('pages', {
      fields: ['site_id', 'url'],
      type: 'unique',
      name: 'unique_site_url',
    });

    // Helpful index
    await queryInterface.addIndex('pages', ['site_id']);
  },

  async down(queryInterface) {
    await queryInterface.dropTable('pages');
  },
};
