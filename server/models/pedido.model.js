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
    date: {
      type: Date
    },
    email: {
      type: String
    },
    celular: {
      type: String
    },
    items: [
      {
        _id: mongoose.Schema.Types.ObjectId,
        cantidad: Number
      }
    ],
    entregado: {
      type: Boolean,
      default: false
    },
    usuarioMod: {
      type: String
    }
  },
  {
    timestamps: true
  }
);

module.exports = mongoose.model("Pedido", schema);
