const { DataTypes } = require('sequelize');

module.exports = function (sequelize) {
    const Pokemon = sequelize.define("Pokemon", {
        name: {
            type: DataTypes.STRING(100),
            allowNull: false,
            unique: true
        },
        image: {
            type: DataTypes.STRING(255),
            allowNull: false
        },
        type1Id: {
            type: DataTypes.INTEGER,
            allowNull: false
        },
        type2Id: {
            type: DataTypes.INTEGER,
            allowNull: true
        },
        hp: {
            type: DataTypes.INTEGER,
            allowNull: false
        },
        attack: {
            type: DataTypes.INTEGER,
            allowNull: false
        },
        defense: {
            type: DataTypes.INTEGER,
            allowNull: false
        },
        specialAttack: {
            type: DataTypes.INTEGER,
            allowNull: false
        },
        specialDefense: {
            type: DataTypes.INTEGER,
            allowNull: false
        },
        speed: {
            type: DataTypes.INTEGER,
            allowNull: false
        }
    });
    return Pokemon;
};
