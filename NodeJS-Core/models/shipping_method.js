'use strict';
module.exports = (sequelize, DataTypes) => {
  const ShippingMethod = sequelize.define('ShippingMethod', {
    name: { type: DataTypes.STRING(100), allowNull: false },
    description: DataTypes.TEXT,
    cost: DataTypes.DECIMAL(10,2),
    estimated_days: DataTypes.INTEGER,
  }, { tableName: 'shipping_method', timestamps: true });

  ShippingMethod.associate = (models) => {
    ShippingMethod.hasMany(models.Order, { foreignKey: 'shipping_method_id', as: 'orders' });
  };
  return ShippingMethod;
};
