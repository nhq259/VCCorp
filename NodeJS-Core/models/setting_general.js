'use strict';
module.exports = (sequelize, DataTypes) => {
  const SettingGeneral = sequelize.define('SettingGeneral', {
    website_name: DataTypes.STRING,
    logo: DataTypes.STRING,
    phone: DataTypes.STRING,
    email: DataTypes.STRING,
    address: DataTypes.STRING,
    copyright: DataTypes.STRING,
  }, { tableName: 'setting_general', timestamps: true });
  return SettingGeneral;
};
