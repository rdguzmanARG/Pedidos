const mongoose = require("mongoose");

const userSchema = mongoose.Schema({
  _id: mongoose.Schema.Types.ObjectId,
  username: { type: String, required: true, unique: true },
  password: { type: String, required: true },
  isSysAdmin: { type: Boolean, default: false },
  isAdmin: { type: Boolean, default: false },
  isAdminPed: { type: Boolean, default: false },
});

module.exports = mongoose.model("User", userSchema);
