const { where } = require("sequelize");
const db = require("../model");
const ability = require("../model/ability");
const teamPokemon = db.TeamPokemon;

exports.createTeamPokemon = async (req, res) => {
    const { team_id } = req.params;
    const {
        pokemon_id,
        nickname
      } = req.body;

        if (!team_id || !pokemon_id) {
            return res.status(400).send({ message: "El ID del equipo y del Pokémon son obligatorios" });
        }

        const finalNickname = nickname || "Sin apodo";



      try{
        const existingPokemon = await teamPokemon.findOne({ where: { teamId: team_id, pokemonId: pokemon_id } });

        if (existingPokemon) {
            return res.status(400).send({ message: "El Pokémon ya está en el equipo" });
        }

        const newTeamPokemon = await teamPokemon.create({
            teamId: team_id,
            pokemonId: pokemon_id,
            nickname: finalNickname,
            itemId: null, 
            abilityId: null, 
            natureId: null, 
            evHp: 0,
            evAtk: 0,
            evDef: 0,
            evSpa: 0,
            evSpd: 0,
            evSpe: 0,
            ivHp: 0,
            ivAtk: 0,
            ivDef: 0,
            ivSpa: 0,
            ivSpd: 0,
            ivSpe: 0
        });

        res.status(201).send(newTeamPokemon);
      }catch (error) {
        console.error("Error al crear el Pokémon en el equipo:", error);
        return res.status(500).send({ message: "Error al crear el Pokémon en el equipo" });
      }
      
}

exports.updatePokemonFromTeam = async (req, res) => {
    const { id } = req.params;
    const {
        nickname,
        itemId,
        abilityId,
        natureId,
        evHp,
        evAtk,
        evDef,
        evSpa,
        evSpd,
        evSpe,
        ivHp,
        ivAtk,
        ivDef,
        ivSpa,
        ivSpd,
        ivSpe
    } = req.body;

    if (!id) {
        return res.status(400).send({ message: "El ID del Pokémon en el equipo es obligatorio" });
    }

    try {
        const teamPokemonToUpdate = await teamPokemon.findByPk(id);

        if (!teamPokemonToUpdate) {
            return res.status(404).send({ message: "Pokémon no encontrado en el equipo" });
        }

        // Actualiza solo los campos que se proporcionan
        const updatedTeamPokemon = await teamPokemonToUpdate.update({
            nickname,
            itemId,
            abilityId,
            natureId,
            evHp,
            evAtk,
            evDef,
            evSpa,
            evSpd,
            evSpe,
            ivHp,
            ivAtk,
            ivDef,
            ivSpa,
            ivSpd,
            ivSpe
        });

        res.send(updatedTeamPokemon);
    } catch (error) {
        console.error("Error al actualizar el Pokémon del equipo:", error);
        return res.status(500).send({ message: "Error al actualizar el Pokémon del equipo" });
    }
}

exports.getAllTeamPokemons = async (req, res) => {
    const { team_id } = req.params;

    if (!team_id) {
        return res.status(400).send({ message: "El ID del equipo es obligatorio" });
    }

    try {
        const teamPokemons = await teamPokemon.findAll({
            where: { teamId: team_id },
            include: [{
                model: db.Pokemon,
                attributes: ['image']
            },
            {
                model: db.Item,
                attributes: ['name','image']
            },
            {
                model: db.Ability,
                attributes: ['name']
            },
            {
                model: db.Nature,
                attributes: ['name']
            }
        ]
            
        });

        

        const baseUrl = `${req.protocol}://${req.get('host')}`;

        // Mapeo
        const result = teamPokemons.map(tp => ({
            id: tp.id,
            teamId: tp.teamId,
            pokemonId: tp.pokemonId,
            nickname: tp.nickname,
            image: tp.Pokemon && tp.Pokemon.image
                ? tp.Pokemon.image.startsWith('http')
                    ? tp.Pokemon.image
                    : `${baseUrl}${tp.Pokemon.image}`
                : null,
            item: tp.Item ?  tp.Item.name: null,
            itemImage: tp.Item && tp.Item.image
                ? tp.Item.image.startsWith('http')
                    ? tp.Item.image
                    : `${baseUrl}${tp.Item.image}`
                : null,
            ability: tp.Ability ? tp.Ability.name : null,
            nature: tp.Nature ? tp.Nature.name : null,
            evHp: tp.evHp,
            evAtk: tp.evAtk,
            evDef: tp.evDef,
            evSpa: tp.evSpa,
            evSpd: tp.evSpd,
            evSpe: tp.evSpe,
            ivHp: tp.ivHp,
            ivAtk: tp.ivAtk,
            ivDef: tp.ivDef,
            ivSpa: tp.ivSpa,
            ivSpd: tp.ivSpd,
            ivSpe: tp.ivSpe,
        }));

        res.send(result);
    } catch (error) {
        console.error("Error al obtener los Pokémon del equipo:", error);
        return res.status(500).send({ message: "Error al obtener los Pokémon del equipo" });
    }
}

exports.getTeamPokemonById = async (req, res) => {
    const { id } = req.params;

    if (!id) {
        return res.status(400).send({ message: "El ID del Pokémon en el equipo es obligatorio" });
    }

    try {
        const teamPokemonData = await teamPokemon.findByPk(id, {
            include: [{
                model: db.Pokemon,
                attributes: ['image']
            }]
        });

        if (!teamPokemonData) {
            return res.status(404).send({ message: "Pokémon no encontrado en el equipo" });
        }

        const baseUrl = `${req.protocol}://${req.get('host')}`;

        const result = {
            id: teamPokemonData.id,
            teamId: teamPokemonData.teamId,
            pokemonId: teamPokemonData.pokemonId,
            nickname: teamPokemonData.nickname,
            image: teamPokemonData.Pokemon && teamPokemonData.Pokemon.image
                ? teamPokemonData.Pokemon.image.startsWith('http')
                    ? teamPokemonData.Pokemon.image
                    : `${baseUrl}${teamPokemonData.Pokemon.image}`
                : null,
            itemId: teamPokemonData.itemId,
            abilityId: teamPokemonData.abilityId,
            natureId: teamPokemonData.natureId,
            evHp: teamPokemonData.evHp,
            evAtk: teamPokemonData.evAtk,
            evDef: teamPokemonData.evDef,
            evSpa: teamPokemonData.evSpa,
            evSpd: teamPokemonData.evSpd,
            evSpe: teamPokemonData.evSpe,
            ivHp: teamPokemonData.ivHp,
            ivAtk: teamPokemonData.ivAtk,
            ivDef: teamPokemonData.ivDef,
            ivSpa: teamPokemonData.ivSpa,
            ivSpd: teamPokemonData.ivSpd,
            ivSpe: teamPokemonData.ivSpe
        };

        res.send(result);
    } catch (error) {
        console.error("Error al obtener el Pokémon del equipo:", error);
        return res.status(500).send({ message: "Error al obtener el Pokémon del equipo" });
    }
}

exports.deletePokemonFromTeam = async (req, res) => {
    const { id } = req.params;

    if (!id) {
        return res.status(400).send({ message: "El ID del Pokémon en el equipo es obligatorio" });
    }

    try {
        const deletedPokemon = await teamPokemon.destroy({ where: { id } });

        if (deletedPokemon === 0) {
            return res.status(404).send({ message: "Pokémon no encontrado en el equipo" });
        }

        res.send({ message: "Pokémon eliminado del equipo exitosamente" });
    } catch (error) {
        console.error("Error al eliminar el Pokémon del equipo:", error);
        return res.status(500).send({ message: "Error al eliminar el Pokémon del equipo" });
    }
}


