'use strict';
module.exports = (sequelize, DataTypes) => {
  const Review = sequelize.define('Review', {
    user_id: { type: DataTypes.INTEGER, allowNull: false },
    product_id: { type: DataTypes.INTEGER, allowNull: false },
    rating: { type: DataTypes.INTEGER, allowNull: false }, // validate 1..5 ở hooks/validators
    comment: DataTypes.TEXT,
  }, { tableName: 'review', timestamps: true });

  Review.associate = (models) => {
    Review.belongsTo(models.User, { foreignKey: 'user_id', as: 'user' });
    Review.belongsTo(models.Product, { foreignKey: 'product_id', as: 'product' });
  };
  return Review;
};
