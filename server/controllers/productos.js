let Producto = require("../models/producto.model");

exports.productos_get_all = (req, res) => {
  Producto.find()
    .select("_id nombre precio cantidad anulado")
    .then(productos => res.status(200).json(productos))
    .catch(err => res.status(500).json({ Error: err }));
};

exports.productos_get_producto = (req, res) => {
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
};

exports.productos_update_producto = (req, res) => {
  Producto.findByIdAndUpdate(req.params.idProducto, req.body)
    .then(producto => res.json(producto))
    .catch(err => res.status(500).json("Error: " + err));
};
