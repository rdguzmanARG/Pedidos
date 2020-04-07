const router = require("express").Router();
const controller = require("../controllers/contactos");
const checkAuth = require("../middleware/check-auth");
const sysAdmin = require("../middleware/sysadmin");

router.get("/", [checkAuth, sysAdmin], controller.contactos_get_all);
router.post("/", controller.contactos_post);

module.exports = router;
