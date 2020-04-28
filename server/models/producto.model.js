const mongoose = require("mongoose");

const schema = mongoose.Schema(
  {
    _id: mongoose.Schema.Types.ObjectId,
    nombre: {
      type: String,
      required: true,
    },
    cantidad: {
      type: Number,
      default: 0,
    },
    anulado: {
      type: Boolean,
      default: false,
    },
    precio: {
      type: Number,
    },
    almacen: {
      type: Boolean,
    },
  },
  {
    timestamps: true,
  }
);

module.exports = mongoose.model("Producto", schema);
