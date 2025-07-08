'use strict';
const {
  Model
} = require('sequelize');
module.exports = (sequelize, DataTypes) => {
  class Deal extends Model {
    /**
     * Helper method for defining associations.
     * This method is not a part of Sequelize lifecycle.
     * The `models/index` file will call this method automatically.
     */
    static associate(models) {
      Deal.hasMany(models.DealItem, { foreignKey: 'deal_id', as: 'items' });
    }
  }
  Deal.init({
    name: DataTypes.STRING,
    starting_date: DataTypes.DATE,
    finish_date: DataTypes.DATE,
    type: DataTypes.ENUM('PERCENT', 'FIXED_PRICE')
  }, {
    sequelize,
    modelName: 'Deal',
  });
  return Deal;
};