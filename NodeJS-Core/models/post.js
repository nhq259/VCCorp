'use strict';
module.exports = (sequelize, DataTypes) => {
  const Post = sequelize.define('Post', {
    title: DataTypes.STRING,
    content: DataTypes.TEXT,
    image_url: DataTypes.STRING,
    status: { type: DataTypes.STRING, defaultValue: 'published' },
    admin_id: { type: DataTypes.INTEGER, allowNull: false },
    deleted: { type: DataTypes.BOOLEAN, defaultValue: false },
  }, { tableName: 'post', timestamps: true });

  Post.associate = (models) => {
    Post.belongsTo(models.Account, { foreignKey: 'admin_id', as: 'author' });
  };
  return Post;
};
