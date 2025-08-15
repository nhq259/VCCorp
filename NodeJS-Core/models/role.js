'use strict';
module.exports = (sequelize, DataTypes) => {
  const Role = sequelize.define('Role', {
    title: DataTypes.STRING,
    description: DataTypes.TEXT,
    permissions: DataTypes.TEXT,
    deleted: { type: DataTypes.BOOLEAN, defaultValue: false },
  }, { tableName: 'role', timestamps: true });

  Role.associate = (models) => {
    Role.hasMany(models.Account, { foreignKey: 'role_id', as: 'accounts' });
  };
  return Role;
};
