const { DataTypes } = require('sequelize');

module.exports = function (sequelize) {
    const SelectedPokemonMove = sequelize.define("SelectedPokemonMove", {
        teamPokemonId: {
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
    return SelectedPokemonMove;
};
