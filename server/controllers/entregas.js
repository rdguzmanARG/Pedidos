let Entrega = require("../models/entrega.model");

exports.entregas_get_all = (req, res, next) => {
  Entrega.find()
    //    .select("_id nombre apellido celular entregado usuarioMod")
    .then(entregas => res.status(200).json(entregas))
    .catch(err => res.status(500).json({ error: err }));
};

exports.entregas_get_current = (req, res, next) => {
  // Valida si existe una entrega y se puede importar
  Entrega.findOne()
    .sort({ fechaImportacion: -1 })
    .then(entregas => {
      return res.json(entregas);
    })
    .catch(err => {
      console.log(err);
      res.status(500).json({ error: err });
    });
};

exports.entregas_update_entrega = (req, res) => {
  Entrega.findByIdAndUpdate(req.params.idEntrega, req.body, { new: true })
    .then(entrega => res.json(entrega))
    .catch(err => res.status(500).json("Error: " + err));
};
