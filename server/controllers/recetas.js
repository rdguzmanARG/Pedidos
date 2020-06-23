let Receta = require("../models/receta.model");
const mongoose = require("mongoose");
const slash = require('slash');
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
    descripcion: req.body.descripcion,
    ingredientes: req.body.ingredientes,
    preparacion: req.body.preparacion,
    image: req.file ? slash(req.file.path) : null
  });
  receta.save()
    .then((result) =>
      res.status(201).json({ message: "Receta creada." })
    )
    .catch((err) => res.status(500).json({ error: err }));
};

exports.recetas_update_receta = (req, res) => {
  if ((req.body.deleteImage === "true" && req.body.image) || (req.file && req.file.path && req.file.path != req.body.image)) {
    // Borre la imagen previa.
    const fs = require('fs');
    fs.unlink(req.body.image, function (err) {
      if (err && err.code !== "ENOENT") {
        res.status(500).json({ Error: err });
      }
      else {
        if (req.body.deleteImage === "true") {
          req.body.image = null;
        }
        else {
          req.body.image = req.file.path;
        }
        // if no error, file has been deleted successfully
        Receta.findByIdAndUpdate(req.params.idReceta, req.body)
          .then((recetas) => res.status(200).json(recetas))
          .catch((err) => res.status(500).json({ error: err }));
      }
    });
  } else {
    Receta.findByIdAndUpdate(req.params.idReceta, req.body)
      .then((recetas) => res.status(200).json(recetas))
      .catch((err) => res.status(500).json({ error: err }));
  }
};

exports.recetas_delete_receta = (req, res) => {

  Receta.findById(req.params.idReceta).then((data) => {
    if (data.image) {
      const fs = require('fs');
      // Primero borra la imagen
      fs.unlink(data.image, function (err) {
        if (err && err.code !== "ENOENT") {
          res.status(500).json({ err });
        }
        else {
          // if no error, file has been deleted successfully
          Receta.findByIdAndDelete(req.params.idReceta)
            .then((recetas) => res.status(200).json(recetas))
            .catch((err) => res.status(500).json({ error: err }));
        }
      });
    } else {
      Receta.findByIdAndDelete(req.params.idReceta)
        .then((recetas) => res.status(200).json(recetas))
        .catch((err) => res.status(500).json({ error: err }));
    }
  }).then(() => res.status(200).json({ "message": "Receta eliminada." }))

};
