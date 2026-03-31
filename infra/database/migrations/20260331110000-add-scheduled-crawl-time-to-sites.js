'use strict';

module.exports = {
  async up(queryInterface, Sequelize) {
    await queryInterface.addColumn('sites', 'scheduled_crawl_time', {
      type: Sequelize.STRING(5),
      allowNull: true,
    });
  },

  async down(queryInterface) {
    await queryInterface.removeColumn('sites', 'scheduled_crawl_time');
  },
};
