const router = require("express").Router();
const checkAuth = require("../middleware/check-auth");
const controller = require("../controllers/productos");
const admin = require("../middleware/admin");

router.get("/", checkAuth, controller.productos_get_all);
router.get("/:idProducto", checkAuth, controller.productos_get_producto);
router.put(
  "/:idProducto",
  [checkAuth, admin],
  controller.productos_update_producto
);

module.exports = router;
