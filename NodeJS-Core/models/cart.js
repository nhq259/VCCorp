'use strict';
module.exports = (sequelize, DataTypes) => {
  const Cart = sequelize.define('Cart', {
    user_id: { type: DataTypes.INTEGER, allowNull: false },
  }, { tableName: 'cart', timestamps: true });

  Cart.associate = (models) => {
    Cart.belongsTo(models.User, { foreignKey: 'user_id', as: 'user' });
    Cart.hasMany(models.CartItem, { foreignKey: 'cart_id', as: 'items' });
    Cart.hasMany(models.Order, { foreignKey: 'cart_id', as: 'orders' });
  };
  return Cart;
};
