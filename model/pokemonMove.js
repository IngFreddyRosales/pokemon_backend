const { DataTypes } = require('sequelize');

module.exports = function (sequelize) {
    const PokemonMove = sequelize.define("PokemonMove", {
        pokemonId: {
            type: DataTypes.INTEGER,
            allowNull: false
        },
        moveId: {
            type: DataTypes.INTEGER,
            allowNull: false
        }
    }, {
        timestamps: false
    });
    return PokemonMove;
};
