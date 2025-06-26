const { DataTypes } = require('sequelize');

module.exports = function (sequelize) {
    const Stat = sequelize.define("Stat", {
        name: {
            type: DataTypes.STRING(50),
            allowNull: false,
            unique: true
        }
    });
    return Stat;
};
