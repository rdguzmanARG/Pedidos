const router = require("express").Router();
const checkAuth = require("../middleware/check-auth");
const admin = require("../middleware/admin");
const controller = require("../controllers/entregas");

router.get("/", checkAuth, controller.entregas_get_all);
router.get("/get-current", checkAuth, controller.entregas_get_current);
router.put("/:idEntrega", checkAuth, controller.entregas_update_entrega);

module.exports = router;
