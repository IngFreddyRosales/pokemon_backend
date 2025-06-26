const { DataTypes } = require('sequelize');

module.exports = function (sequelize) {
    const Ability = sequelize.define("Ability", {
        name: {
            type: DataTypes.STRING,
            allowNull: false
        },
        description: {
            type: DataTypes.TEXT,
            allowNull: true
        },
        pokemonId: {
            type: DataTypes.INTEGER,
            allowNull: false
        }
    });
    return Ability;
};
