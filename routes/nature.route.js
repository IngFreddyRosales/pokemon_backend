const {requireUser} = require("../middleware/requires-user");
const {checkAdmin} = require("../middleware/check-admin");

module.exports = (app) => {

    let router = require("express").Router();
    const controller = require("../controller/nature.controller");

    router.post("/createNature", requireUser, checkAdmin, controller.createNature);
    router.get("/", requireUser, controller.getAllNatures);
    router.get("/:id", requireUser, controller.getNatureById);
    router.patch("/updateNature/:id", requireUser, checkAdmin, controller.updateNAture);
    router.delete("/deleteNature/:id", requireUser, checkAdmin, controller.deleteNature);


    router.get("/getAllNatures", requireUser, controller.getAllNatures);

    app.use("/nature", router);
}