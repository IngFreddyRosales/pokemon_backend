const {requireUser} = require("../middleware/requires-user");
const {checkAdmin} = require("../middleware/check-admin");

module.exports = (app) => {

    let router = require("express").Router();
    const controller = require("../controller/pokemon.controller");

    router.post("/createPokemon", requireUser, checkAdmin, controller.createPokemon);
    router.get("/", requireUser,checkAdmin, controller.getAllPokemons);
    router.get("/pokemons", requireUser, controller.getAllPokemons);
    router.get("/:id", requireUser, controller.getPokemonById);
    router.put("/updatePokemon/:id", requireUser, checkAdmin, controller.updatePokemon);
    router.delete("/deletePokemon/:id", requireUser, checkAdmin, controller.deletePokemon);

    app.use("/pokemon", router);
}