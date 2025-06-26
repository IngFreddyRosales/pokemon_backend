const { requireUser } = require("../middleware/requires-user");

module.exports = (app) => {

    let router = require("express").Router();
    const controller = require("../controller/auth.controller");

    router.post("/register", controller.register);
    router.post("/login", controller.login);
    router.get("/me", requireUser, controller.me);

    app.use("/auth", router);

}