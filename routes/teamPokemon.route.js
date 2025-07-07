const {requireUser} = require("../middleware/requires-user");

module.exports = (app) => {

    let router = require("express").Router();
    const controller = require("../controller/teamPokemon");

    router.post("/createTeamPokemon/:team_id", requireUser, controller.createTeamPokemon);
    router.get("/:team_id", requireUser, controller.getAllTeamPokemons);
    router.get("/pokemon/:id", requireUser, controller.getTeamPokemonById);
    router.patch("/updateTeamPokemon/:id", requireUser, controller.updatePokemonFromTeam);
    router.delete("/deleteTeamPokemon/:id", requireUser, controller.deletePokemonFromTeam);

    app.use("/teamPokemon", router);
}