const mongoose = require("mongoose");

const schema = mongoose.Schema(
  {
    _id: mongoose.Schema.Types.ObjectId,
    nombre: {
      type: String,
      required: true,
    },
    apellido: {
      type: String,
      required: true,
    },
    date: {
      type: Date,
    },
    email: {
      type: String,
    },
    celular: {
      type: String,
    },
    direccion: {
      type: String,
    },
    direccionDetalle: {
      type: String,
    },
    conEntrega: {
      type: Boolean,
    },
    items: [
      {
        producto: { type: mongoose.Schema.Types.ObjectId, ref: "Producto" },
        cantidad: Number,
        precio: Number,
        pago: Number,
      },
    ],
    estado: {
      type: Number,
    },
    comentarios: { type: String },
    totalPedido: {
      type: Number,
    },
    totalAlmacen: {
      type: Number,
    },
    varios: {
      type: Number,
    },
    emailEnviado: {
      type: Number,
    },
    usuarioMod: {
      type: String,
    },
  },
  {
    timestamps: true,
  }
);

module.exports = mongoose.model("Pedido", schema);
