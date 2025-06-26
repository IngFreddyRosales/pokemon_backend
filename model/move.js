// models/Move.js
const { DataTypes } = require('sequelize');

module.exports = function (sequelize) {
    const Move = sequelize.define("Move", {
        name: {
            type: DataTypes.STRING(100),
            allowNull: false,
            unique: true
        },
        typeId: {
            type: DataTypes.INTEGER,
            allowNull: false
        },
        category: {
            type: DataTypes.ENUM("physical", "special", "status"),
            allowNull: false
        },
        power: {
            type: DataTypes.INTEGER,
            allowNull: true
        },
        description: {
            type: DataTypes.TEXT,
            allowNull: true
        }
    });
    return Move;
};
