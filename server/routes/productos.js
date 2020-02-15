const router = require("express").Router();
const fetch = require("node-fetch");
let Producto = require("../models/producto.model");

router.route("/").get((req, res) => {
  Producto.find()
    .then(productos => res.json(productos))
    .catch(err => res.status(400).json("Error: " + err));
});

router.route("/:idProducto").get((req, res) => {
  Producto.findById(req.params.idProducto)
    .then(producto => res.json(producto))
    .catch(err => res.status(400).json("Error: " + err));
});

router.route("/:idProducto").put((req, res) => {
  Producto.findByIdAndUpdate(req.params.idProducto, req.body)
    .then(producto => res.json(producto))
    .catch(err => res.status(400).json("Error: " + err));
});

module.exports = router;
