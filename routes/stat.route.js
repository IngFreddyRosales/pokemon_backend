const {requireUser} = require("../middleware/requires-user");
const {checkAdmin} = require("../middleware/check-admin");

module.exports = (app) => {

    let router = require("express").Router();
    const controller = require("../controller/stat.controller");

    router.post("/createStat", requireUser, checkAdmin, controller.createStat);
    router.get("/", requireUser, checkAdmin, controller.getAllStats);
    router.put("/updateStat/:id", requireUser, checkAdmin, controller.updateStat);
    router.delete("/deleteStat/:id", requireUser, checkAdmin, controller.deleteStat);

    app.use("/stat", router);
}