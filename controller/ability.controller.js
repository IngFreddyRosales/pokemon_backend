const db = require('../model');
const Ability = db.Ability;


exports.createAbility = async (req , res) => {
    const { name, description, pokemonId } = req.body;

    if (!name || !pokemonId) {
        return res.status(400).send({ message: "Todos los campos son obligatorios" });
    }
    
    const existingPokemon = await db.Pokemon.findByPk(pokemonId);
    if (!existingPokemon) {
        return res.status(404).send({ message: "Pokémon no encontrado" });
    }

    try {
        const existingAbility = await Ability.findOne({ where: { name, pokemonId } });

        if (existingAbility) {
            return res.status(400).send({ message: "La habilidad ya existe para este Pokémon" });
        }

        const newAbility = await Ability.create({ name, description, pokemonId });
        res.status(201).send(newAbility);
    } catch (error) {
        console.error("Error al crear la habilidad:", error);
        return res.status(500).send({ message: "Error al crear la habilidad" });
    }
}

exports.getAllAbilities = async (req, res) => {
    try {
        const abilities = await Ability.findAll();
        res.send(abilities);
    } catch (error) {
        console.error("Error al obtener las habilidades:", error);
        return res.status(500).send({ message: "Error al obtener las habilidades" });
    }
};

exports.getAllAbilitiesFromPokemon = async (req, res) => {
    const { pokemonId } = req.params;

    if (!pokemonId) {
        return res.status(400).send({ message: "El ID del Pokémon es obligatorio" });
    }

    try {
        const abilities = await Ability.findAll({ where: { pokemonId } });

        if (abilities.length === 0) {
            return res.status(404).send({ message: "No se encontraron habilidades para este Pokémon" });
        }

        res.send(abilities);
    } catch (error) {
        console.error("Error al obtener las habilidades del Pokémon:", error);
        return res.status(500).send({ message: "Error al obtener las habilidades del Pokémon" });
    }
}



exports.updateAbility = async (req, res) => {
    const { id } = req.params;
    const { name, description, pokemonId } = req.body;


    try {
        const ability = await Ability.findByPk(id);
        if (!ability) {
            return res.status(404).send({ message: "Habilidad no encontrada" });
        }

        const existingPokemon = await db.Pokemon.findByPk(pokemonId);
        if (!existingPokemon) {
            return res.status(404).send({ message: "Pokémon no encontrado" });
        }

        if(name !== undefined) ability.name = name;
        if(description !== undefined) ability.description = description;
        if(pokemonId !== undefined) ability.pokemonId = pokemonId;


        await ability.save();
        res.send(ability);
    } catch (error) {
        console.error("Error al actualizar la habilidad:", error);
        return res.status(500).send({ message: "Error al actualizar la habilidad" });
    }
}

exports.deleteAbility = async (req, res) => {
    try{
        const { id } = req.params;
        const ability = await Ability.findByPk(id);

        if (!ability) {
            return res.status(404).send({ message: "Habilidad no encontrada" });
        }

        await ability.destroy();
        res.send({ message: "Habilidad eliminada correctamente" });
    }catch (error) {
        console.error("Error al eliminar la habilidad:", error);
        return res.status(500).send({ message: "Error al eliminar la habilidad" });
    }
}