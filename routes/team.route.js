const {requireUser} = require("../middleware/requires-user");

module.exports = (app) => {

    let router = require("express").Router();
    const controller = require("../controller/team.controller");

    router.post("/createTeam", requireUser, controller.createTeam);
    router.get("/", requireUser, controller.getAllTeams);
    // router.get("/:id", requireUser, controller.getTeamById);
    router.put("/updateTeam/:id", requireUser, controller.updateTeam);
    router.delete("/deleteTeam/:id", requireUser, controller.deleteTeam);

    app.use("/team", router);

}