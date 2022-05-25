const mongoose = require("mongoose");

const UserSchema = mongoose.Schema({
  username: { type: String, required: true },
  password: { type: String, required: true },
  status: { type: Boolean, required: true, default: false },
  admin: { type: Boolean, required: true, default: false },
});

module.exports = mongoose.model("User", UserSchema);
