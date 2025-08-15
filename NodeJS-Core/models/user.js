'use strict';
module.exports = (sequelize, DataTypes) => {
  const User = sequelize.define('User', {
    full_name: DataTypes.STRING,
    email: { type: DataTypes.STRING, allowNull: false },
    password: DataTypes.STRING,
    token_user: DataTypes.STRING,
    phone: DataTypes.STRING,
    avatar: DataTypes.STRING,
    status: { type: DataTypes.STRING, defaultValue: 'active' },
    status_online: DataTypes.STRING,
    deleted: { type: DataTypes.BOOLEAN, defaultValue: false },
  }, { tableName: 'user', timestamps: true });

  User.associate = (models) => {
    User.hasOne(models.Cart, { foreignKey: 'user_id', as: 'cart' });
    User.hasMany(models.Chat, { foreignKey: 'user_id', as: 'chats' });
    User.hasMany(models.Review, { foreignKey: 'user_id', as: 'reviews' });
  };
  return User;
};
