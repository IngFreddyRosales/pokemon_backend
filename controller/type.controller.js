const { where } = require("sequelize");
const db = require("../model");
const Type = db.Type;
const Move = db.Move;
const Pokemon = db.Pokemon;
const { Op } = require("sequelize");

exports.createType = async (req, res) => {
  const { name } = req.body;

  if (!name) {
    return res.status(400).send({ message: "Falta el nombre del tipo" });
  }


  try {

    const existingType = await Type.findOne({
      where: { name: name },
    });

    if (existingType) {
      return res.status(400).send({ message: "El tipo ya existe" })
    }
    const type = await Type.create({
      name: name,
    });


    res.send({
      message: "Tipo creado exitosamente",
      type: {
        id: type.id,
        name: type.name,
      },
    });
  } catch (error) {
    console.error("Error creating type: ", error);
    res.status(500).send({ message: "Error al crear el tipo" });
  }
};

exports.findAllTypes = async (req, res) => {
  try {
    const types = await Type.findAll();

    if (!types || types.length === 0) {
      return res.status(404).send({ message: "No se encontraron tipos" });
    }

    res.json(types);
  } catch (error) {
    console.error("Error fetching types: ", error);
    res.status(500).send({ message: "Error al obtener los tipos" });
  }
};

exports.findTypeById = async (req, res) => {
  const { id } = req.params;

  try {
    const type = await Type.findByPk(id);

    if (!type) {
      return res.status(404).send({ message: "Tipo no encontrado" });
    }

    res.json(type);
  } catch (error) {
    console.error("Error fetching type: ", error);
    res.status(500).send({ message: "Error al obtener el tipo" });
  }
};

exports.updateType = async (req, res) => {
  const { id } = req.params;
  const { name } = req.body;

  try {
    const type = await Type.findByPk(id);

    if (!type) {
      return res.status(404).send({ message: "Tipo no encontrado" });
    }

    type.name = name;

    await type.save();

    res.send({
      message: "Tipo actualizado",
      type: {
        name: type.name,
      },
    });
  } catch (error) {
    console.error("Error fetching type: ", error);
    res.status(500).send({ message: "Error al actualizar el tipo" });
  }
};

exports.deleteType = async (req, res) => {
  const { id } = req.params;

  try {
    const type = await Type.findByPk(id);

    if (!type) {
      return res.status(404).send({ message: "Tipo no encontrado" });
    }

    // verificacion de moviento que no este relacionado
    const count = await Move.count({ where: { typeId: id } });
    if (count > 0) {
      return res.status(400).send({ message: "No se puede eliminar el tipo, hay movimientos asociados a este" });
    }

    // Verificacion de si hay Pokémon que referencian este tipo
    const pokemonCount = await Pokemon.count({
      where: {
        [Op.or]: [
          { type1Id: id },
          { type2Id: id }
        ]
      }
    });
    if (pokemonCount > 0) {
      return res.status(400).json({
        message: `No se puede eliminar el tipo: ${pokemonCount} Pokémon lo referencian.`
      });
    }


    await type.destroy();
    res.send({ message: "Tipo eliminado exitosamente" });
  } catch (error) {
    console.error("Error deleting type: ", error);
    res.status(500).send({ message: "Error al eliminar el tipo" });
  }
}
