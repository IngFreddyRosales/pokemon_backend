const db = require('../model');
const Nature = db.Nature;

exports.createNature = async (req, res) => {

    const {name, increasedStatId, decreasedStatId} = req.body;

    if (!name || !increasedStatId || !decreasedStatId) {
        return res.status(400).send({ message: "Todos los campos son obligatorios" });
    }

    try {
        const existingNature = await Nature.findOne({ where: { name } });

        if (existingNature) {
            return res.status(400).send({ message: "La naturaleza ya existe" });
        }

        const newNature = await Nature.create({ name, increasedStatId, decreasedStatId });
        res.status(201).send(newNature);
    } catch (error) {
        console.error("Error al crear la naturaleza:", error);
        return res.status(500).send({ message: "Error al crear la naturaleza" });
    }
}


exports.getAllNatures = async (req, res) => {
    try {
        const natures = await Nature.findAll();
        res.send(natures);
    } catch (error) {
        console.error("Error al obtener las naturalezas:", error);
        return res.status(500).send({ message: "Error al obtener las naturalezas" });
    }
}

exports.getNatureById = async (req, res) => {
    try{
        const { id } = req.params;

        if(!id) {
            return res.status(400).send({ message: "El ID es obligatorio" });
        }

        const nature = await Nature.findByPk(id);
        if (!nature) {
            return res.status(404).send({ message: "Naturaleza no encontrada" });
        }
        res.send(nature);
    }catch (error) {
        console.error("Error al obtener la naturaleza:", error);
        return res.status(500).send({ message: "Error al obtener la naturaleza" });
    }
}

exports.updateNAture = async (req, res) => {
    try{
        const { id } = req.params;
        const { name, increasedStatId, decreasedStatId } = req.body;


        const nature = await Nature.findByPk(id);
        if (!nature) {
            return res.status(404).send({ message: "Naturaleza no encontrada" });
        }

        if (name !== undefined) nature.name = name;
        if (increasedStatId !== undefined) nature.increasedStatId = increasedStatId;
        if (decreasedStatId !== undefined) nature.decreasedStatId = decreasedStatId;

        await nature.save();
        res.send(nature);
    }catch (error) {
        console.error("Error al actualizar la naturaleza:", error);
        return res.status(500).send({ message: "Error al actualizar la naturaleza" });
    }
}

exports.deleteNature = async (req, res) => {

}