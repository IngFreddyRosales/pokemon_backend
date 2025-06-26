const db = require('../model');
const {generateAuthToken, generatePassword} = require('../utils/auth.utils');

exports.register = async (req, res) => {
    const { name, email, password} = req.body;
    if (!name || !email || !password) {
        return res.status(400).send({ message: "Faltan datos" });
    }

    const existingUser = await db.User.findOne({
        where: {
            email: email,
        },
    });

    if (existingUser) {
        return res.status(400).send({ message: "Correo invalido" });
    }

    const hashedPassword = generatePassword(password);
    console.log("Hashed Password: ", hashedPassword);
    
    try{
        const user = await db.User.create({
            name: req.body.name,
            email: email,
            password: hashedPassword,
            is_admin: req.body.is_admin || false,
        });

        res.send({
            message: "Usuario creado exitosamente",
            user: {
                id: user.id,
                name: user.name,
                email: user.email,
                is_admin: user.is_admin,
            },
        })
    }catch (error) {
        console.error("Error creating user: ", error);
        res.status(500).send({ message: "Error al crear el usuario" });
    }
}

exports.login = async (req, res) => {
    const { name, password } = req.body;

    if (!name || !password) {
        return res.status(400).send({ message: "Faltan datos" });
    }

    const user = await db.User.findOne({
        where: {
            name: name,
        }
    })

    if (!user) {
        return res.status(400).send({ message: "Correo no encontrado" });
    }

    const hashedPassword = generatePassword(password);
    if (user.password !== hashedPassword){
        return res.status(400).send({ message: "Contraseña incorrecta" });
    }

    console.log("User found:",  user.name);
    try{
        const authToken = await db.AuthToken.create({
            user_id: user.id,
            token: generateAuthToken(user.id),
        });

        console.log("Auth Token created:", authToken);

        res.send({
            token: authToken.token
        });
    }catch (error) {
        console.error("Error creating auth token: ", error);
        res.status(500).send({ message: "Error al iniciar sesión" });
    }
}

exports.me = async (req, res) => {
    const user = res.locals.usuario;

    if (!user) {
        return res.status(401).send({ message: "No autorizado" });
    }

    res.send({
        id: user.id,
        name: user.name,
        email: user.email,
        is_admin: user.is_admin,
    });
}