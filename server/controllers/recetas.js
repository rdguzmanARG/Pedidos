let Receta = require("../models/receta.model");
const mongoose = require("mongoose");

exports.recetas_get_all = (req, res) => {
  Receta.find()
    .then((recetas) => res.status(200).json(recetas))
    .catch((err) => res.status(500).json({ Error: err }));
};

exports.recetas_get = (req, res) => {
  Receta.findById(req.params.idReceta)
    .then((recetas) => res.status(200).json(recetas))
    .catch((err) => res.status(500).json({ Error: err }));
};

exports.recetas_create_receta = (req, res) => {
  const receta = new Receta({
    _id: new mongoose.Types.ObjectId(),
    nombre: req.body.nombre,
    ingredientes: req.body.ingredientes
  });
  receta.save()
    .then((result) =>
      res.status(201).json({ message: "Receta creada." })
    )
    .catch((err) => res.status(500).json({ error: err }));
};

exports.recetas_update_receta = (req, res) => {

  Receta.findByIdAndUpdate(req.params.idReceta, req.body)
    .then((recetas) => res.status(200).json(recetas))
    .catch((err) => res.status(500).json({ Error: err }));
};

exports.recetas_delete_receta = (req, res) => {

  Receta.findByIdAndDelete(req.params.idReceta)
    .then((recetas) => res.status(200).json(recetas))
    .catch((err) => res.status(500).json({ Error: err }));
};
