const router = require("express").Router();
const fetch = require("node-fetch");
let Producto = require("../models/producto.model");

router.route("/").get((req, res) => {
  Producto.find()
    .then(productos => res.json(productos))
    .catch(err => res.status(400).json("Error: " + err));
});

module.exports = router;
