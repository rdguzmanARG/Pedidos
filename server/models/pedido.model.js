const mongoose = require("mongoose");

const Schema = mongoose.Schema;
const pedidoSchema = new Schema(
  {
    nombre: {
      type: String,
      required: true
    }
  },
  {
    timestamps: true
  }
);

const Pedido = mongoose.model("pedido", pedidoSchema);

module.exports = Pedido;
