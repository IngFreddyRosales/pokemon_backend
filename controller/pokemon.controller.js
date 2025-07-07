const db = require('../model');
const Pokemon = db.Pokemon;
const Type = db.Type;
const Move = db.Move;
const path = require('path');
const fs = require('fs');
const { formatPokemon } = require('../utils/pokemon.utils.js');


exports.createPokemon = async (req, res) => {
    const {
        name,
        type1Id,
        type2Id,
        hp,
        attack,
        defense,
        specialAttack,
        specialDefense,
        speed,
        moveIds = []
    } = req.body;

    const image = req.files ? req.files.image : null;



    if (!name || !image || !type1Id || !hp || !attack || !defense || !specialAttack || !specialDefense || !speed) {
        console.log("Faltan datos obligatorios");
        return res.status(400).send({ message: "Faltan datos" });
    }

    // Validaciones de movimientos existentes
    let parsedMoveIds = [];
    try {
        parsedMoveIds = Array.isArray(moveIds) ? moveIds : JSON.parse(moveIds || '[]');
        console.log("parsedMoveIds:", parsedMoveIds);
    } catch (e) {
        console.log("Error parseando moveIds:", moveIds, e);
        return res.status(400).send({ message: "moveIds mal formateado" });
    }

    if (parsedMoveIds.length) {
        const moves = await db.Move.findAll({
            where: { id: parsedMoveIds }
        });
        console.log("Movimientos encontrados en DB:", moves.map(m => m.id));
        if (moves.length !== parsedMoveIds.length) {
            console.log("Uno o más movimientos no existen");
            return res.status(400).send({ message: "Uno o mas movimientos no existen" });
        }
    }

    // Validaciones de tipos existentes  
    const type1 = await db.Type.findByPk(type1Id);
    console.log("Tipo 1 encontrado:", type1 ? type1.name : null);
    if (!type1) {
        return res.status(400).send({ message: "Tipo 1 no existe" });
    }
    if (type2Id) {
        const type2 = await db.Type.findByPk(type2Id);
        console.log("Tipo 2 encontrado:", type2 ? type2.name : null);
        if (!type2) {
            return res.status(400).send({ message: "Tipo 2 no existe" });
        }
    }

    // Verificar si el Pokémon ya existe
    const existingPokemon = await Pokemon.findOne({ where: { name: name } });
    if (existingPokemon) {
        return res.status(400).send({ message: "Ya existe un Pokémon con ese nombre" });
    }

    try {
        let imagePath = null;

        if (req.files && req.files.image) {
            const imageFile = req.files.image;
            const uploadDir = path.join(__dirname, '../public/pokemon');
            if (!fs.existsSync(uploadDir)) {
                fs.mkdirSync(uploadDir, { recursive: true });
            }

            const sanitizedOriginalName = imageFile.name.replace(/\s+/g, '_').replace(/[()]/g, '');
            const fileName = Date.now() + '-' + sanitizedOriginalName;

            imagePath = `/pokemon/${fileName}`;
            await imageFile.mv(path.join(uploadDir, fileName));
            console.log("Imagen guardada en:", imagePath);
        } else {
            console.log("No se recibió archivo de imagen");
            return res.status(400).send({ message: "El archivo de imagen es obligatorio" });
        }

        const pokemon = await Pokemon.create({
            name: name,
            image: imagePath,
            type1Id: type1Id,
            type2Id: type2Id || null,
            hp: hp,
            attack: attack,
            defense: defense,
            specialAttack: specialAttack,
            specialDefense: specialDefense,
            speed: speed
        });

        console.log("Pokémon creado en DB:", pokemon ? pokemon.id : null);

        // Asociar movimientos al Pokémon
        if (parsedMoveIds.length) {
            await pokemon.setMoves(parsedMoveIds);
            console.log("Movimientos asociados:", parsedMoveIds);
        }

        res.send({
            message: "Pokémon creado exitosamente",
            pokemon: {
                id: pokemon.id,
                name: pokemon.name,
                image: pokemon.image,
                type1Id: pokemon.type1Id,
                type2Id: pokemon.type2Id,
                hp: pokemon.hp,
                attack: pokemon.attack,
                defense: pokemon.defense,
                specialAttack: pokemon.specialAttack,
                specialDefense: pokemon.specialDefense,
                speed: pokemon.speed
            }
        });
    } catch (error) {
        console.error("Error creating Pokémon:", error);
        res.status(500).send({ message: "Error al crear el Pokémon", error });
    }
};

