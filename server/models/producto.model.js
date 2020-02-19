const mongoose = require("mongoose");

const Schema = mongoose.Schema;
const productoSchema = new Schema(
  {
    _id: mongoose.Schema.Types.ObjectId,
    nombre: {
      type: String,
      required: true
    },
    precio: {
      type: Number
    }
  },
  {
    timestamps: true
  }
);

const Producto = mongoose.model("Producto", productoSchema);

module.exports = Producto;
