'use strict';
module.exports = (sequelize, DataTypes) => {
  const CartItem = sequelize.define('CartItem', {
    cart_id: { type: DataTypes.INTEGER, allowNull: false },
    product_id: { type: DataTypes.INTEGER, allowNull: false },
    quantity: { type: DataTypes.INTEGER, defaultValue: 1 },
  }, { tableName: 'cart_item', timestamps: true });

  CartItem.associate = (models) => {
    CartItem.belongsTo(models.Cart, { foreignKey: 'cart_id', as: 'cart' });
    CartItem.belongsTo(models.Product, { foreignKey: 'product_id', as: 'product' });
  };
  return CartItem;
};
