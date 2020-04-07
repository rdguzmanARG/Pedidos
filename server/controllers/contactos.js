const Contacto = require("../models/contacto.model");
const mongoose = require("mongoose");

exports.contactos_get_all = (req, res) => {
  Contacto.find()
    .select("_id nombre apellido email telefono comentarios")
    .then((contactos) => res.status(200).json(contactos))
    .catch((err) => res.status(500).json({ Error: err }));
};

exports.contactos_post = (req, res, next) => {
  const contacto = new Contacto({
    _id: new mongoose.Types.ObjectId(),
    nombre: req.body.nombre,
    apellido: req.body.apellido,
    email: req.body.email,
    telefono: req.body.telefono,
    comentarios: req.body.comentarios,
  });
  contacto
    .save()
    .then(() => {
      return res.status(201).json({ message: "Mensaje recibido." });
    })
    .catch((err) => {
      return res.status(500).json({ error: err });
    });
};
