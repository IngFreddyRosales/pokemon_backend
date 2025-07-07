const db = require('../model');
const User = db.User;
const { generatePassword } = require('../utils/auth.utils');

exports.findAll = async (req , res ) => {
    try {
        const users = await User.findAll();

        if (!users || users.length === 0) {
            return res.status(404).send({ message: "No se encontraron usuarios" });
        }

        res.json(users)
    }catch (error) {
        console.error("Error fetching users: ", error);
        res.status(500).send({ message: "Error al obtener los usuarios" });
    }
}

exports.updateUser = async (req, res) => {
    const { id } = req.params;
    const { name, email, password , is_admin } = req.body;

    const hashedPassword = password ? generatePassword(password) : undefined;
    console.log("contrasenia sin encriptar: ", password)
    console.log("contrasenia encriptada: ", hashedPassword)
    try{

        const user = await User.findByPk(id);
        if (!user) {
            return res.status(404).send({ message: "Usuario no encontrado" });
        }

        // Update user details
        user.name = name || user.name;
        user.email = email || user.email;
        if (hashedPassword) {
            user.password = hashedPassword;
        }
        user.is_admin = is_admin !== undefined ? is_admin : user.is_admin;

        await user.save();

        res.send({
            message: "Usuario actualizado exitosamente",
            user: {
                id: user.id,
                name: user.name,
                email: user.email,
                is_admin: user.is_admin,
            },
        });

    }catch (error) {
        console.error("Error updating user: ", error);
        res.status(500).send({ message: "Error al actualizar el usuario" });
    }
}
