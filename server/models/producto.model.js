const mongoose = require("mongoose");

const schema = mongoose.Schema(
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

module.exports = mongoose.model("Producto", schema);
