const router = require("express").Router();
const checkAuth = require("../middleware/check-auth");
const admin = require("../middleware/admin");
const controller = require("../controllers/pedidos");

router.get("/", checkAuth, controller.pedidos_get_all);
router.post(
  "/pending-emails",
  [checkAuth, admin],
  controller.pedido_sendPendingEmails
);
router.get(
  "/pending-emails",
  [checkAuth, admin],
  controller.pedido_getPendingEmails
);

router.post("/notificado", controller.pedido_notificado);
router.get("/last/:date", checkAuth, controller.pedidos_get_last);
router.get("/:email/:code", controller.pedidos_get_pedidoByCode);
router.get("/import", [checkAuth, admin], controller.pedidos_import);
router.get("/:idPedido", controller.pedidos_get_pedido);
router.put("/:idPedido", [checkAuth], controller.pedidos_update_pedido);

module.exports = router;
