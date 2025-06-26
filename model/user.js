const { DataTypes } = require('sequelize');

module.exports = function (sequelize) {
    const User = sequelize.define("User",  {
        name: {
            type: DataTypes.STRING(255),
            allowNull: false,
            unique: true
        },
        email: {
            type: DataTypes.STRING(255),
            allowNull: false,
            unique: true,
            validate: {
                isEmail: true
            }
        },
        password: {
            type: DataTypes.STRING(255),
            allowNull: false,
            validate: {
                len: [6, 255]
            }
        },
        is_admin: {
            type: DataTypes.BOOLEAN,
            defaultValue: false
        }
    });

    return User;
}