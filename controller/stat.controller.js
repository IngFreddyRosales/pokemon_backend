const db = require('../model');
const Stat = db.Stat;

exports.createStat = async (req, res) => {
    const { name } = req.body;

    if (!name) {
        return res.status(400).send({ message: "El nombre es obligatorio" });
    }

    try {
        const existingStat = await Stat.findOne({ where: { name } });

        if (existingStat) {
            return res.status(400).send({ message: "La estadística ya existe" });
        }

        const newStat = await Stat.create({ name });
        res.status(201).send(newStat);
    } catch (error) {
        console.error("Error al crear la estadística:", error);
        return res.status(500).send({ message: "Error al crear la estadística" });
    }
}

exports.getAllStats = async (req, res) => {
    try {
        const stats = await Stat.findAll();
        res.send(stats);
    } catch (error) {
        console.error("Error al obtener las estadísticas:", error);
        return res.status(500).send({ message: "Error al obtener las estadísticas" });
    }
};

exports.updateStat = async (req, res) => {
    const { id } = req.params;
    const { name } = req.body;

    if (!name) {
        return res.status(400).send({ message: "El nombre es obligatorio" });
    }

    try {
        const stat = await Stat.findByPk(id);
        if (!stat) {
            return res.status(404).send({ message: "Estadística no encontrada" });
        }

        stat.name = name;
        await stat.save();
        res.send(stat);
    } catch (error) {
        console.error("Error al actualizar la estadística:", error);
        return res.status(500).send({ message: "Error al actualizar la estadística" });
    }
};

exports.deleteStat = async (req, res) => {
    const { id } = req.params;

    try {
        const stat = await Stat.findByPk(id);
        if (!stat) {
            return res.status(404).send({ message: "Estadística no encontrada" });
        }

        await stat.destroy();
        res.send({ message: "Estadística eliminada correctamente" });
    } catch (error) {
        console.error("Error al eliminar la estadística:", error);
        return res.status(500).send({ message: "Error al eliminar la estadística" });
    }
}