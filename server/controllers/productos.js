let Producto = require("../models/producto.model");
let Pedido = require("../models/pedido.model");

exports.productos_get_all = (req, res) => {
  Producto.find()
    .select("_id nombre precio cantidad anulado")
    .then(productos => res.status(200).json(productos))
    .catch(err => res.status(500).json({ Error: err }));
};

exports.productos_get_producto = (req, res) => {
  Producto.findById(req.params.idProducto)
    .select("_id nombre precio anulado cantidad")
    .then(producto => {
      if (producto) {
        Pedido.find({ "items.producto": producto._id.toString() })
          .select("_id nombre apellido entregado")
          .then(pedidos => {
            res.status(200).json({ producto, pedidos: pedidos });
          })
          .catch(err => res.status(500).json({ error: err }));
      } else {
        res.status(404).json({ message: "Producto inexistente." });
      }
    })
    .catch(err => res.status(500).json("Error: " + err));
};

exports.productos_update_producto = (req, res) => {
  Producto.findByIdAndUpdate(req.params.idProducto, req.body)
    .then(producto => res.json(producto))
    .catch(err => res.status(500).json("Error: " + err));
};
