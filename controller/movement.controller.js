const db = require('../model');
const Movement = db.Move;
const Type = db.Type;

exports.createMovement = async (req , res) => {
    const { name, typeId, power, category, description } = req.body;

    if (!name || !typeId || !power || !category) {
        return res.status(400).send({ message: "Faltan datos" });
    }

    const existingMovement = await Movement.findOne({ where: { name: name } });
    if (existingMovement) {
        return res.status(400).send({ message: "Ya existe un movimiento con ese nombre" });
    }

    const type = await db.Type.findByPk(typeId);
    if (!type) {
        return res.status(400).send({ message: "Categoria especificada no existe" });
    }

    if (!['physical', 'special', 'status'].includes(category)) {
        return res.status(400).send({ message: "Categoría inválida" });
    }

    try {
        const movement = await Movement.create({
            name: name,
            typeId: typeId,
            category: category,
            power: power,
            description: description || null
        });

        res.send({
            message: "Movimiento creado exitosamente",
            movement: {
                id: movement.id,
                name: movement.name,
                typeId: movement.typeId,
                category: movement.category,
                power: movement.power,
                description: movement.description
            }
        });
    } catch (error) {
        console.error("Error creating movement: ", error);
        res.status(500).send({ message: "Error al crear el movimiento" });
    }
}

exports.getAllMovements = async (req, res) => {
    try {

        const moves = await Movement.findAll({
            include: [{
                model: Type,
                attributes: ['name']
            }]
        });

        const formattedMoves = moves.map(move => ({
            id: move.id,
            name: move.name,
            typeId: move.typeId,
            typeName: move.Type ? move.Type.name : null,
            category: move.category,
            power: move.power,
            description: move.description

        }));

        res.send(formattedMoves);

    } catch (error) {
        console.error("Error fetching movements: ", error);
        res.status(500).send({ message: "Error al obtener los movimientos" });
    }

}

exports.getMovementById = async (req, res) => {
    const { id } = req.params;

    try{

        const movement = await Movement.findByPk(id);
        if (!movement) {
            return res.status(404).send({ message: "Movimiento no encontrado" });
        }

        res.send({
            id: movement.id,
            name: movement.name,
            typeId: movement.typeId,
            category: movement.category,
            power: movement.power,
            description: movement.description
        });
    }catch (error) {
        console.error("Error fetching movement: ", error);
        res.status(500).send({ message: "Error al obtener el movimiento" });
    }
}

exports.updateMovement = async (req, res) => {
    const { id } = req.params;
    const { name, typeId, power, category, description } = req.body;

    try{
        const movement = await Movement.findByPk(id);
        if (!movement) {
            return res.status(404).send({ message: "Movimiento no encontrado" });
        }

        // Update movement details
        movement.name = name || movement.name;
        movement.typeId = typeId || movement.typeId;
        movement.power = power || movement.power;
        movement.category = category || movement.category;
        movement.description = description || movement.description;

        await movement.save();

        res.send({
            message: "Movimiento actualizado exitosamente",
            movement: {
                id: movement.id,
                name: movement.name,
                typeId: movement.typeId,
                category: movement.category,
                power: movement.power,
                description: movement.description
            }
        });
    }catch (error) {
        console.error("Error updating movement: ", error);
    }
}

exports.deleteMovement = async (req, res) => {
    const { id } = req.params;

    try {
        const movement = await Movement.findByPk(id);
        if (!movement) {
            return res.status(404).send({ message: "Movimiento no encontrado" });
        }

        await movement.destroy();

        res.send({ message: "Movimiento eliminado exitosamente" });
    } catch (error) {
        console.error("Error deleting movement: ", error);
        res.status(500).send({ message: "Error al eliminar el movimiento" });
    }
}