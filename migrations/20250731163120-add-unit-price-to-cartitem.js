'use strict';

module.exports = {
  async up(queryInterface, Sequelize) {
    await queryInterface.addColumn('CartItems', 'unit_price', {
      type: Sequelize.DECIMAL(10, 2),
      allowNull: false,
      defaultValue: 0.00
    });
  },

  async down(queryInterface, Sequelize) {
    await queryInterface.removeColumn('CartItems', 'unit_price');
  }
};
