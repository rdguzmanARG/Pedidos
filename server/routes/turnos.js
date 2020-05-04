const router = require("express").Router();
const controller = require("../controllers/turnos");
const checkAuth = require("../middleware/check-auth");
const sysAdmin = require("../middleware/sysadmin");

router.get("/", controller.turnos_disponibles);
router.put("/:idTurno/anular", controller.turnos_anular);
router.put("/:idTurno", controller.turnos_confirmar);

router.post("/procesar", controller.turnos_procesar);

module.exports = router;
