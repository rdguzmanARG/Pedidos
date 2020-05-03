const mongoose = require("mongoose");

const schema = mongoose.Schema(
  {
    _id: mongoose.Schema.Types.ObjectId,
    dia: {
      type: Date,
      required: true,
    },
    hora: {
      type: String,
      required: true,
    },
    idPedido: { type: mongoose.Schema.Types.ObjectId, ref: "Pedido" },
  },
  {
    timestamps: true,
  }
);

module.exports = mongoose.model("Turno", schema);
