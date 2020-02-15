const mongoose = require("mongoose");

const Schema = mongoose.Schema;
const pedidoSchema = new Schema(
  {
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
    items: {
      type: Array
    }
  },
  {
    timestamps: true
  }
);

const Pedido = mongoose.model("pedido", pedidoSchema);

module.exports = Pedido;
