const db = require('../model');
const Item = db.Item;
const path = require('path');
const fs = require('fs');

exports.getAllItems = async (req, res) => {

    try {
        const items = await Item.findAll();
        res.send(items);
    } catch {
        console.error("Error al obtener los items:", error);
        return res.status(500).send({ message: "Error al obtener los items" });
    }
}

exports.getItemById = async (req, res) => {
    const { id } = req.params;

    try {
        const item = await Item.findByPk(id);
        if (!item) {
            return res.status(404).send({ message: "Item no encontrado" });
        }
        res.send(item);
    } catch (error) {
        console.error("Error al obtener el item:", error);
        return res.status(500).send({ message: "Error al obtener el item" });
    }
};

exports.createItem = async (req, res) => {
    const { name, description } = req.body;
    const image = req.files ? req.files.image : null;

    console.log("Datos recibidos:", req.body);
    console.log("Archivos recibidos:", req.files);

    if (!name || !description || !image) {
        return res.status(400).send({ message: "Todos los campos son obligatorios" });
    }

    const existingItem = await Item.findOne({ where: { name } });

    if (existingItem) {
        return res.status(400).send({ message: "El item ya existe" });
    }

    try {
        let symbolPath = null;
        if (req.files && req.files.image) {
            const symbolFile = req.files.image;
            const uploadDir = path.join(__dirname, '../public/item');
            if (!fs.existsSync(uploadDir)) {
                fs.mkdirSync(uploadDir, { recursive: true });
            }
            const sanitizedOriginalName = symbolFile.name.replace(/\s+/g, '_').replace(/[()]/g, '');
            const fileName = Date.now() + '-' + sanitizedOriginalName;
            // const fileName = Date.now() + '-' + symbolFile.name;
            symbolPath = `/item/${fileName}`;
            await symbolFile.mv(path.join(uploadDir, fileName));
        } else {
            return res.status(400).send({ message: "El archivo de imagen es obligatorio" });
        }

        const item = await Item.create({
            name: name,
            description: description,
            image: symbolPath
        });

        res.send({
            message: "Item creado exitosamente",
            item: {
                name: item.name,
                description: item.description,
                image: item.image,
            },
        });
    } catch (error) {
        console.error("Error al crear el item:", error);
        return res.status(500).send({ message: "Error al crear el item" });
    }
};

exports.updateItem = async (req, res) => {
    const { id } = req.params;

    try {
        
        const existingItem = await Item.findByPk(id);
        if (!existingItem) {
            return res.status(404).send({ message: "Item no encontrado" });
        }

        // Inicializar los datos a actualizar con los valores existentes
        let updateItem = {
            name: req.body.name || existingItem.name,
            description: req.body.description || existingItem.description,
        };

        // Manejar la actualización de la imagen si se envía una nueva
        if (req.files && req.files.image) {
            const symbolFile = req.files.image;
            const uploadDir = path.join(__dirname, '../public/item');

            // Crear el directorio si no existe
            if (!fs.existsSync(uploadDir)) {
                fs.mkdirSync(uploadDir, { recursive: true });
            }

            // Generar un nombre único para la nueva imagen
            const sanitizedOriginalName = symbolFile.name.replace(/\s+/g, '_').replace(/[()]/g, '');
            const fileName = Date.now() + '-' + sanitizedOriginalName;
            const symbolPath = `/item/${fileName}`;

            // Mover la nueva imagen al directorio de subida
            await symbolFile.mv(path.join(uploadDir, fileName));

            // Eliminar la imagen anterior si existe
            if (existingItem.image) {
                const oldImagePath = path.join(__dirname, '../public', existingItem.image);
                if (fs.existsSync(oldImagePath)) {
                    fs.unlinkSync(oldImagePath);
                }
            }

            // Actualizar la ruta de la imagen en los datos a actualizar
            updateItem.image = symbolPath;
        }

        // Actualizar el item en la base de datos
        await existingItem.update(updateItem);

        // Devolver el item actualizado
        res.send({
            message: "Item actualizado exitosamente",
            item: {
                id: existingItem.id,
                name: existingItem.name,
                description: existingItem.description,
                image: existingItem.image,
            },
        });
    } catch (error) {
        console.error("Error al actualizar el item:", error);
        res.status(500).send({ message: "Error al actualizar el item" });
    }
};

exports.deleteItem = async (req, res) => {
    const { id } = req.params;

    try {
        const existingItem = await Item.findByPk(id);
        if (!existingItem) {
            return res.status(404).send({ message: "Item no encontrado" });
        }

        if (existingItem.image) {
            const imagePath = path.join(__dirname, '../public', existingItem.image);
            if (fs.existsSync(imagePath)) {
                fs.unlinkSync(imagePath);
            }
        }

        await existingItem.destroy()

        return res.status(200).send({ message: "Item eliminado exitosamente" });
    } catch (error) {
        console.error("Error al eliminar el item:", error);
        return res.status(500).send({ message: "Error al eliminar el item" });
    }


}
