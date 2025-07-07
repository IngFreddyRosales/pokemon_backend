const db = require("../model/");

exports.requireUser = async (req, res, next) => {
    const authHeader = req.headers.authorization;

    if (!authHeader) {
        return res.status(401).send({ message: "No autorizado: Falta el encabezado de autorización" });
    }

    const splitted = authHeader.split(" ");
    if (splitted.length !== 2 || splitted[0] !== "token") {
        return res.status(401).send({ message: "No autorizado: Formato del token inválido. Debe ser 'token <tu_token>'" });
    }

    const token = splitted[1];
    if (!token) {
        return res.status(401).send({ message: "No autorizado: El token está vacío" });
    }

    const authToken = await db.AuthToken.findOne({
        where: {
            token: token,
        },
    });
    if (!authToken) {
        return res.status(401).send({ message: "No autorizado: El token no es válido o ha expirado" });
    }

    const usuario = await db.User.findOne({
        where: {
            id: authToken.user_id,
        },
    });
    if (!usuario) {
        return res.status(401).send({ message: "No autorizado: El usuario asociado al token no existe" });
    }

    res.locals.usuario = usuario;

    next();
};