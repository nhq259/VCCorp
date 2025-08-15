'use strict';
module.exports = (sequelize, DataTypes) => {
  const Order = sequelize.define('Order', {
    cart_id: DataTypes.INTEGER,
    full_name: DataTypes.STRING,
    phone: DataTypes.STRING,
    address: DataTypes.STRING,
    voucher_id: DataTypes.INTEGER,
    shipping_method_id: DataTypes.INTEGER,
    deleted: { type: DataTypes.BOOLEAN, defaultValue: false },
  }, { tableName: 'order', timestamps: true });

  Order.associate = (models) => {
    Order.belongsTo(models.Cart, { foreignKey: 'cart_id', as: 'cart' });
    Order.belongsTo(models.Voucher, { foreignKey: 'voucher_id', as: 'voucher' });
    Order.belongsTo(models.ShippingMethod, { foreignKey: 'shipping_method_id', as: 'shippingMethod' });
    Order.hasMany(models.OrderItem, { foreignKey: 'order_id', as: 'items' });
  };
  return Order;
};
