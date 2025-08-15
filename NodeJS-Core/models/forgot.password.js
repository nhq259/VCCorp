'use strict';
module.exports = (sequelize, DataTypes) => {
  const ForgotPassword = sequelize.define('ForgotPassword', {
    email: DataTypes.STRING,
    otp: DataTypes.STRING,
    expire_at: DataTypes.DATE,
  }, { tableName: 'forgot_password', timestamps: true });
  return ForgotPassword;
};
