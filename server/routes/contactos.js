const router = require("express").Router();
const controller = require("../controllers/contactos");

router.post("/", controller.contactos_post);

module.exports = router;
