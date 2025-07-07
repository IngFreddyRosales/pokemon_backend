const { requireUser } = require("../middleware/requires-user");
const { checkAdmin } = require("../middleware/check-admin");

module.exports = (app) => {

    let router = require("express").Router();
    const controller = require("../controller/user.controller");

    router.get("/", requireUser,checkAdmin, controller.findAll);
    router.put("/:id", requireUser, checkAdmin, controller.updateUser);



    app.use("/users", router);
}