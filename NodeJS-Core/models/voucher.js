'use strict';
module.exports = (sequelize, DataTypes) => {
  const Voucher = sequelize.define('Voucher', {
    code: { type: DataTypes.STRING(50), allowNull: false },
    discount_type: DataTypes.STRING(20), // percent | fixed
    discount_value: DataTypes.DECIMAL(10,2),
    start_date: DataTypes.DATE,
    end_date: DataTypes.DATE,
    usage_limit: DataTypes.INTEGER,
  }, { tableName: 'voucher', timestamps: true });

  Voucher.associate = (models) => {
    Voucher.hasMany(models.Order, { foreignKey: 'voucher_id', as: 'orders' });
  };
  return Voucher;
};
