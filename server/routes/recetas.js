const router = require("express").Router();
const checkAuth = require("../middleware/check-auth");
const controller = require("../controllers/recetas");
const admin = require("../middleware/admin");

router.get("/", checkAuth, controller.recetas_get_all);
router.post("/",
  [checkAuth, admin],
  controller.recetas_create_receta
);
router.put(
  "/:idReceta",
  [checkAuth, admin],
  controller.recetas_update_receta
);
router.delete(
  "/:idReceta",
  [checkAuth, admin],
  controller.recetas_delete_receta
);

module.exports = router;
router.get("/:idReceta", controller.recetas_get);