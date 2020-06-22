const mongoose = require("mongoose");

const schema = mongoose.Schema(
  {
    _id: mongoose.Schema.Types.ObjectId,
    nombre: {
      type: String,
      required: true,
    },
    ingredientes: {
      type: String,
    },
    preparacion: {
      type: String,
    }  
  },
  {
    timestamps: true,
  }
);

module.exports = mongoose.model("Receta", schema);
