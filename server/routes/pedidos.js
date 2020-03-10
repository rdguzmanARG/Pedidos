const router = require("express").Router();
const checkAuth = require("../middleware/check-auth");
const admin = require("../middleware/admin");
const controller = require("../controllers/pedidos");

router.get("/", checkAuth, controller.pedidos_get_all);
router.get("/last/:date", checkAuth, controller.pedidos_get_last);
router.get("/import", [checkAuth, admin], controller.pedidos_import);
router.get("/:idPedido", checkAuth, controller.pedidos_get_pedido);
router.put("/:idPedido", [checkAuth], controller.pedidos_update_pedido);

module.exports = router;
