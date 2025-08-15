
'use strict';
module.exports = (sequelize, DataTypes) => {
  const OrderItem = sequelize.define('OrderItem', {
    order_id: { type: DataTypes.INTEGER, allowNull: false },
    product_id: { type: DataTypes.INTEGER, allowNull: false },
    price: DataTypes.DECIMAL(10,2),
    discount_percentage: DataTypes.DECIMAL(5,2),
    quantity: DataTypes.INTEGER,
  }, { tableName: 'order_item', timestamps: true });

  OrderItem.associate = (models) => {
    OrderItem.belongsTo(models.Order, { foreignKey: 'order_id', as: 'order' });
    OrderItem.belongsTo(models.Product, { foreignKey: 'product_id', as: 'product' });
  };
  return OrderItem;
};
