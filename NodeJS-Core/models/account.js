'use strict';
module.exports = (sequelize, DataTypes) => {
  const Account = sequelize.define('Account', {
    full_name: DataTypes.STRING,
    email: { type: DataTypes.STRING, allowNull: false },
    password: DataTypes.STRING,
    token: DataTypes.STRING,
    phone: DataTypes.STRING,
    avatar: DataTypes.STRING,
    role_id: DataTypes.INTEGER,
    status: DataTypes.STRING,
    deleted: { type: DataTypes.BOOLEAN, defaultValue: false },
  }, { tableName: 'account', timestamps: true });

  Account.associate = (models) => {
    Account.belongsTo(models.Role, { foreignKey: 'role_id', as: 'role' });
    Account.hasMany(models.Post, { foreignKey: 'admin_id', as: 'posts' });
    Account.hasMany(models.Chat, { foreignKey: 'admin_id', as: 'chats' });
  };
  return Account;
};
