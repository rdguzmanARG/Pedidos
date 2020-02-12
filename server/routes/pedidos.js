const router = require("express").Router();
let Pedido = require("../models/pedido.model");

router.route("/").get((req, res) => {
  Pedido.find()
    .then(pedidos => res.json(pedidos))
    .catch(err => res.status(400).json("Error: " + err));
});

router.route("/").post((req, res) => {
  const nombre = req.body.nombre;
  const newPedido = new Pedido({ nombre });
  newPedido
    .save()
    .then(() => res.json("Pedido agregado"))
    .catch(err => res.status(400).json("Error: " + err));
});

module.exports = router;
