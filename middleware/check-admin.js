const db = require("../model");

exports.checkAdmin = async (req, res, next) => {

    const usuario = res.locals.usuario;
    if (!usuario) {
        return res.status(401).send({ message: "No autorizado" });
    }
    if (!usuario.is_admin) {
        return res.status(403).send({ message: "Acceso denegado" });
    }

    next();
};