const mongoose = require("mongoose");

const schema = mongoose.Schema(
  {
    _id: mongoose.Schema.Types.ObjectId,
    nombre: {
      type: String,
      required: true
    },
    apellido: {
      type: String,
      required: true
    },
    email: {
      type: String
    },
    telefono: {
      type: String
    },
    comentarios: {
      type: String
    }
  },
  {
    timestamps: true
  }
);

module.exports = mongoose.model("Contacto", schema);