exports.updatePokemon = async (req, res) => {
    const { id } = req.params;
    const {
        name,
        type1Id,
        type2Id,
        hp,
        attack,
        defense,
        specialAttack,
        specialDefense,
        speed,
        moveIds = []
    } = req.body;

    const image = req.files ? req.files.image : null;

    console.log("Datos recibidos:", req.body);
    console.log("Archivos recibidos:", req.files);

    try {
        // Verificar si el Pokémon existe
        const existingPokemon = await Pokemon.findByPk(id);
        if (!existingPokemon) {
            return res.status(404).send({ message: "Pokémon no encontrado" });
        }

        // Validar movimientos si se proporcionan
        const parsedMoveIds = Array.isArray(moveIds) ? moveIds : JSON.parse(moveIds || '[]');
        if (parsedMoveIds.length) {
            const moves = await db.Move.findAll({
                where: { id: parsedMoveIds }
            });

            if (moves.length !== parsedMoveIds.length) {
                return res.status(400).send({ message: "Uno o más movimientos no existen" });
            }
        }

        // Manejar la imagen si se proporciona una nueva
        let imagePath = existingPokemon.image;
        if (image) {
            const imageFile = req.files.image;
            const uploadDir = path.join(__dirname, '../public/pokemon');
            if (!fs.existsSync(uploadDir)) {
                fs.mkdirSync(uploadDir, { recursive: true });
            }

            const sanitizedOriginalName = imageFile.name.replace(/\s+/g, '_').replace(/[()]/g, '');
            const fileName = Date.now() + '-' + sanitizedOriginalName;

            imagePath = `/pokemon/${fileName}`;
            await imageFile.mv(path.join(uploadDir, fileName));

            // Eliminar la imagen anterior si existe
            if (existingPokemon.image) {
                const oldImagePath = path.join(__dirname, '../public', existingPokemon.image);
                if (fs.existsSync(oldImagePath)) {
                    fs.unlinkSync(oldImagePath);
                }
            }
        }

        // Actualizar los campos del Pokémon
        existingPokemon.name = name || existingPokemon.name;
        existingPokemon.image = imagePath;
        existingPokemon.type1Id = type1Id || existingPokemon.type1Id;
        existingPokemon.type2Id = type2Id || existingPokemon.type2Id;
        existingPokemon.hp = hp || existingPokemon.hp;
        existingPokemon.attack = attack || existingPokemon.attack;
        existingPokemon.defense = defense || existingPokemon.defense;
        existingPokemon.specialAttack = specialAttack || existingPokemon.specialAttack;
        existingPokemon.specialDefense = specialDefense || existingPokemon.specialDefense;
        existingPokemon.speed = speed || existingPokemon.speed;

        await existingPokemon.save();

        // Asociar movimientos al Pokémon si se proporcionan
        if (parsedMoveIds.length) {
            await existingPokemon.setMoves(parsedMoveIds);
        }

        res.send({
            message: "Pokémon actualizado exitosamente",
            pokemon: {
                id: existingPokemon.id,
                name: existingPokemon.name,
                image: existingPokemon.image,
                type1Id: existingPokemon.type1Id,
                type2Id: existingPokemon.type2Id,
                hp: existingPokemon.hp,
                attack: existingPokemon.attack,
                defense: existingPokemon.defense,
                specialAttack: existingPokemon.specialAttack,
                specialDefense: existingPokemon.specialDefense,
                speed: existingPokemon.speed,
                moveIds: parsedMoveIds // Devolver los movimientos actualizados
            }
        });
    } catch (error) {
        console.error("Error updating Pokémon:", error);
        res.status(500).send({ message: "Error al actualizar el Pokémon" });
    }
};
exports.getAllPokemons = async (req, res) => {
    try {
        const pokemons = await Pokemon.findAll({
            include: [
                { model: Type, as: 'type1', attributes: ['name'] },
                { model: Type, as: 'type2', attributes: ['name'] },
                {
                    model: Move,
                    attributes: ['id', 'name'],
                    through: { attributes: [] }
                }
            ]
        });

        if (!pokemons || pokemons.length === 0) {
            return res.status(404).send({ message: "No se encontraron Pokémon" });
        }

        // Formatear los Pokémon y agregar la URL completa de la imagen
        const result = pokemons.map(pokemon => {
            const formattedPokemon = formatPokemon(pokemon);
            formattedPokemon.image = `${req.protocol}://${req.get('host')}${formattedPokemon.image}`;
            formattedPokemon.moveIds = pokemon.Moves.map(move => move.id); // Extraer los IDs de los movimientos
            return formattedPokemon;
        });

        res.json(result);
    } catch (err) {
        console.error('Error fetching pokemons:', err);
        res.status(500).json({ message: 'Error interno del servidor' });
    }
};

exports.getPokemonById = async (req, res) => {
    const { id } = req.params;



    try {
        const pokemon = await Pokemon.findByPk(id, {
            include: [
                { model: Type, as: 'type1', attributes: ['name'] },
                { model: Type, as: 'type2', attributes: ['name'] },
                {
                    model: Move,
                    attributes: ['id', 'name', 'category', 'power'],
                    through: { attributes: [] } // omitimos columnas de la tabla puente
                }
            ]
        });

        if (!pokemon) {
            return res.status(404).send({ message: "Pokémon no encontrado" });
        }

        // Formatear el Pokémon y agregar la URL completa de la imagen
        const formattedPokemon = formatPokemon(pokemon);
        formattedPokemon.image = `${req.protocol}://${req.get('host')}${formattedPokemon.image}`;

        res.send(formattedPokemon);
    } catch (error) {
        console.error("Error fetching Pokémon:", error);
        res.status(500).send({ message: "Error al obtener el Pokémon" });
    }
};

exports.deletePokemon = async (req, res) => {
    const { id } = req.params;

    try {
        const pokemon = await Pokemon.findByPk(id);
        if (!pokemon) {
            return res.status(404).send({ message: "Pokémon no encontrado" });
        }

        if (pokemon.image) {
            const imagePath = path.join(__dirname, '../public', pokemon.image);
            if (fs.existsSync(imagePath)) {
                fs.unlinkSync(imagePath);
            }
        }

        await pokemon.destroy();

        res.send({ message: "Pokémon eliminado exitosamente" });
    } catch (error) {
        console.error("Error deleting Pokémon:", error);
        res.status(500).send({ message: "Error al eliminar el Pokémon" });
    }
}

