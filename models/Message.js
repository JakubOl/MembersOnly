const mongoose = require("mongoose");
const Schema = mongoose.Schema;

const MessageSchema = mongoose.Schema(
  {
    user: { type: Schema.Types.ObjectId, ref: "User", required: true },
    title: { type: String, required: true },
    text: { type: String, required: true },
  },
  { timestamps: true }
);
MessageSchema.virtual("formated_date").get(function () {
  return this.createdAt.toLocaleString("en-GB");
});

module.exports = mongoose.model("Message", MessageSchema);
