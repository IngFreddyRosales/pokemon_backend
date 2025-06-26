const { Datatypes, Sequelize } = require('sequelize');

const { DataTypes } = require('sequelize');

module.exports = function (sequelize) {
    const AuthToken = sequelize.define("AuthToken", {
        user_id: {
            type: DataTypes.INTEGER,
            allowNull: false,
        },
        token: {
            type: DataTypes.STRING(255),
            allowNull: false,
        },
    });
    return AuthToken;
}