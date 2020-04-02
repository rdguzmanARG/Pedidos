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
    direccion: {
      type: String
    },
    conEntrega: {
      type: Boolean
    },
    items: [
      {
        producto: { type: mongoose.Schema.Types.ObjectId, ref: "Producto" },
        cantidad: Number,
        precio: Number,
        pago: Number
      }
    ],
    entregado: {
      type: Boolean,
      default: false
    },
    comentarios: { type: String },
    ajuste: {
      type: Number
    },
    totalPedido: {
      type: Number
    },
    totalAlmacen: {
      type: Number
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
