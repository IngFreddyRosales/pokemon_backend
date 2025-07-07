const {requireUser} = require("../middleware/requires-user");
const {checkAdmin} = require("../middleware/check-admin");

module.exports = (app) => {

    let router = require("express").Router();
    const controller = require("../controller/item.controller");

    router.post("/createItem", requireUser, checkAdmin, controller.createItem);
    router.get("/", requireUser, controller.getAllItems);
    router.get("/:id", requireUser, controller.getItemById);
    router.put("/updateItem/:id", requireUser, checkAdmin, controller.updateItem);
    router.delete("/deleteItem/:id", requireUser, checkAdmin, controller.deleteItem);

        router.get("/getAllItems", requireUser, controller.getAllItems);


    app.use("/item", router);
}