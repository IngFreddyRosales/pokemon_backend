const db = require("../model/");

exports.requireUser = async (req, res, next) => {

    const authHeader = req.headers.authorization;
    if (!authHeader) {
        return res.status(401).send({ message: "No autorizado" });
    }
    const splitted = authHeader.split(" ");
    if (splitted.length !== 2 || splitted[0] !== "token") {
        return res.status(401).send({ message: "No autorizado" });
    }
    const token = splitted[1];

    if (!token) {
        return res.status(401).send({ message: "No autorizado" });
    }
    const authToken = await db.AuthToken.findOne({
        where: {
            token: token,
        },
    });
    if (!authToken) {
        return res.status(401).send({ message: "No autorizado" });
    }
    const usuario = await db.User.findOne({
        where: {
            id: authToken.user_id,
        },
    });
    if (!usuario) {
        return res.status(401).send({ message: "No autorizado" });
    }
    res.locals.usuario = usuario;

    next();
};