'use strict';
module.exports = (sequelize, DataTypes) => {
  const Chat = sequelize.define('Chat', {
    user_id: { type: DataTypes.INTEGER, allowNull: false },
    admin_id: { type: DataTypes.INTEGER, allowNull: false },
    content: DataTypes.TEXT,
    images: DataTypes.TEXT, // JSON string nếu cần
    deleted: { type: DataTypes.BOOLEAN, defaultValue: false },
  }, { tableName: 'chat', timestamps: true });

  Chat.associate = (models) => {
    Chat.belongsTo(models.User, { foreignKey: 'user_id', as: 'user' });
    Chat.belongsTo(models.Account, { foreignKey: 'admin_id', as: 'admin' });
  };
  return Chat;
};
