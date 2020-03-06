const Entrega = require("../models/entrega.model");
const Pedido = require("../models/pedido.model");

exports.entregas_get_all = (req, res, next) => {
  Entrega.find()
    .sort({ fechaImportacion: -1 })
    //    .select("_id nombre apellido celular entregado usuarioMod")
    .then(entregas => res.status(200).json(entregas))
    .catch(err => res.status(500).json({ error: err }));
};

exports.entregas_get_current = (req, res, next) => {
  // Valida si existe una entrega y se puede importar
  Entrega.findOne()
    .sort({ fechaImportacion: -1 })
    .then(entrega => {
      return res.json(entrega);
    })
    .catch(err => {
      console.log(err);
      res.status(500).json({ error: err });
    });
};

exports.entregas_update_entrega = (req, res) => {
  const entrega = req.body;
  if (entrega.estado === "CER") {
    Pedido.find()
      .then(pedidos => {
        let totalEntrega = 0;
        let totalAlmacen = 0;
        pedidos.map(
          p => (
            (totalEntrega +=
              (p.totalPedido === undefined ? 0 : p.totalPedido) +
              (p.ajuste === undefined ? 0 : p.ajuste)),
            (totalAlmacen += p.totalAlmacen === undefined ? 0 : p.totalAlmacen)
          )
        );
        entrega.totalEntrega = totalEntrega;
        entrega.totalAlmacen = totalAlmacen;
        Entrega.findByIdAndUpdate(req.params.idEntrega, entrega, { new: true })
          .then(entrega => res.json(entrega))
          .catch(err => res.status(500).json("Error: " + err));
      })
      .catch(err => res.status(500).json("Error: " + err));
  } else {
    Entrega.findByIdAndUpdate(req.params.idEntrega, entrega, { new: true })
      .then(entrega => res.json(entrega))
      .catch(err => res.status(500).json("Error: " + err));
  }
};