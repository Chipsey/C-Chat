const mongoose = require("mongoose");

const messageSchema = new mongoose.Schema(
  {
    sender: { type: mongoose.Schema.Types.ObjectId, ref: "User" },
    recipient: { type: mongoose.Schema.Types.ObjectId, ref: "User" },
    group: { type: mongoose.Schema.Types.ObjectId, ref: "Group" },
    text: { type: String, required: true },
    seen_by: [
      {
        user_id: { type: mongoose.Schema.Types.ObjectId, ref: "User" },
        date: { type: Date },
      },
    ],
    type: { type: String, enum: ["user", "group"], required: true },
  },
  { timestamps: true }
);

module.exports = mongoose.model("Message", messageSchema);
