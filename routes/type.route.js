const { requireUser } = require("../middleware/requires-user");
const { checkAdmin } = require("../middleware/check-admin");

module.exports = (app) => {
  let router = require("express").Router();
  const controller = require("../controller/type.controller");

  router.post("/createType", requireUser,checkAdmin, controller.createType)
  router.get("/:id", requireUser, controller.findTypeById)
  router.get("/", requireUser, checkAdmin, controller.findAllTypes)
  router.put("/updateType/:id", requireUser,checkAdmin, controller.updateType)
  router.delete("/deleteType/:id", requireUser,checkAdmin, controller.deleteType)

    router.get("/getAllTypes", requireUser, controller.findAllTypes)


  app.use("/type", router);
};
