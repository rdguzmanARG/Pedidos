const router = require("express").Router();
const fetch = require("node-fetch");
let Producto = require("../models/producto.model");

router.get("/", (req, res) => {
  Producto.find()
    .then(productos => res.status(200).json(productos))
    .catch(err => res.status(400).json("Error: " + err));
});

router.get("/:idProducto", (req, res) => {
  Producto.findById(req.params.idProducto)
    .then(producto => res.json(producto))
    .catch(err => res.status(400).json("Error: " + err));
});

router.put("/:idProducto", (req, res) => {
  Producto.findByIdAndUpdate(req.params.idProducto, req.body)
    .then(producto => res.json(producto))
    .catch(err => res.status(400).json("Error: " + err));
});

module.exports = router;
