const mongoose = require("mongoose");

const messageSchema = new mongoose.Schema(
  {
    sender: { type: mongoose.Schema.Types.ObjectId, ref: "User" },
    recipient: { type: mongoose.Schema.Types.ObjectId, ref: "User" },
    group: { type: mongoose.Schema.Types.ObjectId, ref: "Group" },
    text: { type: String, required: true },
    seen_by: [{ type: mongoose.Schema.Types.ObjectId, ref: "User" }],
    type: { type: String, enum: ["user", "group"], required: true },
    createdAt: { type: Date, required: true },
    updatedAt: { type: Date, required: true, default: new Date() },
  },
  { timestamps: true }
);

module.exports = mongoose.model("Message", messageSchema);
