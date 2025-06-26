const { DataTypes } = require('sequelize');

module.exports = function (sequelize) {
    const Type = sequelize.define("Type", {
        name: {
            type: DataTypes.STRING(50),
            allowNull: false,
            unique: true
        }
    });
    return Type;
};
