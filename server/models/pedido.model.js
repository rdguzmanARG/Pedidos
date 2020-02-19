const mongoose = require("mongoose");

const Schema = mongoose.Schema;
const pedidoSchema = new Schema(
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
    celular: {
      type: String
    },
    items: [
      {
        _id: mongoose.Schema.Types.ObjectId,
        cantidad: Number
      }
    ]
  },
  {
    timestamps: true
  }
);

const Pedido = mongoose.model("Pedido", pedidoSchema);

module.exports = Pedido;
