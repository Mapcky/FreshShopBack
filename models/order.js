'use strict';
const {
  Model
} = require('sequelize');
module.exports = (sequelize, DataTypes) => {
  class Order extends Model {
    /**
     * Helper method for defining associations.
     * This method is not a part of Sequelize lifecycle.
     * The `models/index` file will call this method automatically.
     */
    static associate(models) {
      Order.belongsTo(models.User, { foreignKey: "user_id" });
      Order.hasMany(models.OrderItem, { foreignKey: "order_id", as: "orderItems" });

    }
  }
  Order.init({
    user_id: DataTypes.INTEGER,
    status: {
      type: DataTypes.ENUM("pending", "shipped", "delivered", "cancelled"),
      allowNull: false,
      defaultValue: "pending"
    },
    total: {
      type: DataTypes.DECIMAL(10, 2),
      allowNull: false,
      defaultValue: 0.00,
    }
  }, {
    sequelize,
    modelName: 'Order',
  });
  return Order;
};