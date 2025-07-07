const { requireUser } = require("../middleware/requires-user");
const { checkAdmin } = require("../middleware/check-admin");

module.exports = (app) => {

    let router = require("express").Router();
    const controller = require("../controller/movement.controller");

    router.get("/", requireUser,checkAdmin, controller.getAllMovements);
    router.get("/:id", requireUser, controller.getMovementById);
    router.post("/createMove", requireUser, checkAdmin, controller.createMovement);
    router.put("/updateMove/:id", requireUser, checkAdmin, controller.updateMovement);
    router.delete("/deleteMove/:id", requireUser, checkAdmin, controller.deleteMovement);

    router.get("/getAllMoves", requireUser, controller.getAllMovements);

    

    app.use("/move", router);
}