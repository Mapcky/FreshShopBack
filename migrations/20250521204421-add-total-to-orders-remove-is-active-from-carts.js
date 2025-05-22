'use strict';

module.exports = {
  up: async (queryInterface, Sequelize) => {
    // 1. Agregar columna 'total' a 'Orders'
    await queryInterface.addColumn('Orders', 'total', {
      type: Sequelize.DECIMAL(10, 2),
      allowNull: false,
      defaultValue: 0.00,
    });

    // 2. Eliminar columna 'is_active' de 'Carts'
    await queryInterface.removeColumn('Carts', 'is_active');
  },

  down: async (queryInterface, Sequelize) => {
    // 1. Revertir la eliminación de 'is_active'
    await queryInterface.addColumn('Carts', 'is_active', {
      type: Sequelize.BOOLEAN,
      allowNull: false,
      defaultValue: true,
    });

    // 2. Eliminar la columna 'total' de 'Orders'
    await queryInterface.removeColumn('Orders', 'total');
  },
};
