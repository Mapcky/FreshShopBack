'use strict';
const {
  Model
} = require('sequelize');
module.exports = (sequelize, DataTypes) => {
  class DealItem extends Model {
    /**
     * Helper method for defining associations.
     * This method is not a part of Sequelize lifecycle.
     * The `models/index` file will call this method automatically.
     */
    static associate(models) {
      DealItem.belongsTo(models.Deal, { foreignKey: 'deal_id'});
      DealItem.belongsTo(models.Product, { foreignKey: 'product_id'});
    }
  }
  DealItem.init({
    deal_id: DataTypes.INTEGER,
    product_id: DataTypes.INTEGER,
    value: DataTypes.DECIMAL
  }, {
    sequelize,
    modelName: 'DealItem',
  });
  return DealItem;
};