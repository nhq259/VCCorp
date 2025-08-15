'use strict';
module.exports = (sequelize, DataTypes) => {
  const Statistic = sequelize.define('Statistic', {
    date: { type: DataTypes.DATEONLY, allowNull: false },
    total_orders: { type: DataTypes.INTEGER, defaultValue: 0 },
    total_revenue: { type: DataTypes.DECIMAL(15,2), defaultValue: 0.00 },
    total_profit: { type: DataTypes.DECIMAL(15,2), defaultValue: 0.00 },
    total_stock: { type: DataTypes.INTEGER, defaultValue: 0 },
  }, { tableName: 'statistic', timestamps: true });
  return Statistic;
};
