const { DataTypes } = require('sequelize');

module.exports = function (sequelize) {
    const Nature = sequelize.define("Nature", {
        name: {
            type: DataTypes.STRING(50),
            allowNull: false,
            unique: true
        },
        increasedStatId: {
            type: DataTypes.INTEGER,
            allowNull: true
        },
        decreasedStatId: {
            type: DataTypes.INTEGER,
            allowNull: true
        }
    });
    return Nature;
};
