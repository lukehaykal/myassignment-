module.exports = (sequelize, DataTypes) => {
  const Output = sequelize.define('Output', {
    title: { type: DataTypes.STRING, allowNull: false },
    html: { type: DataTypes.TEXT, allowNull: false },
    metadata: { type: DataTypes.JSON, allowNull: true }
  });
  return Output;
};
