const router = require("express").Router();
const controller = require("../controllers/users");

const User = require("../models/user.model");

router.post("/signup", controller.users_signup);
router.post("/login", controller.users_login);

module.exports = router;
