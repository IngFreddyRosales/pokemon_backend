const { DataTypes } = require('sequelize');

module.exports = function (sequelize) {
    const Item =sequelize.define("Item", {
        name: {
            type: DataTypes.STRING,
            allowNull: false,
            unique: true,
            validate: {
                notEmpty: true,
            },
        },
        description: {
            type: DataTypes.STRING,
            allowNull: true
        },
        image: {
            type: DataTypes.STRING,
            allowNull: true,
            unique: true,
        }
    });
    return Item;
}