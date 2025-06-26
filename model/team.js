const { DataTypes } = require('sequelize');

module.exports = function (sequelize) {
    const Team = sequelize.define("Team", {
        name: {
            type: DataTypes.STRING,
            allowNull: false
        },
        userId: {
            type: DataTypes.INTEGER,
            allowNull: false
        }
  });
  return Team;
};
