const db = require('../model');
const Team = db.Team;
const TeamPokemon = db.TeamPokemon;
const Pokemon = db.Pokemon;
const { Op } = require("sequelize");

exports.createTeam = async (req, res) => {
    const { id: userId } = res.locals.usuario; // El usuario autenticado
    const { name } = req.body;

    if (!name) {
        return res.status(400).send({ message: "El nombre del equipo es obligatorio" });
    }

    const quantityTeams = await Team.count({ where: { userId } });
    if (quantityTeams >= 6) {
        return res.status(400).send({ message: "No puedes crear más de 6 equipos" });
    }

    try {
        //buscar si ya existe un equipo con el mismo nombre para el usuario
        const existingTeam = await Team.findOne({
            where: {
                name,
                userId
            }
        });

        if (existingTeam) {
            return res.status(400).send({ message: "El equipo ya existe usa otro nombre" });
        }

        const newTeam = await Team.create({ name, userId });
        res.status(201).send(newTeam);
    } catch (error) {
        console.error("Error al crear el equipo:", error);
        return res.status(500).send({ message: "Error al crear el equipo" });
    }

}

// exports.getAllTeams = async (req, res) => {
//     const { id: userId } = res.locals.usuario;

//     try {
//         const teams = await Team.findAll({ where: { userId } });
//         res.send(teams);
//     } catch (error) {
//         console.error("Error al obtener los equipos:", error);
//         return res.status(500).send({ message: "Error al obtener los equipos" });
//     }
// }


exports.getAllTeams = async (req, res) => {
    try {
        const teams = await Team.findAll({
            where: { userId: res.locals.usuario.id },
            include: [{
                model: TeamPokemon,
                foreignKey: 'teamId',
                include: [{
                    model: Pokemon,
                    attributes: ['id', 'name', 'image']
                }]
            }]
        });

        const baseUrl = `${req.protocol}://${req.get('host')}`;

        const payload = teams.map(team => ({
            id: team.id,
            name: team.name,
            pokemons: team.TeamPokemons.map(tp => ({
                id: tp.id,
                pokemonId: tp.pokemonId,
                nickname: tp.nickname,
                pokemon: {
                    id: tp.Pokemon.id,
                    name: tp.Pokemon.name,
                    image: tp.Pokemon.image
                        ? tp.Pokemon.image.startsWith('http')
                            ? tp.Pokemon.image
                            : `${baseUrl}${tp.Pokemon.image}`
                        : null
                }
            }))
        }));

        res.send(payload);
    } catch (error) {
        console.error("Error al obtener los equipos:", error);
        return res.status(500).send({ message: "Error al obtener los equipos" });
    }
}

exports.deleteTeam = async (req, res) => {
    const { id } = req.params;
    const { id: userId } = res.locals.usuario;

    if (!id) {
        return res.status(400).send({ message: "El ID del equipo es obligatorio" });
    }

    try {
        const team = await Team.findOne({ where: { id, userId } });

        if (!team) {
            return res.status(404).send({ message: "Equipo no encontrado" });
        }



        await team.destroy();
        res.send({ message: "Equipo eliminado exitosamente" });
    } catch (error) {
        console.error("Error al eliminar el equipo:", error);
        return res.status(500).send({ message: "Error al eliminar el equipo" });
    }
}

exports.updateTeam = async (req, res) => {
    const { id } = req.params;
    const { name } = req.body;
    const { id: userId } = res.locals.usuario;

    if (!id) {
        return res.status(400).send({ message: "El ID del equipo es obligatorio" });
    }

    if (!name) {
        return res.status(400).send({ message: "El nombre del equipo es obligatorio" });
    }

    const existingTeam = await Team.findOne({
        where: {
            name,
            userId,
            id: { [Op.ne]: id }
        }
    });

    if (existingTeam) {
        return res.status(400).send({ message: "Ya tienes otro equipo con ese nombre" });
    }

    try {
        const team = await Team.findOne({ where: { id, userId } });

        if (!team) {
            return res.status(404).send({ message: "Equipo no encontrado" });
        }

        team.name = name;
        await team.save();
        res.send(team);
    } catch (error) {
        console.error("Error al actualizar el equipo:", error);
        return res.status(500).send({ message: "Error al actualizar el equipo" });
    }
}
