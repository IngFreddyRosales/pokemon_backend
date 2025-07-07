// models/TeamPokemon.js
const { DataTypes } = require('sequelize');

module.exports = function (sequelize) {
    const TeamPokemon = sequelize.define("TeamPokemon", {
        teamId: {
            type: DataTypes.INTEGER,
            allowNull: false
        },
        pokemonId: {
            type: DataTypes.INTEGER,
            allowNull: false
        },
        nickname: {
            type: DataTypes.STRING(100),
            allowNull: true
        },
        itemId: {
            type: DataTypes.INTEGER,
            allowNull: true
        },
        abilityId: {
            type: DataTypes.INTEGER,
            allowNull: true
        },
        natureId: {
            type: DataTypes.INTEGER,
            allowNull: true
        },
        evHp: {
            type: DataTypes.INTEGER,
            allowNull: false,
            defaultValue: 0
        },  
        evAtk: {
            type: DataTypes.INTEGER,
            allowNull: false,
            defaultValue: 0
        },
        evDef: {
            type: DataTypes.INTEGER,
            allowNull: false,
            defaultValue: 0
        },
        evSpa: {
            type: DataTypes.INTEGER,
            allowNull: false,
            defaultValue: 0
        },
        evSpd: {
            type: DataTypes.INTEGER,
            allowNull: false,
            defaultValue: 0
        },
        evSpe: {
            type: DataTypes.INTEGER,
            allowNull: false,
            defaultValue: 0
        },
        ivHp: {
            type: DataTypes.INTEGER,
            allowNull: false,
            defaultValue: 0
        },
        ivAtk: {
            type: DataTypes.INTEGER,
            allowNull: false,
            defaultValue: 0
        },
        ivDef: {
            type: DataTypes.INTEGER,
            allowNull: false,
            defaultValue: 0
        },
        ivSpa: {
            type: DataTypes.INTEGER,
            allowNull: false,
            defaultValue: 0
        },
        ivSpd: {
            type: DataTypes.INTEGER,
            allowNull: false,
            defaultValue: 0
        },
        ivSpe: {
            type: DataTypes.INTEGER,
            allowNull: false,
            defaultValue: 0
        }
    });
    return TeamPokemon;
};
