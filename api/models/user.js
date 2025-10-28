module.exports = (sequelize, DataTypes) => {
  const User = sequelize.define('User', {
    name: { type: DataTypes.STRING, allowNull: false },
    lineStatus: { type: DataTypes.ENUM('online','offline'), defaultValue: 'offline' }
  });
  return User;
};
