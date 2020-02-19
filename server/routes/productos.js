const router = require("express").Router();
const fetch = require("node-fetch");
let Producto = require("../models/producto.model");

router.get("/", (req, res) => {
  Producto.find()
    .select("_id nombre precio")
    .then(productos => res.status(200).json(productos))
    .catch(err => res.status(500).json({ Error: err }));
});

router.get("/:idProducto", (req, res) => {
  Producto.findById(req.params.idProducto)
    .select("_id nombre precio")
    .then(producto => {
      if (producto) {
        res.status(200).json(producto);
      } else {
        res.status(404).json({ message: "Producto inexistente." });
      }
    })
    .catch(err => res.status(500).json("Error: " + err));
});

router.put("/:idProducto", (req, res) => {
  Producto.findByIdAndUpdate(req.params.idProducto, req.body)
    .then(producto => res.json(producto))
    .catch(err => res.status(500).json("Error: " + err));
});

module.exports = router;
