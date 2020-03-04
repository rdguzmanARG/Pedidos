const mongoose = require("mongoose");

const schema = mongoose.Schema(
  {
    _id: mongoose.Schema.Types.ObjectId,
    fechaImportacion: {
      type: Date,
      required: true
    },
    cantProductos: {
      type: Number
    },
    cantPedidos: {
      type: Number
    },
    totalEntrega: {
      type: Number,
      defaul: 0
    },
    totalAlmacen: {
      type: Number,
      defaul: 0
    },
    estado: {
      type: String
    },
    usuarioMod: {
      type: String
    }
  },
  {
    timestamps: true
  }
);

module.exports = mongoose.model("Entrega", schema);
