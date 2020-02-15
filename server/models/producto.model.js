const mongoose = require("mongoose");

const Schema = mongoose.Schema;
const productoSchema = new Schema(
  {
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

const Producto = mongoose.model("producto", productoSchema);

module.exports = Producto;
